import { BattleController } from '@/server/controller/BattleController';

import type { Minion } from '@/server/controller/entity/Minion';

import { Player } from '@/server/controller/entity/Player';

import db_card from '@/server/db/db_card';

import { beforeEach, describe, expect, it } from 'vitest';

import { HummingBird } from './HummingBird';

await db_card.dbInit();

describe('HummingBird 测试', () => {
  let hummingBird: HummingBird;

  let player: Player;

  let enemy: Player;

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

  it('应该正确初始化 HummingBird 实例', () => {
    expect(hummingBird).toBeInstanceOf(HummingBird);

    expect(hummingBird.attack).toBe(1);

    expect(hummingBird.health).toBe(4);

    expect(hummingBird.minionTypes).toContain('beast');
  });

  it('战斗开始时应该正确增加野兽攻击力加成', () => {
    // 初始 beastBonus 应该为 0

    expect(player.beastBonus.atk).toBe(0);

    // 执行普通版本战斗开始时效果

    hummingBird.isGolden = false;

    hummingBird.战斗开始时(player);

    expect(player.beastBonus.atk).toBe(1);

    // 执行金色版本战斗开始时效果

    hummingBird.isGolden = true;

    hummingBird.战斗开始时(player);

    // 金色版本应该增加2点攻击力

    expect(player.beastBonus.atk).toBe(3);
  });

  it('回合开始时应该正确移除野兽攻击力加成', () => {
    // 设置初始 beastBonus

    player.beastBonus.atk = 2;

    // 执行回合开始时效果

    hummingBird.回合开始时(player);

    expect(player.beastBonus.atk).toBe(1);

    // 再次执行回合开始时效果

    hummingBird.回合开始时(player);

    expect(player.beastBonus.atk).toBe(0);

    // 测试负数值情况

    hummingBird.回合开始时(player);

    expect(player.beastBonus.atk).toBe(-1);
  });

  it('应该正确处理多个 HummingBird 的效果叠加', () => {
    // 初始 beastBonus 应该为 0

    expect(player.beastBonus.atk).toBe(0);

    // 创建多个 HummingBird 实例

    const bird1 = new HummingBird();

    const bird2 = new HummingBird();

    const bird3 = new HummingBird();

    // 所有鸟都是普通版本，每个应该增加1点攻击力

    bird1.isGolden = false;

    bird2.isGolden = false;

    bird3.isGolden = false;

    // 执行所有鸟的战斗开始时效果

    bird1.战斗开始时(player);

    bird2.战斗开始时(player);

    bird3.战斗开始时(player);

    // 应该叠加3点攻击力

    expect(player.beastBonus.atk).toBe(3);

    // 执行所有鸟的回合开始时效果

    bird1.回合开始时(player);

    bird2.回合开始时(player);

    bird3.回合开始时(player);

    // 应该移除3点攻击力

    expect(player.beastBonus.atk).toBe(0);
  });

  it('应该正确区分普通和金色版本的效果', () => {
    // 初始 beastBonus 应该为 0

    expect(player.beastBonus.atk).toBe(0);

    // 普通版本鸟

    const normalBird = new HummingBird();

    normalBird.isGolden = false;

    // 金色版本鸟

    const goldenBird = new HummingBird();

    goldenBird.isGolden = true;

    // 执行普通版本战斗开始时效果

    normalBird.战斗开始时(player);

    expect(player.beastBonus.atk).toBe(1);

    // 执行金色版本战斗开始时效果

    goldenBird.战斗开始时(player);

    // 金色版本应该增加2点攻击力

    expect(player.beastBonus.atk).toBe(3);

    // 执行普通版本回合开始时效果

    normalBird.回合开始时(player);

    expect(player.beastBonus.atk).toBe(2);

    // 执行金色版本回合开始时效果

    goldenBird.回合开始时(player);

    expect(player.beastBonus.atk).toBe(0);
  });

  it('应该在战斗中正确触发效果', () => {
    // 将 HummingBird 添加到玩家战场

    player.添加随从到战场(hummingBird, 0);

    // 将另一个野兽随从添加到玩家战场

    const beastMinion = db_card.getCardByStrId('BG28_603t') as Minion;

    player.添加随从到战场(beastMinion, 1);

    // 将随从添加到敌方战场

    enemy.添加随从到战场(db_card.getCardByStrId(hummingBird.strId) as Minion, 0);

    // 初始 beastBonus 应该为 0

    expect(player.beastBonus.atk).toBe(0);

    // 直接测试战斗开始时效果

    hummingBird.战斗开始时(player);

    // 战斗开始时应该触发效果，增加野兽攻击力

    expect(player.beastBonus.atk).toBe(1);

    // 执行回合开始时效果

    hummingBird.回合开始时(player);

    // 回合开始时应该移除加成

    expect(player.beastBonus.atk).toBe(0);
  });

  it('应该正确处理战斗逻辑', () => {
    // 创建测试用的随从

    const minion1 = new HummingBird();

    const minion2 = new HummingBird();

    // 添加随从到战场

    player.添加随从到战场(minion1, 0);

    enemy.添加随从到战场(minion2, 0);

    // 执行战斗

    battleController.performBattle(player, enemy);
    console.log(player.battleLogs);
  });
});
