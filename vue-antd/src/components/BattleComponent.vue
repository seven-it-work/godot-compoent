<template>
  <div class="battle-component">
    <a-card title="战斗系统" class="battle-card">
      <!-- 战斗信息 -->
      <div class="battle-info">
        <h2>战斗进行中</h2>
        <p>{{ currentLocationName }}</p>
      </div>

      <!-- 战斗双方 -->
      <div class="battle-participants">
        <!-- 玩家信息 -->
        <a-card title="修仙者" class="participant-card player-card">
          <div class="participant-info">
            <div class="participant-name">你</div>
            <div class="participant-level">等级: {{ player.level }}</div>
            
            <!-- 生命值 -->
            <div class="health-bar-container">
              <span class="health-label">神魂强度:</span>
              <a-progress
                :percent="calculateHealthPercent(player.attributes.health, player.attributes.maxHealth)"
                :stroke-color="playerHealthColor"
                :show-info="false"
              />
              <span class="health-value">
                {{ player.attributes.health }} / {{ player.attributes.maxHealth }}
              </span>
            </div>

            <!-- 战斗属性 -->
            <div class="battle-attributes">
              <div class="attribute-item">
                <span class="attribute-label">灵力攻击:</span>
                <span class="attribute-value">{{ player.attributes.attack }}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">灵力防御:</span>
                <span class="attribute-value">{{ player.attributes.defense }}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">身法:</span>
                <span class="attribute-value">{{ player.attributes.dodge }}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">灵力护盾:</span>
                <span class="attribute-value">{{ player.attributes.block }}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">灵眼:</span>
                <span class="attribute-value">{{ player.attributes.critical }}</span>
              </div>
            </div>
          </div>
        </a-card>

        <!-- VS 标记 -->
        <div class="vs-mark">VS</div>

        <!-- 怪物信息 -->
        <a-card title="怪物" class="participant-card monster-card" v-if="currentMonster">
          <div class="participant-info">
            <div class="participant-name">{{ currentMonster.name }}</div>
            <div class="participant-level">等级: {{ currentMonster.level }}</div>
            
            <!-- 生命值 -->
            <div class="health-bar-container">
              <span class="health-label">神魂强度:</span>
              <a-progress
                :percent="calculateHealthPercent(currentMonster.attributes.health, currentMonster.attributes.maxHealth)"
                :stroke-color="monsterHealthColor"
                :show-info="false"
              />
              <span class="health-value">
                {{ currentMonster.attributes.health }} / {{ currentMonster.attributes.maxHealth }}
              </span>
            </div>

            <!-- 战斗属性 -->
            <div class="battle-attributes">
              <div class="attribute-item">
                <span class="attribute-label">灵力攻击:</span>
                <span class="attribute-value">{{ currentMonster.attributes.attack }}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">灵力防御:</span>
                <span class="attribute-value">{{ currentMonster.attributes.defense }}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">身法:</span>
                <span class="attribute-value">{{ currentMonster.attributes.dodge }}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">灵力护盾:</span>
                <span class="attribute-value">{{ currentMonster.attributes.block }}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">灵眼:</span>
                <span class="attribute-value">{{ currentMonster.attributes.critical }}</span>
              </div>
            </div>
          </div>
        </a-card>
      </div>

      <!-- 战斗日志 -->
      <a-card title="战斗日志" class="battle-logs-card">
        <div class="battle-logs-container">
          <div
            v-for="log in battleLogs"
            :key="log.id"
            class="battle-log"
            :class="`log-type-${log.type}`"
          >
            {{ log.text }}
          </div>
        </div>
      </a-card>

      <!-- 战斗操作 -->
      <div class="battle-actions" v-if="isPlayerTurn && !battleResult">
        <a-space size="large" wrap>
          <a-button type="primary" size="large" @click="handleAttack" icon="attack">
            攻击
          </a-button>
          <a-button type="default" size="large" @click="handleDefend" icon="shield">
            防御
          </a-button>
          <a-button type="default" size="large" @click="handleEscape" icon="swap">
            逃跑
          </a-button>
        </a-space>
      </div>

      <!-- 战斗结果 -->
      <div class="battle-result" v-if="battleResult">
        <h3>{{ getBattleResultText }}</h3>
        <a-button type="primary" size="large" @click="endBattle" icon="back">
          {{ battleResult === 'win' ? '继续探索' : '返回地图' }}
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../store/gameStore';

const gameStore = useGameStore();

// 获取玩家信息
const player = computed(() => gameStore.player);

// 获取当前怪物
const currentMonster = computed(() => gameStore.currentMonster);

// 获取当前地点名称
const currentLocationName = computed(() => gameStore.player.currentLocation.name);

// 获取战斗日志
const battleLogs = computed(() => gameStore.battleLogs);

// 获取战斗结果
const battleResult = computed(() => gameStore.battleState.battleResult);

// 获取当前回合
const isPlayerTurn = computed(() => gameStore.battleState.isPlayerTurn);

// 计算生命值百分比
const calculateHealthPercent = (current: number, max: number): number => {
  return Math.floor((current / max) * 100);
};

// 玩家生命值颜色
const playerHealthColor = computed(() => {
  const percent = calculateHealthPercent(player.value.attributes.health, player.value.attributes.maxHealth);
  if (percent > 60) return '#52c41a';
  if (percent > 30) return '#faad14';
  return '#f5222d';
});

// 怪物生命值颜色
const monsterHealthColor = computed(() => {
  if (!currentMonster.value) return '#52c41a';
  const percent = calculateHealthPercent(
    currentMonster.value.attributes.health,
    currentMonster.value.attributes.maxHealth
  );
  if (percent > 60) return '#52c41a';
  if (percent > 30) return '#faad14';
  return '#f5222d';
});

// 获取战斗结果文本
const getBattleResultText = computed(() => {
  switch (battleResult.value) {
    case 'win':
      return '战斗胜利！';
    case 'lose':
      return '战斗失败！';
    case 'escape':
      return '成功逃脱！';
    default:
      return '';
  }
});

// 攻击
const handleAttack = () => {
  gameStore.playerAttack();
};

// 防御
const handleDefend = () => {
  gameStore.playerDefend();
};

// 逃跑
const handleEscape = () => {
  gameStore.playerEscape();
};

// 结束战斗
const endBattle = () => {
  gameStore.endBattle();
};
</script>

<style scoped>
.battle-component {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.battle-card {
  background-color: #fafafa;
}

.battle-info {
  text-align: center;
  margin-bottom: 20px;
}

.battle-info h2 {
  color: #f5222d;
  margin-bottom: 5px;
}

.battle-participants {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.participant-card {
  flex: 1;
  max-width: 45%;
}

.player-card {
  border-color: #1890ff;
}

.monster-card {
  border-color: #f5222d;
}

.vs-mark {
  font-size: 32px;
  font-weight: bold;
  color: #faad14;
}

.participant-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.participant-name {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
}

.participant-level {
  text-align: center;
  color: #666;
  margin-bottom: 10px;
}

.health-bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.health-label {
  width: 80px;
  font-weight: bold;
  color: #666;
}

.health-value {
  width: 100px;
  text-align: right;
  font-weight: bold;
}

.battle-attributes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attribute-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.attribute-label {
  color: #666;
}

.attribute-value {
  font-weight: bold;
  color: #1890ff;
}

.battle-logs-card {
  margin-bottom: 20px;
  max-height: 300px;
  overflow: auto;
}

.battle-logs-container {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 10px;
}

.battle-log {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #f0f0f0;
}

.log-type-player {
  background-color: #e6f7ff;
  border-left: 4px solid #1890ff;
}

.log-type-monster {
  background-color: #fff1f0;
  border-left: 4px solid #f5222d;
}

.log-type-system {
  background-color: #fff7e6;
  border-left: 4px solid #faad14;
  font-weight: bold;
}

.battle-actions {
  text-align: center;
  margin-bottom: 20px;
}

.battle-result {
  text-align: center;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
}

.battle-result h3 {
  margin-bottom: 20px;
  color: #1890ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .battle-component {
    padding: 10px;
  }

  .battle-participants {
    flex-direction: column;
    gap: 15px;
  }

  .participant-card {
    max-width: 100%;
  }

  .vs-mark {
    font-size: 24px;
  }

  .health-bar-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .health-label {
    width: auto;
  }

  .health-value {
    width: auto;
    text-align: left;
  }

  .battle-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .battle-actions a-button {
    width: 100%;
  }
}
</style>