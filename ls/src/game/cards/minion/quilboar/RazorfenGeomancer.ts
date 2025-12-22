import { Minion } from '@/game/Minion';
import { BloodGem } from '@/game/cards/spell/BloodGem';

/**
 * 剃刀沼泽地卜师类 - 继承自Minion，实现剃刀沼泽地卜师的特殊效果
 */
export class RazorfenGeomancer extends Minion {
  static BASE_DATA = {
    id: 100200,
    strId: 'BG20_100',
    cardType: 'minion',
    name: 'RazorfenGeomancer',
    nameCN: '剃刀沼泽地卜师',
    text: '<b>战吼：</b>获取一张鲜血宝石。',
    mechanics: ['BATTLECRY'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_100_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_100_cardArtFromHsJson256x.png',
    tier: 1,
    health: 2,
    attack: 2,
    minionTypes: ['quilboar'],
    minionTypesCN: ['野猪人'],
    upgradeCard: {
      id: 100300,
      strId: 'BG20_100_G',
      cardType: 'minion',
      name: 'RazorfenGeomancer',
      nameCN: '剃刀沼泽地卜师',
      text: '<b>战吼：</b>获取两张鲜血宝石。',
      mechanics: ['BATTLECRY'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_100_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_100_cardArtFromHsJson256x.png',
      tier: 1,
      health: 4,
      attack: 4,
      minionTypes: ['quilboar'],
      minionTypesCN: ['野猪人'],
    },
  };

  /**
   * 重写战吼方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从被放置到战场时触发
   * 效果：战吼：获取一张鲜血宝石
   */
  battlecry(game: any): void {
    // 战吼：获取一张鲜血宝石
    // 金色版本获取两张鲜血宝石
    const gemCount = this.isGolden ? 2 : 1;

    if (game && game.currentPlayer) {
      // 创建并添加鲜血宝石到手牌
      for (let i = 0; i < gemCount; i++) {
        const bloodGem = new BloodGem();
        game.currentPlayer.addCardToHand(bloodGem);
      }

      console.log(`剃刀沼泽地卜师：获取${gemCount}张鲜血宝石`);
    }
  }
}
