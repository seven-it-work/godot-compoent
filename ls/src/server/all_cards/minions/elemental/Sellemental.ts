import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';

/**
 * Sellemental类 - 继承自Minion，实现Sellemental随从
 */
export class Sellemental extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
  /**
   * 出售随从后
   * @param _player 出售随从的玩家
   */
  出售随从后(_player: Player) {
    for (let index = 0; index < this.getMultiplier(); index++) {
      _player.添加卡牌到手牌(_player.getCardByStrId('BGS_115t'));
    }
  }
}

const BASE_DATA = {
  id: 64038,
  strId: 'BGS_115',
  cardType: 'minion',
  name: 'Sellemental',
  nameCN: '商贩元素',
  text: '当你出售\n本随从时，获取一张3/3的元素牌。',
  mechanics: [],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_115_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_115_cardArtFromHsJson256x.png',
  tokens: [
    {
      id: 64040,
      strId: 'BGS_115t',
      cardType: 'minion',
      name: 'Water Droplet',
      nameCN: '水滴元素',
      text: '',
      mechanics: [],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_115t_battlegroundsImage.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_115t_cardArtFromHsJson256x.png',
      tier: 1,
      health: 3,
      attack: 3,
      minionTypes: ['elemental'],
      minionTypesCN: ['元素'],
      upgradeCard: {
        id: 97580,
        strId: 'BGS_115t_G',
        cardType: 'minion',
        name: 'Water Droplet',
        nameCN: '水滴元素',
        text: '',
        mechanics: [],
        referencedTags: [],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_115t_G_imageFromBlizzardSb.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_115t_G_cardArtFromHsJson256x.png',
        tier: 1,
        health: 6,
        attack: 6,
        minionTypes: ['elemental'],
        minionTypesCN: ['元素'],
      },
    },
  ],
  tier: 2,
  health: 3,
  attack: 3,
  minionTypes: ['elemental'],
  minionTypesCN: ['元素'],
  upgradeCard: {
    id: 64041,
    strId: 'TB_BaconUps_156',
    cardType: 'minion',
    name: 'Sellemental',
    nameCN: '商贩元素',
    text: '当你出售\n本随从时，获取两张3/3的元素牌。',
    mechanics: [],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_156_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_156_cardArtFromHsJson256x.png',
    tokens: [
      {
        id: 64040,
        strId: 'BGS_115t',
        cardType: 'minion',
        name: 'Water Droplet',
        nameCN: '水滴元素',
        text: '',
        mechanics: [],
        referencedTags: [],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_115t_battlegroundsImage.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_115t_cardArtFromHsJson256x.png',
        tier: 1,
        health: 3,
        attack: 3,
        minionTypes: ['elemental'],
        minionTypesCN: ['元素'],
        upgradeCard: {
          id: 97580,
          strId: 'BGS_115t_G',
          cardType: 'minion',
          name: 'Water Droplet',
          nameCN: '水滴元素',
          text: '',
          mechanics: [],
          referencedTags: [],
          img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_115t_G_imageFromBlizzardSb.png',
          art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_115t_G_cardArtFromHsJson256x.png',
          tier: 1,
          health: 6,
          attack: 6,
          minionTypes: ['elemental'],
          minionTypesCN: ['元素'],
        },
      },
    ],
    tier: 2,
    health: 6,
    attack: 6,
    minionTypes: ['elemental'],
    minionTypesCN: ['元素'],
  },
};
