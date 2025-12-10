import { defineStore } from "pinia";
import { CultivatorClass } from "@/v1/cultivator/impl";
import type { Location } from "@/v1/location/define";

/**
 * 修仙者状态管理Store
 */
export const useCultivatorStore = defineStore("cultivator", () => {
  // 修仙者实例（响应式）
  let cultivator = CultivatorClass.随机生成人物();

  const setCurrentCultivator = (_cultivator: CultivatorClass) => {
    cultivator = _cultivator;
  };
  /**
   * 获取当前修仙者实例
   */
  const getCurrentCultivator = () => {
    return cultivator;
  };

  /**
   * 设置修仙者位置
   */
  const setCultivatorLocation = (location: Location) => {
    cultivator.currentLocation = location;
  };

  /**
   * 获取当前修仙者位置
   */
  const getCurrentLocation = (): Location => {
    return cultivator.currentLocation;
  };

  return {
    setCurrentCultivator,
    getCurrentCultivator,
    setCultivatorLocation,
    getCurrentLocation,
  };
});
