import type { Card } from '@/server/controller/entity/Card';
import { Hero } from '@/server/controller/entity/Hero';
import type { Tavern } from '@/server/controller/entity/Tavern';
import { IdGenerator } from '@/utils/IdGenerator';
import type { Minion } from './Minion';

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
  // 酒馆
  tavern?: Tavern;
  // 是否战斗中
  isInBattle: boolean = false;

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
   * 添加随从到战场
   */
  添加随从到战场(minion: Minion, targetSlotIndex?: number) {
    minion.location = 'battlefield';
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
      if (targetSlotIndex >= 7) {
        // 说明添加随从是最后一格，前面还有空位，需要往前顶
        this.moveLastMinionForwardInPlace(minionsOnBattlefield);
        // 最后一个位置插入
        minionsOnBattlefield[6] = minion;
      } else {
      }
    }

    // 查找插入位置
    let insertPosition = targetSlotIndex;
    // 如果没有提供位置，找到第一个空位置
    if (insertPosition === undefined || insertPosition === null) {
      insertPosition = player.minionsOnBattlefield.findIndex(
        minion => minion === undefined || minion === null
      );
      // 如果没有空位置，返回失败
      if (insertPosition === -1) {
        return ResultFactory.fail('战场上的随从已满（最多7个）');
      }
    } else {
      // 验证位置是否有效
      if (insertPosition < 0 || insertPosition >= 7) {
        return ResultFactory.fail('战场上的随从已满（最多7个）');
      }
      // 检查当前位置是否已有卡片，则将后面的随从往后移动
      if (
        player.minionsOnBattlefield[insertPosition] !== undefined &&
        player.minionsOnBattlefield[insertPosition] !== null
      ) {
        for (let i = insertPosition; i < player.minionsOnBattlefield.length - 1; i++) {
          if (
            player.minionsOnBattlefield[i + 1] == undefined ||
            player.minionsOnBattlefield[i + 1] == null
          ) {
            // 下一个为空，则移动完成，应该我们只会插入一个
            player.minionsOnBattlefield[i] = player.minionsOnBattlefield[i + 1];
            break;
          }
          // 不为空继续往后移动
          player.minionsOnBattlefield[i] = player.minionsOnBattlefield[i + 1];
        }
        player.minionsOnBattlefield[insertPosition] = minion;
      }
    }
    // 插入卡片
    player.minionsOnBattlefield[insertPosition] = minion;
    return ResultFactory.success('添加随从到战场成功');
  }

  /**
   * 移动第一个非空元素到最前
   * @param arr 数组
   * @returns
   */
  private moveFirstNonEmptyRightToFirstEmpty(arr: any[]) {
    const len = arr.length;

    // 从左往右找第一个非空元素的索引
    let firstNonEmptyIndex = -1;
    for (let i = 0; i < len; i++) {
      if (arr[i] != null) {
        firstNonEmptyIndex = i;
        break;
      }
    }

    if (firstNonEmptyIndex === -1) return; // 全是空

    // 从这个索引开始，向右找第一个空位置
    for (let i = firstNonEmptyIndex + 1; i < len; i++) {
      if (arr[i] == null) {
        // 移动元素到空位置
        arr[i] = arr[firstNonEmptyIndex];
        arr[firstNonEmptyIndex] = null;
        break; // 找到空位，移动完成
      }
    }
  }
  /**
   * 移动最后一个非空元素到最前
   * @param arr 数组
   */
  private moveLastMinionForwardInPlace(arr: any[]) {
    const len = arr.length;

    // 从右往左找最后一个非空元素的索引
    let lastNonEmptyIndex = -1;
    for (let i = len - 1; i >= 0; i--) {
      if (arr[i] !== null && arr[i] !== undefined) {
        lastNonEmptyIndex = i;
        break;
      }
    }

    if (lastNonEmptyIndex === -1) return; // 全是空

    // 从这个索引开始，向左移动直到遇到空位置
    for (let i = lastNonEmptyIndex; i > 0; i--) {
      if (arr[i - 1] === null || arr[i - 1] === undefined) {
        arr[i - 1] = arr[i];
        arr[i] = undefined;
        break; // 找到空位，移动完成
      } else {
        // 前面是非空，继续移动
        arr[i - 1] = arr[i];
        arr[i] = undefined;
      }
    }
  }
}
