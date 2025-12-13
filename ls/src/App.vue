<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import GameBoard from './components/GameBoard.vue';

// 设计分辨率 - 游戏的原始设计尺寸
const DESIGN_WIDTH = 2000;
const DESIGN_HEIGHT = 1500;

// 容器引用
const gameContainer = ref<HTMLElement | null>(null);
const scale = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);

// 计算缩放比例并应用
const calculateScale = () => {
  if (!gameContainer.value) return;

  // 获取窗口的实际尺寸
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 总是以宽度为基准进行缩放，确保游戏宽度充满整个窗口
  let newScale = windowWidth / DESIGN_WIDTH;

  // 计算垂直居中偏移量
  const scaledHeight = DESIGN_HEIGHT * newScale;
  const newOffsetY = Math.max(0, (windowHeight - scaledHeight) / 2);

  scale.value = newScale;
  offsetX.value = 0; // 宽度充满，水平偏移为0
  offsetY.value = newOffsetY;
};

// 监听窗口大小变化
onMounted(() => {
  calculateScale();
  window.addEventListener('resize', calculateScale);
});

onUnmounted(() => {
  window.removeEventListener('resize', calculateScale);
});
</script>

<template>
  <div class="app">
    <!-- 游戏根容器，用于等比例缩放 -->
    <div
      ref="gameContainer"
      class="game-container"
      :style="{
        transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
        transformOrigin: 'top left',
        width: `${DESIGN_WIDTH}px`,
        height: `${DESIGN_HEIGHT}px`,
      }"
    >
      <GameBoard />
    </div>
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
  background-color: #000;
}
</style>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
}

.game-container {
  background-color: #1a1a1a;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease;
}
</style>
