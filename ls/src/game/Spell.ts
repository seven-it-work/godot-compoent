import { Card, CardType } from './Card';

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
 * 法术效果接口 - 定义法术效果的数据结构
 */
export interface SpellEffect {
  type: SpellEffectType; // 效果类型
  value: any; // 效果值
  duration?: number; // 持续回合数
  target?: 'self' | 'friendly' | 'enemy' | 'all'; // 效果目标
}

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
  /** 法术效果列表 - 法术产生的效果 */
  effects!: SpellEffect[];
  /** 持续回合数 - 法术效果的持续回合数 */
  duration!: number;
  /** 已存在回合数 - 法术已经存在的回合数 */
  turnsExisted!: number;
  /** 目标选择规则 - 法术的使用范围和目标选择规则 */
  targetSelection!: SpellTargetSelection;

  /**
   * 法术构造函数 - 使用对象属性赋值方式
   * @param params - 法术构造参数对象
   */
  constructor(params: {
    id: string | number;
    nameCN: string;
    description: string;
    type: 'shaping' | 'normal' | 'hero_power';
    effects: SpellEffect[];
    targetSelection?: SpellTargetSelection;
    duration?: number;
    isTemporary?: boolean;
  }) {
    // 调用父类构造函数，初始化公共属性
    super({
      strId: params.id.toString(), // strId
      cardType: CardType.SPELL, // cardType
      name: '', // name (英文名称，暂时为空)
      nameCN: params.nameCN, // nameCN
      text: params.description, // text (描述作为文本)
      mechanics: [], // mechanics
      referencedTags: [], // referencedTags
      img: '', // img
      art: '', // art
      tier: undefined, // tier (法术没有星级)
      cost: 0, // cost (默认消耗为0)
      isTemporary: params.isTemporary || false,
    });

    // 初始化法术特有属性
    Object.assign(this, {
      type: params.type,
      effects: params.effects,
      duration: params.duration || 0,
      turnsExisted: 0,
      targetSelection: params.targetSelection || {
        scope: 'battlefield',
        targetType: 'minion',
        requiresTarget: true,
      },
    });
  }

  /**
   * 执行法术效果 - 为目标随从应用法术效果
   * @param target - 目标随从
   * @returns 是否成功执行
   */
  execute(target: any): boolean {
    // 为目标随从应用所有效果
    this.effects.forEach(effect => {
      // 生成唯一的buff ID
      const buffId = `spell-${this.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      if (effect.type === 'attack_bonus' || effect.type === 'max_health_bonus') {
        // 创建buff对象
        const buff = {
          id: buffId,
          source: this.nameCN,
          attackBonus: effect.type === 'attack_bonus' ? effect.value : 0,
          healthBonus: 0,
          maxHealthBonus: effect.type === 'max_health_bonus' ? effect.value : 0,
          type: 'temporary', // 法术效果默认是临时的
          turnsRemaining: effect.duration || 0,
        };

        // 使用addBuff方法添加加成
        target.addBuff(buff);
      } else if (effect.type === 'health_bonus') {
        // 直接增加当前生命值，这是允许的
        target.health += effect.value;
      } else if (effect.type === 'keyword') {
        // 添加临时关键词
        if (!target.temporaryKeywords.includes(effect.value)) {
          target.temporaryKeywords.push(effect.value);
          // 清除缓存以更新关键词
          if (target.clearCache) {
            target.clearCache();
          }
          // 更新相关标志
          if (effect.value === 'divine_shield') {
            target.hasDivineShield = true;
          } else if (effect.value === 'reborn') {
            target.hasReborn = true;
          }
        }
      }
    });
    return true;
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
