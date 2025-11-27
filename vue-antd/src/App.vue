<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="game-title">修仙文字游戏</h1>
      <nav class="game-nav">
        <a-button
          type="primary"
          :class="{ active: currentSystem === 'training' }"
          @click="switchSystem('training')"
        >
          修炼系统
        </a-button>
        <a-button
          :class="{ active: currentSystem === 'outdoor' }"
          @click="switchSystem('outdoor')"
        >
          外出系统
        </a-button>
      </nav>
    </header>

    <main class="app-main">
      <!-- 修炼系统 -->
      <TrainingSystem v-if="currentSystem === 'training'" />

      <!-- 外出系统（待开发） -->
      <div v-else-if="currentSystem === 'outdoor'" class="coming-soon">
        <h2>外出系统</h2>
        <p>开发中，敬请期待...</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TrainingSystem from "./components/TrainingSystem.vue";

const currentSystem = ref<"training" | "outdoor">("training");

const switchSystem = (system: "training" | "outdoor") => {
  currentSystem.value = system;
};
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
