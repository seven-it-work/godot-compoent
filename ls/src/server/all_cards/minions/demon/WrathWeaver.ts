import { Buff } from '@/server/controller/entity/Buff';
import type { Card } from '@/server/controller/entity/Card';
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';

/**
 * 愤怒编织者类 - 继承自Minion，实现愤怒编织者的特殊效果
 */
export class WrathWeaver extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 重写其他卡牌被使用时触发的方法
   * @param _player - 玩家实例
   * @param card - 使用的卡牌实例
   * 效果：在你使用一张恶魔牌后，对你的英雄造成1点伤害并获得+2/+1
   */
  useOtherCardAfter(_player: Player, card: Card): void {
    if (this.location !== 'battlefield') {
      return;
    }
    // 愤怒编织者自己的判断条件：检查是否为恶魔牌
    if (card instanceof Minion && card.hasMinionType(['demon'])) {
      for (let index = 0; index < this.getMultiplier(); index++) {
        // 对英雄造成1点伤害
        _player.受到伤害(1);
        this.addBuff(new Buff(this.name, 2, 1));
      }
    }
  }
}

const BASE_DATA = {
  id: 59670,
  strId: 'BGS_004',
  cardType: 'minion',
  name: 'Wrath Weaver',
  nameCN: '愤怒编织者',
  text: '在你使用一张恶魔牌后，对你的英雄造成1点伤害并获得+2/+1。',
  mechanics: ['TRIGGER_VISUAL'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_004_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_004_cardArtFromHsJson256x.png',
  tier: 1,
  health: 4,
  attack: 1,
  minionTypes: ['none'],
  minionTypesCN: ['中立'],
  upgradeCard: {
    id: 59679,
    strId: 'TB_BaconUps_079',
    cardType: 'minion',
    name: 'Wrath Weaver',
    nameCN: '愤怒编织者',
    text: '在你使用一张恶魔牌后，对你的英雄造成1点伤害并获得+2/+1，触发两次。',
    mechanics: ['TRIGGER_VISUAL'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_079_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_079_cardArtFromHsJson256x.png',
    tier: 1,
    health: 8,
    attack: 2,
    minionTypes: ['none'],
    minionTypesCN: ['中立'],
  },
};
