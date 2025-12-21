import { Minion } from '../../Minion';

/**
 * 瞌睡雏龙类 - 继承自Minion，实现瞌睡雏龙的特殊效果
 */
export class DozyWhelp extends Minion {
  static BASE_DATA = {
    id: 100004,
    strId: 'BG24_300',
    cardType: 'minion',
    name: 'DozyWhelp',
    nameCN: '瞌睡雏龙',
    text: '<b>每当本随从受到攻击时，永久获得+1攻击力。</b>',
    mechanics: ['TRIGGERED_ABILITY'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG24_300_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG24_300_cardArtFromHsJson256x.png',
    tier: 1,
    health: 1,
    attack: 1,
    minionTypes: ['dragon'],
    minionTypesCN: ['龙'],
    upgradeCard: {
      id: 100005,
      strId: 'BG24_300_G',
      cardType: 'minion',
      name: 'DozyWhelp',
      nameCN: '瞌睡雏龙',
      text: '<b>每当本随从受到攻击时，永久获得+2攻击力。</b>',
      mechanics: ['TRIGGERED_ABILITY'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG24_300_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG24_300_cardArtFromHsJson256x.png',
      tier: 1,
      health: 2,
      attack: 2,
      minionTypes: ['dragon'],
      minionTypesCN: ['龙'],
    },
  };
  /**
   * 重写受到攻击时触发的方法
   * @param attacker - 攻击者随从实例
   * @使用方式：当本随从受到攻击时触发
   * 效果：每当本随从受到攻击时，永久获得+1攻击力
   */
  onAttacked(_attacker: any): void {
    // 永久获得+1攻击力
    this.addBuff({
      id: `dozy_whelp_attack_${Date.now()}`,
      source: '瞌睡雏龙',
      attackBonus: 1,
      healthBonus: 0,
      maxHealthBonus: 0,
      type: 'permanent',
    });
  }
}
