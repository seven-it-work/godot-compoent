import { Minion, type BattleContext } from '@/game/Minion';
import { Cubling } from './Cubling';

/**
 * 魔刃豹类 - 继承自Minion，实现魔刃豹的特殊效果
 */
export class Manasaber extends Minion {
  static BASE_DATA = {
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
  /**
   * 重写亡语触发的方法
   * @param context - 死亡上下文
   * @使用方式：当随从死亡时触发
   * 效果：亡语：召唤两只/四只0/1并具有嘲讽的豹宝宝（根据是否金色）
   */
  onDeath(context?: BattleContext): void {
    if (!context) return;

    // 根据是否金色决定召唤数量（普通版本2只，金色版本4只）
    const summonCount = this.isGolden ? 4 : 2;
    const { friendlyPlayer, position } = context;

    // 使用 Player 的统一召唤接口
    for (let i = 0; i < summonCount; i++) {
      const cubling = new Cubling();
      const success = friendlyPlayer.summonMinion(cubling, position);

      if (success) {
        // 记录日志
        if (context.addLog) {
          context.addLog(`召唤了 ${cubling.nameCN}`);
        }
        console.log(`魔刃豹：召唤了 ${cubling.nameCN} (${cubling.attack}/${cubling.health})`);
      } else {
        console.log(`魔刃豹：召唤失败，战场已满`);
        break; // 战场已满，停止继续召唤
      }
    }
  }
}
