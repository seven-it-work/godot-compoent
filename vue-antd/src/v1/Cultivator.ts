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
     * 随机生成灵根
     * @param num 总灵根值
     * @returns 灵根Map，键为灵根类型，值为灵根对象
     */
    static 随机生成灵根(num: number): Record<SpiritRootType, SpiritRootClass | undefined> {
        // 使用Record类型定义灵根Map，值可以是灵根对象或undefined
        const resultMap: Record<SpiritRootType, SpiritRootClass | undefined> = {} as Record<SpiritRootType, SpiritRootClass | undefined>;
        
        // 随机生成灵根值分配策略
        // 策略1：随机选择一个灵根类型，将所有值分配给它
        // 策略2：随机选择多个灵根类型，将值分配给它们
        // 策略3：为所有灵根类型分配相等或接近相等的值
        
        // 随机选择分配策略
        const strategy = RandomUtils.random.integer(1, 3);
        
        if (strategy === 1) {
            // 策略1：只初始化一个灵根类型，分配所有值
            const selectedType = RandomUtils.random.pickone(SPIRIT_ROOT_TYPES) as SpiritRootType;
            resultMap[selectedType] = new SpiritRootClass(selectedType,
                new BasicGrowthAttribute({ name: `${selectedType}属性`, currentValue: 0, growthRate: 0, fixedGrowth: 1 }),
                new BasicRangeGrowthAttribute({
                    name: `${selectedType}灵气值`,
                    minGrowth: num,
                    maxGrowth: num,
                    minRange: num,
                    maxRange: num,
                    growMinRange: false,
                    growCurrentValue: false,
                    growthRate: 1,
                    fixedGrowth: 0
                })
            );
        } else if (strategy === 2) {
            // 策略2：随机选择多个灵根类型，分配值
            const selectedTypes = new Set<SpiritRootType>();
            
            // 随机选择1-5个灵根类型
            const numOfTypes = RandomUtils.random.integer(1, 5);
            while (selectedTypes.size < numOfTypes) {
                selectedTypes.add(RandomUtils.random.pickone(SPIRIT_ROOT_TYPES) as SpiritRootType);
            }
            
            // 将num个值随机分配给选中的灵根类型
            for (let i = 0; i < num; i++) {
                const randomType = RandomUtils.random.pickone(Array.from(selectedTypes)) as SpiritRootType;
                
                if (!resultMap[randomType]) {
                    // 初始化灵根对象
                    resultMap[randomType] = new SpiritRootClass(randomType,
                        new BasicGrowthAttribute({ name: `${randomType}属性`, currentValue: 0, growthRate: 0, fixedGrowth: 1 }),
                        new BasicRangeGrowthAttribute({
                            name: `${randomType}灵气值`,
                            minGrowth: 1,
                            maxGrowth: 1,
                            minRange: 0,
                            maxRange: 0,
                            growMinRange: false,
                            growCurrentValue: false,
                            growthRate: 1,
                            fixedGrowth: 0
                        })
                    );
                }
                
                // 增长灵根值
                resultMap[randomType]!.spiritValue.grow();
            }
        } else {
            // 策略3：为所有灵根类型分配相等或接近相等的值
            const avgValue = Math.floor(num / SPIRIT_ROOT_TYPES.length);
            let remainder = num % SPIRIT_ROOT_TYPES.length;
            
            for (const type of SPIRIT_ROOT_TYPES) {
                // 计算当前灵根的初始值
                let initialValue = avgValue;
                if (remainder > 0) {
                    initialValue += 1;
                    remainder -= 1;
                }
                
                // 初始化灵根对象
                resultMap[type] = new SpiritRootClass(type,
                    new BasicGrowthAttribute({ name: `${type}属性`, currentValue: 0, growthRate: 0, fixedGrowth: 1 }),
                    new BasicRangeGrowthAttribute({
                        name: `${type}灵气值`,
                        minGrowth: initialValue,
                        maxGrowth: initialValue,
                        minRange: initialValue,
                        maxRange: initialValue,
                        growMinRange: false,
                        growCurrentValue: false,
                        growthRate: 1,
                        fixedGrowth: 0
                    })
                );
            }
        }
        
        return resultMap;
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
    spiritRoots: SpiritRoot[] = [];
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
        // 合并默认选项和传入选项
        const mergedOptions = options || {};
        // 初始化灵根数组
        mergedOptions.spiritRoots = [];
        // 遍历所有灵根类型，创建灵根对象
        for (const spiritRootType of SPIRIT_ROOT_TYPES) {
            // 创建一个新的灵根对象
            const spiritRoot: SpiritRoot = {
                name: spiritRootType,
                attribute: new BasicGrowthAttribute({
                    name: `${spiritRootType}属性`,
                    currentValue: 0,
                    growthRate: 0,
                    fixedGrowth: 1,
                }),
                spiritValue: new BasicRangeGrowthAttribute({
                    name: `${spiritRootType}灵气值`,
                    minGrowth: 10,
                    maxGrowth: 100,
                    minRange: 0,
                    maxRange: 100,
                    growMinRange: false,
                    growCurrentValue: false,
                    growthRate: 1,
                    fixedGrowth: 0,
                }),
            };
            // 将新的灵根对象添加到灵根数组中
            mergedOptions.spiritRoots.push(spiritRoot);
        }

        // 使用合并后的选项初始化对象
        Object.assign(this, mergedOptions);
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
        // 所有灵根的经验是否大于等于100
        const canUpgrade = this.spiritRoots.every((spiritRoot) => spiritRoot.spiritValue.getCurrentValue() >= 100);
        return canUpgrade;
    }
}