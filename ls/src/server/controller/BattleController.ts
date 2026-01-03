import type { Player } from './entity/Player';
import { Minion } from './entity/Minion';
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

    // 记录先手方日志
    const firstAttackerName = firstAttacker === player ? '玩家' : '敌方';
    player.addBattleLog(`战斗开始：玩家 vs 敌方`);
    player.addBattleLog(`先手方：${firstAttackerName}`);
    enemy.addBattleLog(`战斗开始：玩家 vs 敌方`);
    enemy.addBattleLog(`先手方：${firstAttackerName}`);

    // 当前攻击方
    let currentAttacker = firstAttacker;
    let currentDefender = firstAttacker === player ? enemy : player;

    // 战斗循环
    let round = 1;
    while (!this.checkBattleEnd(player, enemy)) {
      player.addBattleLog(`\n--- 回合 ${round} 开始 ---`);
      enemy.addBattleLog(`\n--- 回合 ${round} 开始 ---`);

      // 获取可攻击的随从
      const attackerMinion = this.getAttackMinion(currentAttacker);
      if (!attackerMinion) {
        // 切换攻击方
        [currentAttacker, currentDefender] = [currentDefender, currentAttacker];
        round++;
        continue;
      }

      // 获取攻击目标
      const target = this.getAttackTarget(attackerMinion, currentAttacker, currentDefender);
      if (target) {
        // 执行攻击
        this.executeAttack(attackerMinion, target, currentAttacker, currentDefender, player);
      }

      // 切换攻击方
      [currentAttacker, currentDefender] = [currentDefender, currentAttacker];
      round++;
    }

    // 计算战斗结果
    const result = this.calculateBattleResult(player, enemy);

    // 记录战斗结束日志
    player.addBattleLog(`\n========================================`);
    player.addBattleLog(
      `战斗结束：${result.winner === 'player' ? '玩家胜利' : result.winner === 'enemy' ? '敌方胜利' : '平局'}`
    );
    player.addBattleLog(
      `剩余随从：玩家 ${result.playerMinionsLeft} / 敌方 ${result.enemyMinionsLeft}`
    );
    player.addBattleLog(`========================================`);

    enemy.addBattleLog(`\n========================================`);
    enemy.addBattleLog(
      `战斗结束：${result.winner === 'player' ? '敌方胜利' : result.winner === 'enemy' ? '玩家胜利' : '平局'}`
    );
    enemy.addBattleLog(
      `剩余随从：玩家 ${result.enemyMinionsLeft} / 敌方 ${result.playerMinionsLeft}`
    );
    enemy.addBattleLog(`========================================`);

    // 返回战斗结果
    return ResultFactory.success(result);
  }

  /**
   * 初始化战斗
   */
  private initializeBattle(player: Player, enemy: Player): void {
    // 清空之前的战斗日志
    player.battleLogs = [];
    enemy.battleLogs = [];

    // 复制战场随从到战斗随从数组
    player.minionsInBattle = [...player.minionsOnBattlefield];
    enemy.minionsInBattle = [...enemy.minionsOnBattlefield];

    // 初始化战斗状态
    player.isInBattle = true;
    enemy.isInBattle = true;

    // 重置随从的攻击状态
    this.resetMinionAttackStatus(player);
    this.resetMinionAttackStatus(enemy);
  }

  /**
   * 重置随从的攻击状态
   */
  private resetMinionAttackStatus(player: Player): void {
    player.minionsInBattle.forEach(minion => {
      if (minion && minion instanceof Minion) {
        // @ts-ignore - 添加hasAttacked属性用于跟踪攻击状态
        minion.hasAttacked = false;
      }
    });
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
    // 获取有效的随从
    const validMinions = player.minionsInBattle.filter(
      m => m !== undefined && m !== null
    ) as Minion[];
    if (validMinions.length === 0) {
      return null;
    }

    // 查找可攻击的随从
    for (const minion of validMinions) {
      // 检查攻击力是否>0
      if (minion.getAttack() <= 0) {
        continue;
      }

      // @ts-ignore - 检查是否已攻击过
      if (minion.hasAttacked) {
        continue;
      }

      return minion;
    }

    // 所有随从都已攻击过，重置攻击状态
    validMinions.forEach(minion => {
      // @ts-ignore
      minion.hasAttacked = false;
    });

    // 再次查找可攻击的随从
    for (const minion of validMinions) {
      if (minion.getAttack() > 0) {
        return minion;
      }
    }

    return null;
  }

  /**
   * 获取攻击目标
   */
  private getAttackTarget(
    attacker: Minion,
    attackerPlayer: Player,
    defenderPlayer: Player
  ): Minion | null {
    // 获取敌方随从列表
    const enemyMinions = defenderPlayer.minionsInBattle.filter(
      m => m !== undefined && m !== null
    ) as Minion[];
    if (enemyMinions.length === 0) {
      return null;
    }

    // 1. 收集所有有嘲讽且可攻击的随从（非潜行、活着）
    const tauntMinions: Minion[] = [];
    for (const minion of enemyMinions) {
      if (minion.hasKeyword('TAUNT') && !minion.hasKeyword('STEALTH')) {
        tauntMinions.push(minion);
      }
    }

    // 2. 如果有嘲讽随从，随机选择一个
    if (tauntMinions.length > 0) {
      const randomIndex = Math.floor(Math.random() * tauntMinions.length);
      return tauntMinions[randomIndex];
    }

    // 3. 如果没有嘲讽随从，收集所有可攻击的敌方随从（非潜行、活着）
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
    const randomIndex = Math.floor(Math.random() * validTargets.length);
    return validTargets[randomIndex];
  }

  /**
   * 执行攻击
   */
  private executeAttack(
    attacker: Minion,
    target: Minion,
    attackerPlayer: Player,
    defenderPlayer: Player,
    player: Player
  ): void {
    // 记录攻击日志
    const attackerName = attackerPlayer === player ? '玩家' : '敌方';
    const defenderName = defenderPlayer === player ? '玩家' : '敌方';
    attackerPlayer.addBattleLog(
      `${attackerName}的${attacker.name}攻击了${defenderName}的${target.name}`
    );
    defenderPlayer.addBattleLog(
      `${attackerName}的${attacker.name}攻击了${defenderName}的${target.name}`
    );

    // 获取攻击力
    const attackerDamage = attacker.getAttack();
    const targetDamage = target.getAttack();

    // 处理被攻击者伤害
    this.handleDamage(target, attackerDamage, defenderPlayer, attackerPlayer);

    // 处理攻击者反伤（如果目标还活着）
    if (target.health > 0) {
      this.handleDamage(attacker, targetDamage, attackerPlayer, defenderPlayer);
    }

    // 标记攻击者为已攻击
    // @ts-ignore
    attacker.hasAttacked = true;
  }

  /**
   * 处理伤害
   */
  private handleDamage(
    minion: Minion,
    damage: number,
    minionPlayer: Player,
    enemyPlayer: Player
  ): void {
    // 检查圣盾效果
    if (minion.hasKeyword('DIVINE_SHIELD')) {
      // 圣盾吸收所有伤害
      minion.removeKeyword('DIVINE_SHIELD');
      minionPlayer.addBattleLog(`${minion.name}的圣盾被打破了！`);
      enemyPlayer.addBattleLog(`${minion.name}的圣盾被打破了！`);
      return;
    }

    // 计算伤害
    const originalHealth = minion.health;
    minion.health = Math.max(0, originalHealth - damage);

    // 记录伤害日志
    minionPlayer.addBattleLog(`${minion.name}受到了${damage}点伤害，剩余生命值: ${minion.health}`);
    enemyPlayer.addBattleLog(`${minion.name}受到了${damage}点伤害，剩余生命值: ${minion.health}`);

    // 处理死亡
    if (minion.health <= 0) {
      this.handleDeath(minion, minionPlayer, enemyPlayer);
    }
  }

  /**
   * 处理死亡
   */
  private handleDeath(minion: Minion, minionPlayer: Player, enemyPlayer: Player): void {
    // 记录死亡日志
    minionPlayer.addBattleLog(`${minion.name}被杀死了！`);
    enemyPlayer.addBattleLog(`${minion.name}被杀死了！`);

    // 处理复生效果
    if (minion.hasKeyword('REBORN')) {
      // 移除复生关键词
      minion.removeKeyword('REBORN');
      // 恢复1点生命值
      minion.health = 1;
      minionPlayer.addBattleLog(`${minion.name}成功复生了！`);
      enemyPlayer.addBattleLog(`${minion.name}成功复生了！`);
      return;
    }

    // 处理亡语
    this.handleDeathrattle(minion, minionPlayer, enemyPlayer);

    // 移除死亡随从
    const index = minionPlayer.minionsInBattle.findIndex(m => m === minion);
    if (index !== -1) {
      minionPlayer.minionsInBattle[index] = undefined;
    }
  }

  /**
   * 处理亡语
   */
  private handleDeathrattle(minion: Minion, minionPlayer: Player, enemyPlayer: Player): void {
    // 检查是否有亡语效果
    if (minion.effectKeywords.includes('DEATHRATTLE')) {
      // 记录亡语日志
      minionPlayer.addBattleLog(`${minion.name}触发了亡语效果！`);
      enemyPlayer.addBattleLog(`${minion.name}触发了亡语效果！`);

      // 调用亡语方法
      minion.deathrattle(minionPlayer);
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
