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
              <span class="value">{{ hero.health }}</span>
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
            <div class="health">生命值: {{ selectedHero?.health }}</div>
          </div>
        </div>
      </div>

      <!-- 回合操作 -->
      <div class="turn-actions">
        <button class="return-btn" @click="returnToHeroSelection">返回英雄选择</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import heroesData from '../data/heroes.json';

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
}

interface Hero {
  id: string;
  name: string;
  health: number;
  armor: number;
  heroPower: HeroPower;
}

// 游戏状态
const gameState = ref<GameState>('hero_selection');

// 可用英雄数据 - 只显示3个英雄
const availableHeroes = ref<Hero[]>([]);

// 选中的英雄
const selectedHero = ref<Hero | null>(null);

// 从JSON文件加载英雄数据，并随机选择3个
const loadHeroes = () => {
  // 复制英雄数据
  const allHeroes = [...heroesData] as Hero[];
  
  // 随机选择3个英雄
  const shuffledHeroes = allHeroes.sort(() => 0.5 - Math.random());
  availableHeroes.value = shuffledHeroes.slice(0, 3);
};

// 组件挂载时加载英雄数据
onMounted(() => {
  loadHeroes();
});

// 选择英雄方法
const selectHero = (heroId: string) => {
  const hero = availableHeroes.value.find(h => h.id === heroId);
  if (hero) {
    selectedHero.value = hero;
    gameState.value = 'in_game';
    console.log('选择了英雄:', hero.name);
  }
};

// 返回英雄选择
const returnToHeroSelection = () => {
  gameState.value = 'hero_selection';
  selectedHero.value = null;
  // 重新随机选择3个英雄
  loadHeroes();
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

/* 选择英雄界面样式 */
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

.health {
  background-color: #27ae60;
  padding: 10px 20px;
  border-radius: 20px;
  color: #ecf0f1;
  font-weight: bold;
  font-size: 16px;
}

/* 回合操作样式 */
.turn-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-selection h1 {
    font-size: 28px;
  }
  
  .hero-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-card {
    width: 90%;
    max-width: 300px;
  }
  
  .main-game h1 {
    font-size: 28px;
  }
  
  .stats {
    flex-direction: column;
    align-items: center;
  }
  
  .health {
    width: 80%;
    max-width: 200px;
  }
}
</style>