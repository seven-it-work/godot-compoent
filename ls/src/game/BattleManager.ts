import { Minion } from './Minion';
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
 * 战斗执行结果，包含步骤队列和最终结果
 */
export interface BattleExecutionResult {
  steps: BattleStep[];
  finalResult: BattleResult;
}
