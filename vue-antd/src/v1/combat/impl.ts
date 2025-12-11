import { defineStore } from "pinia";
import type {
  CombatManager,
  CombatParticipant,
  CombatResult,
  CombatRound,
} from "./define";
import { CombatStatus } from "./define";
import type { Cultivator } from "@/v1/cultivator/define";
import type { Location } from "@/v1/location/define";
import { ref, reactive } from "vue";
import RandomUtils from "@/v1/utils/RandomUtils";

/**
 * 战斗管理器实现类
 */
export class CombatManagerClass implements CombatManager {
  private combatStatus: CombatStatus = CombatStatus.NOT_STARTED;
  private player: CombatParticipant | null = null;
  private enemy: CombatParticipant | null = null;
  private location: Location | null = null;
  private currentRound: number = 0;
  private rounds: CombatRound[] = [];
  private combatLog: string[] = [];
  private combatResult: CombatResult | null = null;

  /**
   * 开始战斗
   * @param player 玩家
   * @param enemy 敌人
   * @param location 战斗地点
   */
  startCombat(
    player: CombatParticipant,
    enemy: CombatParticipant,
    location: Location
  ): void {
    this.player = player;
    this.enemy = enemy;
    this.location = location;
    this.combatStatus = CombatStatus.IN_PROGRESS;
    this.currentRound = 0;
    this.rounds = [];
    this.combatLog = [];
    this.combatResult = null;

    // 记录战斗开始日志
    this.combatLog.push(
      `战斗开始：${player.name} VS ${enemy.name}（地点：${location.name}）`
    );

    // 开始第一个回合
    this.executeCombatRound();
  }

  /**
   * 执行战斗回合
   */
  private executeCombatRound(): void {
    if (
      this.combatStatus !== CombatStatus.IN_PROGRESS ||
      !this.player ||
      !this.enemy
    ) {
      return;
    }

    this.currentRound++;

    // 执行玩家攻击
    this.executePlayerTurn();

    // 检查敌人是否还活着
    if (!this.isParticipantAlive(this.enemy)) {
      this.endCombatWithVictory();
      return;
    }

    // 执行敌人攻击
    this.executeEnemyTurn();

    // 检查玩家是否还活着
    if (!this.isParticipantAlive(this.player)) {
      this.endCombatWithDefeat();
      return;
    }

    // 如果回合数超过最大限制，判定平局
    if (this.currentRound >= 100) {
      this.endCombatWithDraw();
      return;
    }
  }

  /**
   * 执行玩家回合
   */
  executePlayerTurn(): void {
    if (!this.player || !this.enemy) return;

    // 执行攻击逻辑
    const attackResult = this.calculateAttack(this.player, this.enemy);

    // 应用伤害
    this.applyDamage(this.enemy, attackResult.damage);

    // 创建回合记录
    const round: CombatRound = {
      roundNumber: this.currentRound,
      attacker: this.player,
      defender: this.enemy,
      damage: attackResult.damage,
      isCritical: attackResult.isCritical,
      isHit: attackResult.isHit,
      attackerStatus: {
        hp: this.player.qiBlood.getCurrentValue(),
        spiritPower: this.player.spiritPower.getCurrentValue(),
      },
      defenderStatus: {
        hp: this.enemy.qiBlood.getCurrentValue(),
        spiritPower: this.enemy.spiritPower.getCurrentValue(),
      },
    };

    this.rounds.push(round);

    // 记录战斗日志
    this.recordCombatLog(round);
  }

  /**
   * 执行敌人回合
   */
  executeEnemyTurn(): void {
    if (!this.player || !this.enemy) return;

    // 执行攻击逻辑
    const attackResult = this.calculateAttack(this.enemy, this.player);

    // 应用伤害
    this.applyDamage(this.player, attackResult.damage);

    // 创建回合记录
    const round: CombatRound = {
      roundNumber: this.currentRound,
      attacker: this.enemy,
      defender: this.player,
      damage: attackResult.damage,
      isCritical: attackResult.isCritical,
      isHit: attackResult.isHit,
      attackerStatus: {
        hp: this.enemy.qiBlood.getCurrentValue(),
        spiritPower: this.enemy.spiritPower.getCurrentValue(),
      },
      defenderStatus: {
        hp: this.player.qiBlood.getCurrentValue(),
        spiritPower: this.player.spiritPower.getCurrentValue(),
      },
    };

    this.rounds.push(round);

    // 记录战斗日志
    this.recordCombatLog(round);
  }

  /**
   * 计算攻击结果
   * @param attacker 攻击方
   * @param defender 防御方
   */
  private calculateAttack(
    attacker: CombatParticipant,
    defender: CombatParticipant
  ): {
    damage: number;
    isCritical: boolean;
    isHit: boolean;
  } {
    // 计算命中概率
    const hitChance = this.calculateHitChance(attacker, defender);
    const isHit = RandomUtils.random.real(0, 100) <= hitChance;

    if (!isHit) {
      return { damage: 0, isCritical: false, isHit: false };
    }

    // 计算暴击概率
    const criticalChance = attacker.criticalRate.getCurrentValue();
    const isCritical = RandomUtils.random.real(0, 100) <= criticalChance;

    // 计算基础伤害
    let baseDamage = attacker.attack.getCurrentValue();

    // 应用暴击伤害
    if (isCritical) {
      const criticalMultiplier =
        1 + attacker.criticalDamage.getCurrentValue() / 100;
      baseDamage *= criticalMultiplier;
    }

    // 计算实际伤害（考虑防御）
    const defense = defender.defense.getCurrentValue();
    const damageReduction = defense / (defense + 100);
    const finalDamage = Math.max(
      1,
      Math.floor(baseDamage * (1 - damageReduction))
    );

    return { damage: finalDamage, isCritical, isHit };
  }

  /**
   * 计算命中概率
   * @param attacker 攻击方
   * @param defender 防御方
   */
  private calculateHitChance(
    attacker: CombatParticipant,
    defender: CombatParticipant
  ): number {
    // 基础命中概率
    let hitChance = 80;

    // 考虑闪避率
    const dodgeChance = defender.dodgeRate.getCurrentValue();
    hitChance -= dodgeChance;

    // 确保命中概率在10%-95%之间
    return Math.max(10, Math.min(95, hitChance));
  }

  /**
   * 应用伤害
   * @param participant 参与者
   * @param damage 伤害值
   */
  private applyDamage(participant: CombatParticipant, damage: number): void {
    const currentHp = participant.qiBlood.getCurrentValue();
    const newHp = Math.max(0, currentHp - damage);
    participant.qiBlood.setCurrentValue(newHp);
  }

  /**
   * 检查参与者是否活着
   * @param participant 参与者
   */
  private isParticipantAlive(participant: CombatParticipant): boolean {
    return participant.qiBlood.getCurrentValue() > 0;
  }

  /**
   * 以胜利结束战斗
   */
  private endCombatWithVictory(): void {
    if (!this.player || !this.enemy || !this.location) return;

    this.combatStatus = CombatStatus.PLAYER_VICTORY;
    this.calculateRewards();
    this.combatLog.push(`战斗结束：${this.player.name} 获胜！`);
  }

  /**
   * 以失败结束战斗
   */
  private endCombatWithDefeat(): void {
    if (!this.player || !this.enemy) return;

    this.combatStatus = CombatStatus.PLAYER_DEFEAT;
    this.combatLog.push(`战斗结束：${this.enemy.name} 获胜！`);
  }

  /**
   * 以平局结束战斗
   */
  private endCombatWithDraw(): void {
    this.combatStatus = CombatStatus.DRAW;
    this.combatLog.push(`战斗结束：平局！`);
  }

  /**
   * 计算战斗奖励
   */
  private calculateRewards(): void {
    if (!this.player || !this.enemy) return;

    // 根据敌人等级和强度计算奖励
    const enemyLevel = this.enemy.realmLevel.getCurrentValue();
    const baseExperience = enemyLevel * 100;
    const baseSpiritQi = enemyLevel * 50;

    // 随机物品（简化版，实际可以根据游戏设计扩展）
    const items = [];
    if (RandomUtils.random.bool(0.3)) {
      items.push("低级丹药");
    }
    if (RandomUtils.random.bool(0.1)) {
      items.push("中级丹药");
    }

    // 创建战斗结果
    this.combatResult = {
      status: this.combatStatus,
      participants: {
        player: this.player,
        enemy: this.enemy,
      },
      rounds: this.rounds,
      totalRounds: this.currentRound,
      rewards: {
        experience: baseExperience,
        items: items,
        spiritQi: baseSpiritQi,
      },
    };
  }

  /**
   * 结束战斗
   */
  endCombat(): CombatResult {
    if (this.combatStatus === CombatStatus.IN_PROGRESS) {
      this.combatStatus = CombatStatus.DRAW;
      this.combatLog.push(`战斗提前结束：平局！`);
    }

    if (!this.combatResult && this.player && this.enemy) {
      this.combatResult = {
        status: this.combatStatus,
        participants: {
          player: this.player,
          enemy: this.enemy,
        },
        rounds: this.rounds,
        totalRounds: this.currentRound,
        rewards: {
          experience: 0,
          items: [],
          spiritQi: 0,
        },
      };
    }

    return this.combatResult as CombatResult;
  }

  /**
   * 获取当前战斗状态
   */
  getCombatStatus(): CombatStatus {
    return this.combatStatus;
  }

  /**
   * 获取当前战斗结果
   */
  getCombatResult(): CombatResult | null {
    return this.combatResult;
  }

  /**
   * 获取战斗记录
   */
  getCombatLog(): string[] {
    return this.combatLog;
  }

  /**
   * 记录战斗日志
   * @param round 回合信息
   */
  private recordCombatLog(round: CombatRound): void {
    const attackerName = round.attacker.name;
    const defenderName = round.defender.name;

    if (!round.isHit) {
      this.combatLog.push(
        `第${this.currentRound}回合：${attackerName}攻击未命中${defenderName}`
      );
      return;
    }

    const criticalText = round.isCritical ? "（暴击！）" : "";
    this.combatLog.push(
      `第${this.currentRound}回合：${attackerName}对${defenderName}造成${round.damage}点伤害${criticalText}（${defenderName}剩余${round.defenderStatus.hp}气血）`
    );
  }
}

/**
 * 战斗状态管理Store
 */
export const useCombatStore = defineStore("combat", () => {
  // 战斗管理器实例
  const combatManager = reactive(new CombatManagerClass());

  // 当前战斗状态
  const combatStatus = ref(CombatStatus.NOT_STARTED);

  // 当前战斗结果
  const combatResult = ref<CombatResult | null>(null);

  // 战斗日志
  const combatLog = ref<string[]>([]);

  /**
   * 开始战斗
   * @param player 玩家
   * @param enemy 敌人
   * @param location 战斗地点
   */
  const startCombat = (
    player: Cultivator,
    enemy: Cultivator,
    location: Location
  ) => {
    combatManager.startCombat(player, enemy, location);
    combatStatus.value = combatManager.getCombatStatus();
    combatLog.value = combatManager.getCombatLog();
  };

  /**
   * 结束战斗
   */
  const endCombat = () => {
    const result = combatManager.endCombat();
    combatResult.value = result;
    combatStatus.value = result.status;
    return result;
  };

  /**
   * 获取当前战斗状态
   */
  const getCombatStatus = () => {
    return combatManager.getCombatStatus();
  };

  /**
   * 获取当前战斗结果
   */
  const getCombatResult = () => {
    return combatManager.getCombatResult();
  };

  /**
   * 获取战斗日志
   */
  const getCombatLog = () => {
    return combatManager.getCombatLog();
  };

  return {
    combatManager,
    combatStatus,
    combatResult,
    combatLog,
    startCombat,
    endCombat,
    getCombatStatus,
    getCombatResult,
    getCombatLog,
  };
});
