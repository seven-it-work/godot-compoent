<template>
  <div class="vertical-hearthstone">
    <div class="game-container">
      <!-- 酒馆区域 -->
      <div class="game-section tavern-section" :class="{ 'drop-allowed': isTavernDragActive }">
        <!-- 第一行：5个卡片槽 -->
        <div class="card-row">
          <CardSlot
            v-for="(card, index) in tavernCards.slice(0, 5)"
            :key="card ? card.id : 'empty-tavern-1-' + index"
            :card-id="card ? card.id : 'empty-tavern-1-' + index"
            :position-type="'酒馆'"
            :data="card"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
          ></CardSlot>
        </div>

        <!-- 第二行：2个卡片槽 -->
        <div class="card-row">
          <CardSlot
            v-for="(card, index) in tavernCards.slice(5, 7)"
            :key="card ? card.id : 'empty-tavern-2-' + index"
            :card-id="card ? card.id : 'empty-tavern-2-' + index"
            :position-type="'酒馆'"
            :data="card"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
          ></CardSlot>
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
            v-for="(card, index) in battlefieldCards.slice(0, 5)"
            :key="card ? card.id : 'empty-battlefield-1-' + index"
            :card-id="card ? card.id : 'empty-battlefield-1-' + index"
            :position-type="'战场'"
            :data="card"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-swap="(cardId, targetIndex) => handleCardSwap(cardId, targetIndex)"
          ></CardSlot>
        </div>

        <!-- 第四行：2个卡片槽  -->
        <div class="card-row">
          <CardSlot
            v-for="(card, index) in battlefieldCards.slice(5, 7)"
            :key="card ? card.id : 'empty-battlefield-2-' + index"
            :card-id="card ? card.id : 'empty-battlefield-2-' + index"
            :position-type="'战场'"
            :data="card"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-swap="(cardId, targetIndex) => handleCardSwap(cardId, targetIndex)"
          ></CardSlot>
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
            v-for="(card, index) in handCards.slice(0, 5)"
            :key="card ? card.id : 'empty-hand-1-' + index"
            :card-id="card ? card.id : 'empty-hand-1-' + index"
            :position-type="'手牌'"
            :data="card"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
          ></CardSlot>
        </div>

        <!-- 第六行：5个卡片槽 -->
        <div class="card-row">
          <CardSlot
            v-for="(card, index) in handCards.slice(5, 10)"
            :key="card ? card.id : 'empty-hand-2-' + index"
            :card-id="card ? card.id : 'empty-hand-2-' + index"
            :position-type="'手牌'"
            :data="card"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
          ></CardSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Card, CardType } from '../../game/Card';
import { Minion } from '../../game/Minion';
import { minionClassMapByStrId } from '../../game/minion/MinionClassMap';
import CardSlot from './components/CardSlot.vue';

// 拖拽状态 - 控制手牌区域高亮
const isDragActive = ref(false);

// 酒馆拖拽状态 - 控制酒馆区域高亮
const isTavernDragActive = ref(false);

// 当前拖拽的卡片ID
const currentDraggingCard = ref<string | null>(null);

// 分离的卡片数组，使用数字索引
const tavernCards = reactive<(Card | null)[]>([]);
const battlefieldCards = reactive<(Card | null)[]>([]);
const handCards = reactive<(Card | null)[]>([]);

// 初始化卡片数据
const initCards = () => {
  // 清空所有数组
  tavernCards.length = 0;
  battlefieldCards.length = 0;
  handCards.length = 0;

  // 初始化酒馆区域：固定7个格子，初始时有3个卡片，4个空格子
  // 前3个格子有卡片，后4个格子为空

  // 创建一些实际的随从卡片数据
  const sampleMinions = [
    {
      id: '1',
      strId: 'BGS_004', // 愤怒编织者
      cardType: CardType.MINION,
      name: 'Wrath Weaver',
      nameCN: '愤怒编织者',
      text: 'Whenever you take damage, gain +1/+1.',
      mechanics: [],
      referencedTags: [],
      img: '',
      art: '',
      tier: 1,
      health: 1,
      attack: 1,
      minionTypes: ['demon'],
      minionTypesCN: ['恶魔'],
    },
    {
      id: '2',
      strId: 'BGS_127', // 熔融岩石
      cardType: CardType.MINION,
      name: 'Molten Rock',
      nameCN: '熔融岩石',
      text: 'Taunt',
      mechanics: ['TAUNT'],
      referencedTags: [],
      img: '',
      art: '',
      tier: 1,
      health: 2,
      attack: 1,
      minionTypes: ['elemental'],
      minionTypesCN: ['元素'],
    },
    {
      id: '3',
      strId: 'BG_CFM_315', // 雄斑虎
      cardType: CardType.MINION,
      name: 'Alleycat',
      nameCN: '雄斑虎',
      text: 'Battlecry: Summon a 1/1 Tabbycat.',
      mechanics: [],
      referencedTags: [],
      img: '',
      art: '',
      tier: 1,
      health: 2,
      attack: 1,
      minionTypes: ['beast'],
      minionTypesCN: ['野兽'],
    },
  ];

  // 创建实际的Minion实例并添加到酒馆卡片中
  for (let i = 0; i < sampleMinions.length; i++) {
    const minionData = sampleMinions[i];
    const MinionClass = minionClassMapByStrId[minionData.strId] || Minion;

    const minion = new MinionClass(
      minionData.id,
      minionData.strId,
      minionData.cardType,
      minionData.name,
      minionData.nameCN,
      minionData.text,
      minionData.mechanics,
      minionData.referencedTags,
      minionData.img,
      minionData.art,
      minionData.tier,
      minionData.health,
      minionData.attack,
      minionData.minionTypes,
      minionData.minionTypesCN
    );

    tavernCards.push(minion);
  }

  // 添加4个空格子，使总数量达到7个
  for (let i = 1; i <= 4; i++) {
    tavernCards.push(null);
  }

  // 初始化战场区域：固定7个格子，全部为空格子
  for (let i = 1; i <= 7; i++) {
    battlefieldCards.push(null);
  }

  // 初始化手牌区域：固定10个格子，全部为空格子
  for (let i = 1; i <= 10; i++) {
    handCards.push(null);
  }
};

// 处理卡片交换事件 - 战场区域内位置交换
const handleCardSwap = (cardId: string, targetIndex: number) => {
  console.log(`[父组件] 卡片交换事件: 卡片 ${cardId} 交换到目标索引: ${targetIndex}`);

  // 找到源卡片在battlefieldCards中的索引
  const sourceIndex = battlefieldCards.findIndex((card: Card | null) => card && card.id === cardId);

  if (sourceIndex === -1) {
    console.error(`[父组件] 未找到卡片: ${cardId} 在战场区域`);
    return;
  }

  console.log(`[父组件] 源卡片索引: ${sourceIndex}, 目标索引: ${targetIndex}`);

  // 确保目标索引有效
  if (targetIndex < 0 || targetIndex >= battlefieldCards.length) {
    console.error(`[父组件] 无效的目标索引: ${targetIndex}`);
    return;
  }

  // 交换卡片位置，确保值为Card | null类型
  const temp: Card | null = battlefieldCards[sourceIndex] || null;
  const targetValue: Card | null = battlefieldCards[targetIndex] || null;

  battlefieldCards[sourceIndex] = targetValue;
  battlefieldCards[targetIndex] = temp;

  console.log(`[父组件] 卡片交换成功: ${cardId} 从索引 ${sourceIndex} 移动到 ${targetIndex}`);

  // 更新交换后卡片的position属性
  if (battlefieldCards[sourceIndex]) {
    battlefieldCards[sourceIndex].position = '战场';
  }
  if (battlefieldCards[targetIndex]) {
    battlefieldCards[targetIndex].position = '战场';
  }
};

// 初始化卡片
initCards();

// 处理拖拽开始
const handleDragStart = (cardId: string) => {
  // 从所有分离的数组中查找卡片
  let card: Card | null = null;
  const allCards = [...tavernCards, ...battlefieldCards, ...handCards];
  const foundCard = allCards.find(c => c && c.id === cardId);
  card = foundCard || null;

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
const handleCardMove = (
  cardId: string,
  fromArea: string,
  toArea: string,
  targetSlotIndex?: number
) => {
  console.log(
    `[父组件] 卡片移动事件: 卡片 ${cardId} 从 ${fromArea} 移动到 ${toArea}${targetSlotIndex !== undefined ? `, 目标空格子索引: ${targetSlotIndex}` : ''}`
  );

  // 从原区域获取卡片数据
  let card: Card | null = null;
  let fromArray: (Card | null)[] = [];
  let fromIndex = -1;

  // 确定原数组
  if (fromArea === '酒馆') fromArray = tavernCards;
  else if (fromArea === '战场') fromArray = battlefieldCards;
  else if (fromArea === '手牌') fromArray = handCards;

  // 找到卡片在原数组中的位置
  fromIndex = fromArray.findIndex(c => c && c.id === cardId);
  if (fromIndex > -1) {
    // 保存卡片数据（确保类型匹配）
    card = fromArray[fromIndex] || null;
    if (card) {
      // 添加到目标区域
      let toArray: (Card | null)[] = [];

      // 确定目标数组
      if (toArea === '酒馆') toArray = tavernCards;
      else if (toArea === '战场') toArray = battlefieldCards;
      else if (toArea === '手牌') toArray = handCards;

      // 找到目标区域的空位
      let emptyIndex = -1;

      // 如果是手牌到战场的拖拽，且提供了targetSlotIndex，使用该索引
      if (
        fromArea === '手牌' &&
        toArea === '战场' &&
        targetSlotIndex !== undefined &&
        targetSlotIndex >= 0 &&
        targetSlotIndex < toArray.length
      ) {
        // 直接使用targetSlotIndex作为战场数组的索引
        if (toArray[targetSlotIndex] === null) {
          emptyIndex = targetSlotIndex;
          console.log(`[父组件] 手牌到战场拖拽，直接使用目标索引: ${targetSlotIndex}`);
        }
      }

      // 如果没有提供targetSlotIndex或索引无效，使用第一个空位
      if (emptyIndex === -1) {
        emptyIndex = toArray.findIndex(c => c === null);
        console.log(`[父组件] 使用第一个空位索引: ${emptyIndex}`);
      }

      if (emptyIndex > -1) {
        // 更新卡片位置
        card.position = toArea as '酒馆' | '战场' | '手牌';

        // 关键逻辑：直接将原位置设为空格子，不改变其他卡片顺序
        // 对于酒馆区域：拖拽后原位置变成空格子，其他卡片保持原有顺序
        // 例如：A B C → 拖拽B后 → A null C（而不是A C null）
        fromArray[fromIndex] = null;

        // 将卡片数据赋值到目标空位
        toArray[emptyIndex] = card;

        console.log(`[父组件] 卡片位置更新: 卡片 ${cardId} 位置从 ${fromArea} 变为 ${toArea}`);
        console.log(
          `[父组件] 当前卡片分布: 酒馆 ${tavernCards.filter(c => c).length}/${tavernCards.length}张, 战场 ${battlefieldCards.filter(c => c).length}/${battlefieldCards.length}张, 手牌 ${handCards.filter(c => c).length}/${handCards.length}张`
        );
      } else {
        console.log(`[父组件] 目标区域 ${toArea} 没有空位，无法移动卡片`);
      }
    }
  }
};

// 处理卡片移除
const handleCardRemove = (cardId: string) => {
  console.log(`[父组件] 卡片移除事件: 卡片 ${cardId} 被移除`);

  // 从所有数组中查找并移除卡片
  const allArrays = [tavernCards, battlefieldCards, handCards];

  for (const array of allArrays) {
    const index = array.findIndex(c => c && c.id === cardId);
    if (index > -1) {
      const removedCard = array.splice(index, 1)[0];
      if (removedCard) {
        // 在原位置插入null以保持数组长度
        array.splice(index, 0, null);
        console.log(`[父组件] 卡片 ${removedCard.id} 已从 ${removedCard.position} 区域移除`);
      }
      break;
    }
  }

  console.log(
    `[父组件] 当前卡片分布: 酒馆 ${tavernCards.length}, 战场 ${battlefieldCards.length}, 手牌 ${handCards.length}`
  );
};

// 监听卡片位置变化
watch(
  [tavernCards, battlefieldCards, handCards],
  ([newTavern, newBattlefield, newHand]) => {
    console.log('[父组件] 卡片数据变化:', {
      tavern: newTavern,
      battlefield: newBattlefield,
      hand: newHand,
    });
    // 这里可以添加数据持久化或其他逻辑
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

/* 战场区域内可交换样式 - 卡片槽高亮 */
.battlefield-section .card-slot.swap-allowed {
  outline: 3px solid #ffc107;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.8);
  background-color: rgba(255, 193, 7, 0.1);
  transform: scale(1.05);
  transition: all 0.2s ease;
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
