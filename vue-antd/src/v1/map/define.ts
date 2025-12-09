import type { Location } from "../location";

/**
 * 地图格子接口
 * 表示地图上的一个格子，包含位置信息和坐标
 */
export interface MapGrid {
  // 格子坐标X
  x: number;
  // 格子坐标Y
  y: number;
  // 格子对应的位置
  location: Location;
  // 是否可通行
  isPassable: boolean;
  // 是否被选中
  isSelected: boolean;
  // 是否在路径上
  isOnPath: boolean;
}

/**
 * 地图接口
 * 管理地图网格和路径规划
 */
export interface GameMap {
  // 地图宽度
  width: number;
  // 地图高度
  height: number;
  // 地图网格
  grid: MapGrid[][];
  // 起点坐标
  startX: number;
  startY: number;
  // 终点坐标
  endX: number;
  endY: number;
  // 当前位置坐标
  currentX: number;
  currentY: number;
  // 路径
  path: { x: number; y: number }[];

  /**
   * 初始化地图
   * @param width 地图宽度
   * @param height 地图高度
   */
  init(width: number, height: number): void;

  /**
   * 获取指定坐标的格子
   * @param x 坐标X
   * @param y 坐标Y
   * @returns 地图格子
   */
  getGrid(x: number, y: number): MapGrid | null;

  /**
   * 选择格子
   * @param x 坐标X
   * @param y 坐标Y
   */
  selectGrid(x: number, y: number): void;

  /**
   * 规划路径
   * @param startX 起点X
   * @param startY 起点Y
   * @param endX 终点X
   * @param endY 终点Y
   * @returns 路径数组
   */
  findPath(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): { x: number; y: number }[];

  /**
   * 移动到下一个格子
   * @returns 是否移动成功
   */
  moveToNext(): boolean;

  /**
   * 清除路径
   */
  clearPath(): void;
}

/**
 * 地图管理器接口
 * 管理游戏中的所有地图
 */
export interface MapManager {
  /**
   * 获取当前地图
   * @returns 当前地图
   */
  getCurrentMap(): GameMap;

  /**
   * 创建新地图
   * @param width 地图宽度
   * @param height 地图高度
   * @returns 新地图
   */
  createMap(width: number, height: number): GameMap;

  /**
   * 设置当前地图
   * @param map 地图实例
   */
  setCurrentMap(map: GameMap): void;
}
