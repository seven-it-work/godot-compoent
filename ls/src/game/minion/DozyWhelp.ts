import { Minion } from '../Minion';

/**
 * 瞌睡雏龙类 - 继承自Minion，实现瞌睡雏龙的特殊效果
 */
export class DozyWhelp extends Minion {
  /**
   * 构造函数 - 初始化随从的关键词
   * @param 所有父类构造函数参数
   */
  constructor(...args: any[]) {
    super(...args);
    // 瞌睡雏龙具有嘲讽关键词
    this.keywords = [...this.keywords, 'taunt'];
  }

  /**
   * 重写受到攻击时触发的方法
   * @param attacker - 攻击者随从实例
   * @使用方式：当本随从受到攻击时触发
   * 效果：每当本随从受到攻击时，永久获得+1攻击力
   */
  onAttacked(_attacker: any): void {
    // 永久获得+1攻击力
    this.attack += 1;
  }
}
