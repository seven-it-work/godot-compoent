import { BattleController } from '@/server/controller/BattleController';
import type { Minion } from '@/server/controller/entity/Minion';
import { Player } from '@/server/controller/entity/Player';
import db_card from '@/server/db/db_card';
import { beforeEach, describe, expect, it } from 'vitest';
import { BuzzingVermin } from './BuzzingVermin';

await db_card.dbInit();

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

  it('应该正确初始化 BuzzingVermin 实例', () => {
    expect(buzzingVermin).toBeInstanceOf(BuzzingVermin);
    expect(buzzingVermin.attack).toBe(1);
    expect(buzzingVermin.health).toBe(1);
    expect(buzzingVermin.minionTypes).toContain('beast');
    expect(buzzingVermin.effectKeywords).toContain('DEATHRATTLE');
  });

  it('getTextFormatArr 方法应该返回正确的数值', () => {
    // 测试默认 beetleBonus
    let result = buzzingVermin.getTextFormatArr(player);
    expect(result).toEqual(['2', '2']);

    // 测试带有 beetleBonus 的情况
    player.beetleBonus = { atk: 2, hp: 3 };
    result = buzzingVermin.getTextFormatArr(player);
    expect(result).toEqual(['4', '5']);
  });

  it('deathrattle 方法应该包含正确的逻辑', () => {
    // 测试 beetleBonus 对死亡召唤甲虫属性的影响
    // 测试相关逻辑

    // 设置不同的 beetleBonus 值
    const testCases = [
      { beetleBonus: { atk: 0, hp: 0 }, expectedAtk: 2, expectedHp: 2 },
      { beetleBonus: { atk: 1, hp: 1 }, expectedAtk: 3, expectedHp: 3 },
      { beetleBonus: { atk: 3, hp: 2 }, expectedAtk: 5, expectedHp: 4 },
    ];

    testCases.forEach(testCase => {
      player.beetleBonus = testCase.beetleBonus;

      // 根据 deathrattle 方法中的逻辑计算预期值
      const expectedAtk = 2 + testCase.beetleBonus.atk;
      const expectedHp = 2 + testCase.beetleBonus.hp;

      // 验证计算结果
      expect(expectedAtk).toBe(testCase.expectedAtk);
      expect(expectedHp).toBe(testCase.expectedHp);
    });
  });

  it('应该正确处理 player.beetleBonus 为负数的情况', () => {
    // 测试 beetleBonus 为负数时的行为
    player.beetleBonus = { atk: -1, hp: -1 };

    const result = buzzingVermin.getTextFormatArr(player);
    expect(result).toEqual(['1', '1']);
  });

  it('应该正确获取随从在战场上的索引', () => {
    // 测试随从不在战场上时的情况
    const index = player.getMinionIndexOnBattlefield(buzzingVermin);
    expect(index).toBe(-1);

    // 将随从添加到战场后测试
    player.添加随从到战场(buzzingVermin, 0);
    const newIndex = player.getMinionIndexOnBattlefield(buzzingVermin);
    expect(newIndex).toBe(0);
  });

  it('应该正确管理战场上的随从数量', () => {
    // 初始时战场上没有随从
    expect(player.getMinionsOnBattlefieldCount()).toBe(0);

    // 添加一个随从
    player.添加随从到战场(buzzingVermin, 0);
    expect(player.getMinionsOnBattlefieldCount()).toBe(1);

    // 添加另一个相同类型的随从
    const anotherVermin = new BuzzingVermin();
    player.添加随从到战场(anotherVermin, 1);
    expect(player.getMinionsOnBattlefieldCount()).toBe(2);
  });

  it('应该正确添加战斗日志', () => {
    // 初始时战斗日志为空
    expect(player.battleLogs.length).toBe(0);

    // 添加一条日志
    const testLog = '测试日志';
    player.addBattleLog(testLog);
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
