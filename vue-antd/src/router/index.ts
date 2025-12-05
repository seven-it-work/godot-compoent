import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// 基础路由（包含404页面等）
const baseRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/docs/introduction", // 根路径重定向到文档首页
  },
  {
    path: "/docs",
    component: () => import("@/views/docs/index.vue"),
    name: "Docs",
    children: [
      { path: "", redirect: "/docs/introduction" } as RouteRecordRaw,
      { path: "introduction", component: () => import("@/views/docs/introduction.vue"), name: "Introduction" } as RouteRecordRaw,
      // 修仙者组件文档
      { path: "cultivator-components", component: () => import("@/views/docs/cultivator-components/index.vue"), name: "CultivatorComponents" } as RouteRecordRaw,
      { path: "cultivator-components/cultivatorInfoCard", component: () => import("@/views/docs/cultivator-components/cultivatorInfoCard.vue"), name: "CultivatorInfoCard" } as RouteRecordRaw,
      { path: "cultivator-components/cultivatorAttributePanel", component: () => import("@/views/docs/cultivator-components/cultivatorAttributePanel.vue"), name: "CultivatorAttributePanel" } as RouteRecordRaw,
      { path: "cultivator-components/cultivatorActions", component: () => import("@/views/docs/cultivator-components/cultivatorActions.vue"), name: "CultivatorActions" } as RouteRecordRaw,
      { path: "cultivator-components/cultivationMethodsPanel", component: () => import("@/views/docs/cultivator-components/cultivationMethodsPanel.vue"), name: "CultivationMethodsPanel" } as RouteRecordRaw,
      { path: "cultivator-components/spiritRootDetails", component: () => import("@/views/docs/cultivator-components/spiritRootDetails.vue"), name: "SpiritRootDetails" } as RouteRecordRaw,
    ] as RouteRecordRaw[]
  },
];

// 创建路由实例
const router = createRouter({
  // 设置基础路径，适配 GitHub Pages 部署
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [ ...baseRoutes],
});
export default router;