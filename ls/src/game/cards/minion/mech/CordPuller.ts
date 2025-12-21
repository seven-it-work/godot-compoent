import { Minion } from '@/game/Minion';

/**
 * 拔线机类 - 继承自Minion，实现拔线机的特殊效果
 */
export class CordPuller extends Minion {
  static BASE_DATA = {
    id: 100012,
    strId: 'BG29_611',
    cardType: 'minion',
    name: 'CordPuller',
    nameCN: '拔线机',
    text: '<b>亡语：</b>召唤一个1/1的微型机器人。',
    mechanics: ['DEATHRATTLE'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_611_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_611_cardArtFromHsJson256x.png',
    tier: 1,
    health: 1,
    attack: 1,
    minionTypes: ['mech'],
    minionTypesCN: ['机械'],
    upgradeCard: {
      id: 100013,
      strId: 'TB_BaconUps_611',
      cardType: 'minion',
      name: 'CordPuller',
      nameCN: '拔线机',
      text: '<b>亡语：</b>召唤两个2/2的微型机器人。',
      mechanics: ['DEATHRATTLE'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_611_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_611_cardArtFromHsJson256x.png',
      tier: 1,
      health: 2,
      attack: 2,
      minionTypes: ['mech'],
      minionTypesCN: ['机械'],
    },
  };

  /**
   * 重写亡语触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从死亡时触发
   * 效果：亡语：召唤一个1/1的微型机器人
   */
  onDeath(_game: any): void {
    // 亡语：召唤一个1/1的微型机器人
    console.log('拔线机：召唤一个1/1的微型机器人');
  }
}
