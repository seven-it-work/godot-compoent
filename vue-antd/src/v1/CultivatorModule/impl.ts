import type { Cultivator, Gender } from "@/v1/cultivator/define";
import RandomUtils from "@/v1/utils/RandomUtils";
import { SpiritRootClass } from "@/v1/spiritRoot";
import type { SpiritRoot } from "@/v1/spiritRoot";
import { BasicGrowthAttribute, BasicRangeGrowthAttribute, BasicRangeRandomGrowthAttribute } from "@/v1/growthAttribute/impl";

/**
 * 修仙者类实现
 */
export class CultivatorClass implements Cultivator {
    // 实现接口定义的所有属性
    id: string;
    name: string;
    attack: BasicRangeRandomGrowthAttribute;
    defense: BasicRangeRandomGrowthAttribute;
    qiBlood: BasicRangeGrowthAttribute;
    spiritRoots: SpiritRoot[];
    realmLevel: BasicGrowthAttribute;
    gender: Gender;
    criticalRate: BasicRangeRandomGrowthAttribute;
    criticalDamage: BasicRangeGrowthAttribute;
    dodgeRate: BasicRangeRandomGrowthAttribute;
    spiritPower: BasicRangeGrowthAttribute;
    cultivationMethods: string[];
    breakthroughChance: BasicRangeRandomGrowthAttribute;

    /**
     * 构造函数
     * @param name 修仙者名称
     * @param gender 性别
     * @param realmLevel 初始境界等级
     */
    constructor(name: string, gender: Gender, realmLevel: number = 1) {
        // 生成唯一ID
        this.id = `cultivator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // 设置名称
        this.name = name;
        // 设置性别
        this.gender = gender;
        // 设置初始境界等级
        this.realmLevel = new BasicGrowthAttribute({
            name: "境界等级",
            currentValue: realmLevel,
            growthRate: 0,
            fixedGrowth: 1
        });
        // 初始化修仙者的各种属性，根据境界等级设置基础值
        this.attack = new BasicRangeRandomGrowthAttribute({
            name: "攻击力",
            minGrowth: realmLevel * 2,
            maxGrowth: realmLevel * 5,
            minRange: realmLevel * 10,
            maxRange: realmLevel * 15,
            currentValue: realmLevel * 10 + Math.floor(Math.random() * (realmLevel * 5 + 1)),
            growthRate: 1.5,
            fixedGrowth: 0
        });
        this.defense = new BasicRangeRandomGrowthAttribute({
            name: "防御力",
            minGrowth: realmLevel * 1,
            maxGrowth: realmLevel * 3,
            minRange: realmLevel * 5,
            maxRange: realmLevel * 10,
            currentValue: realmLevel * 5 + Math.floor(Math.random() * (realmLevel * 5 + 1)),
            growthRate: 1.2,
            fixedGrowth: 0
        });
        this.qiBlood = new BasicRangeGrowthAttribute({
            name: "气血",
            minGrowth: realmLevel * 5,
            maxGrowth: realmLevel * 10,
            minRange: realmLevel * 50,
            maxRange: realmLevel * 100,
            currentValue: realmLevel * 50 + Math.floor(Math.random() * (realmLevel * 50 + 1)),
            growthRate: 2,
            fixedGrowth: 0
        });
        this.criticalRate = new BasicRangeRandomGrowthAttribute({
            name: "暴击率",
            minGrowth: 1,
            maxGrowth: 2,
            minRange: realmLevel,
            maxRange: realmLevel * 5,
            currentValue: realmLevel + Math.floor(Math.random() * (realmLevel * 4 + 1)),
            growthRate: 1,
            fixedGrowth: 0
        });
        this.criticalDamage = new BasicRangeGrowthAttribute({
            name: "暴击伤害",
            minGrowth: 5,
            maxGrowth: 10,
            minRange: 150,
            maxRange: 200,
            currentValue: 150 + Math.floor(Math.random() * 51),
            growthRate: 1,
            fixedGrowth: 0
        });
        this.dodgeRate = new BasicRangeRandomGrowthAttribute({
            name: "闪避率",
            minGrowth: 1,
            maxGrowth: 3,
            minRange: realmLevel,
            maxRange: realmLevel * 3,
            currentValue: realmLevel + Math.floor(Math.random() * (realmLevel * 2 + 1)),
            growthRate: 1,
            fixedGrowth: 0
        });
        this.spiritPower = new BasicRangeGrowthAttribute({
            name: "灵力",
            minGrowth: realmLevel * 2,
            maxGrowth: realmLevel * 5,
            minRange: realmLevel * 20,
            maxRange: realmLevel * 50,
            currentValue: realmLevel * 20 + Math.floor(Math.random() * (realmLevel * 30 + 1)),
            growthRate: 1.5,
            fixedGrowth: 0
        });
        // 初始化灵根数组，生成随机灵根
        this.spiritRoots = SpiritRootClass.随机生成灵根(Math.floor(Math.random() * 3) + 1);
        // 初始化功法列表
        this.cultivationMethods = [];
        // 初始化突破概率
        this.breakthroughChance = new BasicRangeRandomGrowthAttribute({
            name: "突破概率",
            minGrowth: realmLevel,
            maxGrowth: realmLevel * 2,
            minRange: realmLevel * 10,
            maxRange: realmLevel * 20,
            currentValue: realmLevel * 10 + Math.floor(Math.random() * (realmLevel * 10 + 1)),
            growthRate: 1,
            fixedGrowth: 0
        });
    }

    /**
     * 静态方法：随机生成一个修仙者
     * @param realmLevel 初始境界等级
     * @returns 随机生成的修仙者实例
     */
    static 随机生成修仙者(realmLevel: number = 1): CultivatorClass {
        // 随机选择性别
        const genders: Gender[] = ["男", "女"];
        const gender = genders[Math.floor(Math.random() * genders.length)] || "未知";
        // 随机生成姓名
        const name = RandomUtils.randomCultivatorName(gender === "男" ? "male" : "female")[0] || "未知修仙者";
        // 创建并返回修仙者实例
        return new CultivatorClass(name, gender, realmLevel);
    }
}
