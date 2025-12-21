import { Minion } from '../../Minion';

/**
 * 晾膘的游客类 - 继承自Minion，实现晾膘的游客的特殊效果
 */
export class SunBaconRelaxer extends Minion {
  /**
   * 重写出售随从时触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当玩家出售本随从时触发
   * 效果：当你出售本随从时，获取2张鲜血宝石
   */
  onSell(_game: any): void {
    // 当出售本随从时，获取2张鲜血宝石
    console.log('晾膘的游客：获取2张鲜血宝石');
  }
}
