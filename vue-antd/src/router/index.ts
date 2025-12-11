import { createRouter, createWebHistory } from "vue-router";
import IndexPage from "@/views/index.vue";
import CombatPage from "@/views/CombatPage.vue";

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: IndexPage,
    },
    {
      path: "/combat",
      name: "combat",
      component: CombatPage,
    },
  ],
});

export default router;
