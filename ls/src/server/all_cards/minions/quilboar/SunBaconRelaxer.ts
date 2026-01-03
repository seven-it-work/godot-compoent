import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
import db_card from '@/server/db/db_card';

/**
 * 晾膘的游客类 - 继承自Minion，实现晾膘的游客的特殊效果
 */
export class SunBaconRelaxer extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 出售随从时触发的方法
   * @param _player - 玩家实例
   * 效果：当你出售本随从时，获取2张鲜血宝石
   */
  onSell(_player: Player): void {
    // 当出售本随从时，获取2张鲜血宝石
    const gemCount = 2;

    // 获取鲜血宝石的strId
    const bloodGemStrId = 'BG20_GEM';

    // 创建并添加鲜血宝石到手牌
    for (let i = 0; i < gemCount; i++) {
      const bloodGem = db_card.getCardByStrId(bloodGemStrId);
      if (bloodGem) {
        _player.添加卡牌到手牌(bloodGem);
      }
    }
  }
}

const BASE_DATA = {
  id: 70147,
  strId: 'BG20_301',
  cardType: 'minion',
  name: 'Sun-Bacon Relaxer',
  nameCN: '晾膘的游客',
  text: '当你出售本随从时，获取2张<b>鲜血宝石</b>。',
  mechanics: [],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_301_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_301_cardArtFromHsJson256x.png',
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
  health: 3,
  attack: 2,
  minionTypes: ['quilboar'],
  minionTypesCN: ['野猪人'],
  upgradeCard: {
    id: 70148,
    strId: 'BG20_301_G',
    cardType: 'minion',
    name: 'Sun-Bacon Relaxer',
    nameCN: '晾膘的游客',
    text: '当你出售本随从时，获取4张<b>鲜血宝石</b>。',
    mechanics: [],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_301_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_301_G_cardArtFromHsJson256x.png',
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
    health: 6,
    attack: 4,
    minionTypes: ['quilboar'],
    minionTypesCN: ['野猪人'],
  },
};
