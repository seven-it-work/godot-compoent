import { Minion } from '../Minion';

/**
 * 拔线机类 - 继承自Minion，实现拔线机的特殊效果
 */
export class CordPuller extends Minion {
  /**
   * 重写亡语触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从死亡时触发
   * 效果：亡语：召唤一个1/1的微型机器人
   */
  onDeath(_game: any): void {
    // 亡语：召唤一个1/1的微型机器人
    console.log('拔线机：召唤一个1/1的微型机器人');
  }
}
