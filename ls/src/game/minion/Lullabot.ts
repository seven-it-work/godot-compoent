import { Minion } from '../Minion';

/**
 * 催眠机器人类 - 继承自Minion，实现催眠机器人的特殊效果
 */
export class Lullabot extends Minion {
  /**
   * 重写回合结束时触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：在你的回合结束时触发
   * 效果：在你的回合结束时，获得+1生命值
   */
  onTurnEnd(_game: any): void {
    // 获得+1生命值和+1最大生命值
    this.addBuff({
      id: `lullabot_health_${Date.now()}`,
      source: '催眠机器人',
      attackBonus: 0,
      healthBonus: 1,
      maxHealthBonus: 1,
      type: 'permanent',
    });
  }
}
