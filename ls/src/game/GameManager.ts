import { Player } from './Player';
import { AIPlayer, AIDifficulty } from './AIPlayer';
import { Hero } from './Hero';
import { Minion } from './Minion';
import { Tavern } from './Tavern';
import { BattleSystem } from './BattleSystem';
import type { BattleResult } from './BattleSystem';

/**
 * 游戏状态类型 - 定义游戏可能处于的状态
 */
export type GameState = 'not_started' | 'hero_selection' | 'in_game' | 'battle_phase' | 'game_over';

/**
 * 游戏状态常量 - 提供预设的游戏状态选项
 */
export const GameState = {
  NOT_STARTED: 'not_started' as GameState, // 游戏未开始
  HERO_SELECTION: 'hero_selection' as GameState, // 英雄选择阶段
  IN_GAME: 'in_game' as GameState, // 游戏进行中
  BATTLE_PHASE: 'battle_phase' as GameState, // 战斗阶段
  GAME_OVER: 'game_over' as GameState, // 游戏结束
} as const;

/**
 * 游戏管理器类 - 负责游戏的核心逻辑管理，包括玩家管理、回合管理、战斗执行等
 */
export class GameManager {
  /** 玩家数组 - 包含游戏中的所有玩家 */
  players: Player[];
  /** 当前玩家 - 当前回合的玩家 */
  currentPlayer: Player | null;
  /** 游戏状态 - 当前游戏所处的状态 */
  gameState: GameState;
  /** 当前回合数 - 记录游戏进行的回合数 */
  turn: number;
  /** 随从池 - 游戏中所有可用的随从 */
  minionPool: Minion[];
  /** 英雄池 - 游戏中所有可用的英雄 */
  heroPool: Hero[];
  /** 可用英雄 - 当前可选择的英雄（英雄选择阶段） */
  availableHeroes: Hero[];
  /** 酒馆实例 - 管理酒馆相关逻辑 */
  tavern: Tavern;

  /**
   * 游戏管理器构造函数
   * @param minionPool - 随从池数组，默认为空数组
   * @param heroPool - 英雄池数组，默认为空数组
   */
  constructor(minionPool: Minion[] = [], heroPool: Hero[] = []) {
    this.players = [];
    this.currentPlayer = null;
    this.gameState = GameState.NOT_STARTED;
    this.turn = 1;
    this.minionPool = minionPool;
    this.heroPool = heroPool;
    this.availableHeroes = [];
    this.tavern = new Tavern(1, minionPool);
  }

  /**
   * 初始化游戏 - 设置游戏状态为英雄选择阶段，并随机选择英雄
   * @使用方式：当游戏开始时，调用此方法初始化游戏状态
   */
  initGame(): void {
    this.gameState = GameState.HERO_SELECTION;
    // 随机选择3个英雄供玩家选择
    this.availableHeroes = this.getRandomHeroes(3);
  }

  /**
   * 随机选择指定数量的英雄
   * @param count - 要选择的英雄数量
   * @returns 随机选择的英雄数组
   * @private - 内部方法，用于游戏初始化和AI玩家创建
   */
  getRandomHeroes(count: number): Hero[] {
    const shuffled = [...this.heroPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * 玩家选择英雄 - 创建玩家和AI玩家，开始游戏
   * @param heroId - 玩家选择的英雄ID
   * @returns 是否成功选择英雄并开始游戏
   * @使用方式：当玩家从可用英雄中选择一个英雄时调用
   */
  selectHero(heroId: string): boolean {
    const selectedHero = this.availableHeroes.find(hero => hero.id === heroId);
    if (!selectedHero) {
      return false;
    }

    // 创建玩家
    const player = new Player('player-1', selectedHero.clone(), true);
    this.players.push(player);

    // 创建7个AI玩家
    for (let i = 2; i <= 8; i++) {
      const randomHeroes = this.getRandomHeroes(1);
      if (randomHeroes.length > 0) {
        const aiHero = randomHeroes[0]?.clone();
        if (aiHero) {
          // 根据难度创建AI玩家，这里简单起见，使用中等难度
          const aiPlayer = new AIPlayer(`player-${i}`, aiHero, AIDifficulty.MEDIUM, this);
          this.players.push(aiPlayer);
        }
      }
    }

    // 开始游戏
    this.gameState = GameState.IN_GAME;
    this.currentPlayer = this.players[0] || null;
    return true;
  }

  /**
   * 开始新回合 - 重置所有玩家的金币和状态，设置当前玩家
   * @使用方式：当战斗阶段结束后，进入下一回合时调用
   */
  startNewTurn(): void {
    this.turn++;

    // 重置所有玩家的金币和状态
    this.players.forEach(player => {
      if (!player.isDead) {
        player.endTurn();
      }
    });

    // 设置当前玩家为第一个存活的玩家
    this.currentPlayer = this.players.find(player => !player.isDead) || null;
  }

  /**
   * 切换到下一个玩家 - 寻找下一个存活的玩家，设置为当前玩家
   * @使用方式：当当前玩家结束回合后调用
   */
  nextPlayer(): void {
    if (!this.currentPlayer) {
      return;
    }

    const currentIndex = this.players.indexOf(this.currentPlayer);
    let nextIndex = (currentIndex + 1) % this.players.length;

    // 找到下一个存活的玩家
    while (nextIndex !== currentIndex) {
      const nextPlayer = this.players[nextIndex];
      if (nextPlayer && !nextPlayer.isDead) {
        break;
      }
      nextIndex = (nextIndex + 1) % this.players.length;
    }

    // 如果所有玩家都死了，游戏结束
    if (nextIndex === currentIndex) {
      this.gameState = GameState.GAME_OVER;
      return;
    }

    const nextPlayer = this.players[nextIndex];
    this.currentPlayer = nextPlayer || null;

    // 如果是AI玩家，自动执行回合
    if (this.currentPlayer instanceof AIPlayer && !this.currentPlayer.isPlayer) {
      // AI玩家逻辑在其他地方处理
    }
  }

  /**
   * 执行战斗阶段 - 随机配对玩家进行战斗，处理战斗结果
   * @使用方式：当所有玩家结束回合后，进入战斗阶段时调用
   */
  executeBattlePhase(): void {
    this.gameState = GameState.BATTLE_PHASE;

    // 随机配对玩家进行战斗
    const alivePlayers = this.players.filter(player => !player.isDead);
    const shuffledPlayers = [...alivePlayers].sort(() => 0.5 - Math.random());

    // 配对战斗
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (i + 1 < shuffledPlayers.length) {
        const player1 = shuffledPlayers[i];
        const player2 = shuffledPlayers[i + 1];

        // 执行战斗
        if (player1 && player2) {
          const battleResult = BattleSystem.executeBattle(player1, player2);

          // 处理战斗结果
          this.handleBattleResult(battleResult);
        }
      }
    }

    // 检查游戏是否结束
    const remainingPlayers = this.players.filter(player => !player.isDead);
    if (remainingPlayers.length <= 1) {
      this.gameState = GameState.GAME_OVER;
    } else {
      this.gameState = GameState.IN_GAME;
      this.startNewTurn();
    }
  }

  /**
   * 处理战斗结果 - 更新玩家的胜负记录，处理伤害和死亡状态
   * @param result - 战斗结果对象
   * @private - 内部方法，战斗结束后调用
   */
  handleBattleResult(result: BattleResult): void {
    // 处理胜利
    result.winner.winStreak++;
    result.winner.lossStreak = 0;

    // 处理失败
    result.loser.lossStreak++;
    result.loser.winStreak = 0;

    // 失败者受到伤害
    result.loser.takeDamage(result.damageDealt);

    // 如果失败者死亡，标记为死亡
    if (result.loser.hero.health <= 0) {
      result.loser.isDead = true;
    }
  }

  /**
   * 获取游戏结果 - 返回游戏的获胜者
   * @returns 获胜玩家实例，如果游戏未结束则返回null
   * @使用方式：当游戏结束时，调用此方法获取获胜者
   */
  getGameResult(): Player | null {
    if (this.gameState !== GameState.GAME_OVER) {
      return null;
    }

    return this.players.find(player => !player.isDead) || null;
  }

  /**
   * 刷新酒馆 - 消耗金币刷新酒馆中的随从
   * @param player - 请求刷新酒馆的玩家
   * @returns 是否成功刷新酒馆
   * @使用方式：当玩家点击刷新酒馆按钮时调用
   */
  refreshTavern(player: Player): boolean {
    if (player !== this.currentPlayer || player.isDead) {
      return false;
    }

    if (player.gold < this.tavern.refreshCost) {
      return false;
    }

    player.gold -= this.tavern.refreshCost;
    this.tavern.refresh();
    return true;
  }

  /**
   * 升级酒馆 - 消耗金币升级酒馆等级
   * @param player - 请求升级酒馆的玩家
   * @returns 是否成功升级酒馆
   * @使用方式：当玩家点击升级酒馆按钮时调用
   */
  upgradeTavern(player: Player): boolean {
    if (player !== this.currentPlayer || player.isDead) {
      return false;
    }

    const upgradeCost = this.tavern.upgrade();
    if (upgradeCost === -1 || player.gold < upgradeCost) {
      return false;
    }

    player.gold -= upgradeCost;
    player.tavernLevel++;
    this.tavern.level = player.tavernLevel;
    this.tavern.refresh();
    return true;
  }

  /**
   * 购买随从 - 从酒馆购买随从到玩家的bench
   * @param player - 请求购买随从的玩家
   * @param minionIndex - 要购买的随从在酒馆中的索引
   * @returns 是否成功购买随从
   * @使用方式：当玩家点击酒馆中的随从卡片购买时调用
   */
  buyMinion(player: Player, minionIndex: number): boolean {
    if (player !== this.currentPlayer || player.isDead) {
      return false;
    }

    const minion = this.tavern.buyMinion(minionIndex);
    if (!minion) {
      return false;
    }

    // 购买成功后，直接招募随从到替补席
    // 注意：onCardPlayed只有在从手牌到战场时才会触发，购买时不触发
    return player.recruitMinion(minion);
  }

  /**
   * 结束当前玩家回合 - 检查是否所有玩家都结束回合，决定进入下一个玩家或战斗阶段
   * @使用方式：当玩家点击结束回合按钮时调用
   */
  endPlayerTurn(): void {
    if (!this.currentPlayer || this.gameState !== GameState.IN_GAME) {
      return;
    }

    // 如果是最后一个玩家，进入战斗阶段
    const alivePlayers = this.players.filter(player => !player.isDead);
    const lastAlivePlayer = alivePlayers[alivePlayers.length - 1];

    if (this.currentPlayer === lastAlivePlayer) {
      this.executeBattlePhase();
    } else {
      this.nextPlayer();
    }
  }

  /**
   * 获取当前玩家的可用操作 - 根据玩家状态返回可执行的操作列表
   * @param player - 要获取可用操作的玩家
   * @returns 可用操作字符串数组
   * @使用方式：用于UI显示玩家当前可以执行的操作
   */
  getAvailableActions(player: Player): string[] {
    const actions: string[] = [];

    if (player.isDead) {
      return actions;
    }

    actions.push('end_turn');

    if (player.gold >= this.tavern.refreshCost) {
      actions.push('refresh_tavern');
    }

    const upgradeCost = this.tavern.upgrade();
    if (upgradeCost !== -1 && player.gold >= upgradeCost) {
      actions.push('upgrade_tavern');
    }

    if (this.tavern.availableMinions.length > 0) {
      actions.push('buy_minion');
    }

    if (player.bench.length > 0 && player.minions.length < 7) {
      actions.push('place_minion');
    }

    if (player.minions.length > 0 && player.bench.length < 7) {
      actions.push('return_minion');
    }

    if (player.minions.length > 0 || player.bench.length > 0) {
      actions.push('sell_minion');
    }

    return actions;
  }
}
