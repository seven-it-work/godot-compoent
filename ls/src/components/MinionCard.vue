<template>
  <div
    class="minion-card"
    :class="{
      'opponent-minion': isOpponent,
      selected: isSelected,
      'highlighted-target': isHighlighted,
    }"
    @click="$emit('click')"
  >
    <!-- 随从星级 -->
    <div class="minion-star" :style="{ backgroundColor: getStarColor(minion.tier || 1) }">
      {{ minion.tier || 1 }}
    </div>

    <!-- 随从类型 -->
    <div class="minion-type">{{ minion.minionTypesCN.join('/') || '中立' }}</div>

    <!-- 随从名称 -->
    <div class="minion-name">
      {{ minion.nameCN || minion.name }}
    </div>

    <!-- 随从属性 -->
    <div class="minion-stats">
      <div class="attack">{{ minion.attack }}</div>
      <div class="health">{{ minion.health }}</div>
    </div>

    <!-- 随从关键词 -->
    <div class="minion-keywords">
      <span v-for="keyword in minion.keywords" :key="keyword" class="keyword-tag">
        {{ getKeywordName(keyword) }}
      </span>
    </div>

    <!-- 购买提示（可选） -->
    <div v-if="showBuyIndicator" class="buy-indicator">
      <span class="cost">{{ minion.cost }}</span>
      购买
    </div>

    <!-- 随从状态（可选） -->
    <div v-if="minion.hasAttacked" class="minion-status">
      <span>已攻击</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Minion } from '../game/Minion';

// 定义组件属性
interface Props {
  minion: Minion;
  isOpponent?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  showBuyIndicator?: boolean;
}

// 定义组件事件
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(['click']);

// 接收属性
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  isOpponent: false,
  isSelected: false,
  isHighlighted: false,
  showBuyIndicator: false,
});

// 获取星级颜色
const getStarColor = (star: number) => {
  const colors = [
    '#ffffff', // 0星
    '#757575', // 1星
    '#1e88e5', // 2星
    '#43a047', // 3星
    '#fb8c00', // 4星
    '#e53935', // 5星
    '#8e24aa', // 6星
  ];
  return colors[Math.min(star, 6)];
};

// 获取关键词名称
const getKeywordName = (keyword: string) => {
  const keywordMap: { [key: string]: string } = {
    taunt: '嘲讽',
    divine_shield: '圣盾',
    windfury: '风怒',
    super_windfury: '超级风怒',
    stealth: '潜行',
    charge: '冲锋',
    poisonous: '剧毒',
    reborn: '复生',
    immune: '免疫',
  };
  return keywordMap[keyword] || keyword;
};
</script>

<style scoped>
.minion-card {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid #e0e0e0;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.minion-card:hover:not(.opponent-minion) {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.6);
  border-color: #ffd700;
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
}

.opponent-minion {
  transform: scaleY(-1); /* 翻转对手随从，让它们面向玩家 */
  cursor: default;
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
}

.selected {
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.9);
  border-color: #ffd700;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  transform: translateY(-5px);
}

/* 高亮目标样式 - 用于法术选择目标时 */
.highlighted-target {
  box-shadow: 0 0 30px rgba(76, 175, 80, 0.95);
  border-color: #4caf50;
  animation: pulse 0.6s infinite alternate;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
}

/* 高亮脉冲动画 */
@keyframes pulse {
  from {
    box-shadow: 0 0 25px rgba(76, 175, 80, 0.85);
  }
  to {
    box-shadow: 0 0 40px rgba(76, 175, 80, 1);
  }
}

.minion-star {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
  font-size: 14px;
  border: 2px solid white;
}

.opponent-minion .minion-star {
  top: auto;
  bottom: -12px;
  transform: translateX(-50%) scaleY(-1); /* 调整对手随从的星级位置 */
}

.minion-type {
  text-align: center;
  font-size: 11px;
  color: #555;
  margin-top: 22px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.opponent-minion .minion-type {
  margin-top: 0;
  margin-bottom: 22px;
}

.minion-name {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin: 8px 0;
  color: #2c3e50;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.minion-stats {
  display: flex;
  justify-content: space-around;
  font-size: 20px;
  font-weight: bold;
  margin: 12px 0;
  padding: 8px 0;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}

.attack {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.health {
  color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.minion-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin: 8px 0;
  padding: 5px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.keyword-tag {
  font-size: 10px;
  padding: 3px 8px;
  background-color: #3498db;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.buy-indicator {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #2c3e50;
  padding: 6px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border: 1px solid #f1c40f;
}

.buy-indicator .cost {
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
}

.minion-status {
  background: linear-gradient(135deg, #95a5a6 0%, #bdc3c7 100%);
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  text-align: center;
  margin-top: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
