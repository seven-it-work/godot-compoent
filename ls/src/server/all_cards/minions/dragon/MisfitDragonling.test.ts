import { BattleController } from '@/server/controller/BattleController';
import { Player } from '@/server/controller/entity/Player';
import { Tavern } from '@/server/controller/entity/Tavern';
import { cloneDeep } from 'lodash';
import { beforeEach, describe, expect, it } from 'vitest';
import { MisfitDragonling } from './MisfitDragonling';

describe('MisfitDragonling 测试', () => {
  let misfitDragonling: MisfitDragonling;
  let player: Player;
  let enemy: Player;

  beforeEach(() => {
    // 初始化真实对象
    misfitDragonling = new MisfitDragonling();
    // 玩家初始化
    player = new Player();
    player.tavern = new Tavern();
    player.tavern.level = 2;
    player.name = '玩家007';
    // 敌人初始化
    enemy = new Player();
    enemy.tavern = new Tavern();
    enemy.tavern.level = 1;
    enemy.name = '敌人';
  });

  it('测试 MisfitDragonling 战斗开始时效果', () => {
    // 初始攻击力和生命值
    expect(misfitDragonling.getAttack(player)).toBe(2);
    expect(misfitDragonling.getHealth(player)).toBe(1);

    // 触发战斗开始时的效果
    misfitDragonling.战斗开始时(player);

    // 验证攻击力和生命值增加
    expect(misfitDragonling.getAttack(player)).toBe(4);
    expect(misfitDragonling.getHealth(player)).toBe(3);
  });

  it('测试 MisfitDragonling VS MisfitDragonling 战斗场景', () => {
    const battleController = new BattleController();
    player.添加随从到战场(cloneDeep(misfitDragonling));
    enemy.添加随从到战场(cloneDeep(misfitDragonling));
    const result = battleController.performBattle(player, enemy);
    console.log(result);
    console.log(player.battleLogs);
  });

  it('测试 MisfitDragonling 与其他随从战斗', () => {
    const battleController = new BattleController();
    const anotherMinion = new MisfitDragonling();
    anotherMinion.attack = 1;
    anotherMinion.health = 1;

    player.添加随从到战场(cloneDeep(misfitDragonling));
    enemy.添加随从到战场(anotherMinion);

    const result = battleController.performBattle(player, enemy);

    // 验证战斗正常结束
    expect(result.isSuccess()).toBe(true);
  });
});
