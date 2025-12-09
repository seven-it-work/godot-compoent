import type { SpiritRootType, SpiritRoot } from "../spiritRoot/define";
import type { SpiritRootClass } from "../spiritRoot";
import type {
  BasicGrowthAttribute,
  BasicRangeRandomGrowthAttribute,
} from "../growthAttribute/impl";

/**
 * 灵脉接口
 * 定义地点中的灵脉属性
 */
export interface SpiritVein extends SpiritRoot {
  // 灵脉单位时间生产灵气值
  productionRate: BasicRangeRandomGrowthAttribute;
  // 是否活跃
  isActive: boolean;
  // 成长
  grow(): void;
  // 生成灵灵对应的灵气
  generateSpiritValue(): void;
}

export interface Location {
  // 地点唯一标识
  id: string;
  // 地点名称
  name: string;
  // 地点描述
  description: string;
  // 地点类型
  type: LocationType;
  // 地点等级
  level: BasicGrowthAttribute;
  // 地点灵脉
  spiritVeins: SpiritVein[];
}

export interface LocationType {
  // 地点类型名称
  name: string;
  // 地点类型描述
  description: string;
  // icon
  icon: string[];
}

export const LOCATION_TYPES: LocationType[] = [
  {
    name: "火山",
    description: "火山",
    icon: [""],
  },
  {
    name: "平原",
    description: "平原",
    icon: [""],
  },
];
