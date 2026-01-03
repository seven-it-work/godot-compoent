import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
import { Buff } from '@/server/controller/entity/Buff';

/**
 * 错巢龙崽类 - 继承自Minion，实现错巢龙崽的特殊效果
 */
export class MisfitDragonling extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 重写战斗开始时触发的方法
   * @param _player - 玩家实例
   * 效果：战斗开始时：获得等同于你当前等级的属性值
   */
  战斗开始时(_player: Player): void {
    // 为错巢龙崽添加属性加成
    const attackBonus = 1;
    const healthBonus = 1;

    // 使用Buff类构造函数创建buff
    const buff = new Buff(this.name, attackBonus, healthBonus);
    this.addBuff(buff);
  }
}

const BASE_DATA = {
  id: 108873,
  strId: 'BG29_814',
  cardType: 'minion',
  name: 'Misfit Dragonling',
  nameCN: '错巢龙崽',
  text: '<b>战斗开始时：</b>获得等同于你当前等级的属性值。',
  mechanics: ['TRIGGER_VISUAL'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_814_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_814_cardArtFromHsJson256x.png',
  tier: 1,
  health: 1,
  attack: 2,
  minionTypes: ['dragon'],
  minionTypesCN: ['龙'],
  upgradeCard: {
    id: 108875,
    strId: 'BG29_814_G',
    cardType: 'minion',
    name: 'Misfit Dragonling',
    nameCN: '错巢龙崽',
    text: '<b>战斗开始时：</b>获得等同于你当前等级双倍的属性值。',
    mechanics: ['TRIGGER_VISUAL'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_814_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_814_G_cardArtFromHsJson256x.png',
    tier: 1,
    health: 2,
    attack: 4,
    minionTypes: ['dragon'],
    minionTypesCN: ['龙'],
  },
};
