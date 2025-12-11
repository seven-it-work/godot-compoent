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
          <p>姓名: {{ combatStore.player?.name }}</p>
          <p>等级: {{ combatStore.player?.level.currentValue }}</p>
          <p>境界: {{ combatStore.player?.realm.currentValue }}</p>
          <p>气血: {{ combatStore.player?.qiBlood.currentValue }}/{{ combatStore.player?.qiBlood.maxRange }}</p>
          <p>灵力: {{ combatStore.player?.spirit.currentValue }}/{{ combatStore.player?.spirit.maxRange }}</p>
          <p>攻击: {{ combatStore.player?.attack.currentValue }}</p>
          <p>防御: {{ combatStore.player?.defense.currentValue }}</p>
        </div>
        <div class="participant enemy">
          <h3>敌人</h3>
          <p>姓名: {{ combatStore.enemy?.name }}</p>
          <p>等级: {{ combatStore.enemy?.level.currentValue }}</p>
          <p>境界: {{ combatStore.enemy?.realm.currentValue }}</p>
          <p>气血: {{ combatStore.enemy?.qiBlood.currentValue }}/{{ combatStore.enemy?.qiBlood.maxRange }}</p>
          <p>灵力: {{ combatStore.enemy?.spirit.currentValue }}/{{ combatStore.enemy?.spirit.maxRange }}</p>
          <p>攻击: {{ combatStore.enemy?.attack.currentValue }}</p>
          <p>防御: {{ combatStore.enemy?.defense.currentValue }}</p>
        </div>
      </div>

      <!-- 战斗信息 -->
      <div class="combat-info">
        <h3>战斗状态</h3>
        <p>状态: {{ getCombatStatusText(combatStore.combatStatus) }}</p>
        <p>回合: {{ combatStore.currentRound }}</p>
        <p v-if="combatStore.currentAction">当前行动: {{ combatStore.currentAction }}</p>
      </div>

      <!-- 战斗日志 -->
      <div class="combat-log">
        <h3>战斗日志</h3>
        <div class="log-container">
          <div v-for="(log, index) in combatStore.combatLogs" :key="index" class="log-entry">
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
        <a-button 
          type="primary" 
          @click="combatStore.executeRound()" 
          v-if="combatStore.combatStatus === 'IN_PROGRESS'"
        >
          执行回合
        </a-button>
        <a-button 
          type="default" 
          @click="router.push('/')" 
          v-if="combatStore.combatStatus === 'COMPLETED'"
        >
          返回地图
        </a-button>
      </div>

      <!-- 战斗结果 -->
      <div v-if="combatStore.combatStatus === 'COMPLETED'" class="combat-result">
        <h3>战斗结果</h3>
        <p>结果: {{ combatStore.combatResult?.result === 'VICTORY' ? '胜利' : '失败' }}</p>
        <p v-if="combatStore.combatResult?.expGained">获得经验: {{ combatStore.combatResult?.expGained }}</p>
        <p v-if="combatStore.combatResult?.spiritValueGained">获得灵力: {{ combatStore.combatResult?.spiritValueGained }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCombatStore } from "@/v1/combat/impl";
import { CombatStatus } from "@/v1/combat/define";

const router = useRouter();
const combatStore = useCombatStore();

/**
 * 获取战斗状态文本
 */
const getCombatStatusText = (status: CombatStatus): string => {
  const statusMap: Record<CombatStatus, string> = {
    NOT_STARTED: '未开始',
    IN_PROGRESS: '进行中',
    COMPLETED: '已结束',
    CANCELLED: '已取消'
  };
  return statusMap[status] || '未知';
};
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

.combat-info, .combat-log, .combat-result {
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
}
</style>