import { Minion } from '../Minion';

/**
 * 复活的骑兵类 - 继承自Minion，实现复活的骑兵的特殊效果
 */
export class RisenRider extends Minion {
  /**
   * 构造函数 - 初始化随从的关键词
   * @param 所有父类构造函数参数
   */
  constructor(
    id: number,
    strId: string,
    cardType: string,
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
    super(id, strId, cardType, name, nameCN, text, mechanics, referencedTags, img, art, tier, health, attack, minionTypes, minionTypesCN, upgradeCard);
    // 复活的骑兵没有特殊关键词
  }
}
