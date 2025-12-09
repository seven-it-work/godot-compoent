import { getGameTimeInstance, TimeEventType } from "../timeSystem";
import type { Location } from "./define";
import { LocationClass } from "./impl";

/**
 * 地点管理器类
 * 负责管理所有地点实例，并处理游戏时间流逝对地点的影响
 * 采用单例模式确保全局只有一个地点管理器
 */
export class LocationManager {
  /** 单例实例 */
  private static instance: LocationManager | null = null;

  /** 所有地点实例的映射，key为地点ID，value为地点实例 */
  private locations: Map<string, Location> = new Map();

  /** 是否已经初始化 */
  private initialized: boolean = false;

  /**
   * 私有构造函数，防止外部直接实例化
   */
  private constructor() {}

  /**
   * 获取地点管理器单例实例
   * @returns 地点管理器实例
   */
  public static getInstance(): LocationManager {
    if (!LocationManager.instance) {
      LocationManager.instance = new LocationManager();
      LocationManager.instance.init();
    }
    return LocationManager.instance;
  }

  /**
   * 初始化地点管理器
   * 设置时间变化监听器
   */
  private init(): void {
    if (this.initialized) return;

    const gameTime = getGameTimeInstance();
    const eventManager = gameTime.getEventManager();

    // 监听游戏天数变化事件，每天生产一次灵气
    eventManager.on(TimeEventType.DAY_CHANGED, () => {
      this.updateLocationsByDay();
    });

    this.initialized = true;
  }

  /**
   * 根据游戏天数变化更新所有地点
   * 每天游戏时间触发一次，每个活跃灵脉生产一次灵气
   */
  private updateLocationsByDay(): void {
    // 更新所有地点的灵脉灵气值
    this.locations.forEach((location) => {
      this.updateSpiritVeinsByDay(location);
    });
  }

  /**
   * 根据游戏天数变化更新地点的灵脉灵气值
   * @param location 地点实例
   */
  private updateSpiritVeinsByDay(location: Location): void {
    if (!location.spiritVeins) return;

    location.spiritVeins.forEach((vein) => {
      // 只有活跃的灵脉才会生成灵气
      if (vein.isActive) {
        // 调用灵脉自身的generateSpiritValue方法生成灵气
        vein.generateSpiritValue();
      }
    });
  }

  /**
   * 添加地点到管理器
   * @param location 地点实例
   */
  public addLocation(location: Location): void {
    if (!location.id) {
      console.error("地点缺少ID，无法添加到管理器");
      return;
    }

    this.locations.set(location.id, location);
  }

  /**
   * 从管理器中移除地点
   * @param locationId 地点ID
   */
  public removeLocation(locationId: string): void {
    this.locations.delete(locationId);
  }

  /**
   * 获取地点实例
   * @param locationId 地点ID
   * @returns 地点实例，如果不存在则返回undefined
   */
  public getLocation(locationId: string): Location | undefined {
    return this.locations.get(locationId);
  }

  /**
   * 获取所有地点实例
   * @returns 所有地点实例的数组
   */
  public getAllLocations(): Location[] {
    return Array.from(this.locations.values());
  }

  /**
   * 清除所有地点实例
   */
  public clearLocations(): void {
    this.locations.clear();
  }
}

// 导出单例实例的便捷访问方式
export const locationManager = LocationManager.getInstance();
