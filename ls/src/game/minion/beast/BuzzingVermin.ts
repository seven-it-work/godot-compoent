import { Minion } from '../../Minion';

/**
 * 嗡鸣害虫类 - 继承自Minion，实现嗡鸣害虫的特殊效果
 */
export class BuzzingVermin extends Minion {
  static BASE_DATA = {
    id: 100012,
    strId: 'BG31_803',
    cardType: 'minion',
    name: 'BuzzingVermin',
    nameCN: '嗡鸣害虫',
    text: '<b>亡语：</b>召唤一只2/2的甲虫。',
    mechanics: ['DEATHRATTLE'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_803_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_803_cardArtFromHsJson256x.png',
    tier: 1,
    health: 1,
    attack: 1,
    minionTypes: ['beast'],
    minionTypesCN: ['野兽'],
    upgradeCard: {
      id: 100013,
      strId: 'BG31_803_G',
      cardType: 'minion',
      name: 'BuzzingVermin',
      nameCN: '嗡鸣害虫',
      text: '<b>亡语：</b>召唤两只2/2的甲虫。',
      mechanics: ['DEATHRATTLE'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_803_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_803_cardArtFromHsJson256x.png',
      tier: 1,
      health: 2,
      attack: 2,
      minionTypes: ['beast'],
      minionTypesCN: ['野兽'],
    },
  };
  /**
   * 重写亡语触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从死亡时触发
   * 效果：亡语：召唤一只2/2的甲虫
   */
  onDeath(_game: any): void {
    // 亡语：召唤一只2/2的甲虫
    console.log('嗡鸣害虫：召唤一只2/2的甲虫');
  }
}
