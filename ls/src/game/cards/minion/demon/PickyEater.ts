import { Minion } from '@/game/Minion';

/**
 * 挑食魔犬类 - 继承自Minion，实现挑食魔犬的特殊效果
 */
export class PickyEater extends Minion {
  static BASE_DATA = {
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

  /**
   * 重写战吼方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从被放置到战场时触发
   * 效果：战吼：随机吞食酒馆中的一个随从，获得其属性值
   */
  battlecry(game: any): void {
    // 战吼：随机吞食酒馆中的一个随从，获得其属性值
    console.log('挑食魔犬：随机吞食酒馆中的一个随从，获得其属性值');

    // 获取酒馆实例
    const tavern = game.tavern || game.gameStore?.tavern;
    if (!tavern) {
      console.error('无法获取酒馆实例');
      return;
    }

    // 获取酒馆中可用的随从（非null的随从）
    const availableMinions = tavern.availableMinions.filter((minion: any) => minion !== null);
    if (availableMinions.length === 0) {
      console.log('酒馆中没有可用的随从');
      return;
    }

    // 随机选择一个随从
    const randomIndex = Math.floor(Math.random() * availableMinions.length);
    const eatenMinion = availableMinions[randomIndex];
    const eatenMinionIndex = tavern.availableMinions.indexOf(eatenMinion);

    if (eatenMinion && eatenMinionIndex !== -1) {
      // 计算属性值（金色版本效果翻倍）
      // 注意：这里直接使用eatenMinion.attack和eatenMinion.maxHealth属性而非调用calculateAttack()/calculateMaxHealth()方法
      // 原因：Minion类中attack和maxHealth属性已经在updateStats()方法中更新为包含所有加成的值
      // 当addBuff()或removeBuff()被调用时，会自动触发updateStats()更新这些属性
      // calculateAttack()和calculateMaxHealth()是private方法，无法从外部类访问
      const attackBonus = eatenMinion.attack * (this.isGolden ? 2 : 1);
      const healthBonus = eatenMinion.health * (this.isGolden ? 2 : 1);
      const maxHealthBonus = eatenMinion.maxHealth * (this.isGolden ? 2 : 1);

      // 为挑食魔犬添加属性加成
      this.addBuff({
        id: `picky_eater_buff_${Date.now()}`,
        source: '挑食魔犬',
        attackBonus,
        healthBonus,
        maxHealthBonus,
      });

      // 从酒馆中移除被吞食的随从
      tavern.setAvailableMinion(eatenMinionIndex, null);

      console.log(
        `挑食魔犬吞食了${eatenMinion.nameCN || eatenMinion.name}，获得了${attackBonus}攻击力和${healthBonus}生命值`
      );
    }
  }
}
