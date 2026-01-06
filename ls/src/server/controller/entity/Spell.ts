import { Card, card_utils } from '@/server/controller/entity/Card';

// 法术工具类
export const spell_utils = {
  /**
   * 初始化法术数据
   * @param spell 法术实例
   * @param data 法术数据
   */
  initSpellData(spell: Spell, data: any) {
    card_utils.initCardData(spell, data);
    // 这里可以根据需要添加法术特定的初始化逻辑
  },
};

export class Spell extends Card {
  type: 'spell' = 'spell';
}
