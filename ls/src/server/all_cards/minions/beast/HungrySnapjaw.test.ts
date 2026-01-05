import { BattleController } from '@/server/controller/BattleController';
import type { Minion } from '@/server/controller/entity/Minion';
import { Player } from '@/server/controller/entity/Player';
import db_card from '@/server/db/db_card';
import { cloneDeep } from 'lodash';
import { beforeEach, describe, expect, it } from 'vitest';
import { HungrySnapjaw } from './HungrySnapjaw';

await db_card.dbInit();

describe('HungrySnapjaw 测试', () => {
  // 这个是测试的随从
  let hungrySnapjaw: HungrySnapjaw;
  // 玩家
  let player: Player;
  // 敌人
  let enemy: Player;
  // 战斗类
  let battleController: BattleController;

  beforeEach(() => {
    // 初始化真实对象
    hungrySnapjaw = new HungrySnapjaw();
    player = new Player();
    player.name = 'Test Player';
    enemy = new Player();
    enemy.name = 'Enemy Player';
    battleController = new BattleController();
  });

  /**
   * 随从战斗测试用例
   */
  it('饥饿的钳嘴龟战场测试用例', () => {
    const testMinion = player.getCardByStrId('BG26_800') as Minion;
    testMinion.keywords.push('TAUNT');
    // 添加随从到战场
    player.添加随从到战场(cloneDeep(testMinion));
    player.添加随从到战场(cloneDeep(testMinion));
    player.添加随从到战场(hungrySnapjaw);
    enemy.添加随从到战场(cloneDeep(testMinion));
    enemy.添加随从到战场(cloneDeep(testMinion));
    enemy.添加随从到战场(new HungrySnapjaw());
    // 进行战斗
    const result = battleController.performBattle(player, enemy);
    // 验证战斗正常结束
    expect(result.isSuccess()).toBe(true);
    // 判断输赢 (winner为undefined时平局、否则是胜利者Player对象)
    expect(result.data.winner).toBe(undefined);
    // 输出战斗的日志 (命名规则必须参考如下)
    console.log('--------饥饿的钳嘴龟战场测试用例----------', player.battleLogs);
    // 永久加成效果
    expect(hungrySnapjaw.buffs.length > 1).toBe(true);
  });
});
