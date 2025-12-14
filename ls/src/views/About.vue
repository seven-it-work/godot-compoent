<template>
  <div class="about">
    <h1>关于游戏</h1>
    <p>这是一个基于Vue 3开发的卡牌游戏项目。</p>
    <p>使用了以下技术栈：</p>
    <ul>
      <li>Vue 3</li>
      <li>TypeScript</li>
      <li>Pinia（状态管理）</li>
      <li>Ant Design Vue（UI组件库）</li>
      <li>Vue Router（路由管理）</li>
    </ul>
    <router-link to="/game">返回游戏</router-link>
  </div>
</template>

<script setup lang="ts">
// About组件逻辑
</script>

<style scoped>
.about {
  padding: 20px;
  color: white;
  text-align: center;
}

.about ul {
  list-style: none;
  padding: 0;
}

.about li {
  margin: 10px 0;
}

.about a {
  color: #4caf50;
  text-decoration: none;
}

.about a:hover {
  text-decoration: underline;
}
</style>
