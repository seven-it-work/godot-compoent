import { Minion, type BattleContext } from '@/game/Minion';

/**
 * 错巢龙崽类 - 继承自Minion，实现错巢龙崽的特殊效果
 */
export class MisfitDragonling extends Minion {
  static BASE_DATA = {
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
  /**
   * 重写战斗开始时触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：战斗开始时触发
   * 效果：战斗开始时：获得等同于你当前等级的属性值
   */
  onBattleStart(_context: BattleContext): void {
    const playerLevel = _context.friendlyPlayer.tavernLevel || 1;
    this.addBuff({
      id: this.strId,
      source: '错巢龙崽',
      attackBonus: playerLevel,
      healthBonus: playerLevel,
      maxHealthBonus: 0,
      type: 'permanent',
    });
  }
}
