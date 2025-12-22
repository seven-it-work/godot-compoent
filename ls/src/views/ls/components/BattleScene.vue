<template>
  <div class="battle-scene">
    <div class="battle-main">
      <!-- 敌方区域：左侧 -->
      <div class="battle-side enemy-side">
        <!-- 7个随从位置，从上到下排列 -->
        <div class="battle-card-row" v-for="i in 7" :key="`enemy-${i}`">
          <BattleCard
            :card-id="`enemy-slot-${i}`"
            :data="enemyMinions[i - 1]"
            :is-enemy="true"
          ></BattleCard>
        </div>
      </div>

      <!-- 玩家区域：右侧 -->
      <div class="battle-side player-side">
        <!-- 7个随从位置，从上到下排列 -->

        <div class="battle-card-row" v-for="i in 7" :key="`player-${i}`">
          <BattleCard
            :card-id="`player-slot-${i}`"
            :data="playerMinions[i - 1]"
            :is-enemy="false"
          ></BattleCard>
        </div>
      </div>
    </div>

    <!-- 底部战斗信息 -->
    <div class="battle-info">
      <div class="battle-controls">
        <div>
          敌人队伍
          <div>生命值：{{ enemyHealth }}</div>
          <div>护甲值：{{ enemyArmor }}</div>
        </div>
        <div class="battle-action-area">
          <button @click="showLogModal = true">查看战斗日志</button>
        </div>
        <div>
          玩家队伍
          <div>生命值：{{ playerHealth }}</div>
          <div>护甲值：{{ playerArmor }}</div>
        </div>
      </div>
    </div>

    <!-- 战斗结果弹窗 -->
    <Modal v-model:open="showResultModal" title="战斗结果" :footer="null" width="600px">
      <div v-if="internalBattleResult" class="battle-result-content">
        <div class="result-winner">
          <h3>
            胜利者:
            <span
              :class="
                internalBattleResult.winner === 'player'
                  ? 'winner-player'
                  : internalBattleResult.winner === 'enemy'
                    ? 'winner-enemy'
                    : 'winner-draw'
              "
            >
              {{
                internalBattleResult.winner === 'player'
                  ? '玩家'
                  : internalBattleResult.winner === 'enemy'
                    ? '敌方'
                    : '平局'
              }}
            </span>
          </h3>
        </div>
        <div class="result-stats">
          <div class="stat-item">
            <strong>剩余随从:</strong>
            <span
              >玩家 {{ internalBattleResult.playerMinionsLeft }} / 敌方
              {{ internalBattleResult.enemyMinionsLeft }}</span
            >
          </div>
          <div class="stat-item">
            <strong>生命值变化:</strong>
            <span
              >玩家 {{ internalBattleResult.playerHealthChange }} / 敌方
              {{ internalBattleResult.enemyHealthChange }}</span
            >
          </div>
        </div>
        <div class="result-buttons">
          <Button type="primary" @click="showResultModal = false">关闭</Button>
        </div>
      </div>
    </Modal>

    <!-- 战斗日志弹窗 -->
    <Modal v-model:open="showLogModal" title="战斗日志" :footer="null" width="800px" height="600px">
      <div class="battle-log-content">
        <div v-if="internalBattleLog.length > 0" class="log-list">
          <div v-for="(log, index) in internalBattleLog" :key="index" class="log-item">
            {{ index + 1 }}. {{ log }}
          </div>
        </div>
        <div v-else class="no-log">暂无战斗日志</div>
        <div class="log-buttons">
          <Button type="primary" @click="showLogModal = false">关闭</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Modal, Button } from 'ant-design-vue';
import BattleCard from './BattleCard.vue';
import { BattleManager, type BattleResult } from '../../../game/BattleManager';

// 接收外部传入的参数
const props = withDefaults(
  defineProps<{
    enemyMinions: any[];
    playerMinions: any[];
    enemyHealth: number;
    enemyArmor: number;
    playerHealth: number;
    playerArmor: number;
    autoStart?: boolean;
    playerTavernLevel?: number;
    enemyTavernLevel?: number;
  }>(),
  {
    enemyMinions: () => Array(7).fill(null),
    playerMinions: () => Array(7).fill(null),
    enemyHealth: 30,
    enemyArmor: 0,
    playerHealth: 30,
    playerArmor: 0,
    autoStart: false,
    playerTavernLevel: 1,
    enemyTavernLevel: 1,
  }
);

// 定义事件
const emit = defineEmits<{
  (e: 'exit-battle'): void;
  (e: 'battle-completed', result: BattleResult, log: string[]): void;
}>();

// 弹窗状态
const showResultModal = ref(false);
const showLogModal = ref(false);
// 战斗状态
const isBattleRunning = ref(false);
// 内部战斗结果和日志
const internalBattleResult = ref<BattleResult | null>(null);
const internalBattleLog = ref<string[]>([]);

// 执行战斗
const executeBattle = () => {
  console.log('开始执行战斗');
  isBattleRunning.value = true;
  internalBattleLog.value = ['开始战斗...'];
  internalBattleResult.value = null;

  // 记录当前状态
  internalBattleLog.value.push(
    `玩家随从数量: ${props.playerMinions.filter((m: any) => m !== null).length}`
  );
  internalBattleLog.value.push(
    `敌方随从数量: ${props.enemyMinions.filter((m: any) => m !== null).length}`
  );

  // 执行战斗
  const result = BattleManager.executeBattle(
    props.playerMinions,
    props.enemyMinions,
    props.playerTavernLevel,
    props.enemyTavernLevel
  );

  // 更新战斗结果
  internalBattleResult.value = result;

  // 记录战斗结果
  internalBattleLog.value.push(`战斗结束！`);
  internalBattleLog.value.push(
    `胜利者: ${result.winner === 'player' ? '玩家' : result.winner === 'enemy' ? '敌方' : '平局'}`
  );
  internalBattleLog.value.push(`玩家剩余随从: ${result.playerMinionsLeft}`);
  internalBattleLog.value.push(`敌方剩余随从: ${result.enemyMinionsLeft}`);
  internalBattleLog.value.push(`玩家生命值变化: ${result.playerHealthChange}`);
  internalBattleLog.value.push(`敌方生命值变化: ${result.enemyHealthChange}`);

  // 显示战斗结果弹窗
  showResultModal.value = true;

  // 通知父组件战斗完成
  emit('battle-completed', result, internalBattleLog.value);

  isBattleRunning.value = false;
  console.log('战斗结束', result);
};

// 组件挂载时，如果autoStart为true，则自动执行战斗
onMounted(() => {
  if (props.autoStart) {
    executeBattle();
  }
});

// 暴露方法给父组件
defineExpose({
  executeBattle,
});
</script>

<style scoped>
.battle-scene {
  width: 100vw;
  height: 100vh;
  background-color: #1a1a2e;
  color: white;
  overflow: auto;
}

/* 中部对战区域 */
.battle-main {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 2% 0;
  background: radial-gradient(circle at center, #1a1a2e 0%, #0f0f1e 100%);
}

.battle-side {
  width: 45%;
  height: 90%;
  display: flex;
  flex-direction: column;
  gap: 1%;
  border-radius: 12px;
  padding: 2%;
  box-sizing: border-box;
}

.enemy-side {
  border: 4px solid #e74c3c;
  background: linear-gradient(180deg, #641e16 0%, #922b21 100%);
}

.player-side {
  border: 4px solid #3498db;
  background: linear-gradient(180deg, #154360 0%, #1f618d 100%);
}

.battle-card-row {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 底部战斗信息 */
.battle-info {
  background: linear-gradient(0deg, #16213e 0%, #0f3460 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.battle-controls {
  display: flex;
  gap: 20px;
  align-items: center;
}

/* 战斗按钮区域 */
.battle-action-area {
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: center;
}

.battle-action-area button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 120px;
}

.battle-action-area button:hover:not(:disabled) {
  background-color: #2980b9;
}

.battle-action-area button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
}

/* 战斗结果弹窗样式 */
:deep(.battle-result-content) {
  color: #333;
}

:deep(.result-winner) {
  text-align: center;
  margin-bottom: 20px;
}

:deep(.result-winner h3) {
  margin: 0;
  font-size: 24px;
  color: #e67e22;
}

:deep(.winner-player) {
  color: #2ecc71;
  font-weight: bold;
}

:deep(.winner-enemy) {
  color: #e74c3c;
  font-weight: bold;
}

:deep(.winner-draw) {
  color: #f1c40f;
  font-weight: bold;
}

:deep(.result-stats) {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

:deep(.stat-item) {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
}

:deep(.stat-item:last-child) {
  margin-bottom: 0;
}

:deep(.result-buttons) {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 战斗日志弹窗样式 */
:deep(.battle-log-content) {
  max-height: 400px;
  overflow-y: auto;
}

:deep(.log-list) {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
}

:deep(.log-item) {
  padding: 5px 0;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
  line-height: 1.5;
}

:deep(.log-item:last-child) {
  border-bottom: none;
}

:deep(.no-log) {
  text-align: center;
  color: #999;
  padding: 20px;
}

:deep(.log-buttons) {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}
</style>
