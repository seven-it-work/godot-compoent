import { defineStore } from 'pinia';

export const useDebugStore = defineStore('debug', {
  state: () => ({
    // 是否启用调试模式
    isDebugEnabled: false,
  }),

  getters: {
    // 检查是否启用调试模式
    debugModeEnabled: state => state.isDebugEnabled,
  },

  actions: {
    // 切换调试模式
    toggleDebugMode() {
      this.isDebugEnabled = !this.isDebugEnabled;
    },

    // 启用调试模式
    enableDebugMode() {
      this.isDebugEnabled = true;
    },

    // 禁用调试模式
    disableDebugMode() {
      this.isDebugEnabled = false;
    },

    // 调试功能 - 设置当前金币
    setCurrentGold(player: any, gold: number) {
      if (player) {
        player.gold = gold;
      }
    },

    // 调试功能 - 设置当前最大金币
    setMaxGold(player: any, maxGold: number) {
      if (player) {
        player.maxGold = maxGold;
      }
    },
  },
});
