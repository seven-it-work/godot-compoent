import { Minion, minion_utils } from '@/server/controller/entity/Minion';

/**
 * 雌斑虎类 - 继承自Minion，实现雌斑虎的基本功能
 */
export class Tabbycat extends Minion {
  inTavern: boolean = false;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  id: 100002,
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
    id: 100003,
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
};
