import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

// 定义路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: '首页',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/vertical-hearthstone',
    name: '竖屏炉石游戏',
    component: () => import('../views/ls/index.vue'),
  },
  {
    path: '/battle-scene-test',
    name: '战斗场景测试',
    component: () => import('../views/ls/components/BattleSceneTest.vue'),
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
