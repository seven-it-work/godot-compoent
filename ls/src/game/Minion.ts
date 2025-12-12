// 随从类型
export type MinionType =
  | 'beast'
  | 'mech'
  | 'dragon'
  | 'murloc'
  | 'demon'
  | 'elemental'
  | 'pirate'
  | 'undead'
  | 'naga'
  | 'quilboar'
  | 'all';

// 随从类型常量
export const MinionType = {
  BEAST: 'beast' as MinionType,
  MECH: 'mech' as MinionType,
  DRAGON: 'dragon' as MinionType,
  MURLOC: 'murloc' as MinionType,
  DEMON: 'demon' as MinionType,
  ELEMENTAL: 'elemental' as MinionType,
  PIRATE: 'pirate' as MinionType,
  UNDEAD: 'undead' as MinionType,
  NAGA: 'naga' as MinionType,
  QUILBOAR: 'quilboar' as MinionType,
  ALL: 'all' as MinionType,
} as const;

// 随从关键词
export type MinionKeyword =
  | 'taunt'
  | 'divine_shield'
  | 'windfury'
  | 'super_windfury'
  | 'stealth'
  | 'charge'
  | 'poisonous'
  | 'reborn'
  | 'immune';

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
  IMMUNE: 'immune' as MinionKeyword,
} as const;

// 升级卡片接口
export interface UpgradeCard {
  id: number;
  strId: string;
  cardType: string;
  name: string;
  nameCN: string;
  text: string;
  mechanics: string[];
  referencedTags: string[];
  img: string;
  art: string;
  tier: number;
  health: number;
  attack: number;
  minionTypes: string[];
  minionTypesCN: string[];
}

// 随从类
export class Minion {
  id: number;
  strId: string;
  cardType: string;
  name: string;
  nameCN: string;
  text: string;
  mechanics: string[];
  referencedTags: string[];
  img: string;
  art: string;
  tier: number;
  health: number;
  attack: number;
  minionTypes: string[];
  minionTypesCN: string[];
  upgradeCard?: UpgradeCard;

  // 游戏状态属性
  cost: number;
  keywords: MinionKeyword[];
  isGolden: boolean;
  isFrozen: boolean;
  position: number | null;
  hasAttacked: boolean;
  hasDivineShield: boolean;
  hasReborn: boolean;
  maxHealth: number;

  // 静态计数器，用于生成唯一实例ID
  private static instanceCounter: number = 0;
  instanceId: string;

  constructor(
    id: number,
    strId: string,
    cardType: string,
    name: string,
    nameCN: string,
    text: string,
    mechanics: string[],
    referencedTags: string[],
    img: string,
    art: string,
    tier: number,
    health: number,
    attack: number,
    minionTypes: string[],
    minionTypesCN: string[],
    upgradeCard?: UpgradeCard
  ) {
    // 原始卡片属性
    this.id = id;
    this.strId = strId;
    this.cardType = cardType;
    this.name = name;
    this.nameCN = nameCN;
    this.text = text;
    this.mechanics = mechanics;
    this.referencedTags = referencedTags;
    this.img = img;
    this.art = art;
    this.tier = tier;
    this.health = health;
    this.attack = attack;
    this.minionTypes = minionTypes;
    this.minionTypesCN = minionTypesCN;
    this.upgradeCard = upgradeCard;

    // 游戏状态属性
    this.cost = 3; // 默认cost为3
    this.keywords = Minion.mapMechanicsToKeywords(mechanics);
    this.isGolden = false;
    this.isFrozen = false;
    this.position = null;
    this.hasAttacked = false;
    this.hasDivineShield = this.keywords.includes(MinionKeyword.DIVINE_SHIELD);
    this.hasReborn = this.keywords.includes(MinionKeyword.REBORN);
    this.maxHealth = health;

    // 生成唯一实例ID
    this.instanceId = `${strId}-${Minion.instanceCounter++}`;
  }

  // 将mechanics映射为keywords
  private static mapMechanicsToKeywords(mechanics: string[]): MinionKeyword[] {
    const mechanicsMap: Record<string, MinionKeyword> = {
      TAUNT: MinionKeyword.TAUNT,
      DIVINE_SHIELD: MinionKeyword.DIVINE_SHIELD,
      WINDFURY: MinionKeyword.WINDFURY,
      REBORN: MinionKeyword.REBORN,
      STEALTH: MinionKeyword.STEALTH,
      CHARGE: MinionKeyword.CHARGE,
      POISONOUS: MinionKeyword.POISONOUS,
      IMMUNE: MinionKeyword.IMMUNE,
    };

    const keywords: MinionKeyword[] = [];
    for (const mechanic of mechanics) {
      const keyword = mechanicsMap[mechanic];
      if (keyword !== undefined) {
        keywords.push(keyword);
      }
    }
    return keywords;
  }

  // 攻击方法
  attackTarget(): void {
    this.hasAttacked = true;
  }

  // 受到伤害
  takeDamage(damage: number): boolean {
    if (this.hasDivineShield) {
      this.hasDivineShield = false;
      return false;
    }
    this.health -= damage;
    return this.health <= 0;
  }

  // 三连升级为金色随从
  upgradeToGolden(): void {
    if (this.upgradeCard) {
      this.isGolden = true;
      this.attack = this.upgradeCard.attack;
      this.health = this.upgradeCard.health;
      this.maxHealth = this.upgradeCard.health;
      this.text = this.upgradeCard.text;
      this.mechanics = this.upgradeCard.mechanics;
      this.keywords = Minion.mapMechanicsToKeywords(this.upgradeCard.mechanics);
      this.hasDivineShield = this.keywords.includes(MinionKeyword.DIVINE_SHIELD);
      this.hasReborn = this.keywords.includes(MinionKeyword.REBORN);
    }
  }

  // 克隆随从
  clone(): Minion {
    return new Minion(
      this.id,
      this.strId,
      this.cardType,
      this.name,
      this.nameCN,
      this.text,
      [...this.mechanics],
      [...this.referencedTags],
      this.img,
      this.art,
      this.tier,
      this.health,
      this.attack,
      [...this.minionTypes],
      [...this.minionTypesCN],
      this.upgradeCard
    );
  }
}
