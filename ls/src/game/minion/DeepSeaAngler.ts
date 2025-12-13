import { Minion } from '../Minion';
import { Spell } from '../Spell';

/**
 * 深海钓客类 - 继承自Minion，实现深海钓客的特殊效果
 */
export class DeepSeaAngler extends Minion {
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
      const shapingSpell = new Spell(
        `shaping_${Date.now()}`,
        '塑造法术：强化随从',
        '直到下个回合，使一个随从获得+2生命值和嘲讽',
        'shaping',
        [
          { type: 'health_bonus', value: 2, duration: 1, target: 'friendly' },
          { type: 'max_health_bonus', value: 2, duration: 1, target: 'friendly' },
          { type: 'keyword', value: 'taunt', duration: 1, target: 'friendly' },
        ],
        {
          scope: 'both', // 允许作用于战场和酒馆中的随从
          targetType: 'minion',
          requiresTarget: true,
        },
        1,
        true
      );
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
