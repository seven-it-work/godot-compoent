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
            <div>
            <div>{{ hero.name.charAt(0) }}</div>
          </div>
          <div>
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
    <div v-else-if="gameStore.gameState === 'in_game'">
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
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
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
}

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
</script>

<style scoped>
/* 玩家信息区样式 */
.player-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 10px;
  margin: 20px auto;
  max-width: 800px;
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
</style>
