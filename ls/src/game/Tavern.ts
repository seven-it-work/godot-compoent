import { Minion, MinionType } from './Minion';

// 各星级随从数量限制（公共池）
const MINION_POOL_LIMITS = {
  1: 18,
  2: 15,
  3: 13,
  4: 11,
  5: 9,
  6: 6,
};

// 酒馆类
export class Tavern {
  level: number;
  minionPool: Minion[];
  availableMinions: Minion[];
  isFrozen: boolean;
  refreshCost: number;
  upgradeCosts: number[];
  // 记录每个随从ID在池中的剩余数量
  private minionCounts: Map<string, number>;

  constructor(level: number = 1, minionPool: Minion[] = []) {
    this.level = level;
    this.minionPool = minionPool;
    this.availableMinions = [];
    this.isFrozen = false;
    this.refreshCost = 1;
    this.upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
    this.minionCounts = new Map();

    // 初始化随从池计数
    this.initializeMinionCounts();
    // 初始化时刷新一次酒馆
    this.refresh();
  }

  // 初始化随从池计数
  private initializeMinionCounts(): void {
    // 按ID分组计数
    const idCounts = new Map<number, number>();
    this.minionPool.forEach(minion => {
      idCounts.set(minion.id, (idCounts.get(minion.id) || 0) + 1);
    });

    // 设置每个随从的初始数量（不超过星级限制）
    idCounts.forEach((count, id) => {
      const minion = this.minionPool.find(m => m.id === id);
      if (minion) {
        const limit = (MINION_POOL_LIMITS as any)[minion.tier] || 0;
        this.minionCounts.set(id.toString(), Math.min(count, limit));
      }
    });
  }

  // 刷新酒馆中的随从
  refresh(): void {
    if (this.isFrozen) {
      return;
    }

    // 清空现有随从
    this.availableMinions = [];

    // 根据酒馆等级设置显示的随从数量
    let minionsToShow = 3; // 默认1级酒馆
    switch (this.level) {
      case 1:
        minionsToShow = 3;
        break;
      case 2:
      case 3:
        minionsToShow = 4;
        break;
      case 4:
      case 5:
        minionsToShow = 5;
        break;
      case 6:
        minionsToShow = 6;
        break;
    }

    // 从随从池中随机选择随从
    for (let i = 0; i < minionsToShow; i++) {
      const minion = this.selectRandomMinion();
      if (minion) {
        this.availableMinions.push(minion);
      }
    }
  }

  // 随机选择一个符合条件的随从
  private selectRandomMinion(): Minion | null {
    // 获取可选择的随从（星级不超过酒馆等级，且池中有剩余）
    const availableMinions = this.minionPool.filter(minion => {
      const count = this.minionCounts.get(minion.id.toString()) || 0;
      return minion.tier <= this.level && count > 0;
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

  // 获取当前酒馆等级应显示的随从数量
  getMinionsToShowCount(): number {
    switch (this.level) {
      case 1:
        return 3;
      case 2:
      case 3:
        return 4;
      case 4:
      case 5:
        return 5;
      case 6:
        return 6;
      default:
        return 3;
    }
  }

  // 升级酒馆
  upgrade(): number {
    if (this.level >= 6) {
      return -1;
    }

    return this.upgradeCosts[this.level] || 0;
  }

  // 冻结酒馆
  freeze(): void {
    this.isFrozen = true;
  }

  // 解冻酒馆
  unfreeze(): void {
    this.isFrozen = false;
  }

  // 获取特定类型的随从
  getMinionsByType(type: MinionType): Minion[] {
    return this.minionPool.filter(minion => minion.minionTypes.includes(type));
  }

  // 获取特定星级的随从
  getMinionsByStar(star: number): Minion[] {
    return this.minionPool.filter(minion => minion.tier === star);
  }

  // 从酒馆中购买随从
  buyMinion(index: number): Minion | null {
    if (index < 0 || index >= this.availableMinions.length) {
      return null;
    }

    const minion = this.availableMinions[index];
    if (minion) {
      // 将该位置设置为undefined，而不是使用splice移除，这样可以保持固定位置
      this.availableMinions[index] = undefined as any;

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

  // 获取随从在公共池中的剩余数量
  getMinionRemainingCount(minionId: string): number {
    return this.minionCounts.get(minionId) || 0;
  }

  // 获取当前酒馆等级可刷新的随从星级概率
  getStarProbabilities(): Map<number, number> {
    const probs = new Map<number, number>();

    switch (this.level) {
      case 1:
        probs.set(1, 1.0);
        break;
      case 2:
        probs.set(1, 0.66);
        probs.set(2, 0.34);
        break;
      case 3:
        probs.set(1, 0.33);
        probs.set(2, 0.45);
        probs.set(3, 0.22);
        break;
      case 4:
        probs.set(1, 0.05);
        probs.set(2, 0.25);
        probs.set(3, 0.45);
        probs.set(4, 0.25);
        break;
      case 5:
        probs.set(2, 0.1);
        probs.set(3, 0.3);
        probs.set(4, 0.4);
        probs.set(5, 0.2);
        break;
      case 6:
        probs.set(3, 0.15);
        probs.set(4, 0.3);
        probs.set(5, 0.35);
        probs.set(6, 0.2);
        break;
    }

    return probs;
  }
}
