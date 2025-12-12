<template>
  <div
    class="minion-card"
    :class="{ 'opponent-minion': isOpponent, selected: isSelected }"
    @click="$emit('click')"
  >
    <!-- 随从星级 -->
    <div class="minion-star" :style="{ backgroundColor: getStarColor(minion.tier) }">
      {{ minion.tier }}
    </div>

    <!-- 随从类型 -->
    <div class="minion-type">
      {{ minion.minionTypesCN.join('/') || '中立' }}
    </div>

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
  showBuyIndicator?: boolean;
}

// 定义组件事件
const emit = defineEmits(['click']);

// 接收属性
const props = withDefaults(defineProps<Props>(), {
  isOpponent: false,
  isSelected: false,
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
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid rgba(0, 0, 0, 0.3);
  position: relative;
}

.minion-card:hover:not(.opponent-minion) {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.5);
  border-color: #ffd700;
}

.opponent-minion {
  transform: scaleY(-1); /* 翻转对手随从，让它们面向玩家 */
  cursor: default;
}

.selected {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  border-color: #ffd700;
}

.minion-star {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.opponent-minion .minion-star {
  top: auto;
  bottom: -10px;
  transform: translateX(-50%) scaleY(-1); /* 调整对手随从的星级位置 */
}

.minion-type {
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 20px;
}

.opponent-minion .minion-type {
  margin-top: 0;
  margin-bottom: 20px;
}

.minion-name {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  margin: 5px 0;
  color: black;
}

.minion-stats {
  display: flex;
  justify-content: space-around;
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
}

.attack {
  color: #ff5555;
}

.health {
  color: #55ff55;
}

.minion-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  margin: 5px 0;
}

.keyword-tag {
  font-size: 10px;
  padding: 2px 6px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  color: white;
}

.buy-indicator {
  background-color: rgba(255, 215, 0, 0.8);
  color: black;
  padding: 5px;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.minion-status {
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  margin-top: 5px;
}
</style>
