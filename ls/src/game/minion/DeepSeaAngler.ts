import { Minion } from '../Minion';

/**
 * 深海钓客类 - 继承自Minion，实现深海钓客的特殊效果
 */
export class DeepSeaAngler extends Minion {
  /**
   * 重写战吼方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从被放置到战场时触发
   * 效果：塑造法术：直到下个回合，使一个随从获得+2生命值和嘲讽
   */
  battlecry(_game: any): void {
    // 塑造法术：直到下个回合，使一个随从获得+2生命值和嘲讽
    console.log('深海钓客：塑造法术：直到下个回合，使一个随从获得+2生命值和嘲讽');
  }
}
