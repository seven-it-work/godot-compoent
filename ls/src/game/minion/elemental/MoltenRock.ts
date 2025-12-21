import { Minion } from '../../Minion';

/**
 * 熔融岩石类 - 继承自Minion，实现熔融岩石的特殊效果
 */
export class MoltenRock extends Minion {
  /**
   * 重写卡牌被使用时触发的方法
   * @param card - 使用的卡牌实例
   * @param game - 游戏管理器或store实例
   * @使用方式：当玩家从手牌将随从拖拽到战场时触发
   * 效果：在你使用一张元素牌后，获得+1生命值
   */
  onCardPlayed(card: any, _game: any): void {
    // 检查使用的卡牌是否为元素牌
    if (
      card.cardType === 'elemental' ||
      (card.minionTypes && card.minionTypes.includes('elemental'))
    ) {
      // 获得+1生命值
      this.health += 1;
      this.maxHealth += 1;
    }
  }
}
