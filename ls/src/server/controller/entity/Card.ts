export class Card {
  id: string = ''; // 对象唯一标识
  strId: string = ''; // 卡片标识
  name: string = '';
  type?: 'minion' | 'hero';
  // 是否出现在酒馆中
  inTavern: boolean = false;
  // 等级
  tier?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}
