<!-- 
灵根面板组件
展示修仙者的五行灵根属性
-->

<template>
  <div class="spirit-root-panel">
    <!-- 五行属性 -->
    <div class="element-section">
      <div
        v-for="element in SPIRIT_ROOT_TYPES"
        :key="element"
        class="element-item"
      >
        <div class="element-progress">
          <ProgressBar
            :current-value="getElementValue(element)"
            :min-value="0"
            :max-value="100"
            color-type="single"
            :single-color="getElementColor(element)"
            text-color="#000"
          >
            <template #progress-text="{ displayText }">
              {{ element }}：{{ displayText }}
            </template>
          </ProgressBar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CultivatorClass } from "../impl";
import ProgressBar from "@/v1/components/ProgressBar.vue";
import {
  SPIRIT_ROOT_TYPES,
  SPIRIT_ROOT_COLORS,
  type SpiritRootType,
} from "@/v1/spiritRoot/define";

// 获取五行元素值
const getElementValue = (_element: SpiritRootType): number => {
  // 这里需要根据实际数据结构调整，暂时返回模拟值
  return 50;
};

// 获取五行元素颜色
const getElementColor = (element: SpiritRootType): string => {
  return SPIRIT_ROOT_COLORS[element] || "#1890ff";
};

defineProps<{
  cultivator: CultivatorClass;
}>();
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
}
</style>