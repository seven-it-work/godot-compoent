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
import { MinionKeyword, type Minion } from '@/game/Minion';
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
  console.log('========================================');
  console.log('开始执行战斗');
  console.log('========================================');

  isBattleRunning.value = true;
  internalBattleLog.value = ['开始战斗...'];
  internalBattleResult.value = null;

  // 重置卡片动画状态
  resetCardAnimations();
  // 重置攻击状态
  resetAttackStates(props.playerMinions, props.enemyMinions);

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

  // 输出初始状态
  console.log('初始状态:');
  console.log(
    '玩家随从:',
    playerData.minions.filter(m => m).map(m => `${m?.nameCN} (${m?.attack}/${m?.health})`)
  );
  console.log(
    '敌方随从:',
    enemyData.minions.filter(m => m).map(m => `${m?.nameCN} (${m?.attack}/${m?.health})`)
  );

  // 判断先手，并设置当前攻击方
  const firstAttacker = determineFirstAttacker(playerData, enemyData);
  // 当前攻击方
  let currentAttacker: BattleSideData = firstAttacker;

  console.log(`先手方: ${firstAttacker.side === 'player' ? '玩家' : '敌方'}`);

  let round = 1;
  while (true) {
    console.log(`\n--- 回合 ${round} 开始 ---`);
    round++;

    // 检查战斗是否结束
    if (checkBattleEnd(playerData.minions, enemyData.minions)) {
      console.log('战斗结束条件满足');
      break;
    }

    // 获取攻击随从
    const attacker = getAttackMinion(currentAttacker);
    if (!attacker) {
      console.error('没有可攻击的随从', currentAttacker);
      throw new Error('没有可攻击的随从');
    }

    console.log(`当前攻击方: ${currentAttacker.side === 'player' ? '玩家' : '敌方'}`);
    console.log(`准备攻击的随从: ${attacker.nameCN} (${attacker.attack}/${attacker.health})`);

    // 检查风怒效果
    const keywords = attacker.getKeywords();
    let attackCount = 1;
    if (keywords.includes('windfury')) {
      attackCount = 2;
      console.log(`${attacker.nameCN} 有风怒效果，将攻击 ${attackCount} 次`);
    } else if (keywords.includes('super_windfury')) {
      attackCount = 3;
      console.log(`${attacker.nameCN} 有超级风怒效果，将攻击 ${attackCount} 次`);
    }

    // 执行攻击
    for (let i = 0; i < attackCount; i++) {
      console.log(`\n  攻击次数 ${i + 1}/${attackCount}:`);
      await attackEnemy(currentAttacker, playerData, enemyData, attacker);
    }

    // 切换当前攻击方
    currentAttacker = currentAttacker === playerData ? enemyData : playerData;
    console.log(`\n当前攻击方切换为: ${currentAttacker.side === 'player' ? '玩家' : '敌方'}`);

    // 输出当前状态
    console.log(
      '玩家随从状态:',
      playerData.minions
        .filter(m => m)
        .map(m => `${m?.nameCN} (${m?.attack}/${m?.health})${m?.hasAttacked ? ' [已攻击]' : ''}`)
    );
    console.log(
      '敌方随从状态:',
      enemyData.minions
        .filter(m => m)
        .map(m => `${m?.nameCN} (${m?.attack}/${m?.health})${m?.hasAttacked ? ' [已攻击]' : ''}`)
    );
  }

  console.log('\n========================================');
  console.log('战斗结束');
  console.log('========================================');
};

// 攻击敌方
const attackEnemy = async (
  currentAttacker: BattleSideData,
  playerData: BattleSideData,
  enemyData: BattleSideData,
  attacker: Minion
): Promise<void> => {
  console.log(`  攻击方: ${currentAttacker.side === 'player' ? '玩家' : '敌方'}`);
  console.log(`  攻击者: ${attacker.nameCN} (${attacker.attack}/${attacker.health})`);

  // 获取敌人目标
  const target = getAttackTarget(currentAttacker, playerData, enemyData);
  if (!target) {
    // 没有攻击目标，跳过当前攻击
    console.log(`  没有找到攻击目标，跳过当前攻击`);
    return;
  }

  console.log(
    `  攻击目标: ${target.target.nameCN} (${target.target.attack}/${target.target.health}) [${target.targetSide}方]`
  );

  // 获取攻击者索引
  const attackerIndex = currentAttacker.attackIndex;

  // 执行攻击
  await executeAttack(
    attacker,
    attackerIndex,
    currentAttacker.side,
    target.target,
    target.targetIndex,
    target.targetSide,
    playerData.minions,
    enemyData.minions
  );
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

// 执行单个攻击动画
const executeAttackAnimation = async (
  side: 'player' | 'enemy',
  index: number,
  targetSide: 'player' | 'enemy',
  targetIndex: number
) => {
  console.log(
    `执行${side}方第${index}个随从的攻击动画，攻击目标：${targetSide}方第${targetIndex}个随从`
  );
  // 简单的延迟，模拟攻击动画
  await new Promise(resolve => setTimeout(resolve, 800));
};

// 执行单个伤害动画
const executeDamageAnimation = async (side: 'player' | 'enemy', index: number, damage: number) => {
  console.log(`执行${side}方第${index}个随从的伤害动画，伤害值: ${damage}`);
  // 简单的延迟，模拟伤害动画
  await new Promise(resolve => setTimeout(resolve, 500));
};

// 执行单个死亡动画
const executeDeathAnimation = async (side: 'player' | 'enemy', index: number) => {
  console.log(`执行${side}方第${index}个随从的死亡动画`);
  // 简单的延迟，模拟死亡动画
  await new Promise(resolve => setTimeout(resolve, 1000));
};

// 执行单个圣盾消失动画
const executeDivineShieldBrokenAnimation = async (side: 'player' | 'enemy', index: number) => {
  console.log(`执行${side}方第${index}个随从的圣盾消失动画`);
  // 简单的延迟，模拟圣盾消失动画
  await new Promise(resolve => setTimeout(resolve, 300));
};

// 处理伤害
const handleDamage = async (
  side: 'player' | 'enemy',
  index: number,
  minion: Minion,
  damage: number
): Promise<boolean> => {
  console.log(`    伤害处理: ${side}方的 ${minion.nameCN}`);
  console.log(
    `    初始状态: ${minion.nameCN} (${minion.attack}/${minion.health})${minion.hasKeyword(MinionKeyword.DIVINE_SHIELD) ? ' [圣盾]' : ''}`
  );

  const minionHadDivineShield = minion.hasKeyword(MinionKeyword.DIVINE_SHIELD);
  let minionDied = false;

  if (minionHadDivineShield) {
    // 圣盾吸收所有伤害
    minion.removeKeyword(MinionKeyword.DIVINE_SHIELD);
    console.log(`    圣盾吸收: ${minion.nameCN} 的圣盾吸收了 ${damage} 点伤害，圣盾被打破！`);

    // 圣盾被打破，执行圣盾消失动画
    await executeDivineShieldBrokenAnimation(side, index);
    internalBattleLog.value.push(`${minion.nameCN} 的圣盾被打破了！`);
  } else {
    // 直接扣除生命值
    const originalHealth = minion.health || 0;
    minion.health = Math.max(0, originalHealth - damage);
    minionDied = (minion.health || 0) <= 0;

    console.log(`    伤害计算: ${minion.nameCN} 受到了 ${damage} 点伤害`);
    console.log(`    生命值变化: ${originalHealth} → ${minion.health}`);

    if (minionDied) {
      console.log(`    结果: ${minion.nameCN} 被杀死了！`);
    } else {
      console.log(`    结果: ${minion.nameCN} 还活着，剩余生命值: ${minion.health}`);
    }

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
  console.log(`    死亡处理: ${side}方的 ${minion.nameCN} 已死亡`);

  // 执行死亡动画
  await executeDeathAnimation(side, index);

  // 移除死亡随从并顶格处理
  minions.splice(index, 1);
  internalBattleLog.value.push(`${minion.nameCN} 被杀死了！`);

  // 检查并处理重生
  if (minion.getKeywords().includes('reborn')) {
    // 简单模拟重生，创建新的随从实例
    const originalMinion = new (minion.constructor as new () => Minion)();
    originalMinion.health = 1;
    originalMinion.hasAttacked = false;

    // 复制必要属性
    originalMinion.strId = minion.strId;
    originalMinion.nameCN = minion.nameCN;
    originalMinion.attack = minion.attack;

    minions.splice(index, 0, originalMinion);

    console.log(`    重生效果: ${originalMinion.nameCN} 成功重生，生命值恢复到 1`);
    internalBattleLog.value.push(`${originalMinion.nameCN} 成功重生了！`);
  } else {
    minions.push(undefined);
  }

  // 执行亡语
  if (minion.getKeywords().includes('deathrattle')) {
    // 简单模拟亡语效果
    console.log(`    亡语触发: ${minion.nameCN} 触发了亡语效果`);
    internalBattleLog.value.push(`${minion.nameCN} 触发了亡语！`);
    // 这里可以添加具体的亡语逻辑
  }
};

// 执行攻击
const executeAttack = async (
  attacker: Minion,
  attackerIndex: number,
  attackerSide: 'player' | 'enemy',
  target: Minion,
  targetIndex: number,
  targetSide: 'player' | 'enemy',
  playerMinions: (Minion | undefined)[],
  enemyMinions: (Minion | undefined)[]
) => {
  console.log(`  ========================================`);
  console.log(`  开始攻击执行`);
  console.log(`  ========================================`);

  // 获取攻击力
  const attackerDamage = attacker.getAttack();
  const targetDamage = target.getAttack();

  console.log(`  攻击详情:`);
  console.log(
    `  攻击者: ${attacker.nameCN} (${attacker.attack}/${attacker.health}) [${attackerSide}方]`
  );
  console.log(`  目标: ${target.nameCN} (${target.attack}/${target.health}) [${targetSide}方]`);
  console.log(
    `  攻击力: ${attacker.nameCN} 造成 ${attackerDamage} 点伤害，${target.nameCN} 反伤 ${targetDamage} 点`
  );

  // 记录攻击信息
  internalBattleLog.value.push(`${attacker.nameCN} 攻击了 ${target.nameCN}`);

  // 攻击动画
  console.log(`  执行攻击动画`);
  await executeAttackAnimation(attackerSide, attackerIndex, targetSide, targetIndex);

  // 被攻击者伤害处理
  console.log(`\n  ------------------------------`);
  console.log(`  处理目标伤害`);
  console.log(`  ------------------------------`);

  const targetDied = await handleDamage(targetSide, targetIndex, target, attackerDamage);

  if (targetDied) {
    console.log(`\n  ------------------------------`);
    console.log(`  处理目标死亡`);
    console.log(`  ------------------------------`);

    await removeDeadMinion(
      targetSide,
      targetIndex,
      targetSide === 'player' ? playerMinions : enemyMinions,
      target
    );
  }

  // 攻击者伤害处理（如果目标有攻击力）
  if (targetDamage > 0 && !targetDied) {
    console.log(`\n  ------------------------------`);
    console.log(`  处理攻击者反伤`);
    console.log(`  ------------------------------`);

    const attackerDied = await handleDamage(attackerSide, attackerIndex, attacker, targetDamage);

    if (attackerDied) {
      console.log(`\n  ------------------------------`);
      console.log(`  处理攻击者死亡`);
      console.log(`  ------------------------------`);

      await removeDeadMinion(
        attackerSide,
        attackerIndex,
        attackerSide === 'player' ? playerMinions : enemyMinions,
        attacker
      );
    }
  }

  // 标记攻击者为已攻击
  attacker.hasAttacked = true;
  console.log(`\n  ------------------------------`);
  console.log(`  攻击结束`);
  console.log(`  攻击者 ${attacker.nameCN} 已标记为已攻击`);
  console.log(`  ========================================`);
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
