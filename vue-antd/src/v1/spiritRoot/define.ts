import type {
  GrowthAttribute,
  RangeGrowthAttribute,
} from "@/v1/growthAttribute/define";

/**
 * 灵根类型枚举
 */
export type SpiritRootType = "金" | "木" | "水" | "火" | "土";

/**
 * 所有灵根类型的数组
 */
export const SPIRIT_ROOT_TYPES: SpiritRootType[] = [
  "金",
  "木",
  "水",
  "火",
  "土",
];

/**
 * 灵根类型对应的颜色
 */
export const SPIRIT_ROOT_COLORS: Record<SpiritRootType, string> = {
  金: "#faad14",
  木: "#52c41a",
  水: "#1890ff",
  火: "#ff4d4f",
  土: "#fa8c16",
};

/**
 * 灵根接口
 * 定义单个灵根的属性
 */
export interface SpiritRoot {
  // 灵根类型
  type: SpiritRootType;
  // 灵根属性值
  attribute: GrowthAttribute;
  // 灵根对应的灵气值
  spiritValue: RangeGrowthAttribute;
}
