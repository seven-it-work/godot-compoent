import type { Cultivator } from "@/v1/cultivator/define";
import type { Location } from "@/v1/location/define";

/**
 * 战斗状态枚举
 */
export enum CombatStatus {
  /** 战斗未开始 */
  NOT_STARTED = "NOT_STARTED",
  /** 战斗进行中 */
  IN_PROGRESS = "IN_PROGRESS",
  /** 战斗结束 - 玩家胜利 */
  PLAYER_VICTORY = "PLAYER_VICTORY",
  /** 战斗结束 - 玩家失败 */
  PLAYER_DEFEAT = "PLAYER_DEFEAT",
  /** 战斗结束 - 平局 */
  DRAW = "DRAW"
}

/**
 * 战斗参与者类型
 */
export type CombatParticipant = Cultivator;

/**
 * 战斗回合信息
 */
export interface CombatRound {
  /** 回合编号 */
  roundNumber: number;
  /** 攻击方 */
  attacker: CombatParticipant;
  /** 防御方 */
  defender: CombatParticipant;
  /** 伤害值 */
  damage: number;
  /** 是否暴击 */
  isCritical: boolean;
  /** 是否命中 */
  isHit: boolean;
  /** 回合结束时攻击方状态 */
  attackerStatus: {
    hp: number;
    spiritPower: number;
  };
  /** 回合结束时防御方状态 */
  defenderStatus: {
    hp: number;
    spiritPower: number;
  };
}

/**
 * 战斗结果
 */
export interface CombatResult {
  /** 战斗状态 */
  status: CombatStatus;
  /** 战斗双方 */
  participants: {
    player: CombatParticipant;
    enemy: CombatParticipant;
  };
  /** 战斗回合记录 */
  rounds: CombatRound[];
  /** 战斗持续回合数 */
  totalRounds: number;
  /** 战斗奖励 */
  rewards: {
    /** 经验值 */
    experience: number;
    /** 物品列表 */
    items: string[];
    /** 灵气值 */
    spiritQi: number;
  };
}

/**
 * 战斗管理器接口
 */
export interface CombatManager {
  /**
   * 开始战斗
   * @param player 玩家
   * @param enemy 敌人
   * @param location 战斗地点
   */
  startCombat(player: CombatParticipant, enemy: CombatParticipant, location: Location): void;
  
  /**
   * 执行玩家回合
   */
  executePlayerTurn(): void;
  
  /**
   * 执行敌人回合
   */
  executeEnemyTurn(): void;
  
  /**
   * 结束战斗
   */
  endCombat(): CombatResult;
  
  /**
   * 获取当前战斗状态
   */
  getCombatStatus(): CombatStatus;
  
  /**
   * 获取当前战斗结果
   */
  getCombatResult(): CombatResult | null;
  
  /**
   * 获取战斗记录
   */
  getCombatLog(): string[];
}
