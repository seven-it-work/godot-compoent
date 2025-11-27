<template>
  <div class="training-system">
    <!-- 时间显示 -->
    <TimeDisplay />
    <!-- 玩家基本信息 -->
    <a-card title="玩家信息" class="player-info-card">
      <div class="player-info">
        <div class="info-item">
          <span class="label">等级：</span>
          <span class="value">{{ player.level }}</span>
        </div>
        <div class="info-item">
          <span class="label">经验值：</span>
          <span class="value">{{ player.exp }} / {{ player.maxExp }}</span>
        </div>
      </div>
    </a-card>

    <!-- 当前地点信息 -->
    <LocationInfo />
    <!-- 灵根修炼卡片 -->
    <div class="spirit-root-training">
      <a-card title="灵根修炼" class="training-card">
        <div class="training-grid">
          <div
            v-for="root in player.spiritRoots"
            :key="root.type"
            class="training-item"
            :style="{ borderColor: getRootColor(root.type) }"
          >
            <div class="training-header">
              <span class="root-name">{{ root.name }}</span>
              <span class="root-level">等级 {{ root.level }}</span>
            </div>
            
            <div class="qi-progress">
              <div class="qi-info">
                <span class="qi-label">灵气值：</span>
                <span class="qi-value">
                  {{ player.spiritQi[root.type] }} / {{ getMaxQi(root.type) }}
                </span>
              </div>
              <a-progress
                :percent="calculateQiPercent(root.type)"
                :stroke-color="getRootColor(root.type)"
                :show-info="false"
                class="progress-bar"
              />
            </div>
            
            <div class="button-container" :class="{ 'cooldown-active': player.isCooldown }">
                <a-button
                  type="primary"
                  size="small"
                  :disabled="player.isCooldown"
                  @click="handleAbsorb(root.type)"
                  :style="{ 
                    backgroundColor: getRootColor(root.type), 
                    borderColor: getRootColor(root.type),
                    position: 'relative',
                    zIndex: 1
                  }"
                  class="train-button"
                >
                  修炼
                </a-button>
                <div 
                  v-if="player.isCooldown" 
                  class="cooldown-overlay"
                  :style="{ 
                    background: getRootColor(root.type),
                    width: cooldownProgress + '%'
                  }"
                ></div>
                <div v-if="player.isCooldown" class="cooldown-text">
                  {{ formatCooldownTime(player.cooldownRemaining) }}
                </div>
              </div>
          </div>
        </div>
        
        <div v-if="player.isCooldown" class="cooldown-info">
          <span class="cooldown-label">冷却时间：</span>
          <span class="cooldown-time">{{ formatCooldownTime(player.cooldownRemaining) }}</span>
        </div>
      </a-card>
    </div>

    <!-- 返回地图按钮 -->
    <div class="outdoor-button-container">
      <a-button type="primary" size="large" @click="goToOutdoor">
        返回地图
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useGameStore } from "../store/gameStore";
// 暂时注释未使用的导入
// import SpiritRootInfo from "./SpiritRootInfo.vue";
import TimeDisplay from "./TimeDisplay.vue";
import LocationInfo from "./LocationInfo.vue";
import type { SpiritRootType } from "../types/game";

const gameStore = useGameStore();
const player = computed(() => gameStore.player);

// 选中的灵根类型
const selectedSpiritType = ref<SpiritRootType>("gold");

// 计算冷却进度百分比
const cooldownProgress = computed(() => {
  if (!player.value.isCooldown) return 0;
  return (player.value.cooldownRemaining / player.value.cooldown) * 100;
});

// 计算灵气百分比
const calculateQiPercent = (type: SpiritRootType) => {
  const current = player.value.spiritQi[type];
  const maxKey =
    `max${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof player.value.spiritQi;
  const max = player.value.spiritQi[maxKey] as number;
  return Math.floor((current / max) * 100);
};

// 获取灵根对应的颜色
const getRootColor = (type: SpiritRootType) => {
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
      return player.value.spiritQi.maxGold;
    case "wood":
      return player.value.spiritQi.maxWood;
    case "water":
      return player.value.spiritQi.maxWater;
    case "fire":
      return player.value.spiritQi.maxFire;
    case "earth":
      return player.value.spiritQi.maxEarth;
    default:
      return 0;
  }
};

// 处理吸收灵气
const handleAbsorb = (spiritType: SpiritRootType) => {
  selectedSpiritType.value = spiritType;
  gameStore.absorbSpiritQi(spiritType);
};

// 格式化冷却时间
const formatCooldownTime = (milliseconds: number) => {
  return `${(milliseconds / 1000).toFixed(1)}s`;
};

// 前往外出系统
const goToOutdoor = () => {
  gameStore.switchSystem("outdoor");
};
</script>

<style scoped>
.training-system {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: #1890ff;
  margin-bottom: 20px;
}

.player-info-card {
  margin-bottom: 20px;
}

.player-info {
  display: flex;
  gap: 30px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  font-weight: bold;
  color: #666;
}

.value {
  font-size: 18px;
  color: #1890ff;
}

.spirit-qi-card {
  margin-bottom: 20px;
}

.spirit-qi-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.spirit-qi-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.root-name {
  width: 80px;
  font-weight: bold;
}

.qi-value {
  width: 120px;
  text-align: right;
}

/* 灵根修炼卡片样式 */
.spirit-root-training {
  margin-bottom: 20px;
}

.training-card {
  overflow: hidden;
}

.training-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 15px;
}

.training-item {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.training-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.training-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.training-header .root-name {
  font-size: 16px;
  font-weight: bold;
  width: auto;
}

.training-header .root-level {
  font-size: 14px;
  color: #666;
  background-color: #e6f7ff;
  padding: 2px 8px;
  border-radius: 10px;
}

.qi-progress {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.qi-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.qi-info .qi-label {
  font-weight: bold;
  color: #666;
}

.qi-info .qi-value {
  color: #1890ff;
  font-weight: bold;
  width: auto;
}

.progress-bar {
  margin: 0;
}

.train-button {
  margin-top: 5px;
  align-self: flex-end;
  transition: all 0.3s ease;
}

.button-container {
  position: relative;
  display: inline-block;
  margin-top: 5px;
  align-self: flex-end;
}

.cooldown-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.5;
  background: #1890ff;
  transition: width 0.1s linear;
  z-index: 0;
  border-radius: 6px;
}

.cooldown-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.cooldown-active .train-button {
  background-color: #f5f5f5 !important;
  border-color: #d9d9d9 !important;
  color: rgba(0, 0, 0, 0.25) !important;
  cursor: not-allowed;
}

/* 可以移除全局冷却信息显示，因为每个按钮都有独立的冷却显示 */
/* .cooldown-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  margin-top: 10px;
}

.cooldown-label {
  color: #666;
}

.cooldown-time {
  color: #ff4d4f;
  font-weight: bold;
} */

/* 外出按钮样式 */
.outdoor-button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .training-system {
    padding: 10px;
  }

  .player-info {
    flex-direction: column;
    gap: 10px;
  }

  .training-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .training-item {
    padding: 12px;
  }

  .outdoor-button-container {
    margin-top: 20px;
  }
}
</style>
