import { Minion, minion_utils } from '@/server/controller/entity/Minion';

/**
 * 豹宝宝类 - 继承自Minion，实现豹宝宝的基本功能
 * 这是魔刃豹的亡语token，具有嘲讽
 */
export class Cubling extends Minion {
  inTavern: boolean = false;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  id: 98943,
  strId: 'BG26_800t',
  cardType: 'minion',
  name: 'Cubling',
  nameCN: '豹宝宝',
  text: '<b>嘲讽</b>',
  mechanics: ['TAUNT'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800t_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800t_cardArtFromHsJson256x.png',
  tier: 1,
  health: 1,
  attack: 0,
  minionTypes: ['beast'],
  minionTypesCN: ['野兽'],
  upgradeCard: {
    id: 98944,
    strId: 'BG26_800_Gt',
    cardType: 'minion',
    name: 'Cubling',
    nameCN: '豹宝宝',
    text: '<b>嘲讽</b>',
    mechanics: ['TAUNT'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800_Gt_imageFromBlizzardSb.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800_Gt_cardArtFromHsJson256x.png',
    tier: 1,
    health: 2,
    attack: 0,
    minionTypes: ['beast'],
    minionTypesCN: ['野兽'],
  },
};
