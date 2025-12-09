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

// 定义组件属性
const props = defineProps<{
  cultivator: CultivatorClass;
}>();

// 自动修炼开关
const autoCultivate = ref(false);
// 自动突破开关
const autoBreakthrough = ref(false);

// 冷却状态管理
const nowTime = ref<number>(Date.now());

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
  const other = props.cultivator.spiritRootCooldown.other as any;
  const elapsed = (nowTime.value - other.lastOperationTime) / 1000;
  return elapsed < cooldownTime.value;
});

// 剩余冷却时间
const remainingCooldown = computed(() => {
  if (!isOnCooldown.value) {
    // 冷却结束，重置 currentCooldown
    (props.cultivator.spiritRootCooldown.other as any).currentCooldown = 0;
    return 0;
  }

  const other = props.cultivator.spiritRootCooldown.other as any;
  const elapsed = (nowTime.value - other.lastOperationTime) / 1000;
  return cooldownTime.value - elapsed;
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

// 更新当前时间
const updateNowTime = () => {
  nowTime.value = Date.now();
};

// 修炼功能
const cultivate = () => {
  if (isOnCooldown.value || allSpiritRootsFull.value) return;

  // 找到未满的灵根并吸收经验
  const 未满灵根 = props.cultivator.spiritRoots.find(
    (root) => root.spiritValue.getCurrentValue() < 100
  );

  if (未满灵根) {
    // 计算吸收量
    const absorbAmount = props.cultivator.spiritRootAbsorb.getCurrentValue();

    // 只吸收一个未满灵根的经验
    const currentSpiritValue = 未满灵根.spiritValue.getCurrentValue();
    if (currentSpiritValue < 100) {
      // 更新灵根经验值
      const newValue = Math.min(100, currentSpiritValue + absorbAmount);
      未满灵根.spiritValue.currentValue = newValue;
    }

    // 设置冷却时间
    (props.cultivator.spiritRootCooldown.other as any).lastOperationTime =
      Date.now();
  }
};

// 突破功能
const breakthrough = () => {
  if (!canBreakthrough.value || isOnCooldown.value) return;

  // 这里可以添加突破的具体逻辑
  console.log("突破成功！");

  // 设置冷却时间
  (props.cultivator.spiritRootCooldown.other as any).lastOperationTime =
    Date.now();
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
  // 启动时间更新定时器
  const timeInterval = window.setInterval(updateNowTime, 1000);

  // 组件卸载时清理
  onUnmounted(() => {
    window.clearInterval(timeInterval);
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
