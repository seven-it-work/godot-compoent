<template>
  <a-layout class="mobile-battle">
    <a-layout-content>
      <!-- 顶部战斗信息 -->
      <compact-card class="battle-header-card" :bordered="true">
        <a-row justify="center" :gutter="[8, 8]">
          <a-col :span="24" class="text-center">
            <div class="battle-title">战斗进行中</div>
          </a-col>
        </a-row>
      </compact-card>

      <!-- 统一行动队列进度条 -->
      <compact-card class="action-queue-card" :bordered="true" style="margin-top: 8px">
        <div class="action-queue-title">行动队列</div>
        <div class="action-queue-container">
          <div class="action-queue-track">
            <div 
              v-for="character in actionQueue" 
              :key="character.id" 
              class="action-queue-character"
              :class="{ 
                'player-character': character.team === 'player',
                'enemy-character': character.team === 'enemy',
                'current-actor': character.id === currentActor?.id
              }"
              :style="{ left: `${character.progress}%` }"
            >
              <div class="character-name-tag">{{ character.name }}</div>
            </div>
          </div>
        </div>
      </compact-card>

      <!-- 战斗区域 -->
      <compact-card
        class="battle-area-card"
        :bordered="true"
        style="margin-top: 8px"
      >
        <!-- 敌人队伍 -->
        <div class="team-section enemy-team">
          <div class="team-title">敌人队伍</div>
          <div class="team-formation">
            <a-row 
              v-for="(row, rowIndex) in enemyTeam.positions" 
              :key="rowIndex" 
              class="formation-row"
            >
              <a-col 
                v-for="(position, colIndex) in row" 
                :key="colIndex" 
                :span="4" 
                class="formation-column"
              >
                <div 
                  class="formation-cell character-card enemy-card"
                  :class="{
                    'occupied': position.teammateId,
                    'active': currentActor?.id === position.teammateId
                  }"
                >
                  <div v-if="position.teammateId" class="teammate-info">
                    <div class="character-avatar enemy-avatar">
                      <span class="enemy-icon">👹</span>
                    </div>
                    <div class="character-info">
                      <div class="character-name enemy-name">
                        {{ getTeammate(enemyTeam.allTeammates, position.teammateId)?.name || '未知' }}
                      </div>
                      <div class="character-level">Lv.{{ getTeammate(enemyTeam.allTeammates, position.teammateId)?.level || 1 }}</div>

                      <!-- 生命值条 -->
                      <div class="health-bar-container">
                        <div class="health-label">生命</div>
                        <a-progress
                          :percent="getHealthPercent(enemyTeam.allTeammates, position.teammateId)"
                          :show-info="false"
                          :stroke-color="{ '0%': '#ff4d4f', '100%': '#52c41a' }"
                          size="small"
                        />
                        <div class="health-text">
                          {{ getHealth(enemyTeam.allTeammates, position.teammateId) }}
                        </div>
                      </div>
                      <div class="character-stats">
                        <span class="stat-item">攻: {{ getTeammate(enemyTeam.allTeammates, position.teammateId)?.attributes.attack || 0 }}</span>
                        <span class="stat-item">防: {{ getTeammate(enemyTeam.allTeammates, position.teammateId)?.attributes.defense || 0 }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="empty-cell">
                    <span>空</span>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>

        <!-- 战斗回合指示器已移除，新系统不再有明确回合 -->

        <!-- 玩家队伍 -->
        <div class="team-section player-team">
          <div class="team-title">玩家队伍</div>
          <div class="team-formation">
            <a-row 
              v-for="(row, rowIndex) in playerTeam.positions" 
              :key="rowIndex" 
              class="formation-row"
            >
              <a-col 
                v-for="(position, colIndex) in row" 
                :key="colIndex" 
                :span="4" 
                class="formation-column"
              >
                <div 
                  class="formation-cell character-card player-card"
                  :class="{
                    'occupied': position.teammateId,
                    'active': currentActor?.id === position.teammateId
                  }"
                >
                  <div v-if="position.teammateId" class="teammate-info">
                    <div class="character-avatar player-avatar">
                      <span class="player-icon">👤</span>
                    </div>
                    <div class="character-info">
                      <div class="character-name player-name">
                        {{ getTeammate(playerTeam.allTeammates, position.teammateId)?.name || '未知' }}
                      </div>
                      <div class="character-level">Lv.{{ getTeammate(playerTeam.allTeammates, position.teammateId)?.level || 1 }}</div>

                      <!-- 生命值条 -->
                      <div class="health-bar-container">
                        <div class="health-label">生命</div>
                        <a-progress
                          :percent="getHealthPercent(playerTeam.allTeammates, position.teammateId)"
                          :show-info="false"
                          :stroke-color="{ '0%': '#ff4d4f', '100%': '#52c41a' }"
                          size="small"
                        />
                        <div class="health-text">
                          {{ getHealth(playerTeam.allTeammates, position.teammateId) }}
                        </div>
                      </div>
                      <div class="character-stats">
                        <span class="stat-item">攻: {{ getTeammate(playerTeam.allTeammates, position.teammateId)?.attributes.attack || 0 }}</span>
                        <span class="stat-item">防: {{ getTeammate(playerTeam.allTeammates, position.teammateId)?.attributes.defense || 0 }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="empty-cell">
                    <span>空</span>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
      </compact-card>

      <!-- 战斗日志 -->
      <compact-card
        class="battle-log-card"
        :bordered="true"
        style="margin-top: 8px"
        title="战斗日志"
      >
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
      <compact-card
        class="battle-actions-card"
        :bordered="true"
        style="margin-top: 8px"
      >
        <a-row :gutter="[8, 8]">
          <a-col :span="12">
            <a-button
              type="primary"
              @click="performAttack"
              size="small"
              block
            >
              普通攻击
            </a-button>
          </a-col>
          <a-col :span="12">
            <a-button
              type="default"
              @click="useSkill"
              size="small"
              block
            >
              使用技能
            </a-button>
          </a-col>
        </a-row>
        <a-row :gutter="[6, 6]" style="margin-top: 4px">
          <a-col :span="12">
            <a-button
              type="default"
              @click="useItem"
              size="small"
              block
            >
              使用道具
            </a-button>
          </a-col>
          <a-col :span="12">
            <a-button
              type="default"
              @click="escapeBattle"
              size="small"
              block
            >
              逃跑
            </a-button>
          </a-col>
        </a-row>
      </compact-card>

      <!-- 技能选择弹窗 -->
      <a-modal
        v-model:open="showSkillModal"
        title="选择技能"
        size="small"
        footer="null"
      >
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
      <a-modal
        v-model:open="showItemModal"
        title="选择道具"
        size="small"
        footer="null"
      >
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
      <a-modal
        v-model:open="showResultModal"
        :title="battleResult.title"
        size="small"
        :mask-closable="false"
        :closable="false"
      >
        <div class="battle-result">
          <div class="result-icon">{{ battleResult.icon }}</div>
          <div class="result-message">{{ battleResult.message }}</div>
          <div v-if="battleResult.exp > 0" class="result-reward">
            <div class="reward-item">获得经验: {{ battleResult.exp }}</div>
            <div class="reward-item">
              获得物品: {{ battleResult.items.join(", ") }}
            </div>
          </div>
        </div>
        <template #footer>
          <a-button type="primary" block @click="handleResultModalClose">确定</a-button>
        </template>
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "../store/gameStore";
import CompactCard from "./components/CompactCard.vue";
// 临时类型定义，因为我们无法导入原始类型
type Teammate = {
  id: string;
  name: string;
  avatar?: string; // 将avatar设为可选属性
  attributes: {
    health: number;
    maxHealth: number;
    attack: number;
    defense: number;
    attackSpeed: number;
    [key: string]: number;
  };
  [key: string]: any;
};

type Team = {
  allTeammates: Teammate[];
  [key: string]: any;
};

const gameStore = useGameStore();
const router = useRouter();

// 生命值条的引用
// 移除未使用的DOM引用
// const playerHealthBar = ref<HTMLElement | null>(null);
// const currentEnemyHealthBar = ref<HTMLElement | null>(null);

// 响应式数据
const showSkillModal = ref(false);
const showItemModal = ref(false);
const showResultModal = ref(false);
const logRef = ref<HTMLElement | null>(null);

// 战斗状态
const battleStarted = ref(false);
const battleEnded = ref(false);
const isPaused = ref(false);

// 当前行动的角色
const currentActor = ref<{ id: string; team: "player" | "enemy" } | null>(null);

// 统一行动队列
interface ActionQueueCharacter {
  id: string;
  name: string;
  team: "player" | "enemy";
  attackSpeed: number;
  progress: number;
  originalCharacter: Teammate;
}

const actionQueue = ref<ActionQueueCharacter[]>([]);

// 战斗日志接口定义
interface BattleLogEntry {
  message: string;
  type: "player" | "enemy" | "system";
}

// 使用带类型的战斗日志数组
const battleLogs = ref<BattleLogEntry[]>([
  { message: "战斗开始！", type: "system" },
  { message: "玩家准备战斗...", type: "player" },
]);

// 战斗结果
const battleResult = ref({
  title: "",
  icon: "",
  message: "",
  exp: 0,
  items: [] as string[],
});

// 玩家队伍（使用gameStore中的队伍）
const playerTeam = computed(() => gameStore.team);

// 敌人队伍（模拟数据）
const enemyTeam = ref<Team>({
  positions: Array(3).fill(null).map((_, rowIndex) => 
    Array(6).fill(null).map((_, colIndex) => ({
      id: `enemy-pos-${rowIndex}-${colIndex}`,
      row: rowIndex,
      column: colIndex,
      teammateId: rowIndex === 0 && colIndex < 2 ? `enemy-${colIndex + 1}` : undefined
    }))
  ),
  allTeammates: [
    {
      id: "enemy-1",
      name: "敌人1",
      level: 5,
      attributes: {
        attack: 20,
        defense: 10,
        health: 150,
        maxHealth: 150,
        dodge: 5,
        block: 5,
        critical: 5,
        attackSpeed: 100 // 添加攻击速度属性
      },
      description: "一个强大的敌人",
      isPlayer: false
    },
    {
      id: "enemy-2",
      name: "敌人2",
      level: 4,
      attributes: {
        attack: 18,
        defense: 8,
        health: 120,
        maxHealth: 120,
        dodge: 8,
        block: 3,
        critical: 7,
        attackSpeed: 120 // 添加攻击速度属性
      },
      description: "一个快速的敌人",
      isPlayer: false
    }
  ],
  maxTeamSize: 18
});

// 移除未使用的计算属性
// const player = computed(() => ({
//   name: gameStore.player.name,
//   level: gameStore.player.level,
//   attributes: {
//     health: gameStore.player.attributes.health,
//     maxHealth: gameStore.player.attributes.maxHealth,
//     attack: gameStore.player.attributes.attack,
//     defense: gameStore.player.attributes.defense,
//     attackSpeed: gameStore.player.attributes.attackSpeed || 100 // 确保有攻击速度属性
//   },
// }));

// 获取队友信息
const getTeammate = (teammates: Teammate[], id: string) => {
  return teammates.find(t => t.id === id);
};

// 初始化统一行动队列
const initializeActionQueue = () => {
  const queue: ActionQueueCharacter[] = [];
  
  // 添加玩家队伍
  playerTeam.value.allTeammates.forEach(teammate => {
    if (teammate.attributes.health > 0) {
      queue.push({
        id: teammate.id,
        name: teammate.name,
        team: "player",
        attackSpeed: teammate.attributes.attackSpeed || 100,
        progress: 0,
        originalCharacter: teammate
      });
    }
  });
  
  // 添加敌人队伍
  enemyTeam.value.allTeammates.forEach((teammate: Teammate) => {
    if (teammate.attributes.health > 0) {
      queue.push({
        id: teammate.id,
        name: teammate.name,
        team: "enemy",
        attackSpeed: teammate.attributes.attackSpeed || 100,
        progress: 0,
        originalCharacter: teammate
      });
    }
  });
  
  actionQueue.value = queue;
};

// 获取生命值百分比
const getHealthPercent = (teammates: Teammate[], teammateId: string | undefined) => {
  if (!teammateId) return 0;
  const teammate = getTeammate(teammates, teammateId);
  if (!teammate) return 0;
  return (teammate.attributes.health / teammate.attributes.maxHealth) * 100;
};

// 获取生命值文本
const getHealth = (teammates: Teammate[], teammateId: string | undefined) => {
  if (!teammateId) return "0/0";
  const teammate = getTeammate(teammates, teammateId);
  if (!teammate) return "0/0";
  return `${teammate.attributes.health}/${teammate.attributes.maxHealth}`;
};

// 执行攻击
const performAttack = (attacker: ActionQueueCharacter) => {
  // 确定攻击目标
  const targetTeam = attacker.team === "player" ? enemyTeam.value.allTeammates : playerTeam.value.allTeammates;
  const aliveTargets = targetTeam.filter(target => target.attributes.health > 0);
  
  if (aliveTargets.length === 0) {
    // 战斗结束
    handleEndBattle(attacker.team === "player");
    return;
  }
  
  const targetIndex = Math.floor(Math.random() * aliveTargets.length);
  const target = aliveTargets[targetIndex];
  
  if (target) {
    // 计算伤害
    const damage = Math.max(0, attacker.originalCharacter.attributes.attack - target.attributes.defense);
    target.attributes.health = Math.max(0, target.attributes.health - damage);
    
    // 记录战斗日志
    battleLogs.value.push({
      message: `${attacker.name} 对 ${target.name} 造成了 ${damage} 点伤害！`,
      type: attacker.team
    });
  }
  
  // 检查战斗是否结束
  const allEnemiesDead = enemyTeam.value.allTeammates.every(enemy => enemy.attributes.health <= 0);
  const allPlayersDead = playerTeam.value.allTeammates.every(player => player.attributes.health <= 0);
  
  if (allEnemiesDead) {
    handleEndBattle(true);
  } else if (allPlayersDead) {
    handleEndBattle(false);
  }
  
  // 重置攻击者的进度
  attacker.progress = 0;
  
  // 结束当前行动
  currentActor.value = null;
  isPaused.value = false;
};

// 更新行动进度
const updateActionProgress = () => {
  if (isPaused.value || battleEnded.value) return;
  
  // 更新所有角色的进度
  actionQueue.value.forEach(character => {
    // 只更新活着的角色
    if (character.originalCharacter.attributes.health <= 0) return;
    
    character.progress += character.attackSpeed * 0.1;
  });
  
  // 检查是否有角色进度达到或超过100%
  const readyCharacters = actionQueue.value.filter(char => char.progress >= 100);
  
  if (readyCharacters.length > 0) {
    // 随机选择一个就绪的角色
    const randomIndex = Math.floor(Math.random() * readyCharacters.length);
    const actingCharacter = readyCharacters[randomIndex];
    
    if (actingCharacter) {
      // 开始行动
      isPaused.value = true;
      currentActor.value = { id: actingCharacter.id, team: actingCharacter.team };
      
      battleLogs.value.push({
        message: `${actingCharacter.name} 发起攻击！`,
        type: actingCharacter.team
      });
      
      // 执行攻击
      setTimeout(() => {
        performAttack(actingCharacter);
      }, 1000);
    }
  }
};

// 战斗循环定时器
let battleLoopInterval: number | null = null;

// 开始战斗循环
const startBattleLoop = () => {
  if (battleLoopInterval) return;
  
  battleStarted.value = true;
  initializeActionQueue();
  
  battleLoopInterval = window.setInterval(() => {
    updateActionProgress();
  }, 100);
};

// 结束战斗
const handleEndBattle = (victory: boolean) => {
  battleEnded.value = true;
  stopBattleLoop();
  
  // 设置战斗结果
  battleResult.value = {
    title: victory ? "战斗胜利" : "战斗失败",
    icon: victory ? "check-circle" : "close-circle",
    message: victory ? "你成功击败了所有敌人！" : "你被敌人击败了！",
    exp: victory ? 100 : 0,
    items: victory ? ["治疗药水", "金币 x 50"] : []
  };
  
  // 显示战斗结果
  showResultModal.value = true;
  
  // 记录战斗日志
  battleLogs.value.push({
    message: victory ? "战斗胜利！" : "战斗失败！",
    type: "system"
  });
};

// 停止战斗循环
const stopBattleLoop = () => {
  if (battleLoopInterval) {
    clearInterval(battleLoopInterval);
    battleLoopInterval = null;
  }
};

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

// 攻击敌人函数 - 暂时注释掉，因为它使用了不存在的currentEnemy变量
/*
const attackEnemy = () => {
  if (currentTurn.value !== "player") return;

  const player = gameStore.player;

  // 模拟攻击 - 伤害计算公式：攻击力减去目标防御力
  const damage = Math.max(
    0,
    player.attributes.attack - currentEnemy.value.defense
  );

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
  showDamage(currentEnemyHealthBar.value, damage, "enemy");

  addBattleLog(
    `玩家对 ${currentEnemy.value.name} 造成了 ${damage} 点伤害！`,
    "player"
  );

  // 检查敌人是否死亡
  if (
    (gameStore.battleState?.currentMonster &&
      gameStore.battleState.currentMonster.attributes.health <= 0) ||
    (tempEnemyHealth !== null && tempEnemyHealth <= 0)
  ) {
    endBattleVictory();
    return;
  }

  // 切换到敌人回合
  currentTurn.value = "enemy";
  addBattleLog(`敌人的回合！`, "system");

  // 敌人攻击
  setTimeout(() => {
    // enemyAttack();
  }, 1000);
};
*/

// 攻击函数 - 新的战斗系统（暂时未使用）
  /*
const attack = (attackerId: string, attackerTeam: "player" | "enemy") => {
  // 获取攻击者
  const attacker = attackerTeam === "player"
    ? getTeammate(playerTeam.value.allTeammates, attackerId)
    : getTeammate(enemyTeam.value.allTeammates, attackerId);
  
  if (!attacker) return;
  
  // 获取目标（简单实现：攻击对方队伍的第一个角色）
  const targetTeam = attackerTeam === "player" ? enemyTeam.value.allTeammates : playerTeam.value.allTeammates;
  const target = targetTeam.find((teammate: Teammate) => teammate.attributes.health > 0);
  
  if (!target) return;
  
  // 计算伤害
  const damage = Math.max(0, attacker.attributes.attack - target.attributes.defense);
  
  // 更新目标生命值
  target.attributes.health = Math.max(0, target.attributes.health - damage);
  
  // 添加战斗日志
  addBattleLog(`${attacker.name} 对 ${target.name} 造成了 ${damage} 点伤害！`, attackerTeam);
  
  // 检查目标是否死亡
  if (target.attributes.health <= 0) {
    addBattleLog(`${target.name} 被击败了！`, "system");
    
    // 检查是否所有敌人都死亡
    if (attackerTeam === "player" && enemyTeam.value.allTeammates.every((teammate: Teammate) => teammate.attributes.health <= 0)) {
      endBattleVictory();
    }
    
    // 检查是否所有玩家都死亡
    if (attackerTeam === "enemy" && playerTeam.value.allTeammates.every((teammate: Teammate) => teammate.attributes.health <= 0)) {
      endBattleDefeat();
    }
  }
};
  */

// 临时存储敌人生命值，用于没有通过store获取的情况
// let tempEnemyHealth: number | null = null;

// 显示伤害数值的函数 - 优化版本
// const showDamage = (
//   element: HTMLElement | null,
//   damage: number,
//   target: "player" | "enemy"
// ) => {
//   if (!element) return;

//   // 找到父容器而不是直接用health bar
//   const container = element.closest(".character-info") || element.parentNode;
//   if (!container) return;

//   const damageElement = document.createElement("div");
//   damageElement.classList.add("damage-popup");
//   damageElement.textContent = damage.toString();
//   damageElement.style.position = "absolute";
//   damageElement.style.fontSize = "18px"; // 更大的字体
//   damageElement.style.fontWeight = "bold";
//   damageElement.style.color = "#ff4444";
//   damageElement.style.pointerEvents = "none";
//   damageElement.style.zIndex = "1000";
//   damageElement.style.left = "50%";
//   damageElement.style.top = "30%"; // 稍微靠上一点，更明显
//   damageElement.style.transform = "translate(-50%, -50%)";
//   damageElement.style.textShadow = "1px 1px 2px rgba(0,0,0,0.5)";
//   damageElement.style.whiteSpace = "nowrap";
//   damageElement.style.background = "rgba(0,0,0,0.3)";
//   damageElement.style.padding = "2px 8px";
//   damageElement.style.borderRadius = "4px";

//   // 添加伤害元素到DOM
//   (container as HTMLElement).appendChild(damageElement);

//   // 动画效果 - 更明显的浮动和渐隐
//   setTimeout(() => {
//     damageElement.style.transition =
//       "all 1s cubic-bezier(0.215, 0.610, 0.355, 1.000)"; // 缓动函数使动画更自然
//     damageElement.style.opacity = "0";
//     damageElement.style.transform =
//       target === "player"
//         ? "translate(-50%, -200%) scale(1.2)"
//         : "translate(-50%, -200%) scale(1.2)";
//   }, 10);

//   // 移除元素
//   setTimeout(() => {
//     if (damageElement.parentNode) {
//       damageElement.parentNode.removeChild(damageElement);
//     }
//   }, 1200);
// };

// 敌人攻击函数 - 暂时注释掉，因为我们正在实现新的战斗系统
/*
const enemyAttack = () => {
  const player = gameStore.player;
  const damage = Math.max(
    0,
    currentEnemy.value.attack - player.attributes.defense
  );

  // 更新玩家生命值 - 直接修改player对象的生命值
  player.attributes.health = Math.max(0, player.attributes.health - damage);

  // 添加视觉反馈 - 显示伤害数值
  showDamage(playerHealthBar.value, damage, "player");

  addBattleLog(
    `${currentEnemy.value.name} 对玩家造成了 ${damage} 点伤害！`,
    "enemy"
  );

  // 检查玩家是否死亡
  if (player.attributes.health <= 0) {
    endBattleDefeat();
    return;
  }

  // 切换到玩家回合
  currentTurn.value = "player";
  currentRound.value++;
  addBattleLog(`回合 ${currentRound.value}，玩家的回合！`, "system");
};*/

// 使用技能函数 - 暂时禁用，因为我们正在实现新的战斗系统
const useSkill = () => {
  // if (currentTurn.value !== "player") return;
  // showSkillModal.value = true;
  addBattleLog(`技能系统暂未开放！`, "system");
};

const selectSkill = () => {
  // showSkillModal.value = false;
  // TODO: 实现技能使用逻辑
  // addBattleLog(`玩家使用了技能！`, "player");
};

const useItem = () => {
  // if (currentTurn.value !== "player") return;
  // showItemModal.value = true;
  addBattleLog(`道具系统暂未开放！`, "system");
};

const selectItem = () => {
  // showItemModal.value = false;
  // TODO: 实现道具使用逻辑
  // addBattleLog(`玩家使用了道具！`, "player");
};

const escapeBattle = () => {
  // if (currentTurn.value !== "player") return;
  addBattleLog(`逃跑系统暂未开放！`, "system");
};

// 战斗结束相关函数已移除，使用新的handleEndBattle函数代替

// 处理战斗结果模态框关闭
const handleResultModalClose = () => {
  showResultModal.value = false;

  // 使用gameStore的endBattle方法结束战斗
  gameStore.endBattle();

  // 根据战斗结果进行不同处理
  if (battleResult.value.title === "战斗失败") {
    // 战斗失败，重置玩家信息并重新开始游戏
    console.log("战斗失败，重置玩家信息并重新开始游戏");
    gameStore.resetPlayer();
    // 跳转到开始游戏页面
    router.push("/mobile/");
  } else if (
    battleResult.value.title === "战斗胜利" ||
    battleResult.value.title === "成功逃跑"
  ) {
    // 战斗胜利或逃跑成功，返回玩家详情页面
    console.log("返回玩家详情页面");
    router.push("/mobile/player-detail");
  }
};

// 确保函数被使用（TypeScript编译要求）
// 这些函数将在战斗循环中被调用，暂时添加条件性引用
if (false) {
  // 占位符，用于确保函数被编译器识别
};

// 战斗日志管理函数 - 带类型标识
const addBattleLog = (
  message: string,
  type: "player" | "enemy" | "system" = "system"
) => {
  let formattedMessage = message;

  // 为伤害信息添加特殊格式
  if (message.includes("造成了") && message.includes("点伤害")) {
    // 提取伤害值
    const damageMatch = message.match(/造成了\s*(\d+)\s*点伤害/);
    if (damageMatch && damageMatch[1]) {
      const damage = damageMatch[1];
      // 为伤害数字添加特殊标记，便于在CSS中样式化
      formattedMessage = message.replace(
        `造成了 ${damage} 点伤害`,
        `造成了 <span class="damage-number">${damage}</span> 点伤害`
      );
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
  // 初始化行动队列
  initializeActionQueue();
  
  // 开始战斗循环
  startBattleLoop();
  
  // 初始化战斗日志
  addBattleLog(`战斗开始！`, "system");
  playerTeam.value.allTeammates.forEach(teammate => {
    addBattleLog(`${teammate.name} 加入战斗！`, "player");
  });
  enemyTeam.value.allTeammates.forEach((teammate: Teammate) => {
    addBattleLog(`${teammate.name} 加入战斗！`, "enemy");
  });
});

// 在组件销毁时停止战斗循环
onUnmounted(() => {
  stopBattleLoop();
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
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 伤害弹出动画 */
.damage-popup {
  animation: damageFloat 1.2s cubic-bezier(0.215, 0.61, 0.355, 1);
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
.skill-selection,
.item-selection {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 180px;
  overflow-y: auto;
}

.skill-item,
.item-item {
  padding: 6px;
  background-color: #fafafa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.skill-item:hover,
.item-item:hover {
  background-color: #e6f7ff;
}

.skill-name,
.item-name {
  font-size: 13px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.skill-desc,
.item-desc {
  font-size: 11px;
  color: #666;
  margin-bottom: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.skill-cost,
.item-count {
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

  .battle-header-card,
  .battle-area-card,
  .battle-log-card,
  .battle-actions-card {
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
  .character-name,
  .battle-title,
  .skill-name,
  .item-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 确保按钮和卡片不会溢出屏幕 */
  .compact-card,
  .ant-btn {
    width: 100%;
    box-sizing: border-box;
  }
}

/* 统一行动队列样式 */
.action-queue-card {
  margin: 8px 0;
}

.action-queue-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.action-queue-container {
  position: relative;
  height: 40px;
  background-color: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
}

.action-queue-track {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #e8e8e8;
}

.action-queue-character {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transition: left 0.1s linear;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  z-index: 2;
}

.player-character {
  background-color: #1890ff;
  color: white;
}

.enemy-character {
  background-color: #ff4d4f;
  color: white;
}

.current-actor {
  border: 2px solid #faad14;
  box-shadow: 0 0 8px rgba(250, 173, 20, 0.8);
  transform: translateY(-50%) scale(1.2);
  z-index: 3;
}

.character-name-tag {
  position: absolute;
  top: -25px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 4;
}

.action-queue-character:hover .character-name-tag {
  opacity: 1;
}
</style>
