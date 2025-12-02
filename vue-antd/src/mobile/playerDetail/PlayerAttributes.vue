<template>
  <div class="attributes-container">
    <!-- 顶部区域：头像和基本信息 -->
    <a-row :gutter="[4, 4]" class="player-basic-info">
      <!-- 头像区域 -->
      <a-col :span="6">
        <div class="avatar-card">
          <div class="avatar-container">
            <div class="avatar">
              <div class="avatar-placeholder">修</div>
            </div>
            <div class="player-name">{{ player.name }}</div>
            <div class="player-level">等级: {{ player.level }}</div>
          </div>
        </div>
      </a-col>
      <!-- 等级和经验区域 -->
      <a-col :span="18">
        <div class="level-card">
          <div class="exp-bar-container">
            <ExpLevelProgress
              label="等级"
              :level="player.level"
              :current="player.exp"
              :max="player.maxExp"
              strokeColor="#52c41a"
              height="24px"
            />
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 战斗属性 -->
    <div class="attribute-section">
      <h3 class="section-title">战斗属性</h3>
      <div class="attribute-grid">
        <div class="attribute-item">
          <span class="attribute-label">攻击</span>
          <span class="attribute-value">{{ attackRange }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">防御</span>
          <span class="attribute-value">{{ defenseRange }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">生命值</span>
          <span class="attribute-value"
            >{{ player.attributes.health }}/{{
              player.attributes.maxHealth
            }}</span
          >
        </div>
        <div class="attribute-item">
          <span class="attribute-label">攻击速度</span>
          <span class="attribute-value">{{
            player.attributes.attackSpeed
          }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">闪避</span>
          <span class="attribute-value">{{ dodgeRange }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">格挡</span>
          <span class="attribute-value">{{ blockRange }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">暴击</span>
          <span class="attribute-value">{{ criticalRange }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "../../store/gameStore";
import ExpLevelProgress from "../components/ExpLevelProgress.vue";
import { RandomRangeGrowth } from "../../classes/growth";

// 获取游戏状态
const gameStore = useGameStore();

// 计算属性
const player = computed(() => gameStore.player);

// 计算攻击范围
const attackRange = computed(() => {
  const baseAttack = 5;
  let minAttack = baseAttack;
  let maxAttack = baseAttack + 2;

  // 根据等级计算攻击范围
  for (let i = 1; i < player.value.level; i++) {
    const growth = new RandomRangeGrowth(
      baseAttack,
      1,
      3,
      minAttack,
      maxAttack,
      false,
      true,
      1
    );
    growth.grow();
    minAttack = Math.floor(growth.getMinValue());
    maxAttack = Math.floor(growth.getMaxValue());
  }

  return `${minAttack}~${maxAttack}`;
});

// 计算防御范围
const defenseRange = computed(() => {
  const baseDefense = 3;
  let minDefense = baseDefense;
  let maxDefense = baseDefense + 1;

  // 根据等级计算防御范围
  for (let i = 1; i < player.value.level; i++) {
    const growth = new RandomRangeGrowth(
      baseDefense,
      1,
      2,
      minDefense,
      maxDefense,
      false,
      true,
      1
    );
    growth.grow();
    minDefense = Math.floor(growth.getMinValue());
    maxDefense = Math.floor(growth.getMaxValue());
  }

  return `${minDefense}~${maxDefense}`;
});

// 计算闪避范围
const dodgeRange = computed(() => {
  const level = player.value.level;
  const baseDodge = 5;
  // 模拟闪避成长过程
  const dodgeGrowth = new RandomRangeGrowth(
    baseDodge,
    0.5,
    1,
    baseDodge - 0.5,
    baseDodge + 0.5,
    false,
    true
  );
  for (let i = 1; i < level; i++) {
    dodgeGrowth.grow();
  }
  return `${Math.floor(dodgeGrowth.getMinValue())}%~${Math.floor(dodgeGrowth.getMaxValue())}%`;
});

// 计算格挡范围
const blockRange = computed(() => {
  const level = player.value.level;
  const baseBlock = 3;
  // 模拟格挡成长过程
  const blockGrowth = new RandomRangeGrowth(
    baseBlock,
    0.5,
    1,
    baseBlock - 0.5,
    baseBlock + 0.5,
    false,
    true
  );
  for (let i = 1; i < level; i++) {
    blockGrowth.grow();
  }
  return `${Math.floor(blockGrowth.getMinValue())}%~${Math.floor(blockGrowth.getMaxValue())}%`;
});

// 计算暴击范围
const criticalRange = computed(() => {
  const level = player.value.level;
  const baseCritical = 4;
  // 模拟暴击成长过程
  const criticalGrowth = new RandomRangeGrowth(
    baseCritical,
    0.5,
    1,
    baseCritical - 0.5,
    baseCritical + 0.5,
    false,
    true
  );
  for (let i = 1; i < level; i++) {
    criticalGrowth.grow();
  }
  return `${Math.floor(criticalGrowth.getMinValue())}%~${Math.floor(criticalGrowth.getMaxValue())}%`;
});
</script>

<style scoped>
.attributes-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
}

/* 玩家基本信息样式 */
.player-basic-info {
  margin-bottom: 8px;
}

.avatar-card {
  height: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.avatar-placeholder {
  font-size: 24px;
  color: #fff;
  font-weight: bold;
}

.player-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.player-level {
  font-size: 12px;
  color: #666;
}

.level-card {
  height: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

.exp-bar-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0;
}

.attribute-section {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f0f0f0;
}

.attribute-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.attribute-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background: #fafafa;
  border-radius: 4px;
  font-size: 12px;
}

.attribute-label {
  color: #666;
}

.attribute-value {
  color: #333;
  font-weight: bold;
}

.rating-container {
  text-align: center;
  padding: 8px 0;
}

.rating-score {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 4px;
}

.rating-description {
  font-size: 14px;
  color: #666;
}

/* 响应式优化 */
@media (max-width: 480px) {
  .attribute-grid {
    grid-template-columns: 1fr;
  }

  .rating-score {
    font-size: 20px;
  }

  .section-title {
    font-size: 13px;
  }
}
</style>
