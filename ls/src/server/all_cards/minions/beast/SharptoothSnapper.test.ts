import { BattleController } from '@/server/controller/BattleController';
import type { Minion } from '@/server/controller/entity/Minion';
import { Player } from '@/server/controller/entity/Player';
import db_card from '@/server/db/db_card';
import { cloneDeep } from 'lodash';
import { beforeEach, describe, expect, it } from 'vitest';
import { SharptoothSnapper } from './SharptoothSnapper';

await db_card.dbInit();

describe('SharptoothSnapper 测试', () => {
  // 这个是测试的随从
  let sharptoothSnapper: SharptoothSnapper;
  // 玩家
  let player: Player;
  // 敌人
  let enemy: Player;
  // 战斗类
  let battleController: BattleController;

  beforeEach(() => {
    // 初始化真实对象
    sharptoothSnapper = new SharptoothSnapper();
    player = new Player();
    player.name = 'Test Player';
    enemy = new Player();
    enemy.name = 'Enemy Player';
    battleController = new BattleController();
  });

  /**
   * 随从战斗测试用例
   */
  it('利牙鲷鱼战场测试用例', () => {
    // 添加1只敌方随从，给食人鱼攻击目标
    const enemyMinion = player.getCardByStrId('BG26_800') as Minion;
    enemy.添加随从到战场(cloneDeep(enemyMinion));

    // 添加利牙鲷鱼到我方战场
    player.添加随从到战场(sharptoothSnapper);

    // 进行战斗
    const result = battleController.performBattle(player, enemy);

    // 验证战斗正常结束
    expect(result.isSuccess()).toBe(true);

    // 输出战斗的日志
    console.log('--------利牙鲷鱼战场测试用例----------', player.battleLogs);

    // 验证战斗日志中包含食人鱼立即攻击的信息
    const hasPiranhaAttack = player.battleLogs.some(
      log => log.includes('食人鱼') && log.includes('进行攻击')
    );
    expect(hasPiranhaAttack).toBe(true);
  });
});
