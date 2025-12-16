<template>
  <div
    v-if="props.card"
    class="hearthstone-card"
    :class="{
      selected: isSelected,
      highlighted: isHighlighted,
      dragging: isDragging,
    }"
    @click="handleClick"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    v-bind="$attrs"
  >
    <!-- 等级 -->
    <div class="corner-circle top-left">
      <span class="circle-text big">{{ getCardTier() }}</span>
    </div>
    <!-- 酒馆购买花费 -->
    <div v-if="props.source === 'tavern'" class="corner-circle top-right">
      <span class="circle-text big">{{ getCardCost() }}</span>
    </div>

    <!-- 卡牌名称 -->
    <div class="card-name">{{ getCardName() }}</div>

    <!-- 中间内容区域 -->
    <div class="card-content">
      <slot></slot>
    </div>

    <!-- 底部区域 - 只有随从才显示 -->
    <div v-if="props.card?.cardType === 'minion'" class="card-bottom">
      <!-- 攻击力 -->
      <div class="corner-circle bottom-left">
        <span class="circle-text attack">{{ getCardAttack() }}</span>
      </div>

      <!-- 种族 -->
      <div class="bottom-texts">
        <span v-if="getCardRace()" class="text-item">{{ getCardRace() }}</span>
      </div>

      <!-- 生命值 -->
      <div class="corner-circle bottom-right">
        <span class="circle-text health">{{ getCardHealth() }}</span>
      </div>
    </div>
  </div>
  <div v-else class="hearthstone-card hearthstone-card-empty" :class="$attrs.class" v-bind="$attrs">
    空
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Card } from '../game/Card';
import type { Minion } from '../game/Minion';
import type { Spell } from '../game/Spell';
import { useGameStore } from '../stores/game';
// 使用游戏store
const gameStore = useGameStore();

// 定义组件属性
const props = defineProps<{
  card: Card | null | undefined;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isDragging?: boolean;
  index?: number;
  source: 'battlefield' | 'tavern' | 'hand' | undefined;
}>();

// 定义组件事件
const emit = defineEmits(['click', 'card-selected']);

// 选择卡片
const selectCard = () => {
  if (props.card) {
    if (props.card.cardType === 'minion') {
      gameStore.selectMinion(props.card as Minion, props.index || 0, props.source || 'hand');
    } else if (props.card.cardType === 'spell') {
      gameStore.selectSpell(props.card as Spell, props.index || 0);
    }
    emit('card-selected', props.card, props.index);
  }
};

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  selectCard();
  emit('click', event);
};

// 定义组件状态
const isDragging = ref(false);
const isHovering = ref(false);

// 拖拽开始事件
const onDragStart = (event: DragEvent) => {
  let cardData: any = null;
  let cardType: string = 'minion';

  if (props.card) {
    cardData = props.card;
    cardType = props.card.cardType;
  }

  if (!cardData) {
    event.preventDefault();
    return;
  }

  isDragging.value = true;

  // 设置自定义拖拽图像，解决拖拽对象过大问题
  if (event.dataTransfer && event.target) {
    // 创建一个新的拖拽图像元素
    const dragImage = document.createElement('div');
    dragImage.className = 'hearthstone-card-drag-image';
    dragImage.textContent = props.card?.name || 'Card';

    // 设置拖拽图像样式
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.left = '-1000px';
    dragImage.style.width = '150px';
    dragImage.style.height = '200px';
    dragImage.style.border = '2px solid #000';
    dragImage.style.backgroundColor = '#e0e0e0';
    dragImage.style.borderRadius = '8px';
    dragImage.style.display = 'flex';
    dragImage.style.alignItems = 'center';
    dragImage.style.justifyContent = 'center';
    dragImage.style.fontSize = '16px';
    dragImage.style.fontWeight = 'bold';

    // 将拖拽图像添加到文档中
    document.body.appendChild(dragImage);

    // 设置拖拽图像
    event.dataTransfer.setDragImage(dragImage, 75, 100);

    // 拖拽结束后移除拖拽图像
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  }

  if (cardType === 'spell') {
    // 法术卡片拖拽，使用自定义逻辑
    gameStore.startSpellDrag(event, cardData, props.index || 0);
    event.preventDefault();
  } else {
    // 其他卡片类型使用原有拖拽逻辑
    const dragData = {
      source: props.source || 'hand',
      index: props.index || 0,
      cardId: cardData.id || cardData.instanceId,
      strId: cardData.strId,
      cardType: cardType,
    };
    console.log(
      `[拖拽开始] 从${dragData.source}拖拽第${dragData.index}个位置的${dragData.cardType}`
    );
    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }
};

// 拖拽结束事件
const onDragEnd = () => {
  isDragging.value = false;
};

// 鼠标进入事件
const onMouseEnter = () => {
  isHovering.value = true;
};

// 鼠标离开事件
const onMouseLeave = () => {
  isHovering.value = false;
};

// 获取卡片等级
const getCardTier = () => {
  if (props.card?.cardType === 'minion') {
    return (props.card as Minion).tier;
  }
  return 2;
};

// 获取卡片花费
const getCardCost = () => {
  if (props.card) {
    return props.card.cost;
  }
  return 1;
};

// 获取卡片名称
const getCardName = () => {
  if (props.card) {
    return props.card.nameCN;
  }
  return '名称';
};

// 获取卡片攻击力
const getCardAttack = () => {
  if (props.card?.cardType === 'minion') {
    return (props.card as Minion).attack;
  }
  return 999999;
};

// 获取卡片生命值
const getCardHealth = () => {
  if (props.card?.cardType === 'minion') {
    return (props.card as Minion).health;
  }
  return 999999;
};

// 获取卡片种族
const getCardRace = () => {
  if (props.card?.cardType === 'minion') {
    return (props.card as Minion).minionTypesCN?.join('/');
  }
  return null;
};
</script>

<style scoped>
.hearthstone-card {
  height: 21vh;
  width: 15vw;
  flex: 1;
  border: 2px solid #000;
  background-color: #e0e0e0;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin: 10px 20px;
}

/* 角落圆形 */
.corner-circle {
  position: absolute;
  width: 2.5vw;
  height: 4vh;
  border-radius: 2vw;
  border: 2px solid #000;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-left {
  top: -5%;
  left: -5%;
}

.top-right {
  top: -5%;
  right: -5%;
}

.bottom-left {
  bottom: -5%;
  left: -5%;
}

.bottom-right {
  bottom: -5%;
  right: -5%;
}

/* 圆形文本 */
.circle-text {
  font-weight: bold;
  color: #000;
}

/* 卡牌名称 */
.card-name {
  text-align: center;
  font-size: 2vw;
  font-weight: bold;
  margin: 15% 0 5% 0;
}

/* 卡牌内容区域 */
.card-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 底部区域 */
.card-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20%;
}

/* 底部文本 */
.bottom-texts {
  display: flex;
  gap: 10%;
  font-size: 1vw;
  font-weight: bold;
  justify-content: center;
}

.text-item {
  white-space: nowrap;
}

.attack {
  font-size: 1vw;
  color: #ff5555;
}
.health {
  font-size: 1vw;
  color: #55ff55;
}
.big {
  font-size: 2vw;
}

/* 选中状态 */
.hearthstone-card.selected {
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
  transform: scale(1.05);
  transition: all 0.2s ease;
}

/* 高亮状态 */
.hearthstone-card.highlighted {
  border-color: #409eff;
  box-shadow: 0 0 15px rgba(64, 158, 255, 0.7);
  transform: scale(1.03);
  transition: all 0.2s ease;
}

/* 拖拽状态 */
.hearthstone-card.dragging {
  opacity: 0.7;
  transform: scale(1.08) rotate(5deg);
  transition: all 0.2s ease;
  z-index: 100;
}

/* 悬停状态 */
.hearthstone-card:hover:not(.dragging) {
  transform: scale(1.02);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

/* 统一过渡动画 */
.hearthstone-card {
  transition: all 0.2s ease;
}

/* 空卡片样式 */
.hearthstone-card-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10vh;
  font-weight: 500;
  color: #909399;
  border: 2px dashed #c0c4cc;
  border-radius: 8px;
  background-color: rgba(240, 242, 245, 0.5);
}
</style>
