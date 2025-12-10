import { CultivatorClass } from "./impl";
import { useCultivatorStore } from "@/stores/cultivator";

/**
 * 修仙者管理器
 * 用于管理修仙者实例，提供全局访问点
 */
export class CultivatorManager {
  private static instance: CultivatorManager | null = null;
  private cultivator: CultivatorClass | null = null;

  private constructor() {}

  /**
   * 获取单例实例
   */
  public static getInstance(): CultivatorManager {
    if (!CultivatorManager.instance) {
      CultivatorManager.instance = new CultivatorManager();
    }
    return CultivatorManager.instance;
  }

  /**
   * 获取当前修仙者实例
   */
  public getCurrentCultivator(): CultivatorClass {
    const cultivatorStore = useCultivatorStore();
    return cultivatorStore.getCurrentCultivator();
  }

  /**
   * 设置当前修仙者实例
   */
  public setCurrentCultivator(cultivator: CultivatorClass): void {
    this.cultivator = cultivator;
  }

  /**
   * 创建新的修仙者实例
   */
  public createCultivator(): CultivatorClass {
    this.cultivator = new CultivatorClass();
    return this.cultivator;
  }
}

// 导出全局实例
export const cultivatorManager = CultivatorManager.getInstance();
