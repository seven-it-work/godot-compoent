<template>
  <div class="vertical-hearthstone">
    <div class="game-container">
      <!-- 酒馆区域 -->
      <div class="game-section tavern-section" :class="{ 'drop-allowed': isTavernDragActive }">
        <!-- 第一行：5个卡片槽 -->
        <div class="card-row">
          <CardSlot
            v-for="card in cards.filter(
              card => card.position === '酒馆' && card.id.startsWith('tavern-1-')
            )"
            :key="card.id"
            :card-id="card.id"
            :position-type="card.position"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
          ></CardSlot>
          <div
            v-for="i in Math.max(
              0,
              5 -
                cards.filter(card => card.position === '酒馆' && card.id.startsWith('tavern-1-'))
                  .length
            )"
            :key="'empty-tavern-1-' + i"
            class="card-slot empty"
          ></div>
        </div>

        <!-- 第二行：2个卡片槽 -->
        <div class="card-row">
          <CardSlot
            v-for="card in cards.filter(
              card => card.position === '酒馆' && card.id.startsWith('tavern-2-')
            )"
            :key="card.id"
            :card-id="card.id"
            :position-type="card.position"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
          ></CardSlot>
          <div
            v-for="i in Math.max(
              0,
              2 -
                cards.filter(card => card.position === '酒馆' && card.id.startsWith('tavern-2-'))
                  .length
            )"
            :key="'empty-tavern-2-' + i"
            class="card-slot empty"
          ></div>
          <div class="info-panel tavern-info">
            <div class="stats-row">
              <div>酒馆等级：1级</div>
              <button>升级(1)</button>
            </div>

            <div class="buttons-row">
              <div>第x回合</div>
              <button>刷新(1)</button>
              <button>冻结(0)</button>
            </div>

            <div class="stats-row">
              <div>生命值：30 护甲：7</div>
              <button>技能</button>
            </div>

            <div class="buttons-row">
              <div>铸币：10/10</div>
              <button>设置</button>
              <button>调试</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 战场区域 -->
      <div class="game-section battlefield-section">
        <!-- 第三行：5个卡片槽 -->
        <div class="card-row">
          <CardSlot
            v-for="card in cards.filter(
              card => card.position === '战场' && card.id.startsWith('battlefield-1-')
            )"
            :key="card.id"
            :card-id="card.id"
            :position-type="card.position"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
          ></CardSlot>
          <div
            v-for="i in Math.max(
              0,
              5 -
                cards.filter(
                  card => card.position === '战场' && card.id.startsWith('battlefield-1-')
                ).length
            )"
            :key="'empty-battlefield-1-' + i"
            class="card-slot empty"
          ></div>
        </div>

        <!-- 第四行：2个卡片槽  -->
        <div class="card-row">
          <CardSlot
            v-for="card in cards.filter(
              card => card.position === '战场' && card.id.startsWith('battlefield-2-')
            )"
            :key="card.id"
            :card-id="card.id"
            :position-type="card.position"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
          ></CardSlot>
          <div
            v-for="i in Math.max(
              0,
              2 -
                cards.filter(
                  card => card.position === '战场' && card.id.startsWith('battlefield-2-')
                ).length
            )"
            :key="'empty-battlefield-2-' + i"
            class="card-slot empty"
          ></div>
          <div class="info-panel player-info">
            <div>选中的卡片信息</div>
          </div>
        </div>
      </div>

      <!-- 手牌区域 -->
      <div class="game-section hand-section" :class="{ 'drop-allowed': isDragActive }">
        <!-- 第五行：5个卡片槽 -->
        <div class="card-row">
          <CardSlot
            v-for="card in cards.filter(
              card => card.position === '手牌' && card.id.startsWith('hand-1-')
            )"
            :key="card.id"
            :card-id="card.id"
            :position-type="card.position"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
          ></CardSlot>
          <div
            v-for="i in Math.max(
              0,
              5 -
                cards.filter(card => card.position === '手牌' && card.id.startsWith('hand-1-'))
                  .length
            )"
            :key="'empty-hand-1-' + i"
            class="card-slot empty"
          ></div>
        </div>

        <!-- 第六行：5个卡片槽 -->
        <div class="card-row">
          <CardSlot
            v-for="card in cards.filter(
              card => card.position === '手牌' && card.id.startsWith('hand-2-')
            )"
            :key="card.id"
            :card-id="card.id"
            :position-type="card.position"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
          ></CardSlot>
          <div
            v-for="i in Math.max(
              0,
              5 -
                cards.filter(card => card.position === '手牌' && card.id.startsWith('hand-2-'))
                  .length
            )"
            :key="'empty-hand-2-' + i"
            class="card-slot empty"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import CardSlot from './components/CardSlot.vue';

// 定义卡片类型
interface Card {
  id: string;
  position: '酒馆' | '战场' | '手牌';
}

// 拖拽状态 - 控制手牌区域高亮
const isDragActive = ref(false);

// 酒馆拖拽状态 - 控制酒馆区域高亮
const isTavernDragActive = ref(false);

// 当前拖拽的卡片ID
const currentDraggingCard = ref<string | null>(null);

// 卡片数据数组
const cards = reactive<Card[]>([]);

// 初始化卡片数据
const initCards = () => {
  // 初始化酒馆卡片
  for (let i = 1; i <= 5; i++) {
    cards.push({ id: `tavern-1-${i}`, position: '酒馆' });
  }
  for (let i = 1; i <= 2; i++) {
    cards.push({ id: `tavern-2-${i}`, position: '酒馆' });
  }

  // 初始化战场卡片
  for (let i = 1; i <= 5; i++) {
    cards.push({ id: `battlefield-1-${i}`, position: '战场' });
  }
  for (let i = 1; i <= 2; i++) {
    cards.push({ id: `battlefield-2-${i}`, position: '战场' });
  }

  // 初始化手牌卡片
  for (let i = 1; i <= 5; i++) {
    cards.push({ id: `hand-1-${i}`, position: '手牌' });
  }
  for (let i = 1; i <= 5; i++) {
    cards.push({ id: `hand-2-${i}`, position: '手牌' });
  }
};

// 初始化卡片
initCards();

// 处理拖拽开始
const handleDragStart = (cardId: string) => {
  const card = cards.find(c => c.id === cardId);
  currentDraggingCard.value = cardId;

  // 只有拖拽酒馆卡片时才激活手牌区域的高亮样式
  if (card?.position === '酒馆') {
    isDragActive.value = true;
    isTavernDragActive.value = false;
  }
  // 只有拖拽战场卡片时才激活酒馆区域的高亮样式
  else if (card?.position === '战场') {
    isDragActive.value = false;
    isTavernDragActive.value = true;
  } else {
    isDragActive.value = false;
    isTavernDragActive.value = false;
  }

  console.log(
    `[父组件] 开始拖拽卡片: ${cardId}, 当前位置: ${card?.position}, 手牌高亮: ${isDragActive.value}, 酒馆高亮: ${isTavernDragActive.value}`
  );
};

// 处理拖拽结束
const handleDragEnd = (cardId: string, targetArea: string | null) => {
  console.log(`[父组件] 拖拽结束: 卡片 ${cardId}, 目标区域: ${targetArea || '非手牌区域'}`);
  // 重置所有高亮状态
  isDragActive.value = false;
  isTavernDragActive.value = false;
  currentDraggingCard.value = null;
};

// 处理卡片移动
const handleCardMove = (cardId: string, fromArea: string, toArea: string) => {
  console.log(`[父组件] 卡片移动事件: 卡片 ${cardId} 从 ${fromArea} 移动到 ${toArea}`);
  // 更新卡片位置
  const card = cards.find(c => c.id === cardId);
  if (card) {
    const oldPosition = card.position;
    card.position = toArea as '酒馆' | '战场' | '手牌';
    console.log(
      `[父组件] 卡片位置更新: 卡片 ${cardId} 位置从 ${oldPosition} 变为 ${card.position}`
    );
    console.log(`[父组件] 当前所有卡片位置:`, JSON.parse(JSON.stringify(cards)));
  }
};

// 处理卡片移除
const handleCardRemove = (cardId: string) => {
  console.log(`[父组件] 卡片移除事件: 卡片 ${cardId} 被移除`);
  // 从卡片数组中删除该卡片
  const cardIndex = cards.findIndex(c => c.id === cardId);
  if (cardIndex > -1) {
    const removedCard = cards.splice(cardIndex, 1)[0];
    console.log(`[父组件] 卡片 ${removedCard.id} 已从 ${removedCard.position} 区域移除`);
    console.log(`[父组件] 当前卡片数量: ${cards.length}`);
  }
};

// 监听卡片位置变化
watch(
  () => JSON.parse(JSON.stringify(cards)),
  (newCards: Card[], oldCards: Card[]) => {
    console.log(`[父组件] 卡片位置映射变化: 旧位置:`, oldCards, `新位置:`, newCards);
  },
  { deep: true }
);
</script>

<style scoped>
/* 使用相对单位，确保等比例缩放 */
.vertical-hearthstone {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #f0f0f0;
  overflow: auto;
}

.game-container {
  width: 985vmin;
  height: 100vmin;
  display: flex;
  flex-direction: column;
  gap: 2%;
  padding: 2%;
}

.card-row {
  max-height: 90vmin;
  display: flex;
  gap: 2%;
  flex: 1;
  align-items: center;
  justify-content: space-around;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
  padding: 1%;
  box-sizing: border-box;
}

.info-panel {
  flex: 3;
  border: 3px solid #000;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3vmin;
  font-weight: bold;
  text-align: center;
  padding: 1%;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tavern-info {
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  border: 3px solid #8b4513;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 250, 240, 0.95) 0%, rgba(245, 235, 225, 0.9) 100%);
  padding: 1%;
}

.tavern-info > div,
.tavern-info > button {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 2%;
  border-radius: 4px;
  font-size: 3vmin;
}

.tavern-info > button {
  cursor: pointer;
  background: linear-gradient(145deg, #ffffff, #e0e0e0);
  border: 1px solid #ccc;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tavern-info > button:hover {
  background: linear-gradient(145deg, #f0f0f0, #d0d0d0);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.player-info {
  background: linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(220, 230, 245, 0.9) 100%);
  border: 3px solid #4169e1;
  border-radius: 8px;
  padding: 1%;
}

.tavern-info .stats-row {
  display: flex;
  gap: 2%;
  flex: 1;
}

.tavern-info .buttons-row {
  display: flex;
  gap: 2%;
  flex: 1;
}

/* 游戏区域样式 */
.game-section {
  border: 4px solid #ccc;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2%;
  box-sizing: border-box;
  overflow: visible;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.game-section:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* 酒馆区域样式 */
.tavern-section {
  min-height: 63vmin;
  border-color: #8b4513;
  background: linear-gradient(135deg, rgba(248, 248, 248, 0.95) 0%, rgba(230, 220, 200, 0.9) 100%);
  border: 4px solid #8b4513;
  border-top: 5px solid #a0522d;
}

/* 战场区域样式 */
.battlefield-section {
  min-height: 61vmin;
  border-color: #228b22;
  background: linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(220, 240, 220, 0.9) 100%);
  border: 4px solid #228b22;
  border-top: 5px solid #2e8b57;
}

/* 手牌区域样式 */
.hand-section {
  min-height: 61vmin;
  border-color: #4169e1;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(220, 230, 255, 0.9) 100%);
  border: 4px solid #4169e1;
  border-top: 5px solid #1e90ff;
  transition: all 0.3s ease;
}

/* 可拖入样式 - 通用 */
.game-section.drop-allowed {
  border-width: 4px;
  border-style: dashed;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  transform: scale(1.01);
  transition: all 0.3s ease;
}

/* 手牌区域可拖入样式 */
.hand-section.drop-allowed {
  border-color: #00ff00;
  background: linear-gradient(135deg, rgba(240, 255, 240, 0.95) 0%, rgba(220, 255, 220, 0.9) 100%);
}

/* 酒馆区域可拖入样式 */
.tavern-section.drop-allowed {
  border-color: #ffa500;
  background: linear-gradient(135deg, rgba(255, 250, 240, 0.95) 0%, rgba(255, 230, 200, 0.9) 100%);
}

/* 空卡片槽样式 */
.card-row .card-slot.empty {
  flex: 1;
  border: 2px dashed #ccc;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: default;
  aspect-ratio: 1/1.5;
  position: relative;
  touch-action: none;
  user-select: none;
}
</style>
