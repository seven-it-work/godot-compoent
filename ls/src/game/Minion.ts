import { Card, CardType } from './Card';

/**
 * 随从类型 - 定义随从的种族类型
 */
export type MinionType =
  | 'beast' // 野兽
  | 'mech' // 机械
  | 'dragon' // 龙
  | 'murloc' // 鱼人
  | 'demon' // 恶魔
  | 'elemental' // 元素
  | 'pirate' // 海盗
  | 'undead' // 亡灵
  | 'naga' // 纳迦
  | 'quilboar' // 野猪人
  | 'all'; // 所有类型

/**
 * 随从类型常量 - 提供预设的随从类型选项
 */
export const MinionType = {
  BEAST: 'beast' as MinionType, // 野兽类型
  MECH: 'mech' as MinionType, // 机械类型
  DRAGON: 'dragon' as MinionType, // 龙类型
  MURLOC: 'murloc' as MinionType, // 鱼人类型
  DEMON: 'demon' as MinionType, // 恶魔类型
  ELEMENTAL: 'elemental' as MinionType, // 元素类型
  PIRATE: 'pirate' as MinionType, // 海盗类型
  UNDEAD: 'undead' as MinionType, // 亡灵类型
  NAGA: 'naga' as MinionType, // 纳迦类型
  QUILBOAR: 'quilboar' as MinionType, // 野猪人类型
  ALL: 'all' as MinionType, // 所有类型
} as const;

/**
 * 随从关键词 - 定义随从的特殊能力
 */
export type MinionKeyword =
  | 'taunt' // 嘲讽 - 必须先被攻击
  | 'divine_shield' // 圣盾 - 免疫第一次伤害
  | 'windfury' // 风怒 - 每回合可以攻击两次
  | 'super_windfury' // 超级风怒 - 每回合可以攻击多次
  | 'stealth' // 潜行 - 不会被攻击，除非主动攻击
  | 'charge' // 冲锋 - 可以立即攻击
  | 'poisonous' // 剧毒 - 攻击时消灭目标
  | 'reborn' // 复生 - 死亡后以1点生命值复活
  | 'immune'; // 免疫 - 不受任何伤害和效果

/**
 * 随从关键词常量 - 提供预设的随从关键词选项
 */
export const MinionKeyword = {
  TAUNT: 'taunt' as MinionKeyword, // 嘲讽
  DIVINE_SHIELD: 'divine_shield' as MinionKeyword, // 圣盾
  WINDFURY: 'windfury' as MinionKeyword, // 风怒
  SUPER_WINDFURY: 'super_windfury' as MinionKeyword, // 超级风怒
  STEALTH: 'stealth' as MinionKeyword, // 潜行
  CHARGE: 'charge' as MinionKeyword, // 冲锋
  POISONOUS: 'poisonous' as MinionKeyword, // 剧毒
  REBORN: 'reborn' as MinionKeyword, // 复生
  IMMUNE: 'immune' as MinionKeyword, // 免疫
} as const;

/**
 * 随从加成接口 - 定义随从属性加成的数据结构
 */
export interface MinionBuff {
  id: string; // 加成唯一标识符
  source: string; // 加成来源（如卡牌名称、效果名称）
  attackBonus: number; // 攻击力加成值
  healthBonus: number; // 生命值加成值
  maxHealthBonus: number; // 最大生命值加成值
  type?: string; // 加成类型（如临时、永久）
  turnsRemaining?: number; // 剩余回合数（临时加成使用）
}

/**
 * 升级卡片接口 - 定义随从升级为金色版本的数据结构
 */
export interface UpgradeCard {
  id: number; // 升级卡片ID
  strId: string; // 升级卡片字符串ID
  cardType: string; // 卡片类型
  name: string; // 英文名称
  nameCN: string; // 中文名称
  text: string; // 英文描述
  mechanics: string[]; // 机制列表
  referencedTags: string[]; // 引用标签
  img: string; // 卡片图片URL
  art: string; // 卡片艺术图URL
  tier: number; // 星级
  health: number; // 生命值
  attack: number; // 攻击力
  minionTypes: string[]; // 随从类型列表
  minionTypesCN: string[]; // 中文随从类型列表
}

/**
 * 随从类 - 定义随从的数据结构和行为
 */
export class Minion extends Card {
  /** 随从类型列表 - 随从所属的类型列表 */
  minionTypes: string[];
  /** 中文随从类型列表 - 中文显示的随从类型列表 */
  minionTypesCN: string[];
  /** 升级卡片 - 用于升级为金色版本的卡片数据（可选） */
  upgradeCard?: UpgradeCard;

  // 游戏状态属性
  /** 关键词列表 - 随从拥有的关键词 */
  keywords: MinionKeyword[];
  /** 是否为金色 - 金色随从拥有更强的属性 */
  isGolden: boolean;
  /** 是否被冻结 - 冻结状态的随从无法攻击或被操作 */
  isFrozen: boolean;
  /** 位置 - 随从在战场上的位置索引，null表示在hand上 */
  position: number | null;
  /** 是否已经攻击 - 记录随从是否在当前回合已经攻击过 */
  hasAttacked: boolean;
  /** 是否有圣盾 - 记录随从当前是否具有圣盾效果 */
  hasDivineShield: boolean;
  /** 是否有复生 - 记录随从当前是否具有复生效果 */
  hasReborn: boolean;
  /** 是否已授予塑造法术 - 记录随从是否已经生成过塑造法术 */
  hasGrantedShapingSpell: boolean;
  /** 当前生命值 - 随从当前的生命值 */
  health: number;
  /** 攻击力 - 随从的攻击力（包含所有加成） */
  attack: number;
  /** 最大生命值 - 随从的最大生命值（包含加成） */
  maxHealth: number;

  /** 基础攻击力 - 随从的原始攻击力，不包含任何加成 */
  private baseAttack: number;
  /** 基础最大生命值 - 随从的原始最大生命值，不包含任何加成 */
  private baseMaxHealth: number;

  /** 加成列表 - 存储所有应用于该随从的属性加成 */
  buffs: MinionBuff[];

  /** 静态计数器 - 用于生成唯一的实例ID */
  private static instanceCounter: number = 0;
  /** 实例ID - 每个随从实例的唯一标识符 */
  instanceId: string;

  /**
   * 随从构造函数
   * @param id - 随从ID
   * @param strId - 随从字符串ID
   * @param cardType - 卡片类型
   * @param name - 英文名称
   * @param nameCN - 中文名称
   * @param text - 英文描述
   * @param mechanics - 机制列表
   * @param referencedTags - 引用标签
   * @param img - 卡片图片URL
   * @param art - 卡片艺术图URL
   * @param tier - 星级
   * @param health - 生命值
   * @param attack - 攻击力
   * @param minionTypes - 随从类型列表
   * @param minionTypesCN - 中文随从类型列表
   * @param upgradeCard - 升级卡片（可选）
   */
  constructor(
    id: string | number,
    strId: string,
    cardType: CardType,
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
    super(
      id,
      strId,
      cardType,
      name,
      nameCN,
      text,
      mechanics,
      referencedTags,
      img,
      art,
      tier,
      3,
      false
    );

    // 原始卡片属性初始化
    this.minionTypes = minionTypes;
    this.minionTypesCN = minionTypesCN;
    this.upgradeCard = upgradeCard;

    // 初始化基础属性
    this.baseAttack = attack;
    this.baseMaxHealth = health;

    // 游戏状态属性初始化
    this.keywords = Minion.mapMechanicsToKeywords(mechanics); // 将机制映射为关键词
    this.isGolden = false; // 默认不是金色随从
    this.isFrozen = false; // 默认不处于冻结状态
    this.position = null; // 默认位置为null（在hand上）
    this.hasAttacked = false; // 默认未攻击
    this.hasDivineShield = this.keywords.includes(MinionKeyword.DIVINE_SHIELD); // 检查是否有圣盾
    this.hasReborn = this.keywords.includes(MinionKeyword.REBORN); // 检查是否有复生
    this.hasGrantedShapingSpell = false; // 是否已授予塑造法术（默认未授予）
    this.buffs = []; // 初始化加成列表为空数组

    // 初始化实际属性
    this.health = health;
    this.attack = attack;
    this.maxHealth = health;

    // 生成唯一实例ID
    this.instanceId = `${strId}-${Minion.instanceCounter++}`;
  }

  /**
   * 将机制列表映射为关键词列表
   * @param mechanics - 机制列表
   * @returns 关键词列表
   * @private - 内部方法，用于随从初始化
   */
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

  /**
   * 攻击方法 - 设置随从为已攻击状态
   * @使用方式：当随从执行攻击时调用
   */
  attackTarget(): void {
    this.hasAttacked = true;
  }

  /**
   * 受到伤害 - 处理随从受到的伤害，考虑圣盾效果
   * @param damage - 受到的伤害值
   * @returns 是否死亡（生命值 <= 0）
   * @使用方式：当随从受到伤害时调用
   */
  takeDamage(damage: number): boolean {
    if (this.hasDivineShield) {
      // 圣盾抵消一次伤害
      this.hasDivineShield = false;
      return false; // 未死亡
    }
    // 扣除生命值
    this.health -= damage;
    return this.health <= 0; // 返回是否死亡
  }

  /**
   * 三连升级为金色随从 - 将随从升级为金色版本
   * @使用方式：当玩家拥有三个相同的随从时调用
   */
  upgradeToGolden(): void {
    if (this.upgradeCard) {
      this.isGolden = true; // 设置为金色随从
      // 更新属性为金色版本属性
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

  /**
   * 克隆随从 - 创建一个随从的副本
   * @returns 克隆的随从实例
   * @使用方式：当需要创建随从副本时调用，如购买随从或战斗时复制随从
   */
  clone(): Minion {
    // 使用当前实例的构造函数创建副本，确保子类也能正确克隆
    return new (this.constructor as typeof Minion)(
      this.id,
      this.strId,
      this.cardType,
      this.name,
      this.nameCN,
      this.text,
      [...this.mechanics], // 深拷贝机制列表
      [...this.referencedTags], // 深拷贝引用标签
      this.img,
      this.art,
      this.tier || 1,
      this.health,
      this.attack,
      [...this.minionTypes], // 深拷贝随从类型列表
      [...this.minionTypesCN], // 深拷贝中文随从类型列表
      this.upgradeCard
    );
  }

  /**
   * 计算攻击力 - 累加所有攻击力加成
   * @returns 包含所有加成的攻击力
   */
  private calculateAttack(): number {
    const totalAttackBonus = this.buffs.reduce((total, buff) => total + buff.attackBonus, 0);
    return this.baseAttack + totalAttackBonus;
  }

  /**
   * 计算最大生命值 - 累加所有最大生命值加成
   * @returns 包含所有加成的最大生命值
   */
  private calculateMaxHealth(): number {
    const totalMaxHealthBonus = this.buffs.reduce((total, buff) => total + buff.maxHealthBonus, 0);
    return this.baseMaxHealth + totalMaxHealthBonus;
  }

  /**
   * 重新计算并更新所有属性值 - 当加成列表发生变化时调用
   * @使用方式：当添加或移除加成时调用
   */
  updateStats(): void {
    // 更新攻击力（包含加成）
    this.attack = this.calculateAttack();
    // 更新最大生命值（包含加成）
    const newMaxHealth = this.calculateMaxHealth();
    const healthDiff = newMaxHealth - this.maxHealth;
    this.maxHealth = newMaxHealth;
    // 同步当前生命值，保持比例
    if (healthDiff > 0) {
      this.health += healthDiff;
    }
  }

  /**
   * 添加加成 - 为随从添加一个属性加成
   * @param buff - 要添加的加成对象
   * @returns 是否成功添加
   */
  addBuff(buff: MinionBuff): boolean {
    // 检查是否已存在相同ID的加成
    const existingIndex = this.buffs.findIndex(b => b.id === buff.id);
    if (existingIndex >= 0) {
      // 如果已存在，更新该加成
      this.buffs[existingIndex] = { ...this.buffs[existingIndex], ...buff };
    } else {
      // 如果不存在，添加新加成
      this.buffs.push(buff);
    }
    // 更新属性值
    this.updateStats();
    return true;
  }

  /**
   * 移除加成 - 从随从移除一个属性加成
   * @param buffId - 要移除的加成ID
   * @returns 是否成功移除
   */
  removeBuff(buffId: string): boolean {
    const initialLength = this.buffs.length;
    this.buffs = this.buffs.filter(buff => buff.id !== buffId);
    if (this.buffs.length < initialLength) {
      // 更新属性值
      this.updateStats();
      return true;
    }
    return false;
  }

  /**
   * 当本随从被使用时触发 - 可由子类重写以实现特定效果
   * @param _game - 游戏管理器或store实例
   * @使用方式：当玩家从手牌将本随从拖拽到战场时触发
   * 用于实现随从被使用时的效果
   */
  onMinionPlayed(_game: any): void {
    // 默认实现为空，由子类根据需要重写
  }

  /**
   * 战吼效果 - 可由子类重写以实现特定效果
   * @param _game - 游戏管理器或store实例
   * @使用方式：当本随从被使用时，在onMinionPlayed之后触发
   * 用于实现"战吼：xxx"的效果
   */
  battlecry(_game: any): void {
    // 默认实现为空，由子类根据需要重写
  }

  /**
   * 当其他卡牌被使用时触发 - 可由子类重写以实现特定效果
   * @param _card - 使用的卡牌实例
   * @param _game - 游戏管理器或store实例
   * @使用方式：当玩家使用其他卡牌时触发
   * 用于实现"在你使用一张卡牌后"的效果
   */
  onOtherCardPlayed(_card: any, _game: any): void {
    // 默认实现为空，由子类根据需要重写
  }

  /**
   * 当任何卡牌被使用时触发 - 内部方法，用于统一事件处理
   * @param card - 使用的卡牌实例
   * @param game - 游戏管理器或store实例
   * @使用方式：由游戏系统调用，用于分发事件
   */
  onCardPlayed(card: any, game: any): void {
    // 如果使用的是本随从，触发onMinionPlayed和battlecry
    if (card.instanceId === this.instanceId) {
      this.onMinionPlayed(game);
      this.battlecry(game);
    } else {
      // 如果使用的是其他卡牌，触发onOtherCardPlayed
      this.onOtherCardPlayed(card, game);
    }
  }
}
