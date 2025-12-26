import { Minion } from '@/game/Minion';

/**
 * 熔融岩石类 - 继承自Minion，实现熔融岩石的特殊效果
 */
export class MoltenRock extends Minion {
  static BASE_DATA = {
    id: 64296,
    strId: 'BGS_127',
    cardType: 'minion',
    name: 'Molten Rock',
    nameCN: '熔融岩石',
    text: '在你使用一张元素牌后，获得+{1}生命值。0在你使用一张元素牌后，获得+{0}/+{1}。',
    mechanics: ['TRIGGER_VISUAL'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_127_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_127_cardArtFromHsJson256x.png',
    tier: 1,
    health: 3,
    attack: 3,
    minionTypes: ['elemental'],
    minionTypesCN: ['元素'],
    upgradeCard: {
      id: 64300,
      strId: 'TB_Baconups_202',
      cardType: 'minion',
      name: 'Molten Rock',
      nameCN: '熔融岩石',
      text: '在你使用一张元素牌后，获得+{1}生命值，触发两次。0在你使用一张元素牌后，获得+{0}/+{1}，触发两次。',
      mechanics: ['TRIGGER_VISUAL'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_Baconups_202_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_Baconups_202_cardArtFromHsJson256x.png',
      tier: 1,
      health: 6,
      attack: 6,
      minionTypes: ['elemental'],
      minionTypesCN: ['元素'],
    },
  };

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
      // 根据是否为金色版本确定加成值（金色版本+2，普通版本+1）
      const healthBonus = this.isGolden ? 2 : 1;

      // 获得生命值加成，使用addBuff方法添加永久加成
      this.addBuff({
        id: `molten_rock_health_buff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source: '熔融岩石战吼',
        attackBonus: 0,
        healthBonus: healthBonus,
        maxHealthBonus: healthBonus,
        type: 'permanent',
      });
    }
  }
}
