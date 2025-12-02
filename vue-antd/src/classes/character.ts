// 从world.ts导入GameLocation类型
import type { GameLocation } from './world';
export type { GameLocation } from './world';

// 从resources.ts导入SpiritQi类型
import type { SpiritQi } from './resources';

// 灵根类型
export type SpiritRootType = "gold" | "wood" | "water" | "fire" | "earth";

// 战斗属性类
// 定义战斗属性键类型，排除方法名
export type BattleAttributeKey = "attack" | "defense" | "health" | "maxHealth" | "dodge" | "block" | "critical" | "attackSpeed";

export class BattleAttributes {
  attack: number; // 灵力攻击（攻击）
  defense: number; // 灵力防御（防御）
  health: number; // 神魂强度（生命）
  maxHealth: number; // 最大神魂强度
  dodge: number; // 身法（躲避）
  block: number; // 灵力护盾（格挡）
  critical: number; // 灵眼（暴击）
  attackSpeed: number; // 攻击速度（决定攻击顺序和频率）

  constructor(attributes: {
    attack: number;
    defense: number;
    health: number;
    maxHealth: number;
    dodge: number;
    block: number;
    critical: number;
    attackSpeed: number;
  }) {
    this.attack = attributes.attack;
    this.defense = attributes.defense;
    this.health = attributes.health;
    this.maxHealth = attributes.maxHealth;
    this.dodge = attributes.dodge;
    this.block = attributes.block;
    this.critical = attributes.critical;
    this.attackSpeed = attributes.attackSpeed;
  }

  // 恢复生命值
  heal(amount: number): void {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  // 受到伤害
  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  // 更新属性
  updateAttribute(attribute: BattleAttributeKey, value: number): void {
    this[attribute] = value;
  }
}

// 灵根类
export class SpiritRoot {
  type: SpiritRootType; // 灵根类型
  level: number; // 灵根等级
  name: string; // 灵根名称

  constructor(type: SpiritRootType, level: number, name: string) {
    this.type = type;
    this.level = level;
    this.name = name;
  }

  // 提升灵根等级
  levelUp(): void {
    this.level++;
  }
}

// 从resources.ts导入灵气类
export { SpiritQi } from './resources';

// 修仙者类（基础角色类，包含Player和Teammate的共同属性）
export class Cultivator {
  id: string; // 唯一标识
  name: string; // 名称
  level: number; // 等级
  attributes: BattleAttributes; // 战斗属性
  description: string; // 描述
  image?: string; // 图片（可选）
  isPlayer: boolean; // 是否是玩家自己
  exp: number; // 当前经验值
  maxExp: number; // 升级所需经验值
  spiritRoots: SpiritRoot[]; // 灵根列表
  spiritQi: SpiritQi; // 灵气值
  absorbSpeed: number; // 吸收速度系数
  cooldown: number; // 冷却时间（毫秒）
  isCooldown: boolean; // 是否处于冷却中
  cooldownRemaining: number; // 剩余冷却时间（毫秒）

  constructor(cultivator: {
    id: string;
    name: string;
    level: number;
    attributes: BattleAttributes;
    description: string;
    image?: string;
    isPlayer: boolean;
    exp: number;
    maxExp: number;
    spiritRoots: SpiritRoot[];
    spiritQi: SpiritQi;
    absorbSpeed: number;
    cooldown: number;
    isCooldown: boolean;
    cooldownRemaining: number;
  }) {
    this.id = cultivator.id;
    this.name = cultivator.name;
    this.level = cultivator.level;
    this.attributes = cultivator.attributes;
    this.description = cultivator.description;
    this.image = cultivator.image;
    this.isPlayer = cultivator.isPlayer;
    this.exp = cultivator.exp;
    this.maxExp = cultivator.maxExp;
    this.spiritRoots = cultivator.spiritRoots;
    this.spiritQi = cultivator.spiritQi;
    this.absorbSpeed = cultivator.absorbSpeed;
    this.cooldown = cultivator.cooldown;
    this.isCooldown = cultivator.isCooldown;
    this.cooldownRemaining = cultivator.cooldownRemaining;
  }

  // 升级
  levelUp(): void {
    this.level++;
    this.exp = 0;
    this.maxExp = Math.floor(this.maxExp * 1.5); // 经验值需求增长
    // 升级时属性提升
    this.attributes.attack += 5;
    this.attributes.defense += 3;
    this.attributes.maxHealth += 20;
    this.attributes.health = this.attributes.maxHealth;
    this.attributes.dodge += 1;
    this.attributes.block += 1;
    this.attributes.critical += 1;
  }

  // 获得经验值
  gainExp(amount: number): boolean {
    this.exp += amount;
    if (this.exp >= this.maxExp) {
      this.levelUp();
      return true;
    }
    return false;
  }

  // 更新冷却时间
  updateCooldown(deltaTime: number): void {
    if (this.isCooldown) {
      this.cooldownRemaining -= deltaTime;
      if (this.cooldownRemaining <= 0) {
        this.isCooldown = false;
        this.cooldownRemaining = 0;
      }
    }
  }

  // 开始冷却
  startCooldown(): void {
    this.isCooldown = true;
    this.cooldownRemaining = this.cooldown;
  }

  // 检查是否可以行动
  canAct(): boolean {
    return !this.isCooldown && this.attributes.health > 0;
  }
}

// 队友类（继承自修仙者类）
export class Teammate extends Cultivator {
  // 可以添加队友特有的属性和方法
  constructor(teammate: {
    id: string;
    name: string;
    level: number;
    attributes: BattleAttributes;
    description: string;
    image?: string;
    isPlayer: boolean;
    exp: number;
    maxExp: number;
    spiritRoots: SpiritRoot[];
    spiritQi: SpiritQi;
    absorbSpeed: number;
    cooldown: number;
    isCooldown: boolean;
    cooldownRemaining: number;
  }) {
    super(teammate);
  }

  // 队友特有的方法可以在这里添加
}

// 玩家类（继承自修仙者类）
export class Player extends Cultivator {
  currentLocation?: GameLocation; // 当前所在地点

  constructor(player: {
    id: string;
    name: string;
    level: number;
    attributes: BattleAttributes;
    description: string;
    image?: string;
    isPlayer: boolean;
    exp: number;
    maxExp: number;
    spiritRoots: SpiritRoot[];
    spiritQi: SpiritQi;
    absorbSpeed: number;
    cooldown: number;
    isCooldown: boolean;
    cooldownRemaining: number;
    currentLocation?: GameLocation;
  }) {
    super(player);
    this.currentLocation = player.currentLocation;
  }

  // 玩家特有的方法可以在这里添加
  setCurrentLocation(location: GameLocation): void {
    this.currentLocation = location;
  }
}
