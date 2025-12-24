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
            :is-attacking="cardAnimations.enemy[i - 1]?.isAttacking"
            :is-damaged="cardAnimations.enemy[i - 1]?.isDamaged"
            :damage="cardAnimations.enemy[i - 1]?.damage"
            :is-dying="cardAnimations.enemy[i - 1]?.isDying"
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
            :is-attacking="cardAnimations.player[i - 1]?.isAttacking"
            :is-damaged="cardAnimations.player[i - 1]?.isDamaged"
            :damage="cardAnimations.player[i - 1]?.damage"
            :is-dying="cardAnimations.player[i - 1]?.isDying"
          ></BattleCard>
        </div>
      </div>
    </div>

    <!-- 底部战斗信息 -->
    <div class="battle-info">
      <div class="battle-controls">
        <div>
          敌人队伍
          <div>生命值：{{ enemyHealth }}</div>
          <div>护甲值：{{ enemyArmor }}</div>
        </div>
        <div class="battle-action-area">
          <button @click="showLogModal = true">查看战斗日志</button>
        </div>
        <div>
          玩家队伍
          <div>生命值：{{ playerHealth }}</div>
          <div>护甲值：{{ playerArmor }}</div>
        </div>
      </div>
    </div>

    <!-- 战斗结果弹窗 -->
    <Modal v-model:open="showResultModal" title="战斗结果" :footer="null" width="600px">
      <div v-if="internalBattleResult" class="battle-result-content">
        <div class="result-winner">
          <h3>
            胜利者:
            <span
              :class="
                internalBattleResult.winner === 'player'
                  ? 'winner-player'
                  : internalBattleResult.winner === 'enemy'
                    ? 'winner-enemy'
                    : 'winner-draw'
              "
            >
              {{
                internalBattleResult.winner === 'player'
                  ? '玩家'
                  : internalBattleResult.winner === 'enemy'
                    ? '敌方'
                    : '平局'
              }}
            </span>
          </h3>
        </div>
        <div class="result-stats">
          <div class="stat-item">
            <strong>剩余随从:</strong>
            <span
              >玩家 {{ internalBattleResult.playerMinionsLeft }} / 敌方
              {{ internalBattleResult.enemyMinionsLeft }}</span
            >
          </div>
          <div class="stat-item">
            <strong>生命值变化:</strong>
            <span
              >玩家 {{ internalBattleResult.playerHealthChange }} / 敌方
              {{ internalBattleResult.enemyHealthChange }}</span
            >
          </div>
        </div>
        <div class="result-buttons">
          <Button type="primary" @click="showResultModal = false">关闭</Button>
        </div>
      </div>
    </Modal>

    <!-- 战斗日志弹窗 -->
    <Modal v-model:open="showLogModal" title="战斗日志" :footer="null" width="800px" height="600px">
      <div class="battle-log-content">
        <div v-if="internalBattleLog.length > 0" class="log-list">
          <div v-for="(log, index) in internalBattleLog" :key="index" class="log-item">
            {{ index + 1 }}. {{ log }}
          </div>
        </div>
        <div v-else class="no-log">暂无战斗日志</div>
        <div class="log-buttons">
          <Button type="primary" @click="showLogModal = false">关闭</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import type { Minion } from '@/game/Minion';
import { Button, Modal } from 'ant-design-vue';
import { onMounted, ref } from 'vue';
import type { BattleResult } from '../../../game/BattleManager';
import BattleCard from './BattleCard.vue';

// 接收外部传入的参数
const props = withDefaults(
  defineProps<{
    enemyMinions: (Minion | undefined)[];
    playerMinions: (Minion | undefined)[];
    enemyHealth: number;
    enemyArmor: number;
    playerHealth: number;
    playerArmor: number;
    autoStart?: boolean;
    playerTavernLevel?: number;
    enemyTavernLevel?: number;
  }>(),
  {
    enemyMinions: () => Array(7).fill(undefined),
    playerMinions: () => Array(7).fill(undefined),
    enemyHealth: 30,
    enemyArmor: 0,
    playerHealth: 30,
    playerArmor: 0,
    autoStart: false,
    playerTavernLevel: 1,
    enemyTavernLevel: 1,
  }
);

// 定义事件
const emit = defineEmits<{
  (e: 'exit-battle'): void;
  (e: 'battle-completed', result: BattleResult, log: string[]): void;
}>();

// 弹窗状态
const showResultModal = ref(false);
const showLogModal = ref(false);
// 战斗状态
const isBattleRunning = ref(false);
// 内部战斗结果和日志
const internalBattleResult = ref<BattleResult | null>(null);
const internalBattleLog = ref<string[]>([]);

// 卡片动画状态
const cardAnimations = ref({
  player: Array(7)
    .fill(undefined)
    .map(() => ({ isAttacking: false, isDamaged: false, damage: 0, isDying: false })),
  enemy: Array(7)
    .fill(undefined)
    .map(() => ({ isAttacking: false, isDamaged: false, damage: 0, isDying: false })),
});

// 重置卡片动画状态
const resetCardAnimations = () => {
  cardAnimations.value = {
    player: Array(7)
      .fill(undefined)
      .map(() => ({ isAttacking: false, isDamaged: false, damage: 0, isDying: false })),
    enemy: Array(7)
      .fill(undefined)
      .map(() => ({ isAttacking: false, isDamaged: false, damage: 0, isDying: false })),
  };
};

// 执行单个攻击动画
const executeAttackAnimation = async (
  side: 'player' | 'enemy',
  index: number,
  targetIndex: number
) => {
  console.log(`执行${side}方第${index}个随从的攻击动画，攻击目标：${targetIndex}`);

  // 获取攻击者和目标元素
  const attackerId = side === 'player' ? `player-slot-${index + 1}` : `enemy-slot-${index + 1}`;
  const targetSide = side === 'player' ? 'enemy' : 'player';
  const targetId =
    targetSide === 'player' ? `player-slot-${targetIndex + 1}` : `enemy-slot-${targetIndex + 1}`;

  const attackerElement = document.getElementById(attackerId);
  const targetElement = document.getElementById(targetId);

  if (!attackerElement || !targetElement) {
    console.error('攻击者或目标元素未找到');
    return;
  }

  // 计算位移距离
  const attackerRect = attackerElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  // 计算中心点
  const attackerCenterX = attackerRect.left + attackerRect.width / 2;
  const attackerCenterY = attackerRect.top + attackerRect.height / 2;
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  // 计算位移差值（相对于攻击者自身位置）
  const moveX = targetCenterX - attackerCenterX;
  const moveY = targetCenterY - attackerCenterY;

  // 设置攻击者动画状态
  if (side === 'player') {
    const temp = cardAnimations.value.player[index];
    if (temp) {
      temp.isAttacking = true;
    }
  } else {
    const temp = cardAnimations.value.enemy[index];
    if (temp) {
      temp.isAttacking = true;
    }
  }

  // 应用位移动画
  attackerElement.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
  attackerElement.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;

  // 等待攻击动画完成
  await new Promise(resolve => setTimeout(resolve, 400));

  // 返回原位置
  attackerElement.style.transform = 'translate(0, 0) scale(1)';
  await new Promise(resolve => setTimeout(resolve, 400));

  // 重置攻击者动画状态
  if (side === 'player') {
    const temp = cardAnimations.value.player[index];
    if (temp) {
      temp.isAttacking = false;
    }
  } else {
    const temp = cardAnimations.value.enemy[index];
    if (temp) {
      temp.isAttacking = false;
    }
  }

  // 重置样式
  attackerElement.style.transition = '';
};

// 执行单个伤害动画
const executeDamageAnimation = async (side: 'player' | 'enemy', index: number, damage: number) => {
  console.log(`执行${side}方第${index}个随从的伤害动画，伤害值: ${damage}`);

  // 设置受伤害动画状态
  const temp = cardAnimations.value[side][index];
  if (temp) {
    temp.isDamaged = true;
    temp.damage = damage;
  }

  // 等待伤害动画完成
  await new Promise(resolve => setTimeout(resolve, 500));

  // 重置伤害动画状态
  if (temp) {
    temp.isDamaged = false;
    temp.damage = 0;
  }
};

// 执行单个死亡动画
const executeDeathAnimation = async (side: 'player' | 'enemy', index: number) => {
  console.log(`执行${side}方第${index}个随从的死亡动画`);

  // 设置死亡动画状态
  const temp = cardAnimations.value[side][index];
  if (temp) {
    temp.isDying = true;
  }

  // 等待死亡动画完成
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 重置死亡动画状态
  if (temp) {
    temp.isDying = false;
  }
};

// 执行单个圣盾消失动画
const executeDivineShieldBrokenAnimation = async (side: 'player' | 'enemy', index: number) => {
  console.log(`执行${side}方第${index}个随从的圣盾消失动画`);

  // 等待圣盾消失动画完成
  await new Promise(resolve => setTimeout(resolve, 300));
};

// 查找攻击目标
const findAttackTarget = (targetMinions: (Minion | undefined)[]): number => {
  // 优先攻击有嘲讽的随从
  for (let i = 0; i < targetMinions.length; i++) {
    const minion = targetMinions[i];
    if (minion && minion.health > 0 && minion.getKeywords().includes('taunt')) {
      return i;
    }
  }

  // 如果没有嘲讽随从，随机选择一个目标
  const validTargets = targetMinions
    .map((minion, index) => ({ minion, index }))
    .filter(({ minion }) => minion !== undefined && minion.health > 0);

  if (validTargets.length === 0) {
    return -1;
  }

  const randomIndex = Math.floor(Math.random() * validTargets.length);
  const selectedTarget = validTargets[randomIndex];
  if (!selectedTarget) {
    return -1;
  }
  return selectedTarget.index;
};

// 处理伤害
const handleDamage = async (
  side: 'player' | 'enemy',
  index: number,
  minion: Minion,
  damage: number
): Promise<boolean> => {
  const minionHadDivineShield = minion.hasDivineShield || false;
  let minionDied = false;

  if (minionHadDivineShield) {
    // 圣盾吸收所有伤害
    minion.hasDivineShield = false;
    console.log(`${side}方随从的圣盾吸收了 ${damage} 点伤害`);
  } else {
    // 直接扣除生命值
    minion.health = Math.max(0, (minion.health || 0) - damage);
    minionDied = (minion.health || 0) <= 0;
    console.log(`${side}方随从受到了 ${damage} 点伤害，剩余生命值: ${minion.health}`);
  }

  if (minionHadDivineShield && !minion.hasDivineShield) {
    // 圣盾被打破，执行圣盾消失动画
    await executeDivineShieldBrokenAnimation(side, index);
    internalBattleLog.value.push(`${minion.nameCN} 的圣盾被打破了！`);
  } else if (!minionHadDivineShield) {
    // 执行伤害动画
    await executeDamageAnimation(side, index, damage);
    internalBattleLog.value.push(
      `${minion.nameCN} 受到了 ${damage} 点伤害，剩余生命值: ${minion.health}`
    );
  }

  return minionDied;
};

// 移除死亡随从
const removeDeadMinion = async (
  side: 'player' | 'enemy',
  index: number,
  minions: (Minion | undefined)[],
  minion: Minion
) => {
  // 执行死亡动画
  await executeDeathAnimation(side, index);
  // 移除死亡随从并顶格处理
  minions.splice(index, 1);
  minions.push(undefined);
  internalBattleLog.value.push(`${minion.nameCN} 被杀死了！`);
};

// 重置攻击状态
const resetAttackStates = (
  playerMinions: (Minion | undefined)[],
  enemyMinions: (Minion | undefined)[]
) => {
  playerMinions.forEach(minion => {
    if (minion) minion.hasAttacked = false;
  });
  enemyMinions.forEach(minion => {
    if (minion) minion.hasAttacked = false;
  });
};

/**
 * 检查战斗是否结束
 * 1、如果双方任意一方没有随从了，战斗结束（有随从的一方胜利，双方都没有随从平局）
 * 2、如果双方的随从所有攻击力总和 都是0，战斗结束（平局）
 * @param playerMinions 玩家方随从列表
 * @param enemyMinions 敌方方随从列表
 * @returns 如果战斗结束，返回true；否则返回false
 */
const checkBattleEnd = (
  playerMinions: (Minion | undefined)[],
  enemyMinions: (Minion | undefined)[]
): boolean => {
  // 条件1：如果双方任意一方没有随从，直接返回true
  const playerMinionCount = playerMinions.filter(m => m !== undefined).length;
  const enemyMinionCount = enemyMinions.filter(m => m !== undefined).length;
  if (playerMinionCount === 0 || enemyMinionCount === 0) {
    return true;
  }

  // 条件2：如果双方攻击力总和都为0，直接返回true
  const playerTotalAttack = playerMinions
    .filter(m => m !== undefined)
    .reduce((sum, minion) => sum + minion!.getAttack(), 0);

  const enemyTotalAttack = enemyMinions
    .filter(m => m !== undefined)
    .reduce((sum, minion) => sum + minion!.getAttack(), 0);

  if (playerTotalAttack === 0 && enemyTotalAttack === 0) {
    return true;
  }

  // 否则战斗继续
  return false;
};

/**
 * 判断先手方
 * 逻辑：随从多的为先手，随从一样，酒馆等级高的为先手，还一样就随机先手
 * @param playerData 玩家数据
 * @param enemyData 敌方数据
 * @returns 先手方数据
 */
interface BattleSideData {
  attackIndex: number;
  minions: (Minion | undefined)[];
  tavernLevel: number;
  side: 'player' | 'enemy';
}

/**
 * 判断先手方
 * 逻辑：随从多的为先手，随从一样，酒馆等级高的为先手，还一样就随机先手
 * @param playerData 玩家数据
 * @param enemyData 敌方数据
 * @returns 先手方数据
 */
const determineFirstAttacker = (
  playerData: BattleSideData,
  enemyData: BattleSideData
): BattleSideData => {
  // 计算双方随从数量
  const playerMinionCount = playerData.minions.filter(
    (m: Minion | undefined) => m !== undefined
  ).length;
  const enemyMinionCount = enemyData.minions.filter(
    (m: Minion | undefined) => m !== undefined
  ).length;

  // 条件1：随从多的为先手
  if (playerMinionCount > enemyMinionCount) {
    return playerData;
  } else if (enemyMinionCount > playerMinionCount) {
    return enemyData;
  }

  // 条件2：随从一样，酒馆等级高的为先手
  if (playerData.tavernLevel > enemyData.tavernLevel) {
    return playerData;
  } else if (enemyData.tavernLevel > playerData.tavernLevel) {
    return enemyData;
  }

  // 条件3：还一样，随机先手
  return Math.random() > 0.5 ? playerData : enemyData;
};
/**
 * 获取攻击随从
 * @param attackerData 攻击方数据
 * @returns 可攻击的随从，如果没有则返回null
 */
const getAttackMinion = (attackerData: BattleSideData): Minion | null => {
  // 获取有效的随从
  const validMinions = attackerData.minions.filter((m: Minion | undefined) => m !== undefined);
  if (validMinions.length === 0) {
    console.error('攻击方没有可攻击的随从', attackerData);
    throw new Error('攻击方没有可攻击的随从');
  }
  // 遍历查找可攻击的随从
  let attempts = 0;
  const maxAttempts = validMinions.length;
  while (attempts < maxAttempts) {
    const attackIndex = attackerData.attackIndex;
    const attacker = validMinions[attackIndex];
    // 检查随从是否存在
    if (!attacker) {
      console.error('攻击方随从索引超出范围', attackerData);
      throw new Error('攻击方随从索引超出范围');
    }
    // 检查攻击力是否>0
    else if (attacker.getAttack() <= 0) {
      // 攻击力<=0，跳过，索引+1
      attackerData.attackIndex += 1;
    }
    // 检查是否已攻击过
    else if (attacker.hasAttacked) {
      // 已攻击过，跳过，索引+1
      attackerData.attackIndex += 1;
    }
    // 找到可攻击的随从
    else {
      return attacker;
    }
    attempts++;
    // 如果是最后一个随从，重置索引
    if (attackerData.attackIndex >= validMinions.length) {
      attackerData.attackIndex = 0;
      validMinions.forEach(minion => (minion.hasAttacked = false));
      attempts = 0;
    }
  }
  // 遍历完所有随从都没有找到可攻击的，返回null
  return null;
};

/**
 * 获取攻击目标
 * 获取有嘲讽的随从（多个随机从中选择一个）
 * 禁止获取潜行的随从
 * 如果没有嘲讽的随从，随机选择一个敌方随从
 * @param attackerData 攻击方数据
 * @param playerData 玩家数据
 * @param enemyData 敌方数据
 * @returns 攻击目标，如果没有则返回null
 */
const getAttackTarget = (
  attackerData: BattleSideData,
  playerData: BattleSideData,
  enemyData: BattleSideData
): { target: Minion; targetSide: 'player' | 'enemy'; targetIndex: number } | null => {
  // 确定敌方随从列表
  const enemyMinions = attackerData.side === 'player' ? enemyData.minions : playerData.minions;
  const targetSide = attackerData.side === 'player' ? 'enemy' : 'player';

  // 1. 收集所有有嘲讽且可攻击的随从（非潜行、活着）
  const tauntMinions: { minion: Minion; index: number }[] = [];
  for (let i = 0; i < enemyMinions.length; i++) {
    const minion = enemyMinions[i];
    if (minion && minion.health > 0) {
      const keywords = minion.getKeywords();
      // 有嘲讽且没有潜行
      if (keywords.includes('taunt') && !keywords.includes('stealth')) {
        tauntMinions.push({ minion, index: i });
      }
    }
  }

  // 2. 如果有嘲讽随从，随机选择一个
  if (tauntMinions.length > 0) {
    const randomIndex = Math.floor(Math.random() * tauntMinions.length);
    const { minion: target, index: targetIndex } = tauntMinions[randomIndex]!;
    return { target, targetSide, targetIndex };
  }

  // 3. 如果没有嘲讽随从，收集所有可攻击的敌方随从（非潜行、活着）
  const validTargets: { minion: Minion; index: number }[] = [];
  for (let i = 0; i < enemyMinions.length; i++) {
    const minion = enemyMinions[i];
    if (minion && minion.health > 0) {
      const keywords = minion.getKeywords();
      // 没有潜行
      if (!keywords.includes('stealth')) {
        validTargets.push({ minion, index: i });
      }
    }
  }

  if (validTargets.length === 0) {
    return null;
  }

  // 4. 随机选择一个目标
  const randomIndex = Math.floor(Math.random() * validTargets.length);
  const selectedTarget = validTargets[randomIndex]!; // 非空断言，因为validTargets.length > 0
  const { minion: target, index: targetIndex } = selectedTarget;

  return { target, targetSide, targetIndex };
};
// 执行战斗
const executeBattle = async () => {
  console.log('开始执行战斗');
  isBattleRunning.value = true;
  internalBattleLog.value = ['开始战斗...'];
  internalBattleResult.value = null;
  // 重置卡片动画状态
  resetCardAnimations();
  // 数据定义
  const playerData: BattleSideData = {
    // 随从攻击索引
    attackIndex: 0,
    minions: props.playerMinions,
    tavernLevel: props.playerTavernLevel || 1,
    side: 'player',
  };
  const enemyData: BattleSideData = {
    // 随从攻击索引
    attackIndex: 0,
    minions: props.enemyMinions,
    tavernLevel: props.enemyTavernLevel || 1,
    side: 'enemy',
  };
  // 判断先手，并设置当前攻击方
  const firstAttacker = determineFirstAttacker(playerData, enemyData);
  // 当前攻击方
  let currentAttacker: BattleSideData = firstAttacker;

  while (true) {
    // 检查战斗是否结束
    if (checkBattleEnd(playerData.minions, enemyData.minions)) {
      // todo 战斗结束
      break;
    }
    // 获取攻击随从
    const attacker = getAttackMinion(currentAttacker);
    if (!attacker) {
      console.error('没有可攻击的随从', currentAttacker);
      throw new Error('没有可攻击的随从');
    }
    // 获取敌人目标
    const target = getAttackTarget(currentAttacker, playerData, enemyData);
    if (!target) {
      // 没有攻击目标，跳过当前攻击
      // 切换当前攻击方
      currentAttacker = currentAttacker === playerData ? enemyData : playerData;
      continue;
    }
    // 执行攻击
    // executeAttack(attacker, target.target, target.targetSide);
    // 切换当前攻击方
    currentAttacker = currentAttacker === playerData ? enemyData : playerData;
  }

  // while (!battleEnded && battleRound < maxRounds) {
  //   battleRound++;
  //   // 重置所有随从的攻击状态
  //   resetAttackStates(playerMinions, enemyMinions);
  //   // 检查战斗是否结束
  //   if (checkBattleEnd(playerMinions, enemyMinions)) {
  //     battleEnded = true;
  //     break;
  //   }

  //   // 执行攻击：动态查找可攻击的随从，而不是依赖预先生成的攻击顺序
  //   // 玩家和敌方轮流攻击，从索引0开始，检查每个随从是否可以攻击
  //   let playerAttackIndex = 0;
  //   let enemyAttackIndex = 0;
  //   let allAttacked = false;

  //   // 重置攻击次数计数
  //   let playerAttackedCount = 0;
  //   let enemyAttackedCount = 0;
  //   const totalPlayerMinions = playerMinions.filter(m => m !== undefined).length;
  //   const totalEnemyMinions = enemyMinions.filter(m => m !== undefined).length;

  //   // 当还有随从可以攻击且战斗未结束时，继续执行攻击
  //   while (!battleEnded && !allAttacked) {
  //     let roundHasAttack = false;

  //     // 玩家随从攻击回合
  //     if (playerAttackedCount < totalPlayerMinions) {
  //       // 查找下一个可以攻击的玩家随从
  //       let foundPlayerAttacker = false;
  //       let playerCheckIndex = playerAttackIndex;
  //       let playerCheckCount = 0;

  //       // 遍历玩家随从，查找可以攻击的随从
  //       while (!foundPlayerAttacker && playerCheckCount < playerMinions.length) {
  //         const attacker = playerMinions[playerCheckIndex];

  //         // 检查随从是否存在、活着且未攻击过
  //         if (attacker && attacker.health > 0 && !attacker.hasAttacked) {
  //           // 找到攻击目标
  //           const targetIndex = findAttackTarget(enemyMinions);
  //           if (targetIndex !== -1) {
  //             const target = enemyMinions[targetIndex];
  //             if (target && target.health > 0) {
  //               // 执行攻击动画
  //               await executeAttackAnimation('player', playerCheckIndex, targetIndex);

  //               // 记录攻击信息
  //               internalBattleLog.value.push(`${attacker.nameCN} 攻击了 ${target.nameCN}`);

  //               // 获取攻击力
  //               const attackerDamage = attacker.getAttack();
  //               const targetDamage = target.getAttack();

  //               // 处理攻击者受到的伤害
  //               const attackerDied = await handleDamage(
  //                 'player',
  //                 playerCheckIndex,
  //                 attacker,
  //                 targetDamage
  //               );
  //               if (attackerDied) {
  //                 await removeDeadMinion('player', playerCheckIndex, playerMinions, attacker);
  //                 // 随从死亡，重置当前索引，避免跳过随从
  //                 playerAttackIndex = Math.max(0, playerCheckIndex - 1);
  //               } else {
  //                 // 标记为已攻击
  //                 attacker.hasAttacked = true;
  //                 playerAttackedCount++;
  //                 // 攻击成功，索引+1，下次从下一个位置开始查找
  //                 playerAttackIndex = playerCheckIndex + 1;
  //               }

  //               // 处理目标受到的伤害
  //               const targetDied = await handleDamage('enemy', targetIndex, target, attackerDamage);
  //               if (targetDied) {
  //                 await removeDeadMinion('enemy', targetIndex, enemyMinions, target);
  //               }

  //               foundPlayerAttacker = true;
  //               roundHasAttack = true;
  //             }
  //           }
  //         }

  //         // 检查下一个索引
  //         playerCheckIndex = (playerCheckIndex + 1) % playerMinions.length;
  //         playerCheckCount++;
  //       }
  //     }

  //     // 检查战斗是否结束
  //     if (checkBattleEnd(playerMinions, enemyMinions)) {
  //       battleEnded = true;
  //       break;
  //     }

  //     // 敌方随从攻击回合
  //     if (enemyAttackedCount < totalEnemyMinions) {
  //       // 查找下一个可以攻击的敌方随从
  //       let foundEnemyAttacker = false;
  //       let enemyCheckIndex = enemyAttackIndex;
  //       let enemyCheckCount = 0;

  //       // 遍历敌方随从，查找可以攻击的随从
  //       while (!foundEnemyAttacker && enemyCheckCount < enemyMinions.length) {
  //         const attacker = enemyMinions[enemyCheckIndex];

  //         // 检查随从是否存在、活着且未攻击过
  //         if (attacker && attacker.health > 0 && !attacker.hasAttacked) {
  //           // 找到攻击目标
  //           const targetIndex = findAttackTarget(playerMinions);
  //           if (targetIndex !== -1) {
  //             const target = playerMinions[targetIndex];
  //             if (target && target.health > 0) {
  //               // 执行攻击动画
  //               await executeAttackAnimation('enemy', enemyCheckIndex, targetIndex);

  //               // 记录攻击信息
  //               internalBattleLog.value.push(`${attacker.nameCN} 攻击了 ${target.nameCN}`);

  //               // 获取攻击力
  //               const attackerDamage = attacker.getAttack();
  //               const targetDamage = target.getAttack();

  //               // 处理攻击者受到的伤害
  //               const attackerDied = await handleDamage(
  //                 'enemy',
  //                 enemyCheckIndex,
  //                 attacker,
  //                 targetDamage
  //               );
  //               if (attackerDied) {
  //                 await removeDeadMinion('enemy', enemyCheckIndex, enemyMinions, attacker);
  //                 // 随从死亡，重置当前索引，避免跳过随从
  //                 enemyAttackIndex = Math.max(0, enemyCheckIndex - 1);
  //               } else {
  //                 // 标记为已攻击
  //                 attacker.hasAttacked = true;
  //                 enemyAttackedCount++;
  //                 // 攻击成功，索引+1，下次从下一个位置开始查找
  //                 enemyAttackIndex = enemyCheckIndex + 1;
  //               }

  //               // 处理目标受到的伤害
  //               const targetDied = await handleDamage(
  //                 'player',
  //                 targetIndex,
  //                 target,
  //                 attackerDamage
  //               );
  //               if (targetDied) {
  //                 await removeDeadMinion('player', targetIndex, playerMinions, target);
  //               }

  //               foundEnemyAttacker = true;
  //               roundHasAttack = true;
  //             }
  //           }
  //         }

  //         // 检查下一个索引
  //         enemyCheckIndex = (enemyCheckIndex + 1) % enemyMinions.length;
  //         enemyCheckCount++;
  //       }
  //     }

  //     // 检查战斗是否结束
  //     if (checkBattleEnd(playerMinions, enemyMinions)) {
  //       battleEnded = true;
  //       break;
  //     }

  //     // 检查是否所有随从都已攻击
  //     const currentPlayerAttackedCount = playerMinions.filter(m => m && m.hasAttacked).length;
  //     const currentEnemyAttackedCount = enemyMinions.filter(m => m && m.hasAttacked).length;
  //     const currentPlayerMinions = playerMinions.filter(m => m !== undefined).length;
  //     const currentEnemyMinions = enemyMinions.filter(m => m !== undefined).length;
  //     allAttacked =
  //       currentPlayerAttackedCount >= currentPlayerMinions &&
  //       currentEnemyAttackedCount >= currentEnemyMinions;

  //     // 如果本轮没有任何攻击，结束攻击循环
  //     if (!roundHasAttack) {
  //       allAttacked = true;
  //     }
  //   }
  // }

  // 计算战斗结果
  const playerMinionCount = props.playerMinions.filter(
    (m: Minion | undefined) => m !== undefined
  ).length;
  const enemyMinionCount = props.enemyMinions.filter(
    (m: Minion | undefined) => m !== undefined
  ).length;

  const result: BattleResult = {
    winner: 'draw',
    playerHealthChange: 0,
    enemyHealthChange: 0,
    playerMinionsLeft: playerMinionCount,
    enemyMinionsLeft: enemyMinionCount,
  };

  if (playerMinionCount > 0 && enemyMinionCount === 0) {
    // 玩家获胜
    result.winner = 'player';
    // 计算对敌方英雄的伤害
    result.enemyHealthChange = -playerMinionCount;
  } else if (enemyMinionCount > 0 && playerMinionCount === 0) {
    // 敌方获胜
    result.winner = 'enemy';
    // 计算对玩家英雄的伤害
    result.playerHealthChange = -enemyMinionCount;
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
.battle-main {
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

.battle-card-row {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 底部战斗信息 */
.battle-info {
  background: linear-gradient(0deg, #16213e 0%, #0f3460 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.battle-controls {
  display: flex;
  gap: 20px;
  align-items: center;
}

/* 战斗按钮区域 */
.battle-action-area {
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: center;
}

.battle-action-area button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 120px;
}

.battle-action-area button:hover:not(:disabled) {
  background-color: #2980b9;
}

.battle-action-area button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
}

/* 战斗结果弹窗样式 */
:deep(.battle-result-content) {
  color: #333;
}

:deep(.result-winner) {
  text-align: center;
  margin-bottom: 20px;
}

:deep(.result-winner h3) {
  margin: 0;
  font-size: 24px;
  color: #e67e22;
}

:deep(.winner-player) {
  color: #2ecc71;
  font-weight: bold;
}

:deep(.winner-enemy) {
  color: #e74c3c;
  font-weight: bold;
}

:deep(.winner-draw) {
  color: #f1c40f;
  font-weight: bold;
}

:deep(.result-stats) {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

:deep(.stat-item) {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
}

:deep(.stat-item:last-child) {
  margin-bottom: 0;
}

:deep(.result-buttons) {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 战斗日志弹窗样式 */
:deep(.battle-log-content) {
  max-height: 400px;
  overflow-y: auto;
}

:deep(.log-list) {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
}

:deep(.log-item) {
  padding: 5px 0;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
  line-height: 1.5;
}

:deep(.log-item:last-child) {
  border-bottom: none;
}

:deep(.no-log) {
  text-align: center;
  color: #999;
  padding: 20px;
}

:deep(.log-buttons) {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}
</style>
