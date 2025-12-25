import { Card } from './Card';
import { Hero } from './Hero';
import { Minion } from './Minion';
import { Spell } from './Spell';

/**
 * 玩家类 - 定义玩家的数据结构和行为
 */
export class Player {
  /** 玩家ID - 唯一标识符 */
  id: string;
  /** 英雄实例 - 玩家控制的英雄 */
  hero: Hero;
  /** 战场上的随从 - 固定7个位置，null表示该位置为空 */
  minions: (Minion | null | undefined)[];
  /** 手牌 - 等待上场的卡片列表（包含随从和法术）
   * 统一添加入口：
   * - recruitMinion()：从酒馆招募随从到手牌
   * - returnMinionToHand()：将战场上的随从放回手牌
   * - performTriple()：合成三连后将金色随从放到手牌
   * - addCard()：添加新卡片到手牌
   * 统一删除入口：
   * - placeMinionFromHand()：将手牌随从放到战场
   * - sellMinion(type: 'hand')：出售手牌随从
   * - performTriple()：合成三连时移除3个基础随从
   * - executeCard()：使用卡片后移除
   * 请不要直接使用this.cards.push或this.cards.splice操作 */
  cards: Card[];
  /** 酒馆等级 - 玩家酒馆的等级（1-6） */
  tavernLevel: number;
  /** 当前金币 - 玩家拥有的金币 */
  gold: number;
  /** 最大金币 - 玩家能拥有的最大金币数 */
  maxGold: number;
  /** 当前回合 - 玩家经历的回合数 */
  turn: number;
  /** 是否死亡 - 玩家是否已经死亡 */
  isDead: boolean;
  /** 是否为玩家 - 区分玩家和AI */
  isPlayer: boolean;
  /** 连胜次数 - 连续获胜的次数 */
  winStreak: number;
  /** 连败次数 - 连续失败的次数 */
  lossStreak: number;
  /** 待添加卡片队列 - 当手牌满时，等待添加的卡片列表 */
  pendingCards: Card[];
  /** 最大手牌数量 - 玩家能拥有的最大手牌数量 */
  maxCards: number;
  /** 下回合额外铸币奖励 - 存储下回合获得的额外铸币数量 */
  nextTurnExtraGold: number;

  /**
   * 玩家构造函数
   * @param id - 玩家ID
   * @param hero - 英雄实例
   * @param isPlayer - 是否为玩家，默认为false（AI）
   */
  constructor(id: string, hero: Hero, isPlayer: boolean = false) {
    this.id = id;
    this.hero = hero;
    this.minions = new Array(7).fill(null) as (Minion | null)[]; // 初始化为7个空位置
    this.cards = []; // 初始化为空手牌
    this.tavernLevel = 1; // 初始酒馆等级为1
    this.gold = 3; // 初始金币为3
    this.maxGold = 10; // 最大金币为10
    this.turn = 1; // 初始回合为1
    this.isDead = false; // 初始未死亡
    this.isPlayer = isPlayer; // 是否为玩家
    this.winStreak = 0; // 初始连胜为0
    this.lossStreak = 0; // 初始连败为0
    this.pendingCards = []; // 初始待添加卡片队列为空
    this.maxCards = 10; // 最大手牌数量为10
    this.nextTurnExtraGold = 0; // 初始下回合额外铸币奖励为0
  }

  /**
   * 召唤随从到战场 - 统一的战场召唤入口
   * @param minion - 要召唤的随从实例
   * @param referencePosition - 参考位置（触发召唤的随从位置）
   * @returns 是否成功召唤
   * @使用方式：当需要在战场上召唤随从时调用（如战吼、亡语、手牌召唤）
   */
  /**
   * 设置指定位置的随从 - 统一的minions管理入口
   * @param position - 战场位置索引(0-6)
   * @param minion - 要设置的随从实例，null表示清空该位置
   * @returns 是否成功设置
   */
  public setMinionAtPosition(position: number, minion: Minion | null | undefined): boolean {
    // 检查位置是否有效
    if (position < 0 || position >= this.minions.length) {
      return false;
    }

    // 如果设置随从到该位置，更新area
    if (minion) {
      minion.area = '战场';
      minion.position = position;
    }

    this.minions[position] = minion;
    return true;
  }

  /**
   * 获取指定位置的随从 - 统一的minions管理入口
   * @param position - 战场位置索引(0-6)
   * @returns 该位置的随从实例，null表示该位置为空
   */
  public getMinionAtPosition(position: number): Minion | null | undefined {
    // 检查位置是否有效
    if (position < 0 || position >= this.minions.length) {
      return null;
    }
    return this.minions[position];
  }

  /**
   * 移除指定位置的随从 - 统一的minions管理入口
   * @param position - 战场位置索引(0-6)
   * @returns 被移除的随从实例，null表示该位置原本为空
   */
  public removeMinionAtPosition(position: number): Minion | null | undefined {
    // 检查位置是否有效
    if (position < 0 || position >= this.minions.length) {
      return null;
    }

    const removedMinion = this.minions[position];
    this.minions[position] = null;
    return removedMinion;
  }

  /**
   * 召唤随从到战场 - 统一的战场召唤入口
   * @param minion - 要召唤的随从实例
   * @param referencePosition - 参考位置（触发召唤的随从位置）
   * @returns 是否成功召唤
   * @使用方式：当需要在战场上召唤随从时调用（如战吼、亡语、手牌召唤）
   */
  public summonMinion(minion: Minion, referencePosition: number | null): boolean {
    // 检查战场是否已满
    const emptyPositions = this.minions.filter(pos => pos === null).length;
    if (emptyPositions === 0) {
      return false;
    }
    // 先查看是否还有空位
    const emptyPositionsCount = this.minions.filter(pos => !pos).length;
    if (emptyPositionsCount >= 7) {
      // 满了无法召唤
      console.log('战场已满，无法召唤随从');
      return false;
    }
    if (referencePosition == null) {
      // 插入最后
      for (let i = 0; i < 7; i++) {
        if (this.minions[i] === null) {
          this.minions[i] = minion;
          return true;
        }
      }
    } else {
      // 插入指定位置
      this.minions.splice(referencePosition, 0, minion);
      this.minions.splice(7, 1);
      return true;
    }

    // 确定召唤位置
    let summonPosition: number | null = null;

    if (referencePosition !== null && referencePosition >= 0 && referencePosition < 7) {
      // 在参考位置后面查找空位置
      for (let i = referencePosition + 1; i < 7; i++) {
        if (this.minions[i] === null) {
          summonPosition = i;
          break;
        }
      }

      // 如果参考位置后面没有空位置，从第一个位置开始查找
      if (summonPosition === null) {
        for (let i = 0; i < referencePosition + 1; i++) {
          if (this.minions[i] === null) {
            summonPosition = i;
            break;
          }
        }
      }
    } else {
      // 参考位置无效，从第一个空位置开始插入
      for (let i = 0; i < 7; i++) {
        if (this.minions[i] === null) {
          summonPosition = i;
          break;
        }
      }
    }

    // 如果没有找到空位置（理论上不会发生，因为前面已经检查过）
    if (summonPosition === null) {
      return false;
    }

    // 召唤随从到战场
    return this.setMinionAtPosition(summonPosition, minion);
  }

  /**
   * 添加卡片到手牌 - 统一的手牌添加入口
   * @param card - 要添加的卡片实例（随从或法术）
   * @returns 是否成功添加
   * @使用方式：当需要将卡片添加到手牌时调用（内部方法）
   */
  private addCard(card: Card): boolean {
    // 检查手牌是否已满
    if (this.cards.length >= this.maxCards) {
      return false;
    }

    // 设置卡片区域为手牌
    card.area = '手牌';
    // 创建新数组以确保响应式更新
    this.cards = [...this.cards, card];
    return true;
  }

  /**
   * 直接添加卡片到手牌 - 用于特殊效果（如战吼）的手牌添加入口
   * @param card - 要添加的卡片实例（随从或法术）
   * @returns 是否成功添加
   * @使用方式：当通过特殊效果（如战吼、亡语）获得卡片时调用
   */
  public addCardToHand(card: Card): boolean {
    // 检查手牌是否已满
    if (this.cards.length < this.maxCards) {
      // 直接添加到手牌
      return this.addCard(card);
    } else {
      // 手牌已满，只有塑造法术（shaping）才添加到待处理队列
      if (card instanceof Spell && card.type === 'shaping') {
        this.pendingCards.push(card);
        return false;
      } else {
        // 其他类型的卡片直接丢弃
        return false;
      }
    }
  }

  /**
   * 从手牌移除卡片 - 统一的手牌删除入口
   * @param index - 要移除的卡片索引
   * @returns 是否成功移除
   * @使用方式：当需要从手牌移除卡片时调用（内部方法）
   */
  private removeCard(index: number): boolean {
    // 检查索引是否超出手牌范围
    if (index < 0 || index >= this.cards.length) {
      return false;
    }

    // 从手牌移除
    this.cards.splice(index, 1);

    // 尝试添加待处理的卡片
    this.tryAddPendingCards();

    return true;
  }

  /**
   * 招募随从到手牌 - 消耗金币将随从添加到手牌
   * @param minion - 要招募的随从实例
   * @returns 是否成功招募
   * @使用方式：当玩家从酒馆购买随从时调用
   */
  recruitMinion(minion: Minion): boolean {
    // 检查金币是否足够
    if (this.gold < minion.cost) {
      return false;
    }

    // 检查手牌是否已满
    if (this.cards.length >= this.maxCards) {
      return false;
    }

    // 扣除金币
    this.gold -= minion.cost;
    // 添加到手牌（使用统一入口）
    return this.addCard(minion);
  }

  /**
   * 将手牌中的随从放到战场上 - 将手牌的随从移动到战场上的指定位置
   * @param index - 手牌中随从的索引
   * @param position - 战场上的目标位置
   * @returns 是否成功放置
   * @使用方式：当玩家从手牌拖动随从到战场时调用
   */
  placeMinionFromHand(index: number, position: number): boolean {
    // 检查索引是否超出手牌范围
    if (index < 0 || index >= this.cards.length) {
      return false;
    }

    // 检查位置是否超出战场范围
    if (position < 0 || position >= 7) {
      return false;
    }

    const card = this.cards[index];
    // 确保是随从类型且card不为undefined
    if (card && card.cardType === 'minion') {
      const minion = card as Minion;
      // 检查目标位置是否为空
      if (this.minions[position] === null) {
        // 从手牌移除（使用统一入口）
        if (!this.removeCard(index)) {
          return false;
        }
        // 放置到战场
        return this.setMinionAtPosition(position, minion);
      } else {
        // 如果目标位置已有随从，从第一个位置开始找第一个空位置
        for (let i = 0; i < 7; i++) {
          if (this.minions[i] === null) {
            // 从手牌移除（使用统一入口）
            if (!this.removeCard(index)) {
              return false;
            }
            // 放置到战场空位置
            return this.setMinionAtPosition(i, minion);
          }
        }
      }
    }
    return false;
  }

  /**
   * 将战场上的随从放回手牌 - 将战场上的随从移动到手牌
   * @param position - 战场上的目标位置
   * @returns 是否成功放回
   * @使用方式：当玩家从战场拖动随从到手牌时调用
   */
  returnMinionToHand(position: number): boolean {
    // 检查位置是否超出战场范围
    if (position < 0 || position >= 7) {
      return false;
    }

    // 检查手牌是否已满
    if (this.cards.length >= this.maxCards) {
      return false;
    }

    const minion = this.getMinionAtPosition(position);
    if (minion) {
      // 从战场移除
      this.removeMinionAtPosition(position);
      // 添加到手牌（使用统一入口）
      if (this.addCard(minion)) {
        // 更新随从位置
        minion.position = null;
        return true;
      }
      // 如果添加失败，将随从放回战场
      this.setMinionAtPosition(position, minion);
      return false;
    }
    return false;
  }

  /**
   * 出售随从 - 出售战场上或手牌上的随从，获得金币
   * @param type - 随从类型（'minion'表示战场，'hand'表示手牌）
   * @param index - 随从索引
   * @returns 是否成功出售
   * @使用方式：当玩家点击随从选择出售时调用
   */
  sellMinion(type: 'minion' | 'hand', index: number): boolean {
    if (type === 'minion') {
      // 出售战场上的随从
      if (index < 0 || index >= this.minions.length) {
        return false;
      }

      // 检查要出售的位置是否有随从
      if (this.getMinionAtPosition(index) === null) {
        return false;
      }

      // 将该位置设置为null
      this.removeMinionAtPosition(index);
    } else {
      // 出售手牌上的随从
      if (index < 0 || index >= this.cards.length) {
        return false;
      }

      // 确保是随从类型
      const card = this.cards[index];
      if (card && card.cardType !== 'minion') {
        return false;
      }

      // 从手牌移除（使用统一入口）
      if (!this.removeCard(index)) {
        return false;
      }
    }

    // 获得金币
    this.gold += 1;
    // 限制金币不超过最大值
    if (this.gold > this.maxGold) {
      this.gold = this.maxGold;
    }
    return true;
  }

  /**
   * 升级酒馆 - 消耗金币提升酒馆等级
   * @returns 是否成功升级
   * @使用方式：当玩家点击升级酒馆按钮时调用
   */
  upgradeTavern(): boolean {
    // 各等级升级费用
    const upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
    const cost = upgradeCosts[this.tavernLevel] || 0;

    // 检查金币是否足够
    if (this.gold < cost) {
      return false;
    }

    // 检查是否已达到最高等级
    if (this.tavernLevel >= 6) {
      return false;
    }

    // 扣除金币
    this.gold -= cost;
    // 提升酒馆等级
    this.tavernLevel += 1;
    return true;
  }

  /**
   * 刷新酒馆 - 消耗金币刷新酒馆中的随从
   * @returns 是否成功刷新
   * @使用方式：当玩家点击刷新酒馆按钮时调用
   */
  refreshTavern(): boolean {
    const refreshCost = 1;

    // 检查金币是否足够
    if (this.gold < refreshCost) {
      return false;
    }

    // 扣除金币
    this.gold -= refreshCost;
    return true;
  }

  /**
   * 开始回合 - 处理回合开始时的逻辑
   * @使用方式：当玩家回合开始时调用
   */
  startTurn(): void {
    // 重置所有随从的塑造法术授予状态
    this.minions.forEach(minion => {
      if (minion) {
        minion.hasGrantedShapingSpell = false;
      }
    });

    // 1. 移除战场上所有随从的临时加成和关键词
    this.minions.forEach(minion => {
      if (minion) {
        minion.onTurnStart();
      }
    });

    // 2. 移除手牌中所有随从的临时加成和关键词
    this.cards.forEach(card => {
      if (card.cardType === 'minion') {
        const minion = card as Minion;
        minion.onTurnStart();
      }
    });

    // 尝试添加待处理的卡片
    this.tryAddPendingCards();
  }

  /**
   * 结束回合 - 重置金币、随从状态和技能冷却
   * @使用方式：当玩家结束当前回合时调用
   */
  endTurn(): void {
    // 增加回合数
    this.turn += 1;
    // 重置金币（每回合增加1，加上下回合额外铸币奖励，不超过最大金币）
    this.gold = Math.min(
      3 + Math.floor((this.turn - 1) / 1) + this.nextTurnExtraGold,
      this.maxGold
    );
    // 重置下回合额外铸币奖励
    this.nextTurnExtraGold = 0;

    // 重置所有随从的攻击状态
    this.minions.forEach(minion => {
      if (minion) {
        minion.hasAttacked = false;
      }
    });

    // 减少英雄技能冷却
    if (this.hero.heroPower.currentCooldown > 0) {
      this.hero.heroPower.currentCooldown -= 1;
    }

    // 处理卡片（移除临时法术，尝试添加待处理卡片）
    this.onTurnEndCards();
  }

  /**
   * 检查三连 - 检查手牌中是否有三个相同的随从
   * @returns 可以合成三连的随从实例，没有则返回null
   * @使用方式：当玩家招募新随从后调用，检查是否可以合成三连
   */
  checkTriple(): Minion | null {
    // 统计手牌中的随从数量
    const minionCounts: { [key: string]: number } = {};

    this.cards.forEach(card => {
      if (card.cardType === 'minion') {
        const minion = card as Minion;
        if (!minion.isGolden) {
          minionCounts[minion.strId] = (minionCounts[minion.strId] || 0) + 1;
        }
      }
    });

    // 检查是否有三连
    for (const [minionStrId, count] of Object.entries(minionCounts)) {
      if (count >= 3) {
        // 找到对应的随从
        const targetMinion = this.cards.find(
          card =>
            card.cardType === 'minion' &&
            (card as Minion).strId === minionStrId &&
            !(card as Minion).isGolden
        ) as Minion;
        if (targetMinion) {
          return targetMinion;
        }
      }
    }

    return null;
  }

  /**
   * 执行三连合成 - 将三个相同的随从合成为金色版本
   * @param minionStrId - 随从的字符串ID
   * @returns 合成后的金色随从实例，失败则返回null
   * @使用方式：当玩家确认合成三连时调用
   */
  performTriple(minionStrId: string): Minion | null {
    // 找到3个相同的随从
    const targetMinions = this.cards.filter(
      card =>
        card.cardType === 'minion' &&
        (card as Minion).strId === minionStrId &&
        !(card as Minion).isGolden
    ) as Minion[];

    // 检查是否有足够的随从进行合成
    if (targetMinions.length < 3 || !targetMinions[0]) {
      return null;
    }

    // 移除这3个随从（使用统一入口）
    for (let i = 0; i < 3; i++) {
      const index = this.cards.findIndex(card => card === targetMinions[i]);
      if (index !== -1) {
        this.removeCard(index);
      }
    }

    // 创建金色随从
    const goldenMinion = targetMinions[0].clone() as Minion;
    goldenMinion.upgradeToGolden();

    // 将金色随从放到手牌（使用统一入口）
    this.addCard(goldenMinion);

    return goldenMinion;
  }

  /**
   * 受到伤害 - 处理玩家受到的伤害
   * @param damage - 受到的伤害值
   * @使用方式：当玩家在战斗中失败时调用
   */
  takeDamage(damage: number): void {
    // 英雄受到伤害
    this.hero.takeDamage(damage);
    // 更新玩家死亡状态
    this.isDead = this.hero.isDead;
  }

  /**
   * 重新排序战场上的随从 - 交换或移动战场上的随从位置
   * @param fromIndex - 原始位置索引
   * @param toIndex - 目标位置索引
   * @returns 是否成功重新排序
   * @使用方式：当玩家在战场上拖动随从重新排序时调用
   */
  reorderMinions(fromIndex: number, toIndex: number): boolean {
    // 检查索引是否超出范围
    if (
      fromIndex < 0 ||
      fromIndex >= this.minions.length ||
      toIndex < 0 ||
      toIndex >= this.minions.length
    ) {
      return false;
    }

    // 检查原位置是否有随从
    const movedMinion = this.getMinionAtPosition(fromIndex);
    if (movedMinion === null || movedMinion === undefined) {
      return false;
    }

    // 检查目标位置是否为空
    const targetMinion = this.getMinionAtPosition(toIndex);
    if (targetMinion === null || targetMinion === undefined) {
      // 如果目标位置为空，直接移动
      if (
        this.setMinionAtPosition(fromIndex, null) &&
        this.setMinionAtPosition(toIndex, movedMinion)
      ) {
        movedMinion.position = toIndex;
        return true;
      }
    } else {
      // 如果目标位置不为空，交换两个位置的随从
      if (
        this.setMinionAtPosition(fromIndex, targetMinion) &&
        this.setMinionAtPosition(toIndex, movedMinion)
      ) {
        // 更新位置
        targetMinion.position = fromIndex;
        movedMinion.position = toIndex;
        return true;
      }
    }

    return false;
  }

  /**
   * 执行法术 - 对目标随从执行法术效果
   * @param spellIndex - 法术在列表中的索引
   * @param target - 目标随从
   * @returns 是否成功执行
   * @使用方式：当玩家使用法术时调用
   */
  executeSpell(spellIndex: number, target: Minion): boolean {
    // 检查索引是否有效
    if (spellIndex < 0 || spellIndex >= this.cards.length) {
      return false;
    }

    const card = this.cards[spellIndex];
    // 确保是法术类型且card不为undefined
    if (card && card.cardType === 'spell') {
      const spell = card as Spell;
      // 执行法术效果
      const success = spell.execute(target);

      if (success) {
        // 从手牌中移除该法术
        this.cards.splice(spellIndex, 1);

        // 尝试添加待处理的卡片
        this.tryAddPendingCards();
      }

      return success;
    }

    return false;
  }

  /**
   * 尝试添加待处理的卡片 - 当手牌有空位时，从待处理队列添加卡片
   * @returns 添加的卡片数量
   * @使用方式：当手牌有空位时调用
   */
  tryAddPendingCards(): number {
    let addedCount = 0;

    // 循环尝试添加待处理卡片，直到手牌已满或待处理队列为空
    while (this.cards.length < this.maxCards && this.pendingCards.length > 0) {
      // 从待处理队列取出第一张卡片
      const card = this.pendingCards.shift();
      if (card) {
        // 创建新数组以确保响应式更新
        this.cards = [...this.cards, card];
        addedCount++;
      }
    }

    return addedCount;
  }

  /**
   * 回合结束时处理卡片 - 处理临时法术和持续效果
   * @returns 移除的卡片数量
   * @使用方式：当回合结束时调用
   */
  onTurnEndCards(): number {
    let removedCount = 0;

    // 处理手牌中的临时法术，创建新数组以确保响应式更新
    const newCards = [];
    for (const card of this.cards) {
      if (card && card.cardType === 'spell') {
        const spell = card as Spell;
        // 调用法术的onTurnEnd方法
        if (spell.onTurnEnd()) {
          // 法术返回true，表示需要移除
          removedCount++;
        } else {
          newCards.push(card);
        }
      } else {
        newCards.push(card);
      }
    }

    this.cards = newCards;

    // 处理完临时法术后，尝试添加待处理的卡片
    this.tryAddPendingCards();

    return removedCount;
  }
}
