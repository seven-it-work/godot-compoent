import { defineStore } from "pinia";
import { ref } from "vue";
import { getGameTimeInstance as createGameTimeInstance } from "@/v1/timeSystem/index.ts";
import type { GameTime } from "@/v1/timeSystem/define.ts";

/**
 * 时间系统状态管理Store
 */
export const useTimeSystemStore = defineStore("timeSystem", () => {
  // 游戏时间实例（响应式）
  const gameTime = ref<GameTime | null>(null);
  // 时间流速
  const timeScale = ref(1);
  // 是否准备就绪
  const isGameTimeReady = ref(false);

  /**
   * 初始化游戏时间
   */
  const initGameTime = () => {
    if (!gameTime.value) {
      gameTime.value = createGameTimeInstance(timeScale.value);
      isGameTimeReady.value = true;
      console.log("[TimeSystemStore] 游戏时间实例初始化完成");
    }
  };

  /**
   * 获取游戏时间实例
   */
  const getGameTimeInstance = () => {
    return gameTime.value;
  };

  /**
   * 切换暂停/继续
   */
  const togglePause = () => {
    if (!gameTime.value) return;

    if (gameTime.value.isPaused) {
      gameTime.value.resume();
    } else {
      gameTime.value.pause();
    }
  };

  /**
   * 更新时间流速
   */
  const updateTimeScale = (value: number | null) => {
    if (gameTime.value && value !== null) {
      gameTime.value.setTimeScale(value);
      timeScale.value = value;
    }
  };

  /**
   * 格式化当前时间
   */
  const getFormattedTime = () => {
    if (gameTime.value) {
      return gameTime.value.getFormattedTime();
    }
    return "";
  };

  return {
    gameTime,
    timeScale,
    isGameTimeReady,
    initGameTime,
    getGameTimeInstance,
    togglePause,
    updateTimeScale,
    getFormattedTime,
  };
});
