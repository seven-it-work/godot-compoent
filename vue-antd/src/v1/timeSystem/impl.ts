/**
 * 游戏时间系统实现
 * 提供游戏时间的管理、计算和事件处理功能
 */
import { TimeEventType, TimeUnit } from "./define";
import type { GameTime, TimeEventHandler, TimeEventManager } from "./define";

/**
 * 时间事件管理器实现类
 * 提供时间事件的监听、移除和触发功能
 */
export class TimeEventManagerImpl implements TimeEventManager {
  /** 存储事件类型和对应的事件处理函数集合 */
  private events: Map<TimeEventType, Set<TimeEventHandler>> = new Map();

  /**
   * 添加时间事件监听器
   * @param eventType 要监听的事件类型
   * @param handler 事件处理函数
   */
  on(eventType: TimeEventType, handler: TimeEventHandler): void {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, new Set());
    }
    this.events.get(eventType)?.add(handler);
  }

  /**
   * 移除时间事件监听器
   * @param eventType 要移除监听的事件类型
   * @param handler 要移除的事件处理函数
   */
  off(eventType: TimeEventType, handler: TimeEventHandler): void {
    this.events.get(eventType)?.delete(handler);
  }

  /**
   * 触发时间事件
   * @param eventType 要触发的事件类型
   * @param data 事件数据，可选
   */
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

/**
 * 游戏时间实现类
 * 提供游戏时间的管理和操作功能
 */
export class GameTimeImpl implements GameTime {
  /** 游戏开始时间（默认从0开始） */
  private static readonly START_TIME = 0;
  /** 一天的毫秒数 */
  private static readonly DAY_IN_MS = TimeUnit.DAY;
  /** 一个月的毫秒数（30天） */
  private static readonly MONTH_IN_MS = TimeUnit.DAY * 30;
  /** 一年的毫秒数（365天） */
  private static readonly YEAR_IN_MS = TimeUnit.DAY * 365;

  /** 当前游戏时间（毫秒） */
  currentTime: number;
  /** 现实时间与游戏时间的比例 */
  timeScale: number;
  /** 最后一次更新的现实时间 */
  lastUpdateTime: number;
  /** 是否暂停 */
  isPaused: boolean;
  /** 时间事件管理器实例 */
  private eventManager: TimeEventManagerImpl;
  /** 上一次记录的天数 */
  private lastDay: number;
  /** 上一次记录的月份 */
  private lastMonth: number;
  /** 上一次记录的年份 */
  private lastYear: number;

  /**
   * 构造函数
   * @param timeScale 初始时间流速，默认为1
   */
  constructor(timeScale: number = 100) {
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

  /**
   * 更新游戏时间
   * 根据当前时间流速和现实时间差计算并更新游戏时间
   * 1倍速 = 游戏时间100秒 = 真实时间1秒
   */
  update(): void {
    if (this.isPaused) return;

    const now = Date.now();
    const deltaRealTime = now - this.lastUpdateTime;
    // 调整时间流速计算，1倍速时游戏时间的100秒对应真实时间的1秒
    const deltaGameTime = deltaRealTime * this.timeScale * 100;

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

  /**
   * 检查日期变化并触发相应事件
   * 内部方法，用于检测年份、月份和天数的变化
   */
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

  /**
   * 设置时间流速
   * @param scale 时间流速比例，必须大于等于0
   */
  setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, scale);
    this.eventManager.emit(TimeEventType.TIME_SCALE_CHANGED, {
      timeScale: this.timeScale,
    });
  }

  /** 暂停游戏时间 */
  pause(): void {
    this.isPaused = true;
    this.eventManager.emit(TimeEventType.TIME_PAUSED);
  }

  /** 恢复游戏时间 */
  resume(): void {
    this.isPaused = false;
    this.lastUpdateTime = Date.now();
    this.eventManager.emit(TimeEventType.TIME_RESUMED);
  }

  /**
   * 直接增加游戏时间
   * @param milliseconds 要增加的毫秒数
   */
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

  /**
   * 直接设置游戏时间
   * @param time 要设置的时间（毫秒），必须大于等于0
   */
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

  /**
   * 获取格式化的时间字符串
   * 返回修仙风格的时间表示，格式为：第X纪元 Y年M月D日子时 HH:MM:SS
   * @returns 格式化的修仙风格时间字符串
   */
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
    const yearInEra = (year % 1000) + 1; // 纪元内的年份

    // 十二时辰转换
    const twelveHours = [
      "子时",
      "丑时",
      "寅时",
      "卯时",
      "辰时",
      "巳时",
      "午时",
      "未时",
      "申时",
      "酉时",
      "戌时",
      "亥时",
    ];
    const currentHour = twelveHours[Math.floor(hour / 2)];

    // 修仙风格的时间格式
    return `第${era}纪元 ${yearInEra}年${month}月${day}日 ${currentHour} ${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
  }

  /**
   * 获取当前游戏年份
   * @returns 年份数值
   */
  getYear(): number {
    return Math.floor(this.currentTime / GameTimeImpl.YEAR_IN_MS);
  }

  /**
   * 获取当前游戏月份
   * @returns 月份数值（1-12）
   */
  getMonth(): number {
    const yearTime = this.getYear() * GameTimeImpl.YEAR_IN_MS;
    return (
      Math.floor((this.currentTime - yearTime) / GameTimeImpl.MONTH_IN_MS) + 1
    );
  }

  /**
   * 获取当前游戏天数
   * @returns 天数数值（1-30）
   */
  getDay(): number {
    const yearTime = this.getYear() * GameTimeImpl.YEAR_IN_MS;
    const monthTime = (this.getMonth() - 1) * GameTimeImpl.MONTH_IN_MS;
    return (
      Math.floor(
        (this.currentTime - yearTime - monthTime) / GameTimeImpl.DAY_IN_MS
      ) + 1
    );
  }

  /**
   * 获取当前游戏小时
   * @returns 小时数值（0-23）
   */
  getHour(): number {
    return Math.floor(
      (this.currentTime % GameTimeImpl.DAY_IN_MS) / TimeUnit.HOUR
    );
  }

  /**
   * 获取当前游戏分钟
   * @returns 分钟数值（0-59）
   */
  getMinute(): number {
    return Math.floor((this.currentTime % TimeUnit.HOUR) / TimeUnit.MINUTE);
  }

  /**
   * 获取当前游戏秒数
   * @returns 秒数数值（0-59）
   */
  getSecond(): number {
    return Math.floor((this.currentTime % TimeUnit.MINUTE) / TimeUnit.SECOND);
  }

  /**
   * 获取事件管理器
   * 用于监听和触发时间相关事件
   * @returns 时间事件管理器实例
   */
  getEventManager(): TimeEventManager {
    return this.eventManager;
  }
}

/**
 * 游戏时间单例实例
 * 确保整个应用中只有一个游戏时间实例
 */
let gameTimeInstance: GameTimeImpl | null = null;

/**
 * 获取游戏时间单例实例
 * 如果实例不存在，则创建新实例
 * @param timeScale 初始时间流速，仅在首次创建实例时有效
 * @returns 游戏时间实例
 */
export function getGameTimeInstance(timeScale: number = 100): GameTimeImpl {
  if (!gameTimeInstance) {
    gameTimeInstance = new GameTimeImpl(timeScale);
  }
  return gameTimeInstance;
}
