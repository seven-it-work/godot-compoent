<template>
  <div class="content-content">
    <LocationPanel
      :location="cultivator.currentLocation"
      :cultivator="cultivator"
    />

    <div class="operation-section">
      <!-- 修炼功能 -->
      <div class="operation-item">
        <div class="operation-header">
          <span class="operation-label">修炼</span>
          <a-switch
            v-model:checked="autoCultivate"
            @change="handleAutoCultivateChange"
          />
        </div>
        <div class="operation-content">
          <a-button
            type="primary"
            @click="cultivate"
            :disabled="isOnCooldown || allSpiritRootsFull"
          >
            {{
              isOnCooldown
                ? `冷却中 (${Math.ceil(remainingCooldown)}s)`
                : "开始修炼"
            }}
          </a-button>
          <p class="operation-desc">吸收灵根经验，提升灵根等级</p>
        </div>
      </div>

      <!-- 突破功能 -->
      <div class="operation-item">
        <div class="operation-header">
          <span class="operation-label">突破</span>
          <a-switch
            v-model:checked="autoBreakthrough"
            @change="handleAutoBreakthroughChange"
          />
        </div>
        <div class="operation-content">
          <a-button
            type="success"
            @click="breakthrough"
            :disabled="!canBreakthrough || isOnCooldown"
          >
            {{
              !canBreakthrough
                ? "条件不足"
                : isOnCooldown
                  ? `冷却中 (${Math.ceil(remainingCooldown)}s)`
                  : "突破境界"
            }}
          </a-button>
          <p class="operation-desc">当所有灵根经验满时，突破到更高境界</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { CultivatorClass } from "../impl";
import LocationPanel from "./LocationPanel.vue";
import { getGameTimeInstance } from "../../timeSystem/impl";
import { TimeEventType } from "../../timeSystem/define";

// 定义组件属性
const props = defineProps<{
  cultivator: CultivatorClass;
}>();

// 自动修炼开关
const autoCultivate = ref(false);
// 自动突破开关
const autoBreakthrough = ref(false);

// 冷却状态管理
// 获取游戏时间实例
const gameTime = ref(getGameTimeInstance());
// 获取事件管理器
const eventManager = ref(gameTime.value.getEventManager());

// 响应式触发冷却更新的标志
const cooldownTrigger = ref(0);

// 共享冷却时间获取逻辑
const cooldownTime = computed(() => {
  const spiritRootCooldown = props.cultivator.spiritRootCooldown;
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

  const other = props.cultivator.spiritRootCooldown.other as any;

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
    (props.cultivator.spiritRootCooldown.other as any).currentCooldown = 0;
    return 0;
  }

  const other = props.cultivator.spiritRootCooldown.other as any;

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
  return props.cultivator.spiritRoots.every(
    (root) => root.spiritValue.getCurrentValue() >= 100
  );
});

// 是否可以突破（所有灵根经验已满）
const canBreakthrough = computed(() => {
  return allSpiritRootsFull.value;
});

// 定时器管理
let autoCultivateInterval: number | null = null;
let autoBreakthroughInterval: number | null = null;

// 时间变化事件处理函数
const handleTimeChanged = () => {
  // 更新触发标志，强制计算属性重新计算
  cooldownTrigger.value++;
};

// 修炼功能
const cultivate = () => {
  if (isOnCooldown.value || allSpiritRootsFull.value) return;

  // 获取当前所在地的灵脉
  const currentLocation = props.cultivator.currentLocation;
  const spiritVeins = currentLocation.spiritVeins;

  // 找到所有未满的灵根
  const all未满灵根 = props.cultivator.spiritRoots.filter(
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
          props.cultivator.spiritRootAbsorb.getCurrentValue();

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

          console.log(
            `从${未满灵根.type}灵脉中吸取了${actualAbsorbAmount}点灵气，升级${未满灵根.type}灵根`
          );

          // 设置冷却时间（使用游戏时间）
          const cooldownOther = props.cultivator.spiritRootCooldown
            .other as any;
          cooldownOther.lastOperationTime = Date.now(); // 保留现实时间（兼容旧代码）
          cooldownOther.lastOperationGameTime = gameTime.value.currentTime; // 存储游戏时间

          // 成功吸取后退出函数
          return;
        }
      }
    }
  }

  // 如果遍历完所有未满灵根都无法吸取，则提示
  console.log("当前地点没有可吸取的灵脉，无法获取经验");
};

// 突破功能
const breakthrough = () => {
  if (!canBreakthrough.value || isOnCooldown.value) return;

  // 这里可以添加突破的具体逻辑
  console.log("突破成功！");

  // 设置冷却时间（使用游戏时间）
  const cooldownOther = props.cultivator.spiritRootCooldown.other as any;
  cooldownOther.lastOperationTime = Date.now(); // 保留现实时间（兼容旧代码）
  cooldownOther.lastOperationGameTime = gameTime.value.currentTime; // 存储游戏时间
};

// 自动修炼开关变化处理
const handleAutoCultivateChange = (checked: boolean) => {
  if (checked) {
    // 启动自动修炼定时器
    autoCultivateInterval = window.setInterval(() => {
      if (!isOnCooldown.value && !allSpiritRootsFull.value) {
        cultivate();
      }
    }, 1000);
  } else {
    // 停止自动修炼定时器
    if (autoCultivateInterval) {
      window.clearInterval(autoCultivateInterval);
      autoCultivateInterval = null;
    }
  }
};

// 自动突破开关变化处理
const handleAutoBreakthroughChange = (checked: boolean) => {
  if (checked) {
    // 启动自动突破定时器
    autoBreakthroughInterval = window.setInterval(() => {
      if (canBreakthrough.value && !isOnCooldown.value) {
        breakthrough();
      }
    }, 1000);
  } else {
    // 停止自动突破定时器
    if (autoBreakthroughInterval) {
      window.clearInterval(autoBreakthroughInterval);
      autoBreakthroughInterval = null;
    }
  }
};

// 组件挂载时
onMounted(() => {
  // 初始更新一次
  cooldownTrigger.value++;

  // 监听时间变化事件
  eventManager.value.on(TimeEventType.TIME_CHANGED, handleTimeChanged);

  // 组件卸载时清理
  onUnmounted(() => {
    // 移除时间变化事件监听
    eventManager.value.off(TimeEventType.TIME_CHANGED, handleTimeChanged);

    if (autoCultivateInterval) {
      window.clearInterval(autoCultivateInterval);
    }
    if (autoBreakthroughInterval) {
      window.clearInterval(autoBreakthroughInterval);
    }
  });
});
</script>

<style scoped>
.content-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #000;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}

.content-content {
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  padding: 15px;
}

.content-content p {
  margin-bottom: 10px;
}

/* 操作面板样式 */
.operation-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.operation-item {
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 15px;
  transition: all 0.3s ease;
}

.operation-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.operation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.operation-label {
  font-size: 18px;
  font-weight: bold;
  color: #000;
}

.operation-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.operation-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 按钮样式 */
.operation-content .ant-btn {
  width: 120px;
  font-weight: bold;
}
</style>
