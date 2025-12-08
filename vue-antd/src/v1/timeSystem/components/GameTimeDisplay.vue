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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { getGameTimeInstance } from "@/v1/timeSystem/index.ts";
import type { GameTime } from "@/v1/timeSystem/define.ts";

// 游戏时间实例
const gameTime = ref<GameTime | null>(null);
// 格式化时间
const formattedTime = ref("");
// 时间流速
const timeScale = ref(1);
// 是否准备就绪
const isGameTimeReady = ref(false);

// 计算属性
const isPaused = computed(() => gameTime.value?.isPaused || false);

// 更新时间显示
const updateTimeDisplay = () => {
  if (gameTime.value) {
    formattedTime.value = gameTime.value.getFormattedTime();
  }
};

// 切换暂停/继续
const togglePause = () => {
  if (!gameTime.value) return;

  if (gameTime.value.isPaused) {
    gameTime.value.resume();
  } else {
    gameTime.value.pause();
  }
};

// 更新时间流速
const updateTimeScale = (value: number | null) => {
  if (gameTime.value && value !== null) {
    gameTime.value.setTimeScale(value);
  }
};

// 游戏时间更新函数
let updateInterval: number | null = null;
const updateGameTime = () => {
  if (gameTime.value) {
    gameTime.value.update();
    updateTimeDisplay();
  }
};

onMounted(() => {
  // 初始化游戏时间实例
  gameTime.value = getGameTimeInstance(timeScale.value);
  isGameTimeReady.value = true;

  // 设置初始时间流速
  if (gameTime.value) {
    gameTime.value.setTimeScale(timeScale.value);
    updateTimeDisplay();
  }

  // 启动游戏时间更新定时器
  updateInterval = window.setInterval(updateGameTime, 100);
});

onUnmounted(() => {
  // 清理定时器
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>

<style scoped></style>
