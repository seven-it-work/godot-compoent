import { BattleAttributes } from "./character";
import { BaseGrowth, RangeGrowth, RandomRangeGrowth } from "./growth";

/**
 * 属性生成器类
 * 负责根据等级生成角色的战斗属性
 */
export class AttributesGenerator {
  /**
   * 根据等级生成战斗属性
   * @param level 角色等级
   * @returns 生成的战斗属性
   */
  static generateAttributesByLevel(level: number): BattleAttributes {
    // 基础属性值
    const baseAttack = 5;
    const baseDefense = 3;
    const baseHealth = 50;
    const baseDodge = 2;
    const baseBlock = 2;
    const baseCritical = 2;
    const baseAttackSpeed = 80;

    // 攻击属性：随机范围成长
    const attackGrowth = new RandomRangeGrowth(
      baseAttack,
      1,
      3,
      baseAttack,
      baseAttack + 2,
      false,
      true,
      1
    );

    // 防御属性：随机范围成长
    const defenseGrowth = new RandomRangeGrowth(
      baseDefense,
      1,
      2,
      baseDefense,
      baseDefense + 1,
      false,
      true,
      1
    );

    // 生命值：范围成长
    const healthGrowth = new RangeGrowth(
      baseHealth,
      10,
      20,
      baseHealth,
      baseHealth + 10,
      false,
      true,
      1
    );

    // 闪避属性：随机范围成长
    const dodgeGrowth = new RandomRangeGrowth(
      baseDodge,
      0.5,
      1,
      baseDodge - 0.5,
      baseDodge + 0.5,
      false,
      true
    );

    // 格挡属性：随机范围成长
    const blockGrowth = new RandomRangeGrowth(
      baseBlock,
      0.5,
      1,
      baseBlock - 0.5,
      baseBlock + 0.5,
      false,
      true
    );

    // 暴击属性：随机范围成长
    const criticalGrowth = new RandomRangeGrowth(
      baseCritical,
      0.5,
      1,
      baseCritical - 0.5,
      baseCritical + 0.5,
      false,
      true
    );

    // 攻击速度：基础成长
    const attackSpeedGrowth = new BaseGrowth(baseAttackSpeed, 2, 5, 1);

    // 根据等级成长
    for (let i = 1; i < level; i++) {
      attackGrowth.grow();
      defenseGrowth.grow();
      healthGrowth.grow();
      dodgeGrowth.grow();
      blockGrowth.grow();
      criticalGrowth.grow();
      attackSpeedGrowth.grow();
    }

    // 生成最终属性
    return new BattleAttributes({
      attack: Math.floor(attackGrowth.getCurrentValue()),
      defense: Math.floor(defenseGrowth.getCurrentValue()),
      health: Math.floor(healthGrowth.getMaxValue()),
      maxHealth: Math.floor(healthGrowth.getMaxValue()),
      dodge: Math.floor(dodgeGrowth.getCurrentValue()),
      block: Math.floor(blockGrowth.getCurrentValue()),
      critical: Math.floor(criticalGrowth.getCurrentValue()),
      attackSpeed: Math.floor(attackSpeedGrowth.getCurrentValue()),
    });
  }

  /**
   * 获取角色当前的随机攻击值
   * @param character 角色对象
   * @returns 当前随机攻击值
   */
  static getCharacterCurrentAttack(character: { level: number }): number {
    const baseAttack = 5;
    let minAttack = baseAttack;
    let maxAttack = baseAttack + 2;

    // 根据等级计算攻击范围
    for (let i = 1; i < character.level; i++) {
      const growth = new RandomRangeGrowth(
        baseAttack,
        1,
        3,
        minAttack,
        maxAttack,
        false,
        true,
        1
      );
      growth.grow();
      minAttack = growth.getMinValue();
      maxAttack = growth.getMaxValue();
    }

    // 返回当前随机攻击值
    const growth = new RandomRangeGrowth(
      baseAttack,
      1,
      3,
      minAttack,
      maxAttack,
      false,
      true,
      1
    );
    return Math.floor(growth.getCurrentValue());
  }

  /**
   * 获取角色当前的随机防御值
   * @param character 角色对象
   * @returns 当前随机防御值
   */
  static getCharacterCurrentDefense(character: { level: number }): number {
    const baseDefense = 3;
    let minDefense = baseDefense;
    let maxDefense = baseDefense + 1;

    // 根据等级计算防御范围
    for (let i = 1; i < character.level; i++) {
      const growth = new RandomRangeGrowth(
        baseDefense,
        1,
        2,
        minDefense,
        maxDefense,
        false,
        true,
        1
      );
      growth.grow();
      minDefense = growth.getMinValue();
      maxDefense = growth.getMaxValue();
    }

    // 返回当前随机防御值
    const growth = new RandomRangeGrowth(
      baseDefense,
      1,
      2,
      minDefense,
      maxDefense,
      false,
      true,
      1
    );
    return Math.floor(growth.getCurrentValue());
  }

  /**
   * 获取角色当前的随机闪避值
   * @param character 角色对象
   * @returns 当前随机闪避值
   */
  static getCharacterCurrentDodge(character: { level: number }): number {
    const level = character.level;
    const baseDodge = 2;
    // 模拟闪避成长过程
    const dodgeGrowth = new RandomRangeGrowth(
      baseDodge,
      0.5,
      1,
      baseDodge - 0.5,
      baseDodge + 0.5,
      false,
      true
    );
    for (let i = 1; i < level; i++) {
      dodgeGrowth.grow();
    }
    return Math.floor(dodgeGrowth.getCurrentValue());
  }

  /**
   * 获取角色当前的随机格挡值
   * @param character 角色对象
   * @returns 当前随机格挡值
   */
  static getCharacterCurrentBlock(character: { level: number }): number {
    const level = character.level;
    const baseBlock = 2;
    // 模拟格挡成长过程
    const blockGrowth = new RandomRangeGrowth(
      baseBlock,
      0.5,
      1,
      baseBlock - 0.5,
      baseBlock + 0.5,
      false,
      true
    );
    for (let i = 1; i < level; i++) {
      blockGrowth.grow();
    }
    return Math.floor(blockGrowth.getCurrentValue());
  }

  /**
   * 获取角色当前的随机暴击值
   * @param character 角色对象
   * @returns 当前随机暴击值
   */
  static getCharacterCurrentCritical(character: { level: number }): number {
    const level = character.level;
    const baseCritical = 2;
    // 模拟暴击成长过程
    const criticalGrowth = new RandomRangeGrowth(
      baseCritical,
      0.5,
      1,
      baseCritical - 0.5,
      baseCritical + 0.5,
      false,
      true
    );
    for (let i = 1; i < level; i++) {
      criticalGrowth.grow();
    }
    return Math.floor(criticalGrowth.getCurrentValue());
  }
}
