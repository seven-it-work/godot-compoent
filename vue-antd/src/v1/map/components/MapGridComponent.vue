<template>
  <div class="map-container">
    <div class="map-info">
      <a-button
        @click="cultivate"
        :disabled="isOnCooldown || allSpiritRootsFull"
      >
        {{
          isOnCooldown
            ? `冷却中 (${Math.ceil(remainingCooldown)}s)`
            : "开始修炼"
        }}
      </a-button>
      <a-button
        type="primary"
        @click="toggleAutoMove"
        :disabled="currentMap.path.length <= 1"
      >
        {{ isAutoMoving ? "停止移动" : "开始自动移动" }}
      </a-button>
    </div>
    <div class="map-scroll-container">
      <div
        :style="{
          width: `${currentMap.width * gridSize}px`,
          height: `${currentMap.height * gridSize}px`,
        }"
      >
        <div
          v-for="(row, y) in currentMap.grid"
          :key="`row-${y}`"
          class="map-row"
        >
          <div
            v-for="(grid, x) in row"
            :key="`grid-${x}-${y}`"
            class="map-cell"
            :style="{
              width: `${gridSize}px`,
              height: `${gridSize}px`,
              backgroundColor: getCellColor(grid, x, y),
              border: getCellBorder(grid, x, y),
            }"
            @click="handleCellClick(x, y)"
          >
            <div class="cell-content">
              <div class="cell-position">({{ x }}, {{ y }})</div>
              <div class="cell-location">{{ grid.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, onUnmounted, computed } from "vue";
import { useCultivatorStore } from "@/stores/cultivator";
import { useMapStore } from "@/stores/map";
import { useCombatStore } from "@/stores/combat";
import { useRouter } from "vue-router";
import { getGameTimeInstance } from "../../timeSystem/impl";
import { TimeEventType } from "../../timeSystem/define";
import type { Location } from "../../location/define";

// 地图配置
const gridSize = 80; // 每个格子的像素大小

// 获取修仙者状态管理Store
const cultivatorStore = useCultivatorStore();
// 获取地图状态管理Store
const mapStore = useMapStore();
// 获取战斗状态管理Store
const combatStore = useCombatStore();
// 获取路由实例
const router = useRouter();

// 当前地图（响应式对象）
const currentMap = reactive(mapStore.getCurrentMap());

// 监听地图实例变化
watch(
  () => mapStore.getCurrentMap(),
  (newMap) => {
    Object.assign(currentMap, newMap);
  },
  { deep: true }
);

// 自动移动状态
const isAutoMoving = ref(false);
// 移动间隔时间（毫秒）
const moveInterval = ref<number | null>(null);
// 移动速度（毫秒/格）
const moveSpeed = ref(500);

// 冷却状态管理
// 获取游戏时间实例
const gameTime = ref(getGameTimeInstance());
// 获取事件管理器
const eventManager = ref(gameTime.value.getEventManager());

// 响应式触发冷却更新的标志
const cooldownTrigger = ref(0);

// 修仙者实例（响应式）
const cultivator = computed(() => {
  return cultivatorStore.getCurrentCultivator();
});

// 共享冷却时间获取逻辑
const cooldownTime = computed(() => {
  const spiritRootCooldown = cultivator.value.spiritRootCooldown;
  const other = spiritRootCooldown.other as any;

  // 如果 currentCooldown 为 0，则获取新的随机值并存储
  if (other.currentCooldown === 0) {
    other.currentCooldown = spiritRootCooldown.getCurrentValue();
  }

  return other.currentCooldown;
});

// 是否处于冷却中
const isOnCooldown = computed(() => {
  // 强制触发计算更新
  cooldownTrigger.value;

  const other = cultivator.value.spiritRootCooldown.other as any;

  // 如果没有设置冷却时间，或者冷却时间已经结束
  if (!other.lastOperationGameTime || !cooldownTime.value) {
    return false;
  }

  // 获取当前游戏时间和上次操作时间
  const currentGameTime = gameTime.value.currentTime;
  const lastOperationGameTime = other.lastOperationGameTime;

  // 计算经过的游戏时间（毫秒）
  const elapsedGameTimeMs = currentGameTime - lastOperationGameTime;
  // 转换为秒
  const elapsedGameTime = elapsedGameTimeMs / 1000;

  return elapsedGameTime < cooldownTime.value;
});

// 剩余冷却时间
const remainingCooldown = computed(() => {
  if (!isOnCooldown.value) {
    // 冷却结束，重置 currentCooldown
    (cultivator.value.spiritRootCooldown.other as any).currentCooldown = 0;
    return 0;
  }

  const other = cultivator.value.spiritRootCooldown.other as any;

  // 获取当前游戏时间和上次操作时间
  const currentGameTime = gameTime.value.currentTime;
  const lastOperationGameTime = other.lastOperationGameTime;

  // 计算经过的游戏时间（毫秒）
  const elapsedGameTimeMs = currentGameTime - lastOperationGameTime;
  // 转换为秒
  const elapsedGameTime = elapsedGameTimeMs / 1000;

  return cooldownTime.value - elapsedGameTime;
});

// 所有灵根经验是否已满
const allSpiritRootsFull = computed(() => {
  return cultivator.value.spiritRoots.every(
    (root) => root.spiritValue.getCurrentValue() >= 100
  );
});

/**
 * 获取格子颜色
 */
const getCellColor = (grid: Location, x: number, y: number) => {
  // 当前位置
  if (
    x === cultivatorStore.getCurrentCultivator().currentLocation?.x &&
    y === cultivatorStore.getCurrentCultivator().currentLocation?.y
  ) {
    return "#4CAF50"; // 绿色
  }
  // 选中的格子
  if (grid.isSelected) {
    return "#FF9800"; // 橙色
  }
  // 路径上的格子
  if (grid.isOnPath) {
    return "#2196F3"; // 蓝色
  }
  // 不可通行的格子
  if (!grid.isPassable) {
    return "#F44336"; // 红色
  }
  // 默认格子
  return "#E0E0E0"; // 灰色
};

/**
 * 获取格子边框
 */
const getCellBorder = (grid: Location, x: number, y: number) => {
  // 当前位置
  if (
    x === cultivatorStore.getCurrentCultivator().currentLocation?.x &&
    y === cultivatorStore.getCurrentCultivator().currentLocation?.y
  ) {
    return "1px solid #4CAF50"; // 绿色粗边框
  }
  // 选中的格子
  if (grid.isSelected) {
    return "1px solid #FF9800"; // 橙色粗边框
  }
  // 默认边框
  return "1px solid #BDBDBD"; // 灰色边框
};

/**
 * 处理格子点击事件
 */
const handleCellClick = (x: number, y: number) => {
  // 选择目标格子
  currentMap.selectGrid(x, y);

  // 获取当前位置作为起点
  const startX = cultivatorStore.getCurrentCultivator().currentLocation?.x || 0;
  const startY = cultivatorStore.getCurrentCultivator().currentLocation?.y || 0;

  // 规划路径
  const path = currentMap.findPath(startX, startY, x, y);

  // 设置路径到地图
  currentMap.setPath(path);
};

/**
 * 移动到下一格
 */
const moveToNext = () => {
  const result = cultivatorStore.getCurrentCultivator().moveToNext(currentMap);

  if (result.success && result.encounteredMonster && result.monster) {
    // 遇到怪兽，触发战斗
    const player = cultivatorStore.getCurrentCultivator();
    const location = cultivatorStore.getCurrentLocation();

    // 初始化战斗
    // @ts-ignore
    combatStore.startCombat(player, result.monster, location);

    // 跳转到战斗页面
    router.push("/combat");

    // 停止自动移动
    stopAutoMove();
    currentMap.clearPath();
  } else if (!result.success) {
    // 移动失败或到达终点，停止自动移动并清理路径
    stopAutoMove();
    currentMap.clearPath();
  }
};

/**
 * 开始自动移动
 */
const startAutoMove = () => {
  if (currentMap.path.length <= 1) return;

  isAutoMoving.value = true;
  moveInterval.value = window.setInterval(() => {
    moveToNext();
  }, moveSpeed.value);
};

/**
 * 停止自动移动
 */
const stopAutoMove = () => {
  isAutoMoving.value = false;
  if (moveInterval.value) {
    window.clearInterval(moveInterval.value);
    moveInterval.value = null;
  }
};

/**
 * 切换自动移动状态
 */
const toggleAutoMove = () => {
  if (isAutoMoving.value) {
    stopAutoMove();
  } else {
    startAutoMove();
  }
};

// 时间变化事件处理函数
const handleTimeChanged = () => {
  // 更新触发标志，强制计算属性重新计算
  cooldownTrigger.value++;
};

// 修炼功能
const cultivate = () => {
  if (isOnCooldown.value || allSpiritRootsFull.value) return;

  // 开始修炼前将外出状态设置为false
  cultivatorStore.setIsOuting(false);

  // 获取当前所在地的灵脉
  const currentLocation = cultivator.value.currentLocation;
  const spiritVeins = currentLocation.spiritVeins;

  // 找到所有未满的灵根
  const all未满灵根 = cultivator.value.spiritRoots.filter(
    (root) => root.spiritValue.getCurrentValue() < 100
  );

  // 遍历所有未满灵根，尝试找到可以吸取的灵脉
  for (const 未满灵根 of all未满灵根) {
    // 查找对应类型的灵脉
    const targetVein = spiritVeins.find((vein) => vein.type === 未满灵根.type);

    // 如果有对应类型的灵脉
    if (targetVein) {
      // 获取灵脉中的灵气值
      const veinSpiritValue = targetVein.spiritValue.getCurrentValue();

      // 如果灵脉中有灵气
      if (veinSpiritValue > 0) {
        // 计算吸收量
        const absorbAmount =
          cultivator.value.spiritRootAbsorb.getCurrentValue();

        // 实际能吸取的数量（不超过灵脉中的灵气值和灵根升级所需的经验值）
        const currentSpiritValue = 未满灵根.spiritValue.getCurrentValue();
        const actualAbsorbAmount = Math.min(
          absorbAmount,
          veinSpiritValue,
          100 - currentSpiritValue
        );

        // 如果实际能吸取的数量大于0
        if (actualAbsorbAmount > 0) {
          // 从灵脉中扣除灵气
          targetVein.spiritValue.setCurrentValue(
            veinSpiritValue - actualAbsorbAmount
          );

          // 更新灵根经验值
          const newValue = currentSpiritValue + actualAbsorbAmount;
          未满灵根.spiritValue.currentValue = newValue;
          // 设置冷却时间（使用游戏时间）
          const cooldownOther = cultivator.value.spiritRootCooldown
            .other as any;
          cooldownOther.lastOperationTime = Date.now(); // 保留现实时间（兼容旧代码）
          cooldownOther.lastOperationGameTime = gameTime.value.currentTime; // 存储游戏时间

          // 成功吸取后退出函数
          return;
        }
      }
    }
  }

  // 如果遍历完所有未满灵根都无法吸取，则直接返回
};

// 组件卸载时清除定时器
onUnmounted(() => {
  stopAutoMove();
  // 移除时间变化事件监听
  eventManager.value.off(TimeEventType.TIME_CHANGED, handleTimeChanged);
});

// 组件挂载时初始化地图
onMounted(() => {
  if (currentMap.width === 0 || currentMap.height === 0) {
    mapStore.createMap(10, 10);
  }

  // 监听时间变化事件
  eventManager.value.on(TimeEventType.TIME_CHANGED, handleTimeChanged);
});
</script>

<style scoped>
.map-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.map-scroll-container {
  max-height: 600px;
  overflow: auto;
  border: 1px solid #bdbdbd;
  margin-top: 10px;
}

.map-info {
  background-color: #f5f5f5;
  border-radius: 4px;
}

.map-grid {
  display: flex;
  flex-direction: column;
  border: 1px solid #bdbdbd;
  background-color: #f5f5f5;
}

.map-row {
  display: flex;
}

.map-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.map-cell:hover {
  transform: scale(1.05);
  z-index: 1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.cell-content {
  text-align: center;
  padding: 5px;
  font-size: 12px;
}

.cell-position {
  font-weight: bold;
  margin-bottom: 2px;
}

.cell-location {
  font-size: 10px;
  color: #666;
}
</style>
