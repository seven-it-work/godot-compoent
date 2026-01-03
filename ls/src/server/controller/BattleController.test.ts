import { describe, it, expect, beforeEach } from 'vitest';
import { BattleController } from './BattleController';
import { Player } from './entity/Player';
import { Minion, type MinionKeyword } from './entity/Minion';

describe('BattleController', () => {
  let battleController: BattleController;

  beforeEach(() => {
    battleController = new BattleController();
  });

  /**
   * 创建测试玩家
   */
  const createTestPlayer = (name: string, minions: Minion[] = []): Player => {
    const player = new Player();
    player.id = `test-${name}`;
    player.name = name;
    player.minionsOnBattlefield = minions;
    return player;
  };

  /**
   * 创建测试随从
   */
  const createTestMinion = (
    name: string,
    attack: number,
    health: number,
    keywords: string[] = []
  ): Minion => {
    const minion = new Minion();
    minion.id = `minion-${name}`;
    minion.name = name;
    minion.attack = attack;
    minion.health = health;
    minion.fightHealth = health;
    minion.keywords = keywords as unknown as MinionKeyword[];
    minion.effectKeywords = [];
    return minion;
  };

  it('应该正确处理玩家胜利的情况', () => {
    // 创建玩家和敌方
    const player = createTestPlayer('玩家');
    const enemy = createTestPlayer('敌方');

    // 玩家有强力随从，敌方有弱随从
    player.minionsOnBattlefield = [createTestMinion('玩家随从', 5, 5)];
    enemy.minionsOnBattlefield = [createTestMinion('敌方随从', 1, 1)];

    // 执行战斗
    const result = battleController.performBattle(player, enemy);

    // 验证结果
    expect(result.isSuccess()).toBe(true);
    expect(result.data.winner).toBe('player');
    expect(result.data.playerMinionsLeft).toBeGreaterThan(result.data.enemyMinionsLeft);
    console.log('玩家日志:', player.battleLogs);
  });

  it('应该正确处理敌方胜利的情况', () => {
    // 创建玩家和敌方
    const player = createTestPlayer('玩家');
    const enemy = createTestPlayer('敌方');

    // 敌方有强力随从，玩家有弱随从
    player.minionsOnBattlefield = [createTestMinion('玩家随从', 1, 1)];
    enemy.minionsOnBattlefield = [createTestMinion('敌方随从', 5, 5)];

    // 执行战斗
    const result = battleController.performBattle(player, enemy);

    // 验证结果
    expect(result.isSuccess()).toBe(true);
    expect(result.data.winner).toBe('enemy');
    expect(result.data.enemyMinionsLeft).toBeGreaterThan(result.data.playerMinionsLeft);
  });

  it('应该正确处理平局的情况', () => {
    // 创建玩家和敌方
    const player = createTestPlayer('玩家');
    const enemy = createTestPlayer('敌方');

    // 双方都没有随从，直接平局
    player.minionsOnBattlefield = [];
    enemy.minionsOnBattlefield = [];

    // 执行战斗
    const result = battleController.performBattle(player, enemy);

    // 验证结果
    expect(result.isSuccess()).toBe(true);
    expect(result.data.winner).toBe('draw');
    expect(result.data.playerMinionsLeft).toBe(result.data.enemyMinionsLeft);
  });

  it('应该正确处理玩家没有随从的情况', () => {
    // 创建玩家和敌方
    const player = createTestPlayer('玩家');
    const enemy = createTestPlayer('敌方');

    // 玩家没有随从，敌方有随从
    player.minionsOnBattlefield = [];
    enemy.minionsOnBattlefield = [createTestMinion('敌方随从', 1, 1)];

    // 执行战斗
    const result = battleController.performBattle(player, enemy);

    // 验证结果
    expect(result.isSuccess()).toBe(true);
    expect(result.data.winner).toBe('enemy');
  });

  it('应该正确处理敌方没有随从的情况', () => {
    // 创建玩家和敌方
    const player = createTestPlayer('玩家');
    const enemy = createTestPlayer('敌方');

    // 敌方没有随从，玩家有随从
    player.minionsOnBattlefield = [createTestMinion('玩家随从', 1, 1)];
    enemy.minionsOnBattlefield = [];

    // 执行战斗
    const result = battleController.performBattle(player, enemy);

    // 验证结果
    expect(result.isSuccess()).toBe(true);
    expect(result.data.winner).toBe('player');
  });

  it('应该正确处理双方攻击力为0的情况', () => {
    // 创建玩家和敌方
    const player = createTestPlayer('玩家');
    const enemy = createTestPlayer('敌方');

    // 双方随从攻击力都为0
    player.minionsOnBattlefield = [createTestMinion('玩家随从', 0, 5)];
    enemy.minionsOnBattlefield = [createTestMinion('敌方随从', 0, 5)];

    // 执行战斗
    const result = battleController.performBattle(player, enemy);

    // 验证结果
    expect(result.isSuccess()).toBe(true);
    expect(result.data.winner).toBe('draw');
  });
});
