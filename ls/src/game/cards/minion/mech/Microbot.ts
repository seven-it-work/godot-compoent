import { Minion, type IMinion } from '@/game/Minion';

/**
 * 微型机器人类 - 继承自Minion，实现微型机器人随从
 */
export class Microbot extends Minion {
  static BASE_DATA = {
    id: 96810,
    strId: 'BG_BOT_312t',
    cardType: 'minion',
    name: 'Microbot',
    nameCN: '微型机器人',
    text: '',
    mechanics: [],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_BOT_312t_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_BOT_312t_cardArtFromHsJson256x.png',
    tier: 1,
    health: 1,
    attack: 1,
    minionTypes: ['mech'],
    minionTypesCN: ['机械'],
    upgradeCard: {
      id: 58377,
      strId: 'TB_BaconUps_032t',
      cardType: 'minion',
      name: 'Microbot',
      nameCN: '微型机器人',
      text: '',
      mechanics: [],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_032t_imageFromBlizzardSb.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_032t_cardArtFromHsJson256x.png',
      tier: 1,
      health: 2,
      attack: 2,
      minionTypes: ['mech'],
      minionTypesCN: ['机械'],
    },
  };
  constructor(params: Partial<IMinion> = {}) {
    super(params);
    this.isTavernMinion = false;
  }
}
