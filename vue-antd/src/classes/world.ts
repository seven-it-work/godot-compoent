import { SpiritVein } from './battle';
import type { Monster } from './battle';
import type { SpiritRootType } from './character';
import { getRandomIcon } from '../config/locationIcons';
import { SpiritQi } from './resources';

// 时间系统类
export class GameTime {
  year: number; // 年份
  month: number; // 月份（1-12）
  day: number; // 日期（1-30）
  hour: number; // 小时（0-23）
  minute: number; // 分钟（0-59）
  second: number; // 秒（0-59）
  speed: number; // 时间流速（1x, 2x, 4x等）
  isPaused: boolean; // 是否暂停

  constructor(time: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    speed: number;
    isPaused: boolean;
  }) {
    this.year = time.year;
    this.month = time.month;
    this.day = time.day;
    this.hour = time.hour;
    this.minute = time.minute;
    this.second = time.second;
    this.speed = time.speed;
    this.isPaused = time.isPaused;
  }

  // 时间流逝
  tick(deltaTime: number): void {
    if (this.isPaused) return;

    // 计算实际流逝的秒数
    const elapsedSeconds = deltaTime * this.speed / 1000;
    this.second += elapsedSeconds;

    // 处理时间进位
    while (this.second >= 60) {
      this.second -= 60;
      this.minute++;
      
      while (this.minute >= 60) {
        this.minute -= 60;
        this.hour++;
        
        while (this.hour >= 24) {
          this.hour -= 24;
          this.day++;
          
          while (this.day > 30) {
            this.day -= 30;
            this.month++;
            
            while (this.month > 12) {
              this.month -= 12;
              this.year++;
            }
          }
        }
      }
    }
  }

  // 设置时间流速
  setSpeed(speed: number): void {
    this.speed = speed;
  }

  // 暂停/恢复时间
  togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  // 获取格式化的时间字符串
  getFormattedTime(): string {
    return `${this.year}年${this.month}月${this.day}日 ${Math.floor(this.hour).toString().padStart(2, '0')}:${Math.floor(this.minute).toString().padStart(2, '0')}:${Math.floor(this.second).toString().padStart(2, '0')}`;
  }
}

// 地点类
export class GameLocation {
  id: string; // 地点唯一标识
  x: number; // 横坐标
  y: number; // 纵坐标
  name: string; // 地点名称
  spiritQi: SpiritQi; // 灵气分布
  spiritVein?: SpiritVein; // 灵脉（可选）
  monster?: Monster; // 怪物（可选）
  isCurrent: boolean; // 是否为当前地点
  icon: string; // 地点图标

  constructor(location: {
    id: string;
    x: number;
    y: number;
    name: string;
    spiritQi: SpiritQi;
    spiritVein?: SpiritVein;
    monster?: Monster;
    isCurrent: boolean;
    icon: string;
  }) {
    this.id = location.id;
    this.x = location.x;
    this.y = location.y;
    this.name = location.name;
    this.spiritQi = location.spiritQi;
    this.spiritVein = location.spiritVein;
    this.monster = location.monster;
    this.isCurrent = location.isCurrent;
    this.icon = location.icon;
  }

  // 设置为当前地点
  setAsCurrent(): void {
    this.isCurrent = true;
  }

  // 取消当前地点
  unsetAsCurrent(): void {
    this.isCurrent = false;
  }

  // 检查是否有怪物
  hasMonster(): boolean {
    return this.monster !== undefined;
  }

  // 检查是否有灵脉
  hasSpiritVein(): boolean {
    return this.spiritVein !== undefined;
  }
}

// 地图类
export class GameMap {
  width: number; // 地图宽度（网格数）
  height: number; // 地图高度（网格数）
  locations: GameLocation[][]; // 二维网格地点

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.locations = [];

    // 初始化地图位置
    for (let y = 0; y < height; y++) {
      this.locations[y] = [];
      for (let x = 0; x < width; x++) {
        // 初始化所有位置为GameLocation实例
        this.locations[y]![x] = new GameLocation({
          id: `loc-${x}-${y}`,
          name: `${x},${y}位置`,
          x: x,
          y: y,
          spiritQi: new SpiritQi({
            gold: 0,
            wood: 0,
            water: 0,
            fire: 0,
            earth: 0,
            maxGold: 100,
            maxWood: 100,
            maxWater: 100,
            maxFire: 100,
            maxEarth: 100
          }),
          isCurrent: false,
          spiritVein: undefined,
          monster: undefined,
          icon: getRandomIcon()
        });
      }
    }
  }

  // 设置地点
  setLocation(location: GameLocation): void {
    if (location.x < 0 || location.x >= this.width || location.y < 0 || location.y >= this.height) {
      throw new Error(`位置(${location.x}, ${location.y})超出地图范围`);
    }
    if (!this.locations[location.y]) {
      this.locations[location.y] = [];
    }
    this.locations[location.y]![location.x] = location;
  }

  // 获取地点
  getLocation(x: number, y: number): GameLocation | undefined {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height && this.locations[y]) {
      return this.locations[y][x];
    }
    return undefined;
  }

  // 生成灵脉
  public generateSpiritVeins(count: number): void {
    for (let i = 0; i < count; i++) {
      // 随机位置
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);

      // 随机等级（1-5）
      const level = Math.floor(Math.random() * 5) + 1;
      
      // 随机灵脉类型
      const spiritRootTypes: SpiritRootType[] = ['fire', 'water', 'wood', 'gold', 'earth'];
      const randomType = spiritRootTypes[Math.floor(Math.random() * spiritRootTypes.length)]!;

      // 创建灵脉
      const spiritVein = new SpiritVein(
        randomType,
        level * 10, // 生产速度
        level,
        `${randomType}灵脉`
      );

      // 更新位置
      if (this.locations[y] && this.locations[y][x]) {
        this.locations[y][x].spiritVein = spiritVein;
      }
    }
  }

  // 获取当前地点
  getCurrentLocation(): GameLocation | undefined {
    for (let y = 0; y < this.height; y++) {
      if (!this.locations[y]) continue;
      for (let x = 0; x < this.width; x++) {
        const location = this.locations[y]![x]!;
        if (location && location.isCurrent) {
          return location;
        }
      }
    }
    return undefined;
  }

  // 设置当前地点
  setCurrentLocation(x: number, y: number): void {
    // 先取消所有地点的当前状态
    for (let y = 0; y < this.height; y++) {
      if (!this.locations[y]) continue;
      for (let x = 0; x < this.width; x++) {
        const location = this.locations[y]![x]!;
        if (location) {
          location.unsetAsCurrent();
        }
      }
    }
    
    // 设置新的当前地点
    const location = this.getLocation(x, y);
    if (location) {
      location.setAsCurrent();
    }
  }

  // 更新所有地点
  updateLocations(deltaTime: number): void {
    for (let y = 0; y < this.height; y++) {
      if (!this.locations[y]) continue;
      for (let x = 0; x < this.width; x++) {
        const location = this.locations[y]![x]!;
        if (location && location.spiritVein) {
          // 灵脉生产灵气（考虑时间因素）
          const produced = location.spiritVein.produceSpiritQi() * deltaTime;
          location.spiritQi.absorb(location.spiritVein.type, produced);
        }
      }
    }
  }
}
