import { Card } from '@/server/controller/entity/Card';
import type { CurrentGame } from '@/server/controller/entity/CurrentGame';
export class Minion extends Card {
  type: 'minion' = 'minion';
  // 购买价格（随从默认3）
  cardPrice: number = 3;
  // 出售价格（随从默认1）
  sellPrice: number = 1;

  //是否存在战吼
  hasBattlecry: boolean = false;

  // 执行战吼
  battlecry(_currentGame: CurrentGame) {
    if (!this.hasBattlecry) {
      return;
    }
    console.log('执行战吼', this.strId);
  }
}
