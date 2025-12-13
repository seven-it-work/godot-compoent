import { Minion, MinionType } from './Minion';

/**
 * 各星级随从数量限制（公共池） - 定义每个星级在公共池中最多能出现的随从数量
 */
const MINION_POOL_LIMITS = {
  1: 18, // 1星随从最多18个
  2: 15, // 2星随从最多15个
  3: 13, // 3星随从最多13个
  4: 11, // 4星随从最多11个
  5: 9, // 5星随从最多9个
  6: 6, // 6星随从最多6个
};

/**
 * 酒馆类 - 管理酒馆相关逻辑，包括随从刷新、购买、升级等
 */
export class Tavern {
  /** 酒馆等级 - 决定可刷新的随从星级范围 */
  level: number;
  /** 随从池 - 所有可用的随从列表 */
  minionPool: Minion[];
  /** 可用随从 - 当前酒馆中显示的随从，固定7个位置，null表示该位置为空 */
  availableMinions: (Minion | null)[];
  /** 是否冻结 - 冻结状态下刷新不会改变随从列表 */
  isFrozen: boolean;
  /** 刷新费用 - 刷新酒馆所需的金币 */
  refreshCost: number;
  /** 升级费用数组 - 各级别升级酒馆所需的金币 */
  upgradeCosts: number[];
  /** 随从计数映射 - 记录每个随从ID在公共池中的剩余数量 */
  private minionCounts: Map<string, number>;
  /** 元素加成 - 记录酒馆中元素随从获得的加成值 */
  private elementalBonus: { attack: number; health: number };
  /** 元素加成来源计数 - 记录产生元素加成的来源数量 */
  private elementalBonusSources: number;

  /**
   * 酒馆构造函数
   * @param level - 初始酒馆等级，默认为1
   * @param minionPool - 初始随从池，默认为空数组
   */
  constructor(level: number = 1, minionPool: Minion[] = []) {
    this.level = level;
    this.minionPool = minionPool;
    // 固定7个位置，默认null
    this.availableMinions = new Array(7).fill(null);
    this.isFrozen = false;
    this.refreshCost = 1;
    this.upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
    this.minionCounts = new Map();
    // 元素加成初始化
    this.elementalBonus = { attack: 0, health: 0 };
    this.elementalBonusSources = 0;

    // 初始化随从池计数
    this.initializeMinionCounts();
    // 初始化时刷新一次酒馆
    this.refresh();
  }

  /**
   * 初始化随从池计数 - 计算并设置每个随从在公共池中的初始数量
   * @private - 内部方法，用于酒馆初始化
   */
  private initializeMinionCounts(): void {
    // 按ID分组计数
    const idCounts = new Map<string | number, number>();
    this.minionPool.forEach(minion => {
      idCounts.set(minion.id, (idCounts.get(minion.id) || 0) + 1);
    });

    // 设置每个随从的初始数量（不超过星级限制）
    idCounts.forEach((count, id) => {
      const minion = this.minionPool.find(m => m.id === id);
      if (minion) {
        const tier = minion.tier || 1;
        const limit = (MINION_POOL_LIMITS as any)[tier] || 0;
        this.minionCounts.set(id.toString(), Math.min(count, limit));
      }
    });
  }

  /**
   * 设置可用随从 - 为指定位置设置随从并应用加成
   * @param index - 位置索引
   * @param minion - 要设置的随从
   * @使用方式：作为设置availableMinions的单一入口
   */
  setAvailableMinion(index: number, minion: Minion | null): void {
    this.availableMinions[index] = minion;
    // 如果是元素随从且不为null，应用元素加成
    if (minion && minion.minionTypes.includes(MinionType.ELEMENTAL)) {
      // 移除旧的元素加成
      minion.removeBuff('elemental_tavern_bonus');
      // 添加新的元素加成
      minion.addBuff({
        id: 'elemental_tavern_bonus',
        source: '酒馆元素加成',
        attackBonus: this.elementalBonus.attack,
        healthBonus: this.elementalBonus.health,
        maxHealthBonus: this.elementalBonus.health,
      });
    }
  }

  /**
   * 刷新酒馆中的随从 - 从随从池中随机选择随从填充到可用随从列表
   * @使用方式：当玩家点击刷新酒馆按钮或游戏自动刷新时调用
   */
  refresh(): void {
    // 如果酒馆被冻结，不执行刷新
    if (this.isFrozen) {
      return;
    }

    // 从随从池中随机选择随从，替换对应位置的随从
    const minionsToShow = this.getMinionsToShowCount();
    for (let i = 0; i < minionsToShow; i++) {
      const minion = this.selectRandomMinion();
      this.setAvailableMinion(i, minion);
    }
  }

  /**
   * 随机选择一个符合条件的随从 - 从随从池中选择一个星级不超过酒馆等级且仍有剩余数量的随从
   * @returns 选择的随从实例，没有可用随随时返回null
   * @private - 内部方法，用于刷新酒馆
   */
  private selectRandomMinion(): Minion | null {
    // 获取可选择的随从（星级不超过酒馆等级，且池中有剩余）
    const availableMinions = this.minionPool.filter(minion => {
      const count = this.minionCounts.get(minion.id.toString()) || 0;
      return (minion.tier || 1) <= this.level && count > 0;
    });

    if (availableMinions.length === 0) {
      return null;
    }

    // 随机选择
    const randomIndex = Math.floor(Math.random() * availableMinions.length);
    const selectedMinion = availableMinions[randomIndex];

    if (selectedMinion) {
      // 克隆并返回
      return selectedMinion.clone();
    }

    return null;
  }

  /**
   * 获取当前酒馆等级应显示的随从数量
   * @returns 应显示的随从数量
   * @使用方式：刷新酒馆时决定显示多少个随从
   */
  getMinionsToShowCount(): number {
    switch (this.level) {
      case 1:
        return 3; // 1级酒馆显示3个随从
      case 2:
      case 3:
        return 4; // 2-3级酒馆显示4个随从
      case 4:
      case 5:
        return 5; // 4-5级酒馆显示5个随从
      case 6:
        return 6; // 6级酒馆显示6个随从
      default:
        return 3; // 默认显示3个随从
    }
  }

  /**
   * 升级酒馆 - 计算升级酒馆所需的金币
   * @returns 升级所需的金币，已达最高等级时返回-1
   * @使用方式：当玩家尝试升级酒馆时调用，用于检查费用
   */
  upgrade(): number {
    if (this.level >= 6) {
      return -1; // 已达最高等级
    }

    return this.upgradeCosts[this.level] || 0;
  }

  /**
   * 冻结酒馆 - 设置酒馆为冻结状态，刷新不会改变随从列表
   * @使用方式：当玩家使用冻结技能或道具时调用
   */
  freeze(): void {
    this.isFrozen = true;
  }

  /**
   * 解冻酒馆 - 取消酒馆的冻结状态
   * @使用方式：当冻结效果结束时调用
   */
  unfreeze(): void {
    this.isFrozen = false;
  }

  /**
   * 获取特定类型的随从 - 从随从池中筛选特定类型的随从
   * @param type - 随从类型
   * @returns 符合条件的随从数组
   * @使用方式：当需要获取特定类型的随从时调用
   */
  getMinionsByType(type: MinionType): Minion[] {
    return this.minionPool.filter(minion => minion.minionTypes.includes(type));
  }

  /**
   * 获取特定星级的随从 - 从随从池中筛选特定星级的随从
   * @param star - 星级
   * @returns 符合条件的随从数组
   * @使用方式：当需要获取特定星级的随从时调用
   */
  getMinionsByStar(star: number): Minion[] {
    return this.minionPool.filter(minion => minion.tier === star);
  }

  /**
   * 从酒馆中购买随从 - 将酒馆中的随从购买到玩家替补席
   * @param index - 要购买的随从在可用随从列表中的索引
   * @returns 购买的随从实例，无效索引或该位置为空时返回null
   * @使用方式：当玩家点击酒馆中的随从卡片购买时调用
   */
  buyMinion(index: number): Minion | null {
    if (index < 0 || index >= this.availableMinions.length) {
      return null; // 索引超出范围
    }

    const minion = this.availableMinions[index];
    if (minion) {
      // 将该位置设置为null，而不是使用splice移除，这样可以保持固定位置
      this.setAvailableMinion(index, null);

      // 从公共池中扣除该随从
      const currentCount = this.minionCounts.get(minion.id.toString()) || 0;
      if (currentCount > 0) {
        this.minionCounts.set(minion.id.toString(), currentCount - 1);
      }

      // 不自动刷新，让空位显示为空
      // 只有当玩家主动刷新酒馆时，才会出现新的卡片

      return minion;
    }
    return null;
  }

  /**
   * 获取随从在公共池中的剩余数量
   * @param minionId - 随从ID
   * @returns 剩余数量
   * @使用方式：当需要显示随从剩余数量时调用
   */
  getMinionRemainingCount(minionId: string): number {
    return this.minionCounts.get(minionId) || 0;
  }

  /**
   * 获取当前酒馆等级可刷新的随从星级概率
   * @returns 星级概率映射，key为星级，value为出现概率
   * @使用方式：当需要显示各星级随从出现概率时调用
   */
  getStarProbabilities(): Map<number, number> {
    const probs = new Map<number, number>();

    switch (this.level) {
      case 1:
        probs.set(1, 1.0); // 1级酒馆只能刷新1星随从
        break;
      case 2:
        probs.set(1, 0.66); // 2级酒馆：66% 1星，34% 2星
        probs.set(2, 0.34);
        break;
      case 3:
        probs.set(1, 0.33); // 3级酒馆：33% 1星，45% 2星，22% 3星
        probs.set(2, 0.45);
        probs.set(3, 0.22);
        break;
      case 4:
        probs.set(1, 0.05); // 4级酒馆：5% 1星，25% 2星，45% 3星，25% 4星
        probs.set(2, 0.25);
        probs.set(3, 0.45);
        probs.set(4, 0.25);
        break;
      case 5:
        probs.set(2, 0.1); // 5级酒馆：10% 2星，30% 3星，40% 4星，20% 5星
        probs.set(3, 0.3);
        probs.set(4, 0.4);
        probs.set(5, 0.2);
        break;
      case 6:
        probs.set(3, 0.15); // 6级酒馆：15% 3星，30% 4星，35% 5星，20% 6星
        probs.set(4, 0.3);
        probs.set(5, 0.35);
        probs.set(6, 0.2);
        break;
    }

    return probs;
  }

  /**
   * 添加元素加成来源 - 增加酒馆中元素随从的加成
   * @param attackBonus - 攻击力加成值
   * @param healthBonus - 生命值加成值
   * @returns 是否成功添加
   * @使用方式：当触发元素加成效果时调用
   */
  addElementalBonusSource(attackBonus: number, healthBonus: number): boolean {
    this.elementalBonusSources++;
    // 更新总加成值
    this.elementalBonus.attack += attackBonus;
    this.elementalBonus.health += healthBonus;
    // 应用加成到当前酒馆中的所有元素随从
    this.availableMinions.forEach(minion => {
      if (minion && minion.minionTypes.includes(MinionType.ELEMENTAL)) {
        this.applyElementalBonuses(minion);
      }
    });
    return true;
  }

  /**
   * 移除元素加成来源 - 减少酒馆中元素随从的加成
   * @param attackBonus - 要移除的攻击力加成值
   * @param healthBonus - 要移除的生命值加成值
   * @returns 是否成功移除
   * @使用方式：当元素加成效果结束时调用
   */
  removeElementalBonusSource(attackBonus: number, healthBonus: number): boolean {
    if (this.elementalBonusSources <= 0) {
      return false;
    }
    this.elementalBonusSources--;
    // 更新总加成值
    this.elementalBonus.attack = Math.max(0, this.elementalBonus.attack - attackBonus);
    this.elementalBonus.health = Math.max(0, this.elementalBonus.health - healthBonus);
    // 重新应用加成到当前酒馆中的所有元素随从
    this.availableMinions.forEach(minion => {
      if (minion && minion.minionTypes.includes(MinionType.ELEMENTAL)) {
        this.applyElementalBonuses(minion);
      }
    });
    return true;
  }

  /**
   * 应用元素加成 - 为单个元素随从添加或更新加成
   * @param minion - 要应用加成的随从
   * @使用方式：当随从被添加到酒馆或元素加成值变化时调用
   */
  applyElementalBonuses(minion: Minion): void {
    // 移除旧的元素加成
    minion.removeBuff('elemental_tavern_bonus');
    // 添加新的元素加成
    minion.addBuff({
      id: 'elemental_tavern_bonus',
      source: '酒馆元素加成',
      attackBonus: this.elementalBonus.attack,
      healthBonus: this.elementalBonus.health,
      maxHealthBonus: this.elementalBonus.health,
    });
  }

  /**
   * 调试专用 - 添加随从到酒馆
   * @param minion - 要添加的随从实例
   * @returns 是否成功添加
   * @使用方式：调试时手动添加随从到酒馆
   */
  debugAddMinion(minion: Minion): boolean {
    // 找到第一个空位置（null）
    const emptyIndex = this.availableMinions.findIndex(m => m === null);

    if (emptyIndex !== -1) {
      // 如果有空位置，将随从添加到该位置
      this.setAvailableMinion(emptyIndex, minion);
      return true;
    } else {
      // 如果没有空位置，不能添加
      return false;
    }
  }

  /**
   * 回合开始时处理 - 移除酒馆中所有随从的临时加成和关键词
   */
  onTurnStart(): void {
    // 遍历酒馆中所有随从，移除临时加成和关键词
    this.availableMinions.forEach(minion => {
      if (minion) {
        minion.onTurnStart();
      }
    });
  }
}
