<template>
  <div 
    class="tavern-container"
    @dragover.prevent="onDragOver"
    @drop="onDrop($event, 'tavern')"
  >
    <!-- 酒馆标题和等级 -->
    <div class="tavern-header">
      <h2>酒馆</h2>
      <div class="tavern-level">
        <span class="level-text">等级 {{ player?.tavernLevel || 1 }}</span>
        <div class="level-bar">
          <div 
            class="level-progress" 
            :style="{ width: `${(player?.tavernLevel || 1) / 6 * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 操作按钮区 -->
    <div class="tavern-actions">
      <!-- 升级按钮 -->
      <button 
        class="action-button upgrade-button"
        :disabled="!canUpgrade"
        @click="upgradeTavern"
      >
        <span class="cost">{{ upgradeCost }}</span>
        升级
      </button>
      
      <!-- 刷新按钮 -->
      <button 
        class="action-button refresh-button"
        :disabled="!(player && player.gold >= 1)"
        @click="refreshTavern"
      >
        <span class="cost">1</span>
        刷新
      </button>
      
      <!-- 冻结按钮 -->
      <button 
        class="action-button freeze-button"
        :class="{ frozen: tavern?.isFrozen }"
        @click="toggleFreeze"
      >
        {{ tavern?.isFrozen ? '解冻' : '冻结' }}
      </button>
    </div>

    <!-- 可用随从区 -->
    <div class="minions-area">
      <!-- 固定7个格子，每个格子对应一个位置 -->
      <div 
        v-for="slotIndex in 7" 
        :key="slotIndex"
        class="minion-slot"
        :class="{ 'empty': !tavern?.availableMinions?.[slotIndex - 1] }"
        draggable="true"
        @dragstart="onDragStart($event, 'tavern', slotIndex - 1, tavern?.availableMinions?.[slotIndex - 1])"
      >
        <!-- 如果该位置有随从，渲染随从卡片 -->
          <MinionCard 
            v-if="tavern?.availableMinions?.[slotIndex - 1]"
            :minion="tavern.availableMinions[slotIndex - 1] as Minion" 
            :is-selected="selectedMinion?.id === tavern.availableMinions[slotIndex - 1]?.id"
            @click="selectMinion(tavern.availableMinions[slotIndex - 1] as Minion, slotIndex - 1)"
          />
        <!-- 如果该位置没有随从，渲染空槽 -->
        <div v-else class="empty-slot">
          <span>空</span>
        </div>
      </div>
    </div>
    
    <!-- 操作提示 -->
    <div v-if="selectedMinion" class="action-hint">
      <span>已选择: {{ selectedMinion.name }}</span>
      <button class="action-button" @click="buySelectedMinion">
        <span class="cost">{{ selectedMinion.cost }}</span>
        购买
      </button>
      <button class="action-button cancel-button" @click="cancelSelect">取消选择</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useGameStore } from '../stores/game';
import { Minion } from '../game/Minion';
import MinionCard from './MinionCard.vue';

const gameStore = useGameStore();

// 从store获取状态
const { player, tavern } = gameStore;

// 选中的随从
const selectedMinion = ref<Minion | null>(null);
const selectedMinionIndex = ref<number | null>(null);

// 计算属性
const canUpgrade = computed(() => {
  if (!player) return false;
  const upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
  const cost = upgradeCosts[player.tavernLevel] || 0;
  return player.gold >= cost && player.tavernLevel < 6;
});

const upgradeCost = computed(() => {
  if (!player) return 0;
  const upgradeCosts = [0, 5, 7, 8, 10, 12, 12];
  return upgradeCosts[player.tavernLevel] || 0;
});

// 方法
const refreshTavern = () => {
  gameStore.refreshTavern();
};

const upgradeTavern = () => {
  gameStore.upgradeTavern();
};

const toggleFreeze = () => {
  if (tavern?.isFrozen) {
    gameStore.unfreezeTavern();
  } else {
    gameStore.freezeTavern();
  }
};

// 选择/取消选择随从
const selectMinion = (minion: Minion, index: number) => {
  if (selectedMinion.value && selectedMinionIndex.value === index) {
    // 取消选择
    selectedMinion.value = null;
    selectedMinionIndex.value = null;
  } else {
    // 选择新的随从
    selectedMinion.value = minion;
    selectedMinionIndex.value = index;
  }
};

// 购买选中的随从
const buySelectedMinion = () => {
  if (selectedMinionIndex.value !== null) {
    gameStore.buyMinion(selectedMinionIndex.value);
    // 购买后取消选择
    selectedMinion.value = null;
    selectedMinionIndex.value = null;
  }
};

// 取消选择
const cancelSelect = () => {
  selectedMinion.value = null;
  selectedMinionIndex.value = null;
};

// 拖拽开始事件
const onDragStart = (event: DragEvent, source: string, index: number, minion: any) => {
  event.dataTransfer?.setData('text/plain', JSON.stringify({
    source,
    index,
    minionId: minion.id,
    strId: minion.strId
  }));
};

// 拖拽经过事件
const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

// 拖拽放置事件（用于接收战场上的随从，进行出售）
const onDrop = (event: DragEvent, target: string) => {
  event.preventDefault();
  const data = event.dataTransfer?.getData('text/plain');
  if (data) {
    const dragData = JSON.parse(data);
    // 如果是从战场拖拽到酒馆，执行出售操作
    if (dragData.source === 'battlefield' && target === 'tavern') {
      gameStore.sellMinion('minion', dragData.index);
    }
  }
};
</script>

<style scoped>
.tavern-container {
  margin: 0;
  padding: 20px;
  background-color: transparent;
  color: black;
  box-sizing: border-box;
  overflow: auto;
}

.tavern-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tavern-header h2 {
  margin: 0;
  color: #ffd700;
}

.tavern-level {
  text-align: right;
}

.level-text {
  display: block;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: black;
}

.level-bar {
  width: 150px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.level-progress {
  height: 100%;
  background-color: #ffd700;
  transition: width 0.3s ease;
}

.tavern-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  position: relative;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upgrade-button {
  background-color: #4caf50;
  color: white;
}

.refresh-button {
  background-color: #2196f3;
  color: white;
}

.freeze-button {
  background-color: #9c27b0;
  color: white;
}

.freeze-button.frozen {
  background-color: #00bcd4;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.cost {
  background-color: #ffd700;
  color: black;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 14px;
}

.minions-area {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.minion-slot {
  width: 100px;
  height: 150px;
  position: relative;
}

.minion-slot.empty {
  background-color: rgba(0, 0, 0, 0.05);
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-slot {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.3);
}

/* 操作提示 */
.action-hint {
  text-align: center;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  color: black;
  margin-top: 15px;
}

.cancel-button {
  background-color: #9e9e9e;
}

.cancel-button:hover {
  background-color: #757575;
}
</style>