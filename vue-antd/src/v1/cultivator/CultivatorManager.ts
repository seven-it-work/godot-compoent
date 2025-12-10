import { CultivatorClass } from './impl';

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
    if (!this.cultivator) {
      // 如果没有实例，创建一个新的
      this.cultivator = new CultivatorClass();
      this.cultivator.name = this.cultivator.gender === '男' ? '张三' : '李四';
    }
    return this.cultivator;
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
