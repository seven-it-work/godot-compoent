import RandomUtils from "./RandomUtils";

export interface GrowthAttribute {
    // 属性名称
    name: string;
    // 最小成长值
    minGrowth: number;
    // 最大成长值
    maxGrowth: number;
    // 成长倍率
    growthRate?: number;
    // 固定成长值
    fixedGrowth?: number;
    // 当前值
    currentValue: number;
    // 成长方法
    grow(): void;
    // 获取成长随机值
    getGrowthRandom(): number;
    // 获取当前值
    getCurrentValue(): number;
}

/**
 * 范围成长属性接口
 * 继承自基础成长属性接口，增加了范围相关的属性
 */
export interface RangeGrowthAttribute extends GrowthAttribute {
    // 最小范围值
    minRange: number;
    // 最大范围值
    maxRange: number;
    // 是否成长最小范围值
    growMinRange?: boolean;
    // 是否成长当前值
    growCurrentValue?: boolean;
}

/**
 * 基础成长属性类
 * 实现了GrowthAttribute接口，提供基础的属性成长功能
 */
export class BasicGrowthAttribute implements GrowthAttribute {
    // 属性名称
    name: string = "";
    // 最小成长值
    minGrowth: number = 0;
    // 最大成长值
    maxGrowth: number = 0;
    // 成长倍率
    growthRate: number = 1;
    // 固定成长值
    fixedGrowth: number = 0;
    // 当前值
    currentValue: number = 0;

    /**
     * 构造函数
     * @param options 配置选项
     */
    constructor(options?: Partial<GrowthAttribute>) {
        Object.assign(this, options);
    }

    /**
     * 成长方法
     * 成长值 += getGrowthRandom() 
     */
    grow(): void {
        this.currentValue += this.getGrowthRandom();
    }

    /**
     * 获取成长随机值
     * 成长随机值 = 随机整数(最大成长值 - 最小成长值)*成长倍率 + 固定成长值
     * @returns 成长随机值
     */
    getGrowthRandom(): number {
        return RandomUtils.randomInt(this.minGrowth, this.maxGrowth) * this.growthRate + this.fixedGrowth;
    }

    /**
     * 获取当前值
     * @returns 当前值
     */
    getCurrentValue(): number {
        return this.currentValue;
    }
}

/**
 * 基础范围成长属性类
 * 继承自基础成长属性类，实现了范围成长属性接口
 */
export class BasicRangeGrowthAttribute extends BasicGrowthAttribute implements RangeGrowthAttribute {
    // 最小范围值
    minRange: number = 0;
    // 最大范围值
    maxRange: number = 0;
    // 是否成长最小范围值
    growMinRange: boolean = false;
    // 是否成长当前值
    growCurrentValue: boolean = false;

    /**
     * 构造函数
     * @param options 配置选项
     */
    constructor(options?: Partial<RangeGrowthAttribute>) {
        super(options);
        Object.assign(this, options);
    }

    /**
     * 属性成长方法，实现范围成长属性的成长逻辑
     * 
     * 该方法执行以下成长逻辑：
     * 1. 首先获取基于属性配置的成长随机值（调用getGrowthRandom方法）
     * 2. 如果配置了成长当前值(growCurrentValue=true)，则将成长随机值添加到当前值
     * 3. 处理范围值成长：
     *    - 如果配置了成长最小范围(growMinRange=true)，则将成长随机值分配到最小范围和最大范围
     *      - 最小范围增长值：0到成长随机值一半之间的随机整数
     *      - 最大范围增长值：成长随机值减去最小范围增长值的剩余部分
     *    - 否则，将整个成长随机值仅添加到最大范围
     * 
     * 应用场景：
     * - 用于角色属性、技能效果等需要动态范围成长的系统
     * - 支持灵活配置不同属性的成长方式
     * 
     * 注意事项：
     * - 成长随机值的计算基于属性的minGrowth、maxGrowth、growthRate和fixedGrowth配置
     * - 范围成长逻辑确保maxRange始终大于等于minRange
     * - 该方法不会直接返回值，而是修改属性对象的内部状态
     */
    grow(): void {
        const growthRandomValue = this.getGrowthRandom();
        if (this.growCurrentValue) {
            this.currentValue += growthRandomValue;
        }
        if (this.growMinRange) {
            const minGrowthValue = RandomUtils.randomInt(0, growthRandomValue / 2);
            this.minRange += minGrowthValue;
            this.maxRange += growthRandomValue - minGrowthValue;
        } else {
            this.maxRange += growthRandomValue;
        }
    }

    /**
     * 当前值是否超过最大范围
     * @returns 当前值是否超过最大范围
     */
    currentIsOverMax(): boolean {
        return this.currentValue > this.maxRange;
    }
}

/**
 * 基础范围随机成长属性类
 * 继承自基础范围成长属性类，提供随机范围值的功能
 */
export class BasicRangeRandomGrowthAttribute extends BasicRangeGrowthAttribute {
    /**
     * 构造函数
     * @param options 配置选项
     */
    constructor(options?: Partial<RangeGrowthAttribute>) {
        const defaultOptions: Partial<RangeGrowthAttribute> = {
            growMinRange: true,
            growCurrentValue: false,
        };
        const mergedOptions = { ...defaultOptions, ...options };
        super(mergedOptions);
        Object.assign(this, mergedOptions);
    }

    /**
     * 获取当前值
     * 从minRange到maxRange之间随机返回一个整数
     * @returns 当前随机值
     */
    getCurrentValue(): number {
        return RandomUtils.randomInt(this.minRange, this.maxRange);
    }
}