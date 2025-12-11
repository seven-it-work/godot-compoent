import { Hero } from './Hero';
import { Minion } from './Minion';

// 玩家类
export class Player {
  id: string;
  hero: Hero;
  minions: Minion[];
  bench: Minion[];
  tavernLevel: number;
  gold: number;
  maxGold: number;
  turn: number;
  isDead: boolean;
  isPlayer: boolean;
  winStreak: number;
  lossStreak: number;

  constructor(id: string, hero: Hero, isPlayer: boolean = false) {
    this.id = id;
    this.hero = hero;
    this.minions = [];
    this.bench = [];
    this.tavernLevel = 1;
    this.gold = 3;
    this.maxGold = 10;
    this.turn = 1;
    this.isDead = false;
    this.isPlayer = isPlayer;
    this.winStreak = 0;
    this.lossStreak = 0;
  }

  // 招募随从到 bench
  recruitMinion(minion: Minion): boolean {
    if (this.gold < minion.cost) {
      return false;
    }

    if (this.bench.length >= 7) {
      return false;
    }

    this.gold -= minion.cost;
    this.bench.push(minion);
    return true;
  }

  // 将 bench 中的随从放到战场上
  placeMinionFromBench(index: number, position: number): boolean {
    if (index < 0 || index >= this.bench.length) {
      return false;
    }

    if (this.minions.length >= 7) {
      return false;
    }

    const minion = this.bench[index];
    this.bench.splice(index, 1);
    this.minions.splice(position, 0, minion);
    minion.position = position;
    return true;
  }

  // 将战场上的随从放回 bench
  returnMinionToBench(position: number): boolean {
    if (position < 0 || position >= this.minions.length) {
      return false;
    }

    if (this.bench.length >= 7) {
      return false;
    }

    const minion = this.minions[position];
    if (minion) {
      this.minions.splice(position, 1);
      this.bench.push(minion);
      minion.position = null;
    }
    return true;
  }

  // 出售随从
  sellMinion(type: 'minion' | 'bench', index: number): boolean {
    let targetArray: Minion[];
    
    if (type === 'minion') {
      if (index < 0 || index >= this.minions.length) {
        return false;
      }
      targetArray = this.minions;
    } else {
      if (index < 0 || index >= this.bench.length) {
        return false;
      }
      targetArray = this.bench;
    }

    // 移除随从
    targetArray.splice(index, 1);
    // 获得金币
    this.gold += 1;
    // 限制金币不超过最大值
    if (this.gold > this.maxGold) {
      this.gold = this.maxGold;
    }
    return true;
  }

  // 升级酒馆
  upgradeTavern(): boolean {
    const upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
    const cost = upgradeCosts[this.tavernLevel] || 0;
    
    if (this.gold < cost) {
      return false;
    }

    if (this.tavernLevel >= 6) {
      return false;
    }

    this.gold -= cost;
    this.tavernLevel += 1;
    return true;
  }

  // 刷新酒馆
  refreshTavern(): boolean {
    const refreshCost = 1;
    
    if (this.gold < refreshCost) {
      return false;
    }

    this.gold -= refreshCost;
    return true;
  }

  // 结束回合
  endTurn(): void {
    // 重置金币
    this.turn += 1;
    this.gold = Math.min(3 + Math.floor((this.turn - 1) / 1), this.maxGold);
    
    // 重置随从状态
    this.minions.forEach(minion => {
      minion.hasAttacked = false;
    });
    
    // 重置技能冷却
    if (this.hero.heroPower.currentCooldown > 0) {
      this.hero.heroPower.currentCooldown -= 1;
    }
  }

  // 检查三连
  checkTriple(): Minion | null {
    // 统计 bench 中的随从数量
    const minionCounts: { [key: string]: number } = {};
    
    this.bench.forEach(minion => {
      if (!minion.isGolden) {
        minionCounts[minion.id] = (minionCounts[minion.id] || 0) + 1;
      }
    });
    
    // 检查是否有三连
    for (const [minionId, count] of Object.entries(minionCounts)) {
      if (count >= 3) {
        // 找到对应的随从
        const targetMinion = this.bench.find(minion => minion.id === minionId && !minion.isGolden);
        if (targetMinion) {
          return targetMinion;
        }
      }
    }
    
    return null;
  }

  // 执行三连合成
  performTriple(minionId: string): Minion | null {
    // 找到3个相同的随从
    const targetMinions = this.bench.filter(minion => minion.id === minionId && !minion.isGolden);
    
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
    
    // 将金色随从放到 bench
    this.bench.push(goldenMinion);
    
    return goldenMinion;
  }

  // 受到伤害
  takeDamage(damage: number): void {
    this.hero.takeDamage(damage);
    this.isDead = this.hero.isDead;
  }
}