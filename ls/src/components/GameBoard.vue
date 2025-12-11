<template>
  <div>
    <!-- 选择英雄界面 -->
    <a-row v-if="gameState === 'hero_selection'">
      <a-col :span="8" v-for="hero in availableHeroes" :key="hero.id" @click="selectHero(hero.id)">
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
              <h3>{{ hero.heroPower.name }}</h3>
              <p>{{ hero.heroPower.description }}</p>
              <div v-if="hero.heroPower.cost > 0">
                消耗: {{ hero.heroPower.cost }} 金币
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 游戏主界面 -->
    <div v-else-if="gameState === 'in_game'">
      <h1>游戏主界面</h1>

      <!-- 游戏信息栏 -->
      <div>
        <div>
          <h2>你的英雄: {{ selectedHero?.name }}</h2>
          <div>
            <div>生命值: {{ selectedHero?.health }}</div>
          </div>
        </div>
      </div>

      <!-- 回合操作 -->
      <div>
        <button @click="returnToHeroSelection">返回英雄选择</button>
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
