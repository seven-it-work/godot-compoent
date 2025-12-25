import { Minion, type BattleContext } from '@/game/Minion';

/**
 * 瞌睡雏龙类 - 继承自Minion，实现瞌睡雏龙的特殊效果
 */
export class DozyWhelp extends Minion {
  static BASE_DATA = {
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
  /**
   * 重写受到攻击时触发的方法
   * @param context - 战斗上下文，包含攻击者、玩家对象等信息
   * @使用方式：当本随从受到攻击时触发
   * 效果：每当本随从受到攻击时，永久获得+1攻击力
   */
  onAttacked(_context?: BattleContext): void {
    // 永久获得+1攻击力
    // 调用 palyer的 战斗中的随从永久加成 方法
    if (_context) {
      _context.friendlyPlayer.战斗中的随从永久加成(this, {
        id: `dozy_whelp_attack_${Date.now()}`,
        source: '瞌睡雏龙',
        attackBonus: 1,
        healthBonus: 0,
        maxHealthBonus: 0,
        type: 'permanent',
      });
    }
  }
}
