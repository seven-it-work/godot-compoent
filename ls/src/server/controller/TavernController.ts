import type { CurrentGame } from '@/server/controller/entity/CurrentGame';
import type { Tavern } from './entity/Tavern';
import type { Minion } from '@/game/Minion';

export class TavernController {
  /**
   * 刷新酒馆
   */
  refreshTavern(currentGame: CurrentGame) {
    if (!currentGame.player) {
      throw new Error('Player not found');
    }
    const tavern = currentGame.player.tavern;
    if (!tavern) {
      throw new Error('Tavern not found');
    }
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
    const minionPool = currentGame.minionPool;
    // 1、
    const minions = Array.from(minionPool.keys());
    const randomIndex = Math.floor(Math.random() * minions.length);
    const randomMinionStrId = minions[randomIndex];
    const randomMinion = currentGame.minionInstances.get(randomMinionStrId);
    if (!randomMinion) {
      throw new Error(`Minion with strId ${randomMinionStrId} not found`);
    }
    return randomMinion;
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
        throw new Error('Invalid tavern level');
    }
  }
}
