import { Player } from './Player';
import { Minion, MinionKeyword } from './Minion';

// 战斗结果接口
export interface BattleResult {
  winner: Player;
  loser: Player;
  damageDealt: number;
  winnerMinionsLeft: number;
  loserMinionsLeft: number;
}

// 战斗系统类
export class BattleSystem {
  // 执行战斗
  static executeBattle(player1: Player, player2: Player): BattleResult {
    // 复制玩家的随从，避免修改原始数据
    const player1Minions = player1.minions.map(minion => minion.clone());
    const player2Minions = player2.minions.map(minion => minion.clone());

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
      loserMinionsLeft
    };
  }

  // 执行一轮攻击
  private static executeAttackRound(attackers: Minion[], defenders: Minion[]): void {
    // 遍历所有攻击者，执行攻击
    for (let i = 0; i < attackers.length; i++) {
      const attacker = attackers[i];
      
      // 如果攻击者已经死亡，跳过
      if (attacker.health <= 0) {
        continue;
      }

      // 检查攻击者是否可以攻击
      if (attacker) {
        const canAttack = attacker.hasAttacked < 1;
        const hasWindfury = attacker.keywords.includes(MinionKeyword.WINDFURY as any);
        const hasSuperWindfury = attacker.keywords.includes(MinionKeyword.SUPER_WINDFURY as any);
        
        if (!hasWindfury && !hasSuperWindfury && attacker.hasAttacked >= 1) {
          continue;
        }
        
        if (hasWindfury && attacker.hasAttacked >= 2) {
          continue;
        }
        
        if (hasSuperWindfury && attacker.hasAttacked >= 4) {
          continue;
        }
      } else {
        continue;
      }

      // 找到目标随从（优先攻击有嘲讽的随从）
      const targetIndex = this.findTarget(defenders);
      if (targetIndex === -1 || !attacker) {
        break;
      }

      const defender = defenders[targetIndex];
      if (!defender) {
        break;
      }
      
      // 执行攻击
      this.executeAttack(attacker, defender);
      
      // 增加攻击次数
      attacker.hasAttacked++;
      

      // 如果目标死亡，从防御者列表中移除
      if (defender.health <= 0) {
        defenders.splice(targetIndex, 1);
      }
    }
  }

  // 执行单个攻击
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

  // 找到攻击目标
  private static findTarget(defenders: Minion[]): number {
    // 优先攻击有嘲讽的随从
    const tauntMinions = defenders.filter((minion, index) => {
      return minion.keywords.includes(MinionKeyword.TAUNT);
    });

    if (tauntMinions.length > 0) {
      // 随机选择一个嘲讽随从
      const randomIndex = Math.floor(Math.random() * tauntMinions.length);
      return defenders.indexOf(tauntMinions[randomIndex]);
    } else {
      // 随机选择一个随从
      if (defenders.length > 0) {
        return Math.floor(Math.random() * defenders.length);
      } else {
        return -1;
      }
    }
  }

  // 计算伤害
  private static calculateDamage(winnerMinionsLeft: number): number {
    if (winnerMinionsLeft === 0) {
      return 1;
    }
    return winnerMinionsLeft;
  }
}