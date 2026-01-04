import { Buff } from '@/server/controller/entity/Buff';
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';

/**
 * 瞌睡雏龙类 - 继承自Minion，实现瞌睡雏龙的特殊效果
 */
export class DozyWhelp extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 重写受到攻击时触发的方法
   * 效果：每当本随从受到攻击时，永久获得+1攻击力
   */
  onAttacked(player: Player) {
    super.onAttacked(player);
    player.addBattleLog(
      `【${player.name}】的【${this.getBattleLogStr()}】受到了攻击，永久获得+1攻击力`
    );
    // 永久获得+1攻击力
    player.addMinionPermanentBuff(new Buff(this.name, 1, 0), this);
  }
}

const BASE_DATA = {
  id: 97594,
  strId: 'BG24_300',
  cardType: 'minion',
  name: 'Dozy Whelp',
  nameCN: '瞌睡雏龙',
  text: '<b><b>嘲讽</b></b>。每当本随从受到攻击时，永久获得+1攻击力。',
  mechanics: ['TAUNT', 'TRIGGER_VISUAL'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG24_300_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG24_300_cardArtFromHsJson256x.png',
  tier: 1,
  health: 4,
  attack: 0,
  minionTypes: ['dragon'],
  minionTypesCN: ['龙'],
  upgradeCard: {
    id: 97596,
    strId: 'BG24_300_G',
    cardType: 'minion',
    name: 'Dozy Whelp',
    nameCN: '瞌睡雏龙',
    text: '<b><b>嘲讽</b></b>。每当本随从受到攻击时，永久获得+2攻击力。',
    mechanics: ['TAUNT', 'TRIGGER_VISUAL'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG24_300_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG24_300_G_cardArtFromHsJson256x.png',
    tier: 1,
    health: 8,
    attack: 0,
    minionTypes: ['dragon'],
    minionTypesCN: ['龙'],
  },
};
