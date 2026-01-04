import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
import type { Card } from '@/server/controller/entity/Card';
import { Buff } from '@/server/controller/entity/Buff';

/**
 * 熔融岩石类 - 继承自Minion，实现熔融岩石的特殊效果
 */
export class MoltenRock extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 使用卡牌后触发的方法
   * @param _player - 玩家实例
   * @param card - 使用的卡牌实例
   * 效果：在你使用一张元素牌后，获得+1生命值
   */
  useOtherCardAfter(player: Player, card: Card): void {
    if (this.location !== 'battlefield') {
      return;
    }

    // 检查使用的卡牌是否为元素牌
    if (card instanceof Minion && card.hasMinionType('elemental')) {
      // 获得生命值加成
      const healthBonus = 1 + player.elementBonus.hp;

      // 为熔融岩石添加生命值加成
      const buff = new Buff(this.name, 0, healthBonus);
      this.addBuff(buff);
    }
  }

  getTextFormatArr(player: Player) {
    const elementBonus = player.elementBonus;
    return [(1 + elementBonus.atk).toString(), (1 + elementBonus.hp).toString()];
  }
}

const BASE_DATA = {
  id: 64296,
  strId: 'BGS_127',
  cardType: 'minion',
  name: 'Molten Rock',
  nameCN: '熔融岩石',
  text: '在你使用一张元素牌后，获得+{1}生命值。',
  updateText: '在你使用一张元素牌后，获得+{0}/+{1}。',
  mechanics: ['TRIGGER_VISUAL'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_127_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_127_cardArtFromHsJson256x.png',
  tier: 1,
  health: 3,
  attack: 3,
  minionTypes: ['elemental'],
  minionTypesCN: ['元素'],
  upgradeCard: {
    id: 64300,
    strId: 'TB_Baconups_202',
    cardType: 'minion',
    name: 'Molten Rock',
    nameCN: '熔融岩石',
    text: '在你使用一张元素牌后，获得+{1}生命值，触发两次。0在你使用一张元素牌后，获得+{0}/+{1}，触发两次。',
    mechanics: ['TRIGGER_VISUAL'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_Baconups_202_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_Baconups_202_cardArtFromHsJson256x.png',
    tier: 1,
    health: 6,
    attack: 6,
    minionTypes: ['elemental'],
    minionTypesCN: ['元素'],
  },
};
