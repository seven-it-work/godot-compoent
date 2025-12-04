import type { GrowthAttribute, RangeGrowthAttribute } from "@/v1/growthAttribute/define";

/**
 * 灵根类型枚举
 */
export type SpiritRootType = "金" | "木" | "水" | "火" | "土";

/**
 * 所有灵根类型的数组
 */
export const SPIRIT_ROOT_TYPES: SpiritRootType[] = ["金", "木", "水", "火", "土"];

/**
 * 灵根接口
 * 定义单个灵根的属性
 */
export interface SpiritRoot {
    // 灵根名称
    name: string;
    // 灵根属性值
    attribute: GrowthAttribute;
    // 灵根对应的灵气值
    spiritValue: RangeGrowthAttribute;
}
