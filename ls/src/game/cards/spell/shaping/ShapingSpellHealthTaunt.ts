import { Spell } from '@/game/Spell';
import type { Minion } from '@/game/Minion';

/**
 * 塑造法术：强化随从类
 * 效果：直到下个回合，使一个随从获得+2生命值和嘲讽
 */
export class ShapingSpellHealthTaunt extends Spell {
  static BASE_DATA = {
    id: 83988,
    strId: 'BG23_004t',
    cardType: 'spell',
    name: "Angler's Lure",
    nameCN: '钓客的诱饵',
    text: '直到下个回合，使一个随从获得+2生命值和<b>嘲讽<\/b>。',
    mechanics: [],
    referencedTags: ['TAUNT'],
    img: 'https:\/\/battlegrounds.oss.gamerhub.cn\/all_images\/32.2.4.221850\/BG23_004t_battlegroundsImage.png',
    art: 'https:\/\/battlegrounds.oss.gamerhub.cn\/all_images\/32.2.4.221850\/BG23_004t_cardArtFromHsJson256x.png',
    // 法术特有属性
    type: 'shaping',
    duration: 1,
    isTemporary: true,
    requiresTarget: true,
  };

  /**
   * 构造函数
   * @param params - 法术参数
   */
  constructor(params: Partial<ShapingSpellHealthTaunt> = {}) {
    // 调用父类构造函数，使用BASE_DATA和params初始化
    super(params);
  }

  /**
   * 过滤目标 - 根据法术的目标选择规则过滤有效目标
   * @param targets - 所有可能的目标列表
   * @returns 过滤后的有效目标列表
   */
  filterTargets(targetList: Minion[]): Minion[] {
    // 该法术可以作用于任何随从，所以返回所有非空目标
    return targetList.filter(minion => minion !== null && minion !== undefined);
  }

  /**
   * 执行法术效果 - 为目标随从应用法术效果
   * @param target - 目标随从
   * @returns 是否成功执行
   */
  execute(target: Minion): boolean {
    try {
      // 创建buff对象
      const buff = {
        id: `shaping_spell_health_taunt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source: this.nameCN,
        attackBonus: 0,
        healthBonus: 2,
        maxHealthBonus: 2,
        type: 'temporary', // 法术效果默认是临时的
        turnsRemaining: 1,
      };

      // 使用addBuff方法添加加成
      target.addBuff(buff);

      // 添加临时关键词
      if (!target.temporaryKeywords.includes('taunt')) {
        target.temporaryKeywords.push('taunt');
      }

      return true;
    } catch (error) {
      console.error('执行法术效果失败:', error);
      return false;
    }
  }
}
