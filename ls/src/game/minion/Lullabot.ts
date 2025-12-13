import { Minion } from '../Minion';
import { CardType } from '../Card';

/**
 * 催眠机器人类 - 继承自Minion，实现催眠机器人的特殊效果
 */
export class Lullabot extends Minion {
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
    // 催眠机器人具有磁力关键词
    // 注意：磁力不是MinionKeyword枚举中的值，所以这里不添加到keywords数组
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
