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
    console.log('深海钓客：使用本随从后，塑造法术：直到下个回合，使一个随从获得+2生命值和嘲讽');

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
      1,
      true
    );

    // 将法术添加到玩家的法术列表中
    if (game.player) {
      game.player.addSpell(shapingSpell);
    }

    // 调用战吼方法（如果需要的话）
    this.battlecry(game);
  }

  /**
   * 重写战吼方法
   * @param _game - 游戏管理器或store实例
   * @使用方式：当使用本随从后，在onMinionPlayed中被调用
   * 效果：（可以在这里添加额外的战吼效果）
   */
  battlecry(_game: any): void {
    // 深海钓客的战吼效果可以在这里实现
    // 目前深海钓客的主要效果是使用随从后触发的塑造法术，所以战吼可以留空或添加额外效果
  }
}
