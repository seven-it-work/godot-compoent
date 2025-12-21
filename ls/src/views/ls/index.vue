<template>
  <div class="vertical-hearthstone">
    <!-- 调试抽屉组件 -->
    <DebugDrawer v-model:debug-drawer-visible="debugDrawerVisible" @close="closeDebugDrawer" />
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
            :selected-card-id="gameStore.selectedCard?.id"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-select="
              cardData =>
                cardData ? gameStore.selectCard(cardData, index) : gameStore.cancelSelectCard()
            "
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
            :selected-card-id="gameStore.selectedCard?.id"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-select="
              cardData =>
                cardData ? gameStore.selectCard(cardData, index + 5) : gameStore.cancelSelectCard()
            "
          ></CardSlot>
          <div class="info-panel tavern-info">
            <div class="stats-row">
              <div>酒馆等级：{{ gameStore.player?.tavernLevel || 1 }}级</div>
              <button @click="upgradeTavern" :disabled="!canUpgrade">
                升级({{ upgradeCost }})
              </button>
            </div>

            <div class="buttons-row">
              <div>第{{ gameStore.currentTurn || 1 }}回合</div>
              <button
                @click="refreshTavern"
                :disabled="!(gameStore.player && gameStore.player.gold >= 1)"
              >
                刷新(1)
              </button>
              <button @click="toggleFreeze">
                {{ gameStore.tavern?.isFrozen ? '解冻(1)' : '冻结(1)' }}
              </button>
            </div>

            <div class="stats-row">
              <div>
                生命值：{{ gameStore.player?.hero?.health || 30 }} 护甲：{{
                  gameStore.player?.hero?.armor || 0
                }}
              </div>
              <button>技能</button>
            </div>

            <div class="buttons-row">
              <div>
                铸币：{{ gameStore.player?.gold || 0 }}/{{ gameStore.player?.maxGold || 0 }}
              </div>
              <button @click="endTurn">结束回合</button>
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
            :position-type="'战场'"
            :data="card"
            :selected-card-id="gameStore.selectedCard?.id"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-swap="(cardId, targetIndex) => handleCardSwap(cardId, targetIndex)"
            @card-select="
              cardData =>
                cardData ? gameStore.selectCard(cardData, index) : gameStore.cancelSelectCard()
            "
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
            :selected-card-id="gameStore.selectedCard?.id"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-swap="(cardId, targetIndex) => handleCardSwap(cardId, targetIndex)"
            @card-select="
              cardData =>
                cardData ? gameStore.selectCard(cardData, index + 5) : gameStore.cancelSelectCard()
            "
          ></CardSlot>
          <div class="info-panel player-info">
            <div class="layout-grid">
              <!-- 左区 -->
              <div class="top-left" v-if="gameStore.selectedCard">
                <div class="card-name" v-if="gameStore.selectedCard?.nameCN">
                  {{ gameStore.selectedCard?.nameCN || '非常长的名称' }}
                </div>
                <div class="card-stats" v-if="gameStore.selectedCard?.cardType === 'minion'">
                  <span class="attack"
                    >攻{{ (gameStore.selectedCard as any).getAttack() || 0 }}</span
                  >
                  <span class="health">血{{ (gameStore.selectedCard as any).health || 0 }}</span>
                </div>
                <div class="card-buffs" v-if="gameStore.selectedCard?.cardType === 'minion'">
                  <!-- 属性加成信息可以从gameStore.selectedCard中获取 -->
                  <div>
                    永久属性加成：
                    <span
                      v-for="(buff, index) in (gameStore.selectedCard as any).permanentBuffs"
                      :key="index"
                    >
                      {{ buff.attackBonus ? `+${buff.attackBonus}攻` : '' }}
                      {{ buff.healthBonus ? `+${buff.healthBonus}血` : '' }}
                    </span>
                  </div>
                  <div v-if="(gameStore.selectedCard as any).temporaryBuffs?.length">
                    临时属性加成：
                    <span
                      v-for="(buff, index) in (gameStore.selectedCard as any).temporaryBuffs"
                      :key="index"
                    >
                      {{ buff.attackBonus ? `+${buff.attackBonus}攻` : '' }}
                      {{ buff.healthBonus ? `+${buff.healthBonus}血` : '' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 右区 -->
              <div class="top-right" v-if="gameStore.selectedCard">
                <div class="card-description" v-html="gameStore.selectedCard?.text || ''"></div>
                <div class="card-actions">
                  <button
                    v-if="gameStore.selectedCard?.area === '酒馆'"
                    class="action-btn buy-btn"
                    @click="handleBuyAction"
                  >
                    购买
                  </button>
                  <button
                    v-if="gameStore.selectedCard?.area === '手牌'"
                    class="action-btn place-btn"
                    @click="handlePlaceAction"
                  >
                    放置
                  </button>
                  <button
                    v-if="gameStore.selectedCard?.area === '战场'"
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
            :position-type="'手牌'"
            :data="card"
            :selected-card-id="gameStore.selectedCard?.id"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-select="
              cardData =>
                cardData ? gameStore.selectCard(cardData, index) : gameStore.cancelSelectCard()
            "
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
            :selected-card-id="gameStore.selectedCard?.id"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @card-move="handleCardMove"
            @card-remove="handleCardRemove"
            @card-select="
              cardData =>
                cardData ? gameStore.selectCard(cardData, index + 5) : gameStore.cancelSelectCard()
            "
          ></CardSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import heroesData from '../../data/heroes.json';
import minionsData from '../../data/minions.json';
import { AIPlayer } from '@/game/AIPlayer';
import { Card } from '@/game/Card';
import type { CardArea } from '@/game/Card';
import { Minion } from '@/game/Minion';
import { getMinionClassByStrId, getAllMinionStrIds } from '@/game/cards/minion/MinionClassMap';
import { Player } from '@/game/Player';
import { Tavern } from '@/game/Tavern';
import { useGameStore } from '@/stores/game';
import CardSlot from './components/CardSlot.vue';
import DebugDrawer from './components/DebugDrawer.vue';

// 使用游戏store
const gameStore = useGameStore();

// 拖拽状态 - 控制手牌区域高亮
const isDragActive = ref(false);

// 酒馆拖拽状态 - 控制酒馆区域高亮
const isTavernDragActive = ref(false);

// 购买按钮点击事件处理
const handleBuyAction = () => {
  if (gameStore.selectedCard && gameStore.selectedCardIndex !== null) {
    gameStore.buyMinion(gameStore.selectedCardIndex);
  }
};

// 放置按钮点击事件处理
const handlePlaceAction = () => {
  if (gameStore.selectedCard && gameStore.selectedCardIndex !== null) {
    // 寻找战场上的第一个空位
    const battlefield = gameStore.player?.minions;
    if (battlefield) {
      let emptyPosition = battlefield.findIndex(minion => minion === null);
      // 如果没有空位，放在最后一个位置
      if (emptyPosition === -1) {
        emptyPosition = battlefield.length;
      }
      gameStore.placeMinionFromHand(gameStore.selectedCardIndex, emptyPosition);
    }
  }
};

// 出售按钮点击事件处理
const handleSellAction = () => {
  if (gameStore.selectedCard && gameStore.selectedCardIndex !== null) {
    gameStore.sellMinion('minion', gameStore.selectedCardIndex);
  }
};

// 当前拖拽的卡片ID
const currentDraggingCard = ref<string | null>(null);

// 计算属性：从游戏store获取卡片数据
const tavernCards = computed(() => {
  // 如果游戏store中有酒馆，使用其可用随从，否则初始化7个空槽
  if (gameStore.tavern && gameStore.tavern.availableMinions) {
    const availableMinions = gameStore.tavern.availableMinions;
    // 确保总共有7个槽位，不足则用null填充
    const filledSlots = [...availableMinions];
    while (filledSlots.length < 7) {
      filledSlots.push(null);
    }
    return filledSlots;
  }
  // 初始状态：7个空槽
  return Array(7).fill(null);
});

const battlefieldCards = computed(() => {
  // 如果游戏store中有玩家且有战场随从，使用其数据，否则初始化7个空槽
  if (gameStore.player && gameStore.player.minions) {
    const minions = gameStore.player.minions;
    // 确保总共有7个槽位，不足则用null填充
    const filledSlots = [...minions];
    while (filledSlots.length < 7) {
      filledSlots.push(null);
    }
    return filledSlots as (Minion | null)[];
  }
  // 初始状态：7个空槽
  return Array(7).fill(null) as (Minion | null)[];
});

const handCards = computed(() => {
  // 如果游戏store中有玩家且有手牌，使用其数据，否则初始化10个空槽
  if (gameStore.player && gameStore.player.cards) {
    const cards = gameStore.player.cards;
    // 确保总共有10个槽位，不足则用null填充
    const filledSlots: (Card | null)[] = [...cards];
    while (filledSlots.length < 10) {
      filledSlots.push(null);
    }
    return filledSlots;
  }
  // 初始状态：10个空槽
  return Array(10).fill(null) as (Card | null)[];
});

// 计算属性：是否可以升级酒馆
const canUpgrade = computed(() => {
  if (!gameStore.player) return false;
  const upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
  const cost = upgradeCosts[gameStore.player.tavernLevel] || 0;
  return gameStore.player.gold >= cost && gameStore.player.tavernLevel < 6;
});

// 计算属性：升级酒馆的费用
const upgradeCost = computed(() => {
  if (!gameStore.player) return 0;
  const upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
  return upgradeCosts[gameStore.player.tavernLevel] || 0;
});

// 从JSON文件加载英雄数据，并随机选择3个
const loadHeroes = () => {
  // 复制英雄数据
  const allHeroes = [...heroesData] as any[];

  // 随机选择3个英雄
  const shuffledHeroes = allHeroes.sort(() => 0.5 - Math.random());
  const selectedHeroes = shuffledHeroes.slice(0, 3);

  // 存入store
  gameStore.setAvailableHeroes(selectedHeroes);
};

// 从已开发的随从类创建随从池
const createMinionPool = () => {
  // 只使用已开发的随从类，通过getAllMinionStrIds获取所有已开发的strId
  const developedStrIds = getAllMinionStrIds();

  // 辅助函数：递归提取所有随从数据（包括tokens中的）
  const extractAllMinions = (data: any[]): any[] => {
    let allMinions: any[] = [];

    data.forEach(item => {
      // 添加当前item
      allMinions.push(item);

      // 递归处理tokens
      if (item.tokens && Array.isArray(item.tokens)) {
        allMinions = allMinions.concat(extractAllMinions(item.tokens));
      }

      // 递归处理upgradeCard
      if (item.upgradeCard) {
        allMinions.push(item.upgradeCard);
        if (item.upgradeCard.tokens && Array.isArray(item.upgradeCard.tokens)) {
          allMinions = allMinions.concat(extractAllMinions(item.upgradeCard.tokens));
        }
      }
    });

    return allMinions;
  };

  // 提取所有随从数据（包括top-level和tokens中的）
  const allMinionData = extractAllMinions(minionsData);
  // 从所有数据中过滤出已开发的随从
  const globalMinionPool = allMinionData
    .filter(minionData => {
      // 只处理随从类型，并且strId在已开发列表中
      return minionData.cardType === 'minion' && developedStrIds.includes(minionData.strId);
    })
    .map(minionData => {
      // 为每个随从创建Minion实例
      const MinionClass = getMinionClassByStrId(minionData.strId);
      if (MinionClass) {
        try {
          return new MinionClass({
            strId: minionData.strId,
            cardType: minionData.cardType,
            name: minionData.name,
            nameCN: minionData.nameCN,
            text: minionData.text,
            mechanics: minionData.mechanics || [],
            referencedTags: minionData.referencedTags || [],
            img: minionData.img,
            art: minionData.art,
            tier: minionData.tier,
            health: minionData.health,
            attack: minionData.attack,
            minionTypes: minionData.minionTypes || [],
            minionTypesCN: minionData.minionTypesCN || [],
            upgradeCard: minionData.upgradeCard,
          });
        } catch (error) {
          console.error(`创建随从 ${minionData.strId} 实例时出错:`, error);
          return null;
        }
      }
      return null;
    })
    .filter((minion): minion is Minion => minion !== null);
  // 酒馆专用池 - 使用全局池
  const tavernMinionPool = globalMinionPool;
  console.log('酒馆专用池:', tavernMinionPool);

  // 返回两个池：全局池和酒馆专用池
  return { globalMinionPool, tavernMinionPool };
};

// 初始化游戏
const initGame = (hero: any) => {
  // 创建随从池 - 获取全局池和酒馆专用池
  const { globalMinionPool, tavernMinionPool } = createMinionPool();

  // 转换heroPowerList为heroPower对象
  const heroPowerData = hero.heroPowerList?.[0] || {
    name: '未知技能',
    text: '无描述',
    manaCost: 0,
  };

  // 创建符合Hero类的hero对象
  const heroObj = {
    ...hero,
    heroPower: {
      name: heroPowerData.name,
      description: heroPowerData.text,
      type: 'active' as any,
      cost: heroPowerData.manaCost,
      cooldown: 0,
      currentCooldown: 0,
      use: () => {},
    },
  };

  // 创建玩家
  const player = new Player('player-1', heroObj as any, true);

  // 创建酒馆 - 使用酒馆专用池
  const tavern = new Tavern(1, tavernMinionPool);
  tavern.refresh();

  // 创建AI玩家
  const aiPlayers = [];
  for (let i = 0; i < 7; i++) {
    const aiHeroData = heroesData[i % heroesData.length] as any;
    const aiHeroPowerData = aiHeroData.heroPowerList?.[0] || {
      name: '未知技能',
      text: '无描述',
      manaCost: 0,
    };

    const aiHeroObj = {
      ...aiHeroData,
      heroPower: {
        name: aiHeroPowerData.name,
        description: aiHeroPowerData.text,
        type: 'active' as any,
        cost: aiHeroPowerData.manaCost,
        cooldown: 0,
        currentCooldown: 0,
        use: () => {},
      },
    };

    aiPlayers.push(new AIPlayer(`ai-${i + 1}`, aiHeroObj as any));
  }

  // 初始化store - 使用全局池作为游戏的主随从池
  gameStore.initGame(player, tavern, aiPlayers, globalMinionPool);
};

// 选择英雄方法
const selectHero = (heroId: string) => {
  const hero = gameStore.availableHeroes.find(h => h.id === heroId);
  if (hero) {
    // 存入store
    gameStore.selectHero(hero);
    // 初始化游戏
    initGame(hero);
    console.log('选择了英雄:', hero.name);
  }
};

// 升级酒馆
const upgradeTavern = () => {
  gameStore.upgradeTavern();
};

// 刷新酒馆
const refreshTavern = () => {
  gameStore.refreshTavern();
};

// 冻结/解冻酒馆
const toggleFreeze = () => {
  if (gameStore.tavern?.isFrozen) {
    gameStore.unfreezeTavern();
  } else {
    gameStore.freezeTavern();
  }
};

// 结束回合
const endTurn = () => {
  gameStore.endTurn();
};

// 调试抽屉控制
const debugDrawerVisible = ref(false);
const showDebugDrawer = () => {
  debugDrawerVisible.value = true;
};
const closeDebugDrawer = () => {
  debugDrawerVisible.value = false;
};

// 处理卡片交换事件 - 战场区域内位置交换
const handleCardSwap = (cardId: string, targetIndex: number) => {
  console.log(`[父组件] 卡片交换事件: 卡片 ${cardId} 交换到目标索引: ${targetIndex}`);

  // 找到源卡片在battlefieldCards中的索引
  const sourceIndex = battlefieldCards.value.findIndex(
    (card: Card | null) => card && card.id === cardId
  );

  if (sourceIndex === -1) {
    console.error(`[父组件] 未找到卡片: ${cardId} 在战场区域`);
    return;
  }

  console.log(`[父组件] 源卡片索引: ${sourceIndex}, 目标索引: ${targetIndex}`);

  // 确保目标索引有效
  if (targetIndex < 0 || targetIndex >= battlefieldCards.value.length) {
    console.error(`[父组件] 无效的目标索引: ${targetIndex}`);
    return;
  }

  // 调用游戏store的方法来交换卡片
  const success = gameStore.reorderMinions(sourceIndex, targetIndex);

  if (success) {
    console.log(`[父组件] 卡片交换成功: ${cardId} 从索引 ${sourceIndex} 移动到 ${targetIndex}`);
  } else {
    console.error(`[父组件] 卡片交换失败: ${cardId} 从索引 ${sourceIndex} 移动到 ${targetIndex}`);
  }
};

// 页面加载时自动随机初始化英雄
onMounted(() => {
  // 加载英雄数据
  loadHeroes();
  // 随机选择第一个可用英雄
  if (gameStore.availableHeroes.length > 0) {
    const randomIndex = Math.floor(Math.random() * gameStore.availableHeroes.length);
    const randomHero = gameStore.availableHeroes[randomIndex];
    // 选择并初始化英雄
    if (randomHero) {
      selectHero(randomHero.id);
      console.log('页面加载时随机选择了英雄:', randomHero.name || '未知英雄');
    }
  }
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
  const foundCard = allCards.find(c => c && c.id === cardId);
  card = foundCard || null;

  currentDraggingCard.value = cardId;

  // 只有拖拽酒馆卡片时才激活手牌区域的高亮样式
  if (card?.area === '酒馆') {
    isDragActive.value = true;
    isTavernDragActive.value = false;
  }
  // 只有拖拽战场卡片时才激活酒馆区域的高亮样式
  else if (card?.area === '战场') {
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
  fromArea: CardArea,
  toArea: CardArea,
  targetSlotIndex?: number
) => {
  console.log(
    `[父组件] 卡片移动事件: 卡片 ${cardId} 从 ${fromArea} 移动到 ${toArea}${targetSlotIndex !== undefined ? `, 目标空格子索引: ${targetSlotIndex}` : ''}`
  );

  // 从所有卡片中查找卡片数据
  let card: Card | null = null;
  const allCards = [...tavernCards.value, ...battlefieldCards.value, ...handCards.value];
  const foundCard = allCards.find(c => c && c.id === cardId);
  card = foundCard || null;

  if (card) {
    // 调用游戏store的方法来处理卡片移动
    console.log(`[父组件] 卡片位置更新: 卡片 ${cardId} 位置从 ${fromArea} 变为 ${toArea}`);

    // 根据不同的移动类型调用不同的游戏store方法
    if (fromArea === '酒馆' && toArea === '手牌') {
      // 从酒馆购买卡片到手牌
      const success = gameStore.moveCard(cardId, fromArea, toArea);
      console.log(`[父组件] 从酒馆购买卡片: ${card.nameCN}, 结果: ${success}`);
    } else if (fromArea === '手牌' && toArea === '战场') {
      // 从手牌放置卡片到战场
      console.log(`[父组件] 从手牌放置卡片到战场: ${card.nameCN}, 目标位置: ${targetSlotIndex}`);
      // 找到卡片在handCards中的索引
      const handCardIndex = handCards.value.findIndex(c => c && c.id === cardId);
      if (handCardIndex !== -1 && targetSlotIndex !== undefined) {
        const success = gameStore.placeMinionFromHand(handCardIndex, targetSlotIndex);
        console.log(`[父组件] 放置结果: ${success}`);
      }
    } else if (fromArea === '战场' && toArea === '酒馆') {
      // 从战场出售卡片到酒馆
      console.log(`[父组件] 从战场出售卡片: ${card.nameCN}`);
      // 找到卡片在battlefieldCards中的索引
      const battlefieldCardIndex = battlefieldCards.value.findIndex(c => c && c.id === cardId);
      if (battlefieldCardIndex !== -1) {
        const success = gameStore.sellMinion('minion', battlefieldCardIndex);
        console.log(`[父组件] 出售结果: ${success}`);
      }
    }

    console.log(
      `[父组件] 当前卡片分布: 酒馆 ${tavernCards.value.filter(c => c).length}/${tavernCards.value.length}张, 战场 ${battlefieldCards.value.filter(c => c).length}/${battlefieldCards.value.length}张, 手牌 ${handCards.value.filter(c => c).length}/${handCards.value.length}张`
    );
  }
};

// 处理卡片移除
const handleCardRemove = (cardId: string) => {
  console.log(`[父组件] 卡片移除事件: 卡片 ${cardId} 被移除`);

  // 查找卡片所在区域和索引
  // 1. 检查战场区域
  const battlefieldIndex = battlefieldCards.value.findIndex(c => c && c.id === cardId);
  if (battlefieldIndex !== -1) {
    const success = gameStore.sellMinion('minion', battlefieldIndex);
    console.log(`[父组件] 从战场出售卡片，结果: ${success}`);
    return;
  }

  // 2. 检查手牌区域
  const handIndex = handCards.value.findIndex(c => c && c.id === cardId);
  if (handIndex !== -1) {
    const success = gameStore.sellMinion('hand', handIndex);
    console.log(`[父组件] 从手牌出售卡片，结果: ${success}`);
    return;
  }

  // 3. 检查酒馆区域（暂时不处理酒馆卡片移除）
  console.log(`[父组件] 卡片 ${cardId} 不在可移除区域`);

  console.log(
    `[父组件] 当前卡片分布: 酒馆 ${tavernCards.value.filter(c => c).length}/${tavernCards.value.length}张, 战场 ${battlefieldCards.value.filter(c => c).length}/${battlefieldCards.value.length}张, 手牌 ${handCards.value.filter(c => c).length}/${handCards.value.length}张`
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
