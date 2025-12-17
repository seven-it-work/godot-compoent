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
    path: '/game-index',
    name: '游戏首页',
    component: () => import('../views/GameIndex.vue'),
  },
  {
    path: '/game-view',
    name: '游戏视图',
    component: () => import('../views/GameView.vue'),
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

  {
    path: '/phaser-game',
    name: 'Phaser卡牌游戏',
    component: () => import('../components/PhaserCardGame.vue'),
  },
  {
    path: '/vertical-hearthstone',
    name: '竖屏炉石游戏',
    component: () => import('../views/ls/index.vue'),
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
