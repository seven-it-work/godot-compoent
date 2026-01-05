import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';

/**
 * 魔刃豹类 - 继承自Minion，实现魔刃豹的特殊效果
 */
export class Manasaber extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 重写亡语方法
   * @param player - 玩家实例
   * 效果：亡语：召唤两只0/1并具有嘲讽的豹宝宝
   */
  deathrattle(_攻击的随从: Minion, player: Player): void {
    super.deathrattle(_攻击的随从, player);
    // 根据是否金色决定召唤数量（普通版本2只，金色版本4只）
    const summonCount = 2;

    // 获取豹宝宝的strId
    const cublingStrId = 'BG26_800t';

    // 使用 Player 的统一召唤接口
    for (let i = 0; i < summonCount; i++) {
      // 从db_card获取豹宝宝实例
      const cubling = player.getCardByStrId(cublingStrId) as Minion;

      if (cubling) {
        // 获取当前随从在战场上的位置
        const index = player.getMinionIndexOnBattlefield(this);
        // 调用玩家的召唤随从方法
        player.添加随从到战场(cubling, index);
      } else {
        console.error(`魔刃豹：无法找到豹宝宝，strId: ${cublingStrId}`);
      }
    }
  }
}

const BASE_DATA = {
  id: 98831,
  strId: 'BG26_800',
  cardType: 'minion',
  name: 'Manasaber',
  nameCN: '魔刃豹',
  text: '<b>亡语：</b>召唤两只0/1并具有<b>嘲讽</b>的豹宝宝。',
  mechanics: ['DEATHRATTLE'],
  referencedTags: ['TAUNT'],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800_cardArtFromHsJson256x.png',
  tokens: [
    {
      id: 98943,
      strId: 'BG26_800t',
      cardType: 'minion',
      name: 'Cubling',
      nameCN: '豹宝宝',
      text: '<b>嘲讽</b>',
      mechanics: ['TAUNT'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800t_battlegroundsImage.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800t_cardArtFromHsJson256x.png',
      tier: 1,
      health: 1,
      attack: 0,
      minionTypes: ['beast'],
      minionTypesCN: ['野兽'],
      upgradeCard: {
        id: 98944,
        strId: 'BG26_800_Gt',
        cardType: 'minion',
        name: 'Cubling',
        nameCN: '豹宝宝',
        text: '<b>嘲讽</b>',
        mechanics: ['TAUNT'],
        referencedTags: [],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800_Gt_imageFromBlizzardSb.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800_Gt_cardArtFromHsJson256x.png',
        tier: 1,
        health: 2,
        attack: 0,
        minionTypes: ['beast'],
        minionTypesCN: ['野兽'],
      },
    },
  ],
  tier: 1,
  health: 1,
  attack: 4,
  minionTypes: ['beast'],
  minionTypesCN: ['野兽'],
  upgradeCard: {
    id: 98834,
    strId: 'BG26_800_G',
    cardType: 'minion',
    name: 'Manasaber',
    nameCN: '魔刃豹',
    text: '<b>亡语：</b>召唤两只0/2并具有<b>嘲讽</b>的豹宝宝。',
    mechanics: ['DEATHRATTLE'],
    referencedTags: ['TAUNT'],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800_G_cardArtFromHsJson256x.png',
    tokens: [
      {
        id: 98944,
        strId: 'BG26_800_Gt',
        cardType: 'minion',
        name: 'Cubling',
        nameCN: '豹宝宝',
        text: '<b>嘲讽</b>',
        mechanics: ['TAUNT'],
        referencedTags: [],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800_Gt_imageFromBlizzardSb.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_800_Gt_cardArtFromHsJson256x.png',
        tier: 1,
        health: 2,
        attack: 0,
        minionTypes: ['beast'],
        minionTypesCN: ['野兽'],
      },
    ],
    tier: 1,
    health: 2,
    attack: 8,
    minionTypes: ['beast'],
    minionTypesCN: ['野兽'],
  },
};
