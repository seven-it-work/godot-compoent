<template>
  <div>
    <!-- 地点基本信息 -->
    <div>
      <div class="location-header">
        <div class="location-name">
          {{ location.name }}
        </div>
        <div class="location-type-level">
          <span>{{ location.type.name }}</span>
          <span>等级:{{ location.level.getCurrentValue() }}</span>
        </div>
      </div>
      <span class="location-description">{{ location.description }}</span>
    </div>
    <!-- 灵脉信息 -->
    <a-row :gutter="16">
      <a-col
        :span="12"
        v-for="(vein, index) in location.spiritVeins"
        :key="index"
      >
        <a-card size="small" :bordered="true" class="spirit-vein-card">
          <div class="spirit-vein-header">
            <span>{{ vein.type }}灵脉</span>
            <span>等级 {{ vein.attribute.getCurrentValue() }}</span>
            <span :class="{ active: vein.isActive, inactive: !vein.isActive }">
              {{ vein.isActive ? "活跃" : "不活跃" }}
            </span>
          </div>
          <div class="spirit-vein-details">
            <div class="spirit-value-container">
              {{ getSpiritValue(vein) }}
              <ProgressBar
                :current-value="getSpiritValue(vein)"
                :min-value="vein.spiritValue.minRange"
                :max-value="vein.spiritValue.maxRange"
                :show-text="false"
                :text-color="vein.isActive ? '#52c41a' : '#ff4d4f'"
              >
                <template #progress-text="{ displayText }">
                  <div class="span-container">
                    <span class="center-span">{{ displayText }}</span>
                    <span class="right-span" v-if="vein.isActive"
                      >+{{ vein.productionRate.getCurrentValue() }}</span
                    >
                  </div>
                </template>
              </ProgressBar>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import type { Location, LocationClass, SpiritVein } from "@/v1/location";
import type { BasicRangeGrowthAttribute } from "@/v1/growthAttribute/impl";

import type { Cultivator } from "@/v1/cultivator";
import ProgressBar from "@/v1/components/ProgressBar.vue";

const props = defineProps<{
  location: Location;
  cultivator: Cultivator;
}>();

// 创建响应式的灵脉灵气值映射，用于触发视图更新
const spiritValues = ref<Map<SpiritVein, number>>(new Map());

// 初始化灵脉灵气值映射
const initSpiritValues = () => {
  const newValues = new Map<SpiritVein, number>();
  if (props.location.spiritVeins) {
    props.location.spiritVeins.forEach((vein) => {
      newValues.set(vein, vein.spiritValue.getCurrentValue());
    });
  }
  spiritValues.value = newValues;
};

// 监听灵脉变化，重新初始化灵气值映射
watch(
  () => props.location.spiritVeins,
  () => {
    initSpiritValues();
  },
  { deep: true }
);

// 创建定时器，定期检查灵脉灵气值变化并更新映射
let spiritValueCheckInterval: number | null = null;

// 启动灵气值检查定时器
const startSpiritValueCheck = () => {
  if (spiritValueCheckInterval) return;

  // 每100ms检查一次灵气值变化
  spiritValueCheckInterval = window.setInterval(() => {
    let hasChanges = false;
    const newValues = new Map<SpiritVein, number>(spiritValues.value);

    if (props.location.spiritVeins) {
      props.location.spiritVeins.forEach((vein) => {
        const currentValue = vein.spiritValue.getCurrentValue();
        const storedValue = newValues.get(vein);

        if (storedValue !== currentValue) {
          newValues.set(vein, currentValue);
          hasChanges = true;
        }
      });
    }

    if (hasChanges) {
      spiritValues.value = newValues;
    }
  }, 100);
};

// 停止灵气值检查定时器
const stopSpiritValueCheck = () => {
  if (spiritValueCheckInterval) {
    clearInterval(spiritValueCheckInterval);
    spiritValueCheckInterval = null;
  }
};

// 组件挂载时启动定时器
onMounted(() => {
  initSpiritValues();
  startSpiritValueCheck();
});

// 组件卸载时停止定时器
onUnmounted(() => {
  stopSpiritValueCheck();
});

// 获取灵脉的当前灵气值
const getSpiritValue = (vein: SpiritVein): number => {
  return spiritValues.value.get(vein) || vein.spiritValue.getCurrentValue();
};
</script>

<style scoped>
/* 地点基本信息布局 */
.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.location-name {
  font-size: 16px;
  font-weight: bold;
}

.location-type-level {
  display: flex;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.active {
  color: #52c41a;
}

.inactive {
  color: #ff4d4f;
}

/* 灵脉卡片样式 */
.spirit-vein-card {
  margin-bottom: 8px !important;
  min-height: auto;
}

/* 生产速率文本样式 */
.production-rate {
  margin-left: auto;
  padding-right: 10px;
  color: #52c41a;
}

/* 进度条文本布局 */
.progress-text-content {
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
}

.spirit-vein-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 14px;
}

.spirit-vein-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

/* 灵气值进度条样式 */
.spirit-value-container {
  height: 30px;
}

.spirit-value-label {
  font-size: 12px;
  color: #666;
}

.spirit-value-progress {
  width: 100%;
  margin: 2px 0;
}

.spirit-value-text {
  font-size: 11px;
  color: #999;
  text-align: right;
}

/* 容器样式：核心优化-增加最小宽度和内边距 */
.span-container {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 20px;
  /* 左右内边距，避免span贴容器边缘 */
  box-sizing: border-box;
  /* 内边距计入宽度，防止容器总宽度超出 */
}

/* 居中的span：优化-增加最小右侧间距，避免和右侧span贴紧 */
.center-span {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #f0f8ff;
  /* 背景色方便查看范围，可删除 */
}

/* 靠右的span：优化-固定最小宽度，避免内容挤压 */
.right-span {
  margin-left: auto;
  text-align: right;
  /* 内容靠右对齐，视觉更统一 */
}
</style>
