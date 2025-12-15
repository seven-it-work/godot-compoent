<template>
  <div class="row" @dragover.prevent="onDragOver" @drop="onDrop($event, 'tavern')">
    <!-- 固定7个格子，每个格子对应一个位置 -->
    <div
      v-for="slotIndex in 7"
      :key="`tavern-${slotIndex}`"
      class="card-slot"
      :class="{ empty: !tavern?.availableMinions?.[slotIndex - 1] }"
      draggable="true"
      @dragstart="
        onDragStart($event, 'tavern', slotIndex - 1, tavern?.availableMinions?.[slotIndex - 1])
      "
    >
      <!-- 如果该位置有随从，渲染随从卡片 -->
      <HearthstoneCard
        v-if="tavern?.availableMinions?.[slotIndex - 1]"
        :minion="tavern.availableMinions[slotIndex - 1] as Minion"
        :is-selected="
          gameStore.selectedMinion?.instanceId ===
          tavern.availableMinions[slotIndex - 1]?.instanceId
        "
        :is-highlighted="
          isMinionHighlighted(tavern.availableMinions[slotIndex - 1], 'tavern', slotIndex - 1)
        "
        @click="selectMinion(tavern.availableMinions[slotIndex - 1] as Minion, slotIndex - 1)"
      />
      <!-- 如果该位置没有随从，渲染空槽 -->
      <div v-else class="empty-slot">
        <span>空</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { Minion } from '../game/Minion';
import { useGameStore } from '../stores/game';
import HearthstoneCard from './HearthstoneCard.vue';

const gameStore = useGameStore();

// 从父组件注入宽高比状态
const cardRatio = inject('cardRatio', ref('3/4'));

// 从gameStore获取tavern
const tavern = gameStore.tavern;

// 选择/取消选择随从
const selectMinion = (minion: Minion, index: number) => {
  // 如果当前处于法术选择目标状态，选择该随从作为目标
  if (gameStore.spellUsageState === 'selecting_target' && gameStore.selectedSpell) {
    // 查找该随从是否在可用目标列表中
    const target = gameStore.highlightedTargets.find(
      t => t.source === 'tavern' && t.index === index && t.target === minion
    );

    if (target) {
      gameStore.selectSpellTarget(target);
    }
  } else {
    // 否则正常选择/取消选择随从
    if (gameStore.selectedMinion && gameStore.selectedMinionIndex === index) {
      // 取消选择
      gameStore.cancelSelectMinion();
    } else {
      // 选择新的随从，来源为酒馆
      gameStore.selectMinion(minion, index, 'tavern');
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

// 拖拽开始事件
const onDragStart = (event: DragEvent, source: string, index: number, minion: any) => {
  if (!minion) {
    return;
  }
  event.dataTransfer?.setData(
    'text/plain',
    JSON.stringify({
      source,
      index,
      minionId: minion.instanceId,
      strId: minion.strId,
    })
  );
};

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
}

.card-slot {
  flex: 1;
  position: relative;
  transition: all 0.2s ease;
  margin: 0 5px;
}

.card-slot.empty {
  border: 2px dashed #c0c4cc;
  border-radius: 8px;
  background-color: rgba(240, 242, 245, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-slot {
  font-size: 10vh;
  color: #909399;
  font-weight: 500;
}
</style>
