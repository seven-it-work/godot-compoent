<!-- 
灵根面板组件
展示修仙者的五行灵根属性
-->

<template>
  <div class="spirit-root-panel">
    <!-- 灵根属性 -->
    <div class="element-section">
      <div
        v-for="spiritRoot in cultivator.spiritRoots"
        :key="spiritRoot.type"
        class="element-item"
      >
        <div
          class="element-progress"
          @click="absorbSpiritRootExperience(spiritRoot)"
          :class="{ absorbable: !isOnCooldown, 'on-cooldown': isOnCooldown }"
        >
          <ProgressBar
            :current-value="spiritRoot.spiritValue.getCurrentValue()"
            :min-value="0"
            :max-value="100"
            color-type="single"
            :single-color="getElementColor(spiritRoot.type)"
            text-color="#000"
          >
            <template #progress-text="{ displayText }">
              {{ spiritRoot.type }}
              {{ spiritRoot.attribute.getCurrentValue() }}级 {{ displayText }}
            </template>
          </ProgressBar>
          <!-- 冷却进度显示 -->
          <div
            v-if="isOnCooldown"
            class="cooldown-overlay"
            :style="{ width: `${cooldownProgress}%` }"
          >
            <div class="cooldown-text">{{ Math.ceil(remainingCooldown) }}s</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { CultivatorClass } from "../impl";
import ProgressBar from "../../components/ProgressBar.vue";
import {
  SPIRIT_ROOT_COLORS,
  type SpiritRootType,
} from "../../spiritRoot/define";
import { SpiritRootClass } from "../../spiritRoot/impl";

// 获取五行元素颜色
const getElementColor = (element: SpiritRootType): string => {
  return SPIRIT_ROOT_COLORS[element] || "#1890ff";
};

const props = defineProps<{
  cultivator: CultivatorClass;
}>();

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

const isOnCooldown = computed(() => {
  const other = props.cultivator.spiritRootCooldown.other as any;
  const elapsed = (nowTime.value - other.lastOperationTime) / 1000;
  return elapsed < cooldownTime.value;
});

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

const cooldownProgress = computed(() => {
  if (!isOnCooldown.value) return 0;
  return (remainingCooldown.value / cooldownTime.value) * 100;
});

// 冷却倒计时更新
let cooldownInterval: number | null = null;
const updateCooldown = () => {
  // 更新当前时间，触发响应式更新
  nowTime.value = Date.now();
};

onMounted(() => {
  // 初始更新一次
  updateCooldown();
  // 启动定时器
  cooldownInterval = window.setInterval(updateCooldown, 1000);
});

onUnmounted(() => {
  // 清理定时器
  if (cooldownInterval) {
    window.clearInterval(cooldownInterval);
    cooldownInterval = null;
  }
});

// 灵根经验吸收函数
const absorbSpiritRootExperience = (spiritRoot: SpiritRootClass) => {
  // 检查是否在冷却中
  if (isOnCooldown.value) {
    return;
  }

  // 检查灵根经验是否已满
  const currentSpiritValue = spiritRoot.spiritValue.getCurrentValue();
  if (currentSpiritValue >= 100) {
    return;
  }

  // 获取当前所在地的灵脉
  const currentLocation = props.cultivator.currentLocation;
  const spiritVeins = currentLocation.spiritVeins;

  // 查找对应类型的灵脉
  const targetVein = spiritVeins.find((vein) => vein.type === spiritRoot.type);

  // 如果没有对应类型的灵脉，则无法吸取
  if (!targetVein) {
    console.log(`当前地点没有${spiritRoot.type}灵脉，无法吸取经验`);
    return;
  }

  // 获取灵脉中的灵气值
  const veinSpiritValue = targetVein.spiritValue.getCurrentValue();

  // 如果灵脉中没有灵气，则无法吸取
  if (veinSpiritValue <= 0) {
    console.log(`${spiritRoot.type}灵脉中没有灵气，无法吸取经验`);
    return;
  }

  // 计算吸收量
  const absorbAmount = props.cultivator.spiritRootAbsorb.getCurrentValue();

  // 实际能吸取的数量（不超过灵脉中的灵气值和灵根升级所需的经验值）
  const actualAbsorbAmount = Math.min(
    absorbAmount,
    veinSpiritValue,
    100 - currentSpiritValue
  );

  // 如果实际能吸取的数量为0，则退出
  if (actualAbsorbAmount <= 0) {
    return;
  }

  // 从灵脉中扣除灵气
  targetVein.spiritValue.setCurrentValue(veinSpiritValue - actualAbsorbAmount);

  // 更新灵根经验值
  const newValue = currentSpiritValue + actualAbsorbAmount;
  spiritRoot.spiritValue.setCurrentValue(newValue);

  console.log(
    `从${spiritRoot.type}灵脉中吸取了${actualAbsorbAmount}点灵气，升级${spiritRoot.type}灵根`
  );

  // 设置冷却时间
  (props.cultivator.spiritRootCooldown.other as any).lastOperationTime =
    Date.now();
};
</script>

<style scoped>
.spirit-root-panel {
  width: 100%;
  height: auto;
}

/* 五行属性 */
.element-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
  border: 2px solid #000;
  background-color: #fff;
}

.element-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.element-label {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #000;
}

.element-progress {
  height: 30px;
  border: 1px solid #000;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 可吸收状态 */
.element-progress.absorbable {
  border-color: #52c41a;
  box-shadow: 0 0 5px rgba(82, 196, 26, 0.3);
}

.element-progress.absorbable:hover {
  transform: scale(1.02);
  box-shadow: 0 0 8px rgba(82, 196, 26, 0.5);
}

/* 冷却状态 */
.element-progress.on-cooldown {
  border-color: #ff4d4f;
  cursor: not-allowed;
  opacity: 0.7;
}

/* 冷却覆盖层 */
.cooldown-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(255, 77, 79, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 1s linear;
}

/* 冷却文字 */
.cooldown-text {
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
</style>
