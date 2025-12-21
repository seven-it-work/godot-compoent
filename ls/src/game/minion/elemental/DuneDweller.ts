import { Minion } from '../../Minion';

/**
 * 沙丘土著类 - 继承自Minion，实现沙丘土著的特殊效果
 */
export class DuneDweller extends Minion {
  /**
   * 重写战吼方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从被放置到战场时触发
   * 效果：战吼：使酒馆中的元素在本局对战中获得+1/+1
   */
  battlecry(game: any): void {
    // 战吼：使酒馆中的元素在本局对战中获得+1/+1
    console.log('沙丘土著：使酒馆中的元素在本局对战中获得+1/+1');
    // 检查game中是否包含tavern实例
    if (game.tavern) {
      // 调用酒馆的addElementalBonusSource方法，添加+1/+1的元素加成
      game.tavern.addElementalBonusSource(1, 1);
      console.log('成功为酒馆元素添加+1/+1加成');
    } else {
      console.error('未能找到酒馆实例，无法应用元素加成');
    }
  }
}
