<template>
  <div class="row" @dragover.prevent="onDragOver" @drop="onDrop($event, 'tavern')">
    <!-- 直接渲染7个HearthstoneCard组件 -->
    <HearthstoneCard
      v-for="slotIndex in 7"
      :key="`tavern-${slotIndex}`"
      :card="tavern?.availableMinions?.[slotIndex - 1]"
      :index="slotIndex - 1"
      :is-selected="
        gameStore.selectedMinion?.instanceId ===
        tavern?.availableMinions?.[slotIndex - 1]?.instanceId
      "
      :is-highlighted="
        isMinionHighlighted(tavern?.availableMinions?.[slotIndex - 1], 'tavern', slotIndex - 1)
      "
      @click="selectMinion(tavern?.availableMinions?.[slotIndex - 1], slotIndex - 1)"
      :source="'tavern'"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/game';
import HearthstoneCard from './HearthstoneCard.vue';

const gameStore = useGameStore();
console.log(gameStore);
// 从gameStore获取tavern - 使用computed确保响应式更新
const tavern = computed(() => gameStore.tavern);

// 选择/取消选择随从
const selectMinion = (minion: any, index: number) => {
  // 如果当前处于法术选择目标状态，选择该随从作为目标
  if (gameStore.spellUsageState === 'selecting_target' && gameStore.selectedSpell) {
    // 查找该随从是否在可用目标列表中
    const target = gameStore.highlightedTargets.find(
      t => t.source === 'tavern' && t.index === index && t.target === minion
    );

    if (target) {
      gameStore.selectSpellTarget(target);
    }
  }
};

// 判断随从是否为高亮目标
const isMinionHighlighted = (minion: any, source: string, index: number) => {
  if (!gameStore.selectedSpell || gameStore.spellUsageState !== 'selecting_target') {
    return false;
  }

  // 检查该随从是否在高亮目标列表中
  return gameStore.highlightedTargets.some(
    target => target.source === source && target.index === index && target.target === minion
  );
};

// 拖拽开始事件将由HearthstoneCard组件内部处理

// 拖拽经过事件
const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

// 拖拽放置事件（用于接收战场上的随从，进行出售）
const onDrop = (event: DragEvent, target: string) => {
  event.preventDefault();
  const data = event.dataTransfer?.getData('text/plain');
  if (data) {
    try {
      const dragData = JSON.parse(data);
      // 如果是从战场拖拽到酒馆，执行出售操作
      if (dragData.source === 'battlefield' && target === 'tavern') {
        gameStore.sellMinion('minion', dragData.index);
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
*/

/*
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
.row {
  display: flex;
  flex: 1;
  gap: 15px;
  justify-content: center;
  touch-action: none; /* 禁用浏览器默认触摸行为 */
}
</style>
