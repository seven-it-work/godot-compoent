import { Buff } from '@/server/controller/entity/Buff';
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
import loadsh from 'lodash';
/**
 * 挑食魔犬类 - 继承自Minion，实现挑食魔犬的特殊效果
 */
export class PickyEater extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 重写战吼方法
   * @param player - 玩家实例
   * 效果：战吼：随机吞食酒馆中的一个随从，获得其属性值
   */
  battlecry(player: Player): void {
    super.battlecry(player);
    if (player.isInBattle) {
      return;
    }
    const tavern = player.tavern;
    if (!tavern) {
      throw new Error('玩家没有酒馆');
    }
    // 如果没有随从 直接返回
    const minionList = tavern.cards
      .filter(temp => temp !== undefined)
      .filter(temp => temp.type === 'minion');
    if (minionList.length === 0) {
      console.log('酒馆中没有随从可吞食');
      return;
    }
    // 随机选择一个随从
    const randomMinion = loadsh.sample(minionList) as Minion;
    if (!randomMinion) {
      throw new Error('随机选择的随从不存在');
    }

    // 简化实现：直接获得固定属性值
    const attackBonus = randomMinion.getAttack(player) * this.getMultiplier();
    const healthBonus = randomMinion.getHealth(player) * this.getMultiplier();

    // 为挑食魔犬添加属性加成
    this.addBuff(new Buff(this.name, attackBonus, healthBonus));

    console.log(`挑食魔犬获得了${attackBonus}攻击力和${healthBonus}生命值`);
  }
}

const BASE_DATA = {
  id: 92400,
  strId: 'BG24_009',
  cardType: 'minion',
  name: 'Picky Eater',
  nameCN: '挑食魔犬',
  text: '<b>战吼：</b>随机吞食酒馆中的一个随从，获得其属性值。',
  mechanics: ['BATTLECRY'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG24_009_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG24_009_cardArtFromHsJson256x.png',
  tier: 1,
  health: 1,
  attack: 1,
  minionTypes: ['demon'],
  minionTypesCN: ['恶魔'],
  upgradeCard: {
    id: 92427,
    strId: 'BG24_009_G',
    cardType: 'minion',
    name: 'Picky Eater',
    nameCN: '挑食魔犬',
    text: '<b>战吼：</b>随机吞食酒馆中的一个随从，获得其双倍属性值。',
    mechanics: ['BATTLECRY'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG24_009_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG24_009_G_cardArtFromHsJson256x.png',
    tier: 1,
    health: 2,
    attack: 2,
    minionTypes: ['demon'],
    minionTypesCN: ['恶魔'],
  },
};
