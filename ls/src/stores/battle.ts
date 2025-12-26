import type { Minion } from '@/game/Minion';
import type { Player } from '@/game/Player';
import { defineStore } from 'pinia';

export interface BattleResult {}

export interface AttackerInfo {
  /** 攻击者随从实例（可选） */
  attacker?: Minion;
  /** 攻击随从所在位置索引 */
  position?: number;
  /** 攻击随从所在阵营 */
  side: 'player' | 'enemy';
}
export interface BattleSideData {
  playerData: Player;
  attackIndex: number;
  minions: (Minion | null | undefined)[];
  side: 'player' | 'enemy';
}

export interface BattleStore {
  // 战斗结果
  battleResult?: BattleResult;
  // 战斗日志
  battleLog: string[];
  // 战斗是否正在进行中
  isBattleActive: boolean;
  /** 己方玩家对象 */
  friendlyPlayer?: BattleSideData;
  /** 敌方玩家对象 */
  enemyPlayer?: BattleSideData;
  /** 攻击者信息 */
  attackerInfo: AttackerInfo;
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
      /** 攻击者信息 */
      attackerInfo: {
        /** 攻击者随从实例（可选） */
        attacker: undefined,
        /** 攻击随从所在位置索引 */
        position: undefined,
        /** 攻击随从所在阵营 */
        side: 'player',
      },
    }) as BattleStore,

  getters: {},

  actions: {
    // 开始战斗
    startBattle(player: BattleSideData, enemy: BattleSideData) {
      this.isBattleActive = true;
      this.battleLog = [];
      this.battleResult = {};
      this.friendlyPlayer = player;
      this.enemyPlayer = enemy;
      this.addBattleLog('战斗开始！');
    },
    // 设置攻击者信息
    setAttackerInfo(info: AttackerInfo) {
      this.attackerInfo = info;
    },

    // 结束战斗
    endBattle(result: any) {
      this.isBattleActive = false;
      this.battleResult = result;
      this.friendlyPlayer = undefined;
      this.enemyPlayer = undefined;
      this.attackerInfo = {
        attacker: undefined,
        position: undefined,
        side: 'player',
      };
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
