import { defineStore } from "pinia";
import { CultivatorClass } from "@/v1/cultivator/impl";
import type { Location } from "@/v1/location/define";
import { ref } from "vue";

/**
 * 修仙者状态管理Store
 */
export const useCultivatorStore = defineStore("cultivator", () => {
  // 修仙者实例（响应式）
  const cultivator = ref(CultivatorClass.generateRandomCultivator());
  // 是否在外出中（响应式）
  const isOuting = ref(false);

  const setCurrentCultivator = (_cultivator: CultivatorClass) => {
    cultivator.value = _cultivator;
  };
  /**
   * 获取当前修仙者实例
   */
  const getCurrentCultivator = (): CultivatorClass => {
    return cultivator.value as CultivatorClass;
  };

  /**
   * 设置修仙者位置
   */
  const setCultivatorLocation = (location: Location) => {
    cultivator.value.currentLocation = location;
  };

  /**
   * 获取当前修仙者位置
   */
  const getCurrentLocation = (): Location => {
    return cultivator.value.currentLocation as Location;
  };

  /**
   * 设置修仙者是否在外出中
   */
  const setIsOuting = (status: boolean) => {
    isOuting.value = status;
  };

  /**
   * 获取修仙者是否在外出中
   */
  const getIsOuting = (): boolean => {
    return isOuting.value;
  };

  return {
    isOuting,
    setCurrentCultivator,
    getCurrentCultivator,
    setCultivatorLocation,
    getCurrentLocation,
    setIsOuting,
    getIsOuting,
  };
});
