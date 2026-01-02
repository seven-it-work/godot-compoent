import type { CurrentGame } from '@/server/controller/entity/CurrentGame';
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import db_card from '@/server/db/db_card';

/**
 * 嗡鸣害虫类 - 继承自Minion，实现嗡鸣害虫的特殊效果
 */
export class BuzzingVermin extends Minion {
  inTavern: boolean = true;
  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
  // 执行亡语
  deathrattle(currentGame: CurrentGame) {
    super.deathrattle(currentGame);
    // 1、根据currentGameId获取当前游戏实例
    if (!currentGame) {
      throw new Error('未找到当前游戏');
    }
    // 2、获取当前玩家
    const currentPlayer = currentGame.player;
    if (!currentPlayer) {
      throw new Error('未找到当前玩家');
    }
    const index = currentPlayer.getMinionIndexOnBattlefield(this);
    if (index === -1) {
      throw new Error('未找到当前随从');
    }
    currentPlayer.添加随从到战场(db_card.getCardByStrId('BG28_603t') as Minion, index);
  }
}

const BASE_DATA = {
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
