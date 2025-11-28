<template>
  <a-layout class="mobile-exploration">
    <a-layout-content>
      <!-- 顶部信息栏 -->
      <a-card class="top-info-card" :bordered="true">
        <a-row :gutter="[8, 8]">
          <a-col :span="16">
            <div class="location-info">
              <div class="location-name">{{ currentLocation.name }}</div>
              <div class="location-coords">坐标: {{ currentLocation.x }}, {{ currentLocation.y }}</div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="map-controls">
              <a-button type="text" size="small" @click="showMapLegend">图例</a-button>
              <a-button type="text" size="small" @click="toggleFullMap">全屏</a-button>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 地图区域 -->
      <a-card class="map-section-card" :bordered="true" style="margin-top: 8px;">
        <div class="map-container">
          <div class="game-map" ref="mapRef">
            <!-- 地图网格 -->
            <div class="map-grid">
              <div 
                v-for="(row, y) in visibleMapData" 
                :key="`row-${y}`" 
                class="map-row"
              >
                <div 
                  v-for="(cell, x) in row" 
                  :key="`cell-${x}-${y}`" 
                  class="map-cell"
                  :class="getCellClass(cell)"
                  @click="moveTo(x, y)"
                  :style="getCellStyle(cell)"
                >
                  <span v-if="cell === 'player'" class="player-marker">👤</span>
                  <span v-else-if="cell === 'spiritVein'" class="cell-icon">💎</span>
                  <span v-else-if="cell === 'monster'" class="cell-icon">👹</span>
                  <span v-else-if="cell === 'exit'" class="cell-icon">🚪</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 地图控制按钮 -->
          <div class="map-nav-buttons">
            <a-row justify="center">
              <a-col :span="8">
                <a-button type="default" size="small" @click="moveDirection('up')" block>↑</a-button>
              </a-col>
            </a-row>
            <a-row justify="center" :gutter="[8, 8]" style="margin-top: 8px;">
              <a-col :span="8">
                <a-button type="default" size="small" @click="moveDirection('left')" block>←</a-button>
              </a-col>
              <a-col :span="8">
                <a-button type="default" size="small" @click="moveDirection('down')" block>↓</a-button>
              </a-col>
              <a-col :span="8">
                <a-button type="default" size="small" @click="moveDirection('right')" block>→</a-button>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-card>

      <!-- 底部信息区域 -->
      <a-row :gutter="[8, 8]" style="margin-top: 8px;">
        <!-- 地点详情 -->
        <a-col :span="24">
          <a-card class="location-details-card" :bordered="true" title="当前地点">
            <div class="details-content">
              <a-row v-if="currentLocation.spiritVein" :gutter="[8, 8]">
                <a-col :span="8">
                  <div class="detail-label">灵脉:</div>
                </a-col>
                <a-col :span="16">
                  <div class="detail-value">{{ currentLocation.spiritVein.name }} ({{ currentLocation.spiritVein.level }}级)</div>
                </a-col>
              </a-row>
              <a-row v-if="currentLocation.monster" :gutter="[8, 8]">
                <a-col :span="8">
                  <div class="detail-label">怪物:</div>
                </a-col>
                <a-col :span="16">
                  <div class="detail-value">{{ currentLocation.monster.name }} ({{ currentLocation.monster.level }}级)</div>
                </a-col>
              </a-row>
              <a-row :gutter="[8, 8]">
                <a-col :span="8">
                  <div class="detail-label">灵气:</div>
                </a-col>
                <a-col :span="16">
                  <div class="spirit-qi-summary">
                    <div 
                      v-for="spiritType in spiritQiTypes" 
                      :key="spiritType"
                      class="spirit-qi-dot"
                      :style="{ backgroundColor: colorMap[spiritType] }"
                      :title="`${typeMap[spiritType]}: ${currentLocation.spiritQi[spiritType as SpiritRootType]}`"
                    ></div>
                  </div>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>

        <!-- 操作按钮 -->
        <a-col :span="24">
          <a-card class="action-panel-card" :bordered="true" title="操作">
            <a-row :gutter="[8, 8]">
              <a-col :span="6" v-for="(action, index) in actions" :key="index">
                <a-button 
                  :type="action.type" 
                  size="small" 
                  @click="action.handler" 
                  block
                >
                  {{ action.label }}
                </a-button>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>

    <!-- 图例弹窗 -->
    <a-modal v-model:open="showLegend" title="地图图例" size="small" footer="null">
      <div class="legend-content">
        <a-row :gutter="[8, 8]" v-for="(legend, index) in mapLegend" :key="index">
          <a-col :span="6">
            <div class="legend-color" :style="{ backgroundColor: legend.color }"></div>
          </a-col>
          <a-col :span="12">
            <span class="legend-text">{{ legend.text }}</span>
          </a-col>
          <a-col :span="6">
            <span class="legend-icon">{{ legend.icon }}</span>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useGameStore } from '../store/gameStore';
import type { SpiritRootType } from '../types/game';

const gameStore = useGameStore();

// 响应式数据
const showLegend = ref(false);
const fullMapMode = ref(false);
const mapRef = ref<HTMLElement | null>(null);

// 计算属性
const currentLocation = computed(() => gameStore.getCurrentLocation);

// 模拟可见地图数据，实际应该从gameStore获取
const visibleMapData = computed(() => {
  // 简单模拟一个3x3的可见地图
  return [
    ['forest', 'spiritVein', 'mountain'],
    ['water', 'player', 'monster'],
    ['empty', 'exit', 'empty']
  ];
});

// 配置
const spiritQiTypes = ref<string[]>(['gold', 'wood', 'water', 'fire', 'earth']);
const typeMap = ref<Record<string, string>>({
  gold: '金',
  wood: '木',
  water: '水',
  fire: '火',
  earth: '土'
});
const colorMap = ref<Record<string, string>>({
  gold: '#ffd700',
  wood: '#90ee90',
  water: '#87ceeb',
  fire: '#ff6347',
  earth: '#deb887'
});

// 地图图例数据
const mapLegend = ref([
  { color: '#e6f7ff', text: '普通地形', icon: '' },
  { color: '#95de64', text: '森林', icon: '' },
  { color: '#ffd591', text: '山脉', icon: '' },
  { color: '#bae7ff', text: '水域', icon: '' },
  { color: '#73d13d', text: '灵脉', icon: '💎' },
  { color: '#ff7875', text: '怪物', icon: '👹' },
  { color: '#c9c9c9', text: '出口', icon: '🚪' },
  { color: 'transparent', text: '玩家', icon: '👤' }
]);

// 地图相关方法
const getCellClass = (cell: string) => {
  const classMap: Record<string, string> = {
    'player': 'cell-player',
    'spiritVein': 'cell-spirit-vein',
    'monster': 'cell-monster',
    'exit': 'cell-exit',
    'forest': 'cell-forest',
    'mountain': 'cell-mountain',
    'water': 'cell-water'
  };
  return classMap[cell] || 'cell-empty';
};

const getCellStyle = (cell: string) => {
  const styleMap: Record<string, { backgroundColor: string }> = {
    'forest': { backgroundColor: '#95de64' },
    'mountain': { backgroundColor: '#ffd591' },
    'water': { backgroundColor: '#bae7ff' },
    'spiritVein': { backgroundColor: '#73d13d' },
    'monster': { backgroundColor: '#ff7875' },
    'exit': { backgroundColor: '#c9c9c9' },
    'player': { backgroundColor: '#e6f7ff' }
  };
  return styleMap[cell] || { backgroundColor: '#e6f7ff' };
};

const moveTo = (x: number, y: number) => {
  // 使用gameStore的move方法，而不是moveTo
  // gameStore.moveTo(x, y);
  console.log(`移动到坐标 (${x}, ${y})`);
};

const moveDirection = (direction: 'up' | 'down' | 'left' | 'right') => {
  gameStore.move(direction);
};

const exploreLocation = () => {
  // 探索地点逻辑
  console.log('探索当前地点');
};

const collectResources = () => {
  // 采集资源逻辑
  console.log('采集资源');
};

const rest = () => {
  // 休息逻辑
  console.log('休息');
};

const backToHome = () => {
  // 返回主页逻辑
  console.log('返回主页');
};

const showMapLegend = () => {
  showLegend.value = true;
};

const toggleFullMap = () => {
  fullMapMode.value = !fullMapMode.value;
};

// 操作按钮数据
const actions = ref([
  { label: '探索', type: 'primary', handler: exploreLocation },
  { label: '采集', type: 'default', handler: collectResources },
  { label: '休息', type: 'default', handler: rest },
  { label: '返回', type: 'default', handler: backToHome }
]);

// 初始化
onMounted(() => {
  // 确保地图数据已加载
  console.log('探索页面初始化');
});
</script>

<style scoped>
.mobile-exploration {
  width: 100%;
  height: 100vh;
  padding: 8px;
  box-sizing: border-box;
  background-color: #f0f2f5;
  overflow-y: auto;
}

/* 顶部信息栏 */
.top-info-card {
  padding: 8px 12px;
}

.location-info {
  flex: 1;
}

.location-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.location-coords {
  font-size: 12px;
  color: #666;
}

.map-controls {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

/* 地图区域 */
.map-section-card {
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.map-section-card .ant-card-body {
  padding: 0;
  height: 100%;
}

.map-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.game-map {
  flex: 1;
  overflow: auto;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

/* 地图网格 */
.map-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.map-row {
  display: flex;
  gap: 1px;
}

.map-cell {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  border-radius: 2px;
}

.map-cell:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 单元格类型 */
.cell-empty { background-color: #e6f7ff; }
.cell-forest { background-color: #95de64; }
.cell-mountain { background-color: #ffd591; }
.cell-water { background-color: #bae7ff; }
.cell-spirit-vein { background-color: #73d13d; }
.cell-monster { background-color: #ff7875; }
.cell-exit { background-color: #c9c9c9; }
.cell-player { background-color: #e6f7ff; }

.player-marker {
  font-size: 16px;
  line-height: 1;
}

.cell-icon {
  font-size: 12px;
  line-height: 1;
}

/* 地图导航按钮 */
.map-nav-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px;
}

.map-nav-buttons .ant-btn {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 16px;
}

/* 底部信息区域 */
.location-details-card, .action-panel-card {
  margin-bottom: 8px;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  color: #666;
  font-size: 12px;
}

.detail-value {
  color: #333;
  font-weight: bold;
  font-size: 12px;
}

/* 灵气分布摘要 */
.spirit-qi-summary {
  display: flex;
  gap: 4px;
}

.spirit-qi-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #d9d9d9;
}

/* 操作按钮 */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.action-buttons .ant-btn {
  font-size: 12px;
  padding: 6px 0;
}

/* 图例样式 */
.legend-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}

.legend-text {
  flex: 1;
}

.legend-icon {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .mobile-exploration {
    padding: 6px;
  }

  .top-info-card, .map-section-card, .location-details-card, .action-panel-card {
    margin-bottom: 6px;
  }

  .map-cell {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .map-nav-buttons .ant-btn {
    width: 100%;
    height: 36px;
    font-size: 14px;
  }

  .top-info-card .ant-card-body {
    padding: 8px;
  }

  .map-controls {
    justify-content: flex-end;
  }
}
</style>
