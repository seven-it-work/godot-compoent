<template>
  <div class="battle-scene">
    <div class="battle-main">
      <!-- 敌方区域：左侧 -->
      <div class="battle-side enemy-side">
        <!-- 7个随从位置，从上到下排列 -->
        <div class="battle-card-row" v-for="i in 7" :key="`enemy-${i}`">
          <BattleCard
            :card-id="`enemy-slot-${i}`"
            :data="enemyMinions[i - 1]"
            :is-enemy="true"
          ></BattleCard>
        </div>
      </div>

      <!-- 玩家区域：右侧 -->
      <div class="battle-side player-side">
        <!-- 7个随从位置，从上到下排列 -->

        <div class="battle-card-row" v-for="i in 7" :key="`player-${i}`">
          <BattleCard
            :card-id="`player-slot-${i}`"
            :data="playerMinions[i - 1]"
            :is-enemy="false"
          ></BattleCard>
        </div>
      </div>
    </div>

    <!-- 底部：战斗信息 -->

    <div class="battle-info">
      <div class="battle-controls">
        <div>
          敌人队伍
          <div>生命值：10</div>
          <div>护甲值：10</div>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div>
          玩家队伍
          <div>生命值：10</div>
          <div>护甲值：10</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BattleCard from './BattleCard.vue';

// 定义事件

const emit = defineEmits<{
  // 退出战斗事件

  (e: 'exit-battle'): void;
}>();

// 敌方英雄信息
// const _enemyHeroHealth = ref(30);
// const _enemyHeroArmor = ref(0);

// 玩家英雄信息
// const _playerHeroHealth = ref(30);
// const _playerHeroArmor = ref(0);

// 敌方随从列表（7个位置，初始为空）

const enemyMinions = ref(Array(7).fill(null));

// 玩家随从列表（7个位置，初始为空）

const playerMinions = ref(Array(7).fill(null));

// 战斗控制方法

const startBattle = () => {
  console.log('开始战斗');
};

const skipBattle = () => {
  console.log('跳过战斗');
};

const exitBattle = () => {
  console.log('退出战斗');

  emit('exit-battle');
};
</script>

<style scoped>
.battle-scene {
  width: 100vw;

  height: 100vh;

  background-color: #1a1a2e;

  color: white;

  overflow: auto;
}

/* 顶部战斗标题和英雄信息 */

.battle-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 0 5%;

  background: linear-gradient(180deg, #16213e 0%, #0f3460 100%);

  border-bottom: 3px solid #16a085;
}

.hero-info {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 5px;

  padding: 10px;

  border-radius: 8px;

  min-width: 150px;
}

.enemy-hero {
  background-color: rgba(231, 76, 60, 0.2);

  border: 2px solid #e74c3c;
}

.player-hero {
  background-color: rgba(52, 152, 219, 0.2);

  border: 2px solid #3498db;
}

.hero-name {
  font-size: 18px;

  font-weight: bold;
}

.hero-stats {
  display: flex;

  gap: 10px;

  font-size: 14px;
}

.health {
  color: #e74c3c;
}

.armor {
  color: #3498db;
}

.battle-title {
  font-size: 24px;

  font-weight: bold;

  color: #f1c40f;

  text-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
}

/* 中部对战区域 */

.battle-main {
  flex: 1;

  display: flex;

  justify-content: space-around;

  align-items: center;

  padding: 2% 0;

  background: radial-gradient(circle at center, #1a1a2e 0%, #0f0f1e 100%);
}

.battle-side {
  width: 45%;
  height: 90%;
  display: flex;

  flex-direction: column;

  gap: 1%;

  border-radius: 12px;

  padding: 2%;

  box-sizing: border-box;
}

.enemy-side {
  border: 4px solid #e74c3c;

  background: linear-gradient(180deg, #641e16 0%, #922b21 100%);
}

.player-side {
  border: 4px solid #3498db;

  background: linear-gradient(180deg, #154360 0%, #1f618d 100%);
}

.side-title {
  font-size: 18px;

  font-weight: bold;

  text-align: center;

  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
}

.battle-card-row {
  display: flex;

  justify-content: center;

  align-items: center;

  gap: 2%;
}

/* 底部战斗信息和控制按钮 */

.battle-info {
  background: linear-gradient(0deg, #16213e 0%, #0f3460 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.battle-status {
  font-size: 18px;

  color: #ecf0f1;
}

.battle-controls {
  display: flex;

  gap: 20px;
}

.control-btn {
  padding: 10px 20px;

  font-size: 16px;

  font-weight: bold;

  border: none;

  border-radius: 8px;

  cursor: pointer;

  transition: all 0.3s ease;

  min-width: 120px;
}

.control-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.start-btn {
  background: linear-gradient(145deg, #27ae60, #229954);

  color: white;
}

.start-btn:hover {
  background: linear-gradient(145deg, #229954, #1e8449);
}

.skip-btn {
  background: linear-gradient(145deg, #f39c12, #e67e22);

  color: white;
}

.skip-btn:hover {
  background: linear-gradient(145deg, #e67e22, #d35400);
}

.exit-btn {
  background: linear-gradient(145deg, #e74c3c, #c0392b);

  color: white;
}

.exit-btn:hover {
  background: linear-gradient(145deg, #c0392b, #a93226);
}
</style>
