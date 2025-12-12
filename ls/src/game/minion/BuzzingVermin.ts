import { Minion } from '../Minion';

/**
 * 嗡鸣害虫类 - 继承自Minion，实现嗡鸣害虫的特殊效果
 */
export class BuzzingVermin extends Minion {
  /**
   * 构造函数 - 初始化随从的关键词
   * @param 所有父类构造函数参数
   */
  constructor(...args: any[]) {
    super(...args);
    // 嗡鸣害虫具有嘲讽和亡语关键词
    this.keywords = [...this.keywords, 'taunt', 'deathtrattle'];
  }

  /**
   * 重写亡语触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从死亡时触发
   * 效果：亡语：召唤一只2/2的甲虫
   */
  onDeath(_game: any): void {
    // 亡语：召唤一只2/2的甲虫
    console.log('嗡鸣害虫：召唤一只2/2的甲虫');
  }
}
