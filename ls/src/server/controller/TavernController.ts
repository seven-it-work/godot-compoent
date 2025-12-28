import type { CurrentGame } from '@/server/controller/entity/CurrentGame';
import type { Tavern } from '@/server/controller/entity/Tavern';
import type { Minion } from '@/server/controller/entity/Minion';
import db_card from '@/server/db/db_card';
import { sample } from 'lodash';
import { CurrentGameController } from '@/server/controller/CurrentGameController';

export class TavernController {
  /**
   * 刷新酒馆
   */
  refreshTavern(currentGame: CurrentGame) {
    if (!currentGame.player) {
      throw new Error('未找到玩家');
    }
    const tavern = currentGame.player.tavern;
    if (!tavern) {
      throw new Error('未找到酒馆');
    }
    // 归还酒馆中的随从到公共池
    tavern.cards.forEach(minion => {
      new CurrentGameController().returnMinionToPool(currentGame.id, minion.strId);
    });
    // 等级当前酒馆等级生成对应的随从个+1个法术牌
    const minionsToShowCount = this.getMinionsToShowCount(tavern);
    for (let i = 0; i < minionsToShowCount; i++) {
      // 从随从池中随机选择一个随从
      const minion = this.getRandomMinionFromPool(currentGame);
      // 添加到酒馆卡片
      tavern.cards.push(minion);
    }
  }

  /**
   * 从随从池中随机选择一个随从
   * @param currentGame 当前游戏实例
   * @returns 随机选择的随从
   */
  private getRandomMinionFromPool(currentGame: CurrentGame): Minion {
    const tavern = currentGame?.player?.tavern;
    if (!tavern) {
      throw new Error('未找到酒馆');
    }
    const minionPool = currentGame.minionPool;
    const minions: Minion[] = db_card.getMinionsInTavern(card => {
      // 1、db中获取当前等级的随从
      if (card.tier) {
        // 2、在看随从池中是否数量大于0
        const minionCountInPool = minionPool.get(card.strId) || 0;
        return minionCountInPool > 0 && card.tier <= tavern.level;
      }
      return false;
    });
    if (minions.length === 0) {
      throw new Error('随从池中没有可用的随从');
    }
    // 3、从随从池中获取随机随从
    const randomMinion = sample(minions);
    // 确保获取到的随从不为undefined
    if (!randomMinion) {
      throw new Error('从随从池中获取随机随从失败');
    }
    // 必须从随从池中获取
    return new CurrentGameController().getMinionFromPool(currentGame.id, randomMinion.strId);
  }

  /**
   * 获取当前酒馆等级应显示的随从数量
   * @returns 应显示的随从数量
   * @使用方式：刷新酒馆时决定显示多少个随从
   */
  private getMinionsToShowCount(tavern: Tavern): number {
    switch (tavern.level) {
      case 1:
        return 3; // 1级酒馆显示3个随从
      case 2:
      case 3:
        return 4; // 2-3级酒馆显示4个随从
      case 4:
      case 5:
        return 5; // 4-5级酒馆显示5个随从
      case 6:
        return 6; // 6级酒馆显示6个随从
      case 7:
        return 6; // 6级酒馆显示6个随从
      default:
        throw new Error('无效的酒馆等级');
    }
  }
}
