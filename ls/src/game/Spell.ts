import { Card, CardType } from './Card';
import type { Minion } from './Minion';

/**
 * 法术效果类型 - 定义法术可以产生的效果类型
 */
export type SpellEffectType =
  | 'attack_bonus'
  | 'health_bonus'
  | 'max_health_bonus'
  | 'keyword'
  | 'special';

/**
 * 法术使用范围类型 - 定义法术可以使用的范围
 */
export type SpellTargetScope = 'battlefield' | 'tavern' | 'both';

/**
 * 法术目标类型 - 定义法术可以选择的目标类型
 */
export type SpellTargetType =
  | 'minion'
  | 'hero'
  | 'all_minions'
  | 'self'
  | 'friendly'
  | 'enemy'
  | 'any';

/**
 * 法术使用范围接口 - 定义法术可以使用的范围和目标选择规则
 */
export interface SpellTargetSelection {
  scope: SpellTargetScope; // 使用范围：战场、酒馆或两者
  targetType: SpellTargetType; // 目标类型：随从、英雄等
  requiresTarget: boolean; // 是否需要选择目标
  multipleTargets?: boolean; // 是否可以选择多个目标
  maxTargets?: number; // 最大选择目标数量
}

/**
 * 法术类 - 定义法术的数据结构和行为
 */
export class Spell extends Card {
  /** 法术类型 - 塑造法术、普通法术等 */
  type!: 'shaping' | 'normal' | 'hero_power';
  /** 持续回合数 - 法术效果的持续回合数 */
  duration!: number;
  /** 已存在回合数 - 法术已经存在的回合数 */
  turnsExisted!: number;
  /** 是否需要选择目标 - 法术是否需要选择目标才能释放 */
  requiresTarget: boolean = true;

  /**
   * 法术构造函数 - 使用对象属性赋值方式
   * @param params - 法术构造参数对象，所有属性可选。会优先使用当前类的BASE_DATA初始化，BASE_DATA优先级高于params
   */
  constructor(params: Partial<Spell> = {}) {
    // 调用父类构造函数，初始化公共属性
    super(params);

    // 获取当前类的BASE_DATA（如果存在），支持子类的BASE_DATA
    const baseData = (this.constructor as any).BASE_DATA;
    // 合并params和BASE_DATA，BASE_DATA优先级更高
    const mergedParams = {
      ...params,
      ...baseData,
    };

    // 确保cardType是法术类型
    this.cardType = CardType.SPELL;

    // 初始化法术特有属性
    this.type = mergedParams.type || 'normal';
    this.duration = mergedParams.duration || 0;
    this.turnsExisted = mergedParams.turnsExisted || 0;
    this.requiresTarget =
      mergedParams.requiresTarget !== undefined ? mergedParams.requiresTarget : true;
  }

  /**
   * 过滤目标 - 根据法术的目标选择规则过滤有效目标
   * @param targets - 所有可能的目标列表
   * @returns 过滤后的有效目标列表
   */
  filterTargets(targetList: Minion[]): Minion[] {
    return targetList;
  }

  /**
   * 执行法术效果 - 为目标随从应用法术效果
   * @param _target - 目标随从
   * @returns 是否成功执行
   */
  execute(_target: Minion): boolean {
    // 子类自己实现
    return false;
  }

  /**
   * 回合结束时更新 - 处理法术的持续时间
   * @returns 是否应该移除该法术
   */
  onTurnEnd(): boolean {
    if (this.isTemporary) {
      this.turnsExisted++;
      // 如果是塑造法术，回合结束时移除
      return true;
    }
    return false;
  }
}
