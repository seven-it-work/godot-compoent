import type { Minion } from '@/server/controller/entity/Minion';
import db_current_game from '@/server/db/db_current_game';
import db_card from '@/server/db/db_card';
import { MINION_POOL_LIMITS } from '@/server/controller/entity/CurrentGame';

export class CurrentGameController {
  /**
   * 从随从池中获取随从
   */
  getMinionFromPool(currentGameId: string, minionId: string): Minion {
    // 1、从db中获取当前游戏实例
    const currentGame = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error(`当前游戏 ${currentGameId} 未找到`);
    }
    const minionPool = currentGame.minionPool;
    const minion = minionPool.get(minionId);
    if (!minion) {
      throw new Error(`随从 ${minionId} 未在随从池中找到`);
    }
    minionPool.set(minionId, minionPool.get(minionId)! - 1);
    return db_card.getCardByStrId(minionId) as Minion;
  }
  /**
   * 归还随从到随从池
   */
  returnMinionToPool(currentGameId: string, minionId: string) {
    // 1、从db中获取当前游戏实例
    const currentGame = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error(`当前游戏 ${currentGameId} 未找到`);
    }
    const minionPool = currentGame.minionPool;
    const minion: number | undefined = minionPool.get(minionId);
    if (!minion) {
      console.log(`随从 ${minionId} 未在随从池中找到`);
      return;
    }
    const minionCard = db_card.getCardByStrId(minionId);
    if (!minionCard) {
      throw new Error(`卡片 ${minionId} 不是随从`);
    }
    const tier = minionCard.tier;
    if (!tier) {
      throw new Error(`随从 ${minionId} 没有等级`);
    }
    const minionPoolLimit = MINION_POOL_LIMITS[tier];
    if (!minionPoolLimit) {
      throw new Error(`等级 ${minionCard.tier} 未在随从池限制中找到`);
    }
    // 这里有个限制，不能多余 MINION_POOL_LIMITS 中的个数
    if (minion >= minionPoolLimit) {
      minionPool.set(minionId, minionPoolLimit);
    } else {
      minionPool.set(minionId, minion + 1);
    }
  }
}
