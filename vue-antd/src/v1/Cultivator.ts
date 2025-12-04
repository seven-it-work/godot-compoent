import { BasicGrowthAttribute, BasicRangeGrowthAttribute, BasicRangeRandomGrowthAttribute } from "./GrowthAttribute";
import RandomUtils from "./utils/RandomUtils";

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
    spiritRoots: SpiritRoot[];
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

export class SpiritRootClass implements SpiritRoot {
    // 灵根名称
    name: string;
    // 灵根属性值
    attribute: BasicGrowthAttribute;
    // 灵根对应的灵气值
    spiritValue: BasicRangeGrowthAttribute;
    /**
     * 构造函数
     * @param options 配置选项
     */
    constructor(name: string, attribute: BasicGrowthAttribute, spiritValue: BasicRangeGrowthAttribute) {
        this.name = name;
        this.attribute = attribute;
        this.spiritValue = spiritValue;
    }

    /**
     * 是否满灵气
     */
    isFullSpirit(): boolean {
        return this.spiritValue.currentIsOverMax();
    }

    /**
     * 随机生成灵根
     * @param num 总灵根值（要分配的灵根点数）
     * @returns 灵根数组
     */
    static 随机生成灵根(num: number): SpiritRootClass[] {
        // 使用数组存储生成的灵根对象
        const resultArray: SpiritRootClass[] = [];
        // 使用Map辅助跟踪已存在的灵根类型
        const existingRoots: Map<SpiritRootType, SpiritRootClass> = new Map();
        
        // 循环num次，每次随机选择一个灵根类型进行分配
        for (let i = 0; i < num; i++) {
            // 随机选择一个灵根类型
            const randomType = RandomUtils.random.pickone(SPIRIT_ROOT_TYPES) as SpiritRootType;
            
            if (existingRoots.has(randomType)) {
                // 如果该灵根已存在，调用grow()方法增长
                const root = existingRoots.get(randomType)!;
                root.spiritValue.grow();
            } else {
                // 如果该灵根不存在，创建新的灵根对象
                const newRoot = new SpiritRootClass(randomType,
                    new BasicGrowthAttribute({ 
                        name: `${randomType}属性`, 
                        currentValue: 0, 
                        growthRate: 0, 
                        fixedGrowth: 1 
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
                        fixedGrowth: 10
                    })
                );
                // 新创建的灵根初始值为1（调用一次grow）
                newRoot.spiritValue.grow();
                // 添加到结果数组和跟踪Map中
                resultArray.push(newRoot);
                existingRoots.set(randomType, newRoot);
            }
        }
        return resultArray;
    }
}

/**
 * 灵根类型枚举
 */
export type SpiritRootType = "金" | "木" | "水" | "火" | "土";

/**
 * 所有灵根类型的数组
 */
export const SPIRIT_ROOT_TYPES: SpiritRootType[] = ["金", "木", "水", "火", "土"];

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
    // 灵根经验数组
    spiritRoots: SpiritRootClass[] = SpiritRootClass.随机生成灵根(5);
    // 等级
    level: BasicGrowthAttribute = new BasicGrowthAttribute({
        name: "等级",
        growthRate: 0,
        fixedGrowth: 1,
    });
    // 性别，默认男性
    gender: Gender = "男";

    /**
     * 构造函数
     * @param options 可选配置项，用于初始化修仙者属性
     */
    constructor(options?: Partial<Cultivator>) {
        // 使用合并后的选项初始化对象
        Object.assign(this, options);
    }

    /**
     * 升级
     */
    upgrade(): void {
        // 升级等级
        this.level.grow();
        // 所有灵根的经验
        const spiritRootsExp = this.spiritRoots.map((spiritRoot) => spiritRoot.spiritValue);
        // 待升级的属性
        const upgradeAttributes = [this.attack, this.defense, this.health, ...spiritRootsExp];
        // 遍历待升级的属性，成长随机值
        for (const attribute of upgradeAttributes) {
            attribute.grow();
        }
    }

    /**
     * 是否能够升级
     * @returns 是否能够升级
     */
    canUpgrade(): boolean {
        // 所有灵根的经验都满了
        const canUpgrade = this.spiritRoots.every((spiritRoot) => spiritRoot.isFullSpirit());
        return canUpgrade;
    }

    // 静态方法 随机生成人物
    static 随机生成人物(): CultivatorClass {
        // 随机生成性别
        const gender = RandomUtils.random.pickone(["男", "女"]);
        // 随机生成姓名
        const name = RandomUtils.randomCultivatorName(gender)[0];
        return new CultivatorClass({
            name: name,
            gender: gender,
        });
    }
}