<template>
  <div class="attribute-panel">
    <div style="display: flex; flex-wrap: wrap;">
      <a-col
        v-for="attr in displayAttributes"
        :key="attr"
        :span="24 / attributesPerRow"
      >
        <div 
         style="border: 1px solid #e8e8e8;margin: 2px; border-radius: 4px;">
          <a-row >
            <!-- 属性名称 -->
            <a-col :span="10" >
              <div class="attribute-label" >{{ getAttributeLabel(attr) }}：</div>
            </a-col>
            <!-- 属性值 -->
            <a-col :span="14" style="background: #f5f5f5;">
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
            </a-col>
          </a-row>
        </div>
      </a-col>
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

