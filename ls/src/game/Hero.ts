// 英雄技能类型
export type HeroPowerType = 'passive' | 'active' | 'channel';

// 英雄技能类型常量
export const HeroPowerType = {
  PASSIVE: 'passive' as HeroPowerType,
  ACTIVE: 'active' as HeroPowerType,
  CHANNEL: 'channel' as HeroPowerType
} as const;

// 英雄技能接口
export interface HeroPower {
  name: string;
  description: string;
  type: HeroPowerType;
  cost: number;
  cooldown: number;
  currentCooldown: number;
  use: (hero: Hero, game: any) => void;
}

// 英雄类
export class Hero {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  heroPower: HeroPower;
  armor: number;
  gold: number;
  isDead: boolean;
  isPlayer: boolean;

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
    this.gold = 3;
    this.isDead = false;
    this.isPlayer = isPlayer;
  }

  // 使用英雄技能
  useHeroPower(game: any): boolean {
    if (this.heroPower.currentCooldown > 0) {
      return false;
    }

    if (this.heroPower.cost > this.gold) {
      return false;
    }

    this.heroPower.use(this, game);
    this.gold -= this.heroPower.cost;

    if (this.heroPower.cooldown > 0) {
      this.heroPower.currentCooldown = this.heroPower.cooldown;
    }

    return true;
  }

  // 受到伤害
  takeDamage(damage: number): void {
    let actualDamage = damage;

    // 先计算护甲
    if (this.armor > 0) {
      if (this.armor >= actualDamage) {
        this.armor -= actualDamage;
        actualDamage = 0;
      } else {
        actualDamage -= this.armor;
        this.armor = 0;
      }
    }

    // 然后计算生命值
    this.health -= actualDamage;

    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
    }
  }

  // 回复生命值
  heal(amount: number): void {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  // 增加护甲
  addArmor(amount: number): void {
    this.armor += amount;
  }

  // 重置技能冷却
  resetCooldown(): void {
    this.heroPower.currentCooldown = 0;
  }

  // 克隆英雄
  clone(): Hero {
    // 克隆英雄技能
    const clonedHeroPower = {
      ...this.heroPower,
      use: this.heroPower.use
    };
    
    return new Hero(
      this.id,
      this.name,
      this.health,
      clonedHeroPower,
      this.armor,
      this.isPlayer
    );
  }
}