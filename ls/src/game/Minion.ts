import { IdGenerator } from '../utils/IdGenerator';
import type { ICard } from './Card';
import { Card } from './Card';

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
 * 随从接口 - 定义随从特有的属性
 */
export interface IMinion extends ICard {
  /** 随从类型列表 - 随从所属的类型列表 */
  minionTypes: string[];
  /** 中文随从类型列表 - 中文显示的随从类型列表 */
  minionTypesCN: string[];
  /** 升级卡片 - 用于升级为金色版本的卡片数据（可选） */
  upgradeCard?: UpgradeCard;

  // 游戏状态属性
  /** 永久关键词列表 - 随从拥有的永久关键词（通过mechanics映射或永久效果获得） */
  permanentKeywords: MinionKeyword[];
  /** 临时关键词列表 - 随从拥有的临时关键词（通过临时效果获得，回合结束时移除） */
  temporaryKeywords: MinionKeyword[];
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
  /** 基础攻击力 - 随从的原始攻击力，不包含任何加成 */
  attack: number;
  /** 基础最大生命值 - 随从的原始最大生命值，不包含任何加成 */
  baseMaxHealth: number;

  /** 永久加成列表 - 存储应用于该随从的永久属性加成（不会在回合结束时移除） */
  permanentBuffs: MinionBuff[];
  /** 临时加成列表 - 存储应用于该随从的临时属性加成（回合结束时自动移除） */
  temporaryBuffs: MinionBuff[];
}

/**
 * 随从类 - 定义随从的数据结构和行为
 */
export class Minion extends Card implements IMinion {
  /** 随从类型列表 - 随从所属的类型列表 */
  minionTypes: string[];
  /** 中文随从类型列表 - 中文显示的随从类型列表 */
  minionTypesCN: string[];
  /** 升级卡片 - 用于升级为金色版本的卡片数据（可选） */
  upgradeCard?: UpgradeCard;

  // 游戏状态属性
  /** 永久关键词列表 - 随从拥有的永久关键词（通过mechanics映射或永久效果获得） */
  permanentKeywords: MinionKeyword[];
  /** 临时关键词列表 - 随从拥有的临时关键词（通过临时效果获得，回合结束时移除） */
  temporaryKeywords: MinionKeyword[];
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
  /** 基础攻击力 - 随从的原始攻击力，不包含任何加成 */
  private baseAttack: number;
  /** 基础最大生命值 - 随从的原始最大生命值，不包含任何加成 */
  baseMaxHealth: number;

  /** 永久加成列表 - 存储应用于该随从的永久属性加成（不会在回合结束时移除） */
  permanentBuffs: MinionBuff[];
  /** 临时加成列表 - 存储应用于该随从的临时属性加成（回合结束时自动移除） */
  temporaryBuffs: MinionBuff[];

  /** 属性缓存机制 - 用于优化属性计算性能 */
  /** 攻击力缓存 - 缓存当前计算的攻击力，null表示需要重新计算 */
  private attackCache: number | null = null;
  /** 最大生命值缓存 - 缓存当前计算的最大生命值，null表示需要重新计算 */
  private maxHealthCache: number | null = null;
  /** 关键词缓存 - 缓存当前所有关键词（永久+临时），null表示需要重新计算 */
  private keywordsCache: MinionKeyword[] | null = null;

  /**
   * 清除属性缓存 - 在加成变化、关键词变化或回合开始/结束时调用
   * @注意事项：每当添加/移除加成、修改关键词、开始/结束回合时，必须调用此方法以确保属性计算准确
   */
  private clearCache(): void {
    this.attackCache = null;
    this.maxHealthCache = null;
    this.keywordsCache = null;
  }

  /**
   * 随从构造函数
   * @param params - 随从属性参数，所有属性可选
   */
  constructor(params: Partial<IMinion>) {
    // 调用父类构造函数，设置默认cost为3
    super({
      ...params,
      cost: params.cost || 3,
      mechanics: params.mechanics || [],
      referencedTags: params.referencedTags || [],
    });

    // 初始化Minion特有的属性
    this.minionTypes = params.minionTypes || [];
    this.minionTypesCN = params.minionTypesCN || [];
    this.upgradeCard = params.upgradeCard;

    // 游戏状态属性初始化
    this.permanentKeywords = Minion.mapMechanicsToKeywords(params.mechanics || []);
    this.temporaryKeywords = [];
    this.isGolden = params.isGolden || false;
    this.isFrozen = params.isFrozen || false;
    this.position = params.position !== undefined ? params.position : null;
    this.hasAttacked = params.hasAttacked || false;
    this.hasDivineShield = this.permanentKeywords.includes(MinionKeyword.DIVINE_SHIELD);
    this.hasReborn = this.permanentKeywords.includes(MinionKeyword.REBORN);
    this.hasGrantedShapingSpell = params.hasGrantedShapingSpell || false;
    this.health = params.health || 1;

    // 属性初始化
    this.baseAttack = params.attack || 0;
    this.baseMaxHealth = params.health || 1;

    // 加成列表初始化
    this.permanentBuffs = params.permanentBuffs || [];
    this.temporaryBuffs = params.temporaryBuffs || [];
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
   * 计算攻击力 - 累加所有攻击力加成（永久+临时）
   * @returns 包含所有加成的攻击力
   * @private - 内部方法，仅在需要重新计算攻击力时调用
   */
  private calculateAttack(): number {
    // 计算永久加成
    const permanentAttackBonus = this.permanentBuffs.reduce(
      (total, buff) => total + buff.attackBonus,
      0
    );
    // 计算临时加成
    const temporaryAttackBonus = this.temporaryBuffs.reduce(
      (total, buff) => total + buff.attackBonus,
      0
    );
    return this.baseAttack + permanentAttackBonus + temporaryAttackBonus;
  }

  /**
   * 计算最大生命值 - 累加所有最大生命值加成（永久+临时）
   * @returns 包含所有加成的最大生命值
   * @private - 内部方法，仅在需要重新计算最大生命值时调用
   */
  private calculateMaxHealth(): number {
    // 计算永久加成
    const permanentMaxHealthBonus = this.permanentBuffs.reduce(
      (total, buff) => total + buff.maxHealthBonus,
      0
    );
    // 计算临时加成
    const temporaryMaxHealthBonus = this.temporaryBuffs.reduce(
      (total, buff) => total + buff.maxHealthBonus,
      0
    );
    return this.baseMaxHealth + permanentMaxHealthBonus + temporaryMaxHealthBonus;
  }

  /**
   * 获取攻击力 - 使用实时计算+缓存的方式获取攻击力
   * @returns 包含所有加成的攻击力
   * @注意事项：如果加成或基础属性发生变化，缓存会自动失效并重新计算
   */
  getAttack(): number {
    if (this.attackCache === null) {
      this.attackCache = this.calculateAttack();
    }
    return this.attackCache;
  }

  /**
   * 获取最大生命值 - 使用实时计算+缓存的方式获取最大生命值
   * @returns 包含所有加成的最大生命值
   * @注意事项：如果加成或基础属性发生变化，缓存会自动失效并重新计算
   */
  getMaxHealth(): number {
    if (this.maxHealthCache === null) {
      this.maxHealthCache = this.calculateMaxHealth();
    }
    return this.maxHealthCache;
  }

  /**
   * 获取所有关键词 - 使用实时计算+缓存的方式获取所有关键词（永久+临时）
   * @returns 所有关键词列表
   * @注意事项：如果永久或临时关键词发生变化，缓存会自动失效并重新计算
   */
  getKeywords(): MinionKeyword[] {
    if (this.keywordsCache === null) {
      this.keywordsCache = [...this.permanentKeywords, ...this.temporaryKeywords];
    }
    return this.keywordsCache;
  }

  /**
   * 攻击力访问器 - 兼容现有代码，返回计算后的攻击力
   * @returns 包含所有加成的攻击力
   */
  get attack(): number {
    return this.getAttack();
  }

  /**
   * 攻击力设置器 - 兼容现有代码，禁止直接设置攻击力
   * @param _value - 未使用的参数，仅用于兼容现有代码
   * @throws 不允许直接设置攻击力
   */
  set attack(_value: number) {
    console.warn('不允许直接设置攻击力，请使用addBuff/removeBuff方法修改');
    // 可以选择忽略或抛出错误
    // throw new Error('不允许直接设置攻击力，请使用addBuff/removeBuff方法修改');
  }

  /**
   * 最大生命值访问器 - 兼容现有代码，返回计算后的最大生命值
   * @returns 包含所有加成的最大生命值
   */
  get maxHealth(): number {
    return this.getMaxHealth();
  }

  /**
   * 最大生命值设置器 - 兼容现有代码，禁止直接设置最大生命值
   * @param _value - 未使用的参数，仅用于兼容现有代码
   * @throws 不允许直接设置最大生命值
   */
  set maxHealth(_value: number) {
    console.warn('不允许直接设置最大生命值，请使用addBuff/removeBuff方法修改');
    // 可以选择忽略或抛出错误
    // throw new Error('不允许直接设置最大生命值，请使用addBuff/removeBuff方法修改');
  }

  /**
   * 关键词访问器 - 兼容现有代码，返回所有关键词
   * @returns 所有关键词列表
   */
  get keywords(): MinionKeyword[] {
    return this.getKeywords();
  }

  /**
   * 关键词设置器 - 兼容现有代码，禁止直接设置关键词
   * @param _value - 未使用的参数，仅用于兼容现有代码
   * @throws 不允许直接设置关键词
   */
  set keywords(_value: MinionKeyword[]) {
    console.warn('不允许直接设置关键词，请使用相关方法修改');
    // 可以选择忽略或抛出错误
    // throw new Error('不允许直接设置关键词，请使用相关方法修改');
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
      this.baseAttack = this.upgradeCard.attack;
      this.baseMaxHealth = this.upgradeCard.health;
      this.health = this.upgradeCard.health;
      this.text = this.upgradeCard.text;
      this.mechanics = this.upgradeCard.mechanics;
      this.permanentKeywords = Minion.mapMechanicsToKeywords(this.upgradeCard.mechanics);
      this.hasDivineShield = this.permanentKeywords.includes(MinionKeyword.DIVINE_SHIELD);
      this.hasReborn = this.permanentKeywords.includes(MinionKeyword.REBORN);
      this.clearCache(); // 清除缓存，确保属性重新计算
    }
  }

  /**
   * 克隆随从 - 创建一个随从的副本
   * @returns 克隆的随从实例
   * @使用方式：当需要创建随从副本时调用，如购买随从或战斗时复制随从
   */
  clone(): Minion {
    // 使用当前实例的构造函数创建副本，确保子类也能正确克隆
    return new (this.constructor as typeof Minion)({
      ...(this as any),
      id: IdGenerator.generateRandomId(), // 生成新的ID
      permanentBuffs: [...this.permanentBuffs], // 深拷贝永久加成
      temporaryBuffs: [...this.temporaryBuffs], // 深拷贝临时加成
      mechanics: [...this.mechanics], // 深拷贝机制列表
      referencedTags: [...this.referencedTags], // 深拷贝引用标签
      minionTypes: [...this.minionTypes], // 深拷贝随从类型列表
      minionTypesCN: [...this.minionTypesCN], // 深拷贝中文随从类型列表
      permanentKeywords: [...this.permanentKeywords], // 深拷贝永久关键词
      temporaryKeywords: [...this.temporaryKeywords], // 深拷贝临时关键词
      hasAttacked: false, // 重置攻击状态
      isFrozen: false, // 重置冻结状态
    });
  }

  /**
   * 重置临时效果 - 清除所有临时加成和临时关键词
   * @returns 重置的效果数量
   * @使用方式：在回合结束或需要清除临时效果时调用
   */
  resetTemporaryEffects(): { buffsRemoved: number; keywordsRemoved: number } {
    const buffsRemoved = this.temporaryBuffs.length;
    const keywordsRemoved = this.temporaryKeywords.length;

    // 清空临时加成和临时关键词数组
    this.temporaryBuffs = [];
    this.temporaryKeywords = [];

    // 清除缓存，确保属性重新计算
    this.clearCache();

    // 更新相关标志
    this.hasDivineShield = this.permanentKeywords.includes(MinionKeyword.DIVINE_SHIELD);
    this.hasReborn = this.permanentKeywords.includes(MinionKeyword.REBORN);

    return { buffsRemoved, keywordsRemoved };
  }

  /**
   * 添加加成 - 为随从添加一个属性加成
   * @param buff - 要添加的加成对象
   * @returns 是否成功添加
   * @注意事项：根据buff.type自动区分永久和临时加成，默认永久
   */
  addBuff(buff: MinionBuff): boolean {
    // 确定加成类型
    const isTemporary = buff.type === 'temporary';
    const targetBuffsArray = isTemporary ? this.temporaryBuffs : this.permanentBuffs;

    // 检查是否已存在相同ID的加成
    const existingIndex = targetBuffsArray.findIndex(b => b.id === buff.id);
    if (existingIndex >= 0) {
      // 如果已存在，更新该加成
      targetBuffsArray[existingIndex] = { ...targetBuffsArray[existingIndex], ...buff };
    } else {
      // 如果不存在，添加新加成
      targetBuffsArray.push(buff);
    }

    // 清除缓存，确保属性重新计算
    this.clearCache();

    return true;
  }

  /**
   * 移除加成 - 从随从移除一个属性加成
   * @param buffId - 要移除的加成ID
   * @returns 是否成功移除
   * @注意事项：同时检查永久和临时加成列表
   */
  removeBuff(buffId: string): boolean {
    let removed = false;

    // 检查并移除永久加成
    const permanentInitialLength = this.permanentBuffs.length;
    this.permanentBuffs = this.permanentBuffs.filter(buff => buff.id !== buffId);
    removed = removed || this.permanentBuffs.length < permanentInitialLength;

    // 检查并移除临时加成
    const temporaryInitialLength = this.temporaryBuffs.length;
    this.temporaryBuffs = this.temporaryBuffs.filter(buff => buff.id !== buffId);
    removed = removed || this.temporaryBuffs.length < temporaryInitialLength;

    // 如果有加成被移除，清除缓存
    if (removed) {
      this.clearCache();
    }

    return removed;
  }

  /**
   * 移除所有临时加成 - 清空临时加成数组
   * @returns 移除的加成数量
   * @使用方式：在回合结束或需要清除临时加成时调用
   */
  removeTemporaryBuffs(): number {
    const removedCount = this.temporaryBuffs.length;
    this.temporaryBuffs = [];

    // 清除缓存，确保属性重新计算
    this.clearCache();

    return removedCount;
  }

  /**
   * 移除所有临时关键词 - 清空临时关键词数组
   * @returns 移除的关键词数量
   * @使用方式：在回合结束或需要清除临时关键词时调用
   */
  removeTemporaryKeywords(): number {
    const removedCount = this.temporaryKeywords.length;
    this.temporaryKeywords = [];

    // 清除缓存，确保关键词重新计算
    this.clearCache();

    // 更新相关标志
    this.hasDivineShield = this.permanentKeywords.includes(MinionKeyword.DIVINE_SHIELD);
    this.hasReborn = this.permanentKeywords.includes(MinionKeyword.REBORN);

    return removedCount;
  }

  /**
   * 回合开始时处理 - 清除所有临时加成和关键词
   * @使用方式：在新回合开始时调用
   */
  onTurnStart(): void {
    // 使用重置临时效果方法处理
    const result = this.resetTemporaryEffects();
    // 将日志输出放在方法内部
    console.log(
      `${this.nameCN} 移除了 ${result.buffsRemoved} 个临时加成和 ${result.keywordsRemoved} 个临时关键词`
    );
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
    if (card.id === this.id) {
      this.onMinionPlayed(game);
      this.battlecry(game);
    } else {
      // 如果使用的是其他卡牌，触发onOtherCardPlayed
      this.onOtherCardPlayed(card, game);
    }
  }
}
