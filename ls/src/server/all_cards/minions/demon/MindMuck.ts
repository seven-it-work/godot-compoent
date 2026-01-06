import { Buff } from '@/server/controller/entity/Buff';
import type { Card } from '@/server/controller/entity/Card';
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
import _ from 'lodash';

/**
 * MindMuck类 - 继承自Minion，实现MindMuck随从
 */
export class MindMuck extends Minion {
  inTavern: boolean = true;
  requiresTarget: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  targetFillter(cardList: Card[]): Card[] {
    return cardList
      .filter(card => card !== undefined)
      .filter(card => card.type === 'minion')
      .filter(card => (card as Minion).hasMinionType('demon'));
  }

  battlecry(player: Player) {
    if (player.isInBattle) {
      return;
    }
    const tavern = player.tavern;
    if (!tavern) {
      return;
    }
    // 获取友方恶魔列表
    const friendlyDemons = player
      .getMinionsOnBattlefield()
      .filter(
        minion => minion && minion.hasMinionType('demon') && minion.id !== this.id
      ) as Minion[];

    // 如果没有友方恶魔，直接返回
    if (friendlyDemons.length === 0) {
      return;
    }
    const selectedDemon = player.otherParams.targetCard;
    if (!selectedDemon || selectedDemon.type !== 'minion') {
      return;
    }

    // 获取酒馆中的随从
    const tavernMinions = tavern.cards
      .filter(card => card !== undefined)
      .filter(card => card && card.type === 'minion') as Minion[];

    // 如果酒馆中没有随从，直接返回
    if (!tavernMinions || tavernMinions.length === 0) {
      return;
    }
    // 选择酒馆中的第一个随从
    const tavernMinion = _.sample(tavernMinions);
    if (!tavernMinion) {
      return;
    }
    // 计算属性值倍率（金色版本获得双倍属性值）
    const multiplier = this.isGolden ? 2 : 1;
    // 获取属性值
    const atkBonus = tavernMinion.getAttack(player) * multiplier;
    const hpBonus = tavernMinion.getHealth(player) * multiplier;
    // 添加buff到选中的恶魔
    selectedDemon.addBuff(new Buff(this.name, atkBonus, hpBonus));
  }
}

const BASE_DATA = {
  id: 93321,
  strId: 'BG23_357',
  cardType: 'minion',
  name: 'Mind Muck',
  nameCN: '心灵泥魔',
  text: '<b>战吼：</b>选择一个友方恶魔，使其吞食酒馆中的一个随从，获得其属性值。',
  mechanics: ['BATTLECRY'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_357_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_357_cardArtFromHsJson256x.png',
  tier: 2,
  health: 2,
  attack: 3,
  minionTypes: ['demon'],
  minionTypesCN: ['恶魔'],
  upgradeCard: {
    id: 93323,
    strId: 'BG23_357_G',
    cardType: 'minion',
    name: 'Mind Muck',
    nameCN: '心灵泥魔',
    text: '<b>战吼：</b>选择一个友方恶魔，使其吞食酒馆中的一个随从，获得其双倍属性值。',
    mechanics: ['BATTLECRY'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_357_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_357_G_cardArtFromHsJson256x.png',
    tier: 2,
    health: 4,
    attack: 6,
    minionTypes: ['demon'],
    minionTypesCN: ['恶魔'],
  },
};
