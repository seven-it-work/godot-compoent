import { createRouter, createWebHistory } from 'vue-router';
import IndexPage from '@/views/index.vue';

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexPage
    },
  ]
});

export default router;
