import { Minion, MinionKeyword } from '../Minion';

/**
 * 气泡枪手类 - 继承自Minion，实现气泡枪手的特殊效果
 */
export class BubbleGunner extends Minion {
  /**
   * 重写战吼方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从被放置到战场时触发
   * 效果：战吼：获得一个随机额外关键词
   */
  battlecry(_game?: any): void {
    // 战吼：获得一个随机额外关键词
    console.log('气泡枪手：获得一个随机额外关键词');

    // 定义所有可能的关键词列表
    const allKeywords: MinionKeyword[] = [
      MinionKeyword.TAUNT,
      MinionKeyword.DIVINE_SHIELD,
      MinionKeyword.WINDFURY,
      MinionKeyword.SUPER_WINDFURY,
      MinionKeyword.STEALTH,
      MinionKeyword.CHARGE,
      MinionKeyword.POISONOUS,
      MinionKeyword.REBORN,
      MinionKeyword.IMMUNE,
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

      // 根据关键词设置对应属性
      if (newKeyword === MinionKeyword.DIVINE_SHIELD) {
        this.hasDivineShield = true;
      } else if (newKeyword === MinionKeyword.REBORN) {
        this.hasReborn = true;
      }

      // 输出获得的关键词
      console.log(`气泡枪手获得了新关键词：${newKeyword}`);
    }
  }
}
