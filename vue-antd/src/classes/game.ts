import { Player } from './character';
import { BattleState } from './battle';
import { GameMap, GameTime } from './world';
import { Team } from './team';

// 游戏状态类
export class GameState {
  player: Player;
  currentSystem: "training" | "outdoor" | "battle"; // 当前游戏系统
  map: GameMap; // 游戏地图
  gameTime: GameTime; // 游戏时间
  timeInterval: number | null; // 时间流逝定时器
  battleState: BattleState; // 战斗状态
  isAutoAbsorbing: boolean; // 是否自动吸收灵气
  autoAbsorbInterval: number | null; // 自动吸收定时器
  team: Team; // 玩家队伍

  constructor(initialState: {
    player: Player;
    currentSystem: "training" | "outdoor" | "battle";
    map: GameMap;
    gameTime: GameTime;
    battleState: BattleState;
    team: Team;
  }) {
    this.player = initialState.player;
    this.currentSystem = initialState.currentSystem;
    this.map = initialState.map;
    this.gameTime = initialState.gameTime;
    this.battleState = initialState.battleState;
    this.team = initialState.team;
    this.timeInterval = null;
    this.isAutoAbsorbing = false;
    this.autoAbsorbInterval = null;
  }

  // 设置当前游戏系统
  setCurrentSystem(system: "training" | "outdoor" | "battle"): void {
    this.currentSystem = system;
  }

  // 开始时间流逝
  startTimeFlow(interval: number = 1000): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    
    this.timeInterval = window.setInterval(() => {
      this.gameTime.tick(interval);
    }, interval);
  }

  // 停止时间流逝
  stopTimeFlow(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  }

  // 开始自动吸收灵气
  startAutoAbsorb(interval: number = 1000): void {
    if (this.autoAbsorbInterval) {
      clearInterval(this.autoAbsorbInterval);
    }
    
    this.isAutoAbsorbing = true;
    this.autoAbsorbInterval = window.setInterval(() => {
      // 自动吸收灵气的逻辑可以在这里实现
      // 例如：this.player.absorbSpiritQi();
    }, interval);
  }

  // 停止自动吸收灵气
  stopAutoAbsorb(): void {
    if (this.autoAbsorbInterval) {
      clearInterval(this.autoAbsorbInterval);
      this.autoAbsorbInterval = null;
    }
    this.isAutoAbsorbing = false;
  }

  // 切换自动吸收灵气状态
  toggleAutoAbsorb(): void {
    if (this.isAutoAbsorbing) {
      this.stopAutoAbsorb();
    } else {
      this.startAutoAbsorb();
    }
  }

  // 更新游戏状态
  update(deltaTime: number): void {
    // 更新时间
    this.gameTime.tick(deltaTime);
    
    // 更新玩家冷却时间
    this.player.updateCooldown(deltaTime);
    
    // 更新队友冷却时间
    this.team.allTeammates.forEach(teammate => {
      teammate.updateCooldown(deltaTime);
    });
  }
}
