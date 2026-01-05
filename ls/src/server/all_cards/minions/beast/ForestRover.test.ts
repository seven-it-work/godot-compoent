import { BattleController } from '@/server/controller/BattleController';

import type { Minion } from '@/server/controller/entity/Minion';

import { Player } from '@/server/controller/entity/Player';

import db_card from '@/server/db/db_card';

import { beforeEach, describe, expect, it } from 'vitest';

import { ForestRover } from './ForestRover';

await db_card.dbInit();

describe('ForestRover 测试', () => {
  let forestRover: ForestRover;

  let player: Player;

  let enemy: Player;

  let battleController: BattleController;

  beforeEach(() => {
    // 初始化真实对象

    forestRover = new ForestRover();

    player = new Player();

    player.name = 'Test Player';

    enemy = new Player();

    enemy.name = 'Enemy Player';

    battleController = new BattleController();
  });

  it('应该正确初始化 ForestRover 实例', () => {
    expect(forestRover).toBeInstanceOf(ForestRover);

    expect(forestRover.attack).toBe(3);

    expect(forestRover.health).toBe(2);

    expect(forestRover.minionTypes).toContain('beast');

    expect(forestRover.effectKeywords).toContain('BATTLECRY');

    expect(forestRover.effectKeywords).toContain('DEATHRATTLE');
  });

  it('getTextFormatArr 方法应该返回正确的数值', () => {
    // 测试默认 beetleBonus

    let result = forestRover.getTextFormatArr(player);

    expect(result).toEqual(['1', '1']);

    // 测试带有 beetleBonus 的情况

    player.beetleBonus = { atk: 2, hp: 3 };

    result = forestRover.getTextFormatArr(player);

    expect(result).toEqual(['3', '4']);
  });

  it('battlecry 方法应该正确增加玩家的 beetleBonus', () => {
    // 初始 beetleBonus 应该为 0

    expect(player.beetleBonus.atk).toBe(0);

    expect(player.beetleBonus.hp).toBe(0);

    // 执行普通版本战吼

    forestRover.isGolden = false;

    forestRover.battlecry(player);

    expect(player.beetleBonus.atk).toBe(1);

    expect(player.beetleBonus.hp).toBe(1);

    // 执行金色版本战吼

    forestRover.isGolden = true;

    forestRover.battlecry(player);

    expect(player.beetleBonus.atk).toBe(3);

    expect(player.beetleBonus.hp).toBe(3);
  });

  it('deathrattle 方法应该正确召唤甲虫', () => {
    // 设置 beetleBonus

    player.beetleBonus = { atk: 1, hp: 1 };

    // 执行普通版本亡语

    forestRover.isGolden = false;

    forestRover.deathrattle(null as any, player);

    // 召唤1只甲虫，所以战场上应该有1只随从

    expect(player.getMinionsOnBattlefieldCount()).toBe(1);

    // 执行金色版本亡语

    forestRover.isGolden = true;

    forestRover.deathrattle(null as any, player);

    // 再召唤2只甲虫，所以战场上应该有3只随从

    expect(player.getMinionsOnBattlefieldCount()).toBe(3);
  });

  it('应该正确处理 player.beetleBonus 为负数的情况', () => {
    // 测试 beetleBonus 为负数时的行为

    player.beetleBonus = { atk: -1, hp: -1 };

    const result = forestRover.getTextFormatArr(player);

    expect(result).toEqual(['0', '0']);
  });

  it('应该在战斗中正确触发战吼和亡语效果', () => {
    // 将 ForestRover 添加到玩家战场

    player.添加随从到战场(db_card.getCardByStrId(forestRover.strId) as Minion, 0);

    // 将强随从添加到敌方战场

    enemy.添加随从到战场(db_card.getCardByStrId(forestRover.strId) as Minion, 0);

    // 执行战斗

    battleController.performBattle(player, enemy);

    console.log(player.battleLogs);
  });

  it('应该正确处理战斗逻辑', () => {
    // 创建测试用的随从

    const minion1 = new ForestRover();

    const minion2 = new ForestRover();

    // 添加随从到战场

    player.添加随从到战场(minion1, 0);

    enemy.添加随从到战场(minion2, 0);

    // 执行战斗
    battleController.performBattle(player, enemy);
    console.log(player.battleLogs);
  });
});
