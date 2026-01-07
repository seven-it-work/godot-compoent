import type { Card } from '@/server/controller/entity/Card';
import { Hero } from '@/server/controller/entity/Hero';
import type { Tavern } from '@/server/controller/entity/Tavern';
import db_card from '@/server/db/db_card';
import { IdGenerator } from '@/utils/IdGenerator';
import { Buff } from './Buff';
import type { Minion } from './Minion';

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
  minionsOnBattlefield: (Minion | undefined)[] = Array(7).fill(undefined);
  // 战斗中的随从
  minionsInBattle: (Minion | undefined)[] = Array(7).fill(undefined);
  // 战斗中待召唤的随从队列（如果有空位则召唤，对于这个效果 就是存储在这个队列中）
  minionsToSummonInBattle: Minion[] = [];
  // 当前战斗的随从索引
  currentFightingMinionIndex: number = 0;
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
  // 野兽加成
  beastBonus: { atk: number; hp: number } = { atk: 0, hp: 0 };
  /**
   * 其他参数
   * targetCard 目标卡片
   */
  otherParams: Record<string, any> = {};
  /**
   * 战斗日志数组
   */
  battleLogs: string[] = [];
  /**
   * 伤害是否回溯
   */
  isDamageBack: boolean = false;

  /**
   * 受到伤害
   * 先从护甲扣除，护甲不够才进行生命值扣除
   * @param damage - 受到的伤害值
   */
  受到伤害(damage: number): void {
    if (!this.hero) {
      throw new Error('玩家没有英雄');
    }
    // 伤害监听触发
    this.getMinionsOnBattlefield().forEach(minion => {
      if (minion) {
        minion.玩家伤害监听触发(this, damage);
      }
    });
    if (this.isDamageBack) {
      return;
    }
    // 先从护甲扣除
    const armorDamage = Math.min(damage, this.hero.armor);
    this.hero.armor -= armorDamage;
    damage -= armorDamage;
    // 护甲不够时，从生命值扣除
    if (damage > 0) {
      this.hero.health -= damage;
      if (this.hero.health <= 0) {
        // todo 玩家死亡了
        console.log(`【${this.name}】死亡了`);
      }
    }
  }
  /**
   * 添加战斗日志
   * @param log - 战斗日志内容
   */
  addBattleLog(log: string): void {
    this.battleLogs.push(log);
  }

  /**
   * 战斗开始前初始化战斗中的随从
   */
  战斗开始前初始化() {
    for (let index = 0; index < this.minionsOnBattlefield.length; index++) {
      const tempMinion = this.minionsOnBattlefield[index];
      if (tempMinion) {
        const temp = tempMinion.copy() as Minion;
        // 注意：这里暂时传递null作为player参数，因为该方法用于初始化战斗中的随从
        temp.fightHealth = temp.getHealth(this);
        temp.hasAttacked = false;
        temp.location = 'fighting';
        this.minionsInBattle[index] = temp;
      } else {
        this.minionsInBattle[index] = undefined;
      }
    }
    this.battleLogs = [];
    this.isInBattle = true;
    const allMinions = this.minionsInBattle
      .map(temp => {
        if (temp) {
          return temp.getBattleLogStr(this);
        }
        return '';
      })
      .join(',');

    this.addBattleLog(`【${this.name}战斗初始化完成】，随从有[${allMinions}]`);
  }

  /**
   * 战斗开始时
   */
  战斗开始时() {
    for (let index = 0; index < this.minionsInBattle.length; index++) {
      const tempMinion = this.minionsInBattle[index];
      if (tempMinion) {
        tempMinion.战斗开始时(this);
      }
    }
  }
  /**
   * 友方死亡随从监听
   */
  友方死亡随从监听(_player: Player, _死亡的随从: Minion) {
    this.getMinionsOnBattlefield().forEach(minion => {
      if (minion) {
        minion.友方死亡随从监听(this, _死亡的随从);
      }
    });
  }

  /**
   * 通过strId获取卡牌
   */
  getCardByStrId(strId: string): Card {
    const card = db_card.getCardByStrId(strId);
    if (card) {
      return card;
    } else {
      throw new Error(`未找到strId为${strId}的卡牌`);
    }
  }

  /**
   * 获取当前战场上的随从数组
   */
  getMinionsOnBattlefield(): (Minion | undefined)[] {
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
    if (minion.removeRattleData && minion.removeRattleData.index !== undefined) {
      return minion.removeRattleData.index;
    }
    const minionsOnBattlefield = this.getMinionsOnBattlefield();
    return minionsOnBattlefield.findIndex(card => {
      if (card) {
        return card.id === minion.id;
      }
      return false;
    });
  }

  /**
   * 移除随从
   * @param minion 要移除的随从
   * @param attackerPlayer 攻击方玩家（用于添加相同的战斗日志）
   * @returns 战斗日志字符串
   */
  移除随从(minion: Minion) {
    const minionIndex = this.getMinionIndexOnBattlefield(minion);
    if (minionIndex === -1) {
      // 如果找不到随从，可能是因为它还没有被正式添加到战场数组中（比如立即攻击的召唤物）
      // 这种情况下，我们不需要抛出错误，直接返回即可
      if (minion.isImmediateAttack) {
        return;
      }
      throw new Error(`无法找到随从 ${minion.strId} 在 ${this.name} 的战场上`);
    }
    // 移除前记录一些信息
    minion.removeRattleData = {
      index: minionIndex,
    };
    this.minionsInBattle[minionIndex] = undefined;
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
      minion.fightHealth = minion.getHealth(this);
      minion.location = 'fighting';
    } else {
      minion.location = 'battlefield';
    }
    if (this.isMinionsOnBattlefieldFull()) {
      console.log('战场满了');
      if (this.isInBattle) {
        this.addBattleLog(`【战场满了无法召唤随从】${minion.getBattleLogStr(this)}`);
      }
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
    if (this.isInBattle) {
      const logStr = this.minionsInBattle
        .filter(temp => temp !== undefined)
        .map(temp => temp.getBattleLogStr(this))
        .join(',');
      this.addBattleLog(
        `【${this.name}】召唤随从${minion.getBattleLogStr(this)}，当前随从:[${logStr}]`
      );
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
