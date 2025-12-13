<template>
  <div class="tavern-container" @dragover.prevent="onDragOver" @drop="onDrop($event, 'tavern')">
    <!-- 可用随从区 -->
    <div class="minions-area">
      <!-- 固定7个格子，每个格子对应一个位置 -->
      <div
        v-for="slotIndex in 7"
        :key="slotIndex"
        class="minion-slot"
        :class="{ empty: !tavern?.availableMinions?.[slotIndex - 1] }"
        draggable="true"
        @dragstart="
          onDragStart($event, 'tavern', slotIndex - 1, tavern?.availableMinions?.[slotIndex - 1])
        "
      >
        <!-- 如果该位置有随从，渲染随从卡片 -->
        <MinionCard
          v-if="tavern?.availableMinions?.[slotIndex - 1]"
          :minion="tavern.availableMinions[slotIndex - 1] as Minion"
          :is-selected="
            gameStore.selectedMinion?.instanceId ===
            tavern.availableMinions[slotIndex - 1]?.instanceId
          "
          @click="selectMinion(tavern.availableMinions[slotIndex - 1] as Minion, slotIndex - 1)"
        />
        <!-- 如果该位置没有随从，渲染空槽 -->
        <div v-else class="empty-slot">
          <span>空</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Minion } from '../game/Minion';
import { useGameStore } from '../stores/game';
import MinionCard from './MinionCard.vue';

const gameStore = useGameStore();

// 从gameStore获取tavern
const tavern = gameStore.tavern;

// 选择/取消选择随从
const selectMinion = (minion: Minion, index: number) => {
  if (gameStore.selectedMinion && gameStore.selectedMinionIndex === index) {
    // 取消选择
    gameStore.cancelSelectMinion();
  } else {
    // 选择新的随从，来源为酒馆
    gameStore.selectMinion(minion, index, 'tavern');
  }
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
.tavern-container {
  margin: 0;
  background-color: transparent;
  color: black;
  box-sizing: border-box;
  overflow: auto;
}

.minions-area {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.minion-slot {
  width: 100px;
  height: 150px;
  position: relative;
}

.minion-slot.empty {
  background-color: rgba(0, 0, 0, 0.05);
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-slot {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.3);
}
</style>
