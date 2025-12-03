import type { SpiritRootClass } from "./Cultivator";
export interface 地点 {
    // 地点唯一标识
    id: string;
    // 地点名称
    name: string;
    // 地点描述
    description: string;
    // 地点类型
    type: 地点类型;
    // 地点灵根分布
    spiritDistribution: SpiritRootClass[];
}

export interface 地点类型 {
    // 地点类型名称
    name: string;
    // 地点类型描述
    description: string;
    // icon
    icon: string[];
}