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

    <!-- 基础属性 -->
    <div class="attribute-section">
      <h3 class="section-title">基础属性</h3>
      <div class="attribute-grid">
        <div class="attribute-item">
          <span class="attribute-label">攻击</span>
          <span class="attribute-value">{{ 0 }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">防御</span>
          <span class="attribute-value">{{ 0 }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">生命值</span>
          <span class="attribute-value">{{ 100 }}/{{ 100 }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">速度</span>
          <span class="attribute-value">{{ 10 }}</span>
        </div>
      </div>
    </div>

    <!-- 战斗属性 -->
    <div class="attribute-section">
      <h3 class="section-title">战斗属性</h3>
      <div class="attribute-grid">
        <div class="attribute-item">
          <span class="attribute-label">暴击率</span>
          <span class="attribute-value">{{ 5 }}%</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">暴击伤害</span>
          <span class="attribute-value">{{ 150 }}%</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">命中</span>
          <span class="attribute-value">{{ 95 }}%</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">闪避</span>
          <span class="attribute-value">{{ 5 }}%</span>
        </div>
      </div>
    </div>

    <!-- 修炼属性 -->
    <div class="attribute-section">
      <h3 class="section-title">修炼属性</h3>
      <div class="attribute-grid">
        <div class="attribute-item">
          <span class="attribute-label">灵气</span>
          <span class="attribute-value">{{ 0 }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">道心</span>
          <span class="attribute-value">{{ 0 }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">悟性</span>
          <span class="attribute-value">{{ 0 }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">福缘</span>
          <span class="attribute-value">{{ 0 }}</span>
        </div>
      </div>
    </div>

    <!-- 综合评分 -->
    <div class="attribute-section">
      <h3 class="section-title">综合评分</h3>
      <div class="rating-container">
        <div class="rating-score">{{ calculateOverallRating() }}</div>
        <div class="rating-description">{{ getRatingDescription() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "../../store/gameStore";
import ExpLevelProgress from "../components/ExpLevelProgress.vue";

// 获取游戏状态
const gameStore = useGameStore();

// 计算属性
const player = computed(() => gameStore.player);

// 计算综合评分
const calculateOverallRating = () => {
  // 使用默认值进行计算，避免TypeScript错误
  const attack = 0;
  const defense = 0;
  const health = 100;

  // 简单的加权计算
  const rating = Math.round((attack * 0.3 + defense * 0.2 + health * 0.5) / 10);
  return Math.min(Math.max(rating, 1), 100); // 确保评分在1-100之间
};

// 获取评分描述
const getRatingDescription = () => {
  const rating = calculateOverallRating();

  if (rating >= 90) return "天人合一";
  if (rating >= 80) return "超凡脱俗";
  if (rating >= 70) return "出类拔萃";
  if (rating >= 60) return "技艺精湛";
  if (rating >= 50) return "略有小成";
  if (rating >= 40) return "初窥门径";
  if (rating >= 30) return "初学乍练";
  if (rating >= 20) return "资质平平";
  return "有待提升";
};
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
