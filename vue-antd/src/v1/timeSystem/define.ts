// 时间单位常量
export const TimeUnit = {
  MILLISECOND: 1, // 毫秒
  SECOND: 1000, // 秒
  MINUTE: 60000, // 分钟
  HOUR: 3600000, // 小时
  DAY: 86400000, // 天
  MONTH: 2592000000, // 月（30天）
  YEAR: 31536000000, // 年（365天）
} as const;

export type TimeUnit = (typeof TimeUnit)[keyof typeof TimeUnit];

// 游戏时间接口
export interface GameTime {
  // 当前游戏时间（毫秒）
  currentTime: number;
  // 现实时间与游戏时间的比例（如1:100表示现实1秒=游戏100秒）
  timeScale: number;
  // 最后一次更新的现实时间
  lastUpdateTime: number;
  // 是否暂停
  isPaused: boolean;

  // 更新游戏时间
  update(): void;
  // 设置时间流速
  setTimeScale(scale: number): void;
  // 暂停时间
  pause(): void;
  // 恢复时间
  resume(): void;
  // 增加游戏时间
  addTime(milliseconds: number): void;
  // 设置游戏时间
  setTime(time: number): void;
  // 获取格式化的时间字符串
  getFormattedTime(): string;
  // 获取年
  getYear(): number;
  // 获取月
  getMonth(): number;
  // 获取天
  getDay(): number;
  // 获取小时
  getHour(): number;
  // 获取分钟
  getMinute(): number;
  // 获取秒
  getSecond(): number;
  // 获取事件管理器
  getEventManager(): TimeEventManager;
}

// 时间事件类型
export const TimeEventType = {
  TIME_CHANGED: 0, // 时间变化
  TIME_SCALE_CHANGED: 1, // 时间流速变化
  TIME_PAUSED: 2, // 时间暂停
  TIME_RESUMED: 3, // 时间恢复
  DAY_CHANGED: 4, // 天数变化
  MONTH_CHANGED: 5, // 月份变化
  YEAR_CHANGED: 6, // 年份变化
} as const;

export type TimeEventType = (typeof TimeEventType)[keyof typeof TimeEventType];

// 时间事件处理器类型
export type TimeEventHandler = (data?: any) => void;

// 时间事件管理器接口
export interface TimeEventManager {
  // 添加时间事件监听器
  on(eventType: TimeEventType, handler: TimeEventHandler): void;
  // 移除时间事件监听器
  off(eventType: TimeEventType, handler: TimeEventHandler): void;
  // 触发时间事件
  emit(eventType: TimeEventType, data?: any): void;
}
