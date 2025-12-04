import { createRouter, createWebHistory } from 'vue-router';
import TestPage from '@/views/TestPage.vue';

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/test'
    },
    {
      path: '/test',
      name: 'test',
      component: TestPage
    }
  ]
});

export default router;
