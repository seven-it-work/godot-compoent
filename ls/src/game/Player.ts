import { Hero } from './Hero';
import { Minion } from './Minion';

/**
 * 玩家类 - 定义玩家的数据结构和行为
 */
export class Player {
  /** 玩家ID - 唯一标识符 */
  id: string;
  /** 英雄实例 - 玩家控制的英雄 */
  hero: Hero;
  /** 战场上的随从 - 固定7个位置，null表示该位置为空 */
  minions: (Minion | null)[];
  /** 随从替补席 - 等待上场的随从列表 */
  bench: Minion[];
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
    this.bench = []; // 初始化为空替补席
    this.tavernLevel = 1; // 初始酒馆等级为1
    this.gold = 3; // 初始金币为3
    this.maxGold = 10; // 最大金币为10
    this.turn = 1; // 初始回合为1
    this.isDead = false; // 初始未死亡
    this.isPlayer = isPlayer; // 是否为玩家
    this.winStreak = 0; // 初始连胜为0
    this.lossStreak = 0; // 初始连败为0
  }

  /**
   * 招募随从到替补席 - 消耗金币将随从添加到替补席
   * @param minion - 要招募的随从实例
   * @returns 是否成功招募
   * @使用方式：当玩家从酒馆购买随从时调用
   */
  recruitMinion(minion: Minion): boolean {
    // 检查金币是否足够
    if (this.gold < minion.cost) {
      return false;
    }

    // 检查替补席是否已满
    if (this.bench.length >= 7) {
      return false;
    }

    // 扣除金币
    this.gold -= minion.cost;
    // 添加到替补席
    this.bench.push(minion);
    return true;
  }

  /**
   * 将替补席中的随从放到战场上 - 将替补席的随从移动到战场上的指定位置
   * @param index - 替补席中随从的索引
   * @param position - 战场上的目标位置
   * @returns 是否成功放置
   * @使用方式：当玩家从替补席拖动随从到战场时调用
   */
  placeMinionFromBench(index: number, position: number): boolean {
    // 调试日志
    console.log('Player.placeMinionFromBench被调用');
    console.log('index:', index);
    console.log('position:', position);
    console.log('bench:', this.bench);
    console.log('minions:', this.minions);

    // 检查索引是否超出替补席范围
    if (index < 0 || index >= this.bench.length) {
      console.log('index超出bench范围，返回false');
      return false;
    }

    // 检查位置是否超出战场范围
    if (position < 0 || position >= 7) {
      console.log('position超出minions范围，返回false');
      return false;
    }

    const minion = this.bench[index];
    if (minion) {
      console.log('获取到的minion:', minion);
      // 检查目标位置是否为空
      if (this.minions[position] === null) {
        console.log(`目标位置${position}为空，直接放置`);
        // 从替补席移除
        this.bench.splice(index, 1);
        // 放置到战场
        this.minions[position] = minion;
        // 更新随从位置
        minion.position = position;
        console.log('放置成功，返回true');
        console.log('放置后的bench:', this.bench);
        console.log('放置后的minions:', this.minions);
        return true;
      } else {
        console.log(`目标位置${position}已有随从，从第一个位置开始找第一个空位置`);
        // 如果目标位置已有随从，从第一个位置开始找第一个空位置
        for (let i = 0; i < 7; i++) {
          if (this.minions[i] === null) {
            console.log(`找到空位置${i}，放置随从`);
            // 从替补席移除
            this.bench.splice(index, 1);
            // 放置到战场空位置
            this.minions[i] = minion;
            // 更新随从位置
            minion.position = i;
            console.log('放置成功，返回true');
            console.log('放置后的bench:', this.bench);
            console.log('放置后的minions:', this.minions);
            return true;
          }
        }
        console.log('没有找到空位置，返回false');
      }
    } else {
      console.log('minion不存在，返回false');
    }
    return false;
  }

  /**
   * 将战场上的随从放回替补席 - 将战场上的随从移动到替补席
   * @param position - 战场上的目标位置
   * @returns 是否成功放回
   * @使用方式：当玩家从战场拖动随从到替补席时调用
   */
  returnMinionToBench(position: number): boolean {
    // 检查位置是否超出战场范围
    if (position < 0 || position >= 7) {
      return false;
    }

    // 检查替补席是否已满
    if (this.bench.length >= 7) {
      return false;
    }

    const minion = this.minions[position];
    if (minion) {
      // 从战场移除
      this.minions[position] = null;
      // 添加到替补席
      this.bench.push(minion);
      // 更新随从位置
      minion.position = null;
      return true;
    }
    return false;
  }

  /**
   * 出售随从 - 出售战场上或替补席上的随从，获得金币
   * @param type - 随从类型（'minion'表示战场，'bench'表示替补席）
   * @param index - 随从索引
   * @returns 是否成功出售
   * @使用方式：当玩家点击随从选择出售时调用
   */
  sellMinion(type: 'minion' | 'bench', index: number): boolean {
    if (type === 'minion') {
      // 出售战场上的随从
      if (index < 0 || index >= this.minions.length) {
        return false;
      }

      // 检查要出售的位置是否有随从
      if (this.minions[index] === null) {
        return false;
      }

      // 将该位置设置为null
      this.minions[index] = null;
    } else {
      // 出售替补席上的随从
      if (index < 0 || index >= this.bench.length) {
        return false;
      }

      // 手牌不是固定数组，直接移除
      this.bench.splice(index, 1);
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
   * 结束回合 - 重置金币、随从状态和技能冷却
   * @使用方式：当玩家结束当前回合时调用
   */
  endTurn(): void {
    // 增加回合数
    this.turn += 1;
    // 重置金币（每回合增加1，不超过最大金币）
    this.gold = Math.min(3 + Math.floor((this.turn - 1) / 1), this.maxGold);

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
  }

  /**
   * 检查三连 - 检查替补席中是否有三个相同的随从
   * @returns 可以合成三连的随从实例，没有则返回null
   * @使用方式：当玩家招募新随从后调用，检查是否可以合成三连
   */
  checkTriple(): Minion | null {
    // 统计替补席中的随从数量
    const minionCounts: { [key: string]: number } = {};

    this.bench.forEach(minion => {
      if (!minion.isGolden) {
        minionCounts[minion.strId] = (minionCounts[minion.strId] || 0) + 1;
      }
    });

    // 检查是否有三连
    for (const [minionStrId, count] of Object.entries(minionCounts)) {
      if (count >= 3) {
        // 找到对应的随从
        const targetMinion = this.bench.find(
          minion => minion.strId === minionStrId && !minion.isGolden
        );
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
    const targetMinions = this.bench.filter(
      minion => minion.strId === minionStrId && !minion.isGolden
    );

    // 检查是否有足够的随从进行合成
    if (targetMinions.length < 3 || !targetMinions[0]) {
      return null;
    }

    // 移除这3个随从
    for (let i = 0; i < 3; i++) {
      const index = this.bench.findIndex(minion => minion === targetMinions[i]);
      if (index !== -1) {
        this.bench.splice(index, 1);
      }
    }

    // 创建金色随从
    const goldenMinion = targetMinions[0].clone();
    goldenMinion.upgradeToGolden();

    // 将金色随从放到替补席
    this.bench.push(goldenMinion);

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
    if (this.minions[fromIndex] === null) {
      return false;
    }

    // 保存要移动的随从
    const movedMinion = this.minions[fromIndex];

    // 检查目标位置是否为空
    if (this.minions[toIndex] === null) {
      // 如果目标位置为空，直接移动
      this.minions[fromIndex] = null;
      this.minions[toIndex] = movedMinion!;
      movedMinion!.position = toIndex;
    } else {
      // 如果目标位置不为空，交换两个位置的随从
      const targetMinion = this.minions[toIndex];
      this.minions[fromIndex] = targetMinion as Minion | null;
      this.minions[toIndex] = movedMinion!;

      // 更新位置
      if (targetMinion) {
        targetMinion.position = fromIndex;
      }
      movedMinion!.position = toIndex;
    }

    return true;
  }
}
