import { defineStore } from "pinia";
import { GameMapClass } from "@/v1/map/impl";
import type { GameMap } from "@/v1/map/define";

/**
 * 地图状态管理Store
 */
export const useMapStore = defineStore("map", () => {
  // 当前地图实例
  let currentMap: GameMap = new GameMapClass();

  /**
   * 获取当前地图
   */
  const getCurrentMap = (): GameMap => {
    if (!currentMap) {
      // 如果没有当前地图，创建一个默认地图
      currentMap = new GameMapClass();
      currentMap.init(10, 10);
    }
    return currentMap;
  };

  /**
   * 创建新地图
   */
  const createMap = (width: number, height: number): GameMap => {
    currentMap = new GameMapClass();
    currentMap.init(width, height);
    return currentMap;
  };

  /**
   * 设置当前地图
   */
  const setCurrentMap = (map: GameMap): void => {
    currentMap = map;
  };

  return {
    currentMap,
    getCurrentMap,
    createMap,
    setCurrentMap,
  };
});
