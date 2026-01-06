import { BattleController } from '@/server/controller/BattleController';
import type { Minion } from '@/server/controller/entity/Minion';
import { Player } from '@/server/controller/entity/Player';
import db_card from '@/server/db/db_card';
import { beforeEach, describe, it } from 'vitest';
import { BuzzingVermin } from './BuzzingVermin';

db_card.dbInit();

describe('BuzzingVermin 测试', () => {
  let buzzingVermin: BuzzingVermin;
  let player: Player;
  let enemy: Player;
  let battleController: BattleController;

  beforeEach(() => {
    // 初始化真实对象
    buzzingVermin = new BuzzingVermin();
    player = new Player();
    player.name = 'Test Player';
    enemy = new Player();
    enemy.name = 'Enemy Player';
    battleController = new BattleController();
  });

  it('应该在战斗中正确触发亡语效果', () => {
    // 将 BuzzingVermin 添加到玩家战场
    player.添加随从到战场(db_card.getCardByStrId(buzzingVermin.strId) as Minion, 0);

    // 将强随从添加到敌方战场
    enemy.添加随从到战场(db_card.getCardByStrId(buzzingVermin.strId) as Minion, 0);

    // 执行战斗
    battleController.performBattle(player, enemy);

    console.log(player.battleLogs);
  });

  it('应该正确处理战斗逻辑', () => {
    // 创建测试用的随从
    const minion1 = new BuzzingVermin();
    const minion2 = new BuzzingVermin();

    // 添加随从到战场
    player.添加随从到战场(minion1, 0);
    enemy.添加随从到战场(minion2, 0);

    // 执行战斗
    battleController.performBattle(player, enemy);
  });
});
