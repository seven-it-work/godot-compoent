import { CurrentGameController } from '@/server/controller/CurrentGameController';
import { Buff } from '@/server/controller/entity/Buff';
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
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

  getTextFormatArr(currentGameId: string): string[] {
    const currentGame = new CurrentGameController().getCurrentGameById(currentGameId);
    if (!currentGame) {
      throw new Error('未找到当前游戏');
    }
    const player = currentGame.player;
    if (!player) {
      throw new Error('未找到玩家');
    }
    // 由子类去实现
    return [(2 + player.beetleBonus.atk).toString(), (2 + player.beetleBonus.hp).toString()];
  }

  // 执行亡语
  deathrattle(player: Player) {
    super.deathrattle(player);
    const index = player.getMinionIndexOnBattlefield(this);
    if (index === -1) {
      throw new Error('未找到当前随从');
    }
    const beetle = db_card.getCardByStrId('BG28_603t') as Minion;
    beetle.addBuff(new Buff(this.name, 2 + player.beetleBonus.atk, 2 + player.beetleBonus.hp));
    player.添加随从到战场(beetle, index);
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
