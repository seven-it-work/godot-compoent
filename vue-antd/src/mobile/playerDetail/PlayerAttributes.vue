<template>
  <div class="attributes-container">
    <!-- 基础属性 -->
    <div class="attribute-section">
      <h3 class="section-title">基础属性</h3>
      <div class="attribute-grid">
        <div class="attribute-item">
          <span class="attribute-label">攻击</span>
          <span class="attribute-value">{{ player.attributes?.attack || 0 }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">防御</span>
          <span class="attribute-value">{{ player.attributes?.defense || 0 }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">生命值</span>
          <span class="attribute-value">{{ player.attributes?.health || 100 }}/{{ player.attributes?.maxHealth || 100 }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">速度</span>
          <span class="attribute-value">{{ player.attributes?.speed || 10 }}</span>
        </div>
      </div>
    </div>
    
    <!-- 战斗属性 -->
    <div class="attribute-section">
      <h3 class="section-title">战斗属性</h3>
      <div class="attribute-grid">
        <div class="attribute-item">
          <span class="attribute-label">暴击率</span>
          <span class="attribute-value">{{ player.combatStats?.criticalRate || 5 }}%</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">暴击伤害</span>
          <span class="attribute-value">{{ player.combatStats?.criticalDamage || 150 }}%</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">命中</span>
          <span class="attribute-value">{{ player.combatStats?.accuracy || 95 }}%</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">闪避</span>
          <span class="attribute-value">{{ player.combatStats?.evasion || 5 }}%</span>
        </div>
      </div>
    </div>
    
    <!-- 修炼属性 -->
    <div class="attribute-section">
      <h3 class="section-title">修炼属性</h3>
      <div class="attribute-grid">
        <div class="attribute-item">
          <span class="attribute-label">灵气</span>
          <span class="attribute-value">{{ player.cultivation?.spiritualEnergy || 0 }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">道心</span>
          <span class="attribute-value">{{ player.cultivation?.daoHeart || 0 }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">悟性</span>
          <span class="attribute-value">{{ player.cultivation?.insight || 0 }}</span>
        </div>
        <div class="attribute-item">
          <span class="attribute-label">福缘</span>
          <span class="attribute-value">{{ player.cultivation?.luck || 0 }}</span>
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
import { computed } from 'vue';
import { useGameStore } from '../../store/gameStore';

const gameStore = useGameStore();

// 计算属性
const player = computed(() => gameStore.player);

// 计算综合评分
const calculateOverallRating = () => {
  // 假设这是一个简单的评分计算逻辑
  const attack = player.value.attributes?.attack || 0;
  const defense = player.value.attributes?.defense || 0;
  const health = player.value.attributes?.maxHealth || 100;
  
  // 简单的加权计算
  const rating = Math.round((attack * 0.3 + defense * 0.2 + health * 0.5) / 10);
  return Math.min(Math.max(rating, 1), 100); // 确保评分在1-100之间
};

// 获取评分描述
const getRatingDescription = () => {
  const rating = calculateOverallRating();
  
  if (rating >= 90) return '天人合一';
  if (rating >= 80) return '超凡脱俗';
  if (rating >= 70) return '出类拔萃';
  if (rating >= 60) return '技艺精湛';
  if (rating >= 50) return '略有小成';
  if (rating >= 40) return '初窥门径';
  if (rating >= 30) return '初学乍练';
  if (rating >= 20) return '资质平平';
  return '有待提升';
};
</script>

<style scoped>
.attributes-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
}

.attribute-section {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
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