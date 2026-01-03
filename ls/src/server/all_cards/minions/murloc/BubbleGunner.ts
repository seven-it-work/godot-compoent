import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
import type { MinionKeyword } from '@/server/controller/entity/Minion';

/**
 * 气泡枪手类 - 继承自Minion，实现气泡枪手的特殊效果
 */
export class BubbleGunner extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 重写战吼方法
   * @param player - 玩家实例
   * 效果：战吼：获得一个随机额外关键词
   */
  battlecry(player: Player): void {
    super.battlecry(player);

    // 战吼：获得一个随机额外关键词
    console.log('气泡枪手：获得一个随机额外关键词');

    // 定义所有可能的关键词列表
    const allKeywords: MinionKeyword[] = [
      'TAUNT',
      'DIVINE_SHIELD',
      'WINDFURY',
      'STEALTH',
      'POISONOUS',
      'REBORN',
    ];

    // 过滤掉已经拥有的关键词
    const availableKeywords = allKeywords.filter(keyword => !this.keywords.includes(keyword));

    // 如果没有可用的新关键词，直接返回
    if (availableKeywords.length === 0) {
      console.log('气泡枪手已经拥有所有关键词，无法获得新关键词');
      return;
    }

    // 随机选择一个新关键词
    const randomIndex = Math.floor(Math.random() * availableKeywords.length);
    const newKeyword = availableKeywords[randomIndex];

    // 添加新关键词（确保有值）
    if (newKeyword) {
      this.keywords.push(newKeyword);
      // 输出获得的关键词
      console.log(`气泡枪手获得了新关键词：${newKeyword}`);
    }
  }
}

const BASE_DATA = {
  id: 116178,
  strId: 'BG31_149',
  cardType: 'minion',
  name: 'Bubble Gunner',
  nameCN: '气泡枪手',
  text: '<b>战吼：</b>获得一个随机<b>额外关键词</b>。',
  mechanics: ['BATTLECRY'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_149_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_149_cardArtFromHsJson256x.png',
  tier: 1,
  health: 3,
  attack: 2,
  minionTypes: ['murloc'],
  minionTypesCN: ['鱼人'],
  upgradeCard: {
    id: 116179,
    strId: 'BG31_149_G',
    cardType: 'minion',
    name: 'Bubble Gunner',
    nameCN: '气泡枪手',
    text: '<b>战吼：</b>获得2个随机<b>额外关键词</b>。',
    mechanics: ['BATTLECRY'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_149_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_149_G_cardArtFromHsJson256x.png',
    tier: 1,
    health: 6,
    attack: 4,
    minionTypes: ['murloc'],
    minionTypesCN: ['鱼人'],
  },
};
