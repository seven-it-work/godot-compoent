<template>
  <div class="game-index">
    <h1>游戏首页</h1>
    <p>这是游戏的主页面。</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
// GameIndex 组件逻辑
</script>

<style scoped>
.game-index {
  padding: 20px;
  color: white;
  text-align: center;
}

.game-index a {
  color: #4caf50;
  text-decoration: none;
}

.game-index a:hover {
  text-decoration: underline;
}
</style>
