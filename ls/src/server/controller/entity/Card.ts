import { IdGenerator } from '@/utils/IdGenerator';
import type { Player } from './Player';

export const card_utils = {
  getTier(tier: number): 1 | 2 | 3 | 4 | 5 | 6 | 7 {
    if (tier < 1 || tier > 7) {
      throw new Error('tier must be between 1 and 7');
    }
    return tier as 1 | 2 | 3 | 4 | 5 | 6 | 7;
  },
  initCardData(card: Card, data: any) {
    card.id = data.id;
    card.strId = data.strId;
    card.name = data.nameCN;
    card.text = data.text;
    if (data.tier !== undefined) {
      card.tier = card_utils.getTier(data.tier);
    }
  },
};

export class Card {
  id: string = IdGenerator.generateRandomId(); // 对象唯一标识
  strId: string = ''; // 卡片标识
  name: string = '';
  text: string = ''; // 描述
  type?: 'minion' | 'hero' | 'spell';
  // 是否出现在酒馆中
  inTavern: boolean = false;
  // 购买价格（随从默认3）
  cardPrice: number = 0;
  // 出售价格（随从默认1）
  sellPrice: number = 0;
  // 卡片所在位置（空，酒馆、战场、手牌、战斗中）
  location?: 'tavern' | 'battlefield' | 'hand' | 'fighting';
  // 等级
  tier?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  // 是否金色
  isGolden: boolean = false;

  useCardAfter(_player: Player) {
    // 触发使用卡片后事件
    // console.log('触发使用卡片后事件', this.strId);
  }
  /**
   * 监听使用其他卡片事件
   */
  useOtherCardAfter(_player: Player, _userCard: Card) {
    // 触发使用其他卡片后事件
    // console.log(`使用了${_userCard.strId}，触发监听使用其他卡片事件`);
  }

  getTextFormatArr(_player: Player): string[] {
    // 由子类去实现
    return [];
  }

  textFormat(player: Player): string {
    const values = this.getTextFormatArr(player);
    return this.text.replace(/{(\d+)}/g, (match, indexStr) => {
      const index = parseInt(indexStr, 10);
      return values[index] !== undefined ? values[index].toString() : match; // 保留原占位符
    });
  }
}
