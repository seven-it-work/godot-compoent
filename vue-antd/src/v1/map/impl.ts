import { LocationClass } from "../location/impl";
import RandomUtils from "../utils/RandomUtils";
import type { MapGrid, GameMap, MapManager } from "./define";

/**
 * 地图格子实现类
 */
export class MapGridClass implements MapGrid {
  x: number;
  y: number;
  location: LocationClass;
  isPassable: boolean;
  isSelected: boolean;
  isOnPath: boolean;

  constructor(x: number, y: number, isPassable: boolean = true) {
    this.x = x;
    this.y = y;
    this.location = new LocationClass({
      name: `位置(${x},${y})`,
      description: `地图上的位置(${x},${y})`,
    });
    this.isPassable = isPassable;
    this.isSelected = false;
    this.isOnPath = false;
  }
}

/**
 * 地图实现类
 */
export class GameMapClass implements GameMap {
  width: number;
  height: number;
  grid: MapGridClass[][];
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  currentX: number;
  currentY: number;
  path: { x: number; y: number }[];

  constructor() {
    this.width = 0;
    this.height = 0;
    this.grid = [];
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.path = [];
  }

  /**
   * 初始化地图
   * @param width 地图宽度
   * @param height 地图高度
   */
  init(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.grid = [];

    // 创建地图网格
    for (let y = 0; y < height; y++) {
      const row: MapGridClass[] = [];
      for (let x = 0; x < width; x++) {
        // 所有格子都设置为可通行
        const isPassable = true;
        row.push(new MapGridClass(x, y, isPassable));
      }
      this.grid.push(row);
    }

    // 初始位置设置在地图中心
    this.currentX = Math.floor(width / 2);
    this.currentY = Math.floor(height / 2);
    this.startX = this.currentX;
    this.startY = this.currentY;
    this.endX = this.currentX;
    this.endY = this.currentY;
    this.path = [];
  }

  /**
   * 获取指定坐标的格子
   * @param x 坐标X
   * @param y 坐标Y
   * @returns 地图格子
   */
  getGrid(x: number, y: number): MapGrid | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    // @ts-ignore
    return this.grid[y][x];
  }

  /**
   * 选择格子
   * @param x 坐标X
   * @param y 坐标Y
   */
  selectGrid(x: number, y: number): void {
    console.log(
      `[Map] 选择格子: (${x}, ${y}), 当前位置: (${this.currentX}, ${this.currentY})`
    );

    // 清除之前的选择
    this.grid.forEach((row) => {
      row.forEach((grid) => {
        grid.isSelected = false;
      });
    });

    // 选择新的格子
    const grid = this.getGrid(x, y);
    if (grid) {
      grid.isSelected = true;
      this.endX = x;
      this.endY = y;

      // 规划路径
      this.path = this.findPath(this.currentX, this.currentY, x, y);
      console.log(`[Map] 规划路径: ${JSON.stringify(this.path)}`);
      console.log(`[Map] 路径长度: ${this.path.length}`);

      // 更新路径状态
      this.updatePathStatus();
    }
  }

  /**
   * 更新路径状态
   */
  private updatePathStatus(): void {
    console.log(`[Map] 更新路径状态, 路径: ${JSON.stringify(this.path)}`);

    // 清除之前的路径
    this.grid.forEach((row) => {
      row.forEach((grid) => {
        grid.isOnPath = false;
      });
    });

    // 设置新路径
    this.path.forEach((point) => {
      const grid = this.getGrid(point.x, point.y);
      if (grid) {
        grid.isOnPath = true;
        console.log(`[Map] 格子 (${point.x}, ${point.y}) 设置为路径`);
      }
    });
  }

  /**
   * A*算法的节点
   */
  private aStarNode = {
    x: 0,
    y: 0,
    g: 0, // 从起点到当前节点的代价
    h: 0, // 从当前节点到终点的估计代价
    f: 0, // 总代价 g + h
    parent: null as any,
  };

  /**
   * A*算法的启发函数
   */
  private heuristic(x1: number, y1: number, x2: number, y2: number): number {
    // 使用曼哈顿距离
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  /**
   * 获取相邻的格子
   */
  private getNeighbors(x: number, y: number): { x: number; y: number }[] {
    const neighbors: { x: number; y: number }[] = [];
    const directions = [
      { dx: 0, dy: -1 }, // 上
      { dx: 1, dy: 0 }, // 右
      { dx: 0, dy: 1 }, // 下
      { dx: -1, dy: 0 }, // 左
    ];

    directions.forEach((dir) => {
      const nx = x + dir.dx;
      const ny = y + dir.dy;
      if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
        const grid = this.getGrid(nx, ny);
        if (grid && grid.isPassable) {
          neighbors.push({ x: nx, y: ny });
        }
      }
    });

    return neighbors;
  }

  /**
   * A*路径规划算法
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
  ): { x: number; y: number }[] {
    console.log(
      `[Map] 开始路径规划: 从(${startX}, ${startY})到(${endX}, ${endY})`
    );

    // 检查起点和终点是否可通行
    const startGrid = this.getGrid(startX, startY);
    const endGrid = this.getGrid(endX, endY);
    if (
      !startGrid ||
      !endGrid ||
      !startGrid.isPassable ||
      !endGrid.isPassable
    ) {
      console.log(`[Map] 路径规划失败: 起点或终点不可通行`);
      return [];
    }

    // 检查起点和终点是否相同
    if (startX === endX && startY === endY) {
      console.log(`[Map] 路径规划失败: 起点和终点相同`);
      return [];
    }

    // 开放列表和关闭列表
    const openList: any[] = [];
    const closedList: Map<string, boolean> = new Map();

    // 创建起点节点
    const startNode = {
      x: startX,
      y: startY,
      g: 0,
      h: this.heuristic(startX, startY, endX, endY),
      f: 0,
      parent: null,
    };
    startNode.f = startNode.g + startNode.h;
    openList.push(startNode);

    while (openList.length > 0) {
      // 找到f值最小的节点
      let currentIndex = 0;
      for (let i = 0; i < openList.length; i++) {
        if (openList[i].f < openList[currentIndex].f) {
          currentIndex = i;
        }
      }
      const currentNode = openList.splice(currentIndex, 1)[0];

      // 检查是否到达终点
      if (currentNode.x === endX && currentNode.y === endY) {
        // 回溯路径
        const path: { x: number; y: number }[] = [];
        let temp = currentNode;
        while (temp) {
          path.push({ x: temp.x, y: temp.y });
          temp = temp.parent;
        }
        const resultPath = path.reverse();
        console.log(`[Map] 路径规划成功: ${JSON.stringify(resultPath)}`);
        return resultPath;
      }

      // 添加到关闭列表
      closedList.set(`${currentNode.x},${currentNode.y}`, true);

      // 获取相邻节点
      const neighbors = this.getNeighbors(currentNode.x, currentNode.y);
      for (const neighbor of neighbors) {
        // 检查是否在关闭列表中
        if (closedList.has(`${neighbor.x},${neighbor.y}`)) {
          continue;
        }

        // 计算代价
        const gScore = currentNode.g + 1;
        const hScore = this.heuristic(neighbor.x, neighbor.y, endX, endY);
        const fScore = gScore + hScore;

        // 检查是否已经在开放列表中
        const existingNode = openList.find(
          (node) => node.x === neighbor.x && node.y === neighbor.y
        );
        if (existingNode) {
          // 如果当前路径更优，更新节点
          if (gScore < existingNode.g) {
            existingNode.g = gScore;
            existingNode.f = fScore;
            existingNode.parent = currentNode;
          }
        } else {
          // 添加到开放列表
          openList.push({
            x: neighbor.x,
            y: neighbor.y,
            g: gScore,
            h: hScore,
            f: fScore,
            parent: currentNode,
          });
        }
      }
    }

    // 没有找到路径
    console.log(`[Map] 路径规划失败: 没有找到路径`);
    return [];
  }

  /**
   * 移动到下一个格子
   * @returns 是否移动成功
   */
  moveToNext(): boolean {
    console.log(
      `[Map] 尝试移动到下一格, 当前位置: (${this.currentX}, ${this.currentY}), 路径: ${JSON.stringify(this.path)}`
    );

    // 找到当前位置在路径中的索引
    const currentIndex = this.path.findIndex(
      (pos) => pos.x === this.currentX && pos.y === this.currentY
    );
    console.log(
      `[Map] 当前位置在路径中的索引: ${currentIndex}, 路径长度: ${this.path.length}`
    );

    // 如果当前位置不在路径中，或者已经是最后一个位置，返回false
    if (currentIndex === -1 || currentIndex >= this.path.length - 1) {
      console.log(`[Map] 移动失败: 当前位置不在路径中或已经是最后一个位置`);
      return false;
    }

    // 移动到下一个位置
    const nextPos = this.path[currentIndex + 1];
    // @ts-ignore
    console.log(`[Map] 移动到下一个位置: (${nextPos.x}, ${nextPos.y})`);
    // @ts-ignore
    this.currentX = nextPos.x;
    // @ts-ignore
    this.currentY = nextPos.y;

    // 更新路径状态
    this.updatePathStatus();
    console.log(`[Map] 移动成功`);

    return true;
  }

  /**
   * 清除路径
   */
  clearPath(): void {
    this.path = [];
    this.updatePathStatus();
  }
}

/**
 * 地图管理器实现类
 */
export class MapManagerClass implements MapManager {
  /** 单例实例 */
  private static instance: MapManagerClass | null = null;

  /** 当前地图 */
  private currentMap: GameMapClass | null = null;

  /**
   * 私有构造函数，防止外部直接实例化
   */
  private constructor() {}

  /**
   * 获取地图管理器单例实例
   * @returns 地图管理器实例
   */
  public static getInstance(): MapManagerClass {
    if (!MapManagerClass.instance) {
      MapManagerClass.instance = new MapManagerClass();
    }
    return MapManagerClass.instance;
  }

  /**
   * 获取当前地图
   * @returns 当前地图
   */
  getCurrentMap(): GameMap {
    if (!this.currentMap) {
      // 如果没有当前地图，创建一个默认地图
      this.currentMap = new GameMapClass();
      this.currentMap.init(10, 10);
    }
    return this.currentMap;
  }

  /**
   * 创建新地图
   * @param width 地图宽度
   * @param height 地图高度
   * @returns 新地图
   */
  createMap(width: number, height: number): GameMap {
    this.currentMap = new GameMapClass();
    this.currentMap.init(width, height);
    return this.currentMap;
  }

  /**
   * 设置当前地图
   * @param map 地图实例
   */
  setCurrentMap(map: GameMap): void {
    this.currentMap = map as GameMapClass;
  }
}

// 导出单例实例的便捷访问方式
export const mapManager = MapManagerClass.getInstance();
