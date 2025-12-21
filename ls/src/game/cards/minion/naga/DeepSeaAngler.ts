import { Minion } from '@/game/Minion';
import { Spell } from '@/game/Spell';

/**
 * 深海钓客类 - 继承自Minion，实现深海钓客的特殊效果
 */
export class DeepSeaAngler extends Minion {
  static BASE_DATA = {
    id: 100404,
    strId: 'BG23_004',
    cardType: 'minion',
    name: 'DeepSeaAngler',
    nameCN: '深海钓客',
    text: '<b>塑造法术：</b>直到下个回合，使一个随从获得+2生命值和嘲讽。',
    mechanics: ['SHAPING'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_004_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_004_cardArtFromHsJson256x.png',
    tier: 1,
    health: 2,
    attack: 2,
    minionTypes: ['naga'],
    minionTypesCN: ['纳迦'],
    upgradeCard: {
      id: 100504,
      strId: 'BG23_004_G',
      cardType: 'minion',
      name: 'DeepSeaAngler',
      nameCN: '深海钓客',
      text: '<b>塑造法术：</b>直到下个回合，使一个随从获得+4生命值和嘲讽。',
      mechanics: ['SHAPING'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_004_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_004_cardArtFromHsJson256x.png',
      tier: 1,
      health: 4,
      attack: 4,
      minionTypes: ['naga'],
      minionTypesCN: ['纳迦'],
    },
  };

  /**
   * 重写onMinionPlayed方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当使用本随从后触发
   * 效果：塑造法术：直到下个回合，使一个随从获得+2生命值和嘲讽
   */
  onMinionPlayed(game: any): void {
    // 使用本随从后触发的效果：塑造法术
    console.log('深海钓客：检查是否需要生成塑造法术');

    if (!this.hasGrantedShapingSpell && game.player) {
      // 创建塑造法术
      const shapingSpell = new Spell({
        id: 'shaping_spell_health_taunt',
        nameCN: '塑造法术：强化随从',
        description: '直到下个回合，使一个随从获得+2生命值和嘲讽',
        type: 'shaping',
        effects: [
          { type: 'health_bonus', value: 2, duration: 1, target: 'friendly' },
          { type: 'max_health_bonus', value: 2, duration: 1, target: 'friendly' },
          { type: 'keyword', value: 'taunt', duration: 1, target: 'friendly' },
        ],
        targetSelection: {
          scope: 'both', // 允许作用于战场和酒馆中的随从
          targetType: 'minion',
          requiresTarget: true,
        },
        duration: 1,
        isTemporary: true,
      });
      // 将法术添加到玩家的法术列表中
      const added = game.player.addSpell(shapingSpell);
      if (added) {
        this.hasGrantedShapingSpell = true; // 标记已授予
      } else {
        console.log('深海钓客：手牌已满，塑造法术已加入等待队列');
      }
    }
  }
}
