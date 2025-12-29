import type { Buff } from '@/server/controller/entity/Buff';
import type { Card } from '@/server/controller/entity/Card';

export const 酒馆升级需要的金币: Record<number, number> = {
  1: 5,
  2: 7,
  3: 8,
  4: 11,
  5: 11,
  6: 12,
};

export class Tavern {
  // 酒馆等级
  level: number = 1;
  // 能生到最大的等级
  maxLevel: number = 6;
  // 当前金币
  gold: number = 0;
  // 当前最大金币
  maxGold: number = 0;
  // 酒馆卡片
  cards: (Card | undefined)[] = Array(7).fill(undefined);
  // 当前回合数
  currentTurn: number = 0;
  // 是否冻结
  isFrozen: boolean = false;
  // 下回合额外获取金币数
  extraGold: number = 0;
  // 刷新费用
  refreshCost: number = 0;
  // 升级酒馆费用
  upgradeCost: number = 0;
  // 元素加成
  elementBonus: Map<string, Buff> = new Map();
}
