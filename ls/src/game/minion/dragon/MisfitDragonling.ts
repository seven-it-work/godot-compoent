import { Minion } from '../../Minion';

/**
 * 错巢龙崽类 - 继承自Minion，实现错巢龙崽的特殊效果
 */
export class MisfitDragonling extends Minion {
  /**
   * 重写战斗开始时触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：战斗开始时触发
   * 效果：战斗开始时：获得等同于你当前等级的属性值
   */
  onBattleStart(game: any): void {
    // 获得等同于当前等级的属性值
    const playerLevel = game.player?.tavernLevel || 1;
    this.attack += playerLevel;
    this.health += playerLevel;
    this.maxHealth += playerLevel;
  }
}
