<template>
  <div class="home">
    <h1>首页</h1>
    <p>欢迎使用我们的应用！请选择以下页面：</p>

    <div class="nav-buttons">
      <router-link
        v-for="route in navigationRoutes"
        :key="route.path"
        :to="route.path"
        class="nav-button"
      >
        {{ route.name }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

// 获取路由实例
const router = useRouter();

// 从路由配置中提取导航路由（过滤掉默认路由）
const navigationRoutes = router.options.routes.filter(route => {
  // 只显示有名称且不是重定向的路由
  return route.name && !route.redirect;
});
</script>

<style scoped>
.home {
  padding: 20px;
  color: white;
  text-align: center;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.nav-button {
  padding: 12px 24px;
  font-size: 18px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-width: 150px;
  text-align: center;
}

.nav-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
