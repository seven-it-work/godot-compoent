import { Minion, MinionType } from './Minion';

// 酒馆类
export class Tavern {
  level: number;
  minionPool: Minion[];
  availableMinions: Minion[];
  isFrozen: boolean;
  refreshCost: number;
  upgradeCosts: number[];

  constructor(level: number = 1, minionPool: Minion[] = []) {
    this.level = level;
    this.minionPool = minionPool;
    this.availableMinions = [];
    this.isFrozen = false;
    this.refreshCost = 1;
    this.upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
    
    // 初始化时刷新一次酒馆
    this.refresh();
  }

  // 刷新酒馆中的随从
  refresh(): void {
    if (this.isFrozen) {
      return;
    }

    this.availableMinions = [];
    const minionsToShow = this.getMinionsToShowCount();
    
    // 从随从池中随机选择随从
    for (let i = 0; i < minionsToShow; i++) {
      const availableMinions = this.minionPool.filter(
        minion => minion.star <= this.level && !minion.isGolden
      );
      
      if (availableMinions.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableMinions.length);
        const selectedMinion = availableMinions[randomIndex];
        if (selectedMinion) {
          this.availableMinions.push(selectedMinion.clone());
        }
      }
    }
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
    return this.minionPool.filter(minion => minion.type === type);
  }

  // 获取特定星级的随从
  getMinionsByStar(star: number): Minion[] {
    return this.minionPool.filter(minion => minion.star === star);
  }

  // 从酒馆中购买随从
  buyMinion(index: number): Minion | null {
    if (index < 0 || index >= this.availableMinions.length) {
      return null;
    }
    
    const minion = this.availableMinions[index];
    this.availableMinions.splice(index, 1);
    
    // 如果酒馆被冻结，不刷新，否则刷新一个新随从
    if (!this.isFrozen) {
      this.refreshOne();
    }
    
    return minion;
  }

  // 刷新一个新随从到酒馆
  private refreshOne(): void {
    const availableMinions = this.minionPool.filter(
      minion => minion.star <= this.level && !minion.isGolden
    );
    
    if (availableMinions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMinions.length);
      const selectedMinion = availableMinions[randomIndex];
      if (selectedMinion) {
        this.availableMinions.push(selectedMinion.clone());
      }
    }
  }
}