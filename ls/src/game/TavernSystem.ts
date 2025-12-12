import { Player } from './Player';
import { Tavern } from './Tavern';

/**
 * 酒馆系统核心管理类 - 负责玩家与酒馆之间的交互逻辑
 */
export class TavernSystem {
  /** 玩家实例 - 与该酒馆系统关联的玩家 */
  private player: Player;
  /** 酒馆实例 - 与该酒馆系统关联的酒馆 */
  private tavern: Tavern;
  /** 升级费用递减计数 - 每回合未升级酒馆时，升级费用会递减 */
  private upgradeCostDecrement: number;

  /**
   * 酒馆系统构造函数
   * @param player - 关联的玩家实例
   * @param tavern - 关联的酒馆实例
   */
  constructor(player: Player, tavern: Tavern) {
    this.player = player;
    this.tavern = tavern;
    this.upgradeCostDecrement = 0;
  }

  /**
   * 获取当前升级费用（考虑递减规则）
   * @returns 当前升级酒馆所需的金币
   * @使用方式：当需要显示升级费用或检查玩家是否有足够金币升级时调用
   */
  getCurrentUpgradeCost(): number {
    const baseCosts = [0, 5, 7, 8, 10, 12, 12];
    const baseCost = baseCosts[this.player.tavernLevel] || 0;
    return Math.max(0, baseCost - this.upgradeCostDecrement);
  }

  /**
   * 升级酒馆（考虑费用递减规则）
   * @returns 是否成功升级酒馆
   * @使用方式：当玩家点击升级酒馆按钮时调用
   */
  upgradeTavern(): boolean {
    const cost = this.getCurrentUpgradeCost();

    // 检查金币是否足够
    if (this.player.gold < cost) {
      return false;
    }

    // 检查是否已达最高等级
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

  /**
   * 刷新酒馆 - 消耗金币刷新酒馆中的随从
   * @returns 是否成功刷新酒馆
   * @使用方式：当玩家点击刷新酒馆按钮时调用
   */
  refreshTavern(): boolean {
    // 检查金币是否足够
    if (this.player.gold < 1) {
      return false;
    }

    // 扣除刷新费用
    this.player.gold -= 1;
    // 刷新酒馆随从
    this.tavern.refresh();

    return true;
  }

  /**
   * 冻结酒馆 - 设置酒馆为冻结状态，刷新不会改变随从列表
   * @使用方式：当玩家使用冻结技能或道具时调用
   */
  freezeTavern(): void {
    this.tavern.freeze();
  }

  /**
   * 解冻酒馆 - 取消酒馆的冻结状态
   * @使用方式：当冻结效果结束时调用
   */
  unfreezeTavern(): void {
    this.tavern.unfreeze();
  }

  /**
   * 购买随从 - 将酒馆中的随从购买到玩家替补席
   * @param index - 要购买的随从在酒馆可用随从列表中的索引
   * @returns 是否成功购买
   * @使用方式：当玩家点击酒馆中的随从卡片购买时调用
   */
  buyMinion(index: number): boolean {
    const minion = this.tavern.buyMinion(index);
    if (minion) {
      return this.player.recruitMinion(minion);
    }
    return false;
  }

  /**
   * 处理回合结束 - 更新升级费用递减计数
   * @使用方式：当玩家结束回合时调用
   */
  onTurnEnd(): void {
    // 每回合未升级，费用递减计数+1
    this.upgradeCostDecrement += 1;
  }

  /**
   * 检查是否可以升级酒馆
   * @returns 是否可以升级酒馆
   * @使用方式：当需要检查玩家是否可以升级酒馆时调用
   */
  canUpgradeTavern(): boolean {
    return this.player.gold >= this.getCurrentUpgradeCost() && this.player.tavernLevel < 6;
  }

  /**
   * 获取酒馆等级对应的随从显示数量
   * @returns 应显示的随从数量
   * @使用方式：当需要确定酒馆应该显示多少个随随时调用
   */
  getMinionsToShowCount(): number {
    switch (this.player.tavernLevel) {
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
   * 获取当前酒馆等级可刷新的最大随从星级
   * @returns 可刷新的最大星级
   * @使用方式：当需要确定酒馆可以刷新哪些星级的随随时调用
   */
  getMaxMinionStar(): number {
    return Math.min(this.player.tavernLevel, 6);
  }
}
