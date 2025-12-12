import { Minion } from '../Minion';

/**
 * 雄斑虎类 - 继承自Minion，实现雄斑虎的特殊效果
 */
export class Alleycat extends Minion {
  /**
   * 重写战吼方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从被放置到战场时触发
   * 效果：战吼：召唤一头1/1的雌斑虎
   */
  battlecry(_game: any): void {
    // 战吼：召唤一头1/1的雌斑虎
    console.log('雄斑虎：召唤一头1/1的雌斑虎');
  }
}
