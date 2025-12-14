<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

// 设计分辨率 - 4:3 宽高比
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1440;

// 缩放模式：
// fit（完全显示，留边）
// fill（充满屏幕，可能裁剪）
// width-fill（宽度填充，高度按比例缩放）
const mode = ref<'fit' | 'fill' | 'width-fill'>('fit');

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

  if (mode.value === 'fit') {
    // fit 模式：完全显示，确保内容完整，不裁剪
    if (windowRatio > designRatio) {
      // 窗口更宽，基于高度计算缩放比例
      newScale = windowHeight / DESIGN_HEIGHT;
    } else {
      // 窗口更高或等比例，基于宽度计算缩放比例
      newScale = windowWidth / DESIGN_WIDTH;
    }
  } else if (mode.value === 'fill') {
    // fill 模式：充满屏幕，可能裁剪
    if (windowRatio > designRatio) {
      // 窗口更宽，基于宽度计算缩放比例（可能裁剪高度）
      newScale = windowWidth / DESIGN_WIDTH;
    } else {
      // 窗口更高或等比例，基于高度计算缩放比例（可能裁剪宽度）
      newScale = windowHeight / DESIGN_HEIGHT;
    }
  } else {
    // width-fill 模式：宽度填充屏幕，高度按比例缩放
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

// 监听模式变化，重新计算缩放比例
watch(mode, () => {
  calculateScale();
});

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

    <!-- 缩放模式切换按钮 -->
    <div class="mode-switcher">
      <button @click="mode = 'fit'" :class="{ active: mode === 'fit' }">Fit Mode</button>
      <button @click="mode = 'fill'" :class="{ active: mode === 'fill' }">Fill Mode</button>
      <button @click="mode = 'width-fill'" :class="{ active: mode === 'width-fill' }">
        Width Fill Mode
      </button>
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

.mode-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  gap: 10px;
}

.mode-switcher button {
  padding: 8px 16px;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-switcher button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.mode-switcher button.active {
  background-color: #1890ff;
  border-color: #1890ff;
}
</style>
