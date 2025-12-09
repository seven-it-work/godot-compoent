<template>
  <div class="map-container">
    <h2>地图系统</h2>
    <div class="map-info">
      <p>当前位置: ({{ currentMap.currentX }}, {{ currentMap.currentY }})</p>
      <p>地图尺寸: {{ currentMap.width }}x{{ currentMap.height }}</p>
      <a-button
        type="primary"
        @click="toggleAutoMove"
        :disabled="currentMap.path.length <= 1"
      >
        {{ currentMap.path.length }}
        {{ isAutoMoving ? "停止移动" : "开始自动移动" }}
      </a-button>
      <a-button @click="clearPath">清除路径</a-button>
      <a-button @click="resetMap">重置地图</a-button>
    </div>
    <div
      class="map-grid"
      :style="{
        width: `${currentMap.width * gridSize}px`,
        height: `${currentMap.height * gridSize}px`,
      }"
    >
      <div
        v-for="(row, y) in currentMap.grid"
        :key="`row-${y}`"
        class="map-row"
      >
        <div
          v-for="(grid, x) in row"
          :key="`grid-${x}-${y}`"
          class="map-cell"
          :style="{
            width: `${gridSize}px`,
            height: `${gridSize}px`,
            backgroundColor: getCellColor(grid, x, y),
            border: getCellBorder(grid, x, y),
          }"
          @click="handleCellClick(x, y)"
        >
          <div class="cell-content">
            <div class="cell-position">({{ x }}, {{ y }})</div>
            <div class="cell-location">{{ grid.location.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, onUnmounted } from "vue";
import { mapManager } from "../impl";
import type { MapGrid } from "../define";

// 地图配置
const gridSize = 80; // 每个格子的像素大小

// 当前地图（响应式对象）
const currentMap = reactive(mapManager.getCurrentMap());

// 监听地图实例变化
watch(
  () => mapManager.getCurrentMap(),
  (newMap) => {
    Object.assign(currentMap, newMap);
  },
  { deep: true }
);

// 自动移动状态
const isAutoMoving = ref(false);
// 移动间隔时间（毫秒）
const moveInterval = ref<number | null>(null);
// 移动速度（毫秒/格）
const moveSpeed = ref(500);

/**
 * 获取格子颜色
 */
const getCellColor = (grid: MapGrid, x: number, y: number) => {
  // 当前位置
  if (x === currentMap.currentX && y === currentMap.currentY) {
    return "#4CAF50"; // 绿色
  }
  // 选中的格子
  if (grid.isSelected) {
    return "#FF9800"; // 橙色
  }
  // 路径上的格子
  if (grid.isOnPath) {
    return "#2196F3"; // 蓝色
  }
  // 不可通行的格子
  if (!grid.isPassable) {
    return "#F44336"; // 红色
  }
  // 默认格子
  return "#E0E0E0"; // 灰色
};

/**
 * 获取格子边框
 */
const getCellBorder = (grid: MapGrid, x: number, y: number) => {
  // 当前位置
  if (x === currentMap.currentX && y === currentMap.currentY) {
    return "3px solid #4CAF50"; // 绿色粗边框
  }
  // 选中的格子
  if (grid.isSelected) {
    return "3px solid #FF9800"; // 橙色粗边框
  }
  // 默认边框
  return "1px solid #BDBDBD"; // 灰色边框
};

/**
 * 处理格子点击事件
 */
const handleCellClick = (x: number, y: number) => {
  currentMap.selectGrid(x, y);
};

/**
 * 移动到下一格
 */
const moveToNext = () => {
  const success = currentMap.moveToNext();
  if (!success) {
    // 移动失败或到达终点，停止自动移动并清理路径
    stopAutoMove();
    currentMap.clearPath();
    console.log("[Map] 移动完成，自动清理路径");
  }
};

/**
 * 开始自动移动
 */
const startAutoMove = () => {
  if (currentMap.path.length <= 1) return;

  isAutoMoving.value = true;
  moveInterval.value = window.setInterval(() => {
    moveToNext();
  }, moveSpeed.value);
};

/**
 * 停止自动移动
 */
const stopAutoMove = () => {
  isAutoMoving.value = false;
  if (moveInterval.value) {
    window.clearInterval(moveInterval.value);
    moveInterval.value = null;
  }
};

/**
 * 切换自动移动状态
 */
const toggleAutoMove = () => {
  if (isAutoMoving.value) {
    stopAutoMove();
  } else {
    startAutoMove();
  }
};

/**
 * 清除路径
 */
const clearPath = () => {
  stopAutoMove(); // 清除路径时停止自动移动
  currentMap.clearPath();
};

/**
 * 重置地图
 */
const resetMap = () => {
  stopAutoMove(); // 重置地图时停止自动移动
  mapManager.createMap(10, 10);
};

// 组件卸载时清除定时器
onUnmounted(() => {
  stopAutoMove();
});

// 组件挂载时初始化地图
onMounted(() => {
  if (currentMap.width === 0 || currentMap.height === 0) {
    mapManager.createMap(10, 10);
  }
});
</script>

<style scoped>
.map-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.map-info {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.map-info p {
  margin: 5px 0;
}

.map-info button {
  margin-right: 10px;
  margin-top: 10px;
}

.map-grid {
  display: flex;
  flex-direction: column;
  border: 1px solid #bdbdbd;
  background-color: #f5f5f5;
}

.map-row {
  display: flex;
}

.map-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.map-cell:hover {
  transform: scale(1.05);
  z-index: 1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.cell-content {
  text-align: center;
  padding: 5px;
  font-size: 12px;
}

.cell-position {
  font-weight: bold;
  margin-bottom: 2px;
}

.cell-location {
  font-size: 10px;
  color: #666;
}
</style>
