import { Minion } from '../Minion';

/**
 * 魔刃豹类 - 继承自Minion，实现魔刃豹的特殊效果
 */
export class Manasaber extends Minion {
  /**
   * 重写亡语触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从死亡时触发
   * 效果：亡语：召唤两只0/1并具有嘲讽的豹宝宝
   */
  onDeath(_game: any): void {
    // 亡语：召唤两只0/1并具有嘲讽的豹宝宝
    console.log('魔刃豹：召唤两只0/1并具有嘲讽的豹宝宝');
  }
}
