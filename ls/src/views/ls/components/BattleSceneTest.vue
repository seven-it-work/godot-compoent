<template>
  <div class="battle-scene-test">
    <h1>战斗场景测试</h1>
    <div class="test-controls">
      <button @click="startBattle" :disabled="isBattleRunning">开始战斗</button>
      <button @click="resetBattle" :disabled="isBattleRunning">重置战斗</button>
      <span v-if="isBattleRunning" class="battle-status">战斗进行中...</span>
    </div>

    <BattleScene
      ref="battleSceneRef"
      :player-data="playerData"
      :enemy-data="enemyData"
      :auto-start="false"
      @exit-battle="handleExitBattle"
      @battle-completed="handleBattleCompleted"
    ></BattleScene>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { BattleResult } from '../../../game/BattleManager';
import {
  getAllMinionStrIds,
  getMinionClassByStrId,
} from '../../../game/cards/minion/MinionClassMap';
import { Hero } from '../../../game/Hero';
import { Minion } from '../../../game/Minion';
import { Player } from '../../../game/Player';
import BattleScene from './BattleScene.vue';

// 战斗玩家数据
const playerData = ref<Player>(createTestPlayer(true));
const enemyData = ref<Player>(createTestPlayer(false));

// 创建测试玩家
function createTestPlayer(isPlayer: boolean): Player {
  const hero = new Hero(
    isPlayer ? 'test-hero-player' : 'test-hero-enemy',
    isPlayer ? '测试玩家英雄' : '测试敌人英雄',
    30,
    {
      name: '测试技能',
      description: '测试技能描述',
      type: 'active',
      cost: 0,
      cooldown: 0,
      currentCooldown: 0,
      use: () => {},
    }
  );

  const player = new Player(isPlayer ? 'player' : 'enemy', hero, isPlayer);

  // 设置酒馆等级
  player.tavernLevel = isPlayer ? 3 : 2;

  // 设置护甲
  if (!isPlayer) {
    player.hero.armor = 5;
  }

  return player;
}

// 战斗结果
const battleResult = ref<BattleResult | null>(null);
const battleLog = ref<string[]>([]);
const isBattleRunning = ref(false);
// 战斗场景引用
const battleSceneRef = ref<InstanceType<typeof BattleScene> | null>(null);

// 初始化战斗数据
const initBattleData = () => {
  // 获取所有可用的随从 strId
  const allStrIds = getAllMinionStrIds();
  console.log('所有可用的随从 strId:', allStrIds);

  // 重置玩家数据
  playerData.value = createTestPlayer(true);
  enemyData.value = createTestPlayer(false);

  // 初始化敌方随从
  const enemyMinions: (Minion | null)[] = [
    createMinionByStrId('BG25_001', 0), // RisenRider
    createMinionByStrId('BG26_135', 1), // SouthseaBusker
    createMinionByStrId('BG31_815', 2), // DuneDweller
    null,
    null,
    null,
    null,
  ];
  enemyData.value.minions = enemyMinions;

  // 初始化玩家随从
  const playerMinions: (Minion | null)[] = [
    createMinionByStrId('BG26_800', 0), // Manasaber
    createMinionByStrId('BG26_146', 1), // Lullabot
    createMinionByStrId('BG_CFM_315', 2), // Alleycat
    createMinionByStrId('BG25_001', 3), // RisenRider
    null,
    null,
    null,
  ];
  playerData.value.minions = playerMinions;
};

// 创建随从的辅助函数
function createMinionByStrId(strId: string, position: number): Minion | null {
  const MinionClass = getMinionClassByStrId(strId);
  if (MinionClass) {
    const minion = new MinionClass();
    const minionAsMinion = minion as unknown as Minion;
    minionAsMinion.position = position;
    return minionAsMinion;
  }
  return null;
}

// 开始战斗
const startBattle = async () => {
  console.log('开始战斗');
  isBattleRunning.value = true;
  battleLog.value = [];
  battleResult.value = null;

  // 调用战斗场景的执行战斗方法
  if (battleSceneRef.value) {
    battleSceneRef.value.executeBattle();
  }
};

// 处理战斗完成事件
const handleBattleCompleted = (result: BattleResult, log: string[]) => {
  console.log('战斗完成', result);
  battleResult.value = result;
  battleLog.value = log;
  isBattleRunning.value = false;

  // 注意：生命值和护甲已经在 Player 对象中更新，无需额外处理
};

// 重置战斗
const resetBattle = () => {
  console.log('重置战斗');
  initBattleData();
  battleResult.value = null;
  battleLog.value = [];
  isBattleRunning.value = false;
};

// 处理退出战斗
const handleExitBattle = () => {
  console.log('退出战斗');
  // 这里可以添加退出战斗的逻辑，比如返回主游戏界面
  resetBattle();
};

// 组件挂载时初始化数据

onMounted(() => {
  initBattleData();
});
</script>

<style scoped>
.battle-scene-test {
  width: 100vw;
  height: 100vh;
  background-color: #1a1a2e;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #f1c40f;
  text-align: center;
}

.test-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
}

.battle-status {
  color: #e74c3c;
  font-weight: bold;
  margin-left: 10px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
