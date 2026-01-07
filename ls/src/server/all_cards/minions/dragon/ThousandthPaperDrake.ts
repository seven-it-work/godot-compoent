import { Buff } from '@/server/controller/entity/Buff';
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';

/**
 * ThousandthPaperDrake类 - 继承自Minion，实现ThousandthPaperDrake随从
 */
export class ThousandthPaperDrake extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
  战斗开始时(_player: Player): void {
    const minionsOnBattlefield = _player.getMinionsOnBattlefield();
    let count = this.getMultiplier();
    for (let index = 0; index < minionsOnBattlefield.length; index++) {
      const element = minionsOnBattlefield[index];
      if (element === undefined) {
        continue;
      }
      if (element.hasMinionType('dragon')) {
        count -= 1;
        element.keywords.push('WINDFURY');
        element.addBuff(new Buff(this.name, 1, 2));
      }
      if (count <= 0) {
        return;
      }
    }
    // 遍历完了都没有，说明没有龙了
  }
}

const BASE_DATA = {
  id: 108116,
  strId: 'BG29_810',
  cardType: 'minion',
  name: 'Thousandth Paper Drake',
  nameCN: '千纸幼龙',
  text: '<b>战斗开始时：</b>使你最左边的龙获得+1/+2和<b>风怒</b>。',
  mechanics: ['TRIGGER_VISUAL'],
  referencedTags: ['WINDFURY'],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_810_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_810_cardArtFromHsJson256x.png',
  tier: 2,
  health: 3,
  attack: 2,
  minionTypes: ['dragon'],
  minionTypesCN: ['龙'],
  upgradeCard: {
    id: 108279,
    strId: 'BG29_810_G',
    cardType: 'minion',
    name: 'Thousandth Paper Drake',
    nameCN: '千纸幼龙',
    text: '<b>战斗开始时：</b>使你最左边的两条龙获得+1/+2和<b>风怒</b>。',
    mechanics: ['TRIGGER_VISUAL'],
    referencedTags: ['WINDFURY'],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_810_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_810_G_cardArtFromHsJson256x.png',
    tier: 2,
    health: 6,
    attack: 4,
    minionTypes: ['dragon'],
    minionTypesCN: ['龙'],
  },
};
