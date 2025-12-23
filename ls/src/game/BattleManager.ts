import { Minion, MinionKeyword } from './Minion';
/**
 * 战斗步骤类型枚举
 */
export enum BattleStepType {
  ATTACK = 'attack', // 攻击动作
  DAMAGE = 'damage', // 显示伤害
  DEATH = 'death', // 随从死亡
  DIVINE_SHIELD_BROKEN = 'divine_shield_broken', // 圣盾消失
  BATTLE_END = 'battle_end', // 战斗结束
}
/**
 * 攻击步骤数据
 */
export interface AttackStep {
  type: BattleStepType.ATTACK;
  attackerSide: 'player' | 'enemy';
  attackerIndex: number;
  attacker: Minion;
  targetSide: 'player' | 'enemy';
  targetIndex: number;
  target: Minion;
}
/**
 * 伤害步骤数据
 */
export interface DamageStep {
  type: BattleStepType.DAMAGE;
  side: 'player' | 'enemy';
  index: number;
  minion: Minion;
  damage: number;
  isAttacker: boolean;
}
/**
 * 死亡步骤数据
 */
export interface DeathStep {
  type: BattleStepType.DEATH;
  side: 'player' | 'enemy';
  index: number;
  minion: Minion;
}
/**
 * 圣盾消失步骤数据
 */
export interface DivineShieldBrokenStep {
  type: BattleStepType.DIVINE_SHIELD_BROKEN;
  side: 'player' | 'enemy';
  index: number;
  minion: Minion;
}
/**
 * 战斗结束步骤数据
 */
export interface BattleEndStep {
  type: BattleStepType.BATTLE_END;
  result: BattleResult;
}
/**
 * 战斗步骤联合类型
 */
export type BattleStep =
  | AttackStep
  | DamageStep
  | DeathStep
  | DivineShieldBrokenStep
  | BattleEndStep;
/**
 * 战斗结果类型
 */
export interface BattleResult {
  winner: 'player' | 'enemy' | 'draw';
  playerHealthChange: number;
  enemyHealthChange: number;
  playerMinionsLeft: number;
  enemyMinionsLeft: number;
}
/**
 * 战斗状态接口
 */
interface BattleState {
  playerMinions: any[];
  enemyMinions: any[];
  playerTavernLevel: number;
  enemyTavernLevel: number;
  playerAttacksFirst: boolean;
  battleRound: number;
  attackOrder: { side: 'player' | 'enemy'; index: number }[];
  currentAttackIndex: number;
  isBattleEnded: boolean;
  result: BattleResult | null;
}

/**
 * 战斗执行结果，包含步骤队列和最终结果
 */
export interface BattleExecutionResult {
  steps: BattleStep[];
  finalResult: BattleResult;
}

/**
 * 战斗管理器类 - 负责处理战斗的核心逻辑
 */
export class BattleManager {
  /**
   * 当前战斗状态
   */
  private static battleState: BattleState | null = null;
  /**
   * 执行战斗流程
   * @param playerMinions 玩家的随从列表
   * @param enemyMinions 敌方的随从列表
   * @param playerTavernLevel 玩家的酒馆等级
   * @param enemyTavernLevel 敌方的酒馆等级
   * @returns 战斗结果
   */
  /**
   * 初始化战斗状态
   * @param playerMinions 玩家的随从列表
   * @param enemyMinions 敌方的随从列表
   * @param playerTavernLevel 玩家的酒馆等级
   * @param enemyTavernLevel 敌方的酒馆等级
   */
  static initializeBattleState(
    playerMinions: any[],
    enemyMinions: any[],
    playerTavernLevel: number = 1,
    enemyTavernLevel: number = 1
  ): void {
    // 计算初始随从数量
    const playerMinionCount = playerMinions.filter(minion => minion !== null).length;
    const enemyMinionCount = enemyMinions.filter(minion => minion !== null).length;

    // 确定谁先攻击
    const playerAttacksFirst = this.shouldPlayerAttackFirst(
      playerMinionCount,
      enemyMinionCount,
      playerTavernLevel,
      enemyTavernLevel
    );

    // 获取初始攻击顺序
    const attackOrder = this.determineAttackOrder(playerMinions, enemyMinions, playerAttacksFirst);

    // 初始化战斗状态
    this.battleState = {
      playerMinions,
      enemyMinions,
      playerTavernLevel,
      enemyTavernLevel,
      playerAttacksFirst,
      battleRound: 1,
      attackOrder,
      currentAttackIndex: 0,
      isBattleEnded: false,
      result: null,
    };
  }

  /**
   * 执行单个战斗步骤
   * @returns 下一个战斗步骤，如果返回 null 则战斗结束
   */
  static executeNextBattleStep(): BattleStep | null {
    // 检查战斗状态是否存在
    if (!this.battleState || this.battleState.isBattleEnded) {
      return null;
    }

    const state = this.battleState;

    // 检查是否还有可攻击的随从
    const playerMinionCount = state.playerMinions.filter(minion => minion !== null).length;
    const enemyMinionCount = state.enemyMinions.filter(minion => minion !== null).length;

    if (playerMinionCount === 0 || enemyMinionCount === 0) {
      // 战斗结束，计算结果
      const result = this.calculateBattleResult(state);
      state.result = result;
      state.isBattleEnded = true;

      return {
        type: BattleStepType.BATTLE_END,
        result,
      };
    }

    // 检查当前攻击顺序是否已完成
    if (state.currentAttackIndex >= state.attackOrder.length) {
      // 进入下一轮攻击
      state.battleRound++;

      // 重置攻击状态
      this.resetAttackStatus(state.playerMinions);
      this.resetAttackStatus(state.enemyMinions);

      // 重新确定攻击顺序
      state.attackOrder = this.determineAttackOrder(
        state.playerMinions,
        state.enemyMinions,
        state.playerAttacksFirst
      );
      state.currentAttackIndex = 0;

      // 如果没有可攻击的随从，结束战斗
      if (state.attackOrder.length === 0) {
        const result = this.calculateBattleResult(state);
        state.result = result;
        state.isBattleEnded = true;

        return {
          type: BattleStepType.BATTLE_END,
          result,
        };
      }
    }

    // 获取当前攻击者
    const currentAttack = state.attackOrder[state.currentAttackIndex];
    state.currentAttackIndex++;

    if (currentAttack.side === 'player') {
      return this.executePlayerAttack(state, currentAttack.index);
    } else {
      return this.executeEnemyAttack(state, currentAttack.index);
    }
  }

  /**
   * 执行玩家随从攻击
   * @param state 战斗状态
   * @param attackerIndex 攻击者索引
   * @returns 攻击步骤
   */
  private static executePlayerAttack(state: BattleState, attackerIndex: number): BattleStep | null {
    const attacker = state.playerMinions[attackerIndex];

    if (!attacker || attacker.health <= 0 || attacker.hasAttacked) {
      return this.executeNextBattleStep();
    }

    // 找到攻击目标
    const targetIndex = this.findAttackTarget(state.enemyMinions);
    if (targetIndex === -1) {
      return this.executeNextBattleStep();
    }

    const target = state.enemyMinions[targetIndex];
    if (!target || target.health <= 0) {
      return this.executeNextBattleStep();
    }

    // 创建攻击步骤
    const attackStep: AttackStep = {
      type: BattleStepType.ATTACK,
      attackerSide: 'player',
      attackerIndex,
      attacker,
      targetSide: 'enemy',
      targetIndex,
      target,
    };

    return attackStep;
  }

  /**
   * 执行敌方随从攻击
   * @param state 战斗状态
   * @param attackerIndex 攻击者索引
   * @returns 攻击步骤
   */
  private static executeEnemyAttack(state: BattleState, attackerIndex: number): BattleStep | null {
    const attacker = state.enemyMinions[attackerIndex];

    if (!attacker || attacker.health <= 0 || attacker.hasAttacked) {
      return this.executeNextBattleStep();
    }

    // 找到攻击目标
    const targetIndex = this.findAttackTarget(state.playerMinions);
    if (targetIndex === -1) {
      return this.executeNextBattleStep();
    }

    const target = state.playerMinions[targetIndex];
    if (!target || target.health <= 0) {
      return this.executeNextBattleStep();
    }

    // 创建攻击步骤
    const attackStep: AttackStep = {
      type: BattleStepType.ATTACK,
      attackerSide: 'enemy',
      attackerIndex,
      attacker,
      targetSide: 'player',
      targetIndex,
      target,
    };

    return attackStep;
  }

  /**
   * 执行攻击伤害
   * @param attackStep 攻击步骤
   * @returns 伤害步骤数组
   */
  static executeAttackDamage(attackStep: AttackStep): BattleStep[] {
    const steps: BattleStep[] = [];

    const { attacker, target, attackerSide, attackerIndex, targetSide, targetIndex } = attackStep;

    // 执行攻击并获取伤害步骤
    const attackSteps = this.executeAttack(
      attacker,
      target,
      attackerSide,
      attackerIndex,
      targetSide,
      targetIndex
    );
    steps.push(...attackSteps);

    // 标记为已攻击
    attacker.hasAttacked = true;

    return steps;
  }

  /**
   * 执行死亡处理
   * @param attackStep 攻击步骤
   * @returns 死亡步骤数组
   */
  static executeDeath(attackStep: AttackStep): BattleStep[] {
    const steps: BattleStep[] = [];

    const { attacker, target, attackerSide, attackerIndex, targetSide, targetIndex } = attackStep;

    // 检查目标是否死亡
    if (target.health <= 0) {
      steps.push({
        type: BattleStepType.DEATH,
        side: targetSide,
        index: targetIndex,
        minion: target,
      });
    }

    // 检查攻击者是否死亡
    if (attacker.health <= 0) {
      steps.push({
        type: BattleStepType.DEATH,
        side: attackerSide,
        index: attackerIndex,
        minion: attacker,
      });
    }

    return steps;
  }

  /**
   * 执行实际的死亡数据处理
   * @param attackStep 攻击步骤
   */
  static processDeathData(attackStep: AttackStep): void {
    const { attacker, target, attackerSide, attackerIndex, targetSide, targetIndex } = attackStep;
    const state = this.battleState;

    if (!state) {
      return;
    }

    // 检查目标是否死亡
    if (target.health <= 0) {
      // 移除死亡目标并将后面的随从向前补位
      if (targetSide === 'player') {
        this.removeMinionAndShift(state.playerMinions, targetIndex);
      } else {
        this.removeMinionAndShift(state.enemyMinions, targetIndex);
      }
    }

    // 检查攻击者是否死亡
    if (attacker.health <= 0) {
      // 移除死亡攻击者并将后面的随从向前补位
      if (attackerSide === 'player') {
        this.removeMinionAndShift(state.playerMinions, attackerIndex);
      } else {
        this.removeMinionAndShift(state.enemyMinions, attackerIndex);
      }
    }
  }

  /**
   * 移除随从并将后面的随从向前补位
   * @param minions 随从列表
   * @param index 要移除的随从索引
   */
  private static removeMinionAndShift(minions: any[], index: number): void {
    // 移除指定索引的随从
    minions.splice(index, 1);
    // 在末尾添加一个 null 来保持数组长度不变
    minions.push(null);
  }

  /**
   * 计算战斗结果
   * @param state 战斗状态
   * @returns 战斗结果
   */
  private static calculateBattleResult(state: BattleState): BattleResult {
    const result: BattleResult = {
      winner: 'draw',
      playerHealthChange: 0,
      enemyHealthChange: 0,
      playerMinionsLeft: state.playerMinions.filter(minion => minion !== null).length,
      enemyMinionsLeft: state.enemyMinions.filter(minion => minion !== null).length,
    };

    // 如果一方没有随从了，计算对英雄的伤害
    if (result.playerMinionsLeft === 0 && result.enemyMinionsLeft > 0) {
      // 敌方获胜，计算对玩家英雄的伤害
      const damageToPlayer = this.calculateHeroDamage(state.enemyMinions, state.enemyTavernLevel);
      result.winner = 'enemy';
      result.playerHealthChange = -damageToPlayer;
      console.log(`敌方获胜，对玩家造成 ${damageToPlayer} 点伤害`);
    } else if (result.enemyMinionsLeft === 0 && result.playerMinionsLeft > 0) {
      // 玩家获胜，计算对敌方英雄的伤害
      const damageToEnemy = this.calculateHeroDamage(state.playerMinions, state.playerTavernLevel);
      result.winner = 'player';
      result.enemyHealthChange = -damageToEnemy;
      console.log(`玩家获胜，对敌方造成 ${damageToEnemy} 点伤害`);
    } else {
      // 平局
      result.winner = 'draw';
      console.log('战斗平局');
    }

    return result;
  }

  /**
   * 执行完整战斗流程（保留原方法，供需要一次性执行的场景使用）
   * @param playerMinions 玩家的随从列表
   * @param enemyMinions 敌方的随从列表
   * @param playerTavernLevel 玩家的酒馆等级
   * @param enemyTavernLevel 敌方的酒馆等级
   * @returns 战斗结果
   */
  static executeBattle(
    playerMinions: (Minion | null)[],
    enemyMinions: (Minion | null)[],
    playerTavernLevel: number = 1,
    enemyTavernLevel: number = 1
  ): BattleExecutionResult {
    console.log('开始执行战斗');
    // 初始化战斗步骤队列
    const steps: BattleStep[] = [];

    // 复制随从列表，避免修改原数据
    const playerMinionsCopy = playerMinions.map(minion =>
      minion ? Object.assign(Object.create(Minion.prototype), minion) : null
    );
    const enemyMinionsCopy = enemyMinions.map(minion =>
      minion ? Object.assign(Object.create(Minion.prototype), minion) : null
    );

    // 计算初始随从数量
    let playerMinionCount = playerMinionsCopy.filter(minion => minion !== null).length;
    let enemyMinionCount = enemyMinionsCopy.filter(minion => minion !== null).length;

    // 确定谁先攻击
    const playerAttacksFirst = this.shouldPlayerAttackFirst(
      playerMinionCount,
      enemyMinionCount,
      playerTavernLevel,
      enemyTavernLevel
    );

    console.log(`玩家随从数量: ${playerMinionCount}, 敌方随从数量: ${enemyMinionCount}`);
    console.log(`玩家酒馆等级: ${playerTavernLevel}, 敌方酒馆等级: ${enemyTavernLevel}`);
    console.log(`玩家先攻击: ${playerAttacksFirst}`);

    // 执行战斗回合，直到一方没有随从
    let battleRound = 0;
    let maxRounds = 100;

    while (playerMinionCount > 0 && enemyMinionCount > 0 && battleRound < maxRounds) {
      battleRound++;
      console.log(`\n===== 战斗回合 ${battleRound} =====`);

      // 重置所有随从的攻击状态
      this.resetAttackStatus(playerMinionsCopy);
      this.resetAttackStatus(enemyMinionsCopy);

      // 获取当前轮次的攻击者顺序
      const attackOrder = this.determineAttackOrder(
        playerMinionsCopy,
        enemyMinionsCopy,
        playerAttacksFirst
      );

      // 执行当前轮次的攻击
      for (const attackUnit of attackOrder) {
        // 检查是否还有可攻击的随从
        playerMinionCount = playerMinionsCopy.filter(minion => minion !== null).length;
        enemyMinionCount = enemyMinionsCopy.filter(minion => minion !== null).length;

        if (playerMinionCount === 0 || enemyMinionCount === 0) {
          break;
        }

        if (attackUnit.side === 'player') {
          // 玩家随从攻击敌方随从
          const attackerIndex = attackUnit.index;
          const attacker = playerMinionsCopy[attackerIndex];

          if (!attacker || attacker.health <= 0) {
            continue;
          }

          // 找到攻击目标
          const targetIndex = this.findAttackTarget(enemyMinionsCopy);
          if (targetIndex === -1) {
            continue;
          }

          const target = enemyMinionsCopy[targetIndex];
          if (!target || target.health <= 0) {
            continue;
          }

          // 添加攻击步骤
          steps.push({
            type: BattleStepType.ATTACK,
            attackerSide: 'player',
            attackerIndex,
            attacker,
            targetSide: 'enemy',
            targetIndex,
            target,
          });

          // 执行攻击并获取伤害步骤
          const attackSteps = this.executeAttack(
            attacker,
            target,
            'player',
            attackerIndex,
            'enemy',
            targetIndex
          );
          steps.push(...attackSteps);

          // 标记为已攻击
          attacker.hasAttacked = true;

          // 检查目标是否死亡
          if (target.health <= 0) {
            steps.push({
              type: BattleStepType.DEATH,
              side: 'enemy',
              index: targetIndex,
              minion: target,
            });
            enemyMinionsCopy[targetIndex] = null;
            console.log(`玩家随从 ${attacker.nameCN} 杀死了敌方随从 ${target.nameCN}`);
          }

          // 检查攻击者是否死亡
          if (attacker.health <= 0) {
            steps.push({
              type: BattleStepType.DEATH,
              side: 'player',
              index: attackerIndex,
              minion: attacker,
            });
            playerMinionsCopy[attackerIndex] = null;
            console.log(`玩家随从 ${attacker.nameCN} 被敌方随从 ${target.nameCN} 杀死`);
          }
        } else {
          // 敌方随从攻击玩家随从
          const attackerIndex = attackUnit.index;
          const attacker = enemyMinionsCopy[attackerIndex];

          if (!attacker || attacker.health <= 0) {
            continue;
          }

          // 找到攻击目标
          const targetIndex = this.findAttackTarget(playerMinionsCopy);
          if (targetIndex === -1) {
            continue;
          }

          const target = playerMinionsCopy[targetIndex];
          if (!target || target.health <= 0) {
            continue;
          }

          // 添加攻击步骤
          steps.push({
            type: BattleStepType.ATTACK,
            attackerSide: 'enemy',
            attackerIndex,
            attacker,
            targetSide: 'player',
            targetIndex,
            target,
          });

          // 执行攻击并获取伤害步骤
          const attackSteps = this.executeAttack(
            attacker,
            target,
            'enemy',
            attackerIndex,
            'player',
            targetIndex
          );
          steps.push(...attackSteps);

          // 标记为已攻击
          attacker.hasAttacked = true;

          // 检查目标是否死亡
          if (target.health <= 0) {
            steps.push({
              type: BattleStepType.DEATH,
              side: 'player',
              index: targetIndex,
              minion: target,
            });
            playerMinionsCopy[targetIndex] = null;
            console.log(`敌方随从 ${attacker.nameCN} 杀死了玩家随从 ${target.nameCN}`);
          }

          // 检查攻击者是否死亡
          if (attacker.health <= 0) {
            steps.push({
              type: BattleStepType.DEATH,
              side: 'enemy',
              index: attackerIndex,
              minion: attacker,
            });
            enemyMinionsCopy[attackerIndex] = null;
            console.log(`敌方随从 ${attacker.nameCN} 被玩家随从 ${target.nameCN} 杀死`);
          }
        }
      }

      // 更新随从数量
      playerMinionCount = playerMinionsCopy.filter(minion => minion !== null).length;
      enemyMinionCount = enemyMinionsCopy.filter(minion => minion !== null).length;

      console.log(
        `回合 ${battleRound} 结束 - 玩家剩余随从: ${playerMinionCount}, 敌方剩余随从: ${enemyMinionCount}`
      );
    }

    // 计算战斗结果
    const result: BattleResult = {
      winner: 'draw',
      playerHealthChange: 0,
      enemyHealthChange: 0,
      playerMinionsLeft: playerMinionCount,
      enemyMinionsLeft: enemyMinionCount,
    };

    // 如果一方没有随从了，计算对英雄的伤害
    if (playerMinionCount === 0 && enemyMinionCount > 0) {
      // 敌方获胜，计算对玩家英雄的伤害
      const damageToPlayer = this.calculateHeroDamage(enemyMinionsCopy, enemyTavernLevel);
      result.winner = 'enemy';
      result.playerHealthChange = -damageToPlayer;
      console.log(`敌方获胜，对玩家造成 ${damageToPlayer} 点伤害`);
    } else if (enemyMinionCount === 0 && playerMinionCount > 0) {
      // 玩家获胜，计算对敌方英雄的伤害
      const damageToEnemy = this.calculateHeroDamage(playerMinionsCopy, playerTavernLevel);
      result.winner = 'player';
      result.enemyHealthChange = -damageToEnemy;
      console.log(`玩家获胜，对敌方造成 ${damageToEnemy} 点伤害`);
    } else {
      // 平局
      result.winner = 'draw';
      console.log('战斗平局');
    }

    // 添加战斗结束步骤
    steps.push({
      type: BattleStepType.BATTLE_END,
      result,
    });

    return {
      steps,
      finalResult: result,
    };
  }
  /**
   * 确定玩家是否先攻击
   * @param playerMinionCount 玩家的随从数量
   * @param enemyMinionCount 敌方的随从数量
   * @param playerTavernLevel 玩家的酒馆等级
   * @param enemyTavernLevel 敌方的酒馆等级
   * @returns 玩家是否先攻击
   */
  private static shouldPlayerAttackFirst(
    playerMinionCount: number,
    enemyMinionCount: number,
    playerTavernLevel: number,
    enemyTavernLevel: number
  ): boolean {
    // 1. 随从数量多的一方先攻击
    if (playerMinionCount > enemyMinionCount) {
      return true;
    } else if (playerMinionCount < enemyMinionCount) {
      return false;
    }
    // 2. 随从数量相同时，酒馆等级高的一方先攻击
    if (playerTavernLevel > enemyTavernLevel) {
      return true;
    } else if (playerTavernLevel < enemyTavernLevel) {
      return false;
    }
    // 3. 酒馆等级相同时，随机决定（默认玩家先攻击）
    return true;
  }
  /**
   * 执行玩家随从的攻击
   * @param playerMinions 玩家的随从列表
   * @param enemyMinions 敌方的随从列表
   */
  private static executePlayerAttacks(
    playerMinions: (Minion | null)[],
    enemyMinions: (Minion | null)[],
    steps: BattleStep[]
  ): void {
    // 遍历玩家的每个随从，从左到右
    for (let i = 0; i < playerMinions.length; i++) {
      const attacker = playerMinions[i];
      if (!attacker) continue;
      // 跳过已经攻击过的随从
      if (attacker.hasAttacked) continue;
      // 找到攻击目标
      const targetIndex = this.findAttackTarget(enemyMinions);
      if (targetIndex === -1) continue;
      const target = enemyMinions[targetIndex];
      if (!target) continue;
      // 添加攻击步骤
      steps.push({
        type: BattleStepType.ATTACK,
        attackerSide: 'player',
        attackerIndex: i,
        attacker,
        targetSide: 'enemy',
        targetIndex,
        target,
      });
      // 执行攻击并获取伤害步骤
      const attackSteps = this.executeAttack(attacker, target, 'player', i, 'enemy', targetIndex);
      steps.push(...attackSteps);
      // 标记为已攻击
      attacker.hasAttacked = true;
      // 检查目标是否死亡
      if (target.health <= 0) {
        steps.push({
          type: BattleStepType.DEATH,
          side: 'enemy',
          index: targetIndex,
          minion: target,
        });
        enemyMinions[targetIndex] = null;
        console.log(`玩家随从 ${attacker.nameCN} 杀死了敌方随从 ${target.nameCN}`);
      }
      // 检查攻击者是否死亡
      if (attacker.health <= 0) {
        steps.push({
          type: BattleStepType.DEATH,
          side: 'player',
          index: i,
          minion: attacker,
        });
        playerMinions[i] = null;
        console.log(`玩家随从 ${attacker.nameCN} 被敌方随从 ${target.nameCN} 杀死`);
      }
    }
  }
  /**
   * 执行敌方随从的攻击
   * @param enemyMinions 敌方的随从列表
   * @param playerMinions 玩家的随从列表
   */
  private static executeEnemyAttacks(
    enemyMinions: (Minion | null)[],
    playerMinions: (Minion | null)[],
    steps: BattleStep[]
  ): void {
    // 遍历敌方的每个随从，从左到右
    for (let i = 0; i < enemyMinions.length; i++) {
      const attacker = enemyMinions[i];
      if (!attacker) continue;
      // 跳过已经攻击过的随从
      if (attacker.hasAttacked) continue;
      // 找到攻击目标
      const targetIndex = this.findAttackTarget(playerMinions);
      if (targetIndex === -1) continue;
      const target = playerMinions[targetIndex];
      if (!target) continue;
      // 添加攻击步骤
      steps.push({
        type: BattleStepType.ATTACK,
        attackerSide: 'enemy',
        attackerIndex: i,
        attacker,
        targetSide: 'player',
        targetIndex,
        target,
      });
      // 执行攻击并获取伤害步骤
      const attackSteps = this.executeAttack(attacker, target, 'enemy', i, 'player', targetIndex);
      steps.push(...attackSteps);
      // 标记为已攻击
      attacker.hasAttacked = true;
      // 检查目标是否死亡
      if (target.health <= 0) {
        steps.push({
          type: BattleStepType.DEATH,
          side: 'player',
          index: targetIndex,
          minion: target,
        });
        playerMinions[targetIndex] = null;
        console.log(`敌方随从 ${attacker.nameCN} 杀死了玩家随从 ${target.nameCN}`);
      }
      // 检查攻击者是否死亡
      if (attacker.health <= 0) {
        steps.push({
          type: BattleStepType.DEATH,
          side: 'enemy',
          index: i,
          minion: attacker,
        });
        enemyMinions[i] = null;
        console.log(`敌方随从 ${attacker.nameCN} 被玩家随从 ${target.nameCN} 杀死`);
      }
    }
  }
  /**
   * 找到攻击目标
   * @param defenders 防御方的随从列表
   * @returns 攻击目标的索引，-1表示没有目标
   */
  private static findAttackTarget(defenders: (Minion | null)[]): number {
    // 1. 优先攻击有嘲讽的随从
    const tauntTargets = defenders
      .map((minion, index) => ({ minion, index }))
      .filter(({ minion }) => minion && minion.getKeywords().includes(MinionKeyword.TAUNT));
    if (tauntTargets.length > 0) {
      // 随机选择一个嘲讽随从
      const randomIndex = Math.floor(Math.random() * tauntTargets.length);
      const target = tauntTargets[randomIndex];
      if (target) {
        return target.index;
      }
    }
    // 2. 没有嘲讽时，随机攻击一个随从
    const validTargets = defenders
      .map((minion, index) => ({ minion, index }))
      .filter(({ minion }) => minion !== null);
    if (validTargets.length > 0) {
      const randomIndex = Math.floor(Math.random() * validTargets.length);
      const target = validTargets[randomIndex];
      if (target) {
        return target.index;
      }
    }
    // 3. 没有可攻击的目标
    return -1;
  }
  /**
   * 执行攻击
   * @param attacker 攻击者
   * @param defender 防御者
   */
  private static executeAttack(
    attacker: Minion,
    defender: Minion,
    attackerSide: 'player' | 'enemy',
    attackerIndex: number,
    defenderSide: 'player' | 'enemy',
    defenderIndex: number
  ): BattleStep[] {
    const steps: BattleStep[] = [];
    console.log(
      `攻击: ${attacker.nameCN} (${attacker.getAttack()}) -> ${defender.nameCN} (${defender.health})`
    );
    // 1. 检查攻击者是否有圣盾
    if (attacker.hasDivineShield) {
      attacker.hasDivineShield = false;
      console.log(`${attacker.nameCN} 失去了圣盾`);
      // 添加圣盾消失步骤
      steps.push({
        type: BattleStepType.DIVINE_SHIELD_BROKEN,
        side: attackerSide,
        index: attackerIndex,
        minion: attacker,
      });
    } else {
      // 2. 攻击者受到防御者的攻击力伤害
      const damageToAttacker = defender.getAttack();
      attacker.health -= damageToAttacker;
      console.log(
        `${attacker.nameCN} 受到了 ${damageToAttacker} 点伤害，剩余生命值: ${attacker.health}`
      );
      // 添加伤害步骤
      steps.push({
        type: BattleStepType.DAMAGE,
        side: attackerSide,
        index: attackerIndex,
        minion: attacker,
        damage: damageToAttacker,
        isAttacker: true,
      });
    }
    // 3. 检查防御者是否有圣盾
    if (defender.hasDivineShield) {
      defender.hasDivineShield = false;
      console.log(`${defender.nameCN} 失去了圣盾`);
      // 添加圣盾消失步骤
      steps.push({
        type: BattleStepType.DIVINE_SHIELD_BROKEN,
        side: defenderSide,
        index: defenderIndex,
        minion: defender,
      });
    } else {
      // 4. 防御者受到攻击者的攻击力伤害
      const damageToDefender = attacker.getAttack();
      defender.health -= damageToDefender;
      console.log(
        `${defender.nameCN} 受到了 ${damageToDefender} 点伤害，剩余生命值: ${defender.health}`
      );
      // 添加伤害步骤
      steps.push({
        type: BattleStepType.DAMAGE,
        side: defenderSide,
        index: defenderIndex,
        minion: defender,
        damage: damageToDefender,
        isAttacker: false,
      });
    }
    return steps;
  }
  /**
   * 重置所有随从的攻击状态
   * @param minions 随从列表
   */
  private static resetAttackStatus(minions: (Minion | null)[]): void {
    for (const minion of minions) {
      if (minion) {
        minion.hasAttacked = false;
      }
    }
  }

  /**
   * 确定攻击顺序
   * @param playerMinions 玩家的随从列表
   * @param enemyMinions 敌方的随从列表
   * @param playerAttacksFirst 是否玩家先攻击
   * @returns 攻击顺序数组
   */
  private static determineAttackOrder(
    playerMinions: (Minion | null)[],
    enemyMinions: (Minion | null)[],
    playerAttacksFirst: boolean
  ): { side: 'player' | 'enemy'; index: number }[] {
    const attackOrder: { side: 'player' | 'enemy'; index: number }[] = [];

    // 获取有效随从索引
    const playerValidIndices = playerMinions
      .map((minion, index) => ({ minion, index }))
      .filter(({ minion }) => minion !== null && minion.health > 0)
      .map(({ index }) => index);

    const enemyValidIndices = enemyMinions
      .map((minion, index) => ({ minion, index }))
      .filter(({ minion }) => minion !== null && minion.health > 0)
      .map(({ index }) => index);

    // 确定最大随从数量
    const maxMinions = Math.max(playerValidIndices.length, enemyValidIndices.length);

    // 按照左右顺序交替添加攻击单位
    for (let i = 0; i < maxMinions; i++) {
      if (playerAttacksFirst) {
        // 玩家先攻击
        if (i < playerValidIndices.length) {
          attackOrder.push({ side: 'player', index: playerValidIndices[i] });
        }
        if (i < enemyValidIndices.length) {
          attackOrder.push({ side: 'enemy', index: enemyValidIndices[i] });
        }
      } else {
        // 敌方先攻击
        if (i < enemyValidIndices.length) {
          attackOrder.push({ side: 'enemy', index: enemyValidIndices[i] });
        }
        if (i < playerValidIndices.length) {
          attackOrder.push({ side: 'player', index: playerValidIndices[i] });
        }
      }
    }

    return attackOrder;
  }

  /**
   * 计算对英雄的伤害
   * @param remainingMinions 剩余的随从列表
   * @param winnerTavernLevel 获胜方的酒馆等级
   * @returns 对英雄造成的伤害
   */
  private static calculateHeroDamage(
    remainingMinions: (Minion | null)[],
    winnerTavernLevel: number
  ): number {
    // 伤害值 = 胜方酒馆等级 + 胜方场上剩余随从的星级之和
    let damage = winnerTavernLevel;

    for (const minion of remainingMinions) {
      if (minion) {
        // 假设 minion 有 tier 属性表示星级
        damage += minion.tier || 0;
      }
    }

    return damage;
  }
}
