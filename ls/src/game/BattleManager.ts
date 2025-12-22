import { Minion, MinionKeyword } from './Minion';



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







 * 战斗管理器类 - 负责处理战斗的核心逻辑







 */



export class BattleManager {

  /**

   * 执行战斗流程

   * @param playerMinions 玩家的随从列表

   * @param enemyMinions 敌方的随从列表

   * @param playerTavernLevel 玩家的酒馆等级

   * @param enemyTavernLevel 敌方的酒馆等级

   * @returns 战斗结果

   */

  static executeBattle(

    playerMinions: any[],

    enemyMinions: any[],

    playerTavernLevel: number = 1,

    enemyTavernLevel: number = 1

  ): BattleResult {

    console.log('开始执行战斗');



    // 复制随从列表，避免修改原数据



    const playerMinionsCopy = [...playerMinions];



    const enemyMinionsCopy = [...enemyMinions];



    // 初始化战斗结果



    const result: BattleResult = {

      winner: 'draw',



      playerHealthChange: 0,



      enemyHealthChange: 0,



      playerMinionsLeft: 0,



      enemyMinionsLeft: 0,

    };



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



    let currentAttacker = playerAttacksFirst ? 'player' : 'enemy';



    let battleRound = 0;



    while (playerMinionCount > 0 && enemyMinionCount > 0 && battleRound < 100) {

      battleRound++;



      console.log(`\n===== 战斗回合 ${battleRound} =====`);



      console.log(`当前攻击者: ${currentAttacker}`);



      if (currentAttacker === 'player') {

        // 玩家随从攻击敌方随从



        this.executePlayerAttacks(playerMinionsCopy, enemyMinionsCopy);

      } else {

        // 敌方随从攻击玩家随从



        this.executeEnemyAttacks(enemyMinionsCopy, playerMinionsCopy);

      }



      // 更新随从数量



      playerMinionCount = playerMinionsCopy.filter(minion => minion !== null).length;



      enemyMinionCount = enemyMinionsCopy.filter(minion => minion !== null).length;



      // 切换攻击者



      currentAttacker = currentAttacker === 'player' ? 'enemy' : 'player';



      console.log(

        `回合结束 - 玩家剩余随从: ${playerMinionCount}, 敌方剩余随从: ${enemyMinionCount}`

      );

    }



    // 计算战斗结果



    result.playerMinionsLeft = playerMinionCount;



    result.enemyMinionsLeft = enemyMinionCount;



    // 如果一方没有随从了，计算对英雄的伤害



    if (playerMinionCount === 0 && enemyMinionCount > 0) {

      // 敌方获胜，计算对玩家英雄的伤害



      const damageToPlayer = this.calculateHeroDamage(enemyMinionsCopy);



      result.winner = 'enemy';



      result.playerHealthChange = -damageToPlayer;



      console.log(`敌方获胜，对玩家造成 ${damageToPlayer} 点伤害`);

    } else if (enemyMinionCount === 0 && playerMinionCount > 0) {

      // 玩家获胜，计算对敌方英雄的伤害



      const damageToEnemy = this.calculateHeroDamage(playerMinionsCopy);



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



    enemyMinions: (Minion | null)[]

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



      // 执行攻击



      this.executeAttack(attacker, target);



      // 标记为已攻击



      attacker.hasAttacked = true;



      // 检查目标是否死亡



      if (target.health <= 0) {

        enemyMinions[targetIndex] = null;



        console.log(`玩家随从 ${attacker.nameCN} 杀死了敌方随从 ${target.nameCN}`);

      }



      // 检查攻击者是否死亡



      if (attacker.health <= 0) {

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



    playerMinions: (Minion | null)[]

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



      // 执行攻击



      this.executeAttack(attacker, target);



      // 标记为已攻击



      attacker.hasAttacked = true;



      // 检查目标是否死亡



      if (target.health <= 0) {

        playerMinions[targetIndex] = null;



        console.log(`敌方随从 ${attacker.nameCN} 杀死了玩家随从 ${target.nameCN}`);

      }



      // 检查攻击者是否死亡



      if (attacker.health <= 0) {

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



  private static executeAttack(attacker: Minion, defender: Minion): void {

    console.log(

      `攻击: ${attacker.nameCN} (${attacker.getAttack()}) -> ${defender.nameCN} (${defender.health})`

    );



    // 1. 检查攻击者是否有圣盾



    if (attacker.hasDivineShield) {

      attacker.hasDivineShield = false;



      console.log(`${attacker.nameCN} 失去了圣盾`);

    } else {

      // 2. 攻击者受到防御者的攻击力伤害



      attacker.health -= defender.getAttack();



      console.log(

        `${attacker.nameCN} 受到了 ${defender.getAttack()} 点伤害，剩余生命值: ${attacker.health}`

      );

    }



    // 3. 检查防御者是否有圣盾



    if (defender.hasDivineShield) {

      defender.hasDivineShield = false;



      console.log(`${defender.nameCN} 失去了圣盾`);

    } else {

      // 4. 防御者受到攻击者的攻击力伤害



      defender.health -= attacker.getAttack();



      console.log(

        `${defender.nameCN} 受到了 ${attacker.getAttack()} 点伤害，剩余生命值: ${defender.health}`

      );

    }

  }



  /**







   * 计算对英雄的伤害







   * @param remainingMinions 剩余的随从列表







   * @returns 对英雄造成的伤害







   */



  private static calculateHeroDamage(remainingMinions: (Minion | null)[]): number {

    // 计算所有剩余随从的攻击力总和



    return remainingMinions.reduce((total, minion) => {

      if (!minion) return total;



      return total + minion.getAttack();

    }, 0);

  }

}

