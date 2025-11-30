<template>
  <a-layout class="mobile-battle">
    <a-layout-content>
      <!-- 顶部战斗信息 -->
      <compact-card class="battle-header-card" :bordered="true">
        <a-row justify="center" :gutter="[8, 8]">
          <a-col :span="24" class="text-center">
            <div class="battle-title">战斗进行中</div>
            <div class="battle-round">第 {{ currentRound }} 回合</div>
          </a-col>
        </a-row>
      </compact-card>

      <!-- 战斗区域 -->
      <compact-card class="battle-area-card" :bordered="true" style="margin-top: 8px;">
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
                <div class="health-bar-container" ref="currentEnemyHealthBar">
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
                <div class="health-bar-container" ref="playerHealthBar">
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
      </compact-card>

      <!-- 战斗日志 -->
      <compact-card class="battle-log-card" :bordered="true" style="margin-top: 8px;" title="战斗日志">
        <div class="battle-log" ref="logRef">
          <div 
            v-for="(log, index) in battleLogs" 
            :key="index" 
            class="log-entry" 
            :class="`${log.type}-action`"
            v-html="log.message"
          ></div>
        </div>
      </compact-card>

      <!-- 战斗操作按钮 -->
      <compact-card class="battle-actions-card" :bordered="true" style="margin-top: 8px;">
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
        <a-row :gutter="[6, 6]" style="margin-top: 4px;">
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
      </compact-card>

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
      <a-modal v-model:open="showResultModal" :title="battleResult.title" size="small" :mask-closable="false" :closable="false">
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
import { useRouter } from 'vue-router';
import { useGameStore } from '../store/gameStore';
import CompactCard from './components/CompactCard.vue';

const gameStore = useGameStore();
const router = useRouter();

// 生命值条的引用
const playerHealthBar = ref<HTMLElement | null>(null);
const currentEnemyHealthBar = ref<HTMLElement | null>(null);

// 响应式数据
const showSkillModal = ref(false);
const showItemModal = ref(false);
const showResultModal = ref(false);
const logRef = ref<HTMLElement | null>(null);

// 战斗状态
const currentRound = ref(1);
const currentTurn = ref<'player' | 'enemy'>('player');

// 战斗日志接口定义
interface BattleLogEntry {
  message: string;
  type: 'player' | 'enemy' | 'system';
}

// 使用带类型的战斗日志数组
const battleLogs = ref<BattleLogEntry[]>([
  { message: '战斗开始！', type: 'system' },
  { message: '玩家准备战斗...', type: 'player' }
]);

// 战斗结果
const battleResult = ref({
  title: '',
  icon: '',
  message: '',
  exp: 0,
  items: [] as string[]
});

// 计算属性 - 使用正确的方式获取player和currentMonster
const currentEnemy = computed(() => {
  // 优先使用store中的当前怪物
  if (gameStore.battleState?.currentMonster) {
    return {
      name: gameStore.battleState.currentMonster.name,
      level: gameStore.battleState.currentMonster.level,
      health: gameStore.battleState.currentMonster.attributes.health,
      maxHealth: gameStore.battleState.currentMonster.attributes.maxHealth,
      attack: gameStore.battleState.currentMonster.attributes.attack,
      defense: gameStore.battleState.currentMonster.attributes.defense
    };
  }
  // 如果没有store中的怪物，使用模拟数据
  return {
    name: '未知怪物',
    level: 1,
    health: tempEnemyHealth !== null ? tempEnemyHealth : 100,
    maxHealth: 100,
    attack: 10,
    defense: 5
  };
});

// 计算属性 - 获取player信息
const player = computed(() => ({
  name: gameStore.player.name,
  level: gameStore.player.level,
  attributes: {
    health: gameStore.player.attributes.health,
    maxHealth: gameStore.player.attributes.maxHealth,
    attack: gameStore.player.attributes.attack,
    defense: gameStore.player.attributes.defense
  }
}));

// 计算属性 - 生命值百分比（为未来可能的需求保留）
// const playerHealthPercentage = computed(() => {
//   if (!player.value || !player.value.attributes) return 0;
//   const { health, maxHealth } = player.value.attributes;
//   return (health / maxHealth) * 100;
// });

// const enemyHealthPercentage = computed(() => {
//   if (!currentEnemy.value) return 0;
//   const { health, maxHealth } = currentEnemy.value;
//   return (health / maxHealth) * 100;
// });

// 战斗操作方法
const attackEnemy = () => {
  if (currentTurn.value !== 'player') return;
  
  const player = gameStore.player;
  
  // 模拟攻击
  const damage = Math.max(0, player.attributes.attack - currentEnemy.value.defense);
  
  // 更新敌人生命值 - 使用gameStore中的currentMonster
  if (gameStore.battleState?.currentMonster) {
    gameStore.battleState.currentMonster.attributes.health = Math.max(
      0,
      gameStore.battleState.currentMonster.attributes.health - damage
    );
  } else {
    // 如果没有store中的怪物，使用临时变量跟踪
    if (tempEnemyHealth === null) {
      tempEnemyHealth = currentEnemy.value.health;
    }
    tempEnemyHealth = Math.max(0, tempEnemyHealth - damage);
  }
  
  // 添加视觉反馈 - 显示伤害数值
  showDamage(currentEnemyHealthBar.value, damage, 'enemy');
  
  addBattleLog(`玩家对 ${currentEnemy.value.name} 造成了 ${damage} 点伤害！`, 'player');
  
  // 检查敌人是否死亡
  if ((gameStore.battleState?.currentMonster && 
       gameStore.battleState.currentMonster.attributes.health <= 0) || 
      (tempEnemyHealth !== null && tempEnemyHealth <= 0)) {
    endBattleVictory();
    return;
  }
  
  // 切换到敌人回合
  currentTurn.value = 'enemy';
  addBattleLog(`${currentEnemy.value.name} 的回合！`, 'system');
  
  // 敌人攻击
  setTimeout(() => {
    enemyAttack();
  }, 1000);
};

// 临时存储敌人生命值，用于没有通过store获取的情况
let tempEnemyHealth: number | null = null;

// 显示伤害数值的函数 - 优化版本
const showDamage = (element: HTMLElement | null, damage: number, target: 'player' | 'enemy') => {
  if (!element) return;
  
  // 找到父容器而不是直接用health bar
  const container = element.closest('.character-info') || element.parentNode;
  if (!container) return;
  
  const damageElement = document.createElement('div');
  damageElement.classList.add('damage-popup');
  damageElement.textContent = damage.toString();
  damageElement.style.position = 'absolute';
  damageElement.style.fontSize = '18px'; // 更大的字体
  damageElement.style.fontWeight = 'bold';
  damageElement.style.color = '#ff4444';
  damageElement.style.pointerEvents = 'none';
  damageElement.style.zIndex = '1000';
  damageElement.style.left = '50%';
  damageElement.style.top = '30%'; // 稍微靠上一点，更明显
  damageElement.style.transform = 'translate(-50%, -50%)';
  damageElement.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
  damageElement.style.whiteSpace = 'nowrap';
  damageElement.style.background = 'rgba(0,0,0,0.3)';
  damageElement.style.padding = '2px 8px';
  damageElement.style.borderRadius = '4px';
  
  // 添加伤害元素到DOM
  (container as HTMLElement).appendChild(damageElement);
  
  // 动画效果 - 更明显的浮动和渐隐
  setTimeout(() => {
    damageElement.style.transition = 'all 1s cubic-bezier(0.215, 0.610, 0.355, 1.000)'; // 缓动函数使动画更自然
    damageElement.style.opacity = '0';
    damageElement.style.transform = target === 'player' 
      ? 'translate(-50%, -200%) scale(1.2)' 
      : 'translate(-50%, -200%) scale(1.2)';
  }, 10);
  
  // 移除元素
  setTimeout(() => {
    if (damageElement.parentNode) {
      damageElement.parentNode.removeChild(damageElement);
    }
  }, 1200);
};

const enemyAttack = () => {
  const player = gameStore.player;
  const damage = Math.max(0, currentEnemy.value.attack - player.attributes.defense);
  
  // 更新玩家生命值 - 直接修改player对象的生命值
  player.attributes.health = Math.max(
    0,
    player.attributes.health - damage
  );
  
  // 添加视觉反馈 - 显示伤害数值
  showDamage(playerHealthBar.value, damage, 'player');
  
  addBattleLog(`${currentEnemy.value.name} 对玩家造成了 ${damage} 点伤害！`, 'enemy');
  
  // 检查玩家是否死亡
  if (player.attributes.health <= 0) {
    endBattleDefeat();
    return;
  }
  
  // 切换到玩家回合
  currentTurn.value = 'player';
  currentRound.value++;
  addBattleLog(`回合 ${currentRound.value}，玩家的回合！`, 'system');
};

const useSkill = () => {
  if (currentTurn.value !== 'player') return;
  showSkillModal.value = true;
};

const selectSkill = () => {
  showSkillModal.value = false;
  // TODO: 实现技能使用逻辑
  addBattleLog(`玩家使用了技能！`, 'player');
  
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
  addBattleLog(`玩家使用了道具！`, 'player');
  
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
    addBattleLog(`玩家成功逃跑了！`, 'player');
    endBattleEscape();
  } else {
    addBattleLog(`玩家逃跑失败！`, 'player');
    
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
  
  // 使用gameStore的endBattle方法结束战斗
  gameStore.endBattle();
  
  // 根据战斗结果进行不同处理
  if (battleResult.value.title === '战斗失败') {
    // 战斗失败，重置玩家信息并重新开始游戏
    console.log('战斗失败，重置玩家信息并重新开始游戏');
    gameStore.resetPlayer();
    // 跳转到开始游戏页面
    router.push('/mobile/'); 
  } else if (battleResult.value.title === '战斗胜利' || battleResult.value.title === '成功逃跑') {
    // 战斗胜利或逃跑成功，返回玩家详情页面
    console.log('返回玩家详情页面');
    router.push('/mobile/player-detail'); 
  }
};

// 战斗日志管理函数 - 带类型标识
const addBattleLog = (message: string, type: 'player' | 'enemy' | 'system' = 'system') => {
  let formattedMessage = message;
  
  // 为伤害信息添加特殊格式
  if (message.includes('造成了') && message.includes('点伤害')) {
    // 提取伤害值
    const damageMatch = message.match(/造成了\s*(\d+)\s*点伤害/);
    if (damageMatch && damageMatch[1]) {
      const damage = damageMatch[1];
      // 为伤害数字添加特殊标记，便于在CSS中样式化
      formattedMessage = message.replace(`造成了 ${damage} 点伤害`, `造成了 <span class="damage-number">${damage}</span> 点伤害`);
    }
  }
  
  // 添加带类型的日志条目
  battleLogs.value.push({ message: formattedMessage, type });
  
  // 自动滚动到底部
  nextTick(() => {
    if (logRef.value) {
      logRef.value.scrollTop = logRef.value.scrollHeight;
    }
  });
};

// 初始化
onMounted(() => {
  addBattleLog(`遭遇了 ${currentEnemy.value.name}！`, 'system');
});
</script>

<style scoped>
.mobile-battle {
  width: 100%;
  height: 100vh;
  padding: 4px;
  box-sizing: border-box;
  background-color: #f0f2f5;
  overflow-y: auto;
}

/* 顶部战斗信息 */
.battle-header-card {
  padding: 6px;
  text-align: center;
  margin-bottom: 2px;
}

.battle-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.battle-round {
  font-size: 11px;
  color: #666;
}

/* 战斗区域 */
.battle-area-card {
  padding: 6px;
  margin-bottom: 2px;
}

.character-card {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  background-color: #fafafa;
  border-radius: 4px;
  margin-bottom: 4px;
}

.enemy-card {
  flex-direction: row;
}

.player-card {
  flex-direction: row-reverse;
}

.character-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.enemy-avatar {
  background-color: #ffe58f;
  border: 1px solid #ffc53d;
}

.player-avatar {
  background-color: #bae7ff;
  border: 1px solid #69c0ff;
}

.character-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.character-name {
  font-size: 13px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.enemy-name {
  color: #cf1322;
}

.player-name {
  color: #1890ff;
}

.character-level {
  font-size: 11px;
  color: #666;
}

.health-bar-container {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.health-label {
  font-size: 9px;
  color: #999;
}

.health-text {
  font-size: 9px;
  color: #999;
  text-align: right;
  white-space: nowrap;
}

.character-stats {
  display: flex;
  gap: 6px;
  font-size: 9px;
  color: #666;
}

.stat-item {
  background-color: #ffffff;
  padding: 1px 4px;
  border-radius: 8px;
  font-size: 8px;
  white-space: nowrap;
}

/* 战斗指示器 */
.battle-indicator {
  display: flex;
  justify-content: center;
  padding: 6px 0;
}

.indicator-arrow {
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 11px;
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
  height: 100px;
  margin-bottom: 2px;
}

.battle-log-card .card-body {
  padding: 0;
  height: calc(100% - 30px);
}

.battle-log {
  height: 100%;
  overflow-y: auto;
  font-size: 11px;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px;
}

.log-entry {
  padding: 3px 4px;
  background-color: #fafafa;
  border-radius: 3px;
}

/* 伤害数字特殊样式 */
  .damage-number {
    color: #ff4444;
    font-weight: bold;
    font-size: 14px;
    padding: 1px 4px;
    background-color: rgba(255, 68, 68, 0.1);
    border-radius: 3px;
    animation: pulse 0.5s ease;
    display: inline-block;
  }
  
  /* 玩家行动日志样式 */
  .log-entry.player-action {
    color: #4488ff;
    background-color: rgba(68, 136, 255, 0.1);
    border-left: 3px solid #4488ff;
  }
  
  /* 敌人行动日志样式 */
  .log-entry.enemy-action {
    color: #ff6666;
    background-color: rgba(255, 102, 102, 0.1);
    border-left: 3px solid #ff6666;
  }
  
  /* 系统信息日志样式 */
  .log-entry.system-action {
    color: #666666;
    background-color: rgba(102, 102, 102, 0.05);
    font-style: italic;
    border-left: 3px solid #cccccc;
  }
  
  /* 伤害数字脉动动画 */
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  
  /* 伤害弹出动画 */
  .damage-popup {
    animation: damageFloat 1.2s cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }
  
  @keyframes damageFloat {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -200%) scale(1.2);
    }
  }
  
  /* 日志条目过渡效果 */
  .log-entry {
    transition: all 0.3s ease;
  }
  
  /* 日志滚动优化 */
  .battle-log::-webkit-scrollbar {
    width: 4px;
  }
  
  .battle-log::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }
  
  .battle-log::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 2px;
  }
  
  .battle-log::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

/* 战斗操作 */
.battle-actions-card {
  padding: 6px;
}

.battle-actions-card .ant-btn {
  font-size: 11px;
  padding: 6px 0;
  height: auto;
}

/* 技能和道具选择 */
.skill-selection, .item-selection {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 180px;
  overflow-y: auto;
}

.skill-item, .item-item {
  padding: 6px;
  background-color: #fafafa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.skill-item:hover, .item-item:hover {
  background-color: #e6f7ff;
}

.skill-name, .item-name {
  font-size: 13px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.skill-desc, .item-desc {
  font-size: 11px;
  color: #666;
  margin-bottom: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.skill-cost, .item-count {
  font-size: 9px;
  color: #999;
}

/* 战斗结果 */
.battle-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px 0;
}

.result-icon {
  font-size: 28px;
}

.result-message {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  text-align: center;
  word-break: break-word;
  padding: 0 8px;
}

.result-reward {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 12px;
  color: #666;
  padding: 0 8px;
}

.reward-item {
  background-color: #fafafa;
  padding: 4px 8px;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .mobile-battle {
    padding: 2px !important;
  }

  .battle-header-card, .battle-area-card, .battle-log-card, .battle-actions-card {
    margin-bottom: 2px !important;
    padding: 0 !important;
  }

  .character-avatar {
    width: 45px !important;
    height: 45px !important;
    font-size: 18px !important;
  }

  .character-card {
    padding: 5px !important;
    gap: 4px !important;
  }

  .battle-log-card {
    height: 90px !important;
  }

  /* 确保所有元素不会溢出 */
  * {
    box-sizing: border-box;
    max-width: 100%;
  }

  /* 防止文字溢出 */
  .character-name, .battle-title, .skill-name, .item-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 确保按钮和卡片不会溢出屏幕 */
  .compact-card, .ant-btn {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>

