import { IdGenerator } from '@/utils/IdGenerator';
import type { CurrentGame } from './CurrentGame';

export class Card {
  id: string = IdGenerator.generateRandomId(); // 对象唯一标识
  strId: string = ''; // 卡片标识
  name: string = '';
  type?: 'minion' | 'hero' | 'spell';
  // 是否出现在酒馆中
  inTavern: boolean = false;
  // 购买价格（随从默认3）
  cardPrice: number = 0;
  // 出售价格（随从默认1）
  sellPrice: number = 0;
  // 卡片所在位置（空，酒馆、战场、手牌）
  location?: 'tavern' | 'battlefield' | 'hand';
  // 等级
  tier?: 1 | 2 | 3 | 4 | 5 | 6 | 7;

  useCardAfter(_currentGame: CurrentGame) {
    // 触发使用卡片后事件
    // console.log('触发使用卡片后事件', this.strId);
  }
  /**
   * 监听使用其他卡片事件
   */
  useOtherCardAfter(_currentGame: CurrentGame, _userCard: Card) {
    // 触发使用其他卡片后事件
    // console.log(`使用了${_userCard.strId}，触发监听使用其他卡片事件`);
  }
}
