// 灵根类型
export type SpiritRootType = "gold" | "wood" | "water" | "fire" | "earth";

// 战斗属性数据模型
export interface BattleAttributes {
  attack: number; // 灵力攻击（攻击）
  defense: number; // 灵力防御（防御）
  health: number; // 神魂强度（生命）
  maxHealth: number; // 最大神魂强度
  dodge: number; // 身法（躲避）
  block: number; // 灵力护盾（格挡）
  critical: number; // 灵眼（暴击）
}

// 灵根数据模型
export interface SpiritRoot {
  type: SpiritRootType; // 灵根类型
  level: number; // 灵根等级
  name: string; // 灵根名称
}

// 灵气数据模型
export interface SpiritQi {
  gold: number; // 金灵气
  wood: number; // 木灵气
  water: number; // 水灵气
  fire: number; // 火灵气
  earth: number; // 土灵气
  maxGold: number; // 金灵气上限
  maxWood: number; // 木灵气上限
  maxWater: number; // 水灵气上限
  maxFire: number; // 火灵气上限
  maxEarth: number; // 土灵气上限
}

// 灵脉数据模型
export interface SpiritVein {
  type: SpiritRootType; // 灵脉类型
  productionSpeed: number; // 生产速度（单位时间生产的灵气量）
  level: number; // 灵脉等级
  name: string; // 灵脉名称
}

// 怪物数据模型
export interface Monster {
  id: string; // 怪物唯一标识
  name: string; // 怪物名称
  level: number; // 怪物等级
  attributes: BattleAttributes; // 怪物战斗属性
  expReward: number; // 击败怪物获得的经验值
  description: string; // 怪物描述
  image?: string; // 怪物图片（可选）
}

// 地点数据模型
export interface Location {
  id: string; // 地点唯一标识
  x: number; // 横坐标
  y: number; // 纵坐标
  name: string; // 地点名称
  spiritQi: SpiritQi; // 灵气分布
  spiritVein?: SpiritVein; // 灵脉（可选）
  monster?: Monster; // 怪物（可选）
  isCurrent: boolean; // 是否为当前地点
}

// 时间系统数据模型
export interface GameTime {
  year: number; // 年份
  month: number; // 月份（1-12）
  day: number; // 日期（1-30）
  hour: number; // 小时（0-23）
  minute: number; // 分钟（0-59）
  second: number; // 秒（0-59）
  speed: number; // 时间流速（1x, 2x, 4x等）
  isPaused: boolean; // 是否暂停
}

// 战斗日志
export interface BattleLog {
  id: string;
  text: string;
  timestamp: number;
  type: "player" | "monster" | "system";
}

// 战斗状态
export interface BattleState {
  isInBattle: boolean;
  currentMonster?: Monster;
  battleLogs: BattleLog[];
  isPlayerTurn: boolean;
  battleResult?: "win" | "lose" | "escape";
}

// 地图数据模型
export interface GameMap {
  width: number; // 地图宽度（网格数）
  height: number; // 地图高度（网格数）
  locations: Location[][]; // 二维网格地点
}

// 玩家数据模型
export interface Player {
  name: string; // 玩家名称
  level: number; // 玩家等级
  exp: number; // 当前经验值
  maxExp: number; // 升级所需经验值
  spiritRoots: SpiritRoot[]; // 灵根列表
  spiritQi: SpiritQi; // 灵气值
  attributes: BattleAttributes; // 战斗属性
  absorbSpeed: number; // 吸收速度系数
  cooldown: number; // 冷却时间（毫秒）
  isCooldown: boolean; // 是否处于冷却中
  cooldownRemaining: number; // 剩余冷却时间（毫秒）
  currentLocation: Location; // 当前所在地点
}

// 游戏状态
export interface GameState {
  player: Player;
  currentSystem: "training" | "outdoor" | "battle"; // 当前游戏系统
  map: GameMap; // 游戏地图
  gameTime: GameTime; // 游戏时间
  timeInterval: number | null; // 时间流逝定时器
  battleState: BattleState; // 战斗状态
}
