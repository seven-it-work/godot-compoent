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
 * 法术效果接口 - 定义法术效果的数据结构
 */
export interface SpellEffect {
  type: SpellEffectType; // 效果类型
  value: any; // 效果值
  duration?: number; // 持续回合数
  target?: 'self' | 'friendly' | 'enemy' | 'all'; // 效果目标
}

/**
 * 法术类 - 定义法术的数据结构和行为
 */
export class Spell {
  /** 法术ID - 唯一标识符 */
  id: string;
  /** 法术名称 - 法术的中文名称 */
  nameCN: string;
  /** 法术描述 - 法术的效果描述 */
  description: string;
  /** 法术类型 - 塑造法术、普通法术等 */
  type: 'shaping' | 'normal' | 'hero_power';
  /** 法术效果列表 - 法术产生的效果 */
  effects: SpellEffect[];
  /** 持续回合数 - 法术效果的持续回合数 */
  duration: number;
  /** 已存在回合数 - 法术已经存在的回合数 */
  turnsExisted: number;
  /** 是否为临时法术 - 临时法术在结束回合时会消失 */
  isTemporary: boolean;

  /**
   * 法术构造函数
   * @param id - 法术ID
   * @param nameCN - 法术中文名称
   * @param description - 法术效果描述
   * @param type - 法术类型
   * @param effects - 法术效果列表
   * @param duration - 持续回合数
   * @param isTemporary - 是否为临时法术
   */
  constructor(
    id: string,
    nameCN: string,
    description: string,
    type: 'shaping' | 'normal' | 'hero_power',
    effects: SpellEffect[],
    duration: number = 0,
    isTemporary: boolean = false
  ) {
    this.id = id;
    this.nameCN = nameCN;
    this.description = description;
    this.type = type;
    this.effects = effects;
    this.duration = duration;
    this.turnsExisted = 0;
    this.isTemporary = isTemporary;
  }

  /**
   * 执行法术效果 - 为目标随从应用法术效果
   * @param target - 目标随从
   * @returns 是否成功执行
   */
  execute(target: any): boolean {
    // 为目标随从应用所有效果
    this.effects.forEach(effect => {
      if (effect.type === 'attack_bonus') {
        // 增加攻击力
        target.attack += effect.value;
      } else if (effect.type === 'health_bonus') {
        // 增加当前生命值
        target.health += effect.value;
      } else if (effect.type === 'max_health_bonus') {
        // 增加最大生命值
        target.maxHealth += effect.value;
        // 同步当前生命值
        target.health += effect.value;
      } else if (effect.type === 'keyword') {
        // 添加关键词
        if (!target.keywords.includes(effect.value)) {
          target.keywords.push(effect.value);
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
