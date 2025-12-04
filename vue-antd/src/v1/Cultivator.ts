import { BasicGrowthAttribute, BasicRangeGrowthAttribute, BasicRangeRandomGrowthAttribute } from "./GrowthAttribute";
import RandomUtils from "./utils/RandomUtils";

/**
 * 修仙者接口
 * 定义修仙者的基本属性和能力
 */
export interface Cultivator {
    // 唯一标识：用于区分不同的修仙者
    id: string;
    // 名称：修仙者的姓名
    name: string;
    // 攻击力：影响修仙者的物理和法术攻击伤害
    attack: BasicRangeRandomGrowthAttribute;
    // 防御力：减少修仙者受到的物理和法术伤害
    defense: BasicRangeRandomGrowthAttribute;
    // 生命值：修仙者的生命总量，归零则死亡
    health: BasicRangeGrowthAttribute;
    // 灵根数组：修仙者拥有的灵根，影响修炼速度和属性成长
    spiritRoots: SpiritRoot[];
    // 等级：修仙者的当前等级（修为境界），影响各项属性的基础值
    level: BasicGrowthAttribute;
    // 性别：修仙者的性别，影响角色外观和部分剧情
    gender: Gender;
    // 暴击率：攻击时触发暴击的概率
    criticalRate: BasicRangeRandomGrowthAttribute;
    // 暴击伤害：暴击时造成的额外伤害倍率
    criticalDamage: BasicRangeRandomGrowthAttribute;
    // 闪避率：躲避敌人攻击的概率
    dodgeRate: BasicRangeRandomGrowthAttribute;
    // 灵力：用于释放技能和法术的能量，可通过休息恢复
    spiritPower: BasicRangeGrowthAttribute;
    // 技能列表：修仙者已经学会的技能名称集合 （todo 设计技能系统）
    skills: string[];
    // 境界突破概率 最大100%级100
    breakthroughRate: BasicRangeRandomGrowthAttribute;
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


// 定义所有境界的基础配置，不包含minLevel和maxLevel
const realmBaseConfigs: { name: string; layerPerStage: number; stages: string[] }[] = [
    { name: '凡人', layerPerStage: 12, stages: [] },
    { name: '练气', layerPerStage: 12, stages: [] },
    { name: '筑基', layerPerStage: 12, stages: [] },
    { name: '金丹', layerPerStage: 9, stages: ['初期', '中期', '后期'] },
    { name: '元婴', layerPerStage: 9, stages: ['初期', '中期', '后期'] },
    { name: '化神', layerPerStage: 9, stages: ['初期', '中期', '后期', '大圆满'] },
    { name: '炼虚', layerPerStage: 9, stages: ['初期', '中期', '后期', '大圆满'] },
    { name: '合体', layerPerStage: 9, stages: ['初期', '中期', '后期', '大圆满'] },
    { name: '大乘', layerPerStage: 12, stages: ['初期', '中期', '后期', '大圆满'] },
    { name: '渡劫', layerPerStage: 12, stages: ['初期', '中期', '后期', '大圆满'] },
    { name: '成仙', layerPerStage: 12, stages: ['初期', '中期', '后期', '大圆满'] },
    { name: '仙人', layerPerStage: 1, stages: [] }
];

// 自动计算每个境界的minLevel和maxLevel
const realmConfigs: { name: string; minLevel: number; maxLevel: number; layerPerStage: number; stages: string[] }[] = [];

for (let i = 0; i < realmBaseConfigs.length; i++) {
    const baseConfig = realmBaseConfigs[i]!; // 断言baseConfig不是undefined
    const config: { name: string; minLevel: number; maxLevel: number; layerPerStage: number; stages: string[] } = {
        name: baseConfig.name,
        minLevel: 1,
        maxLevel: baseConfig.layerPerStage,
        layerPerStage: baseConfig.layerPerStage,
        stages: baseConfig.stages
    };
    
    if (i > 0) {
        const prevConfig = realmConfigs[i - 1]!; // 断言prevConfig不是undefined
        config.minLevel = prevConfig.maxLevel + 1;
        config.maxLevel = config.minLevel + baseConfig.layerPerStage - 1;
    }
    
    realmConfigs.push(config);
}

// 最后一个境界（仙人）的maxLevel设置为Infinity
if (realmConfigs.length > 0) {
    const lastConfig = realmConfigs[realmConfigs.length - 1]!; // 断言lastConfig不是undefined
    lastConfig.maxLevel = Infinity;
}

/**
 * 修仙者类
 * 实现修仙者接口，提供修仙者的基本属性和能力
 */
export class CultivatorClass implements Cultivator {
    // 唯一标识：自动生成的全局唯一ID，用于区分不同的修仙者
    id: string = RandomUtils.randomId();
    // 名称：修仙者的姓名，用于显示和标识
    name: string = "";
    // 攻击力：影响修仙者的物理和法术攻击伤害数值，值越高造成的伤害越大
    attack: BasicRangeRandomGrowthAttribute = new BasicRangeRandomGrowthAttribute({
        name: "攻击力",
        minGrowth: 10,
        maxGrowth: 20,
        growthRate: 1.2,
        fixedGrowth: 0,
    });
    // 防御力：减少修仙者受到的物理和法术伤害，值越高受到的伤害越少
    defense: BasicRangeRandomGrowthAttribute = new BasicRangeRandomGrowthAttribute({
        name: "防御力",
        minGrowth: 5,
        maxGrowth: 10,
        growthRate: 1.2,
        fixedGrowth: 0,
    });
    // 生命值：修仙者的生命总量，当生命值降至0时，修仙者死亡
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
    // 灵根数组：修仙者拥有的灵根，每种灵根对应不同的元素属性，影响修炼速度和属性成长
    spiritRoots: SpiritRootClass[] = SpiritRootClass.随机生成灵根(5);
    // 等级：修仙者的当前等级，影响各项属性的基础值和成长潜力
    level: BasicGrowthAttribute = new BasicGrowthAttribute({
        name: "等级",
        growthRate: 0,
        fixedGrowth: 1,
    });
    // 性别：修仙者的性别，影响角色外观表现和部分剧情发展
    gender: Gender = "男";
    // 暴击率：攻击时触发暴击的概率百分比，值越高越容易造成暴击伤害
    criticalRate: BasicRangeRandomGrowthAttribute = new BasicRangeRandomGrowthAttribute({
        name: "暴击率",
        minGrowth: 1,
        maxGrowth: 3,
        growthRate: 1.1,
        fixedGrowth: 0,
    });
    // 暴击伤害：暴击时造成的额外伤害倍率，在基础伤害上附加此百分比的额外伤害
    criticalDamage: BasicRangeRandomGrowthAttribute = new BasicRangeRandomGrowthAttribute({
        name: "暴击伤害",
        minGrowth: 10,
        maxGrowth: 20,
        growthRate: 1.1,
        fixedGrowth: 0,
    });
    // 闪避率：躲避敌人攻击的概率百分比，值越高越容易躲避敌人的攻击
    dodgeRate: BasicRangeRandomGrowthAttribute = new BasicRangeRandomGrowthAttribute({
        name: "闪避率",
        minGrowth: 1,
        maxGrowth: 3,
        growthRate: 1.1,
        fixedGrowth: 0,
    });
    // 灵力：用于释放技能和法术的能量资源，消耗后可通过休息或使用道具恢复
    spiritPower: BasicRangeGrowthAttribute = new BasicRangeGrowthAttribute({
        name: "灵力",
        minGrowth: 0,
        maxGrowth: 50,
        minRange: 0,
        maxRange: 50,
        growMinRange: false,
        growCurrentValue: false,
        growthRate: 1,
        fixedGrowth: 0,
    });
    // 技能列表：修仙者已经学会的技能名称集合，可在战斗或修炼中使用
    skills: string[] = [];
    // 境界突破概率 最大100%级100
    breakthroughRate: BasicRangeRandomGrowthAttribute = new BasicRangeRandomGrowthAttribute({
        name: "境界突破概率",
        minGrowth: 0,
        maxGrowth: 0,
        minRange: 0,
        maxRange: 10,
        growMinRange: true,
        growCurrentValue: false,
        growthRate: 0,
        fixedGrowth: 0,
    });

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
    upgrade(是否强制升级: boolean = false): void {
        if (!this.canUpgrade() && !是否强制升级) {
            return;
        }
        // 升级等级
        this.level.grow();
        // 所有灵根的经验
        this._属性成长();
        // 升级后灵根的经验重置为0
        this.spiritRoots.forEach((spiritRoot: SpiritRootClass) => spiritRoot.spiritValue.setCurrentValue(0));
    }

    _属性成长():void{
        const spiritRootsExp = this.spiritRoots.map((spiritRoot) => spiritRoot.spiritValue);
        // 待升级的属性
        const upgradeAttributes = [this.attack, this.defense, this.health, this.criticalRate, this.criticalDamage, 
                                this.dodgeRate, this.spiritPower, ...spiritRootsExp];
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
        const canUpgrade = this.spiritRoots.every((spiritRoot) => spiritRoot.spiritValue.currentIsOverMax());
        return canUpgrade;
    }

    /**
     * 获取当前修为境界名称
     * 通过等级来获取
     * 凡人 12层（对应1~12级）
     * 练气 12层（对应13~24级）
     * 筑基 12层（对应25~36级）
     * 金丹（分为初期、中期、后期，每个9层）3*9 （对应37~56级）
     * 元婴（分为初期、中期、后期，每个9层）3*9 （对应57~76级）
     * 化神（分为初期、中期、后期、大圆满，每个9层）4*9 （对应77~104级）
     * 炼虚（分为初期、中期、后期、大圆满，每个9层）4*9 （对应105~132级）
     * 合体（分为初期、中期、后期、大圆满，每个9层）4*9 （对应133~160级）
     * 大乘（分为初期、中期、后期、大圆满，每个12层）4*12 （对应161~204级）
     * 渡劫（分为初期、中期、后期、大圆满，每个12层）4*12 （对应205~248级）
     * 成仙（分为初期、中期、后期、大圆满，每个12层）4*12 （对应249~292级）
     * 仙人（每多一级，就多一层）（对应293~）
     * 返回结果：凡人1层、元婴初期8层、仙人1层、仙人999层
     */
    getCultivationLevelName(): string {
        const level = this.level.currentValue;
        
        // 查找当前等级对应的境界配置
        const config = realmConfigs.find((config) => level >= config.minLevel && level <= config.maxLevel);
        
        if (config) {
            const { name, minLevel, layerPerStage, stages } = config;
            const innerLevel = level - minLevel + 1;
            let stage = '';
            let layer = innerLevel;
            
            // 如果有阶段划分，计算阶段和层级
            if (stages.length > 0) {
                const stageIndex = Math.floor((innerLevel - 1) / layerPerStage);
                stage = stages[stageIndex] || '';
                layer = innerLevel - stageIndex * layerPerStage;
            }
            
            return `${name}${stage}${layer}层`;
        }
        
        // 默认返回凡人1层（理论上不会走到这里）
        return '凡人1层';
    }

    /**
     * 是否能够突破境界
     * @returns 是否能够突破境界
     */
    canBreakthrough(): boolean {
        // 检查是否可以升级（所有灵根满灵气）
        if (!this.canUpgrade()) {
            return false;
        }
        
        // 获取当前等级
        const level = this.level.currentValue;
        
        // 查找当前等级对应的境界配置
        const config = realmConfigs.find((config) => level >= config.minLevel && level <= config.maxLevel);
        
        if (config) {
            const { maxLevel } = config;
            // 检查是否是境界的最后一层
            return level === maxLevel;
        }
        
        // 默认返回false（理论上不会走到这里）
        return false;
    }

    /**
     * 突破境界
     * 凡人->练气
     */
    breakthrough(是否强制突破: boolean = false): boolean {
        // 检查是否可以突破
        // 突破概率
        const breakthroughRate = this.breakthroughRate.getCurrentValue();
        const 是否成功突破 = Math.random() < breakthroughRate/100;
        if (!this.canBreakthrough() && !是否强制突破 && !是否成功突破) {
            return false;
        }
        // 随机成长0~5次
        const 成长次数 = RandomUtils.random.integer(0, 5);
        for (let i = 0; i < 成长次数; i++) {
            this._属性成长();
        }
        this.upgrade(true);
        return true;
    }

    /**
     * 学习技能
     */
    learnSkill(skillName: string): void {
        if (!this.skills.includes(skillName)) {
            this.skills.push(skillName);
        }
    }

    /**
     * 使用技能
     */
    useSkill(skillName: string, cost: number): boolean {
        if (this.skills.includes(skillName) && this.spiritPower.currentValue >= cost) {
            this.spiritPower.currentValue -= cost;
            return true;
        }
        return false;
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