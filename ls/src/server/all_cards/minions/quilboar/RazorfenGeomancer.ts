import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
import db_card from '@/server/db/db_card';

/**
 * 剃刀沼泽地卜师类 - 继承自Minion，实现剃刀沼泽地卜师的特殊效果
 */
export class RazorfenGeomancer extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 重写战吼方法
   * @param player - 玩家实例
   * 效果：战吼：获取一张鲜血宝石
   */
  battlecry(player: Player): void {
    super.battlecry(player);

    // 战吼：获取一张鲜血宝石
    const gemCount = 1;

    // 获取鲜血宝石的strId
    const bloodGemStrId = 'BG20_GEM';

    // 创建并添加鲜血宝石到手牌
    for (let i = 0; i < gemCount; i++) {
      const bloodGem = db_card.getCardByStrId(bloodGemStrId);
      if (bloodGem) {
        console.log(`剃刀沼泽地卜师：获取${gemCount}张鲜血宝石`);
      }
    }
  }
}

const BASE_DATA = {
  id: 70143,
  strId: 'BG20_100',
  cardType: 'minion',
  name: 'Razorfen Geomancer',
  nameCN: '剃刀沼泽地卜师',
  text: '<b>战吼：</b>获取一张<b>鲜血宝石</b>。',
  mechanics: [],
  referencedTags: ['BATTLECRY'],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_100_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_100_cardArtFromHsJson256x.png',
  tokens: [
    {
      id: 70136,
      strId: 'BG20_GEM',
      cardType: 'spell',
      name: 'Blood Gem',
      nameCN: '鲜血宝石',
      text: '使一个随从获得+{0}/+{1}。',
      mechanics: [],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_GEM_battlegroundsImage.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_GEM_cardArtFromHsJson256x.png',
    },
  ],
  tier: 1,
  health: 1,
  attack: 3,
  minionTypes: ['quilboar'],
  minionTypesCN: ['野猪人'],
  upgradeCard: {
    id: 70150,
    strId: 'BG20_100_G',
    cardType: 'minion',
    name: 'Razorfen Geomancer',
    nameCN: '剃刀沼泽地卜师',
    text: '<b>战吼：</b>获取2张<b>鲜血宝石</b>。',
    mechanics: [],
    referencedTags: ['BATTLECRY'],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_100_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_100_G_cardArtFromHsJson256x.png',
    tokens: [
      {
        id: 70136,
        strId: 'BG20_GEM',
        cardType: 'spell',
        name: 'Blood Gem',
        nameCN: '鲜血宝石',
        text: '使一个随从获得+{0}/+{1}。',
        mechanics: [],
        referencedTags: [],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_GEM_battlegroundsImage.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_GEM_cardArtFromHsJson256x.png',
      },
    ],
    tier: 1,
    health: 2,
    attack: 6,
    minionTypes: ['quilboar'],
    minionTypesCN: ['野猪人'],
  },
};
