import { Minion } from '@/game/Minion';
import { Microbot } from './Microbot';
import type { GameStoreInstance } from '@/stores/game';

/**
 * 拔线机类 - 继承自Minion，实现拔线机的特殊效果
 */
export class CordPuller extends Minion {
  static BASE_DATA = {
    id: 110101,
    strId: 'BG29_611',
    cardType: 'minion',
    name: 'Cord Puller',
    nameCN: '拔线机',
    text: '<b>圣盾</b>。<b>亡语：</b>召唤一个1/1的微型机器人。',
    mechanics: ['DEATHRATTLE', 'DIVINE_SHIELD'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_611_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_611_cardArtFromHsJson256x.png',
    tokens: [
      {
        id: 96810,
        strId: 'BG_BOT_312t',
        cardType: 'minion',
        name: 'Microbot',
        nameCN: '微型机器人',
        text: '',
        mechanics: [],
        referencedTags: [],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_BOT_312t_battlegroundsImage.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_BOT_312t_cardArtFromHsJson256x.png',
        tier: 1,
        health: 1,
        attack: 1,
        minionTypes: ['mech'],
        minionTypesCN: ['机械'],
        upgradeCard: {
          id: 58377,
          strId: 'TB_BaconUps_032t',
          cardType: 'minion',
          name: 'Microbot',
          nameCN: '微型机器人',
          text: '',
          mechanics: [],
          referencedTags: [],
          img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_032t_imageFromBlizzardSb.png',
          art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_032t_cardArtFromHsJson256x.png',
          tier: 1,
          health: 2,
          attack: 2,
          minionTypes: ['mech'],
          minionTypesCN: ['机械'],
        },
      },
    ],
    tier: 1,
    health: 1,
    attack: 1,
    minionTypes: ['mech'],
    minionTypesCN: ['机械'],
    upgradeCard: {
      id: 110102,
      strId: 'BG29_611_G',
      cardType: 'minion',
      name: 'Cord Puller',
      nameCN: '拔线机',
      text: '<b>圣盾</b>。<b>亡语：</b>召唤一个2/2的微型机器人。',
      mechanics: ['DEATHRATTLE', 'DIVINE_SHIELD'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_611_G_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG29_611_G_cardArtFromHsJson256x.png',
      tokens: [
        {
          id: 58377,
          strId: 'TB_BaconUps_032t',
          cardType: 'minion',
          name: 'Microbot',
          nameCN: '微型机器人',
          text: '',
          mechanics: [],
          referencedTags: [],
          img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_032t_imageFromBlizzardSb.png',
          art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_032t_cardArtFromHsJson256x.png',
          tier: 1,
          health: 2,
          attack: 2,
          minionTypes: ['mech'],
          minionTypesCN: ['机械'],
        },
      ],
      tier: 1,
      health: 2,
      attack: 2,
      minionTypes: ['mech'],
      minionTypesCN: ['机械'],
    },
  };

  /**
   * 亡语：召唤一个1/1的微型机器人
   * @使用方式：当随从死亡时触发
   * 效果：亡语：召唤一个1/1的微型机器人
   */
  onDeath(_gameStore: GameStoreInstance): void {
    // 获取当前玩家
    const friendlyPlayer = _gameStore.player;

    // 召唤一个微型机器人
    const microbot = new Microbot();
    const success = friendlyPlayer?.summonMinion(microbot, this.position || 6);

    if (success) {
      // 记录日志
      _gameStore.addBattleLog(`召唤了 ${microbot.nameCN}`);
      console.log(`拔线机：召唤了 ${microbot.nameCN} (${microbot.attack}/${microbot.health})`);
    } else {
      console.log('拔线机：无法召唤微型机器人，位置已满');
    }
  }
}
