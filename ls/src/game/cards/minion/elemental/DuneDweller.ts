import { Minion } from '@/game/Minion';

/**
 * 沙丘土著类 - 继承自Minion，实现沙丘土著的特殊效果
 */
export class DuneDweller extends Minion {
  static BASE_DATA = {
    id: 100018,
    strId: 'BG31_815',
    cardType: 'minion',
    name: 'DuneDweller',
    nameCN: '沙丘土著',
    text: '<b>战吼：</b>使酒馆中的元素在本局对战中获得+1/+1。',
    mechanics: ['BATTLECRY'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_815_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_815_cardArtFromHsJson256x.png',
    tier: 1,
    health: 1,
    attack: 1,
    minionTypes: ['elemental'],
    minionTypesCN: ['元素'],
    upgradeCard: {
      id: 100019,
      strId: 'TB_BaconUps_815',
      cardType: 'minion',
      name: 'DuneDweller',
      nameCN: '沙丘土著',
      text: '<b>战吼：</b>使酒馆中的元素在本局对战中获得+2/+2。',
      mechanics: ['BATTLECRY'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_815_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_815_cardArtFromHsJson256x.png',
      tier: 1,
      health: 2,
      attack: 2,
      minionTypes: ['elemental'],
      minionTypesCN: ['元素'],
    },
  };

  /**
   * 重写战吼方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从被放置到战场时触发
   * 效果：战吼：使酒馆中的元素在本局对战中获得+1/+1
   */
  battlecry(game: any): void {
    // 战吼：使酒馆中的元素在本局对战中获得+1/+1
    console.log('沙丘土著：使酒馆中的元素在本局对战中获得+1/+1');
    // 检查game中是否包含tavern实例
    if (game.tavern) {
      // 调用酒馆的addElementalBonusSource方法，添加+1/+1的元素加成
      game.tavern.addElementalBonusSource(1, 1);
      console.log('成功为酒馆元素添加+1/+1加成');
    } else {
      console.error('未能找到酒馆实例，无法应用元素加成');
    }
  }
}
