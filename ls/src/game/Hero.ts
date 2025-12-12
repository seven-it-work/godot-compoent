/**
 * 英雄技能类型 - 定义英雄技能的类型
 */
export type HeroPowerType = 'passive' | 'active' | 'channel';

/**
 * 英雄技能类型常量 - 提供预设的英雄技能类型选项
 */
export const HeroPowerType = {
  PASSIVE: 'passive' as HeroPowerType, // 被动技能 - 自动生效
  ACTIVE: 'active' as HeroPowerType, // 主动技能 - 需要手动使用
  CHANNEL: 'channel' as HeroPowerType, // 通道技能 - 需要持续使用
} as const;

/**
 * 英雄技能接口 - 定义英雄技能的数据结构
 */
export interface HeroPower {
  name: string; // 技能名称
  description: string; // 技能描述
  type: HeroPowerType; // 技能类型
  cost: number; // 技能消耗（金币）
  cooldown: number; // 技能冷却时间（回合）
  currentCooldown: number; // 当前冷却时间
  use: (hero: Hero, game: any) => void; // 技能使用函数
}

/**
 * 英雄类 - 定义英雄的数据结构和行为
 */
export class Hero {
  /** 英雄ID - 唯一标识符 */
  id: string;
  /** 英雄名称 - 显示名称 */
  name: string;
  /** 当前生命值 - 英雄当前的生命值 */
  health: number;
  /** 最大生命值 - 英雄的最大生命值 */
  maxHealth: number;
  /** 英雄技能 - 英雄拥有的技能 */
  heroPower: HeroPower;
  /** 护甲值 - 英雄的护甲，用于吸收伤害 */
  armor: number;
  /** 金币 - 英雄拥有的金币 */
  gold: number;
  /** 是否死亡 - 英雄的死亡状态 */
  isDead: boolean;
  /** 是否为玩家 - 区分玩家英雄和AI英雄 */
  isPlayer: boolean;

  /**
   * 英雄构造函数
   * @param id - 英雄ID
   * @param name - 英雄名称
   * @param health - 初始生命值，默认为30
   * @param heroPower - 英雄技能
   * @param armor - 初始护甲，默认为0
   * @param isPlayer - 是否为玩家英雄，默认为false
   */
  constructor(
    id: string,
    name: string,
    health: number = 30,
    heroPower: HeroPower,
    armor: number = 0,
    isPlayer: boolean = false
  ) {
    this.id = id;
    this.name = name;
    this.health = health;
    this.maxHealth = health;
    this.heroPower = heroPower;
    this.armor = armor;
    this.gold = 3; // 初始金币
    this.isDead = false;
    this.isPlayer = isPlayer;
  }

  /**
   * 使用英雄技能 - 消耗金币和冷却时间，执行技能效果
   * @param game - 游戏实例，用于技能效果的执行
   * @returns 是否成功使用技能
   * @使用方式：当玩家或AI决定使用英雄技能时调用
   */
  useHeroPower(game: any): boolean {
    // 检查技能是否处于冷却中
    if (this.heroPower.currentCooldown > 0) {
      return false;
    }

    // 检查金币是否足够
    if (this.heroPower.cost > this.gold) {
      return false;
    }

    // 执行技能效果
    this.heroPower.use(this, game);
    // 扣除金币
    this.gold -= this.heroPower.cost;

    // 设置冷却时间
    if (this.heroPower.cooldown > 0) {
      this.heroPower.currentCooldown = this.heroPower.cooldown;
    }

    return true;
  }

  /**
   * 受到伤害 - 处理英雄受到的伤害，先消耗护甲，再消耗生命值
   * @param damage - 受到的伤害值
   * @使用方式：当英雄受到伤害时调用
   */
  takeDamage(damage: number): void {
    let actualDamage = damage;

    // 先计算护甲吸收的伤害
    if (this.armor > 0) {
      if (this.armor >= actualDamage) {
        // 护甲完全吸收伤害
        this.armor -= actualDamage;
        actualDamage = 0;
      } else {
        // 护甲部分吸收伤害
        actualDamage -= this.armor;
        this.armor = 0;
      }
    }

    // 然后计算生命值受到的伤害
    this.health -= actualDamage;

    // 处理死亡状态
    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
    }
  }

  /**
   * 回复生命值 - 恢复英雄的生命值，不超过最大生命值
   * @param amount - 回复的生命值
   * @使用方式：当英雄获得治疗效果时调用
   */
  heal(amount: number): void {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  /**
   * 增加护甲 - 给英雄添加护甲
   * @param amount - 增加的护甲值
   * @使用方式：当英雄获得护甲效果时调用
   */
  addArmor(amount: number): void {
    this.armor += amount;
  }

  /**
   * 重置技能冷却 - 将英雄技能的冷却时间重置为0
   * @使用方式：当英雄获得冷却重置效果时调用
   */
  resetCooldown(): void {
    this.heroPower.currentCooldown = 0;
  }

  /**
   * 克隆英雄 - 创建一个英雄的副本
   * @returns 克隆的英雄实例
   * @使用方式：当需要创建英雄副本时调用，如玩家选择英雄时
   */
  clone(): Hero {
    // 克隆英雄技能
    const clonedHeroPower = {
      ...this.heroPower,
      use: this.heroPower.use,
    };

    // 创建并返回克隆的英雄实例
    return new Hero(this.id, this.name, this.health, clonedHeroPower, this.armor, this.isPlayer);
  }
}
