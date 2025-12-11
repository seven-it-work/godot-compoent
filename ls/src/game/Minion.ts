// 随从类型
export type MinionType = 'beast' | 'mech' | 'dragon' | 'murloc' | 'demon' | 'elemental' | 'pirate' | 'all';

// 随从类型常量
export const MinionType = {
  BEAST: 'beast' as MinionType,
  MECH: 'mech' as MinionType,
  DRAGON: 'dragon' as MinionType,
  MURLOC: 'murloc' as MinionType,
  DEMON: 'demon' as MinionType,
  ELEMENTAL: 'elemental' as MinionType,
  PIRATE: 'pirate' as MinionType,
  ALL: 'all' as MinionType
} as const;

// 随从关键词
export type MinionKeyword = 'taunt' | 'divine_shield' | 'windfury' | 'super_windfury' | 'stealth' | 'charge' | 'poisonous' | 'reborn' | 'immune';

// 随从关键词常量
export const MinionKeyword = {
  TAUNT: 'taunt' as MinionKeyword,
  DIVINE_SHIELD: 'divine_shield' as MinionKeyword,
  WINDFURY: 'windfury' as MinionKeyword,
  SUPER_WINDFURY: 'super_windfury' as MinionKeyword,
  STEALTH: 'stealth' as MinionKeyword,
  CHARGE: 'charge' as MinionKeyword,
  POISONOUS: 'poisonous' as MinionKeyword,
  REBORN: 'reborn' as MinionKeyword,
  IMMUNE: 'immune' as MinionKeyword
} as const;

// 随从特效类型
export type MinionEffectType = 'battlecry' | 'death_rattle' | 'on_turn_start' | 'on_turn_end' | 'on_attack' | 'on_defend' | 'revenge' | 'on_minion_summoned';

// 随从特效类型常量
export const MinionEffectType = {
  BATTLECRY: 'battlecry' as MinionEffectType,
  DEATH_RATTLE: 'death_rattle' as MinionEffectType,
  ON_TURN_START: 'on_turn_start' as MinionEffectType,
  ON_TURN_END: 'on_turn_end' as MinionEffectType,
  ON_ATTACK: 'on_attack' as MinionEffectType,
  ON_DEFEND: 'on_defend' as MinionEffectType,
  REVENGE: 'revenge' as MinionEffectType,
  ON_MINION_SUMMONED: 'on_minion_summoned' as MinionEffectType
} as const;

// 随从特效接口
export interface MinionEffect {
  type: MinionEffectType;
  description: string;
  trigger: (minion: Minion, game: any) => void;
}

// 随从类
export class Minion {
  id: string;
  name: string;
  star: number; // 1-6星
  type: MinionType;
  attack: number;
  health: number;
  maxHealth: number;
  cost: number;
  keywords: MinionKeyword[];
  effects: MinionEffect[];
  isGolden: boolean;
  isFrozen: boolean;
  position: number | null;
  hasAttacked: number;
  hasDivineShield: boolean;
  hasReborn: boolean;

  constructor(
    id: string,
    name: string,
    star: number,
    type: MinionType,
    attack: number,
    health: number,
    cost: number = 3,
    keywords: MinionKeyword[] = [],
    effects: MinionEffect[] = []
  ) {
    this.id = id;
    this.name = name;
    this.star = star;
    this.type = type;
    this.attack = attack;
    this.health = health;
    this.maxHealth = health;
    this.cost = cost;
    this.keywords = keywords;
    this.effects = effects;
    this.isGolden = false;
    this.isFrozen = false;
    this.position = null;
    this.hasAttacked = 0;
    this.hasDivineShield = keywords.includes(MinionKeyword.DIVINE_SHIELD);
    this.hasReborn = keywords.includes(MinionKeyword.REBORN);
  }

  // 攻击方法
  attackTarget(target: Minion): void {
    // 处理攻击逻辑
    this.hasAttacked = true;
  }

  // 受到伤害
  takeDamage(damage: number): boolean {
    // 处理伤害逻辑
    return this.health <= 0;
  }

  // 触发特效
  triggerEffect(effectType: MinionEffectType, game: any): void {
    this.effects.forEach(effect => {
      if (effect.type === effectType) {
        effect.trigger(this, game);
      }
    });
  }

  // 三连升级为金色随从
  upgradeToGolden(): void {
    this.isGolden = true;
    this.attack *= 2;
    this.health *= 2;
    this.maxHealth *= 2;
    // 特效翻倍逻辑
  }

  // 克隆随从
  clone(): Minion {
    return new Minion(
      this.id,
      this.name,
      this.star,
      this.type,
      this.attack,
      this.health,
      this.cost,
      [...this.keywords],
      [...this.effects]
    );
  }
}