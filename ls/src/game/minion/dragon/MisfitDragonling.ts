import { Minion } from '../../Minion';

/**
 * 错巢龙崽类 - 继承自Minion，实现错巢龙崽的特殊效果
 */
export class MisfitDragonling extends Minion {
  static BASE_DATA = {
    id: 100006,
    strId: 'BG29_814',
    cardType: 'minion',
    name: 'MisfitDragonling',
    nameCN: '错巢龙崽',
    text: '<b>战斗开始时：</b>获得等同于你当前等级的属性值。',
    mechanics: ['BATTLECRY'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_814_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_814_cardArtFromHsJson256x.png',
    tier: 1,
    health: 1,
    attack: 1,
    minionTypes: ['dragon'],
    minionTypesCN: ['龙'],
    upgradeCard: {
      id: 100007,
      strId: 'BG29_814_G',
      cardType: 'minion',
      name: 'MisfitDragonling',
      nameCN: '错巢龙崽',
      text: '<b>战斗开始时：</b>获得等同于你当前等级的双倍属性值。',
      mechanics: ['BATTLECRY'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_814_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_814_cardArtFromHsJson256x.png',
      tier: 1,
      health: 2,
      attack: 2,
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
  onBattleStart(game: any): void {
    // 获得等同于当前等级的属性值
    const playerLevel = game.player?.tavernLevel || 1;
    this.attack += playerLevel;
    this.health += playerLevel;
    this.maxHealth += playerLevel;
  }
}
