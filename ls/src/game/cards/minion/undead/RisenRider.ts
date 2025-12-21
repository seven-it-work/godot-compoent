import { Minion } from '@/game/Minion';

/**

 * 复活的骑兵类 - 继承自Minion，实现复活的骑兵的特殊效果

 */

export class RisenRider extends Minion {
  static BASE_DATA = {
    id: 100000,
    strId: 'BG25_001',
    cardType: 'minion',
    name: 'RisenRider',
    nameCN: '复活的骑兵',
    text: '',
    mechanics: [],
    referencedTags: [],
    img: '',
    art: '',
    tier: 1,
    health: 1,
    attack: 1,
    minionTypes: ['undead'],
    minionTypesCN: ['亡灵'],
    upgradeCard: {
      id: 100001,
      strId: '',
      cardType: 'minion',
      name: 'RisenRider',
      nameCN: '复活的骑兵',
      text: '',
      mechanics: [],
      referencedTags: [],
      img: '',
      art: '',
      tier: 1,
      health: 2,
      attack: 2,
      minionTypes: ['undead'],
      minionTypesCN: ['亡灵'],
    },
  };
  // 继承父类的构造函数和所有方法
}
