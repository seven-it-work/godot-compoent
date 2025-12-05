<template>
  <div class="attribute-panel">
    <a-row :gutter="[16, 16]">
      <a-col
        v-for="attr in displayAttributes"
        :key="attr"
        :span="24 / attributesPerRow"
      >
        <div class="attribute-item">
          <a-row :gutter="[8, 0]">
            <!-- 属性名称 -->
            <a-col :span="10" style="height: 100%;">
              <div class="attribute-label" style="height: 100%;">{{ getAttributeLabel(attr) }}</div>
            </a-col>
            <!-- 属性值 -->
            <a-col :span="14"style="height: 100%;">
              <div class="attribute-value">
                <!-- 基础成长属性：直接显示值 -->
                <div
                  v-if="getType(cultivator[attr]) === 'BasicGrowthAttribute'"
                >
                  {{ formatAttributeValue(cultivator[attr]) }}
                </div>
                <!-- 基础范围成长属性：显示进度条 -->
                <div
                  v-else-if="
                    getType(cultivator[attr]) === 'BasicRangeGrowthAttribute'
                  "
                  class="range-progress"
                >
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{
                        width: `${getProgressPercentage(cultivator[attr])}%`,
                        '--current-value': formatAttributeValue(
                          cultivator[attr]
                        ),
                        '--min-value': (cultivator[attr] as any).minRange,
                        '--max-value': (cultivator[attr] as any).maxRange,
                      }"
                    ></div>
                    <div class="progress-text">
                      {{ formatAttributeValue(cultivator[attr]) }} /
                      {{ (cultivator[attr] as any).maxRange }}
                    </div>
                  </div>
                </div>
                <!-- 基础范围随机成长属性：显示范围值 -->
                <div
                  v-else-if="
                    getType(cultivator[attr]) ===
                    'BasicRangeRandomGrowthAttribute'
                  "
                >
                  {{ (cultivator[attr] as any).minRange }} ~
                  {{ (cultivator[attr] as any).maxRange }}
                </div>
                <!-- 其他类型：默认显示 -->
                <div v-else>
                  {{ formatAttributeValue(cultivator[attr]) }}
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { CultivatorClass } from "@/v1/cultivator";
import { 展示的属性 } from "@/v1/cultivator/define";
import type { Cultivator } from "@/v1/cultivator/define";
import {
  BasicGrowthAttribute,
  BasicRangeGrowthAttribute,
  BasicRangeRandomGrowthAttribute,
} from "@/v1/growthAttribute/impl";

// 配置每行显示的属性数量
const attributesPerRow = 2;

// 只显示需要展示的属性
const displayAttributes = 展示的属性;

defineProps<{
  cultivator: CultivatorClass;
}>();

// 属性名称映射
const attributeLabels: Record<keyof Cultivator, string> = {
  attack: "攻击力",
  defense: "防御力",
  qiBlood: "气血",
  criticalRate: "暴击率",
  criticalDamage: "暴击伤害",
  dodgeRate: "闪避率",
  spiritPower: "灵力",
  breakthroughChance: "突破概率",
  // 其他属性的默认值
  id: "ID",
  name: "名称",
  spiritRoots: "灵根",
  realmLevel: "境界等级",
  gender: "性别",
  cultivationMethods: "功法列表",
};

// 获取属性中文名称
const getAttributeLabel = (attr: keyof Cultivator): string => {
  return attributeLabels[attr] || attr;
};

// 获取属性类型
const getType = (value: unknown): string => {
  if (value instanceof BasicGrowthAttribute) {
    if (value instanceof BasicRangeRandomGrowthAttribute) {
      return "BasicRangeRandomGrowthAttribute";
    } else if (value instanceof BasicRangeGrowthAttribute) {
      return "BasicRangeGrowthAttribute";
    }
    return "BasicGrowthAttribute";
  }
  return "Unknown";
};

// 计算进度条百分比
const getProgressPercentage = (value: unknown): number => {
  if (value instanceof BasicRangeGrowthAttribute) {
    const current = value.getCurrentValue();
    const min = value.minRange;
    const max = value.maxRange;
    return Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100));
  }
  throw new Error("不是 BasicRangeGrowthAttribute 类型");
};

// 格式化属性值
const formatAttributeValue = (value: unknown): string => {
  if (value == null) return "0";
  // 处理 GrowthAttribute 类型
  if (value instanceof BasicGrowthAttribute) {
    return `${value.getCurrentValue()}`;
  }
  return JSON.stringify(value);
};
</script>

<style scoped>
/* 根元素字体大小作为基准，基于视口宽度动态计算，确保不同分辨率下自适应 */
:root {
  font-size: calc(10px + 0.25vw);
}

.attribute-panel {
  /* 使用rem单位，基于根元素字体大小 */
  padding: 1rem;
}

.attribute-item {
  background: #f5f5f5;
  /* 边框半径使用rem单位 */
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 确保内部a-row占满高度 */
.attribute-item > .ant-row {
  display: flex;
  height: 100%;
  width: 100%;
  /* 恢复默认的水平排列 */
  flex-direction: row;
}

/* 确保a-col占满高度 */
.attribute-item .ant-col {
  display: flex;
  height: 100%;
  /* 内容垂直居中 */
  align-items: center;
}

.attribute-label {
  /* 字体大小使用rem单位 */
  font-size: 0.875rem;
  color: #666;
}

.attribute-value {
  /* 字体大小使用rem单位 */
  font-size: 1.125rem;
  font-weight: bold;
  color: #333;
  word-wrap: break-word;
  white-space: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

/* 基础值样式 */
.basic-value {
  /* 字体大小使用rem单位 */
  font-size: 1.25rem;
  color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 范围进度条样式 */
.range-progress {
  width: 100%;
  /* 最小高度使用rem单位 */
  min-height: 1.25rem;
}

.progress-bar {
  position: relative;
  height: auto;
  /* 最小高度使用rem单位 */
  min-height: 1.25rem;
  background-color: #e8e8e8;
  /* 边框半径使用rem单位 */
  border-radius: 0.625rem;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff 0%, #52c41a 100%);
  /* 边框半径使用rem单位 */
  border-radius: 0.625rem;
  transition: width 0.3s ease;
  position: relative;
  /* 最小高度使用rem单位 */
  min-height: 1.25rem;
}

.progress-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 字体大小使用rem单位 */
  font-size: 0.75rem;
  color: #333;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 内边距使用rem单位 */
  padding: 0 0.5rem;
}

/* 范围值样式 */
.range-value {
  /* 字体大小使用rem单位 */
  font-size: 1rem;
  color: #fa8c16;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 间距使用rem单位 */
  gap: 0.25rem;
  flex-wrap: wrap;
}

.range-value::before {
  content: "[";
  color: #666;
}

.range-value::after {
  content: "]";
  color: #666;
}
</style>
