import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import CultivationUI from '../pc/components/CultivationUI.vue';
import OutdoorSystem from '../pc/components/OutdoorSystem.vue';
import BattleComponent from '../pc/components/BattleComponent.vue';

// PC端路由
const pcRoutes: RouteRecordRaw[] = [
  {
    path: '/pc',
    redirect: '/pc/training',
    children: [
      {
        path: 'training',
        component: CultivationUI,
        name: 'PCTraining',
      },
      {
        path: 'outdoor',
        component: OutdoorSystem,
        name: 'PCOutdoor',
      },
      {
        path: 'battle',
        component: BattleComponent,
        name: 'PCBattle',
      },
    ],
  },
];

// 移动端路由
const mobileRoutes: RouteRecordRaw[] = [
  {
    path: '/mobile',
    component: () => import('../mobile/index.vue'),
    children: [
      {
        path: 'training',
        component: () => import('../mobile/index.vue'),
        name: 'MobileTraining',
      },
      {
        path: 'outdoor',
        component: () => import('../mobile/index.vue'),
        name: 'MobileOutdoor',
      },
      {
        path: 'battle',
        component: () => import('../mobile/index.vue'),
        name: 'MobileBattle',
      },
      {
        path: 'explore',
        component: () => import('../mobile/探索.vue'),
        name: 'MobileExplore',
      },
      {
        path: '', // 空路径作为默认子路由
        redirect: 'training'
      }
    ],
  },
];

// 基础路由（包含404页面等）
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/pc/training', // 默认重定向到PC端训练系统
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/', // 404页面重定向到首页
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [...pcRoutes, ...mobileRoutes, ...baseRoutes],
});

// 根据屏幕分辨率重定向路由
const redirectByScreenResolution = () => {
  const isMobile = window.innerWidth <= 768;
  const currentPath = router.currentRoute.value.path;
  
  // 检查当前路径是否已经是设备特定路径
  if (currentPath.startsWith('/mobile') || currentPath.startsWith('/pc')) {
    // 如果当前路径的设备类型与实际设备类型不匹配，则重定向
    const currentDevice = currentPath.startsWith('/mobile') ? 'mobile' : 'pc';
    const targetDevice = isMobile ? 'mobile' : 'pc';
    
    if (currentDevice !== targetDevice) {
      // 提取功能路径并构建新路径
      const functionPath = currentPath.replace(`/${currentDevice}`, '');
      const targetPath = `/${targetDevice}${functionPath || '/training'}`;
      router.replace(targetPath);
    }
  } else {
    // 如果是根路径或其他非设备路径，直接重定向到对应设备的训练页面
    const targetPath = isMobile ? '/mobile/training' : '/pc/training';
    router.replace(targetPath);
  }
};

// 监听窗口大小变化，实现响应式路由
window.addEventListener('resize', redirectByScreenResolution);

// 页面加载完成后检查一次设备类型
window.addEventListener('load', redirectByScreenResolution);

// 路由守卫，简化为只检查是否需要重定向到正确的设备路径
router.beforeEach((to, _from, next) => {
  const isMobile = window.innerWidth <= 768;
  const targetDevice = isMobile ? 'mobile' : 'pc';
  
  // 如果访问的是根路径，直接重定向到对应设备的训练页面
  if (to.path === '/') {
    next(`/${targetDevice}/training`);
    return;
  }
  
  // 如果访问的是设备特定路径，检查是否与实际设备类型匹配
  if (to.path.startsWith('/mobile') || to.path.startsWith('/pc')) {
    const currentDevice = to.path.startsWith('/mobile') ? 'mobile' : 'pc';
    
    if (currentDevice !== targetDevice) {
      // 重定向到正确设备的相同功能页面
      const functionPath = to.path.replace(`/${currentDevice}`, '');
      next(`/${targetDevice}${functionPath}`);
      return;
    }
  }
  
  // 其他情况正常跳转
  next();
});

export default router;
