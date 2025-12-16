<template>
  <!-- 额外操作区域 -->
  <div class="large-cell">
    <!-- 酒馆信息 -->
    <div class="tavern-info">
      <div class="tavern-level big-size">酒馆等级：{{ gameStore.player?.tavernLevel || 1 }}</div>
      <button class="action-button big-size" :disabled="!canUpgrade" @click="upgradeTavern">
        升级({{ upgradeCost }})
      </button>
      <button
        class="action-button big-size"
        :disabled="!(gameStore.player && gameStore.player.gold >= 1)"
        @click="refreshTavern"
      >
        刷新(1)
      </button>
      <button class="action-button big-size" @click="toggleFreeze">
        {{ gameStore.tavern?.isFrozen ? '解冻(1)' : '冻结(1)' }}
      </button>
    </div>
    <div class="player-stats">
      <div class="health-armor big-size">
        生命值：{{ gameStore.player?.hero?.health || 30 }} 护甲：{{
          gameStore.player?.hero?.armor || 0
        }}
      </div>
      <div class="coins big-size">
        铸币：{{ gameStore.player?.gold || 0 }}/{{ gameStore.player?.maxGold || 10 }}
      </div>
      <div class="big-size">第{{ gameStore.currentTurn || 1 }}回合</div>
    </div>
    <div class="card-info" v-if="selectedCard">
      <div class="card-left">
        <div class="card-name big-size">名称：{{ selectedCard?.name || '' }}</div>
        <div class="card-name big-size">类型：{{ getCardTypeText }}</div>
        <div class="card-level big-size">等级：{{ selectedCard?.tier || 1 }}</div>
        <div class="card-cost big-size">花费：{{ selectedCard?.cost || 1 }}</div>
        <div class="card-attack big-size" v-if="gameStore.selectedMinion">
          攻击：{{ gameStore.selectedMinion.attack || 0 }}
        </div>
        <div class="card-health big-size" v-if="gameStore.selectedMinion">
          生命值：{{ gameStore.selectedMinion.health || 0 }}
        </div>
        <div class="card-type big-size" v-if="gameStore.selectedMinion">
          类型：{{ gameStore.selectedMinion.minionTypesCN?.join(' | ') || '' }}
        </div>
      </div>
      <div class="card-right">
        <div class="card-description big-size" v-html="selectedCard?.text || ''"></div>
        <div
          class="card-effects big-size"
          v-if="gameStore.selectedSpell"
          v-html="'法术效果：' + (gameStore.selectedSpell.text || '无描述')"
        ></div>
      </div>
    </div>
    <div class="action-buttons">
      <button
        class="action-button big-size"
        v-if="gameStore.selectedMinionSource === 'tavern'"
        @click="buySelectedMinion"
      >
        购买
        <span class="cost">({{ gameStore.selectedMinion?.cost || 0 }})</span>
      </button>
      <button
        class="action-button big-size"
        v-if="gameStore.selectedMinionSource === 'hand'"
        @click="placeMinionFromHand"
      >
        放置随从
      </button>
      <button
        class="action-button big-size"
        v-if="gameStore.selectedMinionSource === 'battlefield'"
        @click="sellSelectedMinion"
      >
        出售
      </button>
      <button class="action-button big-size" @click="endTurn">结束回合</button>
      <button class="action-button big-size">设置按钮</button>
      <button class="action-button big-size" @click="showDebugDrawer">调试按钮</button>
    </div>
  </div>
  <!-- end 额外操作区域 -->

  <!-- 调试抽屉组件 -->
  <DebugDrawer
    v-model:debug-drawer-visible="debugDrawerVisible"
    :game-state="gameStore.gameState"
    :current-turn="gameStore.currentTurn"
    @close="closeDebugDrawer"
  />
</template>

<script setup lang="ts">
// 操作区域组件
import { computed, ref } from 'vue';
import { useGameStore } from '../stores/game';
import DebugDrawer from './DebugDrawer.vue';

const gameStore = useGameStore();

// 调试抽屉控制
const debugDrawerVisible = ref(false);
const showDebugDrawer = () => {
  debugDrawerVisible.value = true;
};
const closeDebugDrawer = () => {
  debugDrawerVisible.value = false;
};

// 计算属性：是否可以升级酒馆
const canUpgrade = computed(() => {
  if (!gameStore.player) return false;
  const upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
  const cost = upgradeCosts[gameStore.player.tavernLevel] || 0;
  return gameStore.player.gold >= cost && gameStore.player.tavernLevel < 6;
});

// 计算属性：升级酒馆的费用
const upgradeCost = computed(() => {
  if (!gameStore.player) return 0;
  const upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
  return upgradeCosts[gameStore.player.tavernLevel] || 0;
});

// 方法：升级酒馆
const upgradeTavern = () => {
  gameStore.upgradeTavern();
};

// 方法：刷新酒馆
const refreshTavern = () => {
  gameStore.refreshTavern();
};

// 方法：冻结/解冻酒馆
const toggleFreeze = () => {
  if (gameStore.tavern?.isFrozen) {
    gameStore.unfreezeTavern();
  } else {
    gameStore.freezeTavern();
  }
};

// 计算属性：获取当前选中的卡片
const selectedCard = computed(() => {
  return gameStore.selectedMinion || gameStore.selectedSpell;
});

// 计算属性：获取卡片类型文本
const getCardTypeText = computed(() => {
  if (gameStore.selectedMinion) {
    return gameStore.selectedMinion.cardType === 'minion' ? '随从' : '其他';
  } else if (gameStore.selectedSpell) {
    return gameStore.selectedSpell.type === 'shaping' ? '法术/塑造法术' : '法术';
  }
  return '随从/塑造法术';
});

// 结束回合
const endTurn = () => {
  gameStore.endTurn();
};

// 购买选中的随从
const buySelectedMinion = () => {
  if (gameStore.selectedMinion) {
    gameStore.buyMinion(gameStore.selectedMinionIndex || 0);
    // 购买后取消选择
    gameStore.cancelSelectMinion();
  }
};

// 出售选中的随从
const sellSelectedMinion = () => {
  if (gameStore.selectedMinion && gameStore.selectedMinionIndex !== null) {
    gameStore.sellMinion('minion', gameStore.selectedMinionIndex);
    gameStore.cancelSelectMinion();
  }
};

// 从手牌放置随从到战场
const placeMinionFromHand = () => {
  if (gameStore.selectedMinion && gameStore.selectedMinionIndex !== null) {
    gameStore.placeMinionFromHand(gameStore.selectedMinionIndex, 0);
    gameStore.cancelSelectMinion();
  }
};
</script>

<style scoped>
.big-size {
  font-size: 1vw;
}
.large-cell {
  width: 35vw;
  border: 2px solid #000;
  background-color: #ffffff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.tavern-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
}

.tavern-level {
  margin-right: 20px;
  font-weight: bold;
}

/* 移除旧的a-button样式，使用统一的.action-button样式 */

.player-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #000;
}

.health-armor {
  font-weight: bold;
}

.coins {
  font-weight: bold;
}

.card-info {
  display: flex;
  height: 200px;
}

.card-left {
  width: 50%;
  padding-right: 10px;
}

.card-right {
  width: 50%;
}

.card-name,
.card-level,
.card-cost,
.card-attack,
.card-health,
.card-type {
  margin-bottom: 8px;
}

.card-description {
  height: 100%;
  overflow-y: auto;
  padding: 5px;
}

.card-effects {
  margin-top: 10px;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.action-button {
  flex: 1 1 calc(50% - 5px);
  padding: 10px;
  border: 2px solid #000;
  border-radius: 5px;
  background-color: #ffffff;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

.action-button:active {
  transform: translateY(0);
}

.action-button:disabled {
  background-color: #e0e0e0;
  border-color: #ccc;
  color: #999;
  cursor: not-allowed;
  opacity: 0.7;
}

.action-button:disabled:hover {
  background-color: #e0e0e0;
  transform: none;
}
</style>
