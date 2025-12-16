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
import { Card } from '../game/Card';
import { Minion } from '../game/Minion';
import { Spell } from '../game/Spell';
import { useGameStore } from '../stores/game';
import HearthstoneCard from './HearthstoneCard.vue';

// 使用游戏store
const gameStore = useGameStore();
const { player } = gameStore;

// 计算第一行的卡牌（前5张）
const firstRowCards = computed(() => {
  if (!player?.cards) return [];
  return player.cards.slice(0, 5);
});

// 计算第二行的卡牌（第6-10张）
const secondRowCards = computed(() => {
  if (!player?.cards) return [];
  return player.cards.slice(5, 10);
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

// 选择卡片
const selectCard = (card: Card | null, index: number) => {
  if (card) {
    if (card.cardType === 'minion') {
      gameStore.selectMinion(card as Minion, index, 'hand');
    } else if (card.cardType === 'spell') {
      gameStore.selectSpell(card as Spell, index);
    }
  }
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
.right-subsection {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.row {
  display: flex;
  flex: 1;
}
</style>
