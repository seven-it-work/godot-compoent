import { Minion } from '@/game/Minion';

/**
 * 雌斑虎类 - 继承自Minion，实现雌斑虎的基本功能
 */
export class Tabbycat extends Minion {
  static BASE_DATA = {
    id: 100002,
    strId: 'BG_CFM_315t',
    cardType: 'minion',
    name: 'Tabbycat',
    nameCN: '雌斑虎',
    text: '',
    mechanics: [],
    referencedTags: [],
    img: '',
    art: '',
    tier: 1,
    health: 1,
    attack: 1,
    minionTypes: ['beast'],
    minionTypesCN: ['野兽'],
    upgradeCard: {
      id: 100003,
      strId: 'TB_BaconUps_093t',
      cardType: 'minion',
      name: 'Tabbycat',
      nameCN: '雌斑虎',
      text: '',
      mechanics: [],
      referencedTags: [],
      img: '',
      art: '',
      tier: 1,
      health: 2,
      attack: 2,
      minionTypes: ['beast'],
      minionTypesCN: ['野兽'],
    },
  };

  /**
   * 雌斑虎构造函数
   * 设置isTavernMinion为false，因为它是token随从，不会出现在酒馆中
   */
  constructor(params?: any) {
    super(params);
    this.isTavernMinion = false;
  }
}
