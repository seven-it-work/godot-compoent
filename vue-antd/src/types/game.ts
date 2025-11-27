// 灵根类型
export type SpiritRootType = "gold" | "wood" | "water" | "fire" | "earth";

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

// 玩家数据模型
export interface Player {
  level: number; // 玩家等级
  exp: number; // 当前经验值
  maxExp: number; // 升级所需经验值
  spiritRoots: SpiritRoot[]; // 灵根列表
  spiritQi: SpiritQi; // 灵气值
  absorbSpeed: number; // 吸收速度系数
  cooldown: number; // 冷却时间（毫秒）
  isCooldown: boolean; // 是否处于冷却中
  cooldownRemaining: number; // 剩余冷却时间（毫秒）
}

// 游戏状态
export interface GameState {
  player: Player;
  currentSystem: "training" | "outdoor"; // 当前游戏系统
}
