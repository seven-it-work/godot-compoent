import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { CombatManagerClass } from "@/v1/combat/impl";
import { CultivatorClass } from "@/v1/cultivator/impl";
import type { Location } from "@/v1/location/define";
import { CombatStatus } from "@/v1/combat/define";
import type { CombatResult } from "@/v1/combat/define";

/**
 * 战斗状态管理Store
 */
export const useCombatStore = defineStore("combat", () => {
  // 战斗管理器实例
  const combatManager = reactive(new CombatManagerClass());

  // 当前战斗状态
  const combatStatus = ref(CombatStatus.NOT_STARTED);

  // 当前战斗结果
  const combatResult = ref<CombatResult | null>(null);

  // 战斗日志
  const combatLog = ref<string[]>([]);

  // 玩家和敌人
  const player = ref<CultivatorClass | null>(null);
  const enemy = ref<CultivatorClass | null>(null);
  const location = ref<Location | null>(null);

  // 是否正在战斗
  const isCombatActive = computed(() => {
    return (
      (combatStatus.value === CombatStatus.IN_PROGRESS ||
        combatStatus.value === CombatStatus.PLAYER_VICTORY ||
        combatStatus.value === CombatStatus.PLAYER_DEFEAT ||
        combatStatus.value === CombatStatus.DRAW) &&
      player.value !== null &&
      enemy.value !== null
    );
  });

  // 当前回合
  const currentRound = ref(1);

  // 当前行动
  const currentAction = ref<string>("");

  // 战斗日志（为了兼容CombatPage.vue中的combatLogs）
  const combatLogs = computed(() => {
    return combatLog.value;
  });

  /**
   * 开始战斗
   * @param _player 玩家
   * @param _enemy 敌人
   * @param _location 战斗地点
   */
  const startCombat = (
    _player: Cultivator,
    _enemy: Cultivator,
    _location: Location
  ) => {
    player.value = _player;
    enemy.value = _enemy;
    location.value = _location;

    combatManager.startCombat(_player, _enemy, _location);
    combatStatus.value = combatManager.getCombatStatus();
    combatLog.value = combatManager.getCombatLog();
    currentRound.value = 1;
    currentAction.value = "战斗开始";
  };

  /**
   * 执行战斗回合
   */
  const executeRound = () => {
    if (combatStatus.value === CombatStatus.IN_PROGRESS) {
      combatManager.executeCombatRound();
      combatStatus.value = combatManager.getCombatStatus();
      combatLog.value = combatManager.getCombatLog();
      currentRound.value++;
      currentAction.value = "战斗进行中";

      // 检查战斗是否结束
      if (combatStatus.value !== CombatStatus.IN_PROGRESS) {
        combatResult.value = combatManager.getCombatResult();
        currentAction.value = "战斗结束";
      }
    }
  };

  /**
   * 结束战斗
   */
  const endCombat = () => {
    const result = combatManager.endCombat();
    combatResult.value = result;
    combatStatus.value = result.status;
    return result;
  };

  /**
   * 获取当前战斗状态
   */
  const getCombatStatus = () => {
    return combatManager.getCombatStatus();
  };

  /**
   * 获取当前战斗结果
   */
  const getCombatResult = () => {
    return combatManager.getCombatResult();
  };

  /**
   * 获取战斗日志
   */
  const getCombatLog = () => {
    return combatManager.getCombatLog();
  };

  return {
    // 状态
    combatManager,
    combatStatus,
    combatResult,
    combatLog,
    combatLogs,
    player,
    enemy,
    location,
    isCombatActive,
    currentRound,
    currentAction,

    // 方法
    startCombat,
    endCombat,
    executeRound,
    getCombatStatus,
    getCombatResult,
    getCombatLog,
  };
});
