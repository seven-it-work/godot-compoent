import type { SpiritRoot } from "@/v1/spiritRoot";
import type { GrowthAttribute, RangeGrowthAttribute } from '@/v1/growthAttribute/define';

/**
 * 性别类型枚举
 */
export type Gender = "男" | "女" | "未知";
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
    attack: RangeGrowthAttribute;
    // 防御力：减少修仙者受到的物理和法术伤害
    defense: RangeGrowthAttribute;
    // 气血：修仙者的生命总量，归零则死亡
    qiBlood: RangeGrowthAttribute;
    // 灵根数组：修仙者拥有的灵根，影响修炼速度和属性成长
    spiritRoots: SpiritRoot[];
    // 境界等级：修仙者的当前境界，影响各项属性的基础值
    realmLevel: GrowthAttribute;
    // 性别：修仙者的性别，影响角色外观和部分剧情
    gender: Gender;
    // 暴击率：攻击时触发暴击的概率
    criticalRate: RangeGrowthAttribute;
    // 暴击伤害：暴击时造成的额外伤害倍率
    criticalDamage: RangeGrowthAttribute;
    // 闪避率：躲避敌人攻击的概率
    dodgeRate: RangeGrowthAttribute;
    // 灵力：用于释放技能和法术的能量，可通过休息恢复
    spiritPower: RangeGrowthAttribute;
    // 功法列表：修仙者已经学会的功法名称集合 （todo 设计功法系统）
    cultivationMethods: string[];
    // 境界突破概率 最大100%级100
    breakthroughChance: RangeGrowthAttribute;
}



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
export const realmConfigs: { name: string; minLevel: number; maxLevel: number; layerPerStage: number; stages: string[] }[] = [];

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
