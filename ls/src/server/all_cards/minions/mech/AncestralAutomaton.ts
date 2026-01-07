import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';

/**
 * AncestralAutomaton类 - 继承自Minion，实现AncestralAutomaton随从
 */
export class AncestralAutomaton extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  useCardAfter(_player: Player): void {
    _player.星元自动机加成.atk += 3 * this.getMultiplier();
    _player.星元自动机加成.hp += 2 * this.getMultiplier();
  }

  getAttack(player: Player): number {
    return super.getAttack(player) + player.星元自动机加成.atk - 3 * this.getMultiplier();
  }

  getHealth(player: Player, 是否获取生命值上限: boolean = false): number {
    return (
      super.getHealth(player, 是否获取生命值上限) +
      player.星元自动机加成.hp -
      2 * this.getMultiplier()
    );
  }
}

const BASE_DATA = {
  id: 108432,
  strId: 'BG_TTN_401',
  cardType: 'minion',
  name: 'Ancestral Automaton',
  nameCN: '星元自动机',
  text: '在本局对战中，你每召唤过一个其他星元自动机，便拥有+3/+2<i>（无论本随从在哪）</i>。',
  mechanics: ['AURA'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_TTN_401_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_TTN_401_cardArtFromHsJson256x.png',
  tier: 2,
  health: 4,
  attack: 2,
  minionTypes: ['mech'],
  minionTypesCN: ['机械'],
  upgradeCard: {
    id: 108435,
    strId: 'BG_TTN_401_G',
    cardType: 'minion',
    name: 'Ancestral Automaton',
    nameCN: '星元自动机',
    text: '在本局对战中，你每召唤过一个其他星元自动机，便拥有+6/+4<i>（无论本随从在哪）</i>。',
    mechanics: ['AURA'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_TTN_401_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_TTN_401_G_cardArtFromHsJson256x.png',
    tier: 2,
    health: 8,
    attack: 4,
    minionTypes: ['mech'],
    minionTypesCN: ['机械'],
  },
};
