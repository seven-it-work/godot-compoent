import type { Card } from '@/server/controller/entity/Card';
import { Hero } from '@/server/controller/entity/Hero';
import type { Tavern } from '@/server/controller/entity/Tavern';
import { IdGenerator } from '@/utils/IdGenerator';
import type { Minion } from './Minion';
import type { Buff } from './Buff';

/**
 * 手牌上限
 */
const MAX_HAND_CARDS = 10;
export class Player {
  id: string = IdGenerator.generateRandomId();
  name: string = '';
  // 英雄
  hero?: Hero;
  // 战场上的随从
  minionsOnBattlefield: (Card | undefined)[] = Array(7).fill(undefined);
  // 战斗中的随从
  minionsInBattle: (Card | undefined)[] = Array(7).fill(undefined);
  // 手牌
  handCards: (Card | undefined)[] = Array(10).fill(undefined);
  // 待加入手牌队列
  handCardsQueue: Card[] = [];
  // 酒馆
  tavern?: Tavern;
  // 是否战斗中
  isInBattle: boolean = false;

  // 甲虫加成
  beetleBonus: { atk: number; hp: number } = { atk: 0, hp: 0 };
  // 酒馆元素加成
  elementBonus: { atk: number; hp: number } = { atk: 0, hp: 0 };
  // 元素加成加成
  elementBonusBonus: { atk: number; hp: number } = { atk: 0, hp: 0 };
  /**
   * 其他参数
   */
  otherParams: Record<string, any> = {};

  /**
   * 获取当前战场上的随从数组
   */
  getMinionsOnBattlefield(): (Card | undefined)[] {
    if (this.isInBattle) {
      return this.minionsInBattle;
    } else {
      return this.minionsOnBattlefield;
    }
  }

  /**
   * 获取当前战场有效随从数量
   */
  getMinionsOnBattlefieldCount(): number {
    const minionsOnBattlefield = this.getMinionsOnBattlefield();
    return minionsOnBattlefield.filter(minion => minion !== undefined && minion !== null).length;
  }

  /**
   * 战场上随从是否已满
   */
  isMinionsOnBattlefieldFull(): boolean {
    return this.getMinionsOnBattlefieldCount() >= 7;
  }

  /**
   * 获取当前随从所在的战场索引
   * @param minion 随从
   * @returns 索引
   */
  getMinionIndexOnBattlefield(minion: Minion): number {
    const minionsOnBattlefield = this.getMinionsOnBattlefield();
    return minionsOnBattlefield.findIndex(card => {
      if (card) {
        return card.id === minion.id;
      }
      return false;
    });
  }

  /**
   * 添加卡牌到手牌
   */
  添加卡牌到手牌(card: Card, 是否加入待加入队列: boolean = false) {
    card.location = 'hand';

    // 总是找到第一个空位置（undefined或null）
    const insertPosition = this.handCards.findIndex(card => card === undefined || card === null);

    // 计算当前实际手牌数量
    const actualHandCount = this.handCards.filter(
      card => card !== undefined && card !== null
    ).length;

    // 如果没有空位置且已达手牌上限，返回失败
    if (insertPosition === -1 && actualHandCount >= MAX_HAND_CARDS) {
      if (是否加入待加入队列) {
        this.handCardsQueue.push(card);
      }
      return;
    }

    // 确定最终插入位置
    const finalPosition = insertPosition === -1 ? this.handCards.length : insertPosition;
    // 插入卡片
    this.handCards[finalPosition] = card;
  }

  /**
   * 添加随从到战场
   */
  添加随从到战场(minion: Minion, targetSlotIndex?: number) {
    if (this.isInBattle) {
      minion.location = 'fighting';
    } else {
      minion.location = 'battlefield';
    }
    if (this.isMinionsOnBattlefieldFull()) {
      console.log('战场满了');
      return;
    }
    const minionsOnBattlefield = this.getMinionsOnBattlefield();
    if (targetSlotIndex === undefined || targetSlotIndex === null) {
      // 找个最靠前的空位插入
      targetSlotIndex = minionsOnBattlefield.findIndex(
        minion => minion === undefined || minion === null
      );
      minionsOnBattlefield[targetSlotIndex] = minion;
    } else {
      this.insertAt(minionsOnBattlefield, targetSlotIndex, minion);
    }
  }

  /**
   * 随从永久加成
   */
  addMinionPermanentBuff(buff: Buff, minion: Minion) {
    minion.addBuff(buff);
    // 从战场中找到随从
    const findMinion = this.minionsOnBattlefield
      .filter(temp => temp !== undefined && temp !== null)
      .find(temp => temp.id === minion.id) as Minion;
    if (findMinion === undefined || findMinion === null) {
      console.log('未找到随从');
      return;
    }
    findMinion.addBuff(buff);
  }

  /**
   * 向数组指定索引插入元素，同时移动后续元素
   * @param arr 数组
   * @param index 索引
   * @param obj 元素
   */
  private insertAt(arr: any[], index: number, obj: any) {
    const len = arr.length;
    // 处理索引超出范围的情况
    if (index < 0 || index > len) {
      throw new Error('索引超出范围');
    }
    // 场景 3: 插入索引等于数组长度
    if (index === len) {
      // 往前找第一个 null
      for (let i = len - 1; i >= 0; i--) {
        if (arr[i] === null || arr[i] === undefined) {
          arr[i] = obj;
          return arr;
        }
      }
      // 如果没有 null，说明数组已满
      throw new Error('数组已满，无法插入');
    }

    // 场景 1: 插入位置为 null
    if (arr[index] === null || arr[index] === undefined) {
      arr[index] = obj;
      return arr;
    }

    // 场景 2: 插入位置不为 null，后面有 null
    for (let i = index + 1; i < len; i++) {
      if (arr[i] === null || arr[i] === undefined) {
        arr[i] = arr[index];
        arr[index] = obj;
        return arr;
      }
    }
    // 场景 4: 插入位置不为 null，后面没有 null
    // 往前找第一个 null
    for (let i = index - 1; i >= 0; i--) {
      if (arr[i] === null || arr[i] === undefined) {
        arr[i] = obj;
        return arr;
      }
    }
    // 如果没有找到 null，说明数组已满
    throw new Error('数组已满，无法插入');
  }
}
