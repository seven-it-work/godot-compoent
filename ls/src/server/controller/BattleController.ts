import lodash from 'lodash';
import db_card from '../db/db_card';
import { Minion } from './entity/Minion';
import type { Player } from './entity/Player';
import { Result, ResultFactory } from './entity/Result';

export class BattleController {
  /**
   * 进行战斗
   */
  performBattle(player: Player, enemy: Player): Result {
    // 初始化战斗
    this.initializeBattle(player, enemy);
    // 确定先手方
    const firstAttacker = this.determineFirstAttacker(player, enemy);
    // 记录先手方和双方初始随从列表
    player.addBattleLog(`【战斗开始】先手方：${firstAttacker.name}`);
    player.战斗开始时();
    enemy.战斗开始时();

    // 当前攻击方
    let currentAttacker = firstAttacker;
    let currentDefender = firstAttacker === player ? enemy : player;

    // 战斗循环
    let round = 1;
    const maxRound = 10;
    while (true) {
      player.addBattleLog(`--- 战斗回合 ${round} 开始 ---`);
      enemy.addBattleLog(`--- 战斗回合 ${round} 开始 ---`);
      // 检查战斗是否结束
      if (this.checkBattleEnd(player, enemy)) {
        break;
      }
      // 获取可攻击的随从
      const 攻击的随从 = this.getAttackMinion(currentAttacker);
      if (!攻击的随从) {
        // 切换攻击方
        [currentAttacker, currentDefender] = [currentDefender, currentAttacker];
        round++;
        continue;
      }
      // todo如果有风怒就重复下面的方法
      // 获取攻击目标
      const 被攻击的随从 = this.getAttackTarget(currentDefender);
      if (被攻击的随从) {
        // 执行攻击
        this.executeAttack(攻击的随从, 被攻击的随从, currentAttacker, currentDefender);
      }
      // 攻击结束

      // 切换攻击方
      [currentAttacker, currentDefender] = [currentDefender, currentAttacker];
      round++;
      if (round > maxRound) {
        console.error('战斗进入无限循环，已中断');
        break;
      }
    }
    // 返回战斗结果
    return ResultFactory.success('');
  }

  /**
   * 初始化战斗
   */
  private initializeBattle(player: Player, enemy: Player): void {
    player.战斗开始前初始化();
    enemy.战斗开始前初始化();
  }

  /**
   * 确定先手方
   */
  private determineFirstAttacker(player: Player, enemy: Player): Player {
    // 计算双方随从数量
    const playerMinionCount = player
      .getMinionsOnBattlefield()
      .filter(m => m !== undefined && m !== null).length;
    const enemyMinionCount = enemy
      .getMinionsOnBattlefield()
      .filter(m => m !== undefined && m !== null).length;

    // 随从数量多的为先手
    if (playerMinionCount > enemyMinionCount) {
      return player;
    } else if (enemyMinionCount > playerMinionCount) {
      return enemy;
    }

    // 数量相同，随机先手
    return Math.random() > 0.5 ? player : enemy;
  }

  /**
   * 检查战斗是否结束
   */
  private checkBattleEnd(player: Player, enemy: Player): boolean {
    // 条件1：如果双方任意一方没有随从，战斗结束
    const playerMinionCount = player.minionsInBattle.filter(
      m => m !== undefined && m !== null
    ).length;
    const enemyMinionCount = enemy.minionsInBattle.filter(
      m => m !== undefined && m !== null
    ).length;
    if (playerMinionCount === 0 || enemyMinionCount === 0) {
      return true;
    }

    // 条件2：如果双方攻击力总和都为0，战斗结束
    const playerTotalAttack = this.calculateTotalAttack(player.getMinionsOnBattlefield());
    const enemyTotalAttack = this.calculateTotalAttack(enemy.getMinionsOnBattlefield());

    return playerTotalAttack === 0 && enemyTotalAttack === 0;
  }

  /**
   * 计算随从数组的总攻击力
   */
  private calculateTotalAttack(minions: (Minion | undefined)[]): number {
    const validMinions = minions.filter(m => m !== undefined && m !== null) as Minion[];
    return validMinions.reduce((sum, minion) => sum + minion.getAttack(), 0);
  }

  /**
   * 获取可攻击的随从
   */
  private getAttackMinion(player: Player): Minion | null {
    let currentIndex = player.currentFightingMinionIndex;
    let 是否重置过了 = false;
    while (true) {
      if (currentIndex >= player.minionsInBattle.length) {
        if (是否重置过了) {
          // 没有任何随从可以选择了
          return null;
        }
        // 重置索引，从第一个随从开始
        currentIndex = 0;
        player.minionsInBattle.forEach(minion => {
          if (minion !== undefined && minion !== null) {
            minion.hasAttacked = false;
          }
        });
        是否重置过了 = true;
        continue;
      }
      const minion = player.minionsInBattle[currentIndex];
      if (minion === undefined || minion === null) {
        currentIndex += 1;
        continue;
      }
      if (minion.getAttack() <= 0) {
        currentIndex += 1;
        continue;
      }
      if (minion.hasAttacked) {
        currentIndex += 1;
        continue;
      }

      return minion;
    }
  }

  /**
   * 获取攻击目标
   */
  private getAttackTarget(defenderPlayer: Player): Minion | null {
    // 获取敌方随从列表
    const enemyMinions = defenderPlayer.minionsInBattle
      .filter(m => m !== undefined && m !== null)
      .filter(m => m.getHealth() > 0);
    if (enemyMinions.length === 0) {
      return null;
    }

    // 1. 收集所有有嘲讽且可攻击的随从（非潜行）
    const tauntMinions: Minion[] = [];
    for (const minion of enemyMinions) {
      if (minion.hasKeyword('TAUNT') && !minion.hasKeyword('STEALTH')) {
        tauntMinions.push(minion);
      }
    }

    // 2. 如果有嘲讽随从，随机选择一个
    if (tauntMinions.length > 0) {
      return lodash.sample(tauntMinions) || null;
    }

    // 3. 如果没有嘲讽随从，收集所有可攻击的敌方随从（非潜行）
    const validTargets: Minion[] = [];
    for (const minion of enemyMinions) {
      if (!minion.hasKeyword('STEALTH')) {
        validTargets.push(minion);
      }
    }

    if (validTargets.length === 0) {
      return null;
    }
    // 4. 随机选择一个目标
    return lodash.sample(validTargets) || null;
  }

  /**
   * 执行攻击
   */
  private executeAttack(
    攻击的随从: Minion,
    被攻击的随从: Minion,
    攻击者的玩家: Player,
    被攻击的随从的玩家: Player
  ): void {
    const attackLog = `【${攻击者的玩家.name}】的【${攻击的随从.getBattleLogStr()}】对【${被攻击的随从的玩家.name}的${被攻击的随从.getBattleLogStr()}】进行攻击`;
    攻击者的玩家.addBattleLog(attackLog);
    被攻击的随从的玩家.addBattleLog(attackLog);

    // 获取攻击力
    const attackerDamage = 攻击的随从.getAttack();
    const targetDamage = 被攻击的随从.getAttack();
    // 处理被攻击者伤害
    this.handleDamage(攻击的随从, 被攻击的随从, 攻击者的玩家, 被攻击的随从的玩家, attackerDamage);
    // 处理攻击者反伤
    this.handleDamage(被攻击的随从, 攻击的随从, 被攻击的随从的玩家, 攻击者的玩家, targetDamage);
    // 标记攻击者为已攻击
    攻击的随从.hasAttacked = true;
  }

  /**
   * 处理伤害
   */
  private handleDamage(
    攻击的随从: Minion,
    被攻击的随从: Minion,
    攻击者的玩家: Player,
    被攻击的随从的玩家: Player,
    伤害: number
  ): void {
    // 检查圣盾效果
    if (被攻击的随从.hasKeyword('DIVINE_SHIELD')) {
      // 圣盾吸收所有伤害
      被攻击的随从.removeKeyword('DIVINE_SHIELD');
      const divineShieldLog = `【${被攻击的随从的玩家.name}】的【${被攻击的随从.getBattleLogStr()}】【圣盾被打破】【吸收了${伤害}点伤害】`;
      被攻击的随从的玩家.addBattleLog(divineShieldLog);
      攻击者的玩家.addBattleLog(divineShieldLog);
      return;
    }
    // 计算伤害
    const originalHealth = 被攻击的随从.getHealth();
    if (originalHealth <= 0) {
      // 生命值小于0 无法再减去伤害了
      return;
    }
    被攻击的随从.fightHealth -= 伤害;
    // 记录伤害日志
    const damageLog = `【${被攻击的随从的玩家.name}】的【${被攻击的随从.getBattleLogStr()}】受到${伤害}点伤害，生命值从${originalHealth}降至${被攻击的随从.getHealth()}`;
    被攻击的随从的玩家.addBattleLog(damageLog);
    攻击者的玩家.addBattleLog(damageLog);

    // 处理死亡
    if (被攻击的随从.getHealth() <= 0) {
      this.handleDeath(攻击的随从, 被攻击的随从, 攻击者的玩家, 被攻击的随从的玩家);
    }
  }

  /**
   * 处理死亡
   */
  private handleDeath(
    攻击的随从: Minion,
    被攻击的随从: Minion,
    攻击随从的玩家: Player,
    被攻击的随从的玩家: Player
  ): void {
    // 先删除被攻击的随从
    const minionIndex = 被攻击的随从的玩家.getMinionIndexOnBattlefield(被攻击的随从);
    if (minionIndex === -1) {
      throw new Error(`无法找到随从 ${被攻击的随从.strId} 在 ${被攻击的随从的玩家.name} 的战场上`);
    } else {
      const logStr = `【${被攻击的随从的玩家.name}】的【${被攻击的随从.getBattleLogStr()}】死亡`;
      被攻击的随从的玩家.addBattleLog(logStr);
      攻击随从的玩家.addBattleLog(logStr);
      被攻击的随从的玩家.minionsInBattle[minionIndex] = undefined;
    }
    // 触发亡语
    this.handleDeathrattle(攻击的随从, 被攻击的随从, 攻击随从的玩家, 被攻击的随从的玩家);
    // 处理复生效果
    if (被攻击的随从.hasKeyword('REBORN')) {
      const rebornCard = db_card.getCardByStrId(被攻击的随从.strId) as Minion;
      if (!rebornCard) {
        throw new Error(`无法找到随从 ${被攻击的随从.strId} 的卡牌信息`);
      }
      // 移除复生关键词
      rebornCard.removeKeyword('REBORN');
      // 恢复1点生命值
      rebornCard.fightHealth = 1;
      const logStr = `【${被攻击的随从的玩家.name}】的【${rebornCard.getBattleLogStr()}】复生`;
      被攻击的随从的玩家.addBattleLog(logStr);
      攻击随从的玩家.addBattleLog(logStr);
      被攻击的随从的玩家.添加随从到战场(rebornCard, minionIndex + 1);
      return;
    }
  }

  /**
   * 处理亡语
   */
  private handleDeathrattle(
    攻击的随从: Minion,
    被攻击的随从: Minion,
    攻击随从的玩家: Player,
    被攻击的随从的玩家: Player
  ): void {
    // 检查是否有亡语效果
    if (被攻击的随从.hasEffectKeyword('DEATHRATTLE')) {
      const deathrattleLog = `【${被攻击的随从的玩家.name}】的【${被攻击的随从.getBattleLogStr()}】亡语触发：${被攻击的随从.textFormat(被攻击的随从的玩家)}`;
      攻击随从的玩家.addBattleLog(deathrattleLog);
      被攻击的随从的玩家.addBattleLog(deathrattleLog);

      // 调用亡语方法，传递敌方玩家参数，以便添加日志
      被攻击的随从.deathrattle(攻击的随从, 被攻击的随从的玩家);
    }
  }

  /**
   * 计算战斗结果
   */
  private calculateBattleResult(player: Player, enemy: Player): any {
    // 计算剩余随从数量
    const playerMinionsLeft = player.minionsInBattle.filter(
      m => m !== undefined && m !== null
    ).length;
    const enemyMinionsLeft = enemy.minionsInBattle.filter(
      m => m !== undefined && m !== null
    ).length;

    // 确定胜利者
    let winner: 'player' | 'enemy' | 'draw';
    if (playerMinionsLeft > enemyMinionsLeft) {
      winner = 'player';
    } else if (enemyMinionsLeft > playerMinionsLeft) {
      winner = 'enemy';
    } else {
      winner = 'draw';
    }

    return {
      winner,
      playerMinionsLeft,
      enemyMinionsLeft,
    };
  }
}
