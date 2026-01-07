import { Buff } from '@/server/controller/entity/Buff';
import type { Card } from '@/server/controller/entity/Card';
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
import _ from 'lodash';

/**
 * PartyElemental类 - 继承自Minion，实现PartyElemental随从
 */
export class PartyElemental extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 重写其他卡牌被使用时触发的方法
   * @param _player - 玩家实例
   * @param card - 使用的卡牌实例
   * 效果：在你使用一张元素牌后，使一个被使用的元素之外的友方元素获得+{0}/+{1}。
   */
  useOtherCardAfter(_player: Player, card: Card): void {
    if (this.location !== 'battlefield') {
      return;
    }
    // 派对元素自己的判断条件：检查是否为元素牌
    if (card instanceof Minion && card.hasMinionType(['elemental'])) {
      for (let index = 0; index < this.getMultiplier(); index++) {
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
        for (let index = 0; index < this.getMultiplier(); index++) {
          // 随机选择一个
          const randomMinion = _.sample(findMinion);
          if (randomMinion === undefined || randomMinion === null) {
            return;
          }
          randomMinion.addBuff(
            new Buff(this.name, 2 + _player.elementBonus.atk, 1 + _player.elementBonus.hp)
          );
        }
      }
    }
  }
}

const BASE_DATA = {
  id: 64056,
  strId: 'BGS_120',
  cardType: 'minion',
  name: 'Party Elemental',
  nameCN: '派对元素',
  text: '在你使用一张元素牌后，使一个被使用的元素之外的友方元素获得+{0}/+{1}。',
  mechanics: ['TRIGGER_VISUAL'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_120_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_120_cardArtFromHsJson256x.png',
  tier: 2,
  health: 2,
  attack: 3,
  minionTypes: ['elemental'],
  minionTypesCN: ['元素'],
  upgradeCard: {
    id: 64058,
    strId: 'TB_BaconUps_160',
    cardType: 'minion',
    name: 'Party Elemental',
    nameCN: '派对元素',
    text: '在你使用一张元素牌后，使一个被使用的元素之外的友方元素获得+{0}/+{1}，\n触发两次。',
    mechanics: ['TRIGGER_VISUAL'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_160_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_160_cardArtFromHsJson256x.png',
    tier: 2,
    health: 4,
    attack: 6,
    minionTypes: ['elemental'],
    minionTypesCN: ['元素'],
  },
};
