import { defineStore } from 'pinia';
import { CultivatorClass } from '@/v1/cultivator/impl';
import type { LocationClass } from '@/v1/location/impl';

/**
 * 修仙者状态管理Store
 */
export const useCultivatorStore = defineStore('cultivator', () => {
  // 修仙者实例（响应式）
  const cultivator = new CultivatorClass();
  
  // 初始化修仙者信息
  cultivator.name = cultivator.gender === '男' ? '张三' : '李四';
  
  /**
   * 获取当前修仙者实例
   */
  const getCurrentCultivator = () => {
    return cultivator;
  };
  
  /**
   * 设置修仙者位置
   */
  const setCultivatorLocation = (location: LocationClass) => {
    cultivator.currentLocation = location;
  };
  
  /**
   * 获取当前修仙者位置
   */
  const getCurrentLocation = () => {
    return cultivator.currentLocation;
  };
  
  return {
    cultivator,
    getCurrentCultivator,
    setCultivatorLocation,
    getCurrentLocation
  };
});
