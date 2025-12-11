<template>
  <div class="game-board">
    <!-- 选择英雄界面 -->
    <div class="hero-selection" v-if="gameState === 'hero_selection'">
      <h1>选择你的英雄</h1>
      <div class="hero-cards">
        <div 
          v-for="hero in availableHeroes" 
          :key="hero.id"
          class="hero-card"
          @click="selectHero(hero.id)"
        >
          <div class="hero-image">
            <div class="placeholder">{{ hero.name.charAt(0) }}</div>
          </div>
          <div class="hero-info">
            <h2 class="hero-name">{{ hero.name }}</h2>
            <div class="hero-health">
              <span class="label">生命值:</span>
              <span class="value">{{ hero.health }}/{{ hero.maxHealth }}</span>
            </div>
            <div class="hero-armor" v-if="hero.armor > 0">
              <span class="label">护甲:</span>
              <span class="value">{{ hero.armor }}</span>
            </div>
            <div class="hero-power">
              <h3>{{ hero.heroPower.name }}</h3>
              <p>{{ hero.heroPower.description }}</p>
              <div class="power-cost" v-if="hero.heroPower.cost > 0">
                消耗: {{ hero.heroPower.cost }} 金币
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏主界面 -->
    <div class="main-game" v-else-if="gameState === 'in_game'">
      <h1>游戏主界面</h1>
      
      <!-- 游戏信息栏 -->
      <div class="game-info">
        <div class="player-info">
          <h2>你的英雄: {{ selectedHero?.name }}</h2>
          <div class="stats">
            <div class="health">生命值: {{ selectedHero?.health }}/{{ selectedHero?.maxHealth }}</div>
            <div class="gold">金币: {{ playerGold }}/{{ maxGold }}</div>
            <div class="tavern-level">酒馆等级: {{ tavernLevel }}</div>
            <div class="turn">回合: {{ turn }}</div>
          </div>
        </div>
      </div>

      <!-- 酒馆区域 -->
      <div class="tavern-section">
        <div class="tavern-header">
          <h3>鲍勃的酒馆</h3>
          <div class="tavern-actions">
            <button 
              class="refresh-btn" 
              @click="refreshTavern" 
              :disabled="playerGold < refreshCost"
            >
              刷新 ({{ refreshCost }} 金币)
            </button>
            <button 
              class="upgrade-btn"
              @click="upgradeTavern"
              :disabled="playerGold < calculateUpgradeCost()"
            >
              升级 ({{ calculateUpgradeCost() }} 金币)
            </button>
            <button 
              class="freeze-btn"
              @click="toggleFreezeTavern"
            >
              {{ isTavernFrozen ? '解冻' : '冻结' }}
            </button>
          </div>
        </div>
        <div class="available-minions">
          <div 
            v-for="(minion, index) in availableMinionsInTavern" 
            :key="index"
            class="minion-card"
          >
            <div class="minion-image">
              <div class="minion-placeholder">{{ minion.name.charAt(0) }}</div>
            </div>
            <div class="minion-details">
              <div class="minion-name">{{ minion.name }}</div>
              <div class="minion-stats">
                <div class="attack">{{ minion.attack }}</div>
                <div class="health">{{ minion.health }}</div>
              </div>
              <div class="minion-info">
                <div class="minion-cost">{{ minion.cost }} 金币</div>
                <div class="minion-star" v-if="minion.star > 0">
                  <span v-for="i in minion.star" :key="i">⭐</span>
                </div>
              </div>
            </div>
            <button 
              class="buy-btn"
              @click="buyMinion(index)"
              :disabled="playerGold < minion.cost || benchMinions.length >= 7"
            >
              购买
            </button>
          </div>
        </div>
      </div>

      <!-- 随从管理区域 -->
      <div class="minion-management">
        <!-- 战场区域 -->
        <div class="battlefield-section">
          <h3>战场 ({{ battlefieldMinions.length }}/7)</h3>
          <div class="minions-container">
            <div 
              v-for="(minion, index) in battlefieldMinions" 
              :key="index"
              class="minion-card"
            >
              <div class="minion-image">
                <div class="minion-placeholder">{{ minion.name.charAt(0) }}</div>
              </div>
              <div class="minion-details">
                <div class="minion-name">{{ minion.name }}</div>
                <div class="minion-stats">
                  <div class="attack">{{ minion.attack }}</div>
                  <div class="health">{{ minion.health }}</div>
                </div>
              </div>
              <button 
                class="return-to-bench-btn"
                @click="returnMinionToBench(index)"
              >
                返回 Bench
              </button>
            </div>
          </div>
        </div>

        <!-- Bench区域 -->
        <div class="bench-section">
          <h3>Bench ({{ benchMinions.length }}/7)</h3>
          <div class="minions-container">
            <div 
              v-for="(minion, index) in benchMinions" 
              :key="index"
              class="minion-card"
            >
              <div class="minion-image">
                <div class="minion-placeholder">{{ minion.name.charAt(0) }}</div>
              </div>
              <div class="minion-details">
                <div class="minion-name">{{ minion.name }}</div>
                <div class="minion-stats">
                  <div class="attack">{{ minion.attack }}</div>
                  <div class="health">{{ minion.health }}</div>
                </div>
              </div>
              <div class="minion-actions">
                <button 
                  class="place-btn"
                  @click="placeMinionOnBattlefield(index)"
                  :disabled="battlefieldMinions.length >= 7"
                >
                  放到战场
                </button>
                <button 
                  class="sell-btn"
                  @click="sellMinion(index)"
                >
                  出售
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 回合操作 -->
      <div class="turn-actions">
        <button class="end-turn-btn" @click="startBattlePhase">结束回合</button>
        <button class="return-btn" @click="returnToHeroSelection">返回英雄选择</button>
      </div>
    </div>

    <!-- 战斗场景 -->
    <div class="battle-scene" v-else-if="gameState === 'battle_phase'">
      <h1>战斗阶段</h1>
      
      <div class="battle-info">
        <div class="vs-indicator">
          <div class="player-side">
            <h2>你的英雄: {{ selectedHero?.name }}</h2>
            <div class="hero-health">生命值: {{ selectedHero?.health }}/{{ selectedHero?.maxHealth }}</div>
          </div>
          <div class="vs-text">VS</div>
          <div class="opponent-side">
            <h2>对手英雄: {{ opponentHero?.name }}</h2>
            <div class="hero-health">生命值: {{ opponentHero?.health }}/{{ opponentHero?.maxHealth }}</div>
          </div>
        </div>
      </div>

      <div class="battlefield-container">
        <!-- 对手随从 -->
        <div class="opponent-minions">
          <h3>对手随从</h3>
          <div class="minions-container">
            <div 
              v-for="(minion, index) in opponentMinions" 
              :key="index"
              class="minion-card"
            >
              <div class="minion-image">
                <div class="minion-placeholder">{{ minion.name.charAt(0) }}</div>
              </div>
              <div class="minion-details">
                <div class="minion-name">{{ minion.name }}</div>
                <div class="minion-stats">
                  <div class="attack">{{ minion.attack }}</div>
                  <div class="health">{{ minion.health }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 你的随从 -->
        <div class="player-minions">
          <h3>你的随从</h3>
          <div class="minions-container">
            <div 
              v-for="(minion, index) in battlefieldMinions" 
              :key="index"
              class="minion-card"
            >
              <div class="minion-image">
                <div class="minion-placeholder">{{ minion.name.charAt(0) }}</div>
              </div>
              <div class="minion-details">
                <div class="minion-name">{{ minion.name }}</div>
                <div class="minion-stats">
                  <div class="attack">{{ minion.attack }}</div>
                  <div class="health">{{ minion.health }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="battle-progress" v-if="!battleResult">
        <div class="battle-animation">
          <div class="loading-spinner"></div>
          <div class="animation-text">战斗进行中...</div>
        </div>
      </div>

      <div class="battle-result" v-else>
        <h2 class="result-title" :class="battleResult.isWin ? 'win' : 'loss'">
          {{ battleResult.isWin ? '胜利！' : '失败！' }}
        </h2>
        <div class="result-details">
          <div>造成伤害: {{ battleResult.damageDealt }}</div>
          <div>剩余随从: {{ battleResult.winnerMinionsLeft }}</div>
          <div>对手剩余: {{ battleResult.loserMinionsLeft }}</div>
        </div>
        <button class="continue-btn" @click="continueGame">继续游戏</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 游戏状态类型
type GameState = 'hero_selection' | 'in_game' | 'battle_phase' | 'game_over';

// 英雄类型定义
interface HeroPower {
  name: string;
  description: string;
  type: 'passive' | 'active' | 'channel';
  cost: number;
  cooldown: number;
  currentCooldown: number;
  use: () => void;
}

interface Hero {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  armor: number;
  heroPower: HeroPower;
}

// 随从类型定义
interface MinionEffect {
  type: 'battlecry' | 'death_rattle' | 'on_turn_start' | 'on_turn_end' | 'on_attack' | 'on_defend' | 'revenge' | 'on_minion_summoned';
  description: string;
}

interface Minion {
  id: string;
  name: string;
  star: number;
  type: 'beast' | 'mech' | 'dragon' | 'murloc' | 'demon' | 'elemental' | 'pirate' | 'all';
  attack: number;
  health: number;
  maxHealth: number;
  cost: number;
  keywords: string[];
  effects: MinionEffect[];
  isGolden: boolean;
  isFrozen: boolean;
  hasDivineShield: boolean;
  hasReborn: boolean;
}

// 游戏状态
const gameState = ref<GameState>('hero_selection');

// 可用英雄数据
const availableHeroes = ref<Hero[]>([
  {
    id: 'hero-1',
    name: '雷诺·杰克逊',
    health: 30,
    maxHealth: 30,
    armor: 0,
    heroPower: {
      name: '爆破专家',
      description: '被动：当你使用一张随从牌时，如果它的法力值消耗大于或等于(5)，则使其获得+1/+1和战吼。',
      type: 'passive',
      cost: 0,
      cooldown: 0,
      currentCooldown: 0,
      use: () => {}
    }
  },
  {
    id: 'hero-2',
    name: '伊利丹·怒风',
    health: 30,
    maxHealth: 30,
    armor: 0,
    heroPower: {
      name: '恶魔变形',
      description: '被动：在你的回合结束时，使你的所有随从获得+1攻击力。',
      type: 'passive',
      cost: 0,
      cooldown: 0,
      currentCooldown: 0,
      use: () => {}
    }
  },
  {
    id: 'hero-3',
    name: '玛维·影歌',
    health: 30,
    maxHealth: 30,
    armor: 0,
    heroPower: {
      name: '束缚',
      description: '在你的回合开始时，随机将一个敌方随从移回其拥有者的手牌。',
      type: 'passive',
      cost: 0,
      cooldown: 0,
      currentCooldown: 0,
      use: () => {}
    }
  }
]);

// 选中的英雄
const selectedHero = ref<Hero | null>(null);

// 玩家资源
const playerGold = ref(3);
const maxGold = ref(10);
const tavernLevel = ref(1);

// 玩家随从
const battlefieldMinions = ref<Minion[]>([]);
const benchMinions = ref<Minion[]>([]);

// 酒馆数据
const availableMinionsInTavern = ref<Minion[]>([]);
const isTavernFrozen = ref(false);
const refreshCost = ref(1);

// 游戏回合
const turn = ref(1);

// 模拟随从数据
const createMockMinion = (id: string, name: string, star: number, type: string, attack: number, health: number, cost: number): Minion => {
  return {
    id,
    name,
    star,
    type: type as any,
    attack,
    health,
    maxHealth: health,
    cost,
    keywords: [],
    effects: [],
    isGolden: false,
    isFrozen: false,
    hasDivineShield: false,
    hasReborn: false
  };
};

// 初始化酒馆随从
const initTavernMinions = () => {
  availableMinionsInTavern.value = [
    createMockMinion('minion-1', '鱼人招潮者', 1, 'murloc', 1, 1, 1),
    createMockMinion('minion-2', '南海船工', 1, 'pirate', 1, 2, 1),
    createMockMinion('minion-3', '微型木乃伊', 1, 'undead', 1, 2, 1),
    createMockMinion('minion-4', '雏龙', 1, 'dragon', 1, 3, 1)
  ];
};

// 选择英雄方法
const selectHero = (heroId: string) => {
  const hero = availableHeroes.value.find(h => h.id === heroId);
  if (hero) {
    selectedHero.value = hero;
    gameState.value = 'in_game';
    initTavernMinions(); // 初始化酒馆随从
    console.log('选择了英雄:', hero.name);
  }
};

// 返回英雄选择
const returnToHeroSelection = () => {
  gameState.value = 'hero_selection';
  selectedHero.value = null;
};

// 计算酒馆升级费用
const calculateUpgradeCost = (): number => {
  const upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
  return upgradeCosts[tavernLevel.value] || 0;
};

// 刷新酒馆随从
const refreshTavern = () => {
  if (playerGold.value >= refreshCost.value && !isTavernFrozen.value) {
    playerGold.value -= refreshCost.value;
    // 生成新的随机随从
    const mockMinions = [
      createMockMinion('minion-1', '鱼人招潮者', 1, 'murloc', 1, 1, 1),
      createMockMinion('minion-2', '南海船工', 1, 'pirate', 1, 2, 1),
      createMockMinion('minion-3', '微型木乃伊', 1, 'undead', 1, 2, 1),
      createMockMinion('minion-4', '雏龙', 1, 'dragon', 1, 3, 1),
      createMockMinion('minion-5', '机械袋鼠', 1, 'mech', 2, 1, 1),
      createMockMinion('minion-6', '杂毛野兽', 1, 'beast', 2, 1, 1)
    ];
    
    // 随机选择4个随从
    const newMinions: Minion[] = [];
    const shuffledMinions = [...mockMinions].sort(() => 0.5 - Math.random());
    for (let i = 0; i < 4; i++) {
      if (shuffledMinions[i]) {
        newMinions.push(shuffledMinions[i]);
      }
    }
    
    availableMinionsInTavern.value = newMinions;
  }
};

// 升级酒馆
const upgradeTavern = () => {
  const cost = calculateUpgradeCost();
  if (playerGold.value >= cost && tavernLevel.value < 6) {
    playerGold.value -= cost;
    tavernLevel.value++;
    // 升级后刷新酒馆
    refreshTavern();
  }
};

// 冻结/解冻酒馆
const toggleFreezeTavern = () => {
  isTavernFrozen.value = !isTavernFrozen.value;
};

// 购买随从
const buyMinion = (index: number) => {
  const minion = availableMinionsInTavern.value[index];
  if (minion && playerGold.value >= minion.cost && benchMinions.value.length < 7) {
    playerGold.value -= minion.cost;
    benchMinions.value.push(minion);
    // 从酒馆移除该随从
    availableMinionsInTavern.value.splice(index, 1);
    // 如果酒馆没有被冻结，刷新一个新随从
    if (!isTavernFrozen.value && availableMinionsInTavern.value.length < 4) {
      // 简单处理，随机添加一个新随从
      const mockMinions = [
        createMockMinion('minion-1', '鱼人招潮者', 1, 'murloc', 1, 1, 1),
        createMockMinion('minion-2', '南海船工', 1, 'pirate', 1, 2, 1)
      ];
      const randomMinion = mockMinions[Math.floor(Math.random() * mockMinions.length)];
      availableMinionsInTavern.value.push(randomMinion);
    }
  }
};

// 将随从放到战场
const placeMinionOnBattlefield = (index: number) => {
  const minion = benchMinions.value[index];
  if (minion && battlefieldMinions.value.length < 7) {
    benchMinions.value.splice(index, 1);
    battlefieldMinions.value.push(minion);
  }
};

// 将随从放回bench
const returnMinionToBench = (index: number) => {
  const minion = battlefieldMinions.value[index];
  if (minion && benchMinions.value.length < 7) {
    battlefieldMinions.value.splice(index, 1);
    benchMinions.value.push(minion);
  }
};

// 出售随从
const sellMinion = (index: number) => {
  const minion = benchMinions.value[index];
  if (minion) {
    benchMinions.value.splice(index, 1);
    // 出售随从获得1金币
    playerGold.value += 1;
    // 限制金币不超过最大值
    if (playerGold.value > maxGold.value) {
      playerGold.value = maxGold.value;
    }
  }
};

// 结束回合
const endTurn = () => {
  turn.value++;
  // 重置金币
  playerGold.value = Math.min(3 + Math.floor((turn.value - 1) / 1), maxGold.value);
  
  // 重置酒馆冻结状态
  isTavernFrozen.value = false;
  
  // 刷新酒馆随从
  refreshTavern();
  
  // 重置随从攻击状态（这里简化处理）
  battlefieldMinions.value.forEach(minion => {
    // 这里可以添加重置攻击次数的逻辑
  });
  
  console.log('结束回合，进入回合', turn.value);
};
</script>

<style scoped>
.game-board {
  width: 100%;
  min-height: 100vh;
  background-color: #1a1a2e;
  color: #ecf0f1;
  font-family: Arial, sans-serif;
  padding: 20px;
  box-sizing: border-box;
}

.hero-selection {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.hero-selection h1 {
  color: #f39c12;
  font-size: 36px;
  margin-bottom: 40px;
}

.hero-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.hero-card {
  width: 300px;
  background-color: #2c3e50;
  border: 2px solid #34495e;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.hero-card:hover {
  transform: translateY(-5px);
  border-color: #f1c40f;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.hero-image {
  width: 100%;
  height: 150px;
  background-color: #7f8c8d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  overflow: hidden;
}

.placeholder {
  font-size: 80px;
  font-weight: bold;
  color: #ecf0f1;
}

.hero-info {
  width: 100%;
}

.hero-name {
  color: #9b59b6;
  font-size: 24px;
  margin: 0 0 10px 0;
  text-align: center;
}

.hero-health, .hero-armor {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;
}

.label {
  color: #bdc3c7;
}

.value {
  color: #ecf0f1;
  font-weight: bold;
}

.hero-power {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #34495e;
}

.hero-power h3 {
  color: #3498db;
  font-size: 16px;
  margin: 0 0 5px 0;
}

.hero-power p {
  color: #bdc3c7;
  font-size: 12px;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.power-cost {
  color: #e74c3c;
  font-size: 12px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .hero-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-card {
    width: 90%;
    max-width: 300px;
  }
}

/* 游戏主界面样式 */
.main-game {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
}

.main-game h1 {
  color: #f39c12;
  font-size: 36px;
  margin-bottom: 30px;
}

.game-info {
  background-color: #2c3e50;
  border: 2px solid #34495e;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.player-info h2 {
  color: #9b59b6;
  font-size: 24px;
  margin: 0 0 15px 0;
}

.stats {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #34495e;
}

.health, .gold, .tavern-level, .turn {
  background-color: #34495e;
  padding: 10px 20px;
  border-radius: 20px;
  color: #ecf0f1;
  font-weight: bold;
  font-size: 16px;
}

.health {
  background-color: #27ae60;
}

.gold {
  background-color: #f1c40f;
  color: #2c3e50;
}

.tavern-level {
  background-color: #3498db;
}

.turn {
  background-color: #9b59b6;
}

/* 酒馆区域样式 */
.tavern-section {
  background-color: #2c3e50;
  border: 2px solid #34495e;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
}

.tavern-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #34495e;
}

.tavern-header h3 {
  color: #f39c12;
  font-size: 20px;
  margin: 0;
}

.tavern-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.refresh-btn, .upgrade-btn, .freeze-btn {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.refresh-btn:hover:not(:disabled), .upgrade-btn:hover:not(:disabled), .freeze-btn:hover {
  background-color: #2980b9;
}

.refresh-btn:disabled, .upgrade-btn:disabled {
  background-color: #7f8c8d;
  cursor: not-allowed;
}

.upgrade-btn {
  background-color: #9b59b6;
}

.upgrade-btn:hover:not(:disabled) {
  background-color: #8e44ad;
}

.freeze-btn {
  background-color: #3498db;
}

.freeze-btn:hover {
  background-color: #2980b9;
}

.available-minions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
}

.minion-card {
  width: 150px;
  background-color: #34495e;
  border: 2px solid #7f8c8d;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease;
}

.minion-card:hover {
  border-color: #f1c40f;
  transform: translateY(-2px);
}

.minion-image {
  width: 80px;
  height: 80px;
  background-color: #7f8c8d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  overflow: hidden;
}

.minion-placeholder {
  font-size: 40px;
  font-weight: bold;
  color: #ecf0f1;
}

.minion-details {
  width: 100%;
  text-align: center;
}

.minion-name {
  color: #ecf0f1;
  font-size: 12px;
  font-weight: bold;
  margin: 0 0 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.minion-stats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 8px;
}

.attack, .health {
  background-color: #e74c3c;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
}

.health {
  background-color: #27ae60;
}

.minion-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
  font-size: 10px;
  color: #bdc3c7;
}

.minion-cost {
  background-color: #f1c40f;
  color: #2c3e50;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

.minion-star {
  display: flex;
  gap: 2px;
}

.minion-star span {
  font-size: 12px;
}

.buy-btn, .place-btn, .sell-btn, .return-to-bench-btn {
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px;
  font-size: 12px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease;
  margin-top: auto;
}

.buy-btn:hover:not(:disabled), .place-btn:hover:not(:disabled), .sell-btn:hover, .return-to-bench-btn:hover {
  background-color: #229954;
}

.buy-btn:disabled, .place-btn:disabled {
  background-color: #7f8c8d;
  cursor: not-allowed;
}

.sell-btn {
  background-color: #e74c3c;
  margin-top: 5px;
}

.sell-btn:hover {
  background-color: #c0392b;
}

/* 随从管理区域样式 */
.minion-management {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin: 20px 0;
}

.battlefield-section, .bench-section {
  flex: 1;
  background-color: #2c3e50;
  border: 2px solid #34495e;
  border-radius: 10px;
  padding: 20px;
  min-width: 300px;
}

.battlefield-section h3, .bench-section h3 {
  color: #3498db;
  font-size: 18px;
  margin: 0 0 15px 0;
  text-align: center;
}

.minions-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
}

/* 回合操作样式 */
.turn-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.end-turn-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 30px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.end-turn-btn:hover {
  background-color: #c0392b;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tavern-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .tavern-actions {
    justify-content: center;
  }
  
  .minion-management {
    flex-direction: column;
  }
  
  .battlefield-section, .bench-section {
    width: 100%;
    min-width: auto;
  }
  
  .minion-card {
    width: 120px;
  }
}

.game-actions {
  margin-top: 20px;
}

.return-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.return-btn:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .main-game h1 {
    font-size: 28px;
  }
  
  .stats {
    flex-direction: column;
    align-items: center;
  }
  
  .health, .gold, .tavern-level {
    width: 80%;
    max-width: 200px;
  }
}
</style>