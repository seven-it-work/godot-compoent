<template>
  <div class="battlefield-container">
    <!-- 玩家区域 -->
    <div class="player-area">
      <!-- 玩家随从区域 -->
      <div class="player-minions" @dragover.prevent>
        <!-- 固定7个格子，每个格子对应一个位置 -->
        <div
          v-for="slotIndex in 7"
          :key="slotIndex"
          class="player-minion-slot"
          :class="{ empty: !playerMinions?.[slotIndex - 1] }"
          @click="
            selectPlayerMinion(playerMinions?.[slotIndex - 1] as Minion | undefined, slotIndex - 1)
          "
          :draggable="!!playerMinions?.[slotIndex - 1]"
          @dragstart="
            onDragStart($event, 'battlefield', slotIndex - 1, playerMinions?.[slotIndex - 1])
          "
          @dragover.prevent="onDragOver($event, slotIndex - 1)"
          @drop.prevent="onDrop($event, slotIndex - 1)"
        >
          <!-- 如果该位置有随从，渲染随从卡片 -->
          <MinionCard
            v-if="playerMinions?.[slotIndex - 1]"
            :minion="playerMinions[slotIndex - 1] as Minion"
            :is-selected="
              gameStore.selectedMinion?.instanceId === playerMinions[slotIndex - 1]?.instanceId
            "
            :is-highlighted="
              isMinionHighlighted(playerMinions[slotIndex - 1], 'battlefield', slotIndex - 1)
            "
          />
          <!-- 如果该位置没有随从，渲染空槽 -->
          <div v-else class="empty-slot">
            <span>空</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Minion } from '../game/Minion';
import { useGameStore } from '../stores/game';
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
  // 只有当minion存在时才执行拖拽逻辑
  if (!minion) {
    // 阻止默认拖拽行为
    event.preventDefault();
    return;
  }

  if (source === 'battlefield') {
    dragStartIndex.value = index;
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
const onDragOver = (event: DragEvent, _index: number) => {
  event.preventDefault();
};

// 拖拽放置事件
const onDrop = (event: DragEvent, targetOrIndex: string | number) => {
  event.preventDefault();
  const data = event.dataTransfer?.getData('text/plain');
  if (data) {
    try {
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
          gameStore.placeMinionFromHand(dragData.index, targetIndex);
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
    } catch (_error) {
      // console.error('无效的拖拽数据:', error);
    }
  }
};

// 选择玩家随从
const selectPlayerMinion = (minion: Minion | undefined, index: number) => {
  if (minion) {
    // 如果当前处于法术选择目标状态，选择该随从作为目标
    if (gameStore.spellUsageState === 'selecting_target' && gameStore.selectedSpell) {
      // 查找该随从是否在可用目标列表中
      const target = gameStore.highlightedTargets.find(
        t => t.source === 'battlefield' && t.index === index && t.target === minion
      );

      if (target) {
        gameStore.selectSpellTarget(target);
      }
    } else {
      // 否则正常选择随从
      gameStore.selectMinion(minion, index, 'battlefield');
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
</script>

<style scoped>
.battlefield-container {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 0;
  color: #2c3e50;
  margin: 0;
  padding: 15px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #b3d8ff;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.battlefield-title {
  margin: 0 0 15px 0;
  text-align: center;
  color: #1976d2;
  font-size: 22px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

/* 玩家区域 */
.player-area {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.player-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.player-name {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.player-health {
  display: flex;
  gap: 8px;
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

/* 随从区域 */
.player-minions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 15px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
  flex: 1;
  overflow: auto;
}

.player-minion-slot {
  /* 使用flex-grow和flex-basis实现响应式宽度 */
  flex: 1 0 calc(14% - 12px); /* 7个槽，减去间距 */
  height: auto;
  position: relative;
  transition: all 0.2s ease;
}

.player-minion-slot:hover {
  transform: scale(1.02);
}

.player-minion-slot.empty {
  background: linear-gradient(135deg, #f0f2f5 0%, #e6e8eb 100%);
  border: 2px dashed #c0c4cc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.player-minion-slot.empty:hover {
  background: linear-gradient(135deg, #e8f0fe 0%, #d9ecff 100%);
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.empty-slot {
  font-size: 14px;
  color: #909399;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s ease;
}

.player-minion-slot.empty:hover .empty-slot {
  color: #409eff;
  font-size: 16px;
}

/* 操作提示 */
.action-hint {
  text-align: center;
  padding: 15px;
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  border: 2px solid #ffe082;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
  color: #2c3e50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #5cb85c 0%, #4cae4c 100%);
}
</style>
