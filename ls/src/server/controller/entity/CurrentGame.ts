import type { Player } from '@/server/controller/entity/Player';

/**
 * 各星级随从数量限制（公共池） - 定义每个星级在公共池中最多能出现的随从数量
 */
export const MINION_POOL_LIMITS = {
  1: 18, // 1星随从最多18个
  2: 15, // 2星随从最多15个
  3: 13, // 3星随从最多13个
  4: 11, // 4星随从最多11个
  5: 9, // 5星随从最多9个
  6: 6, // 6星随从最多6个
  7: 3, // 7星随从最多3个
};

export class CurrentGame {
  /**
   * 游戏ID
   */
  id: string = '';
  /**
   * 玩家信息
   */
  player?: Player;
  /**
   * 随从池
   * 公共池中的随从，取一个少一个
   * 卡片strId value 剩余数量
   */
  minionPool: Map<string, number> = new Map();
  /**
   * 其他参数
   */
  otherParams: Record<string, any> = {};
}
