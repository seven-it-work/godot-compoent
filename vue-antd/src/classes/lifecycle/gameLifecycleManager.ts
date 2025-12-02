import { GameState } from "../game";
import { MapManager } from "../mapManager";
import { DataInitializer } from "./dataInitializer";

// 游戏生命周期阶段
export type GamePhase = 
  | "idle"           // 空闲状态
  | "initializing"   // 数据初始化
  | "loading"        // 游戏数据加载
  | "ready"          // 准备就绪
  | "running"        // 游戏运行中
  | "paused"         // 游戏暂停
  | "gameOver"       // 游戏结束
  | "resetting";     // 游戏重置

// 游戏生命周期事件处理器
export interface GameLifecycleHandlers {
  onInitializing?: () => void;
  onLoading?: () => void;
  onReady?: () => void;
  onGameStart?: () => void;
  onGamePause?: () => void;
  onGameResume?: () => void;
  onGameOver?: () => void;
  onGameReset?: () => void;
  onPhaseChange?: (phase: GamePhase) => void;
  onDataInitialized?: () => void;
}

// 游戏生命周期管理类
export class GameLifecycleManager {
  private gameState: GameState | null = null;
  private currentPhase: GamePhase = "idle";
  private handlers: GameLifecycleHandlers = {};
  private isInitialized: boolean = false;

  constructor(handlers?: GameLifecycleHandlers) {
    if (handlers) {
      this.handlers = handlers;
    }
  }

  /**
   * 初始化游戏数据
   * @param initialState 初始游戏状态
   */
  initialize(initialState: GameState): void {
    console.log(`[GameLifecycle] 开始初始化游戏数据，当前阶段: ${this.currentPhase}`);
    this.changePhase("initializing");
    
    if (this.handlers.onInitializing) {
      console.log(`[GameLifecycle] 触发 onInitializing 事件`);
      this.handlers.onInitializing();
    }

    // 保存游戏状态
    console.log(`[GameLifecycle] 保存初始游戏状态`);
    this.gameState = initialState;
    
    // 使用数据初始化器初始化所有游戏数据
    console.log(`[GameLifecycle] 调用 DataInitializer 初始化游戏数据`);
    const initData = DataInitializer.initializeAllData();
    
    // 更新游戏状态
    console.log(`[GameLifecycle] 使用初始化数据更新游戏状态`);
    this.updateGameStateFromInitData(initData);
    
    // 触发数据初始化完成事件
    if (this.handlers.onDataInitialized) {
      console.log(`[GameLifecycle] 触发 onDataInitialized 事件`);
      this.handlers.onDataInitialized();
    }
    
    // 初始化地图
    console.log(`[GameLifecycle] 开始初始化地图，尺寸: ${this.gameState!.map.width}x${this.gameState!.map.height}`);
    MapManager.generateMap(this.gameState!.map, (location) => {
      if (this.gameState) {
        this.gameState.player.currentLocation = location;
        console.log(`[GameLifecycle] 玩家初始位置设置为: ${location.name} (${location.x}, ${location.y})`);
      }
    });

    this.isInitialized = true;
    console.log(`[GameLifecycle] 游戏初始化完成，玩家状态: 等级 ${this.gameState!.player.level}, 经验 ${this.gameState!.player.exp}`);
    this.changePhase("ready");

    if (this.handlers.onReady) {
      console.log(`[GameLifecycle] 触发 onReady 事件`);
      this.handlers.onReady();
    }
    console.log(`[GameLifecycle] 游戏初始化流程结束，当前阶段: ${this.currentPhase}`);
  }

  /**
   * 从初始化数据更新游戏状态
   * @param initData 初始化数据
   */
  private updateGameStateFromInitData(initData: any): void {
    if (!this.gameState) {
      console.error(`[GameLifecycle] 更新游戏状态失败: 游戏状态未初始化`);
      return;
    }

    console.log(`[GameLifecycle] 更新游戏状态: 玩家数据`);
    this.gameState.player = initData.player;
    
    console.log(`[GameLifecycle] 更新游戏状态: 游戏时间`);
    this.gameState.gameTime = initData.gameTime;
    
    console.log(`[GameLifecycle] 更新游戏状态: 地图数据`);
    this.gameState.map = initData.map;
    
    // 更新队伍数据
    console.log(`[GameLifecycle] 更新游戏状态: 队伍数据`);
    this.gameState.team.allTeammates = initData.teammates;
    this.gameState.team.positions = initData.teamPositions;
    
    console.log(`[GameLifecycle] 游戏状态更新完成`);
  }

  /**
   * 加载游戏数据
   * 可以从本地存储或服务器加载游戏进度
   */
  loadGame(): void {
    console.log(`[GameLifecycle] 开始加载游戏数据，当前阶段: ${this.currentPhase}`);
    
    if (!this.gameState) {
      console.error(`[GameLifecycle] 加载失败: 游戏状态未初始化`);
      throw new Error("游戏状态未初始化");
    }

    this.changePhase("loading");

    if (this.handlers.onLoading) {
      console.log(`[GameLifecycle] 触发 onLoading 事件`);
      this.handlers.onLoading();
    }

    // 这里可以添加从本地存储或服务器加载游戏数据的逻辑
    // 例如：加载玩家进度、队伍状态、地图探索情况等
    console.log(`[GameLifecycle] 正在加载游戏数据，玩家当前等级: ${this.gameState.player.level}`);
    
    // 模拟加载过程（实际项目中可以替换为真实的加载逻辑）
    console.log(`[GameLifecycle] 加载完成: 玩家数据、队伍信息、地图状态`);
    
    // 加载完成后进入准备就绪状态
    this.changePhase("ready");

    if (this.handlers.onReady) {
      console.log(`[GameLifecycle] 触发 onReady 事件`);
      this.handlers.onReady();
    }
    
    console.log(`[GameLifecycle] 游戏数据加载流程结束，当前阶段: ${this.currentPhase}`);
  }

  /**
   * 开始游戏
   */
  startGame(): void {
    console.log(`[GameLifecycle] 尝试开始游戏，当前阶段: ${this.currentPhase}`);
    
    if (!this.gameState || !this.isInitialized) {
      console.error(`[GameLifecycle] 开始游戏失败: 游戏尚未初始化`);
      throw new Error("游戏尚未初始化");
    }

    if (this.currentPhase === "running") {
      console.warn(`[GameLifecycle] 警告: 游戏已经在运行中，当前阶段: ${this.currentPhase}`);
      return;
    }

    this.changePhase("running");

    if (this.handlers.onGameStart) {
      console.log(`[GameLifecycle] 触发 onGameStart 事件`);
      this.handlers.onGameStart();
    }

    // 开始时间流逝
    console.log(`[GameLifecycle] 开始游戏时间流逝`);
    this.gameState.startTimeFlow();
    
    console.log(`[GameLifecycle] 游戏已成功开始，当前阶段: ${this.currentPhase}`);
  }

  /**
   * 暂停游戏
   */
  pauseGame(): void {
    console.log(`[GameLifecycle] 尝试暂停游戏，当前阶段: ${this.currentPhase}`);
    
    if (!this.gameState || this.currentPhase !== "running") {
      console.log(`[GameLifecycle] 跳过暂停操作: 游戏状态无效或当前未在运行中`);
      return;
    }

    this.changePhase("paused");

    if (this.handlers.onGamePause) {
      console.log(`[GameLifecycle] 触发 onGamePause 事件`);
      this.handlers.onGamePause();
    }

    // 停止时间流逝
    console.log(`[GameLifecycle] 停止游戏时间流逝`);
    this.gameState.stopTimeFlow();
    
    console.log(`[GameLifecycle] 游戏已成功暂停，当前阶段: ${this.currentPhase}`);
  }

  /**
   * 恢复游戏
   */
  resumeGame(): void {
    console.log(`[GameLifecycle] 尝试恢复游戏，当前阶段: ${this.currentPhase}`);
    
    if (!this.gameState || this.currentPhase !== "paused") {
      console.log(`[GameLifecycle] 跳过恢复操作: 游戏状态无效或当前未处于暂停状态`);
      return;
    }

    this.changePhase("running");

    if (this.handlers.onGameResume) {
      console.log(`[GameLifecycle] 触发 onGameResume 事件`);
      this.handlers.onGameResume();
    }

    // 恢复时间流逝
    console.log(`[GameLifecycle] 恢复游戏时间流逝`);
    this.gameState.startTimeFlow();
    
    console.log(`[GameLifecycle] 游戏已成功恢复运行，当前阶段: ${this.currentPhase}`);
  }

  /**
   * 结束游戏
   */
  gameOver(): void {
    console.log(`[GameLifecycle] 尝试结束游戏，当前阶段: ${this.currentPhase}`);
    
    if (!this.gameState || this.currentPhase === "gameOver") {
      console.log(`[GameLifecycle] 跳过结束游戏操作: 游戏状态无效或当前已结束`);
      return;
    }

    this.changePhase("gameOver");

    if (this.handlers.onGameOver) {
      console.log(`[GameLifecycle] 触发 onGameOver 事件`);
      this.handlers.onGameOver();
    }

    // 停止所有游戏进程
    console.log(`[GameLifecycle] 停止所有游戏进程`);
    this.gameState.stopTimeFlow();
    console.log(`[GameLifecycle] 停止自动吸收灵气`);
    this.gameState.stopAutoAbsorb();
    
    console.log(`[GameLifecycle] 游戏已成功结束，当前阶段: ${this.currentPhase}`);
  }

  /**
   * 重置游戏
   */
  resetGame(): void {
    console.log(`[GameLifecycle] 尝试重置游戏，当前阶段: ${this.currentPhase}`);
    
    if (!this.gameState) {
      console.log(`[GameLifecycle] 跳过重置操作: 游戏状态未初始化`);
      return;
    }

    this.changePhase("resetting");

    if (this.handlers.onGameReset) {
      console.log(`[GameLifecycle] 触发 onGameReset 事件`);
      this.handlers.onGameReset();
    }

    // 停止所有游戏进程
    console.log(`[GameLifecycle] 停止所有游戏进程`);
    this.gameState.stopTimeFlow();
    console.log(`[GameLifecycle] 停止自动吸收灵气`);
    this.gameState.stopAutoAbsorb();

    // 使用数据初始化器重置游戏数据
    console.log(`[GameLifecycle] 调用 DataInitializer 重置游戏数据`);
    const resetData = DataInitializer.resetGameData();
    
    // 更新游戏状态
    console.log(`[GameLifecycle] 使用重置数据更新游戏状态`);
    this.updateGameStateFromInitData(resetData);
    
    // 重置游戏状态
    console.log(`[GameLifecycle] 重置游戏状态完成`);
    this.isInitialized = false;
    this.changePhase("ready");
    
    console.log(`[GameLifecycle] 游戏已成功重置，当前阶段: ${this.currentPhase}`);
  }

  /**
   * 切换游戏运行状态（开始/暂停）
   */
  toggleGameState(): void {
    console.log(`[GameLifecycle] 尝试切换游戏状态，当前阶段: ${this.currentPhase}`);
    
    if (this.currentPhase === "running") {
      console.log(`[GameLifecycle] 当前状态为 running，将切换到 paused`);
      this.pauseGame();
    } else if (this.currentPhase === "paused") {
      console.log(`[GameLifecycle] 当前状态为 paused，将切换到 running`);
      this.resumeGame();
    } else if (this.currentPhase === "ready") {
      console.log(`[GameLifecycle] 当前状态为 ready，将切换到 running`);
      this.startGame();
    } else {
      console.log(`[GameLifecycle] 当前状态为 ${this.currentPhase}，不支持状态切换`);
    }
  }

  /**
   * 获取当前游戏阶段
   */
  getCurrentPhase(): GamePhase {
    return this.currentPhase;
  }

  /**
   * 获取游戏状态
   */
  getGameState(): GameState | null {
    return this.gameState;
  }

  /**
   * 检查游戏是否已经初始化
   */
  isGameInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * 检查游戏是否正在运行
   */
  isGameRunning(): boolean {
    return this.currentPhase === "running";
  }

  /**
   * 检查游戏是否已暂停
   */
  isGamePaused(): boolean {
    return this.currentPhase === "paused";
  }

  /**
   * 检查游戏是否已结束
   */
  isGameOver(): boolean {
    return this.currentPhase === "gameOver";
  }

  /**
   * 添加生命周期事件处理器
   */
  addHandlers(handlers: Partial<GameLifecycleHandlers>): void {
    this.handlers = { ...this.handlers, ...handlers };
  }

  /**
   * 移除生命周期事件处理器
   */
  removeHandlers(handlerKeys: (keyof GameLifecycleHandlers)[]): void {
    handlerKeys.forEach(key => {
      delete this.handlers[key];
    });
  }

  /**
   * 清空所有生命周期事件处理器
   */
  clearHandlers(): void {
    this.handlers = {};
  }

  /**
   * 更改游戏阶段
   */
  private changePhase(newPhase: GamePhase): void {
    if (this.currentPhase === newPhase) {
      return;
    }

    const oldPhase = this.currentPhase;
    this.currentPhase = newPhase;

    console.log(`[GameLifecycle] 阶段变化: ${oldPhase} -> ${newPhase}`);

    if (this.handlers.onPhaseChange) {
      this.handlers.onPhaseChange(newPhase);
    }
  }
}
