<template>
  <div class="training-system">
    <h2>修炼系统</h2>

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

    <!-- 灵根信息 -->
    <SpiritRootInfo :spiritRoots="player.spiritRoots" />

    <!-- 灵气信息 -->
    <a-card title="灵气值" class="spirit-qi-card">
      <div class="spirit-qi-list">
        <div
          v-for="root in player.spiritRoots"
          :key="root.type"
          class="spirit-qi-item"
        >
          <span class="root-name">{{ root.name }}：</span>
          <a-progress
            :percent="calculateQiPercent(root.type)"
            :stroke-color="getRootColor(root.type)"
            :show-info="false"
          />
          <span class="qi-value">
            {{ player.spiritQi[root.type] }} / {{ getMaxQi(root.type) }}
          </span>
        </div>
      </div>
    </a-card>

    <!-- 灵气吸收 -->
    <SpiritQiAbsorb
      @absorb="(spiritType) => absorbSpiritQi(spiritType)"
      :is-cooldown="player.isCooldown"
      :cooldown-remaining="player.cooldownRemaining"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "../store/gameStore";
import SpiritRootInfo from "./SpiritRootInfo.vue";
import SpiritQiAbsorb from "./SpiritQiAbsorb.vue";
import type { SpiritRootType } from "../types/game";

const gameStore = useGameStore();
const player = computed(() => gameStore.player);

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

// 吸收灵气
const absorbSpiritQi = (spiritType: SpiritRootType) => {
  gameStore.absorbSpiritQi(spiritType);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .training-system {
    padding: 10px;
  }

  .player-info {
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
}
</style>
