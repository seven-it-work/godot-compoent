import type { Minion } from '@/game/Minion';
import { Spell } from '@/game/Spell';

/**
 * 鲜血宝石法术类
 * 效果：使一个随从获得+1攻击力和+1生命值
 */
export class BloodGem extends Spell {
  static BASE_DATA = {
    id: 70136,
    strId: 'BG20_GEM',
    cardType: 'spell',
    name: 'Blood Gem',
    nameCN: '鲜血宝石',
    text: '使一个随从获得+{0}\/+{1}。',
    mechanics: [],
    referencedTags: [],
    img: 'https:\/\/battlegrounds.oss.gamerhub.cn\/all_images\/32.2.4.221850\/BG20_GEM_battlegroundsImage.png',
    art: 'https:\/\/battlegrounds.oss.gamerhub.cn\/all_images\/32.2.4.221850\/BG20_GEM_cardArtFromHsJson256x.png',
    // 法术特有属性
    type: 'normal',
    duration: 0,
    isTemporary: false,
    requiresTarget: true,
  };

  /**
   * 构造函数
   * @param params - 法术参数
   */
  constructor(params: Partial<BloodGem> = {}) {
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
        id: `blood_gem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source: this.nameCN,
        attackBonus: 1,
        healthBonus: 1,
        maxHealthBonus: 1,
        type: 'permanent', // 鲜血宝石效果是永久的
      };

      // 使用addBuff方法添加加成
      target.addBuff(buff);

      return true;
    } catch (error) {
      console.error('执行鲜血宝石效果失败:', error);
      return false;
    }
  }
}
