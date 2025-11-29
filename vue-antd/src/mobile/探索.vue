<template>
  <a-layout class="mobile-exploration">
    <a-layout-content>
      <!-- 顶部信息栏 -->
      <div class="top-info-container">
        <div class="location-info">
          <div class="location-name">{{ currentLocation.name }}</div>
          <div class="location-coords">坐标: {{ currentLocation.x }}, {{ currentLocation.y }}</div>
        </div>
        <div class="map-controls">
          <a-button type="text" size="small" @click="showMapLegend">图例</a-button>
        </div>
      </div>

      <!-- 地图区域 -->
      <div class="map-section-container">
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
                  <!-- 玩家标记显示在当前玩家位置，不改变格子类型 -->
                  <span v-if="x === playerPosition.x && y === playerPosition.y" class="player-marker">👤</span>
                  <span v-else-if="cell === 'spiritVein'" class="cell-icon">💎</span>
                  <span v-else-if="cell === 'monster'" class="cell-icon">👹</span>
                  <span v-else-if="cell === 'exit'" class="cell-icon">🚪</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 地图控制按钮 -->
          <div class="map-nav-buttons">
            <div class="nav-row">
              <a-button type="default" size="small" @click="moveDirection('up')" class="nav-btn">↑</a-button>
            </div>
            <div class="nav-row">
              <a-button type="default" size="small" @click="moveDirection('left')" class="nav-btn">←</a-button>
              <a-button type="default" size="small" @click="moveDirection('down')" class="nav-btn">↓</a-button>
              <a-button type="default" size="small" @click="moveDirection('right')" class="nav-btn">→</a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部信息区域 -->
      <!-- 地点详情 -->
      <div class="location-details-container">
        <div class="section-title">当前地点</div>
        <div class="details-content">
          <div class="detail-row" v-if="currentLocation.spiritVein">
            <div class="detail-label">灵脉:</div>
            <div class="detail-value">{{ currentLocation.spiritVein.name }} ({{ currentLocation.spiritVein.level }}级)</div>
          </div>
          <div class="detail-row" v-if="currentLocation.monster">
            <div class="detail-label">怪物:</div>
            <div class="detail-value">{{ currentLocation.monster.name }} ({{ currentLocation.monster.level }}级)</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">灵气:</div>
            <div class="spirit-qi-summary">
              <div 
                v-for="spiritType in spiritQiTypes" 
                :key="spiritType"
                class="spirit-qi-dot"
                :style="{ backgroundColor: colorMap[spiritType] }"
                :title="`${typeMap[spiritType]}: ${currentLocation.spiritQi[spiritType as SpiritRootType]}`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-panel-container">
        <div class="section-title">操作</div>
        <div class="action-buttons-grid">
          <a-button 
            v-for="(action, index) in actions" 
            :key="index"
            :type="action.type" 
            size="small" 
            @click="action.handler" 
            class="action-btn"
          >
            {{ action.label }}
          </a-button>
        </div>
      </div>
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
import { useRouter } from 'vue-router';
import { useGameStore } from '../store/gameStore';
import type { SpiritRootType } from '../types/game';

const gameStore = useGameStore();
const router = useRouter();

// 响应式数据
const showLegend = ref(false);
const mapRef = ref<HTMLElement | null>(null);
// 玩家位置 - 优先从gameStore读取保存的位置，如果不存在则使用默认值
const playerPosition = ref({
  x: gameStore.player?.currentLocation?.x ?? 10,
  y: gameStore.player?.currentLocation?.y ?? 10
});
// 使用响应式变量存储地图数据，而不是计算属性，确保地图只生成一次
const visibleMapData = ref<string[][]>([]);
// 存储地图原始地形类型，用于玩家离开后恢复正确的地形类型
const originalTerrainData = ref<string[][]>([]);
// 移动状态控制
const isMoving = ref(false); // 标记玩家是否正在移动中
const moveStepDelay = 150; // 每步移动的延迟时间（毫秒）

// 计算属性
const currentLocation = computed(() => gameStore.getCurrentLocation);

// 生成地图函数
const generateMap = () => {
  const mapSize = 100;
  const map: string[][] = [];
  const originalMap: string[][] = [];
  
  for (let y = 0; y < mapSize; y++) {
    const row: string[] = [];
    const originalRow: string[] = [];
    for (let x = 0; x < mapSize; x++) {
      // 随机生成不同类型的地形
      const terrainTypes: string[] = ['empty', 'forest', 'mountain', 'water', 'spiritVein', 'monster', 'exit'];
      const weights: number[] = [0.45, 0.2, 0.15, 0.1, 0.04, 0.04, 0.02]; // 调整不同地形的出现概率
      
      // 根据权重选择地形
        const random = Math.random();
        let cumulative = 0;
        let selectedTerrain = 'empty';
        
        for (let i = 0; i < terrainTypes.length; i++) {
          // 使用类型断言确保weights[i]是number类型
          const weight = weights[i] as number;
          cumulative += weight;
          if (random < cumulative) {
            const terrain = terrainTypes[i];
            if (terrain !== undefined) {
              selectedTerrain = terrain;
            }
            break;
          }
        }
      
      row.push(selectedTerrain);
      originalRow.push(selectedTerrain); // 同时保存到原始地形记录中
    }
    map.push(row);
    originalMap.push(originalRow);
  }
  
  // 保存原始地形数据
  originalTerrainData.value = originalMap;
  
  return map;
};

// 更新玩家在地图上的位置
const updatePlayerPosition = () => {
  // 由于我们不再需要将格子类型设置为'player'，这个函数现在变得简单
  // 我们会通过CSS和模板中的条件渲染来显示玩家位置，而不是改变格子类型
  // 因此，这个函数实际上可以保留为空，或者我们可以保留原始功能作为备用
  // 但为了确保一致性，我们保留原来的循环逻辑，但不做任何修改
  
  // 注意：玩家位置的显示现在完全依赖于模板中的条件渲染
  // 即通过v-if="cell === 'player' || (x === playerPosition.x && y === playerPosition.y)"
  // 这样可以在不改变格子类型的情况下显示玩家标记
};

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

// 计算两点之间的路径（使用曼哈顿距离，简单的直线移动）
const calculatePath = (startX: number, startY: number, endX: number, endY: number): {x: number, y: number}[] => {
  const path: {x: number, y: number}[] = [];
  let currentX = startX;
  let currentY = startY;
  
  // 先处理水平移动，再处理垂直移动（简单的曼哈顿路径）
  while (currentX !== endX) {
    currentX += currentX < endX ? 1 : -1;
    path.push({x: currentX, y: currentY});
  }
  
  while (currentY !== endY) {
    currentY += currentY < endY ? 1 : -1;
    path.push({x: currentX, y: currentY});
  }
  
  return path;
};

// 平滑移动函数
const moveTo = async (targetX: number, targetY: number) => {
  // 防止重复执行移动操作
  if (isMoving.value || 
      (playerPosition.value.x === targetX && playerPosition.value.y === targetY)) {
    return;
  }
  
  // 设置移动状态
  isMoving.value = true;
  
  try {
    // 计算从当前位置到目标位置的路径
    const path = calculatePath(
      playerPosition.value.x,
      playerPosition.value.y,
      targetX,
      targetY
    );
    
    // 逐格移动实现平滑动画效果
    for (const step of path) {
      // 更新玩家位置
      playerPosition.value = { x: step.x, y: step.y };
      
      // 更新游戏状态存储中的位置信息
      if (gameStore.player) {
        gameStore.player.currentLocation = {
          ...gameStore.player.currentLocation,
          x: step.x,
          y: step.y,
          name: getLocationName(step.x, step.y)
        };
      }
      
      // 调试信息
      console.log(`移动到坐标 (${step.x}, ${step.y})`);
      
      // 滚动地图使玩家保持在视图中心
      scrollToPlayer();
      
      // 延迟以创建平滑动画效果
      await new Promise(resolve => setTimeout(resolve, moveStepDelay));
    }
    
    // 检查目标位置是否是怪物格子
    if (visibleMapData.value[targetY] && visibleMapData.value[targetY][targetX] === 'monster') {
      console.log('遭遇怪物！准备战斗...');
      // 处理怪物遭遇逻辑
      handleMonsterEncounter(targetX, targetY);
    }
  } catch (error) {
    // 错误处理
    console.error('移动过程中发生错误:', error);
  } finally {
    // 确保移动状态重置
    isMoving.value = false;
  }
};

// 滚动到玩家位置
const scrollToPlayer = () => {
  if (mapRef.value) {
    const cellSize = 48; // 单元格大小
    const playerX = playerPosition.value.x * cellSize;
    const playerY = playerPosition.value.y * cellSize;
    mapRef.value.scrollTo({
      left: playerX - mapRef.value.clientWidth / 2,
      top: playerY - mapRef.value.clientHeight / 2,
      behavior: 'smooth'
    });
  }
};

// 根据坐标生成地点名称的函数
const getLocationName = (x: number, y: number): string => {
  // 根据地形类型返回对应的地点名称
  if (visibleMapData.value[y] && visibleMapData.value[y][x]) {
    const terrain = visibleMapData.value[y][x];
    switch (terrain) {
      case 'forest': return '森林区域';
      case 'mountain': return '山地';
      case 'water': return '水域';
      case 'spiritVein': return '灵脉所在地';
      case 'monster': return '怪物领地';
      case 'exit': return '出口';
      default: return '普通区域';
    }
  }
  return '未知区域';
};

// 在组件挂载时初始化地图
onMounted(() => {
  console.log('探索页面初始化');
  // 检查是否已经有地图数据，如果没有则生成
  if (visibleMapData.value.length === 0) {
    visibleMapData.value = generateMap();
  }
  
  // 优先从gameStore读取保存的位置
  if (gameStore.player?.currentLocation) {
    playerPosition.value.x = gameStore.player.currentLocation.x;
    playerPosition.value.y = gameStore.player.currentLocation.y;
  }
  
  // 不再需要调用updatePlayerPosition，因为玩家位置现在通过模板条件渲染
  
  // 确保gameStore中的位置信息正确
  if (gameStore.player) {
    gameStore.player.currentLocation = {
      ...gameStore.player.currentLocation,
      x: playerPosition.value.x,
      y: playerPosition.value.y,
      name: getLocationName(playerPosition.value.x, playerPosition.value.y)
    };
  }
  
  // 延迟滚动以确保DOM已完全渲染
  setTimeout(() => {
    scrollToPlayer();
  }, 100);
});

const moveDirection = async (direction: 'up' | 'down' | 'left' | 'right') => {
  // 如果正在移动中，则不执行
  if (isMoving.value) {
    return;
  }
  
  isMoving.value = true;
  
  try {
    const { x, y } = playerPosition.value;
    let newX = x;
    let newY = y;
    
    // 计算新位置
    switch (direction) {
      case 'up':
        if (y > 0) newY--;
        break;
      case 'down':
        if (y < 99) newY++;
        break;
      case 'left':
        if (x > 0) newX--;
        break;
      case 'right':
        if (x < 99) newX++;
        break;
    }
    
    // 如果位置发生变化，则移动
    if (newX !== x || newY !== y) {
      // 更新玩家位置
      playerPosition.value = { x: newX, y: newY };
      // 更新gameStore中的位置信息
      if (gameStore.player) {
        gameStore.player.currentLocation = {
          ...gameStore.player.currentLocation,
          x: newX,
          y: newY,
          name: getLocationName(newX, newY)
        };
      }
      // 更新地图上的玩家位置
      updatePlayerPosition();
      console.log(`向${direction}移动到坐标 (${newX}, ${newY})`);
      // 滚动到玩家位置
      scrollToPlayer();
      // 添加短暂延迟，保持一致性
      await new Promise(resolve => setTimeout(resolve, moveStepDelay));
      
      // 检查目标位置是否是怪物格子
      if (visibleMapData.value[newY] && visibleMapData.value[newY][newX] === 'monster') {
        console.log('遭遇怪物！准备战斗...');
        // 处理怪物遭遇逻辑
        handleMonsterEncounter(newX, newY);
      }
    }
  } catch (error) {
    console.error('方向移动过程中发生错误:', error);
  } finally {
    isMoving.value = false;
  }
};

const cultivation = () => {
  // 跳转到修炼页面
  console.log('跳转到修炼页面');
  router.push('/mobile/修炼');
};

const showMapLegend = () => {
  showLegend.value = true;
};

// 处理怪物遭遇事件
const handleMonsterEncounter = (monsterX: number, monsterY: number) => {
  // 根据玩家等级和位置生成一个怪物
  const monsterLevel = Math.max(1, (gameStore.player?.level || 1) + Math.floor(Math.random() * 3) - 1);
  
  // 创建怪物数据（符合Monster类型）
  const monsterData = {
    id: `monster-${monsterX}-${monsterY}-${Date.now()}`,
    name: `怪物Lv${monsterLevel}`,
    level: monsterLevel,
    attributes: {
      health: monsterLevel * 50,
      maxHealth: monsterLevel * 50,
      attack: monsterLevel * 15,
      defense: monsterLevel * 8,
      spiritPower: monsterLevel * 10,
      // 添加必要的战斗属性
      dodge: monsterLevel * 5,
      block: monsterLevel * 3,
      critical: monsterLevel * 4
    },
    expReward: monsterLevel * 100,
    description: `这是一只${monsterLevel}级的怪物，盘踞在此地修炼。`
  };
  
  console.log('生成的怪物数据:', monsterData);
  
  // 使用gameStore中的startBattle方法开始战斗
  gameStore.startBattle(monsterData);
  
  // 立即导航到战斗页面，不等待其他异步操作
  console.log('===== 导航调试信息开始 =====');
  console.log('准备导航到战斗页面，目标路由:', '/mobile/battle');
  console.log('当前路由状态:', router.currentRoute.value);
  console.log('游戏商店战斗状态:', gameStore.currentBattle);
  
  // 执行路由跳转
  try {
    const navigationResult = router.push('/mobile/battle');
    console.log('导航请求已发送，结果:', navigationResult);
    
    // 监听路由变化
    setTimeout(() => {
      console.log('导航后当前路由:', router.currentRoute.value);
      console.log('===== 导航调试信息结束 =====');
    }, 100);
  } catch (error) {
    console.error('导航过程中发生错误:', error);
    console.log('===== 导航调试信息结束（错误）=====');
  }
};

// 操作按钮数据 - 只保留修炼按钮
const actions = ref([
  { label: '修炼', type: 'primary', handler: cultivation }
]);

// 移除重复的初始化代码
</script>

<style scoped>
.mobile-exploration {
  width: 100%;
  height: 100vh;
  padding: 4px;
  box-sizing: border-box;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
}

/* 主要内容区域 */
.ant-layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* 顶部信息栏 */
.top-info-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  flex-shrink: 0;
}

.location-info {
  flex: 1;
}

.location-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.location-coords {
  font-size: 12px;
  color: #666;
}

.map-controls {
  display: flex;
  gap: 2px;
}

.map-controls .ant-btn {
  padding: 0 6px;
}

/* 地图区域 */
.map-section-container {
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  flex: 0 0 70%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.map-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.game-map {
  flex: 1;
  overflow: auto;
  padding: 6px;
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  /* 确保容器有明确的高度限制，强制内容超出时显示滚动条 */
  height: 400px; /* 设置一个明确的高度 */
  /* 增加滚动条样式优化 */
  scrollbar-width: thin;
  scrollbar-color: #d9d9d9 #f0f0f0;
}

/* Webkit浏览器滚动条样式 */
.game-map::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.game-map::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

.game-map::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.game-map::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

/* 地图网格 - 确保不会被压缩 */
.map-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex-shrink: 0; /* 防止整个网格被压缩 */
}

/* 地图行样式 - 确保不会被压缩 */
.map-row {
  display: flex;
  gap: 1px;
  flex-shrink: 0; /* 防止行被压缩 */
}

/* 固定大小的地图单元格 */
.map-cell {
  width: 48px; /* 固定宽度 */
  height: 48px; /* 固定高度 */
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  flex-shrink: 0; /* 确保单元格不会被压缩 */
  box-sizing: border-box; /* 确保边框不影响尺寸 */
}

.map-cell:active {
  transform: scale(0.95);
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
  padding: 4px;
}

.nav-row {
  display: flex;
  justify-content: center;
  gap: 2px;
  margin-bottom: 2px;
}

.nav-row:last-child {
  margin-bottom: 0;
}

.nav-btn {
  width: 40px;
  height: 36px;
  padding: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 地点详情 */
.location-details-container {
  padding: 4px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  flex-shrink: 0;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-label {
  color: #666;
  font-size: 12px;
  min-width: 40px;
}

.detail-value {
  color: #333;
  font-size: 12px;
  flex: 1;
}

/* 灵气分布摘要 */
.spirit-qi-summary {
  display: flex;
  gap: 2px;
  flex: 1;
}

.spirit-qi-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #d9d9d9;
}

/* 操作按钮 */
.action-panel-container {
  padding: 4px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  flex-shrink: 0;
}

.action-buttons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
}

.action-btn {
  font-size: 12px;
  padding: 4px 0;
  margin: 0;
}

/* 图例样式 */
.legend-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border: 1px solid #d9d9d9;
}

.legend-text {
  flex: 1;
  font-size: 12px;
}

.legend-icon {
  font-size: 14px;
}

/* 优化移动端触摸体验 */
.ant-btn {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* 移除所有不必要的边距和内边距 */
:deep(.ant-card) {
  margin: 0;
  padding: 0;
}

:deep(.ant-card-body) {
  margin: 0;
  padding: 0;
}

:deep(.ant-row) {
  margin: 0;
}

:deep(.ant-col) {
  padding: 0;
}
</style>
