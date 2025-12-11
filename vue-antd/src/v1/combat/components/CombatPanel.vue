<template>
  <div class="combat-panel">
    <div class="combat-header">
      <h2>战斗界面</h2>
      <a-button v-if="combatStatus === CombatStatus.IN_PROGRESS" type="primary" @click="handleFlee">逃跑</a-button>
      <a-button v-else type="primary" @click="$emit('close')">关闭</a-button>
    </div>

    <div class="combat-info">
      <div class="location-info">
        <span>战斗地点：{{ location?.name }}</span>
      </div>
      <div class="round-info">
        <span>当前回合：{{ combatManager.currentRound }}</span>
      </div>
    </div>

    <div class="combatants">
      <!-- 玩家信息 -->
      <div class="combatant player">
        <div class="combatant-header">
          <h3>{{ player?.name }}</h3>
          <div class="realm">{{ player?.realmLevel.currentValue }}层</div>
        </div>
        <div class="combatant-stats">
          <div class="stat">
            <span class="label">气血：</span>
            <a-progress 
              :percent="getHpPercent(player)" 
              :format="(percent) => `${player?.qiBlood.currentValue}/${player?.qiBlood.maxValue}`" 
              status="active"
            />
          </div>
          <div class="stat">
            <span class="label">灵力：</span>
            <a-progress 
              :percent="getSpiritPowerPercent(player)" 
              :format="(percent) => `${player?.spiritPower.currentValue}/${player?.spiritPower.maxValue}`" 
              status="active"
              stroke-color="#52c41a"
            />
          </div>
        </div>
      </div>

      <!-- VS -->
      <div class="vs">VS</div>

      <!-- 敌人信息 -->
      <div class="combatant enemy">
        <div class="combatant-header">
          <h3>{{ enemy?.name }}</h3>
          <div class="realm">{{ enemy?.realmLevel.currentValue }}层</div>
        </div>
        <div class="combatant-stats">
          <div class="stat">
            <span class="label">气血：</span>
            <a-progress 
              :percent="getHpPercent(enemy)" 
              :format="(percent) => `${enemy?.qiBlood.currentValue}/${enemy?.qiBlood.maxValue}`" 
              status="active"
            />
          </div>
          <div class="stat">
            <span class="label">灵力：</span>
            <a-progress 
              :percent="getSpiritPowerPercent(enemy)" 
              :format="(percent) => `${enemy?.spiritPower.currentValue}/${enemy?.spiritPower.maxValue}`" 
              status="active"
              stroke-color="#52c41a"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 战斗日志 -->
    <div class="combat-log">
      <h3>战斗日志</h3>
      <div class="log-content">
        <div v-for="(log, index) in combatLog" :key="index" class="log-entry">
          {{ log }}
        </div>
      </div>
    </div>

    <!-- 战斗结果 -->
    <div v-if="combatResult" class="combat-result">
      <h3>{{ getResultText() }}</h3>
      <div v-if="combatResult.status === CombatStatus.PLAYER_VICTORY" class="rewards">
        <h4>获得奖励：</h4>
        <div class="reward-item">经验：{{ combatResult.rewards.experience }}</div>
        <div class="reward-item">灵气：{{ combatResult.rewards.spiritQi }}</div>
        <div v-if="combatResult.rewards.items.length > 0" class="reward-item">
          物品：{{ combatResult.rewards.items.join(', ') }}
        </div>
      </div>
    </div>

    <!-- 战斗控制按钮 -->
    <div v-if="combatStatus === CombatStatus.IN_PROGRESS" class="combat-controls">
      <a-button type="primary" size="large" @click="executeNextRound">继续战斗</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useCombatStore } from "../impl";
import type { Cultivator } from "@/v1/cultivator/define";
import type { Location } from "@/v1/location/define";
import { CombatStatus } from "../define";
import type { CombatParticipant } from "../define";
import type { CombatManagerClass } from "../impl";

// Props
interface Props {
  player: Cultivator;
  enemy: Cultivator;
  location: Location;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
  combatEnd: [result: any];
}>();

// Store
const combatStore = useCombatStore();

// 战斗管理器
const combatManager = computed(() => combatStore.combatManager as CombatManagerClass);

// 战斗状态
const combatStatus = computed(() => combatStore.getCombatStatus());

// 战斗结果
const combatResult = computed(() => combatStore.getCombatResult());

// 战斗日志
const combatLog = computed(() => combatStore.getCombatLog());

// 玩家和敌人
const player = computed(() => props.player);
const enemy = computed(() => props.enemy);
const location = computed(() => props.location);

// 初始化战斗
combatStore.startCombat(props.player, props.enemy, props.location);

// 监听战斗状态变化
watch(combatStatus, (newStatus) => {
  if (newStatus !== CombatStatus.IN_PROGRESS && combatResult.value) {
    emit('combatEnd', combatResult.value);
  }
});

/**
 * 计算气血百分比
 */
const getHpPercent = (participant: CombatParticipant | undefined) => {
  if (!participant) return 0;
  return (participant.qiBlood.currentValue / participant.qiBlood.maxValue) * 100;
};

/**
 * 计算灵力百分比
 */
const getSpiritPowerPercent = (participant: CombatParticipant | undefined) => {
  if (!participant) return 0;
  return (participant.spiritPower.currentValue / participant.spiritPower.maxValue) * 100;
};

/**
 * 执行下一回合
 */
const executeNextRound = () => {
  // 模拟战斗过程
  setTimeout(() => {
    // 战斗管理器会自动执行回合
    combatManager.value.executeCombatRound();
  }, 500);
};

/**
 * 获取战斗结果文本
 */
const getResultText = () => {
  if (!combatResult.value) return '';
  
  switch (combatResult.value.status) {
    case CombatStatus.PLAYER_VICTORY:
      return '战斗胜利！';
    case CombatStatus.PLAYER_DEFEAT:
      return '战斗失败！';
    case CombatStatus.DRAW:
      return '战斗平局！';
    default:
      return '战斗结束';
  }
};

/**
 * 逃跑
 */
const handleFlee = () => {
  const result = combatStore.endCombat();
  emit('combatEnd', result);
};
</script>

<style scoped>
.combat-panel {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.combat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.combat-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f0f2f5;
  border-radius: 4px;
}

.combatants {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.combatant {
  flex: 1;
  padding: 15px;
  border-radius: 8px;
  background-color: #fafafa;
}

.combatant.player {
  border: 2px solid #1890ff;
}

.combatant.enemy {
  border: 2px solid #ff4d4f;
}

.combatant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.combatant-header h3 {
  margin: 0;
  font-size: 18px;
}

.realm {
  padding: 2px 8px;
  background-color: #1890ff;
  color: #fff;
  border-radius: 10px;
  font-size: 12px;
}

.enemy .realm {
  background-color: #ff4d4f;
}

.combatant-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat .label {
  min-width: 60px;
  font-weight: bold;
}

.vs {
  font-size: 32px;
  font-weight: bold;
  color: #ff4d4f;
  margin: 0 20px;
}

.vs {
  font-size: 32px;
  font-weight: bold;
  color: #ff4d4f;
  margin: 0 20px;
}

.combat-log {
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 10px;
}

.combat-log h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.log-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.log-entry {
  font-size: 14px;
  line-height: 1.5;
}

.combat-result {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f0f9ff;
  border-radius: 8px;
  text-align: center;
}

.combat-result h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #1890ff;
}

.rewards {
  margin-top: 15px;
  text-align: left;
}

.rewards h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.reward-item {
  margin-bottom: 5px;
  font-size: 14px;
}

.combat-controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
