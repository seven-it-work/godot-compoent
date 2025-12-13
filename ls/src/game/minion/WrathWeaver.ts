import { Minion } from '../Minion';

/**
 * 愤怒编织者类 - 继承自Minion，实现愤怒编织者的特殊效果
 */
export class WrathWeaver extends Minion {
  /**
   * 重写其他卡牌被使用时触发的方法
   * @param card - 使用的卡牌实例
   * @param game - 游戏管理器或store实例
   * @使用方式：当玩家使用其他卡牌时，愤怒编织者的此方法会被调用
   */
  onOtherCardPlayed(card: any, game: any): void {
    console.log('WrathWeaver.onOtherCardPlayed被调用');
    console.log('使用的卡牌:', card.nameCN, card.minionTypes);
    // 愤怒编织者自己的判断条件：检查是否为恶魔牌
    if (card.cardType === 'demon' || (card.minionTypes && card.minionTypes.includes('demon'))) {
      console.log('检测到恶魔牌，触发愤怒编织者效果');

      try {
        // 获取当前玩家 - 兼容gameManager和store两种情况
        const currentPlayer = game.currentPlayer || game.player;
        console.log('获取到当前玩家:', currentPlayer?.id);

        if (currentPlayer) {
          // 对英雄造成1点伤害
          console.log('对英雄造成1点伤害，当前生命值:', currentPlayer.hero?.health);
          if (currentPlayer.hero) {
            currentPlayer.hero.health -= 1;
            console.log('伤害后生命值:', currentPlayer.hero.health);
          }

          // 获得+2/+1 - 使用新的加成系统
          console.log('愤怒编织者获得+2/+1，当前属性:', this.attack, '/', this.health);
          this.addBuff({
            id: `wrathweaver_buff_${Date.now()}`,
            source: '愤怒编织者',
            attackBonus: 2,
            healthBonus: 1,
            maxHealthBonus: 1,
          });
          console.log('属性提升后:', this.attack, '/', this.health);
        } else {
          console.log('未找到当前玩家');
        }
      } catch (error) {
        console.error('触发愤怒编织者效果时出错:', error);
      }
    } else {
      console.log('不是恶魔牌，不触发效果');
    }
  }
}
