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
      :enemy-minions="enemyMinions"
      :player-minions="playerMinions"
      :enemy-health="enemyHealth"
      :enemy-armor="enemyArmor"
      :player-health="playerHealth"
      :player-armor="playerArmor"
      :auto-start="false"
      :player-tavern-level="3"
      :enemy-tavern-level="2"
      @exit-battle="handleExitBattle"
      @battle-completed="handleBattleCompleted"
    ></BattleScene>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BattleScene from './BattleScene.vue';
import {
  getMinionClassByStrId,
  getAllMinionStrIds,
} from '../../../game/cards/minion/MinionClassMap';
import { Minion } from '../../../game/Minion';
import type { BattleResult } from '../../../game/BattleManager';

// 战斗数据

const enemyMinions = ref<(Minion | undefined)[]>([]);
const playerMinions = ref<(Minion | undefined)[]>([]);
const enemyHealth = ref(30);
const enemyArmor = ref(5);
const playerHealth = ref(30);
const playerArmor = ref(0);

// 战斗结果
const battleResult = ref<BattleResult | null>(null);
const battleLog = ref<string[]>([]);
const isBattleRunning = ref(false);
// 战斗场景引用
const battleSceneRef = ref<InstanceType<typeof BattleScene> | null>(null);

// 初始化战斗数据

const initBattleData = () => {
  // 获取所有可用的随从strId
  const allStrIds = getAllMinionStrIds();
  console.log('所有可用的随从strId:', allStrIds);

  // 初始化敌方随从

  enemyMinions.value = [
    // 使用getMinionClassByStrId获取随从类，避免循环导入
    (() => {
      const RisenRiderClass = getMinionClassByStrId('BG25_001'); // RisenRider的strId
      if (RisenRiderClass) {
        const minion = new RisenRiderClass();
        // 强制转换为Minion类型
        const minionAsMinion = minion as unknown as Minion;
        minionAsMinion.position = 0;
        return minionAsMinion;
      }
      return undefined;
    })() as Minion | undefined,

    (() => {
      const SouthseaBuskerClass = getMinionClassByStrId('BG26_135'); // SouthseaBusker的strId
      if (SouthseaBuskerClass) {
        const minion = new SouthseaBuskerClass();
        // 强制转换为Minion类型
        const minionAsMinion = minion as unknown as Minion;
        minionAsMinion.position = 1;
        return minionAsMinion;
      }
      return undefined;
    })() as Minion | undefined,

    (() => {
      const DuneDwellerClass = getMinionClassByStrId('BG31_815'); // DuneDweller的strId
      if (DuneDwellerClass) {
        const minion = new DuneDwellerClass();
        // 强制转换为Minion类型
        const minionAsMinion = minion as unknown as Minion;
        minionAsMinion.position = 2;
        return minionAsMinion;
      }
      return undefined;
    })() as Minion | undefined,

    undefined,

    undefined,

    undefined,

    undefined,
  ] as (Minion | undefined)[];

  // 初始化玩家随从

  playerMinions.value = [
    (() => {
      const ManasaberClass = getMinionClassByStrId('BG26_800'); // Manasaber的strId
      if (ManasaberClass) {
        const minion = new ManasaberClass();
        // 强制转换为Minion类型
        const minionAsMinion = minion as unknown as Minion;
        minionAsMinion.position = 0;
        return minionAsMinion;
      }
      return undefined;
    })() as Minion | undefined,

    (() => {
      const LullabotClass = getMinionClassByStrId('BG26_146'); // Lullabot的strId
      if (LullabotClass) {
        const minion = new LullabotClass();
        // 强制转换为Minion类型
        const minionAsMinion = minion as unknown as Minion;
        minionAsMinion.position = 1;
        return minionAsMinion;
      }
      return undefined;
    })() as Minion | undefined,

    (() => {
      const AlleycatClass = getMinionClassByStrId('BG_CFM_315'); // Alleycat的strId
      if (AlleycatClass) {
        const minion = new AlleycatClass();
        // 强制转换为Minion类型
        const minionAsMinion = minion as unknown as Minion;
        minionAsMinion.position = 2;
        return minionAsMinion;
      }
      return undefined;
    })() as Minion | undefined,

    (() => {
      const RisenRiderClass = getMinionClassByStrId('BG25_001'); // RisenRider的strId
      if (RisenRiderClass) {
        const minion = new RisenRiderClass();
        // 强制转换为Minion类型
        const minionAsMinion = minion as unknown as Minion;
        minionAsMinion.position = 3;
        return minionAsMinion;
      }
      return undefined;
    })() as Minion | undefined,

    undefined,

    undefined,

    undefined,
  ] as (Minion | undefined)[];
};

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

  // 更新生命值
  if (result.winner === 'enemy') {
    // 敌方获胜，玩家受到伤害
    const damageToPlayer = Math.abs(result.playerHealthChange);
    if (playerArmor.value >= damageToPlayer) {
      playerArmor.value -= damageToPlayer;
    } else {
      const remainingDamage = damageToPlayer - playerArmor.value;
      playerArmor.value = 0;
      playerHealth.value -= remainingDamage;
    }
  } else if (result.winner === 'player') {
    // 玩家获胜，敌方受到伤害
    const damageToEnemy = Math.abs(result.enemyHealthChange);
    if (enemyArmor.value >= damageToEnemy) {
      enemyArmor.value -= damageToEnemy;
    } else {
      const remainingDamage = damageToEnemy - enemyArmor.value;
      enemyArmor.value = 0;
      enemyHealth.value -= remainingDamage;
    }
  }
};

// 重置战斗

const resetBattle = () => {
  console.log('重置战斗');

  initBattleData();

  enemyHealth.value = 30;
  enemyArmor.value = 5;
  playerHealth.value = 30;
  playerArmor.value = 0;

  // 重置战斗结果和日志
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
