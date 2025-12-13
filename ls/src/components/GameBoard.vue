<template>
  <div class="game-root">
    <!-- 选择英雄界面 -->
    <a-row v-if="isHeroSelection">
      <a-col
        :span="8"
        v-for="hero in gameStore.availableHeroes"
        :key="hero.id"
        @click="selectHero(hero.id)"
      >
        <a-card>
          <div class="hero-initial">
            <div>{{ hero.name.charAt(0) }}</div>
          </div>
          <div class="hero-info">
            <h2>{{ hero.name }}</h2>
            <div>
              <span>生命值:</span>
              <span>{{ hero.health }}</span>
            </div>
            <div v-if="hero.armor > 0">
              <span>护甲:</span>
              <span>{{ hero.armor }}</span>
            </div>
            <div>
              <h3>
                {{ (hero as any).heroPowerList?.[0]?.name || hero.heroPower?.name || '未知技能' }}
              </h3>
              <p>
                {{
                  (hero as any).heroPowerList?.[0]?.text || hero.heroPower?.description || '无描述'
                }}
              </p>
              <div
                v-if="(hero as any).heroPowerList?.[0]?.manaCost > 0 || hero.heroPower?.cost > 0"
              >
                消耗: {{ (hero as any).heroPowerList?.[0]?.manaCost || hero.heroPower?.cost }}
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 游戏主界面 -->
    <div class="game-layout" v-else-if="isInGame">
      <!-- 左边30% 操作区域 -->
      <div class="left-section">
        <!-- 酒馆标题和等级 -->
        <div class="tavern-header">
          <h2>酒馆</h2>
          <div class="tavern-level">
            <span class="level-text">等级 {{ gameStore.player?.tavernLevel || 1 }}</span>
            <div class="turn-info">第几回合: {{ gameStore.currentTurn || 1 }}</div>
          </div>
        </div>

        <!-- 玩家信息 -->
        <div class="player-info">
          <div class="player-name">玩家</div>
          <div class="player-health">
            <span>生命值:</span>
            <span>{{ gameStore.player?.hero?.health || 30 }}</span>
          </div>

          <div class="gold-info">
            <span class="label">金币:</span>
            <span class="value"
              >{{ gameStore.player?.gold || 0 }} / {{ gameStore.player?.maxGold || 10 }}</span
            >
          </div>

          <div class="turn-info">
            <span class="label">回合:</span>
            <span class="value">{{ gameStore.currentTurn }}</span>
          </div>

          <div class="hero-info">
            <div class="hero-name">{{ gameStore.selectedHero?.name || '未选择英雄' }}</div>
            <div class="hero-health">
              <span>生命值:</span>
              <span>{{ gameStore.selectedHero?.health || 0 }}</span>
            </div>
          </div>

          <!-- 结束回合按钮 -->
          <button class="end-turn-button" @click="endTurn">结束回合</button>
        </div>

        <!-- 操作按钮区 -->
        <div class="tavern-actions">
          <!-- 升级按钮 -->
          <button
            class="action-button upgrade-button"
            :disabled="!canUpgrade"
            @click="upgradeTavern"
          >
            <span class="cost">{{ upgradeCost }}</span>
            升级
          </button>

          <!-- 刷新按钮 -->
          <button
            class="action-button refresh-button"
            :disabled="!(gameStore.player && gameStore.player.gold >= 1)"
            @click="refreshTavern"
          >
            <span class="cost">1</span>
            刷新
          </button>

          <!-- 冻结按钮 -->
          <button
            class="action-button freeze-button"
            :class="{ frozen: gameStore.tavern?.isFrozen }"
            @click="toggleFreeze"
          >
            {{ gameStore.tavern?.isFrozen ? '解冻' : '冻结' }}
          </button>
        </div>

        <!-- 选择的卡片信息 -->
        <div v-if="gameStore.selectedMinion || gameStore.selectedSpell" class="selected-card-info">
          <!-- 卡片类型 -->
          <div class="card-info-section">
            <div class="section-title">卡片类型</div>
            <div class="section-content">
              <span v-if="gameStore.selectedMinion" class="card-type minion-type">
                {{ gameStore.selectedMinion.cardType === 'minion' ? '随从' : '其他' }}
              </span>
              <span v-else-if="gameStore.selectedSpell" class="card-type spell-type">
                {{ gameStore.selectedSpell.type === 'shaping' ? '塑造法术' : '法术' }}
              </span>
            </div>
          </div>

          <!-- 卡片属性加成 -->
          <div class="card-info-section">
            <div class="section-title">属性加成</div>
            <div class="section-content">
              <!-- 永久属性加成 -->
              <div
                v-if="
                  gameStore.selectedMinion && gameStore.selectedMinion.permanentBuffs?.length > 0
                "
                class="buff-group permanent-buffs"
              >
                <div class="buff-type-label">永久加成：</div>
                <div class="buff-list">
                  <div
                    v-for="buff in gameStore.selectedMinion.permanentBuffs"
                    :key="buff.id"
                    class="buff-item"
                  >
                    <span class="buff-name">{{ buff.source }}</span>
                    <span class="buff-value">
                      <span v-if="buff.attackBonus !== 0">攻+{{ buff.attackBonus }}</span>
                      <span v-if="buff.healthBonus !== 0">血+{{ buff.healthBonus }}</span>
                      <span v-if="buff.maxHealthBonus !== 0">最大血+{{ buff.maxHealthBonus }}</span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- 临时属性加成 -->
              <div
                v-if="
                  gameStore.selectedMinion && gameStore.selectedMinion.temporaryBuffs?.length > 0
                "
                class="buff-group temporary-buffs"
              >
                <div class="buff-type-label">临时加成：</div>
                <div class="buff-list">
                  <div
                    v-for="buff in gameStore.selectedMinion.temporaryBuffs"
                    :key="buff.id"
                    class="buff-item"
                  >
                    <span class="buff-name">{{ buff.source }}</span>
                    <span class="buff-value">
                      <span v-if="buff.attackBonus !== 0">攻+{{ buff.attackBonus }}</span>
                      <span v-if="buff.healthBonus !== 0">血+{{ buff.healthBonus }}</span>
                      <span v-if="buff.maxHealthBonus !== 0">最大血+{{ buff.maxHealthBonus }}</span>
                      <span v-if="buff.turnsRemaining" class="buff-duration"
                        >({{ buff.turnsRemaining }}回合)</span
                      >
                    </span>
                  </div>
                </div>
              </div>

              <!-- 无属性加成 -->
              <div v-else-if="gameStore.selectedMinion" class="no-buffs">无属性加成</div>
              <div v-else-if="gameStore.selectedSpell" class="spell-effects">
                <span>法术效果：{{ gameStore.selectedSpell.text }}</span>
              </div>
            </div>
          </div>

          <!-- 卡片关键词加成 -->
          <div class="card-info-section" v-if="gameStore.selectedMinion">
            <div class="section-title">关键词加成</div>
            <div class="section-content">
              <!-- 永久关键词加成 -->
              <div
                v-if="gameStore.selectedMinion.permanentKeywords?.length > 0"
                class="keyword-group permanent-keywords"
              >
                <div class="keyword-type-label">永久关键词：</div>
                <div class="keyword-list">
                  <span
                    v-for="keyword in gameStore.selectedMinion.permanentKeywords"
                    :key="keyword"
                    class="keyword-item permanent-keyword"
                  >
                    {{ mapKeywordToCN(keyword) }}
                  </span>
                </div>
              </div>

              <!-- 临时关键词加成 -->
              <div
                v-if="gameStore.selectedMinion.temporaryKeywords?.length > 0"
                class="keyword-group temporary-keywords"
              >
                <div class="keyword-type-label">临时关键词：</div>
                <div class="keyword-list">
                  <span
                    v-for="keyword in gameStore.selectedMinion.temporaryKeywords"
                    :key="keyword"
                    class="keyword-item temporary-keyword"
                  >
                    {{ mapKeywordToCN(keyword) }}
                  </span>
                </div>
              </div>

              <!-- 无关键词加成 -->
              <div v-else class="no-keywords">无关键词加成</div>
            </div>
          </div>
        </div>
        <!-- 操作提示 -->
        <div v-if="gameStore.selectedMinion" class="action-hint">
          <!-- 选择的卡牌详情 -->
          <span>已选择: {{ gameStore.selectedMinion.name }}</span>
          <!-- 酒馆上的随从点击操作按钮 -->
          <button
            v-if="gameStore.selectedMinionSource === 'tavern'"
            class="action-button"
            @click="buySelectedMinion"
          >
            <span class="cost">{{ gameStore.selectedMinion.cost }}</span>
            购买
          </button>
          <!-- 战场上的随从点击操作按钮 -->
          <button
            v-else-if="gameStore.selectedMinionSource === 'battlefield'"
            class="action-button"
            @click="sellSelectedMinion"
          >
            出售
          </button>
          <!-- 手牌上的随从点击操作按钮 -->
          <button
            v-else-if="gameStore.selectedMinionSource === 'hand'"
            class="action-button"
            @click="placeMinionFromHand"
          >
            放置随从
          </button>
          <button class="action-button cancel-button" @click="cancelSelect">取消选择</button>
        </div>

        <!-- 调试按钮 -->
        <a-button @click="showDebugDrawer">调试</a-button>
      </div>
      <!-- 右边70% 主界面 -->
      <div class="right-section">
        <!-- 酒馆组件 -->
        <TavernVue />
        <!-- 战场区域 -->
        <Battlefield />
        <!-- 手牌组件 -->
        <Hand />
      </div>
    </div>

    <!-- 战斗结果界面 -->
    <div class="battle-result" v-else-if="gameStore.gameState === 'battle_result'">
      <div class="battle-result-content">
        <h2>战斗结束</h2>
        <div class="result-info">
          <div class="winner-info">
            <h3>{{ gameStore.battleResult?.winner?.hero?.name || '玩家' }} 获胜！</h3>
            <p>剩余随从: {{ gameStore.battleResult?.winnerMinionsLeft || 0 }}</p>
          </div>
          <div class="vs">VS</div>
          <div class="loser-info">
            <h3>{{ gameStore.battleResult?.loser?.hero?.name || '对手' }} 失败</h3>
            <p>剩余随从: {{ gameStore.battleResult?.loserMinionsLeft || 0 }}</p>
          </div>
        </div>
        <div class="damage-info">
          <p>造成伤害: {{ gameStore.battleResult?.damageDealt || 0 }}</p>
        </div>
        <button class="continue-button" @click="gameStore.returnFromBattle">继续游戏</button>
      </div>
    </div>

    <!-- 调试抽屉组件 -->
    <DebugDrawer
      v-model:debug-drawer-visible="debugDrawerVisible"
      :game-state="gameStore.gameState"
      :current-turn="gameStore.currentTurn"
      @close="closeDebugDrawer"
    />

    <!-- 拖拽箭头 - 用于法术拖拽时的视觉反馈 -->
    <svg
      v-if="gameStore.dragArrow.visible"
      class="drag-arrow"
      :style="{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }"
    >
      <line
        :x1="gameStore.dragArrow.startX"
        :y1="gameStore.dragArrow.startY"
        :x2="gameStore.dragArrow.endX"
        :y2="gameStore.dragArrow.endY"
        stroke="#ff6b6b"
        stroke-width="3"
        stroke-linecap="round"
      />
      <!-- 箭头头部 -->
      <polygon :points="getArrowHeadPoints(gameStore.dragArrow)" fill="#ff6b6b" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import heroesData from '../data/heroes.json';
import minionsData from '../data/minions.json';
import { useGameStore } from '../stores/game';
import { Player } from '../game/Player';
import { AIPlayer } from '../game/AIPlayer';
import { Minion } from '../game/Minion';
import { minionClassMapByStrId, isTavernMinion } from '../game/minion/MinionClassMap';
import TavernVue from './Tavern.vue';
import Hand from './Hand.vue';
import Battlefield from './Battlefield.vue';
import { Hero } from '../game/Hero';
import { Tavern } from '../game/Tavern';
import DebugDrawer from './DebugDrawer.vue';

const gameStore = useGameStore();

// 计算箭头头部的坐标点
const getArrowHeadPoints = (arrow: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}) => {
  const { startX, startY, endX, endY } = arrow;
  const arrowSize = 10;

  // 计算箭头方向角
  const angle = Math.atan2(endY - startY, endX - startX);

  // 计算箭头头部的三个点
  const points = [
    `${endX},${endY}`,
    `${endX - arrowSize * Math.cos(angle - Math.PI / 6)},${endY - arrowSize * Math.sin(angle - Math.PI / 6)}`,
    `${endX - arrowSize * Math.cos(angle + Math.PI / 6)},${endY - arrowSize * Math.sin(angle + Math.PI / 6)}`,
  ];

  return points.join(' ');
};

// 调试抽屉控制
const debugDrawerVisible = ref(false);
const showDebugDrawer = () => {
  debugDrawerVisible.value = true;
};
const closeDebugDrawer = () => {
  debugDrawerVisible.value = false;
};

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
  // 只使用已开发的随从类，直接使用minionClassMapByStrId的键
  const developedStrIds = Object.keys(minionClassMapByStrId);

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
      // 根据strId获取对应的随从类
      const MinionClass = minionClassMapByStrId[minionData.strId] || Minion;

      // 实例化对应的随从类
      return new MinionClass(
        minionData.id,
        minionData.strId,
        minionData.cardType,
        minionData.name,
        minionData.nameCN,
        minionData.text,
        minionData.mechanics || [],
        minionData.referencedTags || [],
        minionData.img,
        minionData.art,
        minionData.tier,
        minionData.health,
        minionData.attack,
        minionData.minionTypes,
        minionData.minionTypesCN,
        minionData.upgradeCard
      );
    });

  // 创建酒馆专用随从池 - 只包含可以在酒馆中出现的随从
  const tavernMinionPool = globalMinionPool.filter(minion => {
    // 检查该随从是否标记为可以在酒馆中出现
    // 默认值为true，确保没有标记的随从也能在酒馆中出现
    return isTavernMinion[minion.strId] !== false;
  });

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
  const player = new Player('player-1', heroObj as Hero, true);

  // 创建酒馆 - 使用酒馆专用池
  const tavern = new Tavern(1, tavernMinionPool);

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

    aiPlayers.push(new AIPlayer(`ai-${i + 1}`, aiHeroObj as Hero));
  }

  // 初始化store - 使用全局池作为游戏的主随从池
  gameStore.initGame(player, tavern, aiPlayers, globalMinionPool);
};

// 组件挂载时加载英雄数据
onMounted(() => {
  loadHeroes();
});

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

// 结束回合
const endTurn = () => {
  gameStore.endTurn();
};

// 计算属性
const canUpgrade = computed(() => {
  if (!gameStore.player) return false;
  const upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
  const cost = upgradeCosts[gameStore.player.tavernLevel] || 0;
  return gameStore.player.gold >= cost && gameStore.player.tavernLevel < 6;
});

const upgradeCost = computed(() => {
  if (!gameStore.player) return 0;
  const upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
  return upgradeCosts[gameStore.player.tavernLevel] || 0;
});

// 酒馆操作方法
const refreshTavern = () => {
  gameStore.refreshTavern();
};

const upgradeTavern = () => {
  gameStore.upgradeTavern();
};

const toggleFreeze = () => {
  if (gameStore.tavern?.isFrozen) {
    gameStore.unfreezeTavern();
  } else {
    gameStore.freezeTavern();
  }
};

// 购买选中的随从
const buySelectedMinion = () => {
  if (gameStore.selectedMinion) {
    gameStore.buyMinion(gameStore.selectedMinionIndex || 0);
    // 购买后取消选择
    gameStore.cancelSelectMinion();
  }
};

// 出售选中的随从
const sellSelectedMinion = () => {
  if (gameStore.selectedMinion && gameStore.selectedMinionIndex !== null) {
    gameStore.sellMinion('minion', gameStore.selectedMinionIndex);
    gameStore.cancelSelectMinion();
  }
};

// 从手牌放置随从到战场
const placeMinionFromHand = () => {
  console.log('placeMinionFromHand被调用');
  console.log('selectedMinion:', gameStore.selectedMinion);
  console.log('selectedMinionIndex:', gameStore.selectedMinionIndex);
  if (gameStore.selectedMinion && gameStore.selectedMinionIndex !== null) {
    console.log('开始从手牌放置随从到战场...');
    const success = gameStore.placeMinionFromHand(gameStore.selectedMinionIndex, 0);
    console.log('放置随从结果:', success ? '成功' : '失败');
    console.log('取消选择随从...');
    gameStore.cancelSelectMinion();
    console.log('placeMinionFromHand执行完成');
  } else {
    console.log('selectedMinion或selectedMinionIndex为空，无法放置随从');
  }
};

// 取消选择
const cancelSelect = () => {
  gameStore.cancelSelectMinion();
};

// 关键词中文映射
const mapKeywordToCN = (keyword: string): string => {
  const keywordMap: Record<string, string> = {
    taunt: '嘲讽',
    divine_shield: '圣盾',
    windfury: '风怒',
    super_windfury: '超级风怒',
    stealth: '潜行',
    charge: '冲锋',
    poisonous: '剧毒',
    reborn: '复生',
    immune: '免疫',
  };
  return keywordMap[keyword] || keyword;
};

// 计算属性：是否处于英雄选择阶段
const isHeroSelection = computed(() => {
  return gameStore.gameState === 'hero_selection';
});

// 计算属性：是否处于游戏中
const isInGame = computed(() => {
  return gameStore.gameState === 'in_game';
});
</script>

<style scoped>
/* 游戏根容器 - 参考demo.html的container样式 */
.game-root {
  height: 100%; /* 继承父容器高度 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 游戏主界面布局 - 响应式设计 */
.game-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 1fr;
  width: 100%;
  height: 100%;
  gap: 0;
  overflow: hidden;
}

/* 左边操作区域 - 固定宽度，适应卡片游戏特性 */
.left-section {
  background-color: #f0f2f5;
  padding: 15px;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  /* 确保在小屏幕上也有良好的显示 */
  min-width: 200px;
  max-width: 300px;
}

/* 右边主内容区域 - 自适应宽度 */
.right-section {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* 酒馆、战场、手牌组件均分高度 - 响应式调整 */
.right-section > * {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  /* 确保每个区域都能适应内容 */
  overflow: hidden;
}

/* 响应式设计 - 针对不同屏幕尺寸调整布局 */
@media (max-width: 1200px) {
  .game-layout {
    grid-template-columns: 200px 1fr;
  }

  .left-section {
    padding: 10px;
  }
}

@media (max-width: 768px) {
  /* 移动端布局 - 垂直排列 */
  .game-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .left-section {
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }

  .player-info,
  .tavern-actions,
  .tavern-header {
    flex: 1;
    min-width: 150px;
  }
}

@media (max-width: 480px) {
  .game-layout {
    grid-template-rows: auto 1fr;
  }

  .left-section {
    max-height: 150px;
    padding: 5px;
  }

  .player-info,
  .tavern-actions,
  .tavern-header {
    min-width: 120px;
  }
}

/* 酒馆标题和等级样式 */
.tavern-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tavern-header h2 {
  margin: 0;
  color: #ffd700;
  font-size: 24px;
}

.tavern-level {
  text-align: right;
}

.level-text {
  display: block;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: black;
}

.level-bar {
  width: 150px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.level-progress {
  height: 100%;
  background-color: #ffd700;
  transition: width 0.3s ease;
}

/* 操作按钮区样式 */
.tavern-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  position: relative;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upgrade-button {
  background-color: #4caf50;
  color: white;
}

.refresh-button {
  background-color: #2196f3;
  color: white;
}

.freeze-button {
  background-color: #9c27b0;
  color: white;
}

.freeze-button.frozen {
  background-color: #00bcd4;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.cost {
  background-color: #ffd700;
  color: black;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 14px;
}

/* 操作提示样式 */
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
  margin-top: 15px;
}

.cancel-button {
  background-color: #9e9e9e;
}

.cancel-button:hover {
  background-color: #757575;
}

/* 玩家信息区样式 */
.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 10px;
  margin: 20px auto;
  max-width: 100%;
  color: black;
  border: 2px solid rgba(0, 0, 0, 0.3);
  gap: 10px;
}

.gold-info,
.turn-info,
.hero-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.value {
  font-size: 18px;
  font-weight: bold;
  color: black;
}

.hero-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: black;
}

.hero-health {
  display: flex;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

/* 结束回合按钮样式 */
.end-turn-button {
  display: block;
  width: 200px;
  margin: 0 auto;
  padding: 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.end-turn-button:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* 英雄选择界面样式 */
.hero-initial {
  width: 100px;
  height: 100px;
  background-color: #7f8c8d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  overflow: hidden;
}

.hero-initial div {
  font-size: 50px;
  font-weight: bold;
  color: #ecf0f1;
}

.hero-info {
  text-align: center;
}

.hero-info h2 {
  color: #9b59b6;
  font-size: 24px;
  margin: 0 0 10px 0;
}

/* 选中卡片信息样式 */
.selected-card-info {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
  border: 2px solid rgba(0, 0, 0, 0.3);
  color: black;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.selected-card-info h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 18px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.card-info-section {
  margin-bottom: 15px;
}

.card-info-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-weight: bold;
  margin-bottom: 8px;
  color: #34495e;
  font-size: 14px;
}

.section-content {
  padding-left: 10px;
  font-size: 14px;
}

/* 卡片类型样式 */
.card-type {
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
}

.minion-type {
  background-color: #4caf50;
  color: white;
}

.spell-type {
  background-color: #2196f3;
  color: white;
}

/* 属性加成样式 */
.buff-group {
  margin-bottom: 8px;
}

.buff-group:last-child {
  margin-bottom: 0;
}

.buff-type-label {
  font-weight: bold;
  margin-right: 8px;
  color: #555;
  display: inline-block;
  margin-bottom: 5px;
}

.permanent-buffs .buff-type-label {
  color: #4caf50;
}

.temporary-buffs .buff-type-label {
  color: #ff9800;
}

.buff-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.buff-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.buff-name {
  font-size: 12px;
  color: #666;
}

.buff-value {
  font-weight: bold;
  font-size: 12px;
  color: #333;
  display: flex;
  gap: 10px;
}

.buff-duration {
  font-size: 11px;
  color: #ff9800;
}

/* 关键词加成样式 */
.keyword-group {
  margin-bottom: 8px;
}

.keyword-group:last-child {
  margin-bottom: 0;
}

.keyword-type-label {
  font-weight: bold;
  margin-right: 8px;
  color: #555;
  display: inline-block;
  margin-bottom: 5px;
}

.permanent-keywords .keyword-type-label {
  color: #4caf50;
}

.temporary-keywords .keyword-type-label {
  color: #ff9800;
}

.keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.keyword-item {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.permanent-keyword {
  background-color: #e8f5e8;
  color: #4caf50;
  border: 1px solid #c8e6c9;
}

.temporary-keyword {
  background-color: #fff3e0;
  color: #ff9800;
  border: 1px solid #ffe0b2;
}

/* 无加成样式 */
.no-buffs,
.no-keywords,
.spell-effects {
  color: #666;
  font-style: italic;
  padding: 5px 0;
}

.spell-effects {
  font-style: normal;
  color: #2196f3;
}
</style>
