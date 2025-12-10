import {
  BasicGrowthAttribute,
  BasicRangeGrowthAttribute,
} from "@/v1/growthAttribute/impl";
import RandomUtils from "@/v1/utils/RandomUtils";
import {
  SPIRIT_ROOT_TYPES,
  type SpiritRoot,
  type SpiritRootType,
} from "./define";

export class SpiritRootClass implements SpiritRoot {
  // 灵根类型
  type: SpiritRootType;
  // 灵根属性值
  attribute: BasicGrowthAttribute;
  // 灵根对应的灵气值
  spiritValue: BasicRangeGrowthAttribute;
  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(
    type: SpiritRootType,
    attribute: BasicGrowthAttribute,
    spiritValue: BasicRangeGrowthAttribute
  ) {
    this.type = type;
    this.attribute = attribute;
    this.spiritValue = spiritValue;
  }

  /**
   * 随机生成灵根
   * @param num 总灵根值（要分配的灵根点数）
   * @returns 灵根数组
   */
  static generateRandomSpiritRoots(num: number = 5): SpiritRootClass[] {
    // 使用数组存储生成的灵根对象
    const resultArray: SpiritRootClass[] = [];
    // 使用Map辅助跟踪已存在的灵根类型
    const existingRoots: Map<SpiritRootType, SpiritRootClass> = new Map();

    // 循环num次，每次随机选择一个灵根类型进行分配
    for (let i = 0; i < num; i++) {
      // 随机选择一个灵根类型
      const randomType = RandomUtils.pickone(
        SPIRIT_ROOT_TYPES
      ) as SpiritRootType;

      if (existingRoots.has(randomType)) {
        // 如果该灵根已存在，调用grow()方法增长
        const root = existingRoots.get(randomType)!;
        root.attribute.grow();
      } else {
        // 如果该灵根不存在，创建新的灵根对象
        const newRoot = new SpiritRootClass(
          randomType,
          new BasicGrowthAttribute({
            name: `${randomType}属性`,
            currentValue: 0,
            growthRate: 0,
            fixedGrowth: 1,
          }),
          new BasicRangeGrowthAttribute({
            name: `${randomType}灵气值`,
            minGrowth: 10,
            maxGrowth: 100,
            minRange: 0,
            maxRange: 100,
            growMinRange: false,
            growCurrentValue: false,
            growthRate: 1,
            fixedGrowth: 10,
          })
        );
        // 新创建的灵根初始值为1（调用一次grow）
        newRoot.attribute.grow();
        // 添加到结果数组和跟踪Map中
        resultArray.push(newRoot);
        existingRoots.set(randomType, newRoot);
      }
    }
    return resultArray;
  }
}
