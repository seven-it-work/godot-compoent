import { Player } from './Player';
import { Tavern } from './Tavern';

// 酒馆系统核心管理类
export class TavernSystem {
  private player: Player;
  private tavern: Tavern;
  private upgradeCostDecrement: number;

  constructor(player: Player, tavern: Tavern) {
    this.player = player;
    this.tavern = tavern;
    this.upgradeCostDecrement = 0;
  }

  // 获取当前升级费用（考虑递减规则）
  getCurrentUpgradeCost(): number {
    const baseCosts = [0, 5, 7, 8, 10, 12, 12];
    const baseCost = baseCosts[this.player.tavernLevel] || 0;
    return Math.max(0, baseCost - this.upgradeCostDecrement);
  }

  // 升级酒馆（考虑费用递减规则）
  upgradeTavern(): boolean {
    const cost = this.getCurrentUpgradeCost();

    if (this.player.gold < cost) {
      return false;
    }

    if (this.player.tavernLevel >= 6) {
      return false;
    }

    // 扣除费用
    this.player.gold -= cost;
    // 升级玩家酒馆等级
    this.player.tavernLevel += 1;
    // 更新酒馆等级
    this.tavern.level = this.player.tavernLevel;
    // 重置费用递减计数
    this.upgradeCostDecrement = 0;
    // 刷新酒馆
    this.tavern.refresh();

    return true;
  }

  // 刷新酒馆
  refreshTavern(): boolean {
    if (this.player.gold < 1) {
      return false;
    }

    // 扣除刷新费用
    this.player.gold -= 1;
    // 刷新酒馆随从
    this.tavern.refresh();

    return true;
  }

  // 冻结酒馆
  freezeTavern(): void {
    this.tavern.freeze();
  }

  // 解冻酒馆
  unfreezeTavern(): void {
    this.tavern.unfreeze();
  }

  // 购买随从
  buyMinion(index: number): boolean {
    const minion = this.tavern.buyMinion(index);
    if (minion) {
      return this.player.recruitMinion(minion);
    }
    return false;
  }

  // 处理回合结束，更新费用递减计数
  onTurnEnd(): void {
    // 每回合未升级，费用递减计数+1
    this.upgradeCostDecrement += 1;
  }

  // 检查是否可以升级酒馆
  canUpgradeTavern(): boolean {
    return this.player.gold >= this.getCurrentUpgradeCost() && this.player.tavernLevel < 6;
  }

  // 获取酒馆等级对应的随从显示数量
  getMinionsToShowCount(): number {
    switch (this.player.tavernLevel) {
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

  // 获取当前酒馆等级可刷新的最大随从星级
  getMaxMinionStar(): number {
    return Math.min(this.player.tavernLevel, 6);
  }
}
