import { Minion } from '../../Minion';
import { getMinionClassByStrId } from '../MinionClassMap';

/**
 * 雄斑虎类 - 继承自Minion，实现雄斑虎的特殊效果
 */
export class Alleycat extends Minion {
  static BASE_DATA = {
    id: 96758,
    strId: 'BG_CFM_315',
    cardType: 'minion',
    name: 'Alleycat',
    nameCN: '雄斑虎',
    text: '<b>战吼：</b>召唤一头1/1的雌斑虎。',
    mechanics: ['BATTLECRY'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_CFM_315_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_CFM_315_cardArtFromHsJson256x.png',
    tokens: [
      {
        id: 96759,
        strId: 'BG_CFM_315t',
        cardType: 'minion',
        name: 'Tabbycat',
        nameCN: '雌斑虎',
        text: '',
        mechanics: [],
        referencedTags: [],
        img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_CFM_315t_battlegroundsImage.png',
        art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_CFM_315t_cardArtFromHsJson256x.png',
        tier: 1,
        health: 1,
        attack: 1,
        minionTypes: ['beast'],
        minionTypesCN: ['野兽'],
        upgradeCard: {
          id: 60054,
          strId: 'TB_BaconUps_093t',
          cardType: 'minion',
          name: 'Tabbycat',
          nameCN: '雌斑虎',
          text: '',
          mechanics: [],
          referencedTags: [],
          img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_093t_imageFromBlizzardSb.png',
          art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_093t_cardArtFromHsJson256x.png',
          tier: 1,
          health: 2,
          attack: 2,
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
      id: 60053,
      strId: 'TB_BaconUps_093',
      cardType: 'minion',
      name: 'Alleycat',
      nameCN: '雄斑虎',
      text: '<b>战吼：</b>召唤一头2/2的雌斑虎。',
      mechanics: ['BATTLECRY'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_093_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_093_cardArtFromHsJson256x.png',
      tokens: [
        {
          id: 60054,
          strId: 'TB_BaconUps_093t',
          cardType: 'minion',
          name: 'Tabbycat',
          nameCN: '雌斑虎',
          text: '',
          mechanics: [],
          referencedTags: [],
          img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_093t_imageFromBlizzardSb.png',
          art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_093t_cardArtFromHsJson256x.png',
          tier: 1,
          health: 2,
          attack: 2,
          minionTypes: ['beast'],
          minionTypesCN: ['野兽'],
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
   * 重写战吼方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从被放置到战场时触发
   * 效果：战吼：召唤一头1/1的雌斑虎
   */
  battlecry(game: any): void {
    // 战吼：召唤一头1/1的雌斑虎
    console.log('雄斑虎：召唤一头1/1的雌斑虎');

    // 获取雌斑虎的strId
    const tabbycatStrId = 'BG_CFM_315t';

    // 从getMinionClassByStrId获取雌斑虎类
    const TabbycatClass = getMinionClassByStrId(tabbycatStrId);

    if (!TabbycatClass) {
      console.error(`无法找到雌斑虎类，strId: ${tabbycatStrId}`);
      return;
    }

    // 获取minions.json中雌斑虎的数据
    const tabbycatData = game.minionPool.find((minion: Minion) => minion.strId === tabbycatStrId);

    if (!tabbycatData) {
      console.error(`无法找到雌斑虎数据，strId: ${tabbycatStrId}`);
      return;
    }

    // 创建雌斑虎实例
    const tabbycat = new TabbycatClass({
      ...tabbycatData,
    });

    // 设置雌斑虎的cost为0，因为是通过战吼召唤的，不需要消耗金币
    tabbycat.cost = 0;

    // 获取当前玩家实例
    const currentPlayer = game.player;

    if (!currentPlayer) {
      console.error('无法获取当前玩家实例');
      return;
    }

    // 将雌斑虎召唤到当前玩家的战场（使用统一入口）
    // 参考位置为当前雄斑虎的位置，表示从当前位置后开始插入
    currentPlayer.summonMinion(tabbycat, this.position);
  }
}
