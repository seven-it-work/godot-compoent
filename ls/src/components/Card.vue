<template>
  <div
    class="card"
    :class="[
      cardType,
      { 'opponent-minion': isOpponent && cardType === 'minion' },
      { selected: isSelected && cardType === 'minion' },
      { 'highlighted-target': isHighlighted && cardType === 'minion' },
    ]"
    @click="handleClick"
  >
    <!-- 随从卡片内容 -->
    <template v-if="cardType === 'minion'">
      <!-- 随从名称 -->
      <div class="minion-name">
        {{ minion.nameCN || minion.name }}
      </div>

      <!-- 随从属性 -->
      <div class="minion-stats">
        <div class="attack">{{ minion.attack }}</div>
        <div class="health">{{ minion.health }}</div>
      </div>
    </template>

    <!-- 法术卡片内容 -->
    <template v-else-if="cardType === 'spell'">
      <div class="spell-card-inner">
        <div class="spell-name">{{ spell.nameCN }}</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Minion } from '../game/Minion';
import { Spell } from '../game/Spell';

/**
 * 卡片组件属性接口
 */
interface Props {
  /**
   * 卡片数据
   * - 可以是 Minion 类型（随从卡片）
   * - 也可以是 Spell 类型（法术卡片）
   */
  card: Minion | Spell;

  /**
   * 是否为对手的随从卡片
   * - 仅对随从卡片有效
   * - 默认值：false
   */
  isOpponent?: boolean;

  /**
   * 卡片是否被选中
   * - 仅对随从卡片有效
   * - 默认值：false
   */
  isSelected?: boolean;

  /**
   * 卡片是否被高亮为目标
   * - 仅对随从卡片有效
   * - 用于法术选择目标时的高亮效果
   * - 默认值：false
   */
  isHighlighted?: boolean;

  /**
   * 是否显示购买提示
   * - 仅对随从卡片有效
   * - 显示购买按钮和费用
   * - 默认值：false
   */
  showBuyIndicator?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOpponent: false,
  isSelected: false,
  isHighlighted: false,
  showBuyIndicator: false,
});

const emit = defineEmits(['click']);

// 计算卡片类型
const cardType = computed(() => {
  if ('attack' in props.card && 'health' in props.card) {
    return 'minion';
  } else if ('text' in props.card) {
    return 'spell';
  }
  return 'unknown';
});

// 类型断言
const minion = computed(() => props.card as Minion);
const spell = computed(() => props.card as Spell);

// 点击处理
const handleClick = () => {
  emit('click');
};
</script>

<style scoped>
/* 通用卡片样式 */
.card {
  border-radius: 6vmin;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  box-shadow: 0 0.8vmin 3.2vmin rgba(0, 0, 0, 0.15);
  width: 35vmin;
  height: 45vmin;
}

/* 随从卡片样式 */
.card.minion {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border: 0.8vmin solid #e0e0e0;
}

.card.minion:hover:not(.opponent-minion) {
  transform: translateY(-3.2vmin);
  box-shadow: 0 3.2vmin 8vmin rgba(255, 215, 0, 0.6);
  border-color: #ffd700;
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
}

.card.minion.opponent-minion {
  transform: scale(-1, -1);
  cursor: default;
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
}

.card.minion.selected {
  box-shadow: 0 0 10vmin rgba(255, 215, 0, 0.9);
  border-color: #ffd700;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  transform: translateY(-2vmin);
}

.card.minion.highlighted-target {
  box-shadow: 0 0 12vmin rgba(76, 175, 80, 0.95);
  border-color: #4caf50;
  animation: pulse 0.6s infinite alternate;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
}

@keyframes pulse {
  from {
    box-shadow: 0 0 10vmin rgba(76, 175, 80, 0.85);
  }
  to {
    box-shadow: 0 0 16vmin rgba(76, 175, 80, 1);
  }
}

/* 随从卡片内部元素 */
.minion-star {
  position: absolute;
  top: -3vmin;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  box-shadow: 0 0.8vmin 2vmin rgba(0, 0, 0, 0.4);
  font-size: 3vmin;
  border: 0.5vmin solid white;
}

.opponent-minion .minion-star {
  top: auto;
  bottom: -3vmin;
  transform: translateX(-50%) scale(1, 1);
}

.minion-type {
  text-align: center;
  font-size: 11px;
  color: #555;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.minion-name {
  text-align: center;
  font-size: 12vmin;
  font-weight: bold;
  color: #2c3e50;
  text-shadow: 0 0.4vmin 0.8vmin rgba(255, 255, 255, 0.8);
  margin-bottom: 4vmin;
}

.minion-stats {
  display: flex;
  justify-content: space-around;
  font-size: 6vmin;
  font-weight: bold;
}

.attack {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 6vmin;
}

.health {
  color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
  border-radius: 6vmin;
}

.minion-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.keyword-tag {
  font-size: 10px;
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
  border-radius: 10px;
  font-size: 11px;
}

.minion-status {
  background: linear-gradient(135deg, #95a5a6 0%, #bdc3c7 100%);
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* 法术卡片样式 */
.card.spell {
  background-color: #0066cc;
  border: 0.8vmin solid #003366;
  overflow: auto;
}

.card.spell:hover {
  transform: translateY(-2vmin);
  box-shadow: 0 1.6vmin 3.2vmin rgba(0, 0, 0, 0.4);
}

/* 法术卡片内部元素 */
.spell-card-inner {
  display: flex;
  flex-direction: column;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%;
}

.spell-name {
  font-size: 8vmin;
  font-weight: bold;
  color: white;
  text-align: center;
}
</style>
