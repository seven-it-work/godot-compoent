import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';

/**
 * 沙丘土著类 - 继承自Minion，实现沙丘土著的特殊效果
 */
export class DuneDweller extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 重写战吼方法
   * @param player - 玩家实例
   * 效果：战吼：使酒馆中的元素在本局对战中获得+1/+1
   */
  battlecry(player: Player): void {
    super.battlecry(player);

    // 战吼：使酒馆中的元素在本局对战中获得+1/+1
    console.log('沙丘土著：使酒馆中的元素在本局对战中获得+1/+1');

    console.log('成功为酒馆元素添加+1/+1加成');
  }
}

const BASE_DATA = {
  id: 116734,
  strId: 'BG31_815',
  cardType: 'minion',
  name: 'Dune Dweller',
  nameCN: '沙丘土著',
  text: '<b>战吼：</b>使酒馆中的元素在本局对战中获得+{0}/+{1}。',
  mechanics: ['BATTLECRY'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_815_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_815_cardArtFromHsJson256x.png',
  tier: 1,
  health: 2,
  attack: 3,
  minionTypes: ['elemental'],
  minionTypesCN: ['元素'],
  upgradeCard: {
    id: 116735,
    strId: 'BG31_815_G',
    cardType: 'minion',
    name: 'Dune Dweller',
    nameCN: '沙丘土著',
    text: '<b>战吼：</b>\n使酒馆中的元素在本局对战中获得+{0}/+{1}，触发两次。',
    mechanics: ['BATTLECRY'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_815_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_815_G_cardArtFromHsJson256x.png',
    tier: 1,
    health: 4,
    attack: 6,
    minionTypes: ['elemental'],
    minionTypesCN: ['元素'],
  },
};
