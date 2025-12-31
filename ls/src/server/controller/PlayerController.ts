import { CurrentGameController } from '@/server/controller/CurrentGameController';
import type { Card } from '@/server/controller/entity/Card';
import type { CurrentGame } from '@/server/controller/entity/CurrentGame';
import { Result, ResultFactory } from '@/server/controller/entity/Result';
import { TavernController } from '@/server/controller/TavernController';
import db_current_game from '@/server/db/db_current_game';
import { EffectTriggerController } from './EffectTrigger';
import type { Minion } from './entity/Minion';
import type { Player } from './entity/Player';

const MAX_HAND_CARDS = 10;
/**
 * 玩家的操作：
 * 升级酒馆
 * 刷新酒馆
 * 冻结/解冻酒馆
 * 购买卡片
 * 出售卡片
 * 使用卡片
 * 结束回合
 * 添加卡片到手牌
 */
export class PlayerController {
  /**
   * 升级酒馆
   */
  upgradeTavern(currentGameId: string): Result {
    // 1、根据currentGameId获取当前游戏实例
    const currentGame: CurrentGame | undefined = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error('未找到当前游戏');
    }
    if (!currentGame.player) {
      throw new Error('未找到玩家');
    }
    const tavern = currentGame.player.tavern;
    if (!tavern) {
      throw new Error('未找到酒馆');
    }
    // 升级酒馆金币判断
    if (tavern.level >= tavern.maxLevel) {
      return ResultFactory.fail('酒馆已升级到最高等级');
    }
    if (tavern.gold < tavern.upgradeCost) {
      return ResultFactory.fail('金币不足');
    }
    tavern.gold -= tavern.upgradeCost;
    tavern.level++;
    return ResultFactory.success('酒馆升级成功');
  }
  /**
   * 刷新酒馆
   */
  refreshTavern(currentGameId: string): Result {
    // 1、根据currentGameId获取当前游戏实例
    const currentGame: CurrentGame | undefined = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error('未找到当前游戏');
    }
    if (!currentGame.player) {
      throw new Error('未找到玩家');
    }
    const tavern = currentGame.player.tavern;
    if (!tavern) {
      throw new Error('未找到酒馆');
    }
    // 刷新酒馆金币判断
    if (tavern.gold < tavern.refreshCost) {
      return ResultFactory.fail('金币不足');
    }
    const result = new TavernController().消耗金币(currentGameId, tavern.refreshCost);
    if (!result.isSuccess()) {
      console.log('[失败] 刷新酒馆失败', result);
      return result;
    }
    // 刷新酒馆随从池
    return new TavernController().refreshTavern(currentGameId);
  }
  /**
   * 冻结/解冻酒馆
   * @param currentGameId 当前游戏ID
   * @param freeze 是否冻结
   */
  freezeTavern(currentGameId: string, freeze: boolean): Result {
    // 1、根据currentGameId获取当前游戏实例
    const currentGame: CurrentGame | undefined = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error('未找到当前游戏');
    }
    if (!currentGame.player) {
      throw new Error('未找到玩家');
    }
    const tavern = currentGame.player.tavern;
    if (!tavern) {
      throw new Error('未找到酒馆');
    }
    // 冻结/解冻酒馆
    tavern.isFrozen = freeze;
    return ResultFactory.success('酒馆冻结/解冻成功');
  }
  /**
   * 购买卡片
   */
  buyCard(currentGameId: string, cardId: string): Result {
    // 1、根据currentGameId获取当前游戏实例
    const currentGame: CurrentGame | undefined = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error('未找到当前游戏');
    }
    if (!currentGame.player) {
      throw new Error('未找到玩家');
    }
    const tavern = currentGame.player.tavern;
    if (!tavern) {
      throw new Error('未找到酒馆');
    }

    // 从酒馆中查找要购买的卡片（使用strId）
    const cardIndex = tavern.cards
      .filter(temp => temp !== undefined)
      .findIndex(temp => temp.id === cardId);
    if (cardIndex === -1) {
      return ResultFactory.fail('未找到要购买的卡片');
    }

    const card: Card | undefined = tavern.cards[cardIndex];
    if (!card) {
      throw new Error('未找到卡片');
    }
    const result = new TavernController().消耗金币(currentGameId, card.cardPrice);
    if (!result.isSuccess()) {
      console.log('[失败] 购买卡片失败', result);
      return result;
    }
    // 从酒馆中移除卡片
    tavern.cards.splice(cardIndex, 1);

    // 添加到玩家手牌
    this.addCardToHand(currentGameId, card);

    return ResultFactory.success('购买卡片成功');
  }
  /**
   * 添加卡片到手牌
   */
  addCardToHand(currentGameId: string, card: Card): Result {
    // 1、根据currentGameId获取当前游戏实例
    const currentGame: CurrentGame | undefined = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error('未找到当前游戏');
    }
    if (!currentGame.player) {
      throw new Error('未找到玩家');
    }
    const player = currentGame.player;
    if (!player) {
      throw new Error('未找到玩家');
    }
    // 如果当前手牌数已达上限
    if (player.handCards.length >= MAX_HAND_CARDS) {
      return ResultFactory.fail(`手牌数已达上限（${MAX_HAND_CARDS}）`);
    }
    card.location = 'hand';
    // 添加卡片到手牌
    player.handCards.push(card);
    return ResultFactory.success('添加卡片到手牌成功');
  }
  /**
   * 出售卡片
   * 只能从 minionsOnBattlefield 中出售
   */
  sellCard(currentGameId: string, cardId: string): Result {
    // 1、根据currentGameId获取当前游戏实例
    const currentGame: CurrentGame | undefined = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error('未找到当前游戏');
    }
    if (!currentGame.player) {
      throw new Error('未找到玩家');
    }
    const player = currentGame.player;
    if (!player) {
      throw new Error('未找到玩家');
    }
    // 查找要出售的卡片
    const cardIndex = player.minionsOnBattlefield
      .filter(minion => minion !== undefined)
      .findIndex(temp => temp.id === cardId);
    if (cardIndex === -1) {
      return ResultFactory.fail('未找到要出售的卡片');
    }
    // 从手牌中移除卡片
    const soldCard = player.minionsOnBattlefield.splice(cardIndex, 1)[0];
    if (!soldCard) {
      throw new Error('未找到要出售的卡片');
    }
    // 随从返回随从池
    new CurrentGameController().returnMinionToPool(currentGameId, soldCard.id);
    // 计算出售价格（例如，按卡片等级计算）
    const sellPrice = soldCard.sellPrice;
    // 增加玩家金币
    const tavern = currentGame.player.tavern;
    if (!tavern) {
      throw new Error('未找到酒馆');
    }
    tavern.gold += sellPrice;
    return ResultFactory.success('出售卡片成功');
  }
  /**
   * 使用卡片
   */
  useCardFromHand(currentGameId: string, cardId: string, _params: any = {}): Result {
    // 1、根据currentGameId获取当前游戏实例
    const currentGame: CurrentGame | undefined = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error('未找到当前游戏');
    }
    if (!currentGame.player) {
      throw new Error('未找到玩家');
    }
    const player = currentGame.player;
    if (!player) {
      throw new Error('未找到玩家');
    }
    // 查找要使用的卡片
    const cardIndex = player.handCards
      .filter(minion => minion !== undefined)
      .findIndex(temp => temp.id === cardId);
    if (cardIndex === -1) {
      return ResultFactory.fail('未找到要使用的卡片');
    }
    // 从手牌中移除卡片
    const usedCard: Card | undefined = player.handCards.splice(cardIndex, 1)[0];
    if (!usedCard) {
      throw new Error('未找到要使用的卡片');
    }
    // 如果是随从，添加到 minionsOnBattlefield
    if (usedCard.type === 'minion') {
      const minion = usedCard as Minion;
      minion.location = 'battlefield';
      player.minionsOnBattlefield.push(minion);
    }

    // 触发使用卡片后事件
    new EffectTriggerController().triggerUseCardAfter(currentGameId, usedCard);
    // todo 其他待开发卡片类型
    return ResultFactory.success('使用成功');
  }
  /**
   * 结束回合
   */
  endTurn(currentGameId: string): Result {
    // todo 待实现
    return ResultFactory.success('回合结束');
  }

  /**
   * 保存玩家数据
   */
  savePlayerData(currentGameId: string, player: Player): Result {
    // 1、根据currentGameId获取当前游戏实例
    const currentGame: CurrentGame | undefined = db_current_game.getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error('未找到当前游戏');
    }
    if (!currentGame.player) {
      throw new Error('未找到玩家');
    }
    currentGame.player = player;
    return ResultFactory.success('保存玩家数据成功');
  }
}
