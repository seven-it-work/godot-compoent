import { Minion, minion_utils } from '@/server/controller/entity/Minion';

/**
 * FranticAlarmobot类 - 继承自Minion，实现FranticAlarmobot随从
 */
export class FranticAlarmobot extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  id: 115664,
  strId: 'BG31_170',
  cardType: 'minion',
  name: 'Frantic Alarm-o-Bot',
  nameCN: '狂乱的报警机器人',
  text: '<b>磁力</b>\n<b>风怒</b>',
  mechanics: ['MAGNETIC', 'WINDFURY'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_170_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_170_cardArtFromHsJson256x.png',
  tier: 2,
  health: 4,
  attack: 4,
  minionTypes: ['mech'],
  minionTypesCN: ['机械'],
  upgradeCard: {
    id: 115665,
    strId: 'BG31_170_G',
    cardType: 'minion',
    name: 'Frantic Alarm-o-Bot',
    nameCN: '狂乱的报警机器人',
    text: '<b>磁力</b>\n<b>风怒</b>',
    mechanics: ['MAGNETIC', 'WINDFURY'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_170_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_170_G_cardArtFromHsJson256x.png',
    tier: 2,
    health: 8,
    attack: 8,
    minionTypes: ['mech'],
    minionTypesCN: ['机械'],
  },
};
