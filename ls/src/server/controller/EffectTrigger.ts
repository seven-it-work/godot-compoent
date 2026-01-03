import type { Card } from '@/server/controller/entity/Card';
import { Minion } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
import db_current_game from '@/server/db/db_current_game';

/**
 * 战吼
 * 使用卡片后 (使用其他卡片监听)
 * 消费金币事件
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
    const player = currentGame.player;
    if (!player) {
      throw new Error(`当前游戏 ${currentGameId} 未找到玩家`);
    }
    // 2、触发战吼
    minion.battlecry(player);
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
    card.useCardAfter(player);
    // 触发使用其他卡片事件
    player.handCards
      .filter(minion => minion !== undefined)
      .forEach(handCard => {
        handCard.useOtherCardAfter(player, card);
      });
    player.minionsInBattle
      .filter(minion => minion !== undefined)
      .forEach(minion => {
        minion.useOtherCardAfter(player, card);
      });
    player.minionsOnBattlefield
      .filter(minion => minion !== undefined)
      .forEach(minion => {
        minion.useOtherCardAfter(player, card);
      });
    // 随从的特性了
    if (card instanceof Minion) {
      // 触发战吼
      this.triggerBattlecry(currentGameId, card);
    }
  }
  /**
   * triggerConsumeGoldEvent
   * 消费金币事件
   */
  triggerConsumeGoldEvent(currentGameId: string, gold: number) {
    // 1、从db中获取当前游戏实例
    const currentGame = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error(`当前游戏 ${currentGameId} 未找到`);
    }
    const player: Player | undefined = currentGame.player;
    if (!player) {
      throw new Error(`当前游戏 ${currentGameId} 未找到玩家`);
    }
    // todo 触发消费金币事件
    console.log(`玩家 ${player.name} 消费了 ${gold} 金币，触发事件`);
  }
}
