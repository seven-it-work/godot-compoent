import { Minion } from '../../Minion';

/**
 * 晾膘的游客类 - 继承自Minion，实现晾膘的游客的特殊效果
 */
export class SunBaconRelaxer extends Minion {
  static BASE_DATA = {
    id: 100301,
    strId: 'BG20_301',
    cardType: 'minion',
    name: 'SunBaconRelaxer',
    nameCN: '晾膘的游客',
    text: '<b>亡语：</b>获取2张鲜血宝石。',
    mechanics: ['DEATHRATTLE'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_301_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_301_cardArtFromHsJson256x.png',
    tier: 2,
    health: 4,
    attack: 2,
    minionTypes: ['quilboar'],
    minionTypesCN: ['野猪人'],
    upgradeCard: {
      id: 100401,
      strId: 'BG20_301_G',
      cardType: 'minion',
      name: 'SunBaconRelaxer',
      nameCN: '晾膘的游客',
      text: '<b>亡语：</b>获取4张鲜血宝石。',
      mechanics: ['DEATHRATTLE'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_301_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_301_cardArtFromHsJson256x.png',
      tier: 2,
      health: 8,
      attack: 4,
      minionTypes: ['quilboar'],
      minionTypesCN: ['野猪人'],
    },
  };

  /**
   * 重写出售随从时触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当玩家出售本随从时触发
   * 效果：当你出售本随从时，获取2张鲜血宝石
   */
  onSell(_game: any): void {
    // 当出售本随从时，获取2张鲜血宝石
    console.log('晾膘的游客：获取2张鲜血宝石');
  }
}
