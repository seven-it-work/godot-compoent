import { Card } from '@/server/controller/entity/Card';
import type { Minion } from './Minion';
export class Spell extends Card {
  type: 'spell' = 'spell';

  // 使用是否有需要目标
  requiresTarget: boolean = false;

  targetFillter(minionList: Minion[]): Minion[] {
    return minionList;
  }
}
