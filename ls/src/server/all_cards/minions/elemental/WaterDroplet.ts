import { Minion, minion_utils } from '@/server/controller/entity/Minion';

/**
 * WaterDroplet类 - 继承自Minion，实现WaterDroplet随从
 */
export class WaterDroplet extends Minion {
  inTavern: boolean = false;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
}

const BASE_DATA = {
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
};
