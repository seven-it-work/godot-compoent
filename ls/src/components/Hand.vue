<template>
  <div class="hand-container">
    <!-- 手牌区域 -->
    <div class="hand-area" @dragover.prevent @drop="onDrop($event, 'hand')">
      <!-- 所有手牌，动态生成 -->
      <div
        v-for="(card, index) in player?.cards"
        :key="card.id || index"
        class="hand-slot"
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
import { Card } from '../game/Card';
import { Minion } from '../game/Minion';
import { Spell } from '../game/Spell';
import MinionCard from './MinionCard.vue';
import SpellCard from './SpellCard.vue';

// 使用游戏store
const gameStore = useGameStore();
const { player } = gameStore;

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
    // 结束拖拽，这里需要判断是否命中了有效目标
    gameStore.endSpellDrag(event as any, null); // 暂时传入null，后续需要添加目标检测
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
