import db_current_game from '../db/db_current_game';
import type { Card } from './entity/Card';
import { Minion } from './entity/Minion';
import type { Player } from './entity/Player';

/**
 * 战吼
 * 使用卡片后
 * 使用其他卡片监听
 * 当随从被攻击时触发
 * 亡语
 * 回合结束时
 * 战斗开始时
 *
 */
export class EffectTriggerController {
  /**
   * 战吼
   */
  triggerBattlecry(currentGameId: string, card: Card) {
    // 1、从db中获取当前游戏实例
    const currentGame = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error(`当前游戏 ${currentGameId} 未找到`);
    }
    if (card.type !== 'minion') {
      throw new Error(`卡片 ${card.strId} 不是随从`);
    }
    const minion = card as Minion;
    // 2、触发战吼
    minion.battlecry(currentGame);
  }
  /**
   * triggerUseCardAfter
   * 使用卡片后触发事件
   * 监听使用其他卡片事件
   * 战吼事件
   */
  triggerUseCardAfter(currentGameId: string, card: Card) {
    // 1、从db中获取当前游戏实例
    const currentGame = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error(`当前游戏 ${currentGameId} 未找到`);
    }
    const player: Player | undefined = currentGame.player;
    if (!player) {
      throw new Error(`当前游戏 ${currentGameId} 未找到玩家`);
    }
    // 触发使用卡片后事件
    card.useCardAfter(currentGame);
    // 触发使用其他卡片事件
    player.handCards.forEach(handCard => {
      handCard.useOtherCardAfter(currentGame, card);
    });
    player.minionsInBattle.forEach(minion => {
      minion.useOtherCardAfter(currentGame, card);
    });
    player.minionsOnBattlefield.forEach(minion => {
      minion.useOtherCardAfter(currentGame, card);
    });
    // 随从的特性了
    if (card instanceof Minion) {
      // 如果有战吼，触发战吼
      if (card.hasBattlecry) {
        // 触发战吼
        this.triggerBattlecry(currentGameId, card);
      }
    }
  }
}
