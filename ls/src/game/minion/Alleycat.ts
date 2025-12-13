import { Minion } from '../Minion';
import { minionClassMapByStrId } from './MinionClassMap';

/**
 * 雄斑虎类 - 继承自Minion，实现雄斑虎的特殊效果
 */
export class Alleycat extends Minion {
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

    // 从minionClassMapByStrId获取雌斑虎类
    const TabbycatClass = minionClassMapByStrId[tabbycatStrId];

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
    const tabbycat = new TabbycatClass(
      tabbycatData.id,
      tabbycatData.strId,
      tabbycatData.cardType,
      tabbycatData.name,
      tabbycatData.nameCN,
      tabbycatData.text,
      tabbycatData.mechanics,
      tabbycatData.referencedTags,
      tabbycatData.img,
      tabbycatData.art,
      tabbycatData.tier,
      tabbycatData.health,
      tabbycatData.attack,
      tabbycatData.minionTypes,
      tabbycatData.minionTypesCN,
      tabbycatData.upgradeCard
    );

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
