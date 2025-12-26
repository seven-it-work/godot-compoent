import { Minion } from '@/game/Minion';
import type { Player } from '@/game/Player';
import { ShapingSpellHealthTaunt } from '@/game/cards/spell/shaping/ShapingSpellHealthTaunt';

/**
 * 深海钓客类 - 继承自Minion，实现深海钓客的特殊效果
 */
export class DeepSeaAngler extends Minion {
  static BASE_DATA = {
    id: 80742,
    strId: 'BG23_004',
    cardType: 'minion',
    name: 'Deep-Sea Angler',
    nameCN: '深海钓客',
    text: '<b>塑造法术：</b>直到下个回合，使一个随从获得+2生命值和<b>嘲讽</b>。',
    mechanics: ['TRIGGER_VISUAL'],
    referencedTags: ['TAUNT'],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_004_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_004_cardArtFromHsJson256x.png',
    tokens: [
      {
        id: 83988,
        strId: 'BG23_004t',
        cardType: 'spell',
        name: "Angler's Lure",
        nameCN: '钓客的诱饵',
        text: '直到下个回合，使一个随从获得+2生命值和<b>嘲讽</b>。',
        mechanics: [],
        referencedTags: ['TAUNT'],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_004t_battlegroundsImage.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_004t_cardArtFromHsJson256x.png',
      },
      {
        id: 115555,
        strId: 'BG31_920',
        cardType: 'minion',
        name: 'Darkcrest Strategist',
        nameCN: '暗潮战略专家',
        text: '<b>塑造法术：</b>随机获取一张等级1的纳迦牌。<i>（每回合都会升级！）</i>',
        mechanics: ['TRIGGER_VISUAL'],
        referencedTags: [],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_920_battlegroundsImage.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_920_cardArtFromHsJson256x.png',
        tokens: [
          {
            id: 116478,
            strId: 'BG31_920t',
            cardType: 'spell',
            name: 'Evolving Strategy',
            nameCN: '战略迭代',
            text: '随机获取一张等级1的纳迦牌。',
            mechanics: [],
            referencedTags: [],
            img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_920t_battlegroundsImage.png',
            art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_920t_cardArtFromHsJson256x.png',
          },
        ],
        tier: 5,
        health: 5,
        attack: 4,
        minionTypes: ['naga'],
        minionTypesCN: ['纳迦'],
        upgradeCard: {
          id: 115556,
          strId: 'BG31_920_G',
          cardType: 'minion',
          name: 'Darkcrest Strategist',
          nameCN: '暗潮战略专家',
          text: '<b>塑造法术：</b>随机获取两张等级1的纳迦牌。<i>（每回合都会升级！）</i>',
          mechanics: ['TRIGGER_VISUAL'],
          referencedTags: [],
          img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_920_G_battlegroundsImageGold.png',
          art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_920_G_cardArtFromHsJson256x.png',
          tokens: [
            {
              id: 116480,
              strId: 'BG31_920_Gt',
              cardType: 'spell',
              name: 'Evolving Strategy',
              nameCN: '战略迭代',
              text: '随机获取两张等级1的纳迦牌。',
              mechanics: [],
              referencedTags: [],
              img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_920_Gt_battlegroundsImage.png',
              art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_920_Gt_cardArtFromHsJson256x.png',
            },
          ],
          tier: 5,
          health: 10,
          attack: 8,
          minionTypes: ['naga'],
          minionTypesCN: ['纳迦'],
        },
      },
    ],
    tier: 1,
    health: 2,
    attack: 2,
    minionTypes: ['naga'],
    minionTypesCN: ['纳迦'],
    upgradeCard: {
      id: 80760,
      strId: 'BG23_004_G',
      cardType: 'minion',
      name: 'Deep-Sea Angler',
      nameCN: '深海钓客',
      text: '<b>塑造法术：</b>直到下个回合，使一个随从获得+4生命值和<b>嘲讽</b>。',
      mechanics: ['TRIGGER_VISUAL'],
      referencedTags: ['TAUNT'],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_004_G_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_004_G_cardArtFromHsJson256x.png',
      tokens: [
        {
          id: 83991,
          strId: 'BG23_004_Gt',
          cardType: 'spell',
          name: "Angler's Lure",
          nameCN: '钓客的诱饵',
          text: '直到下个回合，使一个随从获得+4生命值和<b>嘲讽</b>。',
          mechanics: [],
          referencedTags: ['TAUNT'],
          img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_004_Gt_imageFromBlizzardSb.png',
          art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_004_Gt_cardArtFromHsJson256x.png',
        },
        {
          id: 115556,
          strId: 'BG31_920_G',
          cardType: 'minion',
          name: 'Darkcrest Strategist',
          nameCN: '暗潮战略专家',
          text: '<b>塑造法术：</b>随机获取两张等级1的纳迦牌。<i>（每回合都会升级！）</i>',
          mechanics: ['TRIGGER_VISUAL'],
          referencedTags: [],
          img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_920_G_battlegroundsImageGold.png',
          art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_920_G_cardArtFromHsJson256x.png',
          tokens: [
            {
              id: 116480,
              strId: 'BG31_920_Gt',
              cardType: 'spell',
              name: 'Evolving Strategy',
              nameCN: '战略迭代',
              text: '随机获取两张等级1的纳迦牌。',
              mechanics: [],
              referencedTags: [],
              img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_920_Gt_battlegroundsImage.png',
              art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_920_Gt_cardArtFromHsJson256x.png',
            },
          ],
          tier: 5,
          health: 10,
          attack: 8,
          minionTypes: ['naga'],
          minionTypesCN: ['纳迦'],
        },
      ],
      tier: 1,
      health: 4,
      attack: 4,
      minionTypes: ['naga'],
      minionTypesCN: ['纳迦'],
    },
  };

  /**
   * 重写onMinionPlayed方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当使用本随从后触发
   * 效果：塑造法术：直到下个回合，使一个随从获得+2生命值和嘲讽
   */
  onMinionPlayed(game: any): void {
    // 使用本随从后触发的效果：塑造法术
    console.log('深海钓客：检查是否需要生成塑造法术');

    if (!this.hasGrantedShapingSpell && game.player) {
      // 创建塑造法术
      const shapingSpell = new ShapingSpellHealthTaunt();
      // 将法术添加到玩家的法术列表中
      const added = (game.player as Player).addCardToHand(shapingSpell);
      if (added) {
        this.hasGrantedShapingSpell = true; // 标记已授予
      } else {
        console.log('深海钓客：手牌已满，塑造法术已加入等待队列');
      }
    }
  }
}
