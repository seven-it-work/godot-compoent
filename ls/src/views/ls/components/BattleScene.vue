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
const executeAttackAnimation = async (side: 'player' | 'enemy', index: number) => {
  console.log(`执行${side}方第${index}个随从的攻击动画`);

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

  // 等待攻击动画完成
  await new Promise(resolve => setTimeout(resolve, 500));

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

// 执行战斗
const executeBattle = async () => {
  console.log('开始执行战斗');
  isBattleRunning.value = true;
  internalBattleLog.value = ['开始战斗...'];
  internalBattleResult.value = null;

  // 重置卡片动画状态
  resetCardAnimations();

  // 暂时不复制随从列表，直接使用原数据（用于调试）
  // 这样可以确定问题是出在复制过程还是原数据本身
  const playerMinions = props.playerMinions;
  const enemyMinions = props.enemyMinions;

  // 记录当前状态
  internalBattleLog.value.push(
    `玩家随从数量: ${playerMinions.filter((m: any) => m !== undefined).length}`
  );
  internalBattleLog.value.push(
    `敌方随从数量: ${enemyMinions.filter((m: any) => m !== undefined).length}`
  );

  // 战斗主循环
  let battleRound = 0;
  const maxRounds = 100;
  let battleEnded = false;

  while (!battleEnded && battleRound < maxRounds) {
    battleRound++;
    console.log(`\n===== 战斗回合 ${battleRound} =====`);
    internalBattleLog.value.push(`回合 ${battleRound} 开始`);

    // 重置所有随从的攻击状态
    playerMinions.forEach(minion => {
      if (minion) minion.hasAttacked = false;
    });
    enemyMinions.forEach(minion => {
      if (minion) minion.hasAttacked = false;
    });

    // 计算当前随从数量
    const playerMinionCount = playerMinions.filter(m => m !== undefined).length;
    const enemyMinionCount = enemyMinions.filter(m => m !== undefined).length;

    // 检查战斗是否结束
    if (playerMinionCount === 0 || enemyMinionCount === 0) {
      battleEnded = true;
      break;
    }

    // 确定攻击顺序
    // 简化版：玩家先攻击，然后敌方攻击
    // 实际应该按照酒馆战棋规则：随从数量多的先攻击，数量相同则酒馆等级高的先攻击，都相同则随机
    const attackOrder = [];

    // 添加玩家随从到攻击顺序
    for (let i = 0; i < playerMinions.length; i++) {
      if (playerMinions[i] !== undefined) {
        attackOrder.push({ side: 'player', index: i });
      }
    }

    // 添加敌方随从到攻击顺序
    for (let i = 0; i < enemyMinions.length; i++) {
      if (enemyMinions[i] !== undefined) {
        attackOrder.push({ side: 'enemy', index: i });
      }
    }

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
        let targetIndex = -1;
        // 优先攻击有嘲讽的随从
        for (let i = 0; i < enemyMinions.length; i++) {
          const minion = enemyMinions[i];
          if (minion && minion.health > 0 && minion.getKeywords().includes('taunt')) {
            targetIndex = i;
            break;
          }
        }

        // 如果没有嘲讽随从，随机选择一个目标
        if (targetIndex === -1) {
          const validTargets: any[] = enemyMinions
            .map((minion, index) => ({ minion, index }))
            .filter(({ minion }) => minion !== undefined && minion.health > 0);

          if (validTargets.length === 0) {
            continue;
          }

          const randomIndex = Math.floor(Math.random() * validTargets.length);
          targetIndex = validTargets[randomIndex].index;
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
        let attackerDamage = attacker.getAttack();
        let targetDamage = target.getAttack();

        // 处理攻击者受到的伤害
        const attackerHadDivineShield = attacker.hasDivineShield || false;
        let attackerDied = false;

        if (attackerHadDivineShield) {
          // 圣盾吸收所有伤害
          attacker.hasDivineShield = false;
          console.log(`攻击者的圣盾吸收了 ${targetDamage} 点伤害`);
        } else {
          // 直接扣除生命值
          attacker.health = Math.max(0, (attacker.health || 0) - targetDamage);
          attackerDied = (attacker.health || 0) <= 0;
          console.log(`攻击者受到了 ${targetDamage} 点伤害，剩余生命值: ${attacker.health}`);
        }

        if (attackerHadDivineShield && !attacker.hasDivineShield) {
          // 圣盾被打破，执行圣盾消失动画
          await executeDivineShieldBrokenAnimation('player', attackUnit.index);
          internalBattleLog.value.push(`${attacker.nameCN} 的圣盾被打破了！`);
        } else if (!attackerHadDivineShield) {
          // 执行伤害动画
          await executeDamageAnimation('player', attackUnit.index, targetDamage);
          internalBattleLog.value.push(
            `${attacker.nameCN} 受到了 ${targetDamage} 点伤害，剩余生命值: ${attacker.health}`
          );

          if (attackerDied) {
            // 执行死亡动画
            await executeDeathAnimation('player', attackUnit.index);
            // 移除死亡随从并顶格处理
            playerMinions.splice(attackUnit.index, 1);
            playerMinions.push(undefined);
            internalBattleLog.value.push(`${attacker.nameCN} 被杀死了！`);
          }
        }

        // 处理目标受到的伤害
        const targetHadDivineShield = target.hasDivineShield || false;
        let targetDied = false;

        // 手动处理伤害
        if (targetHadDivineShield) {
          // 圣盾吸收所有伤害
          target.hasDivineShield = false;
          console.log(`目标的圣盾吸收了 ${attackerDamage} 点伤害`);
        } else {
          // 直接扣除生命值
          target.health = Math.max(0, (target.health || 0) - attackerDamage);
          targetDied = (target.health || 0) <= 0;
          console.log(`目标受到了 ${attackerDamage} 点伤害，剩余生命值: ${target.health}`);
        }

        if (targetHadDivineShield && !target.hasDivineShield) {
          // 圣盾被打破，执行圣盾消失动画
          await executeDivineShieldBrokenAnimation('enemy', targetIndex);
          internalBattleLog.value.push(`${target.nameCN} 的圣盾被打破了！`);
        } else if (!targetHadDivineShield) {
          // 执行伤害动画
          await executeDamageAnimation('enemy', targetIndex, attackerDamage);
          internalBattleLog.value.push(
            `${target.nameCN} 受到了 ${attackerDamage} 点伤害，剩余生命值: ${target.health}`
          );

          if (targetDied) {
            // 执行死亡动画
            await executeDeathAnimation('enemy', targetIndex);
            // 移除死亡随从并顶格处理
            enemyMinions.splice(targetIndex, 1);
            enemyMinions.push(undefined);
            internalBattleLog.value.push(`${target.nameCN} 被杀死了！`);
          }
        }

        // 标记为已攻击
        attacker.hasAttacked = true;
      } else {
        // 敌方随从攻击逻辑，与玩家随从攻击逻辑类似
        const attacker = enemyMinions[attackUnit.index];
        if (!attacker || attacker.health <= 0 || attacker.hasAttacked) {
          continue;
        }

        // 找到攻击目标
        let targetIndex = -1;
        // 优先攻击有嘲讽的随从
        for (let i = 0; i < playerMinions.length; i++) {
          const minion = playerMinions[i];
          if (minion && minion.health > 0 && minion.getKeywords().includes('taunt')) {
            targetIndex = i;
            break;
          }
        }

        // 如果没有嘲讽随从，随机选择一个目标
        if (targetIndex === -1) {
          const validTargets: any[] = playerMinions
            .map((minion, index) => ({ minion, index }))
            .filter(({ minion }) => minion !== undefined && minion.health > 0);

          if (validTargets.length === 0) {
            continue;
          }

          const randomIndex = Math.floor(Math.random() * validTargets.length);
          targetIndex = validTargets[randomIndex].index;
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
        let attackerDamage = attacker.getAttack();
        let targetDamage = target.getAttack();

        // 处理攻击者受到的伤害
        const attackerHadDivineShield = attacker.hasDivineShield || false;
        let attackerDied = false;

        // 手动处理伤害
        if (attackerHadDivineShield) {
          // 圣盾吸收所有伤害
          attacker.hasDivineShield = false;
          console.log(`敌方攻击者的圣盾吸收了 ${targetDamage} 点伤害`);
        } else {
          // 直接扣除生命值
          attacker.health = Math.max(0, (attacker.health || 0) - targetDamage);
          attackerDied = (attacker.health || 0) <= 0;
          console.log(`敌方攻击者受到了 ${targetDamage} 点伤害，剩余生命值: ${attacker.health}`);
        }
        if (attackerHadDivineShield && !attacker.hasDivineShield) {
          // 圣盾被打破，执行圣盾消失动画
          await executeDivineShieldBrokenAnimation('enemy', attackUnit.index);
          internalBattleLog.value.push(`${attacker.nameCN} 的圣盾被打破了！`);
        } else if (!attackerHadDivineShield) {
          // 执行伤害动画
          await executeDamageAnimation('enemy', attackUnit.index, targetDamage);
          internalBattleLog.value.push(
            `${attacker.nameCN} 受到了 ${targetDamage} 点伤害，剩余生命值: ${attacker.health}`
          );

          if (attackerDied) {
            // 执行死亡动画
            await executeDeathAnimation('enemy', attackUnit.index);
            // 移除死亡随从并顶格处理
            enemyMinions.splice(attackUnit.index, 1);
            enemyMinions.push(undefined);
            internalBattleLog.value.push(`${attacker.nameCN} 被杀死了！`);
          }
        }

        // 处理目标受到的伤害
        const targetHadDivineShield = target.hasDivineShield || false;
        let targetDied = false;

        // 手动处理伤害
        if (targetHadDivineShield) {
          // 圣盾吸收所有伤害
          target.hasDivineShield = false;
          console.log(`敌方攻击目标的圣盾吸收了 ${attackerDamage} 点伤害`);
        } else {
          // 直接扣除生命值
          target.health = Math.max(0, (target.health || 0) - attackerDamage);
          targetDied = (target.health || 0) <= 0;
          console.log(`敌方攻击目标受到了 ${attackerDamage} 点伤害，剩余生命值: ${target.health}`);
        }

        if (targetHadDivineShield && !target.hasDivineShield) {
          // 圣盾被打破，执行圣盾消失动画
          await executeDivineShieldBrokenAnimation('player', targetIndex);
          internalBattleLog.value.push(`${target.nameCN} 的圣盾被打破了！`);
        } else if (!targetHadDivineShield) {
          // 执行伤害动画
          await executeDamageAnimation('player', targetIndex, attackerDamage);
          internalBattleLog.value.push(
            `${target.nameCN} 受到了 ${attackerDamage} 点伤害，剩余生命值: ${target.health}`
          );

          if (targetDied) {
            // 执行死亡动画
            await executeDeathAnimation('player', targetIndex);
            // 移除死亡随从并顶格处理
            playerMinions.splice(targetIndex, 1);
            playerMinions.push(undefined);
            internalBattleLog.value.push(`${target.nameCN} 被杀死了！`);
          }
        }

        // 标记为已攻击
        attacker.hasAttacked = true;
      }

      // 检查战斗是否结束
      const currentPlayerMinionCount = playerMinions.filter(m => m !== undefined).length;
      const currentEnemyMinionCount = enemyMinions.filter(m => m !== undefined).length;

      if (currentPlayerMinionCount === 0 || currentEnemyMinionCount === 0) {
        battleEnded = true;
        break;
      }
    }
  }

  // 计算战斗结果
  const playerMinionCount = playerMinions.filter(m => m !== undefined).length;
  const enemyMinionCount = enemyMinions.filter(m => m !== undefined).length;

  const result = {
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
