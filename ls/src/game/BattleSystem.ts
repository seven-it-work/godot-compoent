import { Player } from './Player';

import { Minion, MinionKeyword } from './Minion';

/**

 * 战斗结果接口 - 定义战斗结束后的结果数据结构

 */

export interface BattleResult {
  winner: Player; // 获胜玩家

  loser: Player; // 失败玩家

  damageDealt: number; // 失败玩家受到的伤害

  winnerMinionsLeft: number; // 获胜玩家剩余的随从数量

  loserMinionsLeft: number; // 失败玩家剩余的随从数量
}

/**

 * 战斗系统类 - 负责处理玩家之间的战斗逻辑

 */

export class BattleSystem {
  /**

   * 执行战斗 - 处理两个玩家之间的战斗，直到一方没有随从

   * @param player1 - 第一个玩家实例

   * @param player2 - 第二个玩家实例

   * @returns 战斗结果对象，包含获胜者、失败者、伤害值和剩余随从数量

   * @使用方式：当游戏进入战斗阶段时，游戏管理器调用此方法来执行玩家之间的战斗

   */

  static executeBattle(player1: Player, player2: Player): BattleResult {
    // 复制玩家的随从，避免修改原始数据，只保留非null的随从

    const player1Minions = player1.minions

      .filter((minion): minion is Minion => minion !== null)

      .map(minion => minion.clone());

    const player2Minions = player2.minions

      .filter((minion): minion is Minion => minion !== null)

      .map(minion => minion.clone());

    // 战斗回合，直到一方没有随从

    while (player1Minions.length > 0 && player2Minions.length > 0) {
      // 玩家1的随从攻击玩家2的随从

      this.executeAttackRound(player1Minions, player2Minions);

      // 如果玩家2还有随从，玩家2的随从攻击玩家1的随从

      if (player2Minions.length > 0) {
        this.executeAttackRound(player2Minions, player1Minions);
      }
    }

    // 计算战斗结果

    let winner: Player;

    let loser: Player;

    let winnerMinionsLeft: number;

    let loserMinionsLeft: number;

    if (player1Minions.length > 0) {
      winner = player1;

      loser = player2;

      winnerMinionsLeft = player1Minions.length;

      loserMinionsLeft = player2Minions.length;
    } else {
      winner = player2;

      loser = player1;

      winnerMinionsLeft = player2Minions.length;

      loserMinionsLeft = player1Minions.length;
    }

    // 计算伤害

    const damageDealt = this.calculateDamage(winnerMinionsLeft);

    // 返回战斗结果

    return {
      winner,

      loser,

      damageDealt,

      winnerMinionsLeft,

      loserMinionsLeft,
    };
  }

  /**

   * 执行一轮攻击 - 处理一组攻击者对一组防御者的攻击

   * @param attackers - 攻击者随从数组

   * @param defenders - 防御者随从数组

   * @private - 内部方法，仅供战斗系统使用

   */

  private static executeAttackRound(attackers: Minion[], defenders: Minion[]): void {
    // 遍历所有攻击者，执行攻击

    for (let i = 0; i < attackers.length; i++) {
      const attacker = attackers[i];

      // 如果攻击者不存在或已经死亡，跳过

      if (!attacker || attacker.health <= 0) {
        continue;
      }

      // 检查攻击者是否可以攻击

      const hasWindfury = attacker.keywords.includes(MinionKeyword.WINDFURY as any);

      const hasSuperWindfury = attacker.keywords.includes(MinionKeyword.SUPER_WINDFURY as any);

      // 普通随从每回合只能攻击一次

      if (!hasWindfury && !hasSuperWindfury && attacker.hasAttacked) {
        continue;
      }

      // 找到目标随从（优先攻击有嘲讽的随从）

      const targetIndex = this.findTarget(defenders);

      if (targetIndex === -1) {
        break;
      }

      const defender = defenders[targetIndex];

      if (!defender) {
        break;
      }

      // 执行攻击

      this.executeAttack(attacker, defender);

      // 设置攻击状态为已攻击

      attacker.hasAttacked = true;

      // 如果目标死亡，从防御者列表中移除

      if (defender.health <= 0) {
        defenders.splice(targetIndex, 1);
      }
    }
  }

  /**

   * 执行单个攻击 - 处理两个随从之间的攻击和反击逻辑

   * @param attacker - 攻击者随从实例

   * @param defender - 防御者随从实例

   * @private - 内部方法，仅供战斗系统使用

   */

  private static executeAttack(attacker: Minion, defender: Minion): void {
    // 检查攻击者是否有毒

    if (attacker.keywords.includes(MinionKeyword.POISONOUS)) {
      // 有毒直接消灭目标

      defender.health = 0;
    } else {
      // 检查防御者是否有神圣护盾

      if (defender.hasDivineShield) {
        // 神圣护盾抵消一次伤害

        defender.hasDivineShield = false;
      } else {
        // 造成伤害

        defender.health -= attacker.attack;
      }
    }

    // 检查防御者是否死亡，如果没有死亡且有攻击能力，反击

    if (defender.health > 0) {
      // 检查防御者是否有毒

      if (defender.keywords.includes(MinionKeyword.POISONOUS)) {
        // 有毒直接消灭攻击者

        attacker.health = 0;
      } else {
        // 检查攻击者是否有神圣护盾

        if (attacker.hasDivineShield) {
          // 神圣护盾抵消一次伤害

          attacker.hasDivineShield = false;
        } else {
          // 造成伤害

          attacker.health -= defender.attack;
        }
      }
    }
  }

  /**

   * 找到攻击目标 - 根据随从属性选择合适的攻击目标

   * @param defenders - 防御者随从数组

   * @returns 选择的目标索引，如果没有合适目标则返回-1

   * @private - 内部方法，仅供战斗系统使用

   */

  private static findTarget(defenders: Minion[]): number {
    // 优先攻击有嘲讽的随从

    const tauntMinions = defenders.filter(minion => {
      return minion.keywords.includes(MinionKeyword.TAUNT);
    });

    if (tauntMinions.length > 0) {
      // 随机选择一个嘲讽随从

      const randomIndex = Math.floor(Math.random() * tauntMinions.length);

      const targetMinion = tauntMinions[randomIndex];

      if (targetMinion) {
        return defenders.indexOf(targetMinion);
      }

      return -1;
    } else {
      // 随机选择一个随从

      if (defenders.length > 0) {
        return Math.floor(Math.random() * defenders.length);
      } else {
        return -1;
      }
    }
  }

  /**

   * 计算伤害 - 根据获胜方剩余随从数量计算对失败者造成的伤害

   * @param winnerMinionsLeft - 获胜方剩余的随从数量

   * @returns 对失败者造成的伤害值

   * @private - 内部方法，仅供战斗系统使用

   */

  private static calculateDamage(winnerMinionsLeft: number): number {
    if (winnerMinionsLeft === 0) {
      return 1; // 如果双方都没有随从，造成1点伤害
    }

    return winnerMinionsLeft; // 否则，伤害值等于获胜方剩余的随从数量
  }
}
