import { defineStore } from 'pinia';

export const useBattleStore = defineStore('battle', {
  state: () => ({
    // 战斗结果
    battleResult: null as any,
    // 战斗日志
    battleLog: [] as string[],
    // 战斗是否正在进行中
    isBattleActive: false,
  }),

  getters: {
    // 获取战斗日志
    getBattleLog: state => state.battleLog,
    // 检查战斗是否正在进行
    isBattleInProgress: state => state.isBattleActive,
  },

  actions: {
    // 开始战斗
    startBattle() {
      this.isBattleActive = true;
      this.battleLog = [];
      this.battleResult = null;
      this.addBattleLog('战斗开始！');
    },

    // 结束战斗
    endBattle(result: any) {
      this.isBattleActive = false;
      this.battleResult = result;
      this.addBattleLog(`战斗结束！结果：${result.outcome}`);
    },

    // 添加战斗日志
    addBattleLog(message: string) {
      this.battleLog.push(message);
    },

    // 清空战斗日志
    clearBattleLog() {
      this.battleLog = [];
    },

    // 重置战斗状态
    resetBattleState() {
      this.battleResult = null;
      this.battleLog = [];
      this.isBattleActive = false;
    },
  },
});
