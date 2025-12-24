import { Minion } from '@/game/Minion';

/**
 * 豹宝宝类 - 继承自Minion，实现豹宝宝的基本功能
 * 这是魔刃豹的亡语token，具有嘲讽
 */
export class Cubling extends Minion {
  static BASE_DATA = {
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

  /**
   * 豹宝宝构造函数
   * 设置isTavernMinion为false，因为它是token随从，不会出现在酒馆中
   */
  constructor(params?: any) {
    super(params);
    this.isTavernMinion = false;
  }
}
