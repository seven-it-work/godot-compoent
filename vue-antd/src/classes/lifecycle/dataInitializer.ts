import { Player, Teammate } from "../character";
import { SpiritRoot } from "../character";
import { SpiritQi } from "../resources";
import { GameLocation, GameMap, GameTime } from "../world";
import { TeamPosition } from "../team";
import { AttributesGenerator } from "../attributesGenerator";

// 初始化数据类型定义
export interface InitializationData {
  player: Player;
  teammates: Teammate[];
  teamPositions: TeamPosition[][];
  gameTime: GameTime;
  map: GameMap;
  initialLocation: GameLocation;
}

// 游戏数据初始化管理器
export class DataInitializer {
  /**
   * 初始化玩家数据
   */
  static initializePlayer(): Player {
    console.log("[DataInitializer] 开始初始化玩家数据");
    
    const player = new Player({
      id: "player-1",
      name: "玩家",
      level: 1,
      exp: 0,
      maxExp: 100,
      spiritRoots: [
        new SpiritRoot("gold", 1, "金灵根"),
        new SpiritRoot("wood", 1, "木灵根"),
        new SpiritRoot("water", 1, "水灵根"),
        new SpiritRoot("fire", 1, "火灵根"),
        new SpiritRoot("earth", 1, "土灵根"),
      ],
      spiritQi: new SpiritQi({
        gold: 0,
        wood: 0,
        water: 0,
        fire: 0,
        earth: 0,
        maxGold: 100,
        maxWood: 100,
        maxWater: 100,
        maxFire: 100,
        maxEarth: 100,
      }),
      attributes: AttributesGenerator.generateAttributesByLevel(1),
      absorbSpeed: 1.0,
      cooldown: 1000, // 1秒冷却时间
      isCooldown: false,
      cooldownRemaining: 0,
      description: "游戏主角",
      isPlayer: true,
    });
    
    console.log("[DataInitializer] 玩家数据初始化完成");
    return player;
  }

  /**
   * 初始化队友数据
   */
  static initializeTeammates(): Teammate[] {
    console.log("[DataInitializer] 开始初始化队友数据");
    
    const teammates: Teammate[] = [
      // 玩家作为特殊队友
      new Player({
        id: "player-1",
        name: "玩家",
        level: 1,
        attributes: AttributesGenerator.generateAttributesByLevel(1),
        description: "游戏主角",
        isPlayer: true,
        exp: 0,
        maxExp: 100,
        spiritRoots: [
          new SpiritRoot("gold", 1, "金灵根"),
          new SpiritRoot("wood", 1, "木灵根"),
          new SpiritRoot("water", 1, "水灵根"),
          new SpiritRoot("fire", 1, "火灵根"),
          new SpiritRoot("earth", 1, "土灵根"),
        ],
        spiritQi: new SpiritQi({
          gold: 0,
          wood: 0,
          water: 0,
          fire: 0,
          earth: 0,
          maxGold: 100,
          maxWood: 100,
          maxWater: 100,
          maxFire: 100,
          maxEarth: 100,
        }),
        absorbSpeed: 1.0,
        cooldown: 1000,
        isCooldown: false,
        cooldownRemaining: 0,
      }),
      // 剑灵队友
      new Teammate({
        id: "teammate-1",
        name: "剑灵",
        level: 1,
        attributes: AttributesGenerator.generateAttributesByLevel(1),
        description: "拥有强大攻击力的剑灵",
        isPlayer: false,
        exp: 0,
        maxExp: 100,
        spiritRoots: [new SpiritRoot("gold", 1, "金灵根")],
        spiritQi: new SpiritQi({
          gold: 0,
          wood: 0,
          water: 0,
          fire: 0,
          earth: 0,
          maxGold: 100,
          maxWood: 100,
          maxWater: 100,
          maxFire: 100,
          maxEarth: 100,
        }),
        absorbSpeed: 1.0,
        cooldown: 1000,
        isCooldown: false,
        cooldownRemaining: 0,
      }),
      // 药童队友
      new Teammate({
        id: "teammate-2",
        name: "药童",
        level: 1,
        attributes: AttributesGenerator.generateAttributesByLevel(1),
        description: "拥有强大生命力的药童",
        isPlayer: false,
        exp: 0,
        maxExp: 100,
        spiritRoots: [new SpiritRoot("wood", 1, "木灵根")],
        spiritQi: new SpiritQi({
          gold: 0,
          wood: 0,
          water: 0,
          fire: 0,
          earth: 0,
          maxGold: 100,
          maxWood: 100,
          maxWater: 100,
          maxFire: 100,
          maxEarth: 100,
        }),
        absorbSpeed: 1.0,
        cooldown: 1000,
        isCooldown: false,
        cooldownRemaining: 0,
      }),
    ];
    
    console.log("[DataInitializer] 队友数据初始化完成，共初始化了", teammates.length, "个队友");
    return teammates;
  }

  /**
   * 初始化队伍位置
   * @param includePlayer 是否包含玩家在初始位置
   */
  static initializeTeamPositions(includePlayer: boolean = true): TeamPosition[][] {
    console.log("[DataInitializer] 开始初始化队伍位置，includePlayer:", includePlayer);
    
    const positions: TeamPosition[][] = Array(3)
      .fill(null)
      .map((_, rowIndex) => {
        return Array(6)
          .fill(null)
          .map((_, colIndex) => {
            const teammateId = includePlayer && rowIndex === 0 && colIndex === 0 
              ? "player-1" 
              : undefined;
            
            return new TeamPosition(
              `position-${rowIndex}-${colIndex}`,
              rowIndex,
              colIndex,
              teammateId
            );
          });
      });
    
    console.log("[DataInitializer] 队伍位置初始化完成，尺寸:", positions.length, "x", (positions[0]?.length || 0));
    return positions;
  }

  /**
   * 初始化游戏时间
   */
  static initializeGameTime(): GameTime {
    console.log("[DataInitializer] 开始初始化游戏时间");
    
    const gameTime = new GameTime({
      year: 1,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      speed: 1,
      isPaused: false,
    });
    
    console.log("[DataInitializer] 游戏时间初始化完成");
    return gameTime;
  }

  /**
   * 初始化游戏地图
   * @param width 地图宽度
   * @param height 地图高度
   */
  static initializeMap(width: number = 10, height: number = 10): GameMap {
    console.log("[DataInitializer] 开始初始化游戏地图，尺寸:", width, "x", height);
    
    const map = new GameMap(width, height);
    
    console.log("[DataInitializer] 游戏地图初始化完成");
    return map;
  }

  /**
   * 初始化初始位置
   */
  static initializeInitialLocation(): GameLocation {
    console.log("[DataInitializer] 开始初始化初始位置");
    
    const initialLocation = new GameLocation({
      id: "0-0",
      x: 0,
      y: 0,
      name: "初始地点",
      spiritQi: new SpiritQi({
        gold: 50,
        wood: 50,
        water: 50,
        fire: 50,
        earth: 50,
        maxGold: 100,
        maxWood: 100,
        maxWater: 100,
        maxFire: 100,
        maxEarth: 100,
      }),
      isCurrent: true,
      icon: "", // 默认使用山谷图标
    });
    
    console.log("[DataInitializer] 初始位置初始化完成");
    return initialLocation;
  }

  /**
   * 完整初始化所有游戏数据
   */
  static initializeAllData(): InitializationData {
    console.log("[DataInitializer] 开始完整初始化游戏数据");
    
    // 初始化各个组件
    const player = this.initializePlayer();
    const teammates = this.initializeTeammates();
    const teamPositions = this.initializeTeamPositions();
    const gameTime = this.initializeGameTime();
    const map = this.initializeMap();
    const initialLocation = this.initializeInitialLocation();
    
    // 设置玩家初始位置
    player.currentLocation = initialLocation;
    
    console.log("[DataInitializer] 游戏数据完整初始化完成");
    
    return {
      player,
      teammates,
      teamPositions,
      gameTime,
      map,
      initialLocation,
    };
  }

  /**
   * 重置游戏数据
   */
  static resetGameData(): InitializationData {
    console.log("[DataInitializer] 开始重置游戏数据");
    
    // 重置游戏数据实际上就是重新初始化所有数据
    const resetData = this.initializeAllData();
    
    console.log("[DataInitializer] 游戏数据重置完成");
    return resetData;
  }
}
