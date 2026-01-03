import { Minion, minion_utils } from '@/server/controller/entity/Minion';

/**
 * 复活的骑兵类 - 继承自Minion，实现复活的骑兵的特殊效果
 */
export class RisenRider extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  // 继承父类的所有方法
}

const BASE_DATA = {
  id: 95246,
  strId: 'BG25_001',
  cardType: 'minion',
  name: 'Risen Rider',
  nameCN: '复活的骑兵',
  text: '<b>嘲讽</b>，<b>复生</b>',
  mechanics: ['REBORN', 'TAUNT'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG25_001_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG25_001_cardArtFromHsJson256x.png',
  tier: 1,
  health: 1,
  attack: 2,
  minionTypes: ['undead'],
  minionTypesCN: ['亡灵'],
  upgradeCard: {
    id: 95248,
    strId: 'BG25_001_G',
    cardType: 'minion',
    name: 'Risen Rider',
    nameCN: '复活的骑兵',
    text: '<b>嘲讽</b>，<b>复生</b>',
    mechanics: ['REBORN', 'TAUNT'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG25_001_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG25_001_G_cardArtFromHsJson256x.png',
    tier: 1,
    health: 2,
    attack: 4,
    minionTypes: ['undead'],
    minionTypesCN: ['亡灵'],
  },
};
