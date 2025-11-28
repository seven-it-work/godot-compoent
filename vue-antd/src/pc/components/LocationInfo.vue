<template>
  <div class="location-info">
    <a-card title="当前地点" class="location-card">
      <div class="location-content">
        <!-- 地点基本信息 -->
        <div class="location-basic">
          <div class="info-item">
            <span class="info-label">地点名称：</span>
            <span class="info-value">{{ currentLocation.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">坐标：</span>
            <span class="info-value"
              >({{ currentLocation.x }}, {{ currentLocation.y }})</span
            >
          </div>
        </div>

        <!-- 灵脉信息 -->
        <div v-if="currentLocation.spiritVein" class="spirit-vein-info">
          <a-divider orientation="left">灵脉信息</a-divider>
          <div class="vein-details">
            <div class="vein-item">
              <span class="vein-label">灵脉类型：</span>
              <span class="vein-value">{{
                currentLocation.spiritVein.name
              }}</span>
            </div>
            <div class="vein-item">
              <span class="vein-label">灵脉等级：</span>
              <span class="vein-value"
                >等级 {{ currentLocation.spiritVein.level }}</span
              >
            </div>
            <div class="vein-item">
              <span class="vein-label">生产速度：</span>
              <span class="vein-value"
                >{{
                  currentLocation.spiritVein.productionSpeed
                }}
                灵气/小时</span
              >
            </div>
          </div>
        </div>

        <!-- 怪物信息 -->
        <div v-if="currentLocation.monster" class="monster-info">
          <a-divider orientation="left">怪物信息</a-divider>
          <div class="monster-details">
            <div class="monster-item">
              <span class="monster-label">怪物名称：</span>
              <span class="monster-value danger">{{
                currentLocation.monster.name
              }}</span>
            </div>
            <div class="monster-item">
              <span class="monster-label">怪物等级：</span>
              <span class="monster-value">{{
                currentLocation.monster.level
              }}</span>
            </div>
            <div class="monster-item">
              <span class="monster-label">怪物描述：</span>
              <span class="monster-value">{{
                currentLocation.monster.description
              }}</span>
            </div>
            <div class="monster-item">
              <span class="monster-label">击败奖励：</span>
              <span class="monster-value"
                >{{ currentLocation.monster.expReward }} 经验值</span
              >
            </div>
          </div>
        </div>

        <!-- 灵气分布 -->
        <a-divider orientation="left">灵气分布</a-divider>
        <div class="spirit-qi-distribution-compact">
          <div
            v-for="rootType in spiritRootTypes"
            :key="rootType"
            class="spirit-qi-bar-item"
          >
            <div class="bar-container">
              <div class="spirit-qi-bar-wrapper">
            <div
              class="spirit-qi-bar"
              :style="{
                width: `${calculateQiPercent(rootType)}%`,
                backgroundColor: getRootColor(rootType),
              }"
            ></div>
            <span class="bar-label">
              <span :style="{  fontWeight: 'bold' }">
                {{ getRootName(rootType) }}:
              </span>
              <span class="bar-value">
                {{ currentLocation.spiritQi[rootType] }}/{{ getMaxQi(rootType) }}
              </span>
            </span>
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
// 暂时注释未使用的导入
// import SpiritQiAbsorb from "./SpiritQiAbsorb.vue";
import type { SpiritRootType } from "../../types/game";

const gameStore = useGameStore();

// 获取当前地点和玩家信息
const currentLocation = computed(() => gameStore.player.currentLocation);
// 暂时注释未使用的变量
// const player = computed(() => gameStore.player);

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

// 获取灵气上限值
const getMaxQi = (type: SpiritRootType) => {
  switch (type) {
    case "gold":
      return currentLocation.value.spiritQi.maxGold;
    case "wood":
      return currentLocation.value.spiritQi.maxWood;
    case "water":
      return currentLocation.value.spiritQi.maxWater;
    case "fire":
      return currentLocation.value.spiritQi.maxFire;
    case "earth":
      return currentLocation.value.spiritQi.maxEarth;
    default:
      return 0;
  }
};

// 计算灵气百分比
const calculateQiPercent = (type: SpiritRootType) => {
  const current = currentLocation.value.spiritQi[type];
  const max = getMaxQi(type);
  return Math.floor((current / max) * 100);
};

// 吸收灵气
// 暂时注释未使用的函数
// const absorbSpiritQi = (spiritType: SpiritRootType) => {
//   gameStore.absorbSpiritQi(spiritType);
// };
</script>

<style scoped>
.location-info {
  margin-bottom: 20px;
}

.location-card {
  margin-bottom: 20px;
}

.location-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.location-basic {
  display: flex;
  gap: 30px;
  margin-bottom: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-label {
  font-weight: bold;
  color: #666;
}

.info-value {
  font-size: 16px;
  color: #1890ff;
}

.spirit-vein-info {
  margin-top: 10px;
}

.vein-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: #fff7e6;
  border-radius: 4px;
  border: 1px solid #ffd591;
}

.vein-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.vein-label {
  font-weight: bold;
  color: #faad14;
  width: 100px;
}

.vein-value {
  color: #d48806;
}

/* 怪物信息样式 */
.monster-info {
  margin-top: 10px;
}

.monster-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: #fff1f0;
  border-radius: 4px;
  border: 1px solid #ffccc7;
}

.monster-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.monster-label {
  font-weight: bold;
  color: #f5222d;
  width: 100px;
}

.monster-value {
  color: #cf1322;
}

.monster-value.danger {
  font-weight: bold;
  font-size: 18px;
}

.spirit-qi-distribution-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spirit-qi-bar-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-container {
  flex: 1;
  height: 24px;
  background-color: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.spirit-qi-bar {
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  transition: width 0.5s ease;
}

.spirit-qi-bar-wrapper {
  flex: 1;
  position: relative;
}

.spirit-qi-bar {
  height: 100%;
  border-radius: 12px;
  transition: width 0.5s ease;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.bar-label {
  position: relative;
  z-index: 2;
  height: 24px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 14px;
  white-space: nowrap;
}

.bar-value {
  color: #333;
  font-weight: bold;
  margin-left: 5px;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .location-basic {
    flex-direction: column;
    gap: 10px;
  }

  .spirit-qi-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .root-name {
    width: auto;
  }

  .qi-value {
    width: auto;
    text-align: left;
  }

  .vein-details {
    padding: 8px;
  }

  .vein-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .vein-label {
    width: auto;
  }
}
</style>
