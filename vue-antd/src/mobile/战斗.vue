<template>
  <a-layout class="mobile-battle">
    <a-layout-content>
      <!-- 顶部战斗信息 -->
      <a-card class="battle-header-card" :bordered="true">
        <a-row justify="center" :gutter="[8, 8]">
          <a-col :span="24" class="text-center">
            <div class="battle-title">战斗进行中</div>
            <div class="battle-round">第 {{ currentRound }} 回合</div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 战斗区域 -->
      <a-card class="battle-area-card" :bordered="true" style="margin-top: 8px;">
        <!-- 敌人区域 -->
        <a-row :gutter="[8, 8]">
          <a-col :span="24">
            <div class="character-card enemy-card">
              <div class="character-avatar enemy-avatar">
                <span class="enemy-icon">👹</span>
              </div>
              <div class="character-info">
                <div class="character-name enemy-name">{{ currentEnemy.name }}</div>
                <div class="character-level">Lv.{{ currentEnemy.level }}</div>
                <div class="health-bar-container">
                  <div class="health-label">生命</div>
                  <a-progress 
                    :percent="(currentEnemy.health / currentEnemy.maxHealth) * 100" 
                    :show-info="false" 
                    :stroke-color="{ '0%': '#ff4d4f', '100%': '#52c41a' }"
                    size="small"
                  />
                  <div class="health-text">{{ currentEnemy.health }}/{{ currentEnemy.maxHealth }}</div>
                </div>
                <div class="character-stats">
                  <span class="stat-item">攻击: {{ currentEnemy.attack }}</span>
                  <span class="stat-item">防御: {{ currentEnemy.defense }}</span>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>

        <!-- 战斗指示器 -->
        <a-row justify="center" :gutter="[8, 8]">
          <a-col :span="24" class="text-center">
            <div class="battle-indicator">
              <div class="indicator-arrow" :class="{ 'player-turn': currentTurn === 'player', 'enemy-turn': currentTurn === 'enemy' }">
                {{ currentTurn === 'player' ? '玩家回合' : '敌人回合' }}
              </div>
            </div>
          </a-col>
        </a-row>

        <!-- 玩家区域 -->
        <a-row :gutter="[8, 8]">
          <a-col :span="24">
            <div class="character-card player-card">
              <div class="character-info">
                <div class="character-name player-name">{{ player.name }}</div>
                <div class="character-level">Lv.{{ player.level }}</div>
                <div class="health-bar-container">
                  <div class="health-label">生命</div>
                  <a-progress 
                    :percent="(player.attributes.health / player.attributes.maxHealth) * 100" 
                    :show-info="false" 
                    :stroke-color="{ '0%': '#ff4d4f', '100%': '#52c41a' }"
                    size="small"
                  />
                  <div class="health-text">{{ player.attributes.health }}/{{ player.attributes.maxHealth }}</div>
                </div>
                <div class="character-stats">
                  <span class="stat-item">攻击: {{ player.attributes.attack }}</span>
                  <span class="stat-item">防御: {{ player.attributes.defense }}</span>
                </div>
              </div>
              <div class="character-avatar player-avatar">
                <span class="player-icon">👤</span>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 战斗日志 -->
      <a-card class="battle-log-card" :bordered="true" style="margin-top: 8px;" title="战斗日志">
        <div class="battle-log" ref="logRef">
          <div v-for="(log, index) in battleLogs" :key="index" class="log-entry">
            <span class="log-text">{{ log }}</span>
          </div>
        </div>
      </a-card>

      <!-- 战斗操作按钮 -->
      <a-card class="battle-actions-card" :bordered="true" style="margin-top: 8px;">
        <a-row :gutter="[8, 8]">
          <a-col :span="12">
            <a-button type="primary" :disabled="currentTurn !== 'player'" @click="attackEnemy" size="small" block>
              普通攻击
            </a-button>
          </a-col>
          <a-col :span="12">
            <a-button type="default" :disabled="currentTurn !== 'player'" @click="useSkill" size="small" block>
              使用技能
            </a-button>
          </a-col>
        </a-row>
        <a-row :gutter="[8, 8]" style="margin-top: 8px;">
          <a-col :span="12">
            <a-button type="default" :disabled="currentTurn !== 'player'" @click="useItem" size="small" block>
              使用道具
            </a-button>
          </a-col>
          <a-col :span="12">
            <a-button type="default" :disabled="currentTurn !== 'player'" @click="escapeBattle" size="small" block>
              逃跑
            </a-button>
          </a-col>
        </a-row>
      </a-card>

      <!-- 技能选择弹窗 -->
      <a-modal v-model:open="showSkillModal" title="选择技能" size="small" footer="null">
        <div class="skill-selection">
          <div class="skill-item">
            <div class="skill-name">普通攻击</div>
            <div class="skill-desc">对敌人造成基础伤害</div>
            <div class="skill-cost">消耗: 0灵气</div>
          </div>
        </div>
        <template #footer>
          <a-button type="primary" @click="selectSkill">确定</a-button>
          <a-button @click="showSkillModal = false">取消</a-button>
        </template>
      </a-modal>

      <!-- 道具选择弹窗 -->
      <a-modal v-model:open="showItemModal" title="选择道具" size="small" footer="null">
        <div class="item-selection">
          <div class="item-item">
            <div class="item-name">治疗药水</div>
            <div class="item-desc">恢复少量生命值</div>
            <div class="item-count">数量: 1</div>
          </div>
        </div>
        <template #footer>
          <a-button type="primary" @click="selectItem">确定</a-button>
          <a-button @click="showItemModal = false">取消</a-button>
        </template>
      </a-modal>

      <!-- 战斗结果弹窗 -->
      <a-modal v-model:open="showResultModal" :title="battleResult.title" size="small">
        <div class="battle-result">
          <div class="result-icon">{{ battleResult.icon }}</div>
          <div class="result-message">{{ battleResult.message }}</div>
          <div v-if="battleResult.exp > 0" class="result-reward">
            <div class="reward-item">获得经验: {{ battleResult.exp }}</div>
            <div class="reward-item">获得物品: {{ battleResult.items.join(', ') }}</div>
          </div>
        </div>
        <template #footer>
          <a-button type="primary" @click="endBattle">确定</a-button>
        </template>
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useGameStore } from '../store/gameStore';

const gameStore = useGameStore();

// 响应式数据
const showSkillModal = ref(false);
const showItemModal = ref(false);
const showResultModal = ref(false);
const logRef = ref<HTMLElement | null>(null);

// 战斗状态
const currentRound = ref(1);
const currentTurn = ref<'player' | 'enemy'>('player');
const battleLogs = ref<string[]>([
  '战斗开始！',
  '玩家准备战斗...'
]);

// 战斗结果
const battleResult = ref({
  title: '',
  icon: '',
  message: '',
  exp: 0,
  items: [] as string[]
});

// 计算属性
const player = computed(() => gameStore.player);
const currentMonster = computed(() => gameStore.currentMonster);
const currentEnemy = computed(() => {
  if (currentMonster.value) {
    // 如果是Monster类型，属性在attributes中
    return {
      name: currentMonster.value.name,
      level: currentMonster.value.level,
      health: currentMonster.value.attributes.health,
      maxHealth: currentMonster.value.attributes.maxHealth,
      attack: currentMonster.value.attributes.attack,
      defense: currentMonster.value.attributes.defense
    };
  } else {
    // 默认敌人
    return {
      name: '未知怪物',
      level: 1,
      health: 100,
      maxHealth: 100,
      attack: 10,
      defense: 5
    };
  }
});

// 战斗操作方法
const attackEnemy = () => {
  if (currentTurn.value !== 'player') return;
  
  // 模拟攻击
  const damage = Math.max(0, player.value.attributes.attack - currentEnemy.value.defense);
  
  addBattleLog(`玩家对 ${currentEnemy.value.name} 造成了 ${damage} 点伤害！`);
  
  // 检查敌人是否死亡
  if (currentEnemy.value.health - damage <= 0) {
    endBattleVictory();
    return;
  }
  
  // 切换到敌人回合
  currentTurn.value = 'enemy';
  addBattleLog(`${currentEnemy.value.name} 的回合！`);
  
  // 敌人攻击
  setTimeout(() => {
    enemyAttack();
  }, 1000);
};

const enemyAttack = () => {
  const damage = Math.max(0, currentEnemy.value.attack - player.value.attributes.defense);
  
  addBattleLog(`${currentEnemy.value.name} 对玩家造成了 ${damage} 点伤害！`);
  
  // 检查玩家是否死亡
  if (player.value.attributes.health - damage <= 0) {
    endBattleDefeat();
    return;
  }
  
  // 切换到玩家回合
  currentTurn.value = 'player';
  currentRound.value++;
  addBattleLog(`回合 ${currentRound.value}，玩家的回合！`);
};

const useSkill = () => {
  if (currentTurn.value !== 'player') return;
  showSkillModal.value = true;
};

const selectSkill = () => {
  showSkillModal.value = false;
  // TODO: 实现技能使用逻辑
  addBattleLog(`玩家使用了技能！`);
  
  // 切换到敌人回合
  currentTurn.value = 'enemy';
  addBattleLog(`${currentEnemy.value.name} 的回合！`);
  
  setTimeout(() => {
    enemyAttack();
  }, 1000);
};

const useItem = () => {
  if (currentTurn.value !== 'player') return;
  showItemModal.value = true;
};

const selectItem = () => {
  showItemModal.value = false;
  // TODO: 实现道具使用逻辑
  addBattleLog(`玩家使用了道具！`);
  
  // 切换到敌人回合
  currentTurn.value = 'enemy';
  addBattleLog(`${currentEnemy.value.name} 的回合！`);
  
  setTimeout(() => {
    enemyAttack();
  }, 1000);
};

const escapeBattle = () => {
  if (currentTurn.value !== 'player') return;
  
  // 逃跑成功率
  const escapeChance = 0.5;
  if (Math.random() < escapeChance) {
    addBattleLog(`玩家成功逃跑了！`);
    endBattleEscape();
  } else {
    addBattleLog(`玩家逃跑失败！`);
    
    // 敌人攻击
    currentTurn.value = 'enemy';
    addBattleLog(`${currentEnemy.value.name} 的回合！`);
    
    setTimeout(() => {
      enemyAttack();
    }, 1000);
  }
};

// 战斗结束
const endBattleVictory = () => {
  battleResult.value = {
    title: '战斗胜利',
    icon: '🎉',
    message: `你击败了 ${currentEnemy.value.name}！`,
    exp: 100,
    items: ['治疗药水', '灵气丹']
  };
  showResultModal.value = true;
};

const endBattleDefeat = () => {
  battleResult.value = {
    title: '战斗失败',
    icon: '💀',
    message: `你被 ${currentEnemy.value.name} 击败了！`,
    exp: 0,
    items: []
  };
  showResultModal.value = true;
};

const endBattleEscape = () => {
  battleResult.value = {
    title: '成功逃跑',
    icon: '🏃',
    message: '你成功逃离了战斗！',
    exp: 0,
    items: []
  };
  showResultModal.value = true;
};

const endBattle = () => {
  showResultModal.value = false;
  gameStore.endBattle();
};

// 战斗日志
const addBattleLog = (message: string) => {
  battleLogs.value.push(message);
  
  // 滚动到底部
  nextTick(() => {
    if (logRef.value) {
      logRef.value.scrollTop = logRef.value.scrollHeight;
    }
  });
};

// 初始化
onMounted(() => {
  addBattleLog(`遭遇了 ${currentEnemy.value.name}！`);
});
</script>

<style scoped>
.mobile-battle {
  width: 100%;
  height: 100vh;
  padding: 8px;
  box-sizing: border-box;
  background-color: #f0f2f5;
  overflow-y: auto;
}

/* 顶部战斗信息 */
.battle-header-card {
  padding: 10px;
  text-align: center;
}

.battle-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.battle-round {
  font-size: 12px;
  color: #666;
}

/* 战斗区域 */
.battle-area-card {
  padding: 10px;
}

.character-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 4px;
}

.enemy-card {
  flex-direction: row;
}

.player-card {
  flex-direction: row-reverse;
}

.character-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.enemy-avatar {
  background-color: #ffe58f;
  border: 2px solid #ffc53d;
}

.player-avatar {
  background-color: #bae7ff;
  border: 2px solid #69c0ff;
}

.character-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.character-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.enemy-name {
  color: #cf1322;
}

.player-name {
  color: #1890ff;
}

.character-level {
  font-size: 12px;
  color: #666;
}

.health-bar-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.health-label {
  font-size: 10px;
  color: #999;
}

.health-text {
  font-size: 10px;
  color: #999;
  text-align: right;
}

.character-stats {
  display: flex;
  gap: 10px;
  font-size: 10px;
  color: #666;
}

.stat-item {
  background-color: #ffffff;
  padding: 2px 6px;
  border-radius: 10px;
}

/* 战斗指示器 */
.battle-indicator {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.indicator-arrow {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.player-turn {
  background-color: #1890ff;
}

.enemy-turn {
  background-color: #cf1322;
}

/* 战斗日志 */
.battle-log-card {
  height: 120px;
}

.battle-log-card .ant-card-body {
  padding: 0;
  height: calc(100% - 48px);
}

.battle-log {
  height: 100%;
  overflow-y: auto;
  font-size: 12px;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
}

.log-entry {
  padding: 4px 6px;
  background-color: #fafafa;
  border-radius: 4px;
}

/* 战斗操作 */
.battle-actions-card {
  padding: 10px;
}

.battle-actions-card .ant-btn {
  font-size: 12px;
  padding: 8px 0;
}

/* 技能和道具选择 */
.skill-selection, .item-selection {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.skill-item, .item-item {
  padding: 8px;
  background-color: #fafafa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.skill-item:hover, .item-item:hover {
  background-color: #e6f7ff;
}

.skill-name, .item-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.skill-desc, .item-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.skill-cost, .item-count {
  font-size: 10px;
  color: #999;
}

/* 战斗结果 */
.battle-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
}

.result-icon {
  font-size: 32px;
}

.result-message {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.result-reward {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: #666;
}

.reward-item {
  background-color: #fafafa;
  padding: 4px 8px;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .mobile-battle {
    padding: 6px;
  }

  .battle-header-card, .battle-area-card, .battle-log-card, .battle-actions-card {
    margin-bottom: 6px;
  }

  .character-avatar {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .character-card {
    padding: 8px;
    gap: 8px;
  }

  .battle-log-card {
    height: 100px;
  }
}
</style>
