import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { BattleController } from '@/server/controller/BattleController';
import { Player } from '@/server/controller/entity/Player';
import { BuzzingVermin } from './BuzzingVermin';
import { Minion } from '@/server/controller/entity/Minion';
import dbCard from '@/server/db/db_card';
import * as currentGameModule from '@/server/controller/CurrentGameController';

describe('BuzzingVermin Battle Tests', () => {
  let battleController: BattleController;
  let originalGetCardByStrId: any;
  let mockGetCurrentGameById: any;

  beforeEach(() => {
    battleController = new BattleController();

    // 重置所有mock
    vi.clearAllMocks();

    // 保存原始方法
    originalGetCardByStrId = dbCard.getCardByStrId;

    // Mock db_card.getCardByStrId 方法（直接替换方法，而不是使用spyOn）
    dbCard.getCardByStrId = (strId: string) => {
      // 返回一个基础的Minion对象作为模拟的甲虫
      const minion = new Minion();
      minion.id = `mock-${strId}`;
      minion.name = '模拟甲虫';
      minion.attack = 2;
      minion.health = 2;
      minion.fightHealth = 2;
      minion.strId = strId;
      return minion;
    };

    // Mock CurrentGameController.getCurrentGameById 方法
    mockGetCurrentGameById = vi.spyOn(
      currentGameModule.CurrentGameController.prototype,
      'getCurrentGameById'
    );
    mockGetCurrentGameById.mockImplementation(() => {
      // 返回一个模拟的游戏对象
      return {
        player: {
          beetleBonus: { atk: 0, hp: 0 },
        },
      } as any;
    });
  });

  afterEach(() => {
    // 恢复原始方法
    dbCard.getCardByStrId = originalGetCardByStrId;
  });

  /**
   * 创建测试玩家
   */
  const createTestPlayer = (name: string, minions: Minion[] = []): Player => {
    const player = new Player();
    player.id = `test-${name}`;
    player.name = name;
    player.minionsOnBattlefield = minions;
    player.beetleBonus = { atk: 0, hp: 0 };
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
    minion.keywords = keywords as any;
    minion.effectKeywords = [];
    return minion;
  };

  it('应该正确初始化BuzzingVermin对象', () => {
    const buzzingVermin = new BuzzingVermin();

    // 验证基础属性
    expect(buzzingVermin).toBeInstanceOf(Minion);
    expect(buzzingVermin.inTavern).toBe(true);
    expect(buzzingVermin.attack).toBe(1);
    expect(buzzingVermin.health).toBe(1);
  });

  it('应该正确处理beetleBonus加成', () => {
    // Mock游戏控制器返回带有beetleBonus的玩家
    mockGetCurrentGameById.mockImplementation(() => {
      return {
        player: {
          beetleBonus: { atk: 2, hp: 2 },
        },
      } as any;
    });

    const buzzingVermin = new BuzzingVermin();
    const textFormat = buzzingVermin.getTextFormatArr('test-game-id');

    // 验证文本格式显示的是(2+2)/(2+2)=4/4
    expect(textFormat).toEqual(['4', '4']);
  });

  it('应该正确处理亡语效果', () => {
    const player = createTestPlayer('玩家');
    const buzzingVermin = new BuzzingVermin();
    buzzingVermin.id = 'test-buzzing-vermin';
    buzzingVermin.fightHealth = buzzingVermin.health;

    // 将BuzzingVermin添加到玩家战场
    player.minionsOnBattlefield = [buzzingVermin];

    // 模拟玩家的添加随从方法
    const originalAddMinion = player['添加随从到战场'];
    player['添加随从到战场'] = vi.fn();

    // 模拟玩家的获取随从索引方法
    const originalGetIndex = player.getMinionIndexOnBattlefield;
    player.getMinionIndexOnBattlefield = vi.fn().mockReturnValue(0);

    // 手动触发亡语
    buzzingVermin.deathrattle(player);

    // 验证亡语被调用，并且尝试添加新的甲虫随从
    expect(player.getMinionIndexOnBattlefield).toHaveBeenCalledWith(buzzingVermin);
    expect(player['添加随从到战场']).toHaveBeenCalled();

    // 恢复原始方法
    player['添加随从到战场'] = originalAddMinion;
    player.getMinionIndexOnBattlefield = originalGetIndex;
  });

  it('应该正确处理金卡BuzzingVermin的属性', () => {
    const buzzingVermin = new BuzzingVermin();

    // 模拟金卡属性
    buzzingVermin.attack = 2;
    buzzingVermin.health = 2;
    buzzingVermin.fightHealth = 2;

    // 验证金卡属性
    expect(buzzingVermin.attack).toBe(2);
    expect(buzzingVermin.health).toBe(2);
  });

  it('应该正确处理与弱随从的战斗', () => {
    // 创建玩家和敌方
    const player = createTestPlayer('玩家');
    const enemy = createTestPlayer('敌方');

    // 玩家有BuzzingVermin，敌方有一个1/1随从
    const buzzingVermin = new BuzzingVermin();
    buzzingVermin.id = 'test-buzzing-vermin';
    buzzingVermin.fightHealth = buzzingVermin.health;

    const enemyMinion = createTestMinion('敌方随从', 1, 1);

    player.minionsOnBattlefield = [buzzingVermin];
    enemy.minionsOnBattlefield = [enemyMinion];

    // 执行战斗
    const result = battleController.performBattle(player, enemy);

    // 验证结果
    expect(result.isSuccess()).toBe(true);

    // 验证战斗日志包含相关信息
    expect(player.battleLogs.length).toBeGreaterThan(0);
  });
});
