import { HummingBird } from '@/server/all_cards/minions/beast/HummingBird';
import { BattleController } from '@/server/controller/BattleController';
import { Player } from '@/server/controller/entity/Player';
import db_card from '@/server/db/db_card';
import { beforeEach, describe, expect, it } from 'vitest';

// 必须添加，否则会报错
await db_card.dbInit();

describe('HungrySnapjaw 测试', () => {
  // 这个是测试的随从
  let hummingBird: HummingBird;
  // 玩家
  let player: Player;
  // 敌人
  let enemy: Player;
  // 战斗类
  let battleController: BattleController;
  beforeEach(() => {
    // 初始化真实对象
    hummingBird = new HummingBird();
    player = new Player();
    player.name = 'Test Player';
    enemy = new Player();
    enemy.name = 'Enemy Player';
    battleController = new BattleController();
  });

  /**
   * 随从战斗测试用例
   * 用例命名：随从名+战场测试用例  eg:哼鸣蜂鸟战场测试用例
   */
  it('哼鸣蜂鸟战场测试用例', () => {
    // 添加随从到战场
    player.添加随从到战场(hummingBird);
    enemy.添加随从到战场(new HummingBird());
    // 进行战斗
    const result = battleController.performBattle(player, enemy);
    // 验证战斗正常结束
    expect(result.isSuccess()).toBe(true);
    // 判断输赢 (undefined平局、否则是胜利者Player对象)
    expect(result.data).toBe(undefined);
    // 输出战斗的日志 (命名规则必须参考如下)
    console.log('--------哼鸣蜂鸟战场测试用例----------', player.battleLogs);
  });
});
