import { Minion } from '../../Minion';

/**
 * 无害的骨颅类 - 继承自Minion，实现无害的骨颅的特殊效果
 */
export class HarmlessBonehead extends Minion {
  /**
   * 重写亡语触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从死亡时触发
   * 效果：亡语：召唤两个1/1的骷髅
   */
  onDeath(_game: any): void {
    // 亡语：召唤两个1/1的骷髅
    console.log('无害的骨颅：召唤两个1/1的骷髅');
  }
}
