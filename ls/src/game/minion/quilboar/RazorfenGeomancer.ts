import { Minion } from '../../Minion';

/**
 * 剃刀沼泽地卜师类 - 继承自Minion，实现剃刀沼泽地卜师的特殊效果
 */
export class RazorfenGeomancer extends Minion {
  /**
   * 重写战吼方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从被放置到战场时触发
   * 效果：战吼：获取一张鲜血宝石
   */
  battlecry(_game: any): void {
    // 战吼：获取一张鲜血宝石
    // 这里需要实现获取鲜血宝石的逻辑
    // 由于鲜血宝石是一个法术，需要在游戏中添加相应的处理逻辑
    console.log('剃刀沼泽地卜师：获取一张鲜血宝石');
  }
}
