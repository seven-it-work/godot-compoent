import { BattleController } from '@/server/controller/BattleController';
import { Player } from '@/server/controller/entity/Player';
import db_card from '@/server/db/db_card';
import { beforeEach, describe, expect, it } from 'vitest';
import { ImpulsiveTrickster } from './ImpulsiveTrickster';

// 必须添加，否则会报错
db_card.dbInit();

describe('ImpulsiveTrickster 测试', () => {
  // 这个是测试的随从
  let impulsiveTrickster: ImpulsiveTrickster;
  // 玩家
  let player: Player;
  // 敌人
  let enemy: Player;
  // 战斗类
  let battleController: BattleController;

  beforeEach(() => {
    // 初始化真实对象
    impulsiveTrickster = new ImpulsiveTrickster();
    player = new Player();
    player.name = 'Test Player';
    enemy = new Player();
    enemy.name = 'Enemy Player';
    battleController = new BattleController();
  });

  /**
   * 随从战斗测试用例
   * 用例命名：随从名+战场测试用例
   */
  it('躁动欺诈者战场测试用例', () => {
    // 添加躁动欺诈者到我方战场
    player.添加随从到战场(impulsiveTrickster);
    player.添加随从到战场(impulsiveTrickster.copy());

    // 添加敌人随从，触发战斗
    enemy.添加随从到战场(impulsiveTrickster.copy());
    enemy.添加随从到战场(impulsiveTrickster.copy());

    // 进行战斗
    const result = battleController.performBattle(player, enemy);

    // 验证战斗正常结束
    expect(result.isSuccess()).toBe(true);

    // 输出战斗的日志
    console.log('--------躁动欺诈者战场测试用例----------', player.battleLogs);

    // 验证战斗日志中包含亡语触发的信息
    const hasDeathrattle = player.battleLogs.some(
      log => log.includes('亡语') && log.includes('躁动欺诈者')
    );
    expect(hasDeathrattle).toBe(true);
  });
});
