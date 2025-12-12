<template>
  <div class="battlefield-container">
    <!-- 战场标题 -->
    <h3 class="battlefield-title">战场</h3>
    
    <!-- 玩家区域 -->
    <div class="player-area">
      <!-- 玩家随从区域 -->
        <div 
          class="player-minions"
          @dragover.prevent
          @drop="onDrop($event, 'battlefield')"
        >
          <!-- 固定7个格子，每个格子对应一个位置 -->
          <div 
            v-for="slotIndex in 7" 
            :key="slotIndex"
            class="player-minion-slot"
            :class="{ 'empty': !playerMinions?.[slotIndex - 1] }"
            @click="selectPlayerMinion(playerMinions?.[slotIndex - 1], slotIndex - 1)"
            draggable="true"
            @dragstart="onDragStart($event, 'battlefield', slotIndex - 1, playerMinions?.[slotIndex - 1])"
            @dragover.prevent="onDragOver($event, slotIndex - 1)"
            @drop.prevent="onDrop($event, slotIndex - 1)"
          >
            <!-- 如果该位置有随从，渲染随从卡片 -->
            <MinionCard 
              v-if="playerMinions?.[slotIndex - 1]"
              :minion="playerMinions[slotIndex - 1] as Minion" 
              :is-selected="gameStore.selectedMinion?.id === playerMinions[slotIndex - 1]?.id"
            />
            <!-- 如果该位置没有随从，渲染空槽 -->
            <div v-else class="empty-slot">
              <span>空</span>
            </div>
          </div>
        </div>
      
      <div class="player-info">
        <div class="player-name">玩家</div>
        <div class="player-health">
          <span>生命值:</span>
          <span>{{ playerHero?.health || 30 }}</span>
        </div>
      </div>
    </div>
    
    
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useGameStore } from '../stores/game';
import { Minion } from '../game/Minion';
import MinionCard from './MinionCard.vue';

// 使用游戏store
const gameStore = useGameStore();
const { player } = gameStore;

// 拖拽起始索引
const dragStartIndex = ref<number | null>(null);

// 玩家随从
const playerMinions = computed(() => {
  return player?.minions || [];
});

// 拖拽开始事件
const onDragStart = (event: DragEvent, source: string, index: number, minion: any) => {
  if (source === 'battlefield') {
    dragStartIndex.value = index;
  }
  event.dataTransfer?.setData('text/plain', JSON.stringify({
    source,
    index,
    minionId: minion.id,
    strId: minion.strId
  }));
};

// 拖拽经过事件
const onDragOver = (event: DragEvent, _index: number) => {
  event.preventDefault();
};

// 拖拽放置事件
const onDrop = (event: DragEvent, targetOrIndex: string | number) => {
  event.preventDefault();
  const data = event.dataTransfer?.getData('text/plain');
  if (data) {
    const dragData = JSON.parse(data);
    
    // 如果是从手牌拖拽到战场，执行放置操作
    if (dragData.source === 'hand') {
      // 确定目标位置
      let targetIndex = 0;
      const minions = playerMinions.value;
      
      // 如果目标是具体位置
      if (typeof targetOrIndex === 'number') {
        // 检查目标位置是否为空
        if (!minions?.[targetOrIndex]) {
          targetIndex = targetOrIndex;
        } else {
          // 如果目标位置已有随从，从第一个位置开始找第一个空位置
          for (let i = 0; i < 7; i++) {
            if (!minions?.[i]) {
              targetIndex = i;
              break;
            }
          }
        }
      } else {
        // 如果目标是整个战场区域，找第一个空位置
        for (let i = 0; i < 7; i++) {
          if (!minions?.[i]) {
            targetIndex = i;
            break;
          }
        }
      }
      
      // 检查战场是否还有空位置
      // 战场有7个固定位置，检查是否有空位(null值)
      if (minions.some(slot => slot === null)) {
        // 放置随从到指定位置或第一个空位置
        gameStore.placeMinionFromBench(dragData.index, targetIndex);
      }
    }
    // 如果是战场内部拖拽，执行重新排序
    else if (dragData.source === 'battlefield' && typeof targetOrIndex === 'number') {
      const toIndex = targetOrIndex;
      if (dragStartIndex.value !== null && dragStartIndex.value !== toIndex) {
        gameStore.reorderMinions(dragStartIndex.value, toIndex);
        // 更新选中的随从索引
        if (gameStore.selectedMinionIndex === dragStartIndex.value) {
          gameStore.selectedMinionIndex = toIndex;
        }
      }
      dragStartIndex.value = null;
    }
  }
};

// 玩家英雄
const playerHero = computed(() => {
  return player?.hero || null;
});

// 选择玩家随从
const selectPlayerMinion = (minion: Minion | undefined, index: number) => {
  if (minion) {
    // 使用gameStore管理选中的随从，来源为战场
    gameStore.selectMinion(minion, index, 'battlefield');
  }
};


</script>

<style scoped>
.battlefield-container {
  margin: 20px 0;
  padding: 10px;
  background-color: transparent;
  border-radius: 10px;
  color: black;
}

.battlefield-title {
  margin: 0 0 15px 0;
  text-align: center;
  color: #ffd700;
  font-size: 20px;
}

/* 玩家区域 */
.player-area {
  margin-top: 20px;
}

.player-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
}

.player-name {
  font-size: 16px;
  font-weight: bold;
  color: black;
}

.player-health {
  display: flex;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

/* 随从区域 */
.player-minions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.player-minion-slot {
  width: 100px;
  height: 150px;
  position: relative;
}

.player-minion-slot.empty {
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

/* 操作提示 */
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
  margin-top: 15px;
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
</style>
