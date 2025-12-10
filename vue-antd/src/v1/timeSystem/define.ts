/**
 * 时间单位常量定义
 * 用于表示游戏中不同时间单位的毫秒值
 */
export const TimeUnit = {
  MILLISECOND: 1, // 毫秒
  SECOND: 1000, // 秒
  MINUTE: 60000, // 分钟
  HOUR: 3600000, // 小时
  DAY: 86400000, // 天
  MONTH: 2592000000, // 月（默认30天）
  YEAR: 31536000000, // 年（默认365天）
} as const;

export interface 时间流逝处理器{
  执行动作():void
}

/**
 * 时间单位类型定义
 * 用于类型安全的时间单位引用
 */
export type TimeUnit = (typeof TimeUnit)[keyof typeof TimeUnit];

/**
 * 游戏时间接口定义
 * 提供游戏时间的管理和操作功能
 */
export interface GameTime {
  /** 当前游戏时间（毫秒） */
  currentTime: number;
  /** 现实时间与游戏时间的比例（如1:100表示现实1秒=游戏100秒） */
  timeScale: number;
  /** 最后一次更新的现实时间（用于计算时间差） */
  lastUpdateTime: number;
  /** 是否暂停 */
  isPaused: boolean;

  /**
   * 更新游戏时间
   * 根据当前时间流速和现实时间差计算并更新游戏时间
   */
  update(): void;

  /**
   * 设置时间流速
   * @param scale 时间流速比例，必须大于等于0
   */
  setTimeScale(scale: number): void;

  /** 暂停游戏时间 */
  pause(): void;

  /** 恢复游戏时间 */
  resume(): void;

  /**
   * 直接增加游戏时间
   * @param milliseconds 要增加的毫秒数
   */
  addTime(milliseconds: number): void;

  /**
   * 直接设置游戏时间
   * @param time 要设置的时间（毫秒），必须大于等于0
   */
  setTime(time: number): void;

  /**
   * 获取格式化的时间字符串
   * 返回修仙风格的时间表示，格式为：第X纪元 Y年M月D日子时 HH:MM
   */
  getFormattedTime(): string;

  /**
   * 获取当前游戏年份
   * @returns 年份数值
   */
  getYear(): number;

  /**
   * 获取当前游戏月份
   * @returns 月份数值（1-12）
   */
  getMonth(): number;

  /**
   * 获取当前游戏天数
   * @returns 天数数值（1-30）
   */
  getDay(): number;

  /**
   * 获取当前游戏小时
   * @returns 小时数值（0-23）
   */
  getHour(): number;

  /**
   * 获取当前游戏分钟
   * @returns 分钟数值（0-59）
   */
  getMinute(): number;

  /**
   * 获取当前游戏秒数
   * @returns 秒数数值（0-59）
   */
  getSecond(): number;

  /**
   * 获取时间事件管理器
   * 用于监听和触发时间相关事件
   * @returns 时间事件管理器实例
   */
  getEventManager(): TimeEventManager;
}

/**
 * 时间事件类型定义
 * 用于标识不同类型的时间相关事件
 */
export const TimeEventType = {
  TIME_CHANGED: 0, // 游戏时间发生变化时触发
  TIME_SCALE_CHANGED: 1, // 时间流速发生变化时触发
  TIME_PAUSED: 2, // 游戏时间暂停时触发
  TIME_RESUMED: 3, // 游戏时间恢复时触发
  DAY_CHANGED: 4, // 游戏天数发生变化时触发
  MONTH_CHANGED: 5, // 游戏月份发生变化时触发
  YEAR_CHANGED: 6, // 游戏年份发生变化时触发
} as const;

/**
 * 时间事件类型
 * 用于类型安全的事件类型引用
 */
export type TimeEventType = (typeof TimeEventType)[keyof typeof TimeEventType];

/**
 * 时间事件处理器类型
 * @param data 事件数据，不同事件类型的数据结构不同
 */
export type TimeEventHandler = (data?: any) => void;

/**
 * 时间事件管理器接口
 * 提供时间事件的监听、移除和触发功能
 */
export interface TimeEventManager {
  /**
   * 添加时间事件监听器
   * @param eventType 要监听的事件类型
   * @param handler 事件处理函数
   */
  on(eventType: TimeEventType, handler: TimeEventHandler): void;

  /**
   * 移除时间事件监听器
   * @param eventType 要移除监听的事件类型
   * @param handler 要移除的事件处理函数
   */
  off(eventType: TimeEventType, handler: TimeEventHandler): void;

  /**
   * 触发时间事件
   * @param eventType 要触发的事件类型
   * @param data 事件数据，可选
   */
  emit(eventType: TimeEventType, data?: any): void;
}
