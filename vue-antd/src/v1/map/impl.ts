import { LocationClass, type Location } from "../location/";
import type { GameMap } from "./define";

/**
 * 地图实现类
 */
export class GameMapClass implements GameMap {
  width: number;
  height: number;
  grid: Location[][];
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  path: { x: number; y: number }[];

  constructor() {
    this.width = 0;
    this.height = 0;
    this.grid = [];
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
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
      const row: LocationClass[] = [];
      for (let x = 0; x < width; x++) {
        // 直接创建Location实例，添加地图相关属性
        const location = new LocationClass({
          name: `位置(${x},${y})`,
          description: `地图上的位置(${x},${y})`,
          x: x,
          y: y,
          isPassable: true,
          isSelected: false,
          isOnPath: false,
        });
        row.push(location);
      }
      this.grid.push(row);
    }

    // 初始位置设置在地图中心
    this.startX = Math.floor(width / 2);
    this.startY = Math.floor(height / 2);
    this.endX = this.startX;
    this.endY = this.startY;
    this.path = [];
  }

  /**
   * 获取指定坐标的格子
   * @param x 坐标X
   * @param y 坐标Y
   * @returns 地图位置
   */
  getGrid(x: number, y: number): Location {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      throw new Error(`坐标 (${x}, ${y}) 超出地图范围`);
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
    }
  }

  /**
   * 设置路径
   * @param path 路径数组
   */
  setPath(path: { x: number; y: number }[]): void {
    this.path = path;
    this.updatePathStatus();
  }

  /**
   * 更新路径状态
   */
  private updatePathStatus(): void {
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
      }
    });
  }

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
    // 检查起点和终点是否可通行
    const startGrid = this.getGrid(startX, startY);
    const endGrid = this.getGrid(endX, endY);
    if (
      !startGrid ||
      !endGrid ||
      !startGrid.isPassable ||
      !endGrid.isPassable
    ) {
      return [];
    }

    // 检查起点和终点是否相同
    if (startX === endX && startY === endY) {
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
    return [];
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
