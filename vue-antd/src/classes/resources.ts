// 资源相关类，用于避免循环引用

import type { SpiritRootType } from './character';

// 灵气类
export class SpiritQi {
  gold: number; // 金灵气
  wood: number; // 木灵气
  water: number; // 水灵气
  fire: number; // 火灵气
  earth: number; // 土灵气
  maxGold: number; // 金灵气上限
  maxWood: number; // 木灵气上限
  maxWater: number; // 水灵气上限
  maxFire: number; // 火灵气上限
  maxEarth: number; // 土灵气上限

  constructor(spiritQi: {
    gold: number;
    wood: number;
    water: number;
    fire: number;
    earth: number;
    maxGold: number;
    maxWood: number;
    maxWater: number;
    maxFire: number;
    maxEarth: number;
  }) {
    this.gold = spiritQi.gold;
    this.wood = spiritQi.wood;
    this.water = spiritQi.water;
    this.fire = spiritQi.fire;
    this.earth = spiritQi.earth;
    this.maxGold = spiritQi.maxGold;
    this.maxWood = spiritQi.maxWood;
    this.maxWater = spiritQi.maxWater;
    this.maxFire = spiritQi.maxFire;
    this.maxEarth = spiritQi.maxEarth;
  }

  // 吸收灵气
  absorb(type: SpiritRootType, amount: number): void {
    const current = this[type];
    const max = this[`max${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof SpiritQi];
    this[type] = Math.min(current + amount, max as number);
  }

  // 使用灵气
  consume(type: SpiritRootType, amount: number): boolean {
    if (this[type] >= amount) {
      this[type] -= amount;
      return true;
    }
    return false;
  }

  // 增加灵气上限
  increaseMax(type: SpiritRootType, amount: number): void {
    const maxKeyMap: Record<SpiritRootType, keyof SpiritQi> = {
      gold: 'maxGold',
      wood: 'maxWood',
      water: 'maxWater',
      fire: 'maxFire',
      earth: 'maxEarth'
    };
    const maxKey = maxKeyMap[type];
    // 使用更明确的类型断言
    (this as any)[maxKey] = (this as any)[maxKey] + amount;
  }
}
