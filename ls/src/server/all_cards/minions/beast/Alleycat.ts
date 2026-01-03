import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
import db_card from '@/server/db/db_card';

/**
 * 雄斑虎类 - 继承自Minion，实现雄斑虎的特殊效果
 */
export class Alleycat extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 重写战吼方法
   * @param player - 玩家实例
   * 效果：战吼：召唤一头1/1的雌斑虎
   */
  battlecry(player: Player): void {
    super.battlecry(player);
    // 战吼：召唤一头1/1的雌斑虎
    console.log('雄斑虎：召唤一头1/1的雌斑虎');

    // 获取雌斑虎的strId
    const tabbycatStrId = 'BG_CFM_315t';

    // 从db_card获取雌斑虎实例
    const tabbycat = db_card.getCardByStrId(tabbycatStrId) as Minion;

    if (!tabbycat) {
      console.error(`无法找到雌斑虎，strId: ${tabbycatStrId}`);
      return;
    }

    // 获取当前随从在战场上的位置
    const index = player.getMinionIndexOnBattlefield(this);

    // 将雌斑虎召唤到当前玩家的战场
    player.添加随从到战场(tabbycat, index);
  }
}

const BASE_DATA = {
  id: 96758,
  strId: 'BG_CFM_315',
  cardType: 'minion',
  name: 'Alleycat',
  nameCN: '雄斑虎',
  text: '<b>战吼：</b>召唤一头1/1的雌斑虎。',
  mechanics: ['BATTLECRY'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_CFM_315_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_CFM_315_cardArtFromHsJson256x.png',
  tokens: [
    {
      id: 96759,
      strId: 'BG_CFM_315t',
      cardType: 'minion',
      name: 'Tabbycat',
      nameCN: '雌斑虎',
      text: '',
      mechanics: [],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_CFM_315t_battlegroundsImage.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_CFM_315t_cardArtFromHsJson256x.png',
      tier: 1,
      health: 1,
      attack: 1,
      minionTypes: ['beast'],
      minionTypesCN: ['野兽'],
      upgradeCard: {
        id: 60054,
        strId: 'TB_BaconUps_093t',
        cardType: 'minion',
        name: 'Tabbycat',
        nameCN: '雌斑虎',
        text: '',
        mechanics: [],
        referencedTags: [],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_093t_imageFromBlizzardSb.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_093t_cardArtFromHsJson256x.png',
        tier: 1,
        health: 2,
        attack: 2,
        minionTypes: ['beast'],
        minionTypesCN: ['野兽'],
      },
    },
  ],
  tier: 1,
  health: 1,
  attack: 1,
  minionTypes: ['beast'],
  minionTypesCN: ['野兽'],
  upgradeCard: {
    id: 60053,
    strId: 'TB_BaconUps_093',
    cardType: 'minion',
    name: 'Alleycat',
    nameCN: '雄斑虎',
    text: '<b>战吼：</b>召唤一头2/2的雌斑虎。',
    mechanics: ['BATTLECRY'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_093_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_093_cardArtFromHsJson256x.png',
    tokens: [
      {
        id: 60054,
        strId: 'TB_BaconUps_093t',
        cardType: 'minion',
        name: 'Tabbycat',
        nameCN: '雌斑虎',
        text: '',
        mechanics: [],
        referencedTags: [],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_093t_imageFromBlizzardSb.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_093t_cardArtFromHsJson256x.png',
        tier: 1,
        health: 2,
        attack: 2,
        minionTypes: ['beast'],
        minionTypesCN: ['野兽'],
      },
    ],
    tier: 1,
    health: 2,
    attack: 2,
    minionTypes: ['beast'],
    minionTypesCN: ['野兽'],
  },
};