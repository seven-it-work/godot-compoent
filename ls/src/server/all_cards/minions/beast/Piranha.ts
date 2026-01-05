import { Minion, minion_utils } from '@/server/controller/entity/Minion';

/**
 * Piranha类 - 继承自Minion，实现Piranha随从
 */
export class Piranha extends Minion {
  inTavern: boolean = false;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  id: 120403,
  strId: 'BG32_201t',
  cardType: 'minion',
  name: 'Piranha',
  nameCN: '食人鱼',
  text: '',
  mechanics: [],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG32_201t_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG32_201t_cardArtFromHsJson256x.png',
  tier: 1,
  health: 1,
  attack: 3,
  minionTypes: ['beast'],
  minionTypesCN: ['野兽'],
  upgradeCard: {
    id: 120404,
    strId: 'BG32_201_Gt',
    cardType: 'minion',
    name: 'Piranha',
    nameCN: '食人鱼',
    text: '',
    mechanics: [],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG32_201_Gt_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG32_201_Gt_cardArtFromHsJson256x.png',
    tier: 1,
    health: 2,
    attack: 6,
    minionTypes: ['beast'],
    minionTypesCN: ['野兽'],
  },
};
