// 成长体系基础类

// 基础成长类
class BaseGrowth {
  protected currentValue: number;
  protected minGrowth: number;
  protected maxGrowth: number;
  protected growthMultiplier: number;

  constructor(
    currentValue: number,
    minGrowth: number,
    maxGrowth: number,
    growthMultiplier: number = 1
  ) {
    this.currentValue = currentValue;
    this.minGrowth = minGrowth;
    this.maxGrowth = maxGrowth;
    this.growthMultiplier = growthMultiplier;
  }

  // 生成随机成长值
  protected generateGrowthValue(): number {
    const randomValue =
      Math.random() * (this.maxGrowth - this.minGrowth) + this.minGrowth;
    return randomValue * this.growthMultiplier;
  }

  // 成长方法
  grow(): number {
    const growthValue = this.generateGrowthValue();
    this.currentValue += growthValue;
    return this.currentValue;
  }

  // 获取当前值
  getCurrentValue(): number {
    return this.currentValue;
  }

  // 设置当前值
  setCurrentValue(value: number): void {
    this.currentValue = value;
  }

  // 获取最小值
  getMinGrowth(): number {
    return this.minGrowth;
  }

  // 获取最大值
  getMaxGrowth(): number {
    return this.maxGrowth;
  }

  // 获取成长倍率
  getGrowthMultiplier(): number {
    return this.growthMultiplier;
  }
}

// 范围成长类
class RangeGrowth extends BaseGrowth {
  protected minValue: number;
  protected maxValue: number;
  protected growCurrentValue: boolean;
  protected growMinValue: boolean;

  constructor(
    currentValue: number,
    minGrowth: number,
    maxGrowth: number,
    minValue: number,
    maxValue: number,
    growCurrentValue: boolean = false,
    growMinValue: boolean = false,
    growthMultiplier: number = 1
  ) {
    super(currentValue, minGrowth, maxGrowth, growthMultiplier);
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.growCurrentValue = growCurrentValue;
    this.growMinValue = growMinValue;
  }

  // 重写成长方法
  grow(): number {
    if (this.growCurrentValue) {
      // 如果成长当前值，调用父类方法
      const newValue = super.grow();
      // 确保当前值在范围内
      this.currentValue = Math.max(
        this.minValue,
        Math.min(this.maxValue, newValue)
      );
      return this.currentValue;
    } else if (this.growMinValue) {
      // 如果成长最小值和最大值
      const growthValue = this.generateGrowthValue();

      // 生成最小值的成长值，确保不超过最大值
      const minAdd = Math.random() * (growthValue / 2);
      const maxAdd = growthValue - minAdd;

      // 更新最小值和最大值
      this.minValue += minAdd;
      this.maxValue += maxAdd;

      // 确保最小值不超过最大值
      if (this.minValue > this.maxValue) {
        const temp = this.minValue;
        this.minValue = this.maxValue;
        this.maxValue = temp;
      }

      return this.maxValue;
    }

    return this.currentValue;
  }

  // 获取最小值
  getMinValue(): number {
    return this.minValue;
  }

  // 获取最大值
  getMaxValue(): number {
    return this.maxValue;
  }

  // 设置最小值
  setMinValue(value: number): void {
    this.minValue = value;
  }

  // 设置最大值
  setMaxValue(value: number): void {
    this.maxValue = value;
  }
}

// 随机范围成长类
class RandomRangeGrowth extends RangeGrowth {
  // 重写获取当前值方法，返回随机值
  getCurrentValue(): number {
    return Math.random() * (this.maxValue - this.minValue) + this.minValue;
  }

  // 重写成长方法，确保随机范围的成长
  grow(): number {
    // 调用父类的成长方法，成长最小值和最大值
    super.grow();
    // 返回新的最大值
    return this.maxValue;
  }
}

// 导出类
export { BaseGrowth, RangeGrowth, RandomRangeGrowth };

// 导出类型
export type {
  BaseGrowth as BaseGrowthType,
  RangeGrowth as RangeGrowthType,
  RandomRangeGrowth as RandomRangeGrowthType,
};
