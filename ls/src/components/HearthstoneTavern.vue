<template>
  <div class="row" @dragover.prevent="onDragOver" @drop="onDrop($event, 'tavern')">
    <!-- 直接渲染7个HearthstoneCard组件 -->
    <HearthstoneCard
      v-for="slotIndex in 7"
      :key="`tavern-${slotIndex}`"
      :card="tavern?.availableMinions?.[slotIndex - 1]"
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
</script>

<style scoped>
.row {
  display: flex;
  flex: 1;
  gap: 15px;
  justify-content: center;
}
</style>
