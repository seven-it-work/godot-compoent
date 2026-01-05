import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';

/**
 * 无害的骨颅类 - 继承自Minion，实现无害的骨颅的特殊效果
 */
export class HarmlessBonehead extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }

  /**
   * 重写亡语触发的方法
   * @param player - 玩家实例
   * 效果：亡语：召唤两个1/1的骷髅
   */
  deathrattle(_攻击的随从: Minion, player: Player): void {
    super.deathrattle(_攻击的随从, player);

    // 亡语：召唤两个1/1的骷髅
    const summonCount = 2;

    // 获取骷髅的strId
    const skeletonStrId = 'BG_ICC_026t';

    // 使用 Player 的统一召唤接口
    for (let i = 0; i < summonCount; i++) {
      // 从db_card获取骷髅实例
      const skeleton = player.getCardByStrId(skeletonStrId) as Minion;

      if (skeleton) {
        // 获取当前随从在战场上的位置
        const index = player.getMinionIndexOnBattlefield(this);
        // 调用玩家的召唤随从方法
        player.添加随从到战场(skeleton, index);
      } else {
        console.error(`无害的骨颅：无法找到骷髅，strId: ${skeletonStrId}`);
        break;
      }
    }
  }
}

const BASE_DATA = {
  id: 104551,
  strId: 'BG28_300',
  cardType: 'minion',
  name: 'Harmless Bonehead',
  nameCN: '无害的骨颅',
  text: '<b>亡语：</b>召唤两个1/1的骷髅。',
  mechanics: ['DEATHRATTLE'],
  referencedTags: [],
  img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_300_battlegroundsImage.png',
  art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_300_cardArtFromHsJson256x.png',
  tokens: [
    {
      id: 99629,
      strId: 'BG_ICC_026t',
      cardType: 'minion',
      name: 'Skeleton',
      nameCN: '骷髅',
      text: '',
      mechanics: [],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_imageFromBlizzardSb.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_cardArtFromHsJson256x.png',
      tier: 1,
      health: 1,
      attack: 1,
      minionTypes: ['undead'],
      minionTypesCN: ['亡灵'],
      upgradeCard: {
        id: 99630,
        strId: 'BG_ICC_026t_G',
        cardType: 'minion',
        name: 'Skeleton',
        nameCN: '骷髅',
        text: '',
        mechanics: [],
        referencedTags: [],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_G_battlegroundsImageGold.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_G_cardArtFromHsJson256x.png',
        tier: 1,
        health: 2,
        attack: 2,
        minionTypes: ['undead'],
        minionTypesCN: ['亡灵'],
      },
    },
  ],
  tier: 1,
  health: 1,
  attack: 1,
  minionTypes: ['undead'],
  minionTypesCN: ['亡灵'],
  upgradeCard: {
    id: 104554,
    strId: 'BG28_300_G',
    cardType: 'minion',
    name: 'Harmless Bonehead',
    nameCN: '无害的骨颅',
    text: '<b>亡语：</b>召唤四个1/1的骷髅。',
    mechanics: ['DEATHRATTLE'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_300_G_battlegroundsImageGold.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_300_G_cardArtFromHsJson256x.png',
    tokens: [
      {
        id: 99630,
        strId: 'BG_ICC_026t_G',
        cardType: 'minion',
        name: 'Skeleton',
        nameCN: '骷髅',
        text: '',
        mechanics: [],
        referencedTags: [],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_G_battlegroundsImageGold.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_G_cardArtFromHsJson256x.png',
        tier: 1,
        health: 2,
        attack: 2,
        minionTypes: ['undead'],
        minionTypesCN: ['亡灵'],
      },
    ],
    tier: 1,
    health: 2,
    attack: 2,
    minionTypes: ['undead'],
    minionTypesCN: ['亡灵'],
  },
};
