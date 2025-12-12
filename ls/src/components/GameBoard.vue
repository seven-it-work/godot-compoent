<template>
  <div>
    <!-- 选择英雄界面 -->
    <a-row v-if="gameStore.gameState === 'hero_selection'">
      <a-col :span="8"
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
              <h3>{{ (hero as any).heroPowerList?.[0]?.name || hero.heroPower?.name || '未知技能' }}</h3>
              <p>{{ (hero as any).heroPowerList?.[0]?.text || hero.heroPower?.description || '无描述' }}</p>
              <div v-if="(hero as any).heroPowerList?.[0]?.manaCost > 0 || hero.heroPower?.cost > 0">
                消耗: {{ (hero as any).heroPowerList?.[0]?.manaCost || hero.heroPower?.cost }}
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 游戏主界面 -->
    <div class="game-layout" v-else-if="gameStore.gameState === 'in_game'">
      <!-- 左边30% 操作区域 -->
      <div class="left-section">
        <!-- 酒馆标题和等级 -->
        <div class="tavern-header">
          <h2>酒馆</h2>
          <div class="tavern-level">
            <span class="level-text">等级 {{ gameStore.player?.tavernLevel || 1 }}</span>
            <div class="level-bar">
              <div 
                class="level-progress" 
                :style="{ width: `${(gameStore.player?.tavernLevel || 1) / 6 * 100}%` }"
              ></div>
            </div>
          </div>
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

        <!-- 操作提示 -->
        <div v-if="gameStore.selectedMinion" class="action-hint">
          <span>已选择: {{ gameStore.selectedMinion.name }}</span>
          <!-- 酒馆上的随从点击操作按钮 -->
          <button v-if="gameStore.selectedMinionSource === 'tavern'" class="action-button" @click="buySelectedMinion">
            <span class="cost">{{ gameStore.selectedMinion.cost }}</span>
            购买
          </button>
          <!-- 战场上的随从点击操作按钮 -->
          <button v-else-if="gameStore.selectedMinionSource === 'battlefield'" class="action-button" @click="sellSelectedMinion">
            出售
          </button>
          <!-- 手牌上的随从点击操作按钮 -->
          <button v-else-if="gameStore.selectedMinionSource === 'hand'" class="action-button" @click="placeMinionFromHand">
            放置随从
          </button>
          <button class="action-button cancel-button" @click="cancelSelect">取消选择</button>
        </div>
      </div>
      <!-- 右边70% 主界面 -->
      <div class="right-section">
        <!-- 酒馆组件 -->
        <TavernVue />
        <!-- 战场区域 -->
        <Battlefield />
        <!-- 手牌组件 -->
        <Hand />
        <!-- 底部区域 -->
        <!-- 玩家信息区 -->
        <div class="player-info">
          <div class="gold-info">
            <span class="label">金币:</span>
            <span class="value">{{ gameStore.player?.gold || 0 }} / {{ gameStore.player?.maxGold || 10 }}</span>
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
        </div>

        <!-- 结束回合按钮 -->
        <button class="end-turn-button" @click="endTurn">
          结束回合
        </button>

        <!-- 返回英雄选择 -->
        <div style="text-align: center; margin-top: 20px;">
          <button @click="returnToHeroSelection">返回英雄选择</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import heroesData from '../data/heroes.json';
import minionsData from '../data/minions.json';
import { useGameStore } from '../stores/game';
import { Player } from '../game/Player';
import { AIPlayer } from '../game/AIPlayer';
import { Minion } from '../game/Minion';
import TavernVue from './Tavern.vue';
import Hand from './Hand.vue';
import Battlefield from './Battlefield.vue';
import { Hero } from '../game/Hero';
import { Tavern } from '../game/Tavern';

// 使用游戏store
const gameStore = useGameStore();

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

// 从JSON数据创建随从池
const createMinionPool = () => {
  return minionsData.map(minionData => {
    return new Minion(
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
};

// 初始化游戏
const initGame = (hero: any) => {
  // 创建随从池
  const minionPool = createMinionPool();
  
  // 转换heroPowerList为heroPower对象
  const heroPowerData = hero.heroPowerList?.[0] || {
    name: '未知技能',
    text: '无描述',
    manaCost: 0
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
      use: () => {}
    }
  };
  
  // 创建玩家
  const player = new Player('player-1', heroObj as Hero, true);
  
  // 创建酒馆
  const tavern = new Tavern(1, minionPool);
  
  // 创建AI玩家
  const aiPlayers = [];
  for (let i = 0; i < 7; i++) {
    const aiHeroData = heroesData[i % heroesData.length] as any;
    const aiHeroPowerData = aiHeroData.heroPowerList?.[0] || {
      name: '未知技能',
      text: '无描述',
      manaCost: 0
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
        use: () => {}
      }
    };
    
    aiPlayers.push(new AIPlayer(`ai-${i + 1}`, aiHeroObj as Hero));
  }
  
  // 初始化store
  gameStore.initGame(player, tavern, aiPlayers);
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

// 返回英雄选择
const returnToHeroSelection = () => {
  gameStore.returnToHeroSelection();
  // 重新随机选择3个英雄
  loadHeroes();
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
  if (gameStore.selectedMinion && gameStore.selectedMinionIndex !== null) {
    gameStore.placeMinionFromBench(gameStore.selectedMinionIndex, 0);
    gameStore.cancelSelectMinion();
  }
};

// 取消选择
const cancelSelect = () => {
  gameStore.cancelSelectMinion();
};
</script>

<style scoped>
/* 游戏主界面布局 */
.game-layout {
  display: flex;
  width: 100%;
  height: 100vh;
}

/* 左边30% 操作区域 */
.left-section {
  width: 30%;
  background-color: #f0f2f5;
  padding: 20px;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 右边70% 主内容区域 */
.right-section {
  width: 70%;
  background-color: #ffffff;
  padding: 20px;
  overflow-y: auto;
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
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 10px;
  margin: 20px auto;
  max-width: 100%;
  color: black;
  border: 2px solid rgba(0, 0, 0, 0.3);
}

.gold-info, .turn-info, .hero-info {
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
</style>