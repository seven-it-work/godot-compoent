<template>
  <div class="row battlefield-container">
    <!-- 玩家随从区域 -->
    <div class="player-minions" @dragover.prevent>
      <!-- 固定7个格子，直接对HearthstoneCard进行for循环 -->
      <HearthstoneCard
        v-for="slotIndex in 7"
        :key="slotIndex"
        :card="playerMinions?.[slotIndex - 1] || null"
        :index="slotIndex - 1"
        :source="'battlefield'"
        :is-selected="
          Boolean(
            playerMinions?.[slotIndex - 1] &&
            gameStore.selectedMinion?.instanceId === playerMinions[slotIndex - 1]?.instanceId
          )
        "
        :is-highlighted="
          Boolean(
            playerMinions?.[slotIndex - 1] &&
            isMinionHighlighted(playerMinions[slotIndex - 1], 'battlefield', slotIndex - 1)
          )
        "
        :class="{ empty: !playerMinions?.[slotIndex - 1] }"
        @click="selectPlayerMinion(playerMinions?.[slotIndex - 1] || undefined, slotIndex - 1)"
        :draggable="!!playerMinions?.[slotIndex - 1]"
        @dragstart="
          onDragStart(
            $event,
            'battlefield',
            slotIndex - 1,
            playerMinions?.[slotIndex - 1] || undefined
          )
        "
        @dragover.prevent="onDragOver($event, slotIndex - 1)"
        @drop.prevent="onDrop($event, slotIndex - 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Card } from '../game/Card';
import { Minion } from '../game/Minion';
import { useGameStore } from '../stores/game';
import HearthstoneCard from './HearthstoneCard.vue';

// 使用游戏store
const gameStore = useGameStore();
// 从gameStore获取player - 使用computed确保响应式更新
const player = computed(() => gameStore.player);

// 拖拽起始索引
const dragStartIndex = ref<number | null>(null);

// 拖拽开始事件
const onDragStart = (event: DragEvent, source: string, index: number, minion: Card | undefined) => {
  dragStartIndex.value = index;
  if (event.dataTransfer && minion) {
    event.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        source,
        index,
        card: minion,
      })
    );
  }
};

// 玩家随从
const playerMinions = computed(() => {
  return player.value?.minions || [];
});

// 拖拽开始事件将由HearthstoneCard组件内部处理

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
        if (minions.some((slot: Card | null) => slot === null)) {
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
const selectPlayerMinion = (minion: Card | undefined, index: number) => {
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
      // 确保是Minion类型
      gameStore.selectMinion(minion as Minion, index, 'battlefield');
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

// 移除所有未使用的触摸事件相关代码
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
    touchStartIndex = null;
    touchStartCard = null;
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
.battlefield-container {
  display: flex;
  flex: 1;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 0;
  color: #2c3e50;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #b3d8ff;
  touch-action: none; /* 禁用浏览器默认触摸行为 */
}

/* 玩家随从区域 */
.player-minions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
  flex: 1;
  padding: 0 5%;
  touch-action: none; /* 禁用浏览器默认触摸行为 */
}
</style>
