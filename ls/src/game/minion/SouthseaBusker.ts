import { Minion } from '../Minion';

/**
 * 南海卖艺者类 - 继承自Minion，实现南海卖艺者的特殊效果
 */
export class SouthseaBusker extends Minion {
  /**
   * 重写战吼方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从被放置到战场时触发
   * 效果：战吼：下回合获得1枚铸币
   */
  battlecry(_game: any): void {
    // 战吼：下回合获得1枚铸币
    console.log('南海卖艺者：下回合获得1枚铸币');
  }
}
