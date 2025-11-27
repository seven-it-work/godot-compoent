<template>
  <div class="cultivation-ui">
    <!-- 顶部区域：头像和属性 -->
    <div class="top-section">
      <!-- 左侧：头像和名称 -->
      <div class="avatar-section">
        <div class="avatar-container">
          <div class="avatar">
            <!-- 实际项目中这里可以使用真实头像图片 -->
            <div class="avatar-placeholder">{{ getAvatarInitials((player as any).name) }}</div>
          </div>
        </div>
        <div class="player-name">{{ (player as any).name }}</div>
      </div>
      
      <!-- 右侧：属性面板 -->
      <div class="attributes-section">
        <div class="section-title">属性</div>
        <div class="attributes-content">
          <div class="attribute-grid">
            <div class="attribute-item">
              <span class="attribute-label">等级:</span>
              <span class="attribute-value">{{ player.level }}</span>
            </div>
            <div class="attribute-item">
              <span class="attribute-label">经验值:</span>
              <span class="attribute-value">{{ player.exp }} / {{ player.maxExp }}</span>
            </div>
            <div class="attribute-item">
              <span class="attribute-label">攻击:</span>
              <span class="attribute-value">{{ (player as any).attack || 0 }}</span>
            </div>
            <div class="attribute-item">
              <span class="attribute-label">生命:</span>
              <span class="attribute-value">{{ (player as any).hp || 0 }} / {{ (player as any).maxHp || 0 }}</span>
            </div>
            <!-- 暂时移除不存在的属性 -->
            <!-- 暂时移除不存在的属性 -->
          </div>
          
          <!-- 经验条 -->
          <div class="exp-bar-container">
            <div class="exp-bar-info">
              <span class="exp-label">升级进度</span>
              <span class="exp-percent">{{ calculateExpPercent() }}%</span>
            </div>
            <div class="exp-bar-wrapper">
              <div 
                class="exp-bar-fill" 
                :style="{ width: calculateExpPercent() + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部区域：地点信息、灵气分布和玩家灵气分布 -->
    <div class="bottom-section">
      <!-- 左侧：地点信息和灵气分布 -->
      <div class="location-section">
        <div class="section-title">地点</div>
        <div class="location-attributes">
          <div class="attribute-item">
            <span class="attribute-label">位置:</span>
            <span class="attribute-value">{{ currentLocation.name }}</span>
          </div>
          <div class="attribute-item">
            <span class="attribute-label">坐标:</span>
            <span class="attribute-value">({{ currentLocation.x }}, {{ currentLocation.y }})</span>
          </div>
          <!-- 显示灵脉信息（如果有） -->
          <div v-if="currentLocation.spiritVein" class="attribute-item">
            <span class="attribute-label">灵脉:</span>
            <span class="attribute-value spirit-vein">{{ currentLocation.spiritVein.name }}</span>
          </div>
          <!-- 显示怪物信息（如果有） -->
          <div v-if="currentLocation.monster" class="attribute-item">
            <span class="attribute-label">怪物:</span>
            <span class="attribute-value monster">{{ currentLocation.monster.name }}</span>
          </div>
        </div>
        <div class="spirit-qi-section">
          <div class="section-title">灵气分布</div>
          <div class="spirit-qi-bars">
            <div
              v-for="rootType in spiritRootTypes"
              :key="rootType"
              class="spirit-qi-bar-item"
            >
              <div class="spirit-qi-bar-wrapper">
                <div class="spirit-qi-bar">
                  <div 
                    class="spirit-qi-bar-fill" 
                    :style="{ 
                      width: `${calculateLocationQiPercent(rootType)}%`,
                      backgroundColor: getRootColor(rootType) 
                    }"
                  ></div>
                </div>
                <div class="spirit-qi-label">
                  <span class="root-name">{{ getRootName(rootType) }}:</span>
                  <span class="qi-value">{{ currentLocation.spiritQi[rootType] }}/{{ getMaxLocationQi(rootType) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧：玩家灵气分布 -->
      <div class="player-qi-section">
        <div class="section-title">玩家灵气分布</div>
        <div class="player-qi-content">
          <div class="spirit-root-overview">
            <div class="root-levels">
              <div v-for="rootType in spiritRootTypes" :key="rootType" class="root-level-item">
                <div 
                  class="root-level-icon"
                  :style="{ backgroundColor: getRootColor(rootType) }"
                >
                  {{ getRootName(rootType) }}
                </div>
                <div class="root-level-info">
                  <div class="root-level-label">{{ getRootName(rootType) }}灵根</div>
                  <div class="root-level-value">等级: {{ (playerSpiritRoots as any)[rootType]?.level || 0 }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="player-qi-bars">
            <div v-for="rootType in spiritRootTypes" :key="rootType" class="player-qi-bar-item">
              <div class="player-qi-bar-wrapper">
                <div class="player-qi-bar">
                  <div 
                    class="player-qi-bar-fill"
                    :style="{ 
                      width: `${calculatePlayerQiPercent(rootType)}%`,
                      backgroundColor: getRootColor(rootType)
                    }"
                  ></div>
                </div>
                <div class="player-qi-label">
                  <span class="root-name">{{ getRootName(rootType) }}:</span>
                  <span class="qi-value">{{ (playerSpiritQi as any)[rootType] || 0 }}/{{ getMaxPlayerQi(rootType) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "../store/gameStore";

// 定义类型
type SpiritRootName = "gold" | "wood" | "water" | "fire" | "earth";

// 简化接口定义
interface SpiritQiInfo {
  gold?: number;
  wood?: number;
  water?: number;
  fire?: number;
  earth?: number;
  maxGold?: number;
  maxWood?: number;
  maxWater?: number;
  maxFire?: number;
  maxEarth?: number;
}

const gameStore = useGameStore();
const player = computed(() => gameStore.player);
const currentLocation = computed(() => gameStore.player.currentLocation);

// 灵根类型列表
const spiritRootTypes: SpiritRootName[] = [
  "gold",
  "wood",
  "water",
  "fire",
  "earth",
];

// 玩家灵根信息 - 使用any暂时解决类型问题
const playerSpiritRoots = player.value.spiritRoots || ({} as any);

// 玩家灵气信息 - 使用any暂时解决类型问题
const playerSpiritQi = player.value.spiritQi || ({} as any);

// 获取玩家名称首字母作为头像占位符
const getAvatarInitials = (name: string) => {
  if (!name) return '玩家';
  return name.charAt(0) || '玩家';
};

// 计算经验值百分比
const calculateExpPercent = () => {
  const { exp, maxExp } = player.value;
  if (!maxExp) return 0;
  return Math.floor((exp / maxExp) * 100);
};

// 灵根名称映射
const getRootName = (type: SpiritRootName): string => {
  const nameMap: Record<SpiritRootName, string> = {
    gold: "金",
    wood: "木",
    water: "水",
    fire: "火",
    earth: "土",
  };
  return nameMap[type];
};

// 灵根颜色映射
const getRootColor = (type: SpiritRootName): string => {
  const colorMap: Record<SpiritRootName, string> = {
    gold: "#FFD700",
    wood: "#90EE90",
    water: "#87CEEB",
    fire: "#FF6347",
    earth: "#DEB887",
  };
  return colorMap[type];
};

// 获取地点灵气上限值
const getMaxLocationQi = (type: SpiritRootName) => {
  const maxKey = `max${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof SpiritQiInfo;
  return currentLocation.value.spiritQi[maxKey] || 0;
};

// 计算地点灵气百分比
const calculateLocationQiPercent = (type: SpiritRootName) => {
  const current = currentLocation.value.spiritQi[type] || 0;
  const max = getMaxLocationQi(type);
  return Math.floor((current / max) * 100);
};

// 获取玩家灵气上限值
const getMaxPlayerQi = (type: SpiritRootName) => {
  // 假设基于灵根等级计算上限
  const rootLevel = (playerSpiritRoots as any)[type]?.level || 1;
  // 简单的等级映射，实际可能需要更复杂的计算
  return rootLevel * 1000;
};

// 计算玩家灵气百分比
const calculatePlayerQiPercent = (type: SpiritRootName) => {
  const current = (playerSpiritQi as any)[type] || 0;
  const max = getMaxPlayerQi(type);
  return Math.floor((current / max) * 100);
};
</script>

<style scoped>
.cultivation-ui {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
}

/* 顶部区域样式 */
.top-section {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  flex: 1;
  min-height: 300px;
}

/* 头像和名称区域 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: #ffffff;
}

.avatar-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar {
  width: 200px;
  height: 200px;
  background-color: #1890ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #ffffff;
  border: 3px solid #40a9ff;
  overflow: hidden;
}

.avatar-placeholder {
  font-size: 48px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.player-name {
  width: 100%;
  padding: 10px 0;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 属性区域 */
.attributes-section {
  padding: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: #ffffff;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  color: #333;
}

.attributes-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.attribute-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  flex: 1;
}

.exp-bar-container {
  margin-top: 10px;
}

.exp-bar-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.exp-label {
  font-weight: bold;
}

.exp-percent {
  color: #1890ff;
}

.exp-bar-wrapper {
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.exp-bar-fill {
  height: 100%;
  background-color: #1890ff;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.attribute-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.attribute-label {
  font-weight: bold;
  color: #666;
}

.attribute-value {
  font-size: 16px;
  color: #1890ff;
  font-weight: bold;
}

/* 底部区域 */
.bottom-section {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
  flex: 1;
  min-height: 300px;
}

/* 地点信息和灵气分布区域 */
.location-section {
  display: flex;
  flex-direction: column;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 20px;
  gap: 20px;
}

.location-attributes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.spirit-vein {
  color: #faad14;
  font-weight: bold;
}

.monster {
  color: #f5222d;
  font-weight: bold;
}

.spirit-qi-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.spirit-qi-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spirit-qi-bar-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spirit-qi-bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spirit-qi-bar {
  height: 24px;
  background-color: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.spirit-qi-bar-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.5s ease;
  position: absolute;
  left: 0;
  top: 0;
}

.spirit-qi-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.root-name {
  font-weight: bold;
  min-width: 20px;
}

.qi-value {
  font-weight: bold;
  color: #333;
}

/* 玩家灵气分布区域 */
.player-qi-section {
  display: flex;
  flex-direction: column;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 20px;
  gap: 20px;
  height: 100%;
}

.player-qi-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 灵根概览区域 */
.spirit-root-overview {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.root-levels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.root-level-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.root-level-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.root-level-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.root-level-label {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.root-level-value {
  font-size: 12px;
  color: #666;
}

/* 玩家灵气条 */
.player-qi-bars {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.player-qi-bar-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.player-qi-bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.player-qi-bar {
  height: 30px;
  background-color: #f0f0f0;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.player-qi-bar-fill {
  height: 100%;
  border-radius: 15px;
  transition: width 0.5s ease;
  position: absolute;
  left: 0;
  top: 0;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.player-qi-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
}

/* 确保整体布局符合设计图 */
.cultivation-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.top-section {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 20px;
  margin-bottom: 20px;
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-section {
    grid-template-columns: 1fr;
  }
  
  .bottom-section {
    grid-template-columns: 1fr;
  }
  
  .attribute-grid {
    grid-template-columns: 1fr;
  }
  
  .root-levels {
    grid-template-columns: 1fr 1fr;
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .top-section,
  .bottom-section {
    grid-template-columns: 1fr;
  }
  
  .avatar-section {
    flex-direction: row;
    justify-content: space-around;
  }
  
  .avatar-container {
    margin-bottom: 0;
  }
  
  .attribute-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .cultivation-ui {
    padding: 10px;
  }
  
  .avatar-section {
    flex-direction: column;
  }
  
  .avatar-container {
    margin-bottom: 20px;
  }
  
  .avatar {
    width: 150px;
    height: 150px;
  }
  
  .avatar-placeholder {
    font-size: 36px;
  }
}
</style>