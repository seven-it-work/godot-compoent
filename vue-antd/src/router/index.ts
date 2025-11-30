import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import CultivationUI from '../pc/components/CultivationUI.vue';
import OutdoorSystem from '../pc/components/OutdoorSystem.vue';
import BattleComponent from '../pc/components/BattleComponent.vue';

// PC端路由
const pcRoutes: RouteRecordRaw[] = [
  {
    path: '/pc',
    // 添加组件支持，让 /pc 路径可以直接访问
    component: { template: '<router-view />' },
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
        path: 'battle',
        component: () => import('../mobile/战斗.vue'),
        name: 'MobileBattle',
      },
      {
        path: 'explore',
        component: () => import('../mobile/探索.vue'),
        name: 'MobileExplore',
      },
      {
        path: 'player-detail',
        component: () => import('../mobile/玩家详情.vue'),
        name: 'MobilePlayerDetail',
      },
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
  // 设置基础路径，适配 GitHub Pages 部署
  history: createWebHistory('/temp_html/'),
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
      // 移动端重定向到根路径而不是训练页面
      const targetPath = `/${targetDevice}${functionPath || '/'}`;
      router.replace(targetPath);
    }
  } else {
    // 如果是根路径或其他非设备路径，重定向到对应设备的根路径
    const targetPath = isMobile ? '/mobile/' : '/pc/training';
    router.replace(targetPath);
  }
};

// 监听窗口大小变化，实现响应式路由
window.addEventListener('resize', redirectByScreenResolution);

// 页面加载完成后检查一次设备类型
window.addEventListener('load', redirectByScreenResolution);

// 路由守卫，简化为只检查是否需要重定向到正确的设备路径
// 路由守卫，添加移动端游戏状态检查
router.beforeEach((to, _from, next) => {
  const isMobile = window.innerWidth <= 768;
  const targetDevice = isMobile ? 'mobile' : 'pc';
  
  // 如果访问的是根路径，根据设备类型决定重定向目标
  if (to.path === '/') {
    next(`/${targetDevice}/`); // 移动端重定向到开始页面，PC端保持原逻辑
    return;
  }
  
  // 移动端特殊处理：如果访问的是移动端非开始页面，需要确保游戏已初始化
  if (to.path.startsWith('/mobile') && to.path !== '/mobile/' && to.path !== '/mobile/start') {
    // 注意：在路由守卫中我们不能直接访问Pinia store
    // 但我们可以在index.vue组件内部进行状态检查
    // 这里只进行基本的路径重定向
    next();
    return;
  }
  
  // 设备类型匹配检查
  if (to.path.startsWith('/mobile') || to.path.startsWith('/pc')) {
    const currentDevice = to.path.startsWith('/mobile') ? 'mobile' : 'pc';
    
    if (currentDevice !== targetDevice) {
      // 重定向到正确设备的对应页面
      const functionPath = to.path.replace(`/${currentDevice}`, '');
      // 移动端重定向到对应设备的根路径，而不是直接到训练页面
      const targetPath = `/${targetDevice}${functionPath || '/'}`;
      next(targetPath);
      return;
    }
  }
  
  // 其他情况正常跳转
  next();
});

export default router;



