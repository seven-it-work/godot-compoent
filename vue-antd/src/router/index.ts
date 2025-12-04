import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/docs/index.vue';
import CultivatorDocs from '@/views/docs/修仙者组件文档.vue';
import SpiritRootDocs from '@/views/docs/灵根组件文档.vue';

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/docs',
      name: 'docs',
      component: HomePage
    },
    {
      path: '/cultivator-docs',
      name: 'cultivator-docs',
      component: CultivatorDocs
    },
    {
      path: '/spirit-root-docs',
      name: 'spirit-root-docs',
      component: SpiritRootDocs
    }
  ]
});

export default router;
