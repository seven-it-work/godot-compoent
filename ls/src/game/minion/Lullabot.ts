import { Minion } from '../Minion';

/**
 * 催眠机器人类 - 继承自Minion，实现催眠机器人的特殊效果
 */
export class Lullabot extends Minion {
  /**
   * 构造函数 - 初始化随从的关键词
   * @param 所有父类构造函数参数
   */
  constructor(...args: any[]) {
    super(...args);
    // 催眠机器人具有磁力关键词
    this.keywords = [...this.keywords, 'magnetic'];
  }

  /**
   * 重写回合结束时触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：在你的回合结束时触发
   * 效果：在你的回合结束时，获得+1生命值
   */
  onTurnEnd(_game: any): void {
    // 获得+1生命值
    this.health += 1;
    this.maxHealth += 1;
  }
}
