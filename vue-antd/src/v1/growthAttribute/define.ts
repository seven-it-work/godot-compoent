// 成长属性接口
export interface GrowthAttribute {
  // 属性名称
  name: string;
  // 最小成长值
  minGrowth: number;
  // 最大成长值
  maxGrowth: number;
  // 成长倍率
  growthRate?: number;
  // 固定成长值
  fixedGrowth?: number;
  // 当前值
  currentValue: number;
  // 其他属性
  other?: Record<string, any>;
  // 成长方法
  grow(): void;
  // 获取成长随机值
  getGrowthRandom(): number;
  // 获取当前值
  getCurrentValue(): number;
  // tips 提示
  tips: string;
}

/**
 * 范围成长属性接口
 * 继承自基础成长属性接口，增加了范围相关的属性
 */
export interface RangeGrowthAttribute extends GrowthAttribute {
  // 最小范围值
  minRange: number;
  // 最大范围值
  maxRange: number;
  // 是否成长最小范围值
  growMinRange?: boolean;
  // 是否成长当前值
  growCurrentValue?: boolean;
}
