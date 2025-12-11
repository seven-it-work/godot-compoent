import { Player } from './Player';
import { Hero } from './Hero';
import { Minion } from './Minion';
import { GameManager } from './GameManager';

// AI难度类型
export type AIDifficulty = 'easy' | 'medium' | 'hard';

// AI难度常量
export const AIDifficulty = {
  EASY: 'easy' as AIDifficulty,
  MEDIUM: 'medium' as AIDifficulty,
  HARD: 'hard' as AIDifficulty
} as const;

// AI玩家类
export class AIPlayer extends Player {
  difficulty: AIDifficulty;
  gameManager: GameManager | null;

  constructor(
    id: string,
    hero: Hero,
    difficulty: AIDifficulty = AIDifficulty.MEDIUM,
    gameManager: GameManager | null = null
  ) {
    super(id, hero, false);
    this.difficulty = difficulty;
    this.gameManager = gameManager;
  }

  // AI执行回合
  executeTurn(gameManager: GameManager): void {
    this.gameManager = gameManager;
    
    // 按照优先级执行AI决策
    this.decideUpgradeTavern();
    this.decideRefreshTavern();
    this.decideBuyMinions();
    this.decidePlaceMinions();
    this.decideSellMinions();
    this.decideUseHeroPower();
    
    // 结束回合
    gameManager.endPlayerTurn();
  }

  // 决定是否升级酒馆
  private decideUpgradeTavern(): void {
    // 简单AI：较低概率升级酒馆
    // 中等AI：根据回合数和金币情况决定
    // 困难AI：更智能的升级策略
    
    const upgradeCost = this.gameManager?.tavern.upgrade() || 0;
    if (upgradeCost <= 0) {
      return;
    }

    let upgradeChance = 0;
    
    switch (this.difficulty) {
      case AIDifficulty.EASY:
        upgradeChance = 0.2; // 20% 概率升级
        break;
      case AIDifficulty.MEDIUM:
        // 根据回合数和金币情况调整概率
        if (this.turn <= 3) {
          upgradeChance = 0.3;
        } else if (this.turn <= 6) {
          upgradeChance = 0.5;
        } else {
          upgradeChance = 0.7;
        }
        break;
      case AIDifficulty.HARD:
        // 更复杂的升级策略
        if (this.tavernLevel < 3 && this.turn <= 5) {
          upgradeChance = 0.8;
        } else if (this.tavernLevel < 4 && this.turn <= 8) {
          upgradeChance = 0.6;
        } else {
          upgradeChance = 0.4;
        }
        break;
    }

    // 如果金币足够，且随机数小于升级概率，则升级
    if (this.gold >= upgradeCost && Math.random() < upgradeChance) {
      this.upgradeTavern();
    }
  }

  // 决定是否刷新酒馆
  private decideRefreshTavern(): void {
    // 简单AI：较低概率刷新
    // 中等AI：根据现有随从质量决定
    // 困难AI：更智能的刷新策略
    
    const refreshCost = this.gameManager?.tavern.refreshCost || 1;
    
    let refreshChance = 0;
    
    switch (this.difficulty) {
      case AIDifficulty.EASY:
        refreshChance = 0.3; // 30% 概率刷新
        break;
      case AIDifficulty.MEDIUM:
        // 根据现有随从数量和质量调整概率
        if (this.bench.length < 3) {
          refreshChance = 0.6;
        } else {
          refreshChance = 0.3;
        }
        break;
      case AIDifficulty.HARD:
        // 更复杂的刷新策略
        const hasGoodMinion = this.gameManager?.tavern.availableMinions.some(
          minion => minion.tier >= this.tavernLevel || minion.attack + minion.health >= 6
        ) || false;
        
        if (!hasGoodMinion && this.bench.length < 5) {
          refreshChance = 0.8;
        } else {
          refreshChance = 0.2;
        }
        break;
    }

    // 如果金币足够，且随机数小于刷新概率，则刷新
    if (this.gold >= refreshCost && Math.random() < refreshChance) {
      this.refreshTavern();
    }
  }

  // 决定购买哪些随从
  private decideBuyMinions(): void {
    if (!this.gameManager) {
      return;
    }

    // 遍历可用随从，决定是否购买
    for (let i = 0; i < this.gameManager.tavern.availableMinions.length; i++) {
      const minion = this.gameManager.tavern.availableMinions[i];
      
      // 决定是否购买该随从
      if (this.shouldBuyMinion(minion)) {
        // 尝试购买
        if (minion && this.gold >= minion.cost && this.bench.length < 7) {
          this.gameManager.buyMinion(this, i);
          i--; // 因为购买后数组会变化，需要调整索引
        }
      }
    }
  }

  // 判断是否应该购买某个随从
  private shouldBuyMinion(minion: Minion | undefined): boolean {
    if (!minion) {
      return false;
    }
    // 简单AI：只购买高攻击力或高生命值的随从
    // 中等AI：考虑随从类型、特效等
    // 困难AI：更全面的评估
    
    const minionValue = minion.attack + minion.health;
    let buyChance = 0;
    
    switch (this.difficulty) {
      case AIDifficulty.EASY:
        // 简单AI：只购买价值 >= 4的随从
        buyChance = minionValue >= 4 ? 1 : 0;
        break;
      case AIDifficulty.MEDIUM:
        // 中等AI：考虑价值和星级
        if (minion.tier >= this.tavernLevel) {
          buyChance = 0.8;
        } else if (minionValue >= 5) {
          buyChance = 0.6;
        } else if (minionValue >= 3) {
          buyChance = 0.3;
        } else {
          buyChance = 0;
        }
        break;
      case AIDifficulty.HARD:
        // 困难AI：更全面的评估
        let valueScore = minionValue;
        
        // 考虑关键词
        if (minion.keywords.length > 0) {
          valueScore += minion.keywords.length * 2;
        }
        
        // 考虑mechanics数量（代替effects）
        if (minion.mechanics.length > 0) {
          valueScore += minion.mechanics.length * 3;
        }
        
        // 考虑星级
        valueScore += (minion.tier - this.tavernLevel) * 2;
        
        // 计算购买概率
        buyChance = Math.min(valueScore / 10, 1);
        break;
    }

    return Math.random() < buyChance;
  }

  // 决定如何布置随从
  private decidePlaceMinions(): void {
    // 简单AI：随机布置
    // 中等AI：简单的位置策略
    // 困难AI：更智能的位置策略
    
    // 将bench中的随从放到战场上
    while (this.bench.length > 0 && this.minions.length < 7) {
      const randomIndex = Math.floor(Math.random() * this.bench.length);
      const randomPosition = Math.floor(Math.random() * (this.minions.length + 1));
      this.placeMinionFromBench(randomIndex, randomPosition);
    }

    // 根据AI难度调整随从位置
    if (this.difficulty === AIDifficulty.HARD) {
      this.optimizeMinionPositions();
    }
  }

  // 优化随从位置（困难AI）
  private optimizeMinionPositions(): void {
    // 基本位置策略：
    // 1. 嘲讽随从放在前面
    // 2. 高攻击力随从放在前面
    // 3. 具有亡语或特效的随从放在后面
    // 4. 圣盾随从放在前面吸收伤害
    
    this.minions.sort((a, b) => {
      // 嘲讽随从优先级高
      const aHasTaunt = a.keywords.includes('taunt' as any);
      const bHasTaunt = b.keywords.includes('taunt' as any);
      if (aHasTaunt && !bHasTaunt) return -1;
      if (!aHasTaunt && bHasTaunt) return 1;
      
      // 圣盾随从优先级高
      const aHasDivineShield = a.hasDivineShield || a.keywords.includes('divine_shield' as any);
      const bHasDivineShield = b.hasDivineShield || b.keywords.includes('divine_shield' as any);
      if (aHasDivineShield && !bHasDivineShield) return -1;
      if (!aHasDivineShield && bHasDivineShield) return 1;
      
      // 高攻击力随从优先级高
      if (a.attack !== b.attack) return b.attack - a.attack;
      
      // 高生命值随从优先级高
      return b.health - a.health;
    });
    
    // 更新随从位置
    this.minions.forEach((minion, index) => {
      minion.position = index;
    });
  }

  // 决定是否出售随从
  private decideSellMinions(): void {
    // 遍历bench和战场上的随从，决定是否出售
    for (let i = this.bench.length - 1; i >= 0; i--) {
      const minion = this.bench[i];
      if (minion && this.shouldSellMinion(minion)) {
        this.sellMinion('bench', i);
      }
    }
    
    for (let i = this.minions.length - 1; i >= 0; i--) {
      const minion = this.minions[i];
      if (minion && this.shouldSellMinion(minion)) {
        this.sellMinion('minion', i);
      }
    }
  }

  // 判断是否应该出售某个随从
  private shouldSellMinion(minion: Minion): boolean {
    // 简单AI：只出售低价值随从
    // 中等AI：考虑随从质量和当前需求
    // 困难AI：更智能的出售策略
    
    const minionValue = minion.attack + minion.health;
    let sellChance = 0;
    
    switch (this.difficulty) {
      case AIDifficulty.EASY:
        // 简单AI：只出售价值 < 3的随从
        sellChance = minionValue < 3 ? 0.8 : 0;
        break;
      case AIDifficulty.MEDIUM:
        // 中等AI：考虑价值和当前情况
        if (minionValue < 4 && this.bench.length >= 6) {
          sellChance = 0.7;
        } else {
          sellChance = 0.1;
        }
        break;
      case AIDifficulty.HARD:
        // 困难AI：更全面的评估
        // 1. 检查是否有更好的随从可以替换
        // 2. 检查是否需要金币
        // 3. 检查随从是否适合当前阵容
        
        const isLowValue = minionValue < 5;
        const needsGold = this.gold < 5;
        const benchFull = this.bench.length >= 7;
        
        if (isLowValue && (needsGold || benchFull)) {
          sellChance = 0.9;
        } else {
          sellChance = 0.1;
        }
        break;
    }

    return Math.random() < sellChance;
  }

  // 决定是否使用英雄技能
  private decideUseHeroPower(): void {
    // 简单AI：很少使用英雄技能
    // 中等AI：偶尔使用英雄技能
    // 困难AI：根据情况智能使用
    
    let useChance = 0;
    
    switch (this.difficulty) {
      case AIDifficulty.EASY:
        useChance = 0.1; // 10% 概率使用
        break;
      case AIDifficulty.MEDIUM:
        useChance = 0.3; // 30% 概率使用
        break;
      case AIDifficulty.HARD:
        useChance = 0.6; // 60% 概率使用
        break;
    }

    // 如果有足够金币且冷却就绪，考虑使用英雄技能
    if (
      this.hero.heroPower.cost <= this.gold &&
      this.hero.heroPower.currentCooldown === 0 &&
      Math.random() < useChance
    ) {
      this.hero.useHeroPower(this.gameManager!);
    }
  }
}
