import { Minion } from '@/game/Minion';
import { Beetle } from './Beetle';
import type { GameStoreInstance } from '@/stores/game';

/**
 * 嗡鸣害虫类 - 继承自Minion，实现嗡鸣害虫的特殊效果
 */
export class BuzzingVermin extends Minion {
  static BASE_DATA = {
    id: 116240,
    strId: 'BG31_803',
    cardType: 'minion',
    name: 'Buzzing Vermin',
    nameCN: '嗡鸣害虫',
    text: '<b>嘲讽</b>。<b>亡语：</b>召唤一只{0}/{1}的甲虫。',
    mechanics: ['DEATHRATTLE', 'TAUNT'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_803_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_803_cardArtFromHsJson256x.png',
    tokens: [
      {
        id: 110402,
        strId: 'BG28_603t',
        cardType: 'minion',
        name: 'Beetle',
        nameCN: '甲虫',
        text: '',
        mechanics: [],
        referencedTags: [],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_603t_battlegroundsImage.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_603t_cardArtFromHsJson256x.png',
        tier: 1,
        health: 2,
        attack: 2,
        minionTypes: ['beast'],
        minionTypesCN: ['野兽'],
        upgradeCard: {
          id: 110894,
          strId: 'BG28_603t_G',
          cardType: 'minion',
          name: 'Beetle',
          nameCN: '甲虫',
          text: '',
          mechanics: [],
          referencedTags: [],
          img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_603t_G_imageFromBlizzardSb.png',
          art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_603t_G_cardArtFromHsJson256x.png',
          tier: 1,
          health: 4,
          attack: 4,
          minionTypes: ['beast'],
          minionTypesCN: ['野兽'],
        },
      },
    ],
    tier: 1,
    health: 1,
    attack: 1,
    minionTypes: ['beast'],
    minionTypesCN: ['野兽'],
    upgradeCard: {
      id: 116241,
      strId: 'BG31_803_G',
      cardType: 'minion',
      name: 'Buzzing Vermin',
      nameCN: '嗡鸣害虫',
      text: '<b>嘲讽</b>。<b>亡语：</b>召唤两只{0}/{1}的甲虫。',
      mechanics: ['DEATHRATTLE', 'TAUNT'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_803_G_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_803_G_cardArtFromHsJson256x.png',
      tokens: [
        {
          id: 110402,
          strId: 'BG28_603t',
          cardType: 'minion',
          name: 'Beetle',
          nameCN: '甲虫',
          text: '',
          mechanics: [],
          referencedTags: [],
          img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_603t_battlegroundsImage.png',
          art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_603t_cardArtFromHsJson256x.png',
          tier: 1,
          health: 2,
          attack: 2,
          minionTypes: ['beast'],
          minionTypesCN: ['野兽'],
          upgradeCard: {
            id: 110894,
            strId: 'BG28_603t_G',
            cardType: 'minion',
            name: 'Beetle',
            nameCN: '甲虫',
            text: '',
            mechanics: [],
            referencedTags: [],
            img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_603t_G_imageFromBlizzardSb.png',
            art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_603t_G_cardArtFromHsJson256x.png',
            tier: 1,
            health: 4,
            attack: 4,
            minionTypes: ['beast'],
            minionTypesCN: ['野兽'],
          },
        },
      ],
      tier: 1,
      health: 2,
      attack: 2,
      minionTypes: ['beast'],
      minionTypesCN: ['野兽'],
    },
  };
  /**
   * 重写亡语触发的方法
   * @使用方式：当随从死亡时触发
   * 效果：亡语：召唤一只/两只2/2的甲虫（根据是否金色）
   */
  onDeath(_gameStore: GameStoreInstance): void {
    // 根据是否金色决定召唤数量
    const summonCount = this.isGolden ? 2 : 1;
    const friendlyPlayer = _gameStore.player;

    // 使用 Player 的统一召唤接口
    for (let i = 0; i < summonCount; i++) {
      const beetle = new Beetle();
      const success = friendlyPlayer?.summonMinion(beetle, this.position || 6);

      if (success) {
        // 记录日志
        _gameStore.addBattleLog(`召唤了 ${beetle.nameCN}`);
        console.log(`嗡鸣害虫：召唤了 ${beetle.nameCN} (${beetle.attack}/${beetle.health})`);
      } else {
        console.log(`嗡鸣害虫：召唤失败，战场已满`);
      }
    }
  }
}
