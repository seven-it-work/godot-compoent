import { Buff } from '@/server/controller/entity/Buff';
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';

/**
 * 催眠机器人类 - 继承自Minion，实现催眠机器人的特殊效果
 */
export class Lullabot extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 回合结束时触发的方法
   * @param _player - 玩家实例
   * 效果：在你的回合结束时，获得+1生命值
   */
  回合结束时(_player: Player): void {
    // 获得+1生命值
    const buff = new Buff(this.name, 0, 1);
    this.addBuff(buff);
  }
}

const BASE_DATA = {
  id: 98582,
  strId: 'BG26_146',
  cardType: 'minion',
  name: 'Lullabot',
  nameCN: '催眠机器人',
  text: '<b>磁力<\/b>\n在你的回合结束时，获得+1生命值。',
  mechanics: ['MAGNETIC'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_146_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_146_cardArtFromHsJson256x.png',
  tier: 1,
  health: 2,
  attack: 2,
  minionTypes: ['mech'],
  minionTypesCN: ['机械'],
  upgradeCard: {
    id: 98585,
    strId: 'BG26_146_G',
    cardType: 'minion',
    name: 'Lullabot',
    nameCN: '催眠机器人',
    text: '<b>磁力</b>\n在你的回合结束时，获得+2生命值。',
    mechanics: ['MAGNETIC'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_146_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_146_G_cardArtFromHsJson256x.png',
    tier: 1,
    health: 4,
    attack: 4,
    minionTypes: ['mech'],
    minionTypesCN: ['机械'],
  },
};
