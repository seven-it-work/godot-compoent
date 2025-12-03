import { BasicGrowthAttribute, BasicRangeGrowthAttribute, BasicRangeRandomGrowthAttribute } from "./GrowthAttribute";
import RandomUtils from "./RandomUtils";

/**
 * 修仙者接口
 * 定义修仙者的基本属性和能力
 */
export interface Cultivator {
    // 唯一标识
    id: string;
    // 名称
    name: string;
    // 攻击力
    attack: BasicRangeRandomGrowthAttribute;
    // 防御力
    defense: BasicRangeRandomGrowthAttribute;
    // 生命值
    health: BasicRangeGrowthAttribute;
    // 灵根数组
    spiritRoots: BasicGrowthAttribute[];
    // 等级
    level: BasicGrowthAttribute;
    // 性别
    gender: Gender;
}

/**
 * 灵根接口
 * 定义单个灵根的属性
 */
export interface SpiritRoot {
    // 灵根名称
    name: string;
    // 灵根属性值
    attribute: BasicGrowthAttribute;
    // 灵根对应的灵气值
    spiritValue: BasicRangeGrowthAttribute;
}

/**
 * 灵根类型枚举
 */
export type SpiritRootType = "金" | "木" | "水" | "火" | "土";

/**
 * 性别类型枚举
 */
export type Gender = "男" | "女" | "未知";

/**
 * 修仙者类
 * 实现修仙者接口，提供修仙者的基本属性和能力
 */
export class CultivatorClass implements Cultivator {
    // 唯一标识，自动生成
    id: string = RandomUtils.randomId();
    // 名称
    name: string = "";
    // 攻击力
    attack: BasicRangeRandomGrowthAttribute = new BasicRangeRandomGrowthAttribute({
        name: "攻击力",
        minGrowth: 10,
        maxGrowth: 20,
        growthRate: 1.2,
        fixedGrowth: 0,
    });
    // 防御力
    defense: BasicRangeRandomGrowthAttribute = new BasicRangeRandomGrowthAttribute({
        name: "防御力",
        minGrowth: 5,
        maxGrowth: 10,
        growthRate: 1.2,
        fixedGrowth: 0,
    });
    // 生命值
    health: BasicRangeGrowthAttribute = new BasicRangeGrowthAttribute({
        name: "生命值",
        minGrowth: 0,
        maxGrowth: 100,
        minRange: 0,
        maxRange: 100,
        growMinRange: false,
        growCurrentValue: false,
        growthRate: 1,
        fixedGrowth: 0,
    });
    // 灵根数组
    spiritRoots: BasicRangeGrowthAttribute[] = [
        new BasicRangeGrowthAttribute({
            name: "金灵根",
            growthRate: 0,
            fixedGrowth: 1,
        }),
        new BasicRangeGrowthAttribute({
            name: "木灵根",
            growthRate: 0,
            fixedGrowth: 1,
        }),
        new BasicRangeGrowthAttribute({
            name: "水灵根",
            growthRate: 0,
            fixedGrowth: 1,
        }),
        new BasicRangeGrowthAttribute({
            name: "火灵根",
            growthRate: 0,
            fixedGrowth: 1,
        }),
        new BasicRangeGrowthAttribute({
            name: "土灵根",
            growthRate: 0,
            fixedGrowth: 1,
        }),
    ];;
    // 等级
    level: BasicGrowthAttribute = new BasicGrowthAttribute({
        name: "等级",
        growthRate: 0,
        fixedGrowth: 1,
    });;
    // 性别，默认男性
    gender: Gender = "男";

    /**
     * 构造函数
     * @param options 可选配置项，用于初始化修仙者属性
     */
    constructor(options?: Partial<Cultivator>) {
        Object.assign(this, options);
    }
}