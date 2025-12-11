<template>
  <div class="combat-page">
    <h2>战斗系统</h2>
    <div v-if="!combatStore.isCombatActive">
      <p>没有正在进行的战斗</p>
      <a-button type="primary" @click="router.push('/')">返回地图</a-button>
    </div>
    <div v-else>
      <!-- 战斗参与者信息 -->
      <div class="combat-participants">
        <div class="participant player">
          <h3>玩家</h3>
          <p>姓名: {{ player.name }}</p>
          <p>境界: {{ player.getCultivationLevelName() }}</p>
          <p>
            气血: {{ player.qiBlood.currentValue }}/{{
              player.qiBlood.maxRange
            }}
          </p>
          <p>
            灵力: {{ player.spiritPower.currentValue }}/{{
              player.spiritPower.maxRange
            }}
          </p>
          <p>攻击: {{ player.attack.currentValue }}</p>
          <p>防御: {{ player.defense.currentValue }}</p>
        </div>
        <div class="participant enemy">
          <h3>敌人</h3>
          <p>姓名: {{ enemy.name }}</p>
          <p>等级: {{ enemy.realmLevel.currentValue }}</p>
          <p>境界: {{ enemy.getCultivationLevelName() }}</p>
          <p>
            气血: {{ enemy.qiBlood.currentValue }}/{{ enemy.qiBlood.maxRange }}
          </p>
          <p>
            灵力: {{ enemy.spiritPower.currentValue }}/{{
              enemy.spiritPower.maxRange
            }}
          </p>
          <p>攻击: {{ enemy.attack.currentValue }}</p>
          <p>防御: {{ enemy.defense.currentValue }}</p>
        </div>
      </div>

      <!-- 战斗信息 -->
      <div class="combat-info">
        <h3>战斗状态</h3>
        <p>状态: {{ getCombatStatusText(combatStore.combatStatus) }}</p>
        <p>回合: {{ combatStore.currentRound }}</p>
        <p v-if="combatStore.currentAction">
          当前行动: {{ combatStore.currentAction }}
        </p>
      </div>

      <!-- 战斗日志 -->
      <div class="combat-log">
        <h3>战斗日志</h3>
        <div class="log-container">
          <div
            v-for="(log, index) in combatStore.combatLogs"
            :key="index"
            class="log-entry"
          >
            {{ log }}
          </div>
        </div>
      </div>

      <!-- 战斗控制 -->
      <div class="combat-controls">
        <a-button
          type="primary"
          @click="combatStore.startCombat()"
          v-if="combatStore.combatStatus === 'NOT_STARTED'"
        >
          开始战斗
        </a-button>
        <div
          v-if="combatStore.combatStatus === 'IN_PROGRESS'"
          class="round-controls"
        >
          <a-button type="primary" @click="combatStore.executeRound()">
            执行回合
          </a-button>
          <a-switch
            v-model:checked="isAutoFighting"
            @change="handleAutoFightChange"
            class="auto-fight-switch"
          >
            <template #checkedChildren>自动中</template>
            <template #unCheckedChildren>手动中</template>
          </a-switch>
        </div>
        <a-button
          type="default"
          @click="router.push('/')"
          v-if="
            combatStore.combatStatus === CombatStatus.PLAYER_VICTORY ||
            combatStore.combatStatus === CombatStatus.PLAYER_DEFEAT ||
            combatStore.combatStatus === CombatStatus.DRAW
          "
        >
          返回地图
        </a-button>
      </div>

      <!-- 战斗结果 -->
      <div
        v-if="
          combatStore.combatStatus === CombatStatus.PLAYER_VICTORY ||
          combatStore.combatStatus === CombatStatus.PLAYER_DEFEAT ||
          combatStore.combatStatus === CombatStatus.DRAW
        "
        class="combat-result"
      >
        <h3>战斗结果</h3>
        <p>
          结果:
          {{
            combatStore.combatStatus === CombatStatus.PLAYER_VICTORY
              ? "胜利"
              : combatStore.combatStatus === CombatStatus.PLAYER_DEFEAT
                ? "失败"
                : "平局"
          }}
        </p>
        <p v-if="combatStore.combatResult?.rewards.experience">
          获得经验: {{ combatStore.combatResult?.rewards.experience }}
        </p>
        <p v-if="combatStore.combatResult?.rewards.spiritQi">
          获得灵力: {{ combatStore.combatResult?.rewards.spiritQi }}
        </p>
        <p
          v-if="
            combatStore.combatResult?.rewards.items &&
            combatStore.combatResult.rewards.items.length > 0
          "
        >
          获得物品: {{ combatStore.combatResult?.rewards.items.join(", ") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useCombatStore } from "@/stores/combat";
import { CombatStatus } from "@/v1/combat/define";
import type { Cultivator } from "@/v1/cultivator/define";

const router = useRouter();
const combatStore = useCombatStore();

// 自动战斗状态
const isAutoFighting = ref(false);
// 自动战斗定时器
let autoFightInterval: number | null = null;
// 自动战斗间隔时间（毫秒）
const autoFightIntervalMs = ref(1000);

// 确保在战斗进行中时，player和enemy不为null
const player = computed<Cultivator>(() => {
  if (!combatStore.player) {
    throw new Error("Player should not be null when combat is active");
  }
  return combatStore.player;
});

const enemy = computed<Cultivator>(() => {
  if (!combatStore.enemy) {
    throw new Error("Enemy should not be null when combat is active");
  }
  return combatStore.enemy;
});

/**
 * 获取战斗状态文本
 */
const getCombatStatusText = (status: CombatStatus): string => {
  const statusMap: Record<CombatStatus, string> = {
    NOT_STARTED: "未开始",
    IN_PROGRESS: "进行中",
    COMPLETED: "已结束",
    CANCELLED: "已取消",
  };
  return statusMap[status] || "未知";
};

/**
 * 处理自动战斗开关变化
 */
const handleAutoFightChange = (checked: boolean) => {
  if (checked) {
    startAutoFighting();
  } else {
    stopAutoFighting();
  }
};

/**
 * 开始自动战斗
 */
const startAutoFighting = () => {
  if (autoFightInterval) return;

  // 设置定时器，自动执行战斗回合
  autoFightInterval = window.setInterval(() => {
    // 检查战斗状态是否仍在进行中
    if (combatStore.combatStatus === "IN_PROGRESS") {
      combatStore.executeRound();
    } else {
      // 战斗已结束，停止自动战斗
      stopAutoFighting();
    }
  }, autoFightIntervalMs.value);
};

/**
 * 停止自动战斗
 */
const stopAutoFighting = () => {
  if (autoFightInterval) {
    window.clearInterval(autoFightInterval);
    autoFightInterval = null;
  }
};

// 组件卸载时清理定时器
onUnmounted(() => {
  stopAutoFighting();
});
</script>

<style scoped>
.combat-page {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.combat-participants {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.participant {
  padding: 15px;
  border-radius: 8px;
  width: 40%;
}

.player {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}

.enemy {
  background-color: #fff1f0;
  border: 1px solid #ffccc7;
}

.combat-info,
.combat-log,
.combat-result {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.log-container {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  background-color: #fff;
}

.log-entry {
  margin-bottom: 5px;
  padding: 5px;
  border-bottom: 1px solid #eee;
}

.combat-controls {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.round-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auto-fight-switch {
  margin-left: 10px;
}
</style>
