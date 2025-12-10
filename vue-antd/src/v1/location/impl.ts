import {
  SPIRIT_ROOT_TYPES,
  SpiritRootClass,
  type SpiritRootType,
} from "../spiritRoot";
import {
  BasicGrowthAttribute,
  BasicRangeGrowthAttribute,
  BasicRangeRandomGrowthAttribute,
} from "../growthAttribute/impl";
import RandomUtils from "../utils/RandomUtils";
import type { Location, LocationType, SpiritVein } from "./define";
import { LOCATION_TYPES } from "./define";
import { LOCATION_NAMES, LOCATION_DESCRIPTIONS } from "./config";
import { locationManager } from "./LocationManager";

export class SpiritVeinClass implements SpiritVein {
  // 灵脉类型
  type: SpiritRootType;
  // 灵脉属性值，影响生成量（也是灵脉的等级）
  attribute: BasicGrowthAttribute;
  // 灵脉存储的灵气值
  spiritValue: BasicRangeGrowthAttribute;
  // 单位时间产生的灵气值
  productionRate: BasicRangeRandomGrowthAttribute;
  // 是否活跃，true活跃（可以生成灵气） false不活跃（不能生成灵气）
  isActive: boolean;

  constructor(
    type: SpiritRootType,
    attribute: BasicGrowthAttribute,
    spiritValue: BasicRangeGrowthAttribute,
    productionRate: BasicRangeRandomGrowthAttribute,
    isActive: boolean
  ) {
    this.type = type;
    this.attribute = attribute;
    this.spiritValue = spiritValue;
    this.productionRate = productionRate;
    this.isActive = isActive;
    // 设置默认值
    attribute.tips = `灵脉属性值，影响${type}灵气生成量`;
    spiritValue.tips = `灵脉当前存储的${type}灵气值，当前存储满了可以升级灵脉`;
    productionRate.tips = `灵脉单位时间产生的${type}灵气值`;
  }

  grow(): void {
    this.attribute.grow();
    // 提高灵脉灵气上限
    this.spiritValue.grow();
    // 提高灵脉单位时间产生的灵气值
    this.productionRate.grow();
    // 每次升级重置灵脉灵气值
    this.spiritValue.setCurrentValue(0);
  }

  /**
   * 生成灵灵对应的灵气
   * 每天游戏时间生产一次灵气
   */
  generateSpiritValue(): void {
    const 基数 = this.attribute.getCurrentValue();
    const 每天产生的灵气值 = this.productionRate.getCurrentValue();
    // 计算每天生成的灵气值
    const 生成数量 = 每天产生的灵气值 * 基数;
    const 新的灵气存储 = 生成数量 + this.spiritValue.getCurrentValue();
    // 如果 生成数量+当前灵气值 超过 灵脉灵气上限，那么该灵脉就能自动grow()
    if (新的灵气存储 >= this.spiritValue.maxRange) {
      this.grow();
    } else {
      this.spiritValue.setCurrentValue(新的灵气存储);
    }
  }

  /**
   * 随机生成灵脉
   * @param num 总灵脉值（要分配的灵脉点数）
   * @returns 灵脉数组
   */
  static 随机生成灵脉(num: number = 5): SpiritVeinClass[] {
    // 使用数组存储生成的灵脉对象
    const resultArray: SpiritVeinClass[] = [];
    // 使用Map辅助跟踪已存在的SpiritVeinClass型
    const existingVeins: Map<SpiritRootType, SpiritVeinClass> = new Map();

    // 循环num次，每次随机选择一个灵根类型进行分配
    for (let i = 0; i < num; i++) {
      // 随机选择一个灵根类型
      const randomType = RandomUtils.random.pick(
        SPIRIT_ROOT_TYPES
      ) as SpiritRootType;

      if (existingVeins.has(randomType)) {
        // 如果该SpiritVeinClass型已存在，调用grow()方法增长其属性值
        const vein = existingVeins.get(randomType)!;
        vein.grow();
      } else {
        // 如果该SpiritVeinClass型不存在，创建新的灵脉对象
        const newVein = new SpiritVeinClass(
          randomType,
          new BasicGrowthAttribute({
            name: `${randomType}灵脉属性`,
            currentValue: 0,
            growthRate: 0,
            fixedGrowth: 1,
          }),
          new BasicRangeGrowthAttribute({
            name: `${randomType}灵脉灵气值`,
            minGrowth: 10,
            maxGrowth: 100,
            minRange: 0,
            maxRange: 100,
            growMinRange: false,
            growCurrentValue: false,
            growthRate: 1,
            fixedGrowth: 10,
          }),
          new BasicRangeRandomGrowthAttribute({
            name: `${randomType}灵脉生产速率`,
            minGrowth: 1,
            maxGrowth: 10,
            minRange: 1,
            maxRange: 10,
            growthRate: 1,
            fixedGrowth: 1,
          }),
          RandomUtils.random.bool() // 灵脉初始状态为活跃
        );
        // 新创建的灵脉属性初始值为1（调用一次grow）
        newVein.grow();
        // 添加到结果数组和跟踪Map中
        resultArray.push(newVein);
        existingVeins.set(randomType, newVein);
      }
    }
    resultArray.forEach((vein) => {
      // 非活跃的灵脉，将经验设置最大
      if (!vein.isActive) {
        vein.spiritValue.setCurrentValue(vein.spiritValue.maxRange);
      }
      // 其他灵脉，将经验设置为随机值
      else {
        vein.spiritValue.setCurrentValue(
          RandomUtils.random.integer(0, vein.spiritValue.maxRange)
        );
      }
    });
    return resultArray;
  }
}

/**
 * 地点实现类
 */
export class LocationClass implements Location {
  id: string = RandomUtils.randomId();
  name: string = "";
  description: string = "";
  type: LocationType = RandomUtils.random.pick(LOCATION_TYPES);
  // 地点等级
  level: BasicGrowthAttribute = new BasicGrowthAttribute({
    name: "等级",
    tips: "",
    currentValue: 1,
    growthRate: 1,
  });
  // 地点灵脉
  spiritVeins: SpiritVein[] = SpiritVeinClass.随机生成灵脉();
  // 地图相关属性
  x: number = -1;
  y: number = -1;
  isPassable: boolean = true;
  isSelected: boolean = false;
  isOnPath: boolean = false;

  constructor(options: Partial<Location>) {
    Object.assign(this, options);

    // 如果没有指定灵脉，生成随机灵脉
    if (this.spiritVeins.length === 0) {
      this.spiritVeins = SpiritVeinClass.随机生成灵脉();
    }

    // 将地点实例自动注册到地点管理器
    locationManager.addLocation(this);
  }

  /**
   * 修仙者吸收灵气
   */
  absorbSpiritQi(spiritRoot: SpiritRootClass, value: number): number {
    // 从 spiritRoot.spiritValue 中扣除 value，如果不够返回 剩余的值，否则返回value
    if (spiritRoot.spiritValue.getCurrentValue() >= value) {
      spiritRoot.spiritValue.setCurrentValue(
        spiritRoot.spiritValue.currentValue - value
      );
      return value;
    } else {
      const remainingValue = spiritRoot.spiritValue.getCurrentValue();
      spiritRoot.spiritValue.setCurrentValue(0);
      return remainingValue;
    }
  }

  /**
   * 升级地点
   */
  levelUp() {
    // 升级地点等级
    this.level.grow();
    // 升级地点灵脉
    this.spiritVeins.forEach((spiritVein) => {
      spiritVein.grow();
    });
  }

  static 随机生成地点(num: number = 5): Location {
    const spiritVeins = SpiritVeinClass.随机生成灵脉(num);
    return new LocationClass({
      name: RandomUtils.random.pick(LOCATION_NAMES),
      description: RandomUtils.random.pick(LOCATION_DESCRIPTIONS),
      type: RandomUtils.random.pick(LOCATION_TYPES),
      spiritVeins: spiritVeins,
    });
  }
}
