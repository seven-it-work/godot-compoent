<template>
  <div>
    <span>{{ formattedTime }}</span>
    <a-row style="display: flex; align-items: center">
      <a-col :span="4">
        <a-button
          @click="togglePause"
          type="primary"
          :disabled="!isGameTimeReady"
        >
          {{ isPaused ? "继续" : "暂停" }}
        </a-button>
      </a-col>
      <a-col :span="3"> {{ timeScale }}倍速 </a-col>
      <a-col :span="17">
        <a-slider
          v-model:value="timeScale"
          :min="1"
          :max="500"
          :disabled="!isGameTimeReady"
          @change="updateTimeScale"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useTimeSystemStore } from "@/stores/timeSystem";

// 获取时间系统状态管理Store
const timeSystemStore = useTimeSystemStore();

// 计算属性
const formattedTime = computed(() => timeSystemStore.getFormattedTime());
const isPaused = computed(() => {
  const gameTime = timeSystemStore.getGameTimeInstance();
  return gameTime?.isPaused || false;
});
// 从store获取游戏时间是否就绪
const isGameTimeReady = computed(() => timeSystemStore.isGameTimeReady);
// 从store获取时间流速
const timeScale = computed({
  get: () => timeSystemStore.timeScale,
  set: (value) => timeSystemStore.updateTimeScale(value),
});

// 切换暂停/继续
const togglePause = () => {
  timeSystemStore.togglePause();
};

// 更新时间流速
const updateTimeScale = (value: number | null) => {
  timeSystemStore.updateTimeScale(value);
};

// 游戏时间更新函数
let updateInterval: number | null = null;
const updateGameTime = () => {
  const gameTime = timeSystemStore.getGameTimeInstance();
  if (gameTime) {
    gameTime.update();
    // 无需手动更新formattedTime，因为它是基于store的计算属性
  }
};

onMounted(() => {
  // 如果游戏时间实例未初始化，则初始化
  if (!timeSystemStore.isGameTimeReady) {
    timeSystemStore.initGameTime();
  }

  // 启动游戏时间更新定时器
  updateInterval = window.setInterval(updateGameTime, 1000);
});

onUnmounted(() => {
  // 清理定时器
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>

<style scoped></style>
