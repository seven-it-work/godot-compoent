import { Buff } from '@/server/controller/entity/Buff';
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
import db_card from '@/server/db/db_card';

/**
 * ForestRover类 - 继承自Minion，实现ForestRover随从
 */
export class ForestRover extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  getTextFormatArr(player: Player) {
    const bonus = player.beetleBonus;
    return [(1 + bonus.atk).toString(), (1 + bonus.hp).toString()];
  }

  // 执行战吼
  battlecry(player: Player) {
    super.battlecry(player);

    // 根据是否为金色版本，给予不同的加成
    const atkBonus = this.isGolden ? 2 : 1;
    const hpBonus = this.isGolden ? 2 : 1;

    // 增加玩家的甲虫加成
    player.beetleBonus.atk += atkBonus;
    player.beetleBonus.hp += hpBonus;
  }

  // 执行亡语
  deathrattle(_attackingMinion: Minion, player: Player) {
    super.deathrattle(_attackingMinion, player);
    // 获取当前随从在战场的位置
    let index = player.getMinionIndexOnBattlefield(this);
    if (index === -1) {
      index = 0;
    }

    // 召唤数量：普通版本1只，金色版本2只
    const summonCount = this.isGolden ? 2 : 1;
    // 召唤甲虫
    for (let i = 0; i < summonCount; i++) {
      // 创建新的甲虫实例
      const newBeetle = db_card.getCardByStrId('BG28_603t') as Minion;
      // 计算甲虫的属性加成
      const beetleAttack = player.beetleBonus.atk;
      const beetleHealth = player.beetleBonus.hp;
      // 添加加成buff
      if (beetleAttack > 0 || beetleHealth > 0) {
        newBeetle.addBuff(new Buff(this.name, beetleAttack, beetleHealth));
      }
      // 将甲虫添加到战场
      player.添加随从到战场(newBeetle, index);
    }
  }
}

const BASE_DATA = {
  id: 115577,
  strId: 'BG31_801',
  cardType: 'minion',
  name: 'Forest Rover',
  nameCN: '森林游虫',
  text: '<b>战吼：</b>在本局对战中，你的甲虫拥有+1/+1。\n<b>亡语：</b>召唤一只{0}/{1}的甲虫。',
  mechanics: ['BATTLECRY', 'DEATHRATTLE'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_801_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_801_cardArtFromHsJson256x.png',
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
  tier: 2,
  health: 2,
  attack: 3,
  minionTypes: ['beast'],
  minionTypesCN: ['野兽'],
  upgradeCard: {
    id: 115578,
    strId: 'BG31_801_G',
    cardType: 'minion',
    name: 'Forest Rover',
    nameCN: '森林游虫',
    text: '<b>战吼：</b>在本局对战中，你的甲虫拥有+2/+2。\n<b>亡语：</b>召唤两只{0}/{1}的甲虫。',
    mechanics: ['BATTLECRY', 'DEATHRATTLE'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_801_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_801_G_cardArtFromHsJson256x.png',
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
    tier: 2,
    health: 4,
    attack: 6,
    minionTypes: ['beast'],
    minionTypesCN: ['野兽'],
  },
};
