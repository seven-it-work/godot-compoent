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

  return {
    setCurrentCultivator,
    getCurrentCultivator,
    setCultivatorLocation,
    getCurrentLocation,
  };
});
