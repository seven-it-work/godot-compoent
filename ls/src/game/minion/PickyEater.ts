import { Minion } from '../Minion';

/**
 * 挑食魔犬类 - 继承自Minion，实现挑食魔犬的特殊效果
 */
export class PickyEater extends Minion {
  /**
   * 重写战吼方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从被放置到战场时触发
   * 效果：战吼：随机吞食酒馆中的一个随从，获得其属性值
   */
  battlecry(_game: any): void {
    // 战吼：随机吞食酒馆中的一个随从，获得其属性值
    console.log('挑食魔犬：随机吞食酒馆中的一个随从，获得其属性值');
  }
}
