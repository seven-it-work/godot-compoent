<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const DESIGN_WIDTH = 2622;
const DESIGN_HEIGHT = 1206;

// 固定为fit模式：完全显示，确保内容完整，不裁剪

// 容器引用
const gameContainer = ref<HTMLElement | null>(null);
const scale = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);

// 计算缩放比例并应用等比例缩放
const calculateScale = () => {
  if (!gameContainer.value) return;

  // 获取窗口的实际尺寸
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 计算设计稿和窗口的宽高比
  const designRatio = DESIGN_WIDTH / DESIGN_HEIGHT;
  const windowRatio = windowWidth / windowHeight;

  let newScale: number;

  // fit 模式：完全显示，确保内容完整，不裁剪
  if (windowRatio > designRatio) {
    // 窗口更宽，基于高度计算缩放比例
    newScale = windowHeight / DESIGN_HEIGHT;
  } else {
    // 窗口更高或等比例，基于宽度计算缩放比例
    newScale = windowWidth / DESIGN_WIDTH;
  }

  // 计算缩放后的尺寸
  const scaledWidth = DESIGN_WIDTH * newScale;
  const scaledHeight = DESIGN_HEIGHT * newScale;

  // 计算居中偏移量
  const newOffsetX = Math.max(0, (windowWidth - scaledWidth) / 2);
  const newOffsetY = Math.max(0, (windowHeight - scaledHeight) / 2);

  scale.value = newScale;
  offsetX.value = newOffsetX;
  offsetY.value = newOffsetY;
};

// 缩放模式固定，不再需要监听变化

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
        left: `${offsetX}px`,
        top: `${offsetY}px`,
      }"
    >
      <router-view />
    </div>

    <!-- 缩放模式固定为fit，移除切换按钮 -->
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
  overflow: auto;
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
  overflow: auto;
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
  overflow: auto;
  /* 以左上角为缩放原点 */
  transform-origin: 0 0;
}
</style>
