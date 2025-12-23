<template>
  <div class="battle-scene">
    <!-- 遮罩层 -->
    <div v-if="showResultModal || showBattleLog" class="overlay" @click="showBattleLog = false"></div>

    <!-- 战斗场景内容 -->
    <div class="battle-area">
      <!-- 敌方英雄 -->
      <div class="hero-area">
        <div class="enemy-hero">
          <div class="hero-avatar">敌方英雄</div>
          <div class="hero-info">
            <div class="hero-health">
              <span>❤️</span>
              <span>{{ props.enemyHealth }}</span>
            </div>
            <div class="hero-attack">
              <span>⚔️</span>
              <span>{{ props.enemyAttack || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- 英雄等级 -->
        <div class="tavern-levels">
          <div class="tavern-level enemy">敌方酒馆: {{ props.enemyTavernLevel }}</div>
          <div class="tavern-level player">玩家酒馆: {{ props.playerTavernLevel }}</div>
        </div>

        <div class="player-hero">
          <div class="hero-avatar">玩家英雄</div>
          <div class="hero-info">
            <div class="hero-health">
              <span>❤️</span>
              <span>{{ props.playerHealth }}</span>
            </div>
            <div class="hero-attack">
              <span>⚔️</span>
              <span>{{ props.playerAttack || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 随从区域 -->
      <div class="minion-area">
        <!-- 敌方随从 -->
        <div class="enemy-minions">
          <BattleCard
            v-for="(minion, index) in props.enemyMinions"
            :key="index"
            :data="minion || null"
            :is-enemy="true"
            :is-attacking="animatingAttacker?.side === 'enemy' && animatingAttacker?.index === index"
            :is-damaged="animatingDamaged?.side === 'enemy' && animatingDamaged?.index === index"
            :is-dying="animatingDying?.side === 'enemy' && animatingDying?.index === index"
            :is-divine-shield-broken="animatingDivineShieldBroken?.side === 'enemy' && animatingDivineShieldBroken?.index === index"
            :damage="damageValues['enemy'][index]"
          />
        </div>

        <!-- 玩家随从 -->
        <div class="player-minions">
          <BattleCard
            v-for="(minion, index) in props.playerMinions"
            :key="index"
            :data="minion || null"
            :is-enemy="false"
            :is-attacking="animatingAttacker?.side === 'player' && animatingAttacker?.index === index"
            :is-damaged="animatingDamaged?.side === 'player' && animatingDamaged?.index === index"
            :is-dying="animatingDying?.side === 'player' && animatingDying?.index === index"
            :is-divine-shield-broken="animatingDivineShieldBroken?.side === 'player' && animatingDivineShieldBroken?.index === index"
            :damage="damageValues['player'][index]"
          />
        </div>
      </div>

      <!-- 战斗控制按钮 -->
      <div class="battle-controls">
        <button
          class="btn btn-primary"
          @click="executeBattle"
          :disabled="isBattleRunning"
        >
          {{ isBattleRunning ? '战斗进行中...' : '开始战斗' }}
        </button>
        <button class="btn btn-secondary" @click="emit('exit-battle')">退出战斗</button>
        <button class="btn btn-secondary" @click="showBattleLog = true">查看战斗日志</button>
      </div>
    </div>

    <!-- 战斗结果弹窗 -->
    <div v-if="showResultModal" class="result-modal">
      <div class="battle-result">
        <h2 class="result-title" :class="{
          'winner-player': internalBattleResult?.winner === 'player',
          'winner-enemy': internalBattleResult?.winner === 'enemy',
          'winner-draw': internalBattleResult?.winner === 'draw',
        }">
          {{ internalBattleResult?.winner === 'player' ? '玩家获胜！' : 
             internalBattleResult?.winner === 'enemy' ? '敌方获胜！' : '平局！' }}
        </h2>
        <div class="result-stats" v-if="internalBattleResult">
          <div class="result-stat">
            <span>玩家剩余随从:</span>
            <span>{{ internalBattleResult.playerMinionsLeft }}</span>
          </div>
          <div class="result-stat">
            <span>敌方剩余随从:</span>
            <span>{{ internalBattleResult.enemyMinionsLeft }}</span>
          </div>
          <div class="result-stat">
            <span>玩家生命值变化:</span>
            <span>{{ internalBattleResult.playerHealthChange }}</span>
          </div>
          <div class="result-stat">
            <span>敌方生命值变化:</span>
            <span>{{ internalBattleResult.enemyHealthChange }}</span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" @click="showResultModal = false">确定</button>
          <button class="btn btn-secondary" @click="showBattleLog = true">查看战斗日志</button>
        </div>
      </div>
    </div>

    <!-- 战斗日志弹窗 -->
    <div v-if="showBattleLog" class="battle-log-modal">
      <div class="battle-log-header">
        <h2 class="battle-log-title">战斗日志</h2>
        <button class="close-btn" @click="showBattleLog = false">×</button>
      </div>
      <div class="log-content">
        <div v-for="(log, index) in internalBattleLog" :key="index" class="log-line">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BattleCard from './BattleCard.vue';
import { Minion } from '../../../game/Minion';
import type { BattleResult } from '../../../game/BattleManager';

// 组件属性
const props = defineProps<{
  enemyMinions: (Minion | undefined)[];
  playerMinions: (Minion | undefined)[];
  enemyHealth: number;
  enemyArmor: number;
  playerHealth: number;
  playerArmor: number;
  autoStart?: boolean;
  playerTavernLevel: number;
  enemyTavernLevel: number;
  enemyAttack?: number;
  playerAttack?: number;
}>();

// 组件事件
const emit = defineEmits<{
  'exit-battle': [];
  'battle-completed': [result: BattleResult, log: string[]];
}>();

// 战斗状态
const isBattleRunning = ref(false);
const showResultModal = ref(false);
const showBattleLog = ref(false);
const internalBattleLog = ref<string[]>([]);
const internalBattleResult = ref<BattleResult | null>(null);

// 动画状态
const animatingAttacker = ref<{ side: 'player' | 'enemy'; index: number } | null>(null);
const animatingDamaged = ref<{ side: 'player' | 'enemy'; index: number } | null>(null);
const animatingDying = ref<{ side: 'player' | 'enemy'; index: number } | null>(null);
const animatingDivineShieldBroken = ref<{ side: 'player' | 'enemy'; index: number } | null>(null);
const damageValues = ref<{ player: Record<number, number>; enemy: Record<number, number> }>({
  player: {},
  enemy: {},
});

// 重置卡片动画状态
const resetCardAnimations = () => {
  animatingAttacker.value = null;
  animatingDamaged.value = null;
  animatingDying.value = null;
  animatingDivineShieldBroken.value = null;
  damageValues.value = { player: {}, enemy: {} };
};

// 执行攻击动画
const executeAttackAnimation = async (side: 'player' | 'enemy', index: number) => {
  animatingAttacker.value = { side, index };
  await new Promise(resolve => setTimeout(resolve, 300)); // 攻击动画时长
  animatingAttacker.value = null;
};

// 执行伤害动画
const executeDamageAnimation = async (side: 'player' | 'enemy', index: number, damage: number) => {
  animatingDamaged.value = { side, index };
  damageValues.value[side][index] = damage;
  await new Promise(resolve => setTimeout(resolve, 300)); // 伤害动画时长
  animatingDamaged.value = null;
  delete damageValues.value[side][index];
};

// 执行死亡动画
const executeDeathAnimation = async (side: 'player' | 'enemy', index: number) => {
  animatingDying.value = { side, index };
  await new Promise(resolve => setTimeout(resolve, 500)); // 死亡动画时长
  animatingDying.value = null;
};

// 执行圣盾被打破动画
const executeDivineShieldBrokenAnimation = async (side: 'player' | 'enemy', index: number) => {
  animatingDivineShieldBroken.value = { side, index };
  await new Promise(resolve => setTimeout(resolve, 300)); // 圣盾被打破动画时长
  animatingDivineShieldBroken.value = null;
};

// 辅助函数：重置所有随从的攻击状态
const resetAttackStates = (playerMinions: (Minion | undefined)[], enemyMinions: (Minion | undefined)[]) => {
  playerMinions.forEach(minion => {
    if (minion) minion.hasAttacked = false;
  });
  enemyMinions.forEach(minion => {
    if (minion) minion.hasAttacked = false;
  });
};

// 辅助函数：计算随从数量
const countMinions = (minions: (Minion | undefined)[]) => {
  return minions.filter(m => m !== undefined).length;
};

// 辅助函数：检查战斗是否结束
const isBattleOver = (playerMinions: (Minion | undefined)[], enemyMinions: (Minion | undefined)[]) => {
  const playerCount = countMinions(playerMinions);
  const enemyCount = countMinions(enemyMinions);
  return playerCount === 0 || enemyCount === 0;
};

// 辅助函数：查找攻击目标（优先嘲讽）
const findAttackTarget = (defenders: (Minion | undefined)[]): number => {
  // 优先攻击有嘲讽的随从
  for (let i = 0; i < defenders.length; i++) {
    const minion = defenders[i];
    if (minion && minion.health > 0 && minion.getKeywords().includes('taunt')) {
      return i;
    }
  }

  // 如果没有嘲讽随从，随机选择一个目标
  const validTargets = defenders
    .map((minion, index) => ({ minion, index }))
    .filter(({ minion }) => minion !== undefined && minion.health > 0);

  if (validTargets.length === 0) {
    return -1;
  }

  const randomIndex = Math.floor(Math.random() * validTargets.length);
  return validTargets[randomIndex]?.index || -1;
};

// 辅助函数：移除死亡随从并顶格处理
const removeMinionAndShift = (minions: (Minion | undefined)[], index: number) => {
  minions.splice(index, 1);
  minions.push(undefined);
};

// 辅助函数：处理伤害、圣盾和死亡逻辑
const handleDamage = async (minion: Minion, minions: (Minion | undefined)[], side: 'player' | 'enemy', index: number, damage: number) => {
  const hadDivineShield = minion.hasDivineShield || false;
  let died = false;

  // 处理伤害
  if (hadDivineShield) {
    // 圣盾吸收所有伤害
    minion.hasDivineShield = false;
    console.log(`${side === 'player' ? '玩家' : '敌方'}${minion.nameCN}的圣盾吸收了 ${damage} 点伤害`);
    
    // 执行圣盾被打破动画
    await executeDivineShieldBrokenAnimation(side, index);
    internalBattleLog.value.push(`${minion.nameCN} 的圣盾被打破了！`);
  } else {
    // 直接扣除生命值
    minion.health = Math.max(0, (minion.health || 0) - damage);
    died = (minion.health || 0) <= 0;
    console.log(`${side === 'player' ? '玩家' : '敌方'}${minion.nameCN}受到了 ${damage} 点伤害，剩余生命值: ${minion.health}`);
    
    // 执行伤害动画
    await executeDamageAnimation(side, index, damage);
    internalBattleLog.value.push(
      `${minion.nameCN} 受到了 ${damage} 点伤害，剩余生命值: ${minion.health}`
    );

    if (died) {
      // 执行死亡动画
      await executeDeathAnimation(side, index);
      // 移除死亡随从并顶格处理
      removeMinionAndShift(minions, index);
      internalBattleLog.value.push(`${minion.nameCN} 被杀死了！`);
    }
  }

  return died;
};

// 辅助函数：生成攻击顺序
const generateAttackOrder = (playerMinions: (Minion | undefined)[], enemyMinions: (Minion | undefined)[]) => {
  const attackOrder = [];

  // 添加玩家随从到攻击顺序
  for (let i = 0; i < playerMinions.length; i++) {
    if (playerMinions[i] !== undefined) {
      attackOrder.push({ side: 'player' as const, index: i });
    }
  }

  // 添加敌方随从到攻击顺序
  for (let i = 0; i < enemyMinions.length; i++) {
    if (enemyMinions[i] !== undefined) {
      attackOrder.push({ side: 'enemy' as const, index: i });
    }
  }

  return attackOrder;
};

// 执行战斗
const executeBattle = async () => {
  console.log('开始执行战斗');
  isBattleRunning.value = true;
  internalBattleLog.value = ['开始战斗...'];
  internalBattleResult.value = null;

  // 重置卡片动画状态
  resetCardAnimations();

  // 暂时不复制随从列表，直接使用原数据（用于调试）
  const playerMinions = props.playerMinions;
  const enemyMinions = props.enemyMinions;

  // 记录当前状态
  internalBattleLog.value.push(`玩家随从数量: ${countMinions(playerMinions)}`);
  internalBattleLog.value.push(`敌方随从数量: ${countMinions(enemyMinions)}`);

  // 战斗主循环
  let battleRound = 0;
  const maxRounds = 100;
  let battleEnded = false;

  while (!battleEnded && battleRound < maxRounds) {
    battleRound++;
    console.log(`\n===== 战斗回合 ${battleRound} =====`);
    internalBattleLog.value.push(`回合 ${battleRound} 开始`);

    // 重置所有随从的攻击状态
    resetAttackStates(playerMinions, enemyMinions);

    // 检查战斗是否结束
    if (isBattleOver(playerMinions, enemyMinions)) {
      battleEnded = true;
      break;
    }

    // 生成攻击顺序
    const attackOrder = generateAttackOrder(playerMinions, enemyMinions);

    // 执行攻击
    for (const attackUnit of attackOrder) {
      // 检查战斗是否已经结束
      if (battleEnded) break;

      // 检查随从是否还活着
      if (attackUnit.side === 'player') {
        const attacker = playerMinions[attackUnit.index];
        if (!attacker || attacker.health <= 0 || attacker.hasAttacked) {
          continue;
        }

        // 找到攻击目标
        const targetIndex = findAttackTarget(enemyMinions);
        if (targetIndex === -1) {
          continue;
        }

        const target = enemyMinions[targetIndex];
        if (!target || target.health <= 0) {
          continue;
        }

        // 执行攻击动画
        await executeAttackAnimation('player', attackUnit.index);

        // 记录攻击信息
        internalBattleLog.value.push(`${attacker.nameCN} 攻击了 ${target.nameCN}`);

        // 获取攻击力
        const attackerDamage = attacker.getAttack();
        const targetDamage = target.getAttack();

        // 处理攻击者受到的伤害
        await handleDamage(attacker, playerMinions, 'player', attackUnit.index, targetDamage);

        // 检查目标是否还活着（可能在处理攻击者伤害时已经死亡）
        const currentTarget = enemyMinions[targetIndex];
        if (currentTarget && currentTarget.health > 0) {
          // 处理目标受到的伤害
          await handleDamage(currentTarget, enemyMinions, 'enemy', targetIndex, attackerDamage);
        }

        // 标记为已攻击
        attacker.hasAttacked = true;
      } else {
        // 敌方随从攻击逻辑
        const attacker = enemyMinions[attackUnit.index];
        if (!attacker || attacker.health <= 0 || attacker.hasAttacked) {
          continue;
        }

        // 找到攻击目标
        const targetIndex = findAttackTarget(playerMinions);
        if (targetIndex === -1) {
          continue;
        }

        const target = playerMinions[targetIndex];
        if (!target || target.health <= 0) {
          continue;
        }

        // 执行攻击动画
        await executeAttackAnimation('enemy', attackUnit.index);

        // 记录攻击信息
        internalBattleLog.value.push(`${attacker.nameCN} 攻击了 ${target.nameCN}`);

        // 获取攻击力
        const attackerDamage = attacker.getAttack();
        const targetDamage = target.getAttack();

        // 处理攻击者受到的伤害
        await handleDamage(attacker, enemyMinions, 'enemy', attackUnit.index, targetDamage);

        // 检查目标是否还活着
        const currentTarget = playerMinions[targetIndex];
        if (currentTarget && currentTarget.health > 0) {
          // 处理目标受到的伤害
          await handleDamage(currentTarget, playerMinions, 'player', targetIndex, attackerDamage);
        }

        // 标记为已攻击
        attacker.hasAttacked = true;
      }

      // 检查战斗是否结束
      if (isBattleOver(playerMinions, enemyMinions)) {
        battleEnded = true;
        break;
      }
    }
  }

  // 计算战斗结果
  const playerMinionCount = countMinions(playerMinions);
  const enemyMinionCount = countMinions(enemyMinions);

  let result: BattleResult;

  if (playerMinionCount > 0 && enemyMinionCount === 0) {
    // 玩家获胜
    result = {
      winner: 'player',
      playerHealthChange: 0,
      enemyHealthChange: -playerMinionCount,
      playerMinionsLeft: playerMinionCount,
      enemyMinionsLeft: enemyMinionCount,
    };
  } else if (enemyMinionCount > 0 && playerMinionCount === 0) {
    // 敌方获胜
    result = {
      winner: 'enemy',
      playerHealthChange: -enemyMinionCount,
      enemyHealthChange: 0,
      playerMinionsLeft: playerMinionCount,
      enemyMinionsLeft: enemyMinionCount,
    };
  } else {
    // 平局
    result = {
      winner: 'draw',
      playerHealthChange: 0,
      enemyHealthChange: 0,
      playerMinionsLeft: playerMinionCount,
      enemyMinionsLeft: enemyMinionCount,
    };
  }

  // 记录战斗结果
  internalBattleResult.value = result;
  internalBattleLog.value.push(`战斗结束！`);
  internalBattleLog.value.push(
    `胜利者: ${result.winner === 'player' ? '玩家' : result.winner === 'enemy' ? '敌方' : '平局'}`
  );
  internalBattleLog.value.push(`玩家剩余随从: ${result.playerMinionsLeft}`);
  internalBattleLog.value.push(`敌方剩余随从: ${result.enemyMinionsLeft}`);
  internalBattleLog.value.push(`玩家生命值变化: ${result.playerHealthChange}`);
  internalBattleLog.value.push(`敌方生命值变化: ${result.enemyHealthChange}`);

  // 显示战斗结果弹窗
  showResultModal.value = true;

  // 通知父组件战斗完成
  emit('battle-completed', result, internalBattleLog.value);

  isBattleRunning.value = false;
  console.log('战斗结束', result);
};

// 组件挂载时，如果autoStart为true，则自动执行战斗
onMounted(() => {
  if (props.autoStart) {
    executeBattle();
  }
});

// 暴露方法给父组件
defineExpose({
  executeBattle,
});
</script>

<style scoped>
.battle-scene {
  width: 100vw;
  height: 100vh;
  background-color: #1a1a2e;
  color: white;
  overflow: auto;
}

/* 中部对战区域 */
.battle-area {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding: 20px;
  position: relative;
}

/* 英雄区域 */
.hero-area {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 敌方英雄 */
.enemy-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 玩家英雄 */
.player-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 英雄头像 */
.hero-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #333;
  margin-bottom: 10px;
}

/* 英雄信息 */
.hero-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hero-health {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ff4d4d;
}

.hero-attack {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ffaa00;
}

/* 酒馆等级 */
.tavern-levels {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.tavern-level {
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
}

.tavern-level.enemy {
  background-color: rgba(255, 0, 0, 0.2);
}

.tavern-level.player {
  background-color: rgba(0, 128, 255, 0.2);
}

/* 随从区域 */
.minion-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* 敌方随从 */
.enemy-minions {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* 玩家随从 */
.player-minions {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* 战斗控制按钮 */
.battle-controls {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

/* 战斗日志弹窗 */
.battle-log-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  background-color: #2a2a4e;
  border: 2px solid #4a4a6e;
  border-radius: 10px;
  padding: 20px;
  z-index: 1000;
  overflow-y: auto;
}

.battle-log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #4a4a6e;
}

.battle-log-title {
  font-size: 24px;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.log-content {
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
}

.log-line {
  margin-bottom: 5px;
}

/* 战斗结果弹窗 */
.result-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 400px;
  background-color: #2a2a4e;
  border: 2px solid #4a4a6e;
  border-radius: 10px;
  padding: 30px;
  z-index: 1000;
  text-align: center;
}

.result-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

.winner-player {
  color: #4caf50;
}

.winner-enemy {
  color: #f44336;
}

.winner-draw {
  color: #ffeb3b;
}

.result-stats {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-stat {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #3a3a5e;
  border-radius: 5px;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-secondary {
  background-color: #3a3a5e;
  color: white;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* 卡片位置调整 */
.battle-card {
  width: 120px;
  height: 160px;
  position: relative;
  perspective: 1000px;
  flex-shrink: 0;
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
</style>