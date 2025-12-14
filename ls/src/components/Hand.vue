<template>
  <div class="hand-container">
    <!-- 手牌区域 -->
    <div class="hand-area" @dragover.prevent @drop="onDrop($event, 'hand')">
      <!-- 所有手牌，动态生成 -->
      <div
        v-for="(card, index) in player?.cards"
        :key="card.id || index"
        class="hand-slot"
        :style="{ aspectRatio: cardRatio }"
        draggable="true"
        @dragstart="onDragStart($event, 'hand', index, card)"
      >
        <!-- 根据卡片类型渲染不同的组件 -->
        <MinionCard
          v-if="card.cardType === 'minion'"
          :minion="card as Minion"
          @click="selectCard(card, index)"
        />
        <SpellCard
          v-else-if="card.cardType === 'spell'"
          :spell="card as Spell"
          @click="selectCard(card, index)"
        />
      </div>

      <!-- 空手牌槽，根据剩余空间动态生成 -->
      <div
        v-for="index in emptySlots"
        :key="`empty-${index}`"
        class="hand-slot empty"
        :style="{ aspectRatio: cardRatio }"
      >
        <div class="empty-slot">
          <span>空</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { useGameStore } from '../stores/game';
import { Card } from '../game/Card';
import { Minion } from '../game/Minion';
import { Spell } from '../game/Spell';
import MinionCard from './MinionCard.vue';
import SpellCard from './SpellCard.vue';

// 使用游戏store
const gameStore = useGameStore();
const { player } = gameStore;

// 从父组件注入宽高比状态
const cardRatio = inject('cardRatio', ref('3/4'));

// 计算空手牌槽数量
const emptySlots = computed(() => {
  const maxHandSlots = 10;
  const currentCards = player?.cards.length || 0;
  return Math.max(0, maxHandSlots - currentCards);
});

// 选择卡片
const selectCard = (card: Card, index: number) => {
  // 使用gameStore管理选中的卡片，来源为hand
  if (card.cardType === 'minion') {
    gameStore.selectMinion(card as Minion, index, 'hand');
  } else if (card.cardType === 'spell') {
    gameStore.selectSpell(card as Spell, index);
  }
};

// 拖拽开始事件
const onDragStart = (event: DragEvent, source: string, index: number, card: any) => {
  // 只有当card存在时才执行拖拽逻辑
  if (!card) {
    // 阻止默认拖拽行为
    event.preventDefault();
    return;
  }

  if (card.cardType === 'spell') {
    // 法术卡片拖拽，使用自定义逻辑
    gameStore.startSpellDrag(event, card, index);
    event.preventDefault(); // 阻止默认拖拽行为
  } else {
    // 其他卡片类型使用原有拖拽逻辑
    event.dataTransfer?.setData(
      'text/plain',
      JSON.stringify({
        source,
        index,
        cardId: card.id,
        strId: card.strId,
        cardType: card.cardType,
      })
    );
  }
};

// 鼠标移动事件 - 更新拖拽箭头位置
const onMouseMove = (event: MouseEvent) => {
  gameStore.updateSpellDrag(event);
};

// 鼠标释放事件 - 结束法术拖拽
const onMouseUp = (event: MouseEvent) => {
  if (gameStore.spellUsageState === 'selecting_target' && gameStore.dragArrow.visible) {
    // 检测鼠标位置下的有效目标
    const target = gameStore.detectTargetAtPosition(event.clientX, event.clientY);
    // 结束拖拽，传入检测到的目标
    gameStore.endSpellDrag(event as any, target);
  }
};

// 添加全局鼠标事件监听
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);

// 组件卸载时移除事件监听
import { onUnmounted } from 'vue';
onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});

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
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 0;
  color: #2c3e50;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ffd591;
  display: flex;
  flex-direction: column;
}

.hand-area {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
  flex: 1;
  overflow: auto;
}

.hand-slot {
  /* 使用flex-grow和flex-basis实现响应式宽度 */
  position: relative;
  transition: all 0.2s ease;
}

.hand-slot:hover {
  transform: translateY(-8px) scale(1.05);
  z-index: 10;
}

.hand-slot.empty {
  background: linear-gradient(135deg, #f0f2f5 0%, #e6e8eb 100%);
  border: 2px dashed #c0c4cc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.hand-slot.empty:hover {
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

.hand-slot.empty:hover .empty-slot {
  color: #409eff;
  font-size: 16px;
}
</style>
