<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import GameBoard from './components/GameBoard.vue';

// 设计分辨率 - 4:3 宽高比
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1440;

// 容器引用
const gameContainer = ref<HTMLElement | null>(null);
const scale = ref(1);
const offsetY = ref(0);

// 计算缩放比例并应用等比例缩放 - 基于宽度优先，等比缩放，垂直居中
const calculateScale = () => {
  if (!gameContainer.value) return;

  // 获取窗口的实际尺寸
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 计算缩放比例，基于宽度优先，确保宽度充满屏幕
  const newScale = windowWidth / DESIGN_WIDTH;
  // 等比计算高度
  const scaledHeight = DESIGN_HEIGHT * newScale;

  // 垂直居中计算（上下留白）
  const newOffsetY = Math.max(0, (windowHeight - scaledHeight) / 2);

  scale.value = newScale;
  offsetY.value = newOffsetY;
};

// 监听窗口大小变化
onMounted(() => {
  // 立即执行一次
  calculateScale();
  window.addEventListener('resize', calculateScale);
  window.addEventListener('orientationchange', calculateScale);
});

onUnmounted(() => {
  window.removeEventListener('resize', calculateScale);
  window.removeEventListener('orientationchange', calculateScale);
});
</script>

<template>
  <div class="app">
    <!-- 游戏根容器，用于等比例缩放 -->
    <div
      ref="gameContainer"
      class="game-container"
      :style="{
        width: `${DESIGN_WIDTH}px`,
        height: `${DESIGN_HEIGHT}px`,
        transform: `scale(${scale})`,
        left: '0',
        top: `${offsetY}px`,
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

html,
body {
  overflow: hidden;
  background-color: #000;
  width: 100%;
  height: 100%;
}

/* 确保viewport正确设置 */
@viewport {
  width: device-width;
  initial-scale: 1;
  maximum-scale: 1;
  user-scalable: no;
}
</style>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
  position: relative;
  /* 确保app元素占据整个视口 */
  margin: 0;
  padding: 0;
}

.game-container {
  background-color: #1a1a1a;
  position: absolute;
  left: 0;
  top: 0;
  transition: transform 0.3s ease;
  /* 确保游戏容器能完全显示 */
  overflow: hidden;
  /* 以左上角为缩放原点 */
  transform-origin: 0 0;
}
</style>
