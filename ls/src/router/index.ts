import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// 定义路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: '首页',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/game-index',
    name: '游戏首页',
    component: () => import('../views/GameIndex.vue'),
  },
  {
    path: '/test_idex',
    name: '测试首页',
    component: () => import('../views/test_index.vue'),
  },
  {
    path: '/game',
    name: '游戏',
    component: () => import('../components/GameBoard.vue'),
  },
  {
    path: '/about',
    name: '关于',
    component: () => import('../views/About.vue'),
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
