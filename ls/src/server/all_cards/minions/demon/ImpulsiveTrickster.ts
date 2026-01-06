import { Buff } from '@/server/controller/entity/Buff';
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
import _ from 'lodash';

/**
 * ImpulsiveTrickster类 - 继承自Minion，实现ImpulsiveTrickster随从
 */
export class ImpulsiveTrickster extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  deathrattle(_攻击的随从: Minion, _player: Player): void {
    // 使另一个友方随从获得本随从的生命值上限
    const minionsOnBattlefield = _player.getMinionsOnBattlefield();
    const findMinion = minionsOnBattlefield.filter(minion => {
      if (minion === undefined || minion === null) {
        return false;
      }
      if (minion.id === this.id) {
        return false;
      }
      return true;
    });
    if (findMinion.length === 0) {
      // 没有友方随从
      return;
    }
    // 随机选择一个
    const randomMinion = _.sample(findMinion);
    if (randomMinion === undefined || randomMinion === null) {
      return;
    }
    randomMinion.addBuff(new Buff(this.name, 0, this.getHealth(_player, true)));
  }
}

const BASE_DATA = {
  id: 72059,
  strId: 'BG21_006',
  cardType: 'minion',
  name: 'Impulsive Trickster',
  nameCN: '躁动欺诈者',
  text: '<b>亡语：</b>使另一个友方随从获得本随从的生命值上限。',
  mechanics: ['DEATHRATTLE'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG21_006_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG21_006_cardArtFromHsJson256x.png',
  tier: 2,
  health: 3,
  attack: 3,
  minionTypes: ['demon'],
  minionTypesCN: ['恶魔'],
  upgradeCard: {
    id: 72922,
    strId: 'BG21_006_G',
    cardType: 'minion',
    name: 'Impulsive Trickster',
    nameCN: '躁动欺诈者',
    text: '<b>亡语：</b>使另一个友方随从获得本随从的生命值上限，触发两次。',
    mechanics: ['DEATHRATTLE'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG21_006_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG21_006_G_cardArtFromHsJson256x.png',
    tier: 2,
    health: 6,
    attack: 6,
    minionTypes: ['demon'],
    minionTypesCN: ['恶魔'],
  },
};
