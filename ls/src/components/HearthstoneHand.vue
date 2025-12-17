<template>
  <div class="right-subsection" @dragover.prevent @drop="onDrop($event, 'hand')">
    <div class="row">
      <!-- 第一行：前5个卡牌槽 -->
      <HearthstoneCard
        v-for="(slot, index) in firstRowCards"
        :key="slot?.id || `card-${index}`"
        :card="slot"
        :index="index"
        :source="'hand'"
        @click="selectCard(slot, index)"
      ></HearthstoneCard>
      <HearthstoneCard
        v-for="emptyIndex in firstRowEmptySlots"
        :key="`empty-top-${emptyIndex}`"
        :card="null"
        :index="emptyIndex + (player?.cards.length || 0)"
        :source="'hand'"
      ></HearthstoneCard>
    </div>
    <div class="row">
      <!-- 第二行：后5个卡牌槽 -->
      <HearthstoneCard
        v-for="(slot, index) in secondRowCards"
        :key="slot?.id || `card-${index + 5}`"
        :card="slot"
        :index="index + 5"
        :source="'hand'"
        @click="selectCard(slot, index + 5)"
      ></HearthstoneCard>
      <HearthstoneCard
        v-for="emptyIndex in secondRowEmptySlots"
        :key="`empty-bottom-${emptyIndex}`"
        :card="null"
        :index="emptyIndex + 5 + Math.min(player?.cards.length || 0, 5)"
        :source="'hand'"
      ></HearthstoneCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/game';
import HearthstoneCard from './HearthstoneCard.vue';

// 使用游戏store
const gameStore = useGameStore();
// 从gameStore获取player - 使用computed确保响应式更新
const player = computed(() => gameStore.player);

// 计算第一行的卡牌（前5张）
const firstRowCards = computed(() => {
  if (!player.value?.cards) return [];
  return player.value.cards.slice(0, 5);
});

// 计算第二行的卡牌（第6-10张）
const secondRowCards = computed(() => {
  if (!player.value?.cards) return [];
  return player.value.cards.slice(5, 10);
});

// 计算第一行的空槽数量
const firstRowEmptySlots = computed(() => {
  const maxFirstRowSlots = 5;
  const currentFirstRowCards = firstRowCards.value.length;
  return Math.max(0, maxFirstRowSlots - currentFirstRowCards);
});

// 计算第二行的空槽数量
const secondRowEmptySlots = computed(() => {
  const maxSecondRowSlots = 5;
  const currentSecondRowCards = secondRowCards.value.length;
  return Math.max(0, maxSecondRowSlots - currentSecondRowCards);
});

// 选择卡片功能
const selectCard = (card: any, index: number) => {
  // 选择卡片的逻辑可以在这里添加
  console.log(`选择了手牌中的第${index}个位置的卡片:`, card);
};

// 拖拽放置事件
const onDrop = (event: DragEvent, target: string) => {
  event.preventDefault();
  const data = event.dataTransfer?.getData('text/plain');
  if (data) {
    try {
      const dragData = JSON.parse(data);
      console.log(`[拖拽放置] 从${dragData.source}拖拽第${dragData.index}个位置的卡牌到手牌`);
      // 如果是从酒馆拖拽到手牌，执行购买操作
      if (dragData.source === 'tavern' && target === 'hand') {
        // 找到对应的酒馆随从索引
        const tavernIndex = dragData.index;
        console.log(`[购买随从] 尝试购买酒馆第${tavernIndex}个位置的随从`);
        // 购买随从，只有当条件满足时，卡片才会从酒馆移除
        const success = gameStore.buyMinion(tavernIndex);
        console.log(`[购买结果] ${success ? '购买成功' : '购买失败，可能是金币不足或手牌已满'}`);
      }
    } catch (_error) {
      // console.error('无效的拖拽数据:', error);
    }
  }
};
/*
// 处理touch事件
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let isTouchDragging = false;

// 触摸开始事件
const onTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  touchStartTime = Date.now();
  isTouchDragging = false;
};

// 触摸移动事件
const onTouchMove = (event: TouchEvent) => {
  if (!isTouchDragging) {
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartX);
    const deltaY = Math.abs(touch.clientY - touchStartY);

    // 检测是否为拖拽动作
    if (deltaX > 10 || deltaY > 10) {
      isTouchDragging = true;
      event.preventDefault();
    }
  } else {
    event.preventDefault();
  }
};

// 触摸结束事件
const onTouchEnd = (event: TouchEvent) => {
  if (isTouchDragging) {
    isTouchDragging = false;
  }
};

// 初始化事件监听
onMounted(() => {
  // 添加touch事件监听
  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd, { passive: true });
  document.addEventListener('touchcancel', onTouchEnd, { passive: true });
});

// 移除事件监听
onUnmounted(() => {
  document.removeEventListener('touchstart', onTouchStart);
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchEnd);
  document.removeEventListener('touchcancel', onTouchEnd);
});
*/
</script>

<style scoped>
.right-subsection {
  width: 70vw;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  touch-action: none; /* 禁用浏览器默认触摸行为 */
}

.row {
  display: flex;
  flex: 1;
  touch-action: none; /* 禁用浏览器默认触摸行为 */
}
</style>
