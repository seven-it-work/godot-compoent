import type { DeathContext } from '@/game/Minion';
import { Minion } from '@/game/Minion';
import { Beetle } from './Beetle';

/**
 * 嗡鸣害虫类 - 继承自Minion，实现嗡鸣害虫的特殊效果
 */
export class BuzzingVermin extends Minion {
  static BASE_DATA = {
    id: 100012,
    strId: 'BG31_803',
    cardType: 'minion',
    name: 'BuzzingVermin',
    nameCN: '嗡鸣害虫',
    text: '<b>亡语：</b>召唤一只2/2的甲虫。',
    mechanics: ['DEATHRATTLE'],
    referencedTags: [],
    img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_803_battlegroundsImage.png',
    art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_803_cardArtFromHsJson256x.png',
    tier: 1,
    health: 1,
    attack: 1,
    minionTypes: ['beast'],
    minionTypesCN: ['野兽'],
    upgradeCard: {
      id: 100013,
      strId: 'BG31_803_G',
      cardType: 'minion',
      name: 'BuzzingVermin',
      nameCN: '嗡鸣害虫',
      text: '<b>亡语：</b>召唤两只2/2的甲虫。',
      mechanics: ['DEATHRATTLE'],
      referencedTags: [],
      img: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_803_battlegroundsImageGold.png',
      art: 'https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_803_cardArtFromHsJson256x.png',
      tier: 1,
      health: 2,
      attack: 2,
      minionTypes: ['beast'],
      minionTypesCN: ['野兽'],
    },
  };
  /**
   * 重写亡语触发的方法
   * @param context - 死亡上下文
   * @使用方式：当随从死亡时触发
   * 效果：亡语：召唤一只/两只2/2的甲虫（根据是否金色）
   */
  onDeath(context?: DeathContext): void {
    if (!context) return;

    // 根据是否金色决定召唤数量
    const summonCount = this.isGolden ? 2 : 1;

    // 直接在原位置召唤甲虫
    const { friendlyMinions, position } = context;

    for (let i = 0; i < summonCount; i++) {
      const beetle = new Beetle();

      // 如果当前位置是undefined，则替换，否则插入
      if (friendlyMinions[position] === undefined) {
        friendlyMinions[position] = beetle;
      } else {
        friendlyMinions.splice(position + i, 0, beetle);
        // 移除最后的undefined以保持数组长度
        if (friendlyMinions.length > 7) {
          friendlyMinions.pop();
        }
      }

      // 记录日志
      if (context.addLog) {
        context.addLog(`召唤了 ${beetle.nameCN}`);
      }
      console.log(`嗡鸣害虫：召唤了 ${beetle.nameCN} (${beetle.attack}/${beetle.health})`);
    }
  }
}
