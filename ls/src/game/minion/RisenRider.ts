import { Minion } from '../Minion';

/**
 * 复活的骑兵类 - 继承自Minion，实现复活的骑兵的特殊效果
 */
export class RisenRider extends Minion {
  /**
   * 构造函数 - 初始化随从的关键词
   * @param 所有父类构造函数参数
   */
  constructor(...args: any[]) {
    super(...args);
    // 复活的骑兵具有嘲讽和复生关键词
    this.keywords = [...this.keywords, 'taunt', 'reborn'];
  }
}
