<template>
  <Drawer
    :open="debugDrawerVisible"
    title="调试信息"
    placement="left"
    @update:open="$emit('update:debugDrawerVisible', $event)"
    @close="$emit('close')"
  >
    <div class="debug-info">
      <h3>调试功能</h3>

      <!-- 设置当前金币 -->

      <div class="debug-section">
        <h4>设置当前金币</h4>

        <div class="debug-control">
          <input
            type="number"
            v-model.number="currentGold"
            min="0"
            placeholder="输入金币数量"
            class="debug-input"
          />

          <button @click="setCurrentGold" class="debug-button">设置</button>
        </div>
      </div>

      <!-- 设置当前最大金币 -->

      <div class="debug-section">
        <h4>设置当前最大金币</h4>

        <div class="debug-control">
          <input
            type="number"
            v-model.number="maxGold"
            min="1"
            max="10"
            placeholder="输入最大金币数量"
            class="debug-input"
          />

          <button @click="setMaxGold" class="debug-button">设置</button>
        </div>
      </div>

      <!-- 添加随从到不同位置 -->

      <div class="debug-section">
        <h4>添加随从到</h4>

        <!-- 添加位置选择 -->

        <div class="debug-control">
          <select v-model="selectedLocation" class="debug-input">
            <option value="tavern">酒馆</option>

            <option value="battlefield">战场</option>

            <option value="hand">手牌</option>
          </select>
        </div>

        <!-- 搜索框 -->

        <div class="debug-control">
          <input type="text" v-model="searchQuery" placeholder="搜索随从..." class="debug-input" />
        </div>

        <!-- 筛选下拉框 -->

        <div class="debug-control">
          <select v-model="selectedMechanic" class="debug-input">
            <option value="">全部属性</option>

            <option value="battlecry">战吼</option>

            <option value="deathtrattle">亡语</option>

            <option value="taunt">嘲讽</option>

            <option value="divine_shield">圣盾</option>

            <option value="windfury">风怒</option>

            <option value="super_windfury">超级风怒</option>

            <option value="stealth">潜行</option>

            <option value="charge">冲锋</option>

            <option value="poisonous">剧毒</option>

            <option value="reborn">复生</option>

            <option value="immune">免疫</option>

            <option value="magnetic">磁力</option>
          </select>
        </div>

        <!-- 随从列表 -->

        <div class="minion-list">
          <div
            v-for="minion in filteredMinions"
            :key="minion.id"
            class="minion-item"
            @click="addSpecificMinion(minion as Minion)"
          >
            <span class="minion-name">{{ minion.nameCN || minion.name }}</span>

            <span class="minion-tier">{{ minion.tier }}星</span>
          </div>

          <!-- 没有找到随从时的提示 -->

          <div v-if="filteredMinions.length === 0" class="no-minions">没有找到匹配的随从</div>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { Drawer } from 'ant-design-vue';

import { ref, watch, computed } from 'vue';

import { useGameStore } from '../../../stores/game';

import { Minion, MinionKeyword } from '../../../game/Minion';

// 定义组件的属性
interface Props {
  debugDrawerVisible: boolean;
}

// 使用组件的属性
defineProps<Props>();

// 使用游戏store

const gameStore = useGameStore();

// 从localStorage读取保存的调试配置

const loadSearchConfig = () => {
  // 尝试读取新的配置键
  let savedConfig = localStorage.getItem('debugDrawerConfig');

  // 如果新键不存在，尝试读取旧键以保持向后兼容
  if (!savedConfig) {
    savedConfig = localStorage.getItem('debugDrawerSearchConfig');

    // 如果旧键存在，迁移数据到新键
    if (savedConfig) {
      try {
        const oldConfig = JSON.parse(savedConfig);
        // 创建包含旧配置的新配置结构
        const newConfig = {
          ...oldConfig,
          currentGold: undefined,
          maxGold: undefined,
          savedAt: new Date().toISOString(),
        };
        // 保存到新键
        localStorage.setItem('debugDrawerConfig', JSON.stringify(newConfig));
        // 删除旧键
        localStorage.removeItem('debugDrawerSearchConfig');
        console.log('调试配置已从旧键迁移到新键');
        return newConfig;
      } catch (error) {
        console.error('迁移旧配置失败:', error);
        return {};
      }
    }
  }

  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (error) {
      console.error('读取调试配置失败:', error);
      return {};
    }
  }

  return {};
};

// 保存调试配置到localStorage

const saveConfig = () => {
  const config = {
    searchQuery: searchQuery.value,
    selectedMechanic: selectedMechanic.value,
    selectedLocation: selectedLocation.value,
    currentGold: currentGold.value,
    maxGold: maxGold.value,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem('debugDrawerConfig', JSON.stringify(config));

  console.log('调试配置已保存到localStorage:', config);
};

// 响应式变量

// 从localStorage加载调试配置
const savedConfig = loadSearchConfig();

// 按照优先级：缓存 > player数据 > 默认值
const currentGold = ref(savedConfig.currentGold ?? gameStore.player?.gold ?? 0);
const maxGold = ref(savedConfig.maxGold ?? gameStore.player?.maxGold ?? 10);

const searchQuery = ref(savedConfig.searchQuery || '');
const selectedMechanic = ref(savedConfig.selectedMechanic || ''); // 用于筛选的机制
const selectedLocation = ref(savedConfig.selectedLocation || 'tavern'); // 添加位置选择：酒馆、战场、手牌

// 监听player变化，更新局部变量

watch(
  () => gameStore.player,

  newPlayer => {
    if (newPlayer) {
      currentGold.value = newPlayer.gold;

      maxGold.value = newPlayer.maxGold;
    }
  },

  { deep: true }
);

// 监听所有调试配置变化，自动保存到localStorage

watch(
  [searchQuery, selectedMechanic, selectedLocation, currentGold, maxGold],

  () => {
    saveConfig();
  },

  { deep: true }
);

// 定义组件的事件
defineEmits<{
  (e: 'close'): void;

  (e: 'update:debugDrawerVisible', value: boolean): void;
}>();

// 设置当前金币

const setCurrentGold = () => {
  gameStore.setCurrentGold(currentGold.value);
  // 手动保存配置
  saveConfig();
};

// 设置最大金币

const setMaxGold = () => {
  gameStore.setMaxGold(maxGold.value);
  // 手动保存配置
  saveConfig();
};

// 过滤后的随从列表

const filteredMinions = computed(() => {
  if (!gameStore.minionPool) {
    return [];
  }

  const query = searchQuery.value.toLowerCase().trim();

  return gameStore.minionPool.filter(minion => {
    // 搜索条件

    const matchesSearch =
      !query ||
      minion.name.toLowerCase().includes(query) ||
      (minion.nameCN && minion.nameCN.toLowerCase().includes(query));

    // 机制筛选条件

    const matchesMechanic =
      !selectedMechanic.value ||
      (minion.mechanics && minion.mechanics.includes(selectedMechanic.value.toUpperCase())) ||
      (minion.keywords && minion.keywords.includes(selectedMechanic.value as MinionKeyword));

    return matchesSearch && matchesMechanic;
  });
});

// 添加特定随从到不同位置

const addSpecificMinion = (minion: Minion) => {
  console.log(`addSpecificMinion被调用，添加到${selectedLocation.value}`);

  console.log('minion:', minion);

  // 克隆随从对象，避免修改原对象

  const newMinion = minion.clone();

  console.log('克隆后的随从:', newMinion);

  let success = false;

  switch (selectedLocation.value) {
    case 'tavern':
      console.log('开始添加随从到酒馆...');

      console.log('gameStore.tavern:', gameStore.tavern);

      if (gameStore.tavern) {
        success = gameStore.tavern.debugAddMinion(newMinion);

        if (success) {
          console.log('添加随从到酒馆完成');
        } else {
          console.log('酒馆已满，无法添加随从');
        }
      } else {
        console.log('gameStore.tavern不存在，无法添加随从');
      }

      break;

    case 'battlefield':
      console.log('开始添加随从到战场...');

      console.log('gameStore.player:', gameStore.player);

      if (gameStore.player) {
        success = gameStore.player.summonMinion(newMinion, null);

        if (success) {
          console.log('添加随从到战场完成');
        } else {
          console.log('战场已满，无法添加随从');
        }
      } else {
        console.log('gameStore.player不存在，无法添加随从');
      }

      break;

    case 'hand':
      console.log('开始添加随从到手牌...');

      console.log('gameStore.player:', gameStore.player);

      if (gameStore.player) {
        success = gameStore.player.addMinionToHand(newMinion);

        if (success) {
          console.log('添加随从到手牌完成');
        } else {
          console.log('手牌已满，无法添加随从');
        }
      } else {
        console.log('gameStore.player不存在，无法添加随从');
      }

      break;

    default:
      console.log('未知的添加位置:', selectedLocation.value);
  }
};
</script>

<style scoped>
/* 调试抽屉样式 */

.debug-info {
  overflow-y: auto;

  font-size: 14px;
}

.debug-info h3 {
  font-size: 16px;

  color: #333;

  border-bottom: 1px solid #eee;
}

.debug-info h4 {
  font-size: 15px;

  color: #555;
}

.debug-section {
  background-color: #f9f9f9;

  border-radius: 5px;
}

.debug-control {
  display: flex;

  gap: 10px;

  align-items: center;
}

.debug-input {
  flex: 1;

  border: 1px solid #ddd;

  border-radius: 3px;

  font-size: 14px;
}

.debug-button {
  background-color: #4caf50;

  color: white;

  border: none;

  border-radius: 3px;

  font-size: 14px;

  cursor: pointer;

  transition: background-color 0.2s;
}

.debug-button:hover {
  background-color: #45a049;
}

/* 随从列表样式 */

.minion-list {
  overflow-y: auto;

  border: 1px solid #ddd;

  border-radius: 3px;

  background-color: white;
}

.minion-item {
  display: flex;

  justify-content: space-between;

  align-items: center;

  border-bottom: 1px solid #f0f0f0;

  cursor: pointer;

  transition: background-color 0.2s;
}

.minion-item:hover {
  background-color: #f5f5f5;
}

.minion-item:last-child {
  border-bottom: none;
}

.minion-name {
  font-size: 14px;

  color: #333;

  font-weight: 500;
}

.minion-tier {
  font-size: 14px;

  color: #ffd700;

  font-weight: bold;

  background-color: #333;

  border-radius: 10px;
}

.no-minions {
  text-align: center;

  color: #999;

  font-size: 14px;
}
</style>
