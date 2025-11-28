<template>
  <div class="map-component">
    <a-card title="地图" class="map-card">
      <!-- 移动控制按钮 -->
      <div class="movement-controls">
        <a-space
          direction="vertical"
          size="small"
          style="display: flex; justify-content: center"
        >
          <a-button @click="move('up')" icon="up">上</a-button>
          <a-space>
            <a-button @click="move('left')" icon="left">左</a-button>
            <a-button @click="move('down')" icon="down">下</a-button>
            <a-button @click="move('right')" icon="right">右</a-button>
          </a-space>
        </a-space>
      </div>

      <div class="map-container">
        <!-- 地图网格 -->
        <div
          class="map-grid"
          :style="{
            gridTemplateColumns: `repeat(${map.width}, 60px)`,
            gridTemplateRows: `repeat(${map.height}, 60px)`,
          }"
        >
          <div
            v-for="(row, y) in map.locations"
            :key="`row-${y}`"
            class="map-row"
          >
            <div
              v-for="(location, x) in row"
              :key="location.id"
              class="map-cell"
              :class="{
                'current-location': location.isCurrent,
                'has-spirit-vein': location.spiritVein,
                'has-monster': location.monster,
              }"
              @click="handleLocationClick(x, y)"
            >
              <!-- 地点名称 -->
              <div class="location-name">{{ location.name }}</div>

              <!-- 灵脉标记 -->
              <div v-if="location.spiritVein" class="spirit-vein-marker">
                {{ location.spiritVein.name }}
              </div>

              <!-- 怪物标记 -->
              <div v-if="location.monster" class="monster-marker">
                {{ location.monster.name }}
              </div>

              <!-- 灵气分布提示 -->
              <div class="spirit-qi-tooltip">
                <div v-for="rootType in spiritRootTypes" :key="rootType">
                  <span :style="{ color: getRootColor(rootType) }">
                    {{ getRootName(rootType) }}:
                    {{ location.spiritQi[rootType] }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "../../store/gameStore";
import type { SpiritRootType } from "../../types/game";

const gameStore = useGameStore();

// 获取地图数据
const map = computed(() => gameStore.map);

// 灵根类型列表
const spiritRootTypes: SpiritRootType[] = [
  "gold",
  "wood",
  "water",
  "fire",
  "earth",
];

// 灵根名称映射
const getRootName = (type: SpiritRootType): string => {
  const nameMap: Record<SpiritRootType, string> = {
    gold: "金",
    wood: "木",
    water: "水",
    fire: "火",
    earth: "土",
  };
  return nameMap[type];
};

// 灵根颜色映射
const getRootColor = (type: SpiritRootType): string => {
  const colorMap: Record<SpiritRootType, string> = {
    gold: "#FFD700",
    wood: "#90EE90",
    water: "#87CEEB",
    fire: "#FF6347",
    earth: "#DEB887",
  };
  return colorMap[type];
};

// 处理地点点击
const handleLocationClick = (x: number, y: number) => {
  gameStore.switchLocation(x, y);
};

// 上下左右移动
const move = (direction: "up" | "down" | "left" | "right") => {
  gameStore.move(direction);
};
</script>

<style scoped>
.map-component {
  margin-bottom: 20px;
}

.map-card {
  overflow: auto;
}

/* 移动控制按钮样式 */
.movement-controls {
  margin-bottom: 20px;
  text-align: center;
}

.map-container {
  overflow-x: auto;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
  cursor: grab;
}

.map-container:active {
  cursor: grabbing;
}

.map-grid {
  display: inline-grid;
  gap: 2px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 确保地图网格不会被父容器压缩 */
  width: auto !important;
  min-width: min-content;
  /* 确保网格列数与实际地图宽度一致 */
  white-space: nowrap;
}

.map-row {
  display: contents;
}

.map-cell {
  width: 60px;
  height: 60px;
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.map-cell:hover {
  transform: scale(1.1);
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.current-location {
  background-color: #e6f7ff;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px #1890ff;
}

.has-spirit-vein {
  background-color: #fff7e6;
  border-color: #faad14;
}

.has-monster {
  background-color: #fff1f0;
  border-color: #f5222d;
}

.location-name {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2px;
  color: #333;
  z-index: 2;
}

.spirit-vein-marker {
  font-size: 10px;
  color: #faad14;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1px 4px;
  border-radius: 3px;
  z-index: 2;
}

.monster-marker {
  font-size: 10px;
  color: #f5222d;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1px 4px;
  border-radius: 3px;
  z-index: 2;
}

.spirit-qi-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  width: 120px;
  font-size: 11px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.map-cell:hover .spirit-qi-tooltip {
  opacity: 1;
  visibility: visible;
  top: calc(100% + 5px);
}

.spirit-qi-tooltip div {
  margin-bottom: 2px;
}

.spirit-qi-tooltip div:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-container {
    padding: 10px 5px;
  }

  .map-grid {
    /* 保持与地图数据一致的行列布局，但减小单元格大小 */
    gap: 1px;
    padding: 5px;
    /* 确保地图在小屏幕上正确显示 */
    display: inline-grid;
    /* 确保网格不会被父容器压缩 */
    width: auto !important;
  }

  .map-cell {
    width: 35px !important;
    height: 35px !important;
  }

  .location-name {
    font-size: 9px;
  }

  .spirit-vein-marker,
  .monster-marker {
    font-size: 7px;
    padding: 0 2px;
  }

  .spirit-qi-tooltip {
    width: 80px;
    font-size: 9px;
    padding: 5px;
  }
}
</style>
