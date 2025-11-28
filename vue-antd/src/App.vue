<template>
  <div class="app-container">
    <main class="app-main">
      <!-- 路由视图组件 -->
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useGameStore } from "./store/gameStore";

const gameStore = useGameStore();

// 初始化游戏
onMounted(() => {
  gameStore.initGame();
});
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
}

.game-title {
  font-size: 32px;
  color: #1890ff;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.game-nav {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.game-nav .active {
  background-color: #1890ff;
  border-color: #1890ff;
}

.app-main {
  min-height: 600px;
}

.coming-soon {
  text-align: center;
  padding: 100px 20px;
  color: #666;
}

.coming-soon h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-container {
    padding: 10px;
  }

  .game-title {
    font-size: 24px;
  }

  .game-nav {
    flex-direction: column;
    align-items: center;
  }

  .game-nav a-button {
    width: 100%;
    max-width: 200px;
  }
}
</style>
