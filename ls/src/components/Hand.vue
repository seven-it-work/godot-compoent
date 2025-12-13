<template>
  <div class="hand-container">
    <!-- 手牌区域 -->
    <div class="hand-area" @dragover.prevent @drop="onDrop($event, 'hand')">
      <!-- 随从手牌，动态生成 -->
      <div
        v-for="(minion, index) in player?.cards.filter(card => card.cardType === 'minion')"
        :key="minion.id || index"
        class="hand-slot"
        draggable="true"
        @dragstart="onDragStart($event, 'hand', index, minion)"
      >
        <MinionCard :minion="minion as Minion" @click="selectMinion(minion as Minion, index)" />
      </div>

      <!-- 空手牌槽，根据剩余空间动态生成 -->
      <div v-for="index in emptySlots" :key="`empty-${index}`" class="hand-slot empty">
        <div class="empty-slot">
          <span>空</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/game';
import { Minion } from '../game/Minion';
import MinionCard from './MinionCard.vue';

// 使用游戏store
const gameStore = useGameStore();
const { player } = gameStore;

// 计算空手牌槽数量
const emptySlots = computed(() => {
  const maxHandSlots = 7;
  const currentMinions = player?.cards.filter(card => card.cardType === 'minion').length || 0;
  return Math.max(0, maxHandSlots - currentMinions);
});

// 选择随从
const selectMinion = (minion: Minion, index: number) => {
  // 使用gameStore管理选中的随从，来源为hand
  gameStore.selectMinion(minion, index, 'hand');
};

// 拖拽开始事件
const onDragStart = (event: DragEvent, source: string, index: number, minion: any) => {
  // 只有当minion存在时才执行拖拽逻辑
  if (!minion) {
    // 阻止默认拖拽行为
    event.preventDefault();
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

// 拖拽放置事件
const onDrop = (event: DragEvent, target: string) => {
  event.preventDefault();
  const data = event.dataTransfer?.getData('text/plain');
  if (data) {
    try {
      const dragData = JSON.parse(data);
      // 如果是从酒馆拖拽到手牌，执行购买操作
      if (dragData.source === 'tavern' && target === 'hand') {
        // 找到对应的酒馆随从索引
        const tavernIndex = dragData.index;
        // 购买随从，只有当条件满足时，卡片才会从酒馆移除
        const success = gameStore.buyMinion(tavernIndex);
        if (!success) {
          console.log('购买失败，可能是金币不足或手牌已满');
        }
      }
    } catch (_error) {
      // console.error('无效的拖拽数据:', error);
    }
  }
};
</script>

<style scoped>
.hand-container {
  background-color: transparent;
  border-radius: 10px;
  color: black;
}

.hand-title {
  text-align: center;
  color: #ffd700;
  font-size: 20px;
}

.hand-area {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.hand-slot {
  width: 100px;
  height: 150px;
  position: relative;
}

.hand-slot.empty {
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

.action-hint {
  text-align: center;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  color: black;
}

.action-button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  transition: all 0.2s ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.sell-button {
  background-color: #f44336;
}

.sell-button:hover {
  background-color: #d32f2f;
}
</style>
