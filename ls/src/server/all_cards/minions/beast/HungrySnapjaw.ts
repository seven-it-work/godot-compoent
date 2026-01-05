import { Buff } from '@/server/controller/entity/Buff';
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';

/**
 * HungrySnapjaw类 - 继承自Minion，实现HungrySnapjaw随从
 */
export class HungrySnapjaw extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
  /**
   * 友方死亡随从监听
   */
  友方死亡随从监听(_player: Player, _死亡的随从: Minion) {
    if (_死亡的随从.hasMinionType('beast')) {
      _player.addMinionPermanentBuff(new Buff(this.name, 0, this.isGolden ? 2 : 1), this);
    }
  }
}

const BASE_DATA = {
  id: 104877,
  strId: 'BG26_370',
  cardType: 'minion',
  name: 'Hungry Snapjaw',
  nameCN: '饥饿的钳嘴龟',
  text: '在一只友方野兽死亡后，永久获得\n+1生命值。',
  mechanics: ['TRIGGER_VISUAL'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_370_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_370_cardArtFromHsJson256x.png',
  tier: 2,
  health: 2,
  attack: 4,
  minionTypes: ['beast'],
  minionTypesCN: ['野兽'],
  upgradeCard: {
    id: 104879,
    strId: 'BG26_370_G',
    cardType: 'minion',
    name: 'Hungry Snapjaw',
    nameCN: '饥饿的钳嘴龟',
    text: '在一只友方野兽死亡后，永久获得\n+2生命值。',
    mechanics: ['TRIGGER_VISUAL'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_370_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_370_G_cardArtFromHsJson256x.png',
    tier: 2,
    health: 4,
    attack: 8,
    minionTypes: ['beast'],
    minionTypesCN: ['野兽'],
  },
};
