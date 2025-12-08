import { TimeEventType, TimeUnit } from "./define";
import type { GameTime, TimeEventHandler, TimeEventManager } from "./define";

// 时间事件管理器实现类
export class TimeEventManagerImpl implements TimeEventManager {
  private events: Map<TimeEventType, Set<TimeEventHandler>> = new Map();

  on(eventType: TimeEventType, handler: TimeEventHandler): void {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, new Set());
    }
    this.events.get(eventType)?.add(handler);
  }

  off(eventType: TimeEventType, handler: TimeEventHandler): void {
    this.events.get(eventType)?.delete(handler);
  }

  emit(eventType: TimeEventType, data?: any): void {
    this.events.get(eventType)?.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in time event handler: ${error}`);
      }
    });
  }
}

// 游戏时间实现类
export class GameTimeImpl implements GameTime {
  // 游戏开始时间（默认从0开始）
  private static readonly START_TIME = 0;
  // 一天的毫秒数
  private static readonly DAY_IN_MS = TimeUnit.DAY;
  // 一个月的毫秒数（30天）
  private static readonly MONTH_IN_MS = TimeUnit.DAY * 30;
  // 一年的毫秒数（365天）
  private static readonly YEAR_IN_MS = TimeUnit.DAY * 365;

  currentTime: number;
  timeScale: number;
  lastUpdateTime: number;
  isPaused: boolean;
  private eventManager: TimeEventManagerImpl;
  private lastDay: number;
  private lastMonth: number;
  private lastYear: number;

  constructor(timeScale: number = 1) {
    this.currentTime = GameTimeImpl.START_TIME;
    this.timeScale = timeScale;
    this.lastUpdateTime = Date.now();
    this.isPaused = false;
    this.eventManager = new TimeEventManagerImpl();

    // 初始化最后记录的日期
    this.lastDay = this.getDay();
    this.lastMonth = this.getMonth();
    this.lastYear = this.getYear();
  }

  update(): void {
    if (this.isPaused) return;

    const now = Date.now();
    const deltaRealTime = now - this.lastUpdateTime;
    const deltaGameTime = deltaRealTime * this.timeScale;

    this.currentTime += deltaGameTime;
    this.lastUpdateTime = now;

    // 触发时间变化事件
    this.eventManager.emit(TimeEventType.TIME_CHANGED, {
      currentTime: this.currentTime,
      deltaTime: deltaGameTime,
    });

    // 检查日期变化
    this.checkDateChanges();
  }

  private checkDateChanges(): void {
    const currentDay = this.getDay();
    const currentMonth = this.getMonth();
    const currentYear = this.getYear();

    // 天数变化
    if (currentDay !== this.lastDay) {
      this.eventManager.emit(TimeEventType.DAY_CHANGED, {
        day: currentDay,
        month: currentMonth,
        year: currentYear,
      });
      this.lastDay = currentDay;
    }

    // 月份变化
    if (currentMonth !== this.lastMonth) {
      this.eventManager.emit(TimeEventType.MONTH_CHANGED, {
        month: currentMonth,
        year: currentYear,
      });
      this.lastMonth = currentMonth;
    }

    // 年份变化
    if (currentYear !== this.lastYear) {
      this.eventManager.emit(TimeEventType.YEAR_CHANGED, {
        year: currentYear,
      });
      this.lastYear = currentYear;
    }
  }

  setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, scale);
    this.eventManager.emit(TimeEventType.TIME_SCALE_CHANGED, {
      timeScale: this.timeScale,
    });
  }

  pause(): void {
    this.isPaused = true;
    this.eventManager.emit(TimeEventType.TIME_PAUSED);
  }

  resume(): void {
    this.isPaused = false;
    this.lastUpdateTime = Date.now();
    this.eventManager.emit(TimeEventType.TIME_RESUMED);
  }

  addTime(milliseconds: number): void {
    this.currentTime += milliseconds;
    this.lastUpdateTime = Date.now();

    // 触发时间变化事件
    this.eventManager.emit(TimeEventType.TIME_CHANGED, {
      currentTime: this.currentTime,
      deltaTime: milliseconds,
    });

    // 检查日期变化
    this.checkDateChanges();
  }

  setTime(time: number): void {
    const oldTime = this.currentTime;
    this.currentTime = Math.max(0, time);
    this.lastUpdateTime = Date.now();

    // 触发时间变化事件
    this.eventManager.emit(TimeEventType.TIME_CHANGED, {
      currentTime: this.currentTime,
      deltaTime: this.currentTime - oldTime,
    });

    // 检查日期变化
    this.checkDateChanges();
  }

  getFormattedTime(): string {
    const year = this.getYear();
    const month = this.getMonth();
    const day = this.getDay();
    const hour = this.getHour();
    const minute = this.getMinute();
    const second = this.getSecond();
    
    // 修仙风格的时间表示
    // 年份用纪元表示，超过一定年份可以用甲子等单位
    const era = Math.floor(year / 1000) + 1; // 每千年为一个纪元
    const yearInEra = year % 1000 + 1; // 纪元内的年份
    
    // 十二时辰转换
    const twelveHours = [
      "子时", "丑时", "寅时", "卯时", "辰时", "巳时",
      "午时", "未时", "申时", "酉时", "戌时", "亥时"
    ];
    const currentHour = twelveHours[Math.floor(hour / 2)];
    
    // 修仙风格的时间格式
    return `第${era}纪元 ${yearInEra}年${month}月${day}日 ${currentHour} ${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
  }

  getYear(): number {
    return Math.floor(this.currentTime / GameTimeImpl.YEAR_IN_MS);
  }

  getMonth(): number {
    const yearTime = this.getYear() * GameTimeImpl.YEAR_IN_MS;
    return (
      Math.floor((this.currentTime - yearTime) / GameTimeImpl.MONTH_IN_MS) + 1
    );
  }

  getDay(): number {
    const yearTime = this.getYear() * GameTimeImpl.YEAR_IN_MS;
    const monthTime = (this.getMonth() - 1) * GameTimeImpl.MONTH_IN_MS;
    return (
      Math.floor(
        (this.currentTime - yearTime - monthTime) / GameTimeImpl.DAY_IN_MS
      ) + 1
    );
  }

  getHour(): number {
    return Math.floor(
      (this.currentTime % GameTimeImpl.DAY_IN_MS) / TimeUnit.HOUR
    );
  }

  getMinute(): number {
    return Math.floor((this.currentTime % TimeUnit.HOUR) / TimeUnit.MINUTE);
  }

  getSecond(): number {
    return Math.floor((this.currentTime % TimeUnit.MINUTE) / TimeUnit.SECOND);
  }

  // 获取事件管理器
  getEventManager(): TimeEventManager {
    return this.eventManager;
  }
}

// 创建单例实例
let gameTimeInstance: GameTimeImpl | null = null;

export function getGameTimeInstance(timeScale: number = 1): GameTimeImpl {
  if (!gameTimeInstance) {
    gameTimeInstance = new GameTimeImpl(timeScale);
  }
  return gameTimeInstance;
}
