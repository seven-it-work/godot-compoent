import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// PC端路由
const pcRoutes: RouteRecordRaw[] = [
  {
    path: "/pc",
    // 添加组件支持，让 /pc 路径可以直接访问
    redirect: "/mobile",
  },
];

// 移动端路由
const mobileRoutes: RouteRecordRaw[] = [
  {
    path: "/mobile",
    component: () => import("../mobile/index.vue"),
    children: [
      {
        path: "", // 默认子路由
        redirect: "/mobile/start", // 重定向到开始游戏页面
      },
      {
        path: "start",
        name: "MobileStart",
        component: () => import("../mobile/开始游戏.vue"), // 为start路由添加组件
      },
      {
        path: "battle",
        component: () => import("../mobile/战斗.vue"),
        name: "MobileBattle",
      },
      {
        path: "explore",
        component: () => import("../mobile/探索.vue"),
        name: "MobileExplore",
      },
      {
        path: "player-detail",
        component: () => import("../mobile/玩家详情.vue"),
        name: "MobilePlayerDetail",
      },
    ],
  },
];

// 基础路由（包含404页面等）
const baseRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/mobile/start", // 默认重定向到移动端开始游戏页面
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/", // 404页面重定向到首页
  },
];

// 创建路由实例
const router = createRouter({
  // 设置基础路径，适配 GitHub Pages 部署
  history: createWebHistory("/temp_html/"),
  routes: [...pcRoutes, ...mobileRoutes, ...baseRoutes],
});

// 根据屏幕分辨率重定向路由
const redirectByScreenResolution = () => {
  // 这段代码被注释掉了，因为它可能导致路由循环
  // const isMobile = window.innerWidth <= 768;
  // const currentPath = router.currentRoute.value.path;

  // // 检查当前路径是否已经是设备特定路径
  // if (currentPath.startsWith("/mobile") || currentPath.startsWith("/pc")) {
  //   // 如果当前路径的设备类型与实际设备类型不匹配，则重定向
  //   const currentDevice = currentPath.startsWith("/mobile") ? "mobile" : "pc";
  //   const targetDevice = isMobile ? "mobile" : "pc";

  //   if (currentDevice !== targetDevice) {
  //     // 提取功能路径并构建新路径
  //     const functionPath = currentPath.replace(`/${currentDevice}`, "");
  //     // 移动端重定向到根路径而不是训练页面
  //     const targetPath = `/${targetDevice}${functionPath || "/"}`;
  //     router.replace(targetPath);
  //   }
  // } else {
  //   // 如果是根路径或其他非设备路径，重定向到对应设备的根路径
  //   const targetPath = isMobile ? "/mobile/" : "/pc/training";
  //   router.replace(targetPath);
  // }
};

// 监听窗口大小变化，实现响应式路由
window.addEventListener("resize", redirectByScreenResolution);

// 页面加载完成后检查一次设备类型
window.addEventListener("load", redirectByScreenResolution);

// 路由守卫，移除可能导致循环的设备类型检查
// 设备类型检查已经在组件内部处理，不需要在路由守卫中进行
router.beforeEach((_to, _from, next) => {
  // 如果访问的是移动端非开始页面，不需要在路由守卫中检查游戏状态
  // 游戏状态检查已经在index.vue组件内部处理
  next();
});

export default router;
