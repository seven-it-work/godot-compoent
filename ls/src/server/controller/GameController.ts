import { CurrentGame, MINION_POOL_LIMITS } from '@/server/controller/entity/CurrentGame';
import db_current_game from '@/server/db/db_current_game';
import type { Hero } from '@/server/controller/entity/Hero';
import { Player } from '@/server/controller/entity/Player';
import { Tavern, 酒馆升级需要的金币 } from '@/server/controller/entity/Tavern';
import db_card from '@/server/db/db_card';
import { TavernController } from '@/server/controller/TavernController';

export class GameController {
  /**
   * 初始化游戏
   * 1、创建 CurrentGame 实例
   * 2、初始化游戏数据（包括随从池、英雄等）
   */
  async initGame(): Promise<CurrentGame> {
    // 1、创建 CurrentGame 实例
    const currentGame = new CurrentGame();
    // 2、初始化游戏数据（包括随从池、英雄等）
    // 加载所有卡片
    await db_card.dbInit();
    const minionsInTavern = db_card.getMinionsInTavern();
    // 加载到随从池
    minionsInTavern.forEach(minion => {
      // 检查 minion.tier 是否存在
      if (minion.tier === undefined) {
        throw new Error(`随从 ${minion.strId} (${minion.name}) 没有定义等级。`);
      }
      // 获取对应等级的随从数量限制
      const poolLimit = MINION_POOL_LIMITS[minion.tier];
      // 检查是否找到对应等级的限制
      if (poolLimit === undefined) {
        throw new Error(
          `无效的随从等级: ${minion.tier} 对于随从 ${minion.strId} (${minion.name})。有效的等级是 1-7。`
        );
      }
      currentGame.minionPool.set(minion.strId, poolLimit);
    });
    // 初始化玩家信息
    const palyer = new Player();
    // todo 玩家名称设置
    palyer.name = '玩家';
    currentGame.player = palyer;
    // 添加到db
    return db_current_game.createCurrentGame(currentGame);
  }

  /**
   * 玩家选择英雄
   */
  chooseHero(currentGameId: string, heroStrId: string) {
    // 1、根据currentGameId获取当前游戏实例
    const currentGame = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error('未找到当前游戏');
    }
    if (!currentGame.player) {
      throw new Error('未找到玩家');
    }
    // 2、根据heroStrId获取英雄实例
    const hero = db_card.getCardByStrId(heroStrId);
    if (hero.type !== 'hero') {
      throw new Error(`卡片 ${heroStrId} 不是英雄类型`);
    }
    // 3、将英雄添加到玩家
    currentGame.player.hero = hero as Hero;
  }

  /**
   * 开始游戏
   */
  startGame(currentGameId: string) {
    // 1、根据currentGameId获取当前游戏实例
    const currentGame = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error('未找到当前游戏');
    }
    if (!currentGame.player) {
      throw new Error('未找到玩家');
    }
    if (!currentGame.player.hero) {
      throw new Error('未找到英雄');
    }
    const player: Player = currentGame.player;
    // 初始化玩家酒馆
    const tavern = new Tavern();
    tavern.level = 1;
    tavern.maxLevel = 6;
    tavern.gold = 3;
    tavern.maxGold = 3;
    // 获取对应等级的升级费用
    const upgradeCost = 酒馆升级需要的金币[tavern.level];
    // 如果找不到对应等级的升级费用，抛出异常
    if (upgradeCost === undefined) {
      throw new Error(`无效的酒馆等级: ${tavern.level}。未找到升级费用。有效的等级是 1-6。`);
    }
    tavern.upgradeCost = upgradeCost;
    // 初始化酒馆的卡片
    player.tavern = tavern;
    // 刷新酒馆
    new TavernController().refreshTavern(currentGameId);
  }
}
