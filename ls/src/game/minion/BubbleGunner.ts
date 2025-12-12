import { Minion } from '../Minion';

/**
 * 气泡枪手类 - 继承自Minion，实现气泡枪手的特殊效果
 */
export class BubbleGunner extends Minion {
  /**
   * 重写战吼方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从被放置到战场时触发
   * 效果：战吼：获得一个随机额外关键词
   */
  battlecry(_game: any): void {
    // 战吼：获得一个随机额外关键词
    console.log('气泡枪手：获得一个随机额外关键词');
  }
}
