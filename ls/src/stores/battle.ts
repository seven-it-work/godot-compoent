import type { Minion } from '@/game/Minion';
import type { Player } from '@/game/Player';
import { defineStore } from 'pinia';

export interface BattleResult {}

export interface BattleStore {
  // 战斗结果
  battleResult?: BattleResult;
  // 战斗日志
  battleLog: string[];
  // 战斗是否正在进行中
  isBattleActive: boolean;
  /** 己方玩家对象 */
  friendlyPlayer?: Player;
  /** 敌方玩家对象 */
  enemyPlayer?: Player;
  /** 攻击者随从实例（可选） */
  attacker?: Minion;
  /** 攻击随从所在位置索引 */
  position?: number;
  /** 攻击随从所在阵营 */
  side: 'player' | 'enemy';
}

export const useBattleStore = defineStore('battle', {
  state: () =>
    ({
      // 战斗结果
      battleResult: undefined,
      // 战斗日志
      battleLog: [],
      // 战斗是否正在进行中
      isBattleActive: false,
      /** 己方玩家对象 */
      friendlyPlayer: undefined,
      /** 敌方玩家对象 */
      enemyPlayer: undefined,
      /** 攻击者随从实例（可选） */
      attacker: undefined,
      /** 攻击随从所在位置索引 */
      position: undefined,
      /** 攻击随从所在阵营 */
      side: 'player',
    }) as BattleStore,

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
      this.battleResult = {};
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
      this.battleResult = undefined;
      this.battleLog = [];
      this.isBattleActive = false;
    },
  },
});
