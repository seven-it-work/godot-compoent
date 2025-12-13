import { Minion } from '../Minion';
import { CardType } from '../Card';

/**
 * 瞌睡雏龙类 - 继承自Minion，实现瞌睡雏龙的特殊效果
 */
export class DozyWhelp extends Minion {
  /**
   * 构造函数 - 初始化随从的关键词
   * @param 所有父类构造函数参数
   */
  constructor(
    id: number,
    strId: string,
    cardType: CardType,
    name: string,
    nameCN: string,
    text: string,
    mechanics: string[],
    referencedTags: string[],
    img: string,
    art: string,
    tier: number,
    health: number,
    attack: number,
    minionTypes: string[],
    minionTypesCN: string[],
    upgradeCard?: any
  ) {
    super(
      id,
      strId,
      cardType,
      name,
      nameCN,
      text,
      mechanics,
      referencedTags,
      img,
      art,
      tier,
      health,
      attack,
      minionTypes,
      minionTypesCN,
      upgradeCard
    );
    // 瞌睡雏龙没有特殊关键词
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
