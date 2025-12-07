import {
  BasicGrowthAttribute,
  BasicRangeGrowthAttribute,
  BasicRangeRandomGrowthAttribute,
} from "@/v1/growthAttribute";
import RandomUtils from "@/v1/utils/RandomUtils";
import { realmConfigs, type Cultivator, type Gender } from "./define";
import type { DamageResult } from "@/v1/damageResult";
import { SpiritRootClass } from "@/v1/spiritRoot";

/**
 * 修仙者类
 * 实现修仙者接口，提供修仙者的基本属性和能力
 */
export class CultivatorClass implements Cultivator {
  // 唯一标识：自动生成的全局唯一ID，用于区分不同的修仙者
  id: string = RandomUtils.randomId();
  // 名称：修仙者的姓名，用于显示和标识
  name: string = "";
  // 攻击力：影响修仙者的物理和法术攻击伤害数值，值越高造成的伤害越大
  attack: BasicRangeRandomGrowthAttribute = new BasicRangeRandomGrowthAttribute(
    {
      name: "攻击力",
      minGrowth: 10,
      maxGrowth: 20,
      minRange: 10,
      maxRange: 20,
      growthRate: 1.2,
      fixedGrowth: 0,
      tips: "修仙者的基础攻击能力，直接影响物理和法术攻击的伤害输出",
    }
  );
  // 防御力：减少修仙者受到的物理和法术伤害，值越高受到的伤害越少
  defense: BasicRangeRandomGrowthAttribute =
    new BasicRangeRandomGrowthAttribute({
      name: "防御力",
      minGrowth: 5,
      maxGrowth: 10,
      minRange: 5,
      maxRange: 10,
      growthRate: 1.2,
      fixedGrowth: 0,
      tips: "修仙者的基础防御能力，减少受到的物理和法术伤害",
    });
  // 气血：修仙者的生命总量，当气血降至0时，修仙者死亡
  qiBlood: BasicRangeGrowthAttribute = new BasicRangeGrowthAttribute({
    name: "气血",
    minGrowth: 0,
    maxGrowth: 100,
    currentValue: 100,
    minRange: 0,
    maxRange: 100,
    growMinRange: false,
    growCurrentValue: false,
    growthRate: 1,
    fixedGrowth: 0,
    tips: "修仙者的生命总量，降至0时角色死亡，可通过休息或使用道具恢复",
  });
  // 灵根数组：修仙者拥有的灵根，每种灵根对应不同的元素属性，影响修炼速度和属性成长
  spiritRoots: SpiritRootClass[] = SpiritRootClass.随机生成灵根(5);
  // 境界等级：修仙者的当前境界，影响各项属性的基础值和成长潜力
  realmLevel: BasicGrowthAttribute = new BasicGrowthAttribute({
    name: "境界等级",
    growthRate: 0,
    fixedGrowth: 1,
    tips: "修仙者的当前境界，影响各项属性的基础值和成长潜力",
  });
  // 性别：修仙者的性别，影响角色外观表现和部分剧情发展
  gender: Gender = "男";
  // 暴击率：攻击时触发暴击的概率百分比，值越高越容易造成暴击伤害
  criticalRate: BasicRangeRandomGrowthAttribute =
    new BasicRangeRandomGrowthAttribute({
      name: "暴击率",
      minGrowth: 0,
      maxGrowth: 1,
      minRange: 0,
      maxRange: 1,
      growMinRange: true,
      growCurrentValue: false,
      growthRate: 1,
      fixedGrowth: 0,
      other: {
        // 是否为百分百
        isPercent: true,
      },
      tips: "攻击时触发暴击的概率，触发后造成额外伤害",
    });
  // 暴击伤害：暴击时造成的额外伤害倍率，在基础伤害上附加此百分比的额外伤害
  criticalDamage: BasicRangeRandomGrowthAttribute =
    new BasicRangeRandomGrowthAttribute({
      name: "暴击伤害",
      minGrowth: 5,
      maxGrowth: 10,
      minRange: 0,
      maxRange: 5,
      growMinRange: true,
      growCurrentValue: false,
      growthRate: 1,
      fixedGrowth: 0,
      tips: "暴击时造成的额外伤害倍率，值越高暴击伤害越大",
    });
  // 闪避率：躲避敌人攻击的概率百分比，值越高越容易躲避敌人的攻击
  dodgeRate: BasicRangeRandomGrowthAttribute =
    new BasicRangeRandomGrowthAttribute({
      name: "闪避率",
      minGrowth: 0,
      maxGrowth: 1,
      minRange: 0,
      maxRange: 1,
      growMinRange: true,
      growCurrentValue: false,
      growthRate: 1,
      fixedGrowth: 0,
      other: {
        // 是否为百分百
        isPercent: true,
      },
      tips: "躲避敌人攻击的概率，成功闪避后不受伤害",
    });
  // 灵力：用于释放技能和法术的能量资源，消耗后可通过休息或使用道具恢复
  spiritPower: BasicRangeGrowthAttribute = new BasicRangeGrowthAttribute({
    name: "灵力",
    minGrowth: 0,
    maxGrowth: 50,
    currentValue: 50,
    minRange: 0,
    maxRange: 50,
    growMinRange: false,
    growCurrentValue: false,
    growthRate: 1,
    fixedGrowth: 0,
    tips: "用于释放技能和法术的能量资源，消耗后可通过休息恢复",
  });
  // 功法列表：修仙者已经学会的功法名称集合，可在战斗或修炼中使用
  cultivationMethods: string[] = [];
  // 境界突破概率 最大100%级100
  breakthroughChance: BasicRangeRandomGrowthAttribute =
    new BasicRangeRandomGrowthAttribute({
      name: "突破率",
      minGrowth: 0,
      maxGrowth: 0,
      minRange: 0,
      maxRange: 10,
      growMinRange: true,
      growCurrentValue: false,
      growthRate: 0,
      fixedGrowth: 0,
      other: {
        // 是否为百分百
        isPercent: true,
      },
      tips: "突破到更高境界的概率，值越高越容易成功突破",
    });
  // 灵根吸纳：修仙者吸纳灵根能量的能力
  spiritRootAbsorb: BasicRangeRandomGrowthAttribute =
    new BasicRangeRandomGrowthAttribute({
      name: "灵根吸纳",
      minGrowth: 0,
      maxGrowth: 10,
      minRange: 5,
      maxRange: 10,
      growMinRange: true,
      growCurrentValue: false,
      growthRate: 1,
      fixedGrowth: 0,
      tips: "修仙者吸纳灵根能量的能力，值越高每次吸纳获得的能量越多",
    });
  // 灵根吸纳冷却：灵根吸纳能力的冷却时间
  spiritRootCooldown: BasicRangeRandomGrowthAttribute =
    new BasicRangeRandomGrowthAttribute({
      name: "灵根冷却",
      minGrowth: 1,
      maxGrowth: 5,
      minRange: 1,
      maxRange: 10,
      growMinRange: true,
      growCurrentValue: false,
      growthRate: 0.9,
      fixedGrowth: 0,
      other: {
        // 冷却时间单位（秒）
        unit: "秒",
      },
      tips: "灵根吸纳的冷却时间，冷却结束后才能再次吸纳灵根能量",
    });

  /**
   * 构造函数
   * @param options 可选配置项，用于初始化修仙者属性
   */
  constructor(options?: Partial<Cultivator>) {
    // 逐个属性赋值，确保通过setter设置
    if (options) {
      if (options.id !== undefined) this.id = options.id;
      if (options.name !== undefined) this.name = options.name;
      if (options.gender !== undefined) this.gender = options.gender;
      if (options.cultivationMethods !== undefined)
        this.cultivationMethods = options.cultivationMethods;
      // 属性对象需要特殊处理，不能直接赋值
      // 其他属性已经在初始化时创建了实例，不需要重新赋值
    }
  }

  /**
   * 升级
   */
  upgrade(是否强制升级: boolean = false): void {
    if (!this.canUpgrade() && !是否强制升级) {
      return;
    }
    // 升级境界等级
    this.realmLevel.grow();
    // 所有灵根的经验
    this._属性成长();
    // 升级后灵根的经验重置为0
    this.spiritRoots.forEach((spiritRoot: SpiritRootClass) =>
      spiritRoot.spiritValue.setCurrentValue(0)
    );
  }

  _属性成长(): void {
    const spiritRootsExp = this.spiritRoots.map(
      (spiritRoot) => spiritRoot.spiritValue
    );
    // 待升级的属性
    const upgradeAttributes = [
      this.attack,
      this.defense,
      this.qiBlood,
      this.criticalRate,
      this.criticalDamage,
      this.dodgeRate,
      this.spiritPower,
      this.spiritRootAbsorb,
      this.spiritRootCooldown,
      ...spiritRootsExp,
    ];
    // 遍历待升级的属性，成长随机值
    for (const attribute of upgradeAttributes) {
      attribute.grow();
    }
  }

  /**
   * 是否能够升级
   * @returns 是否能够升级
   */
  canUpgrade(): boolean {
    // 所有灵根的经验都满了
    const canUpgrade = this.spiritRoots.every((spiritRoot) =>
      spiritRoot.spiritValue.currentIsOverMax()
    );
    return canUpgrade;
  }

  /**
   * 获取当前修为境界名称
   * 通过等级来获取
   * 凡人 12层（对应1~12级）
   * 练气 12层（对应13~24级）
   * 筑基 12层（对应25~36级）
   * 金丹（分为初期、中期、后期，每个9层）3*9 （对应37~56级）
   * 元婴（分为初期、中期、后期，每个9层）3*9 （对应57~76级）
   * 化神（分为初期、中期、后期、大圆满，每个9层）4*9 （对应77~104级）
   * 炼虚（分为初期、中期、后期、大圆满，每个9层）4*9 （对应105~132级）
   * 合体（分为初期、中期、后期、大圆满，每个9层）4*9 （对应133~160级）
   * 大乘（分为初期、中期、后期、大圆满，每个12层）4*12 （对应161~204级）
   * 渡劫（分为初期、中期、后期、大圆满，每个12层）4*12 （对应205~248级）
   * 成仙（分为初期、中期、后期、大圆满，每个12层）4*12 （对应249~292级）
   * 仙人（每多一级，就多一层）（对应293~）
   * 返回结果：凡人1层、元婴初期8层、仙人1层、仙人999层
   */
  getCultivationLevelName(): string {
    const level = this.realmLevel.currentValue;

    // 查找当前等级对应的境界配置
    const config = realmConfigs.find(
      (config) => level >= config.minLevel && level <= config.maxLevel
    );

    if (config) {
      const { name, minLevel, layerPerStage, stages } = config;
      const innerLevel = level - minLevel + 1;
      let stage = "";
      let layer = innerLevel;

      // 如果有阶段划分，计算阶段和层级
      if (stages.length > 0) {
        const stageIndex = Math.floor((innerLevel - 1) / layerPerStage);
        stage = stages[stageIndex] || "";
        layer = innerLevel - stageIndex * layerPerStage;
      }

      return `${name}${stage}${layer}层`;
    }

    // 默认返回凡人1层（理论上不会走到这里）
    return "凡人1层";
  }

  /**
   * 是否能够突破境界
   * @returns 是否能够突破境界
   */
  canBreakthrough(): boolean {
    // 检查是否可以升级（所有灵根满灵气）
    if (!this.canUpgrade()) {
      return false;
    }

    // 获取当前等级
    const level = this.realmLevel.currentValue;

    // 查找当前等级对应的境界配置
    const config = realmConfigs.find(
      (config) => level >= config.minLevel && level <= config.maxLevel
    );

    if (config) {
      const { maxLevel } = config;
      // 检查是否是境界的最后一层
      return level === maxLevel;
    }

    // 默认返回false（理论上不会走到这里）
    return false;
  }

  /**
   * 突破境界
   * 凡人->练气
   */
  breakthrough(是否强制突破: boolean = false): boolean {
    // 检查是否可以突破
    // 突破概率
    const breakthroughChance = this.breakthroughChance.getCurrentValue();
    const 是否成功突破 = Math.random() < breakthroughChance / 100;
    if (!this.canBreakthrough() && !是否强制突破 && !是否成功突破) {
      return false;
    }
    // 随机成长0~5次
    const 成长次数 = RandomUtils.random.integer(0, 5);
    for (let i = 0; i < 成长次数; i++) {
      this._属性成长();
    }
    this.upgrade(true);
    return true;
  }

  /**
   * 学习功法
   * @param cultivationMethodId 功法ID
   */
  learnCultivationMethod(cultivationMethodId: string): void {
    if (!this.cultivationMethods.includes(cultivationMethodId)) {
      this.cultivationMethods.push(cultivationMethodId);
    }
  }

  /**
   * 使用功法
   * @param cultivationMethodId 功法ID
   */
  useCultivationMethod(cultivationMethodId: string): void {
    if (!this.cultivationMethods.includes(cultivationMethodId)) {
      console.log(`${this.name} 尚未学习 ${cultivationMethodId} 功法`);
      return;
    }
    // 实际使用功法的逻辑
    console.log(`${this.name} 使用了 ${cultivationMethodId} 功法`);
  }

  /**
   * 计算对目标造成的伤害
   * @param target 攻击目标
   * @returns 详细的伤害计算结果
   */
  calculateDamage(target: CultivatorClass): DamageResult {
    // 获取当前攻击力
    const attackValue = this.attack.getCurrentValue();
    // 获取目标防御力
    const defenseValue = target.defense.getCurrentValue();
    // 基础伤害 = 攻击力 - 防御力/2（防御力可以抵消部分伤害）
    const baseDamage = Math.max(1, attackValue - defenseValue / 2);

    // 检查是否触发暴击
    const isCritical =
      Math.random() < this.criticalRate.getCurrentValue() / 100;
    const criticalMultiplier = isCritical
      ? 1 + this.criticalDamage.getCurrentValue() / 100
      : 1;
    // 计算实际伤害
    const actualDamage = Math.floor(baseDamage * criticalMultiplier);
    return {
      attackerName: this.name,
      targetName: target.name,
      baseDamage,
      actualDamage,
      isCritical,
      criticalMultiplier,
      isDodged: false, // 默认值，在takeDamage方法中实际计算
      isDefeated: false, // 默认值，在takeDamage方法中实际计算
      targetRemainingQiBlood: target.qiBlood.currentValue, // 初始剩余气血
    };
  }

  /**
   * 承受伤害
   * @param damageInfo 伤害信息
   * @returns 详细的伤害结果
   */
  takeDamage(damageInfo: DamageResult): DamageResult {
    // 检查是否闪避
    const isDodged = Math.random() < this.dodgeRate.getCurrentValue() / 100;

    if (isDodged) {
      console.log(`${this.name} 闪避了攻击！`);
      return {
        ...damageInfo,
        isDodged: true,
        isDefeated: false,
        targetRemainingQiBlood: this.qiBlood.currentValue,
        actualDamage: 0,
      };
    }

    // 减少气血
    this.qiBlood.currentValue -= damageInfo.actualDamage;

    // 确保气血不会低于0
    if (this.qiBlood.currentValue < 0) {
      this.qiBlood.currentValue = 0;
    }

    // 检查是否被击败
    const isDefeated = !this.isAlive();

    console.log(
      `${this.name} 受到了 ${damageInfo.actualDamage} 点伤害，剩余气血: ${this.qiBlood.currentValue}`
    );

    return {
      ...damageInfo,
      isDodged: false,
      isDefeated,
      targetRemainingQiBlood: this.qiBlood.currentValue,
    };
  }

  /**
   * 攻击目标
   * @param target 攻击目标
   * @returns 详细的攻击结果
   */
  attackTarget(target: CultivatorClass): DamageResult {
    // 计算伤害
    const damageInfo = this.calculateDamage(target);

    // 目标承受伤害
    const damageResult = target.takeDamage(damageInfo);

    // 如果目标被击败
    if (damageResult.isDefeated) {
      console.log(`${target.name} 被击败了！`);
    }

    return damageResult;
  }

  /**
   * 判断是否存活
   * @returns 是否存活
   */
  isAlive(): boolean {
    return this.qiBlood.currentValue > 0;
  }

  /**
   * 恢复气血
   * @param amount 恢复量
   */
  recoverQiBlood(amount: number): void {
    this.qiBlood.setCurrentValue(this.qiBlood.currentValue + amount);
    console.log(
      `${this.name} 恢复了 ${amount} 点气血，当前气血: ${this.qiBlood.currentValue}`
    );
  }

  /**
   * 恢复灵力
   * @param amount 恢复量
   */
  recoverSpiritPower(amount: number): void {
    this.spiritPower.setCurrentValue(this.spiritPower.currentValue + amount);
    console.log(
      `${this.name} 恢复了 ${amount} 点灵力，当前灵力: ${this.spiritPower.currentValue}`
    );
  }

  // 静态方法 随机生成人物
  static 随机生成人物(): CultivatorClass {
    // 随机生成性别
    const gender: Gender = RandomUtils.pickone(["男", "女"]);
    // 随机生成姓名 - 将Gender类型转换为randomCultivatorName需要的类型
    const genderForName = gender === "男" ? "male" : "female";
    const name = RandomUtils.randomCultivatorName(genderForName)[0];
    return new CultivatorClass({
      name: name,
      gender: gender,
    });
  }
}
