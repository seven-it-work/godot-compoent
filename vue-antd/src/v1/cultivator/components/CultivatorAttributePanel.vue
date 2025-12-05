<template>
  <div class="attribute-panel">
    <div class="attribute-grid" :style="{ '--columns': attributesPerRow }">
      <div v-for="attr in displayAttributes" :key="attr" class="attribute-item">
        <div class="attribute-label">{{ getAttributeLabel(attr) }}</div>
        <div class="attribute-value">
          <!-- 基础成长属性：直接显示值 -->
          <div
            v-if="getType(cultivator[attr]) === 'BasicGrowthAttribute'"
            class="basic-value"
          >
            {{ formatAttributeValue(cultivator[attr]) }}
          </div>
          <!-- 基础范围成长属性：显示进度条 -->
          <div
            v-else-if="getType(cultivator[attr]) === 'BasicRangeGrowthAttribute'"
            class="range-progress"
          >
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width: `${getProgressPercentage(cultivator[attr])}%`,
                  '--current-value': formatAttributeValue(cultivator[attr]),
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
            v-else-if="getType(cultivator[attr]) === 'BasicRangeRandomGrowthAttribute'"
          >
            {{ (cultivator[attr] as any).minRange }} ~
            {{ (cultivator[attr] as any).maxRange }}
          </div>
          <!-- 其他类型：默认显示 -->
          <div v-else>
            {{ formatAttributeValue(cultivator[attr]) }}
          </div>
        </div>
      </div>
    </div>
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
const attributesPerRow = 4;

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


const getType = (value: unknown): string => {
  if (value instanceof BasicGrowthAttribute){
    if(value instanceof BasicRangeGrowthAttribute){
      if(value instanceof BasicRangeRandomGrowthAttribute){
        return "BasicRangeRandomGrowthAttribute";
      }
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
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    if ("getCurrentValue" in obj && typeof obj.getCurrentValue === "function") {
      return `${obj.getCurrentValue()}`;
    }
  }
  return JSON.stringify(value);
};
</script>

<style scoped>
.attribute-panel {
  padding: 16px;
}

.attribute-grid {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  gap: 16px;
}

.attribute-item {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.attribute-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.attribute-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 基础值样式 */
.basic-value {
  font-size: 20px;
  color: #1890ff;
}

/* 范围进度条样式 */
.range-progress {
  width: 100%;
}

.progress-bar {
  position: relative;
  height: 20px;
  background-color: #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff 0%, #52c41a 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
  position: relative;
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
  font-size: 12px;
  color: #333;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
}

/* 范围值样式 */
.range-value {
  font-size: 16px;
  color: #fa8c16;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
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
