<template>
  <div class="vertical-hearthstone">
    <!-- 调试抽屉组件 -->
    <DebugDrawer v-model:debug-drawer-visible="debugDrawerVisible" @close="closeDebugDrawer" />

    <BattleScene
      v-if="isBattleSceneVisible"
      @exit-battle="hideBattleScene"
      :enemy-minions="[]"
      :player-minions="[]"
      :enemy-health="30"
      :enemy-armor="0"
      :player-health="30"
      :player-armor="0"
    />

    <!-- 正常游戏界面：条件渲染 -->
    <div class="game-container" v-else>
      <!-- 酒馆区域 -->
      <div class="game-section tavern-section" :class="{ 'drop-allowed': isTavernDragActive }">
        <!-- 第一行：5个卡片槽 -->
        <div class="card-row">
          <CardSlot
            v-for="(card, index) in tavernCards.slice(0, 5)"
            :key="card ? card.id : 'empty-tavern-1-' + index"
            :card-id="card ? card.id : 'empty-tavern-1-' + index"
            :position-type="'tavern'"
            :data="card"
            :selected-card-id="globalStore.selectedCard?.id"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-select="
              cardData =>
                cardData
                  ? globalStore.setSelectedCard(cardData, index)
                  : globalStore.clearSelectedCard()
            "
            @spell-cast="handleSpellCast"
          ></CardSlot>
        </div>

        <!-- 第二行：2个卡片槽 -->
        <div class="card-row">
          <CardSlot
            v-for="(card, index) in tavernCards.slice(5, 7)"
            :key="card ? card.id : 'empty-tavern-2-' + index"
            :card-id="card ? card.id : 'empty-tavern-2-' + index"
            :position-type="'tavern'"
            :data="card"
            :selected-card-id="globalStore.selectedCard?.id"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-select="
              cardData =>
                cardData
                  ? globalStore.setSelectedCard(cardData, index + 5)
                  : globalStore.clearSelectedCard()
            "
            @spell-cast="handleSpellCast"
          ></CardSlot>
          <div class="info-panel tavern-info">
            <div class="stats-row">
              <div>酒馆等级：{{ travern?.level || -1 }}级</div>
              <button @click="upgradeTavern" :disabled="!canUpgrade">
                升级({{ travern?.upgradeCost || -1 }})
              </button>
            </div>

            <div class="buttons-row">
              <div>第{{ travern?.currentTurn || -1 }}回合</div>
              <button
                @click="refreshTavern"
                :disabled="!(travern && travern.gold >= travern.refreshCost)"
              >
                刷新({{ travern?.refreshCost || -1 }})
              </button>
              <button @click="toggleFreeze">
                <!-- todo 有待开发 -->
                {{ travern?.isFrozen ? '解冻(0)' : '冻结(0)' }}
              </button>
            </div>

            <div class="stats-row">
              <div>
                生命值：{{ player?.hero?.health || 30 }} 护甲：{{ player?.hero?.armor || 0 }}
              </div>
              <button>技能</button>
            </div>

            <div class="buttons-row">
              <div>铸币：{{ travern?.gold || 0 }}/{{ travern?.maxGold || 0 }}</div>
              <button @click="endTurn">结束回合</button>
              <button @click="showBattleScene">战斗</button>
              <button @click="showDebugDrawer">调试</button>
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
            :position-type="'battlefield'"
            :data="card"
            :selected-card-id="globalStore.selectedCard?.id"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-swap="(cardId, targetIndex) => handleCardSwap(cardId, targetIndex)"
            @card-select="
              cardData =>
                cardData
                  ? globalStore.setSelectedCard(cardData, index)
                  : globalStore.clearSelectedCard()
            "
            @spell-cast="handleSpellCast"
          ></CardSlot>
        </div>

        <!-- 第四行：2个卡片槽  -->
        <div class="card-row">
          <CardSlot
            v-for="(card, index) in battlefieldCards.slice(5, 7)"
            :key="card ? card.id : 'empty-battlefield-2-' + index"
            :card-id="card ? card.id : 'empty-battlefield-2-' + index"
            :position-type="'battlefield'"
            :data="card"
            :selected-card-id="globalStore.selectedCard?.id"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-swap="(cardId, targetIndex) => handleCardSwap(cardId, targetIndex)"
            @card-select="
              cardData =>
                cardData
                  ? globalStore.setSelectedCard(cardData, index + 5)
                  : globalStore.clearSelectedCard()
            "
            @spell-cast="handleSpellCast"
          ></CardSlot>
          <div class="info-panel player-info">
            <div class="layout-grid">
              <!-- 左区 -->
              <div class="top-left" v-if="globalStore.selectedCard">
                <div class="card-name" v-if="globalStore.selectedCard?.name">
                  {{ globalStore.selectedCard?.name || '非常长的名称' }}
                </div>
                <div class="card-stats" v-if="globalStore.selectedCard?.type === 'minion'">
                  <span class="attack"
                    >攻{{ (globalStore.selectedCard as any).getAttack() || 0 }}</span
                  >
                  <span class="health">血{{ (globalStore.selectedCard as any).health || 0 }}</span>
                </div>
                <div class="card-buffs" v-if="globalStore.selectedCard?.type === 'minion'">
                  <!-- 属性加成信息可以从gameStore.selectedCard中获取 -->
                  <div>
                    永久属性加成：
                    <span
                      v-for="(buff, index) in (globalStore.selectedCard as any).permanentBuffs"
                      :key="index"
                    >
                      {{ buff.attackBonus ? `+${buff.attackBonus}攻` : '' }}
                      {{ buff.healthBonus ? `+${buff.healthBonus}血` : '' }}
                    </span>
                  </div>
                  <div v-if="(globalStore.selectedCard as any).temporaryBuffs?.length">
                    临时属性加成：
                    <span
                      v-for="(buff, index) in (globalStore.selectedCard as any).temporaryBuffs"
                      :key="index"
                    >
                      {{ buff.attackBonus ? `+${buff.attackBonus}攻` : '' }}
                      {{ buff.healthBonus ? `+${buff.healthBonus}血` : '' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 右区 -->
              <div class="top-right" v-if="globalStore.selectedCard">
                <div
                  class="card-description"
                  v-html="globalStore.selectedCard?.textFormat(currentGameRef.id) || ''"
                ></div>
                <div class="card-actions">
                  <button
                    v-if="globalStore.selectedCard?.location === 'tavern'"
                    class="action-btn buy-btn"
                    @click="handleBuyAction"
                  >
                    购买
                  </button>
                  <button
                    v-if="globalStore.selectedCard?.location === 'hand'"
                    class="action-btn place-btn"
                    @click="handlePlaceAction"
                  >
                    放置
                  </button>
                  <button
                    v-if="globalStore.selectedCard?.location === 'battlefield'"
                    class="action-btn sell-btn"
                    @click="handleSellAction"
                  >
                    出售
                  </button>
                </div>
              </div>
            </div>
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
            :position-type="'hand'"
            :data="card"
            :selected-card-id="globalStore.selectedCard?.id"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-select="
              cardData =>
                cardData
                  ? globalStore.setSelectedCard(cardData, index)
                  : globalStore.clearSelectedCard()
            "
            @spell-cast="handleSpellCast"
          ></CardSlot>
        </div>

        <!-- 第六行：5个卡片槽 -->
        <div class="card-row">
          <CardSlot
            v-for="(card, index) in handCards.slice(5, 10)"
            :key="card ? card.id : 'empty-hand-2-' + index"
            :card-id="card ? card.id : 'empty-hand-2-' + index"
            :position-type="'hand'"
            :data="card"
            :selected-card-id="globalStore.selectedCard?.id"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-select="
              cardData =>
                cardData
                  ? globalStore.setSelectedCard(cardData, index + 5)
                  : globalStore.clearSelectedCard()
            "
            @spell-cast="handleSpellCast"
          ></CardSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CurrentGameController } from '@/server/controller/CurrentGameController';
import { GameController } from '@/server/controller/GameController';
import { HeroController } from '@/server/controller/HeroController';
import { PlayerController } from '@/server/controller/PlayerController';
import { Card } from '@/server/controller/entity/Card';
import { CurrentGame } from '@/server/controller/entity/CurrentGame';
import { computed, onMounted, ref, watch } from 'vue';
import CardSlot from './components/CardSlot.vue';
import DebugDrawer from './components/DebugDrawer.vue';
import { Spell } from '@/server/controller/entity/Spell';

const gameController = new GameController();
const heroController = new HeroController();
const currentGameController = new CurrentGameController();

const currentGameRef = ref<CurrentGame>(new CurrentGame());
// 当前拖拽的卡片ID
const currentDraggingCard = ref<string | null>(null);
// 拖拽状态 - 控制手牌区域高亮
const isDragActive = ref(false);

// 酒馆拖拽状态 - 控制酒馆区域高亮
const isTavernDragActive = ref(false);

import { useGlobalStore } from '@/stores/GlobalStore';
const globalStore = useGlobalStore();

const playerController = new PlayerController();
// 购买按钮点击事件处理
const handleBuyAction = () => {
  if (globalStore.selectedCard && globalStore.selectedCardIndex !== null) {
    const result = playerController.buyCard(currentGameRef.value.id, globalStore.selectedCard.id);
    if (!result.isSuccess()) {
      console.log('[失败] 购买卡片失败', result);
      return;
    }
    currentGameRef.value = currentGameController.getCurrentGameById(currentGameRef.value.id);
  }
};

// 放置按钮点击事件处理
const handlePlaceAction = () => {
  if (globalStore.selectedCard && globalStore.selectedCardIndex !== null) {
    const result = playerController.useCardFromHand(
      currentGameRef.value.id,
      globalStore.selectedCard.id
    );
    if (!result.isSuccess()) {
      console.log('[失败] 放置卡片失败', result);
      return;
    }
    currentGameRef.value = currentGameController.getCurrentGameById(currentGameRef.value.id);
  }
};

// 出售按钮点击事件处理
const handleSellAction = () => {
  if (globalStore.selectedCard && globalStore.selectedCardIndex !== null) {
    const result = playerController.sellCard(currentGameRef.value.id, globalStore.selectedCard.id);
    if (!result.isSuccess()) {
      console.log('[失败] 出售卡片失败', result);
      return;
    }
    currentGameRef.value = currentGameController.getCurrentGameById(currentGameRef.value.id);
  }
};

// 计算属性：从游戏store获取卡片数据
const tavernCards = computed(() => {
  return currentGameRef.value.player?.tavern?.cards || Array(7).fill(null);
});
const player = computed(() => {
  return currentGameRef.value.player;
});
const travern = computed(() => {
  return currentGameRef.value.player?.tavern;
});
const battlefieldCards = computed(() => {
  return currentGameRef.value.player?.minionsOnBattlefield || Array(7).fill(null);
});

const handCards = computed(() => {
  return currentGameRef.value.player?.handCards || Array(10).fill(null);
});

// 计算属性：是否可以升级酒馆
const canUpgrade = computed(() => {
  if (!travern.value) return false;
  return travern.value.gold >= travern.value.upgradeCost;
});

// 升级酒馆
const upgradeTavern = () => {
  playerController.upgradeTavern(currentGameRef.value.id);
};

// 刷新酒馆
const refreshTavern = () => {
  const result = playerController.refreshTavern(currentGameRef.value.id);
  if (!result.isSuccess()) {
    console.log('[失败] 刷新酒馆失败', result);
    return;
  }
  currentGameRef.value = currentGameController.getCurrentGameById(currentGameRef.value.id);
};

// 冻结/解冻酒馆
const toggleFreeze = () => {
  let result;
  if (travern.value?.isFrozen) {
    result = playerController.freezeTavern(currentGameRef.value.id, false);
    currentGameRef.value = currentGameController.getCurrentGameById(currentGameRef.value.id);
  } else {
    result = playerController.freezeTavern(currentGameRef.value.id, true);
  }
  if (!result.isSuccess()) {
    console.log('[失败] 冻结/解冻酒馆失败', result);
    return;
  }
};

// 结束回合
const endTurn = () => {
  const result = playerController.endTurn(currentGameRef.value.id);
  if (!result.isSuccess()) {
    console.log('[失败] 结束回合失败', result);
    return;
  }
  currentGameRef.value = currentGameController.getCurrentGameById(currentGameRef.value.id);
};

// 调试抽屉控制
const debugDrawerVisible = ref(false);
const showDebugDrawer = () => {
  debugDrawerVisible.value = true;
};
const closeDebugDrawer = () => {
  debugDrawerVisible.value = false;
};

// 战斗场景控制
const isBattleSceneVisible = ref(false);
const showBattleScene = () => {
  isBattleSceneVisible.value = true;
};
const hideBattleScene = () => {
  isBattleSceneVisible.value = false;
};

// 处理卡片交换事件 - 战场区域内位置交换
const handleCardSwap = (cardId: string, targetIndex: number) => {
  const playerData = player.value;
  if (!playerData) {
    throw new Error('当前游戏中没有玩家');
  }
  const minionsInBattle = playerData.minionsOnBattlefield;
  if (targetIndex < 0 || targetIndex >= minionsInBattle.length) {
    throw new Error('目标位置无效');
  }
  const sourceIndex = minionsInBattle.findIndex(
    (minion: Card | undefined) => minion && minion.id === cardId
  );
  if (sourceIndex === -1) {
    throw new Error(`当前游戏中没有随从: ${cardId}`);
  }
  const temp = minionsInBattle[targetIndex];
  const source = minionsInBattle[sourceIndex];
  minionsInBattle[sourceIndex] = temp;
  minionsInBattle[targetIndex] = source;
  // 保存玩家数据
  playerController.savePlayerData(currentGameRef.value.id, currentGameRef.value.player);
};
// 页面加载时自动随机初始化英雄
onMounted(async () => {
  const currentGame = await gameController.initGame();
  currentGameRef.value = currentGame;
  localStorage.setItem('currentGameId', currentGameRef.value.id);
  console.log('游戏已初始化，游戏ID:', currentGame.id, '已存入缓存');
  const heroes = heroController.generateHeroes(3);
  // todo 这里应该是交互 玩家选择英雄，但是英雄没有开发 就先取第一个了
  if (heroes.length <= 0) {
    throw new Error('生成的英雄为空');
  }
  const hero = heroes[0];
  if (!hero) {
    throw new Error('生成的英雄为空');
  }
  gameController.chooseHero(currentGame.id, hero.strId);
  gameController.startGame(currentGame.id);
});

/**
 * 处理卡片拖拽开始事件
 * @param cardId - 被拖拽的卡片ID
 *
 * 功能说明：
 * 1. 查找被拖拽的卡片在所有卡片集合中的位置
 * 2. 记录当前拖拽的卡片ID
 * 3. 根据卡片当前所在区域设置不同的拖拽状态：
 *    - 酒馆卡片：激活手牌区域高亮
 *    - 战场卡片：激活酒馆区域高亮
 *    - 其他情况：不激活任何区域高亮
 * 4. 输出拖拽日志信息
 */
const handleDragStart = (cardId: string) => {
  // 从所有分离的数组中查找卡片
  let card: Card | null = null;
  const allCards = [...tavernCards.value, ...battlefieldCards.value, ...handCards.value];
  const foundCard = allCards.filter(c => !!c).find(c => c && c.id === cardId);
  card = foundCard || null;

  currentDraggingCard.value = cardId;

  // 只有拖拽酒馆卡片时才激活手牌区域的高亮样式
  if (card?.location === 'tavern') {
    isDragActive.value = true;
    isTavernDragActive.value = false;
  }
  // 只有拖拽战场卡片时才激活酒馆区域的高亮样式
  else if (card?.location === 'battlefield') {
    isDragActive.value = false;
    isTavernDragActive.value = true;
  } else {
    isDragActive.value = false;
    isTavernDragActive.value = false;
  }
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
  fromLocation: 'tavern' | 'battlefield' | 'hand',
  toLocation: 'tavern' | 'battlefield' | 'hand',
  targetSlotIndex?: number
) => {
  console.log(
    `[父组件] 卡片移动事件: 卡片 ${cardId} 从 ${fromLocation} 移动到 ${toLocation}${targetSlotIndex !== undefined ? `, 目标空格子索引: ${targetSlotIndex}` : ''}`
  );

  // 从所有卡片中查找卡片数据
  let card: Card | null = null;
  const allCards = [...tavernCards.value, ...battlefieldCards.value, ...handCards.value];
  const foundCard = allCards.find(c => c && c.id === cardId);
  card = foundCard || null;

  if (card) {
    // 调用游戏store的方法来处理卡片移动
    console.log(`[父组件] 卡片位置更新: 卡片 ${cardId} 位置从 ${fromLocation} 变为 ${toLocation}`);

    // 根据不同的移动类型调用不同的游戏store方法
    if (fromLocation === 'tavern' && toLocation === 'hand') {
      const buyCardResult = playerController.buyCard(currentGameRef.value.id, cardId);
      if (buyCardResult.isSuccess()) {
        currentGameRef.value = currentGameController.getCurrentGameById(currentGameRef.value.id);
      } else {
        console.log(`[错误] 购买卡片失败: ${buyCardResult}`);
      }
    } else if (fromLocation === 'hand' && toLocation === 'battlefield') {
      const useCardResult = playerController.useCardFromHand(
        currentGameRef.value.id,
        cardId,
        targetSlotIndex
      );
      if (useCardResult.isSuccess()) {
        currentGameRef.value = currentGameController.getCurrentGameById(currentGameRef.value.id);
      } else {
        console.log(`[错误] 使用卡片失败: ${useCardResult}`);
      }
    } else if (fromLocation === 'battlefield' && toLocation === 'tavern') {
      // 清理选中
      globalStore.setSelectedCard(null);
      const sellCardResult = playerController.sellCard(currentGameRef.value.id, cardId);
      if (sellCardResult.isSuccess()) {
        currentGameRef.value = currentGameController.getCurrentGameById(currentGameRef.value.id);
      } else {
        console.log(`[错误] 出售卡片失败: ${sellCardResult}`);
      }
    }
  }
};

// 处理卡片移除
const handleCardRemove = (cardId: string) => {
  // 清理选中
  globalStore.setSelectedCard(null);
  const sellCardResult = playerController.sellCard(currentGameRef.value.id, cardId);
  if (sellCardResult.isSuccess()) {
    currentGameRef.value = currentGameController.getCurrentGameById(currentGameRef.value.id);
  } else {
    console.log(`[错误] 出售卡片失败: ${sellCardResult}`);
  }
};

// 处理法术释放事件
const handleSpellCast = (spellCardId: string, targetCardId?: string) => {
  console.log(`[法术释放] 法术卡牌 ${spellCardId} 释放，目标: ${targetCardId || '无'}`);

  // 1. 找到法术卡牌
  const allCards = [...tavernCards.value, ...battlefieldCards.value, ...handCards.value];
  const spellCard = allCards.find(c => c && c.id === spellCardId) as Spell;

  if (!spellCard) {
    console.error(`[法术释放] 未找到法术卡牌 ${spellCardId}`);
    return;
  }
  if (spellCard.requiresTarget) {
    if (!targetCardId) {
      console.error(`[法术释放] 法术 ${spellCard.name} 需要目标，但未提供目标`);
      return;
    }
    // 2. 找到目标卡牌
    let targetCardIndex = allCards.findIndex(c => c && c.id === targetCardId);
    if (targetCardIndex === -1) {
      console.error(`[法术释放] 未找到目标卡牌 ${targetCardId}`);
      return;
    }
    const useCardResult = playerController.useCardFromHand(
      currentGameRef.value.id,
      spellCardId,
      targetCardIndex,
      { targetCardId }
    );
    if (useCardResult.isSuccess()) {
      currentGameRef.value = currentGameController.getCurrentGameById(currentGameRef.value.id);
    } else {
      console.log(`[错误] 使用法术失败: ${useCardResult}`);
    }
  } else {
    //todo 使用法术
    const useCardResult = playerController.useCardFromHand(
      currentGameRef.value.id,
      spellCardId,
      undefined,
      {}
    );
    if (useCardResult.isSuccess()) {
      currentGameRef.value = currentGameController.getCurrentGameById(currentGameRef.value.id);
    } else {
      console.log(`[错误] 使用法术失败: ${useCardResult}`);
    }
  }
  // 清除高亮
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
  border-radius: 4px;
  width: 100%;
  height: 100%;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  gap: 10px;
  width: 100%;
  height: 100%;
}

.top-left {
  grid-area: 1 / 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-right {
  grid-area: 1 / 2;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.bottom-left {
  display: none;
}

.bottom-right {
  display: none;
}

.player-info .card-name {
  font-weight: bold;
  font-size: 3vmin;
  color: #1a5276;
  text-align: center;
}

.player-info .card-stats {
  display: flex;
  justify-content: space-around;
  font-size: 3.5vmin;
  margin: 5px 0;
}

.player-info .card-stats .attack {
  color: #e74c3c;
  font-weight: bold;
}

.player-info .card-stats .health {
  color: #27ae60;
  font-weight: bold;
}

.player-info .card-description {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 2vmin;
  line-height: 1.4;
  height: 100%;
  overflow-y: auto;
  text-align: left;
}

.player-info .card-buffs {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 2vmin;
  line-height: 1.4;
  overflow-y: auto;
  text-align: left;
  height: 100%;
}

.player-info .card-actions {
  display: flex;
  justify-content: space-around;
  gap: 1px;
}

.player-info .action-btn {
  cursor: pointer;
  border: none;
  border-radius: 4px;
  font-size: 4vmin;
  font-weight: bold;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  margin: 2%;
}

.player-info .action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.player-info .buy-btn {
  background: linear-gradient(145deg, #27ae60, #229954);
  color: white;
}

.player-info .buy-btn:hover {
  background: linear-gradient(145deg, #229954, #1e8449);
}

.player-info .place-btn {
  background: linear-gradient(145deg, #3498db, #2980b9);
  color: white;
}

.player-info .place-btn:hover {
  background: linear-gradient(145deg, #2980b9, #2471a3);
}

.player-info .sell-btn {
  background: linear-gradient(145deg, #e74c3c, #c0392b);
  color: white;
}

.player-info .sell-btn:hover {
  background: linear-gradient(145deg, #c0392b, #a93226);
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
