import { Minion } from '@/game/Minion';

/**
 * 南海卖艺者类 - 继承自Minion，实现南海卖艺者的特殊效果
 */
export class SouthseaBusker extends Minion {
  static BASE_DATA = {
    id: 100008,
    strId: 'BG26_135',
    cardType: 'minion',
    name: 'SouthseaBusker',
    nameCN: '南海卖艺者',
    text: '<b>战吼：</b>下回合获得1枚铸币。',
    mechanics: ['BATTLECRY'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_135_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_135_cardArtFromHsJson256x.png',
    tier: 1,
    health: 1,
    attack: 1,
    minionTypes: ['pirate'],
    minionTypesCN: ['海盗'],
    upgradeCard: {
      id: 100009,
      strId: 'BG26_135_G',
      cardType: 'minion',
      name: 'SouthseaBusker',
      nameCN: '南海卖艺者',
      text: '<b>战吼：</b>下回合获得2枚铸币。',
      mechanics: ['BATTLECRY'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_135_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_135_cardArtFromHsJson256x.png',
      tier: 1,
      health: 2,
      attack: 2,
      minionTypes: ['pirate'],
      minionTypesCN: ['海盗'],
    },
  };
  /**
   * 重写战吼方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从被放置到战场时触发
   * 效果：战吼：下回合获得1枚铸币
   */
  battlecry(game: any): void {
    // 根据是否为金色版本确定额外铸币数量（金色版本+2，普通版本+1）
    const extraGold = this.isGolden ? 2 : 1;

    // 获取当前玩家（战吼效果通常影响触发战吼的玩家）
    if (game && game.currentPlayer) {
      // 增加下回合的额外铸币奖励
      game.currentPlayer.nextTurnExtraGold += extraGold;
      console.log(`南海卖艺者：下回合获得${extraGold}枚铸币`);
    }
  }
}
