import { Player } from './Player';
import { AIPlayer, AIDifficulty } from './AIPlayer';
import { Hero } from './Hero';
import { Minion } from './Minion';
import { Tavern } from './Tavern';
import { BattleSystem } from './BattleSystem';
import type { BattleResult } from './BattleSystem';

// 游戏状态类型
export type GameState = 'not_started' | 'hero_selection' | 'in_game' | 'battle_phase' | 'game_over';

// 游戏状态常量
export const GameState = {
  NOT_STARTED: 'not_started' as GameState,
  HERO_SELECTION: 'hero_selection' as GameState,
  IN_GAME: 'in_game' as GameState,
  BATTLE_PHASE: 'battle_phase' as GameState,
  GAME_OVER: 'game_over' as GameState
} as const;

// 游戏管理器类
export class GameManager {
  players: Player[];
  currentPlayer: Player | null;
  gameState: GameState;
  turn: number;
  minionPool: Minion[];
  heroPool: Hero[];
  availableHeroes: Hero[];
  tavern: Tavern;

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

  // 初始化游戏
  initGame(): void {
    this.gameState = GameState.HERO_SELECTION;
    // 随机选择3个英雄供玩家选择
    this.availableHeroes = this.getRandomHeroes(3);
  }

  // 随机选择指定数量的英雄
  getRandomHeroes(count: number): Hero[] {
    const shuffled = [...this.heroPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // 玩家选择英雄
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

  // 开始新回合
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

  // 切换到下一个玩家
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

  // 执行战斗阶段
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

  // 处理战斗结果
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

  // 获取游戏结果
  getGameResult(): Player | null {
    if (this.gameState !== GameState.GAME_OVER) {
      return null;
    }

    return this.players.find(player => !player.isDead) || null;
  }

  // 刷新酒馆
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

  // 升级酒馆
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

  // 购买随从
  buyMinion(player: Player, minionIndex: number): boolean {
    if (player !== this.currentPlayer || player.isDead) {
      return false;
    }

    const minion = this.tavern.buyMinion(minionIndex);
    if (!minion) {
      return false;
    }

    return player.recruitMinion(minion);
  }

  // 结束当前玩家回合
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

  // 获取当前玩家的可用操作
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