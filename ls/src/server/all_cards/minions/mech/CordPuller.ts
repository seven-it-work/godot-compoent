import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';

/**
 * 拔线机类 - 继承自Minion，实现拔线机的特殊效果
 */
export class CordPuller extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 亡语：召唤一个1/1的微型机器人
   * @param player - 玩家实例
   * 效果：亡语：召唤一个1/1的微型机器人
   */
  deathrattle(_攻击的随从: Minion, player: Player): void {
    super.deathrattle(_攻击的随从, player);

    // 获取微型机器人的strId
    const microbotStrId = 'BG_BOT_312t';

    // 从db_card获取微型机器人实例
    const microbot = player.getCardByStrId(microbotStrId) as Minion;

    if (microbot) {
      // 获取当前随从在战场上的位置
      const index = player.getMinionIndexOnBattlefield(this);
      // 调用玩家的召唤随从方法
      player.添加随从到战场(microbot, index);
    } else {
      console.error(`拔线机：无法找到微型机器人，strId: ${microbotStrId}`);
    }
  }
}

const BASE_DATA = {
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
