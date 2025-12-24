import { Minion } from '@/game/Minion';

/**
 * 骷髅类 - 继承自Minion，实现骷髅的基本功能
 * 这是无害的骨颅的亡语token
 */
export class Skeleton extends Minion {
  static BASE_DATA = {
    id: 99629,
    strId: 'BG_ICC_026t',
    cardType: 'minion',
    name: 'Skeleton',
    nameCN: '骷髅',
    text: '',
    mechanics: [],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_imageFromBlizzardSb.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_cardArtFromHsJson256x.png',
    tier: 1,
    health: 1,
    attack: 1,
    minionTypes: ['undead'],
    minionTypesCN: ['亡灵'],
    upgradeCard: {
      id: 99630,
      strId: 'BG_ICC_026t_G',
      cardType: 'minion',
      name: 'Skeleton',
      nameCN: '骷髅',
      text: '',
      mechanics: [],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_G_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_G_cardArtFromHsJson256x.png',
      tier: 1,
      health: 2,
      attack: 2,
      minionTypes: ['undead'],
      minionTypesCN: ['亡灵'],
    },
  };

  /**
   * 骷髅构造函数
   * 设置isTavernMinion为false，因为它是token随从，不会出现在酒馆中
   */
  constructor(params?: any) {
    super(params);
    this.isTavernMinion = false;
  }
}
