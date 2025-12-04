import { SpiritRootClass } from "./spiritRoot";
import { BasicGrowthAttribute } from "./growthAttribute/impl";
import RandomUtils from "./utils/RandomUtils";
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
    // 地点等级
    level: BasicGrowthAttribute;
}

export interface 地点类型 {
    // 地点类型名称
    name: string;
    // 地点类型描述
    description: string;
    // icon
    icon: string[];
}

export const 地点类型列表:地点类型[]=[
    {
        name:"火山",
        description:"火山",
        icon:[""]
    },
    {
        name:"平原",
        description:"平原",
        icon:[""]
    },
]

export class 地点类 implements 地点 {
    id: string=RandomUtils.randomId();
    name: string="";
    description: string="";
    type: 地点类型=RandomUtils.random.pick(地点类型列表);
    spiritDistribution: SpiritRootClass[]=SpiritRootClass.随机生成灵根();
    // 地点等级
    level: BasicGrowthAttribute=new BasicGrowthAttribute({
        name:"等级",
        currentValue:1,
        growthRate:1,
    });

    constructor(options: Partial<地点>) {
        Object.assign(this, options);
    }

    升级(){
    }
}