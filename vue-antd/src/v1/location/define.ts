import type { SpiritRoot } from "@/v1/spiritRoot";
import type { Cultivator } from "@/v1/cultivator/define";
import type {
  BasicGrowthAttribute,
  BasicRangeRandomGrowthAttribute,
} from "@/v1/growthAttribute";

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
  /**
   * 生成对应的灵气
   * 每天游戏时间生产一次灵气
   */
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
  // 地点怪物列表
  monsters: Cultivator[];
  // 地图相关属性
  // 格子坐标X
  x: number;
  // 格子坐标Y
  y: number;
  // 是否可通行
  isPassable?: boolean;
  // 是否被选中
  isSelected?: boolean;
  // 是否在路径上
  isOnPath?: boolean;
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
