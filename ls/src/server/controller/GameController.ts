import { CurrentGame, MINION_POOL_LIMITS } from '@/server/controller/entity/CurrentGame';
import { createCurrentGame } from '@/server/db/db_current_game';
import type { Hero } from '@/server/controller/entity/Hero';
import { Player } from '@/server/controller/entity/Player';
import { Tavern, 酒馆升级需要的金币 } from '@/server/controller/entity/Tavern';
import { db_card } from '../db/db_card';

export class GameController {
  /**
   * 初始化游戏
   * 1、创建 CurrentGame 实例
   * 2、初始化游戏数据（包括随从池、英雄等）
   */
  async initGame() {
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
        throw new Error(`Minion ${minion.strId} (${minion.name}) has no tier defined.`);
      }
      // 获取对应等级的随从数量限制
      const poolLimit = MINION_POOL_LIMITS[minion.tier];
      // 检查是否找到对应等级的限制
      if (poolLimit === undefined) {
        throw new Error(
          `Invalid minion tier: ${minion.tier} for minion ${minion.strId} (${minion.name}). Valid tiers are 1-7.`
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
    return createCurrentGame(currentGame);
  }

  /**
   * 玩家选择英雄
   */
  chooseHero(currentGame: CurrentGame, hero: Hero) {
    if (!currentGame.player) {
      throw new Error('Player not found');
    }
    currentGame.player.hero = hero;
  }

  /**
   * 开始游戏
   */
  startGame(currentGame: CurrentGame) {
    if (!currentGame.player) {
      throw new Error('Player not found');
    }
    if (!currentGame.player.hero) {
      throw new Error('Hero not found');
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
      throw new Error(
        `Invalid tavern level: ${tavern.level}. Upgrade cost not found. Valid levels are 1-6.`
      );
    }
    tavern.upgradeCost = upgradeCost;
    // 初始化酒馆的卡片
    player.tavern = tavern;
  }
}
