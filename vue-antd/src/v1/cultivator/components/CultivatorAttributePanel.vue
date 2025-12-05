<template>
  <div class="attribute-panel">
    <div class="attribute-grid">
      <!-- 直接使用div替代a-col，避免Ant Design栅格系统的样式影响 -->
      <div
        v-for="attr in displayAttributes"
        :key="attr"
        class="attribute-col"
        :style="{ width: `${100 / attributesPerRow}%` }"
      >
        <div class="attribute-card">
          <!-- 直接使用div替代ant-row，避免flex布局复杂性 -->
          <div class="attribute-row">
            <!-- 属性名称 -->
            <div class="attribute-label-col">
              <div class="attribute-label">{{ getAttributeLabel(attr) }}：</div>
            </div>
            <!-- 属性值 -->
            <div class="attribute-value-col">
              <!-- 基础成长属性：直接显示值 -->
              <div
                v-if="getType(cultivator[attr]) === 'BasicGrowthAttribute'"
                class="attribute-value"
              >
                {{ formatAttributeValue(cultivator[attr]) }}
              </div>
              <!-- 基础范围成长属性：显示进度条 -->
              <div
                v-else-if="
                  getType(cultivator[attr]) === 'BasicRangeGrowthAttribute'
                "
                class="attribute-value range-progress"
              >
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{
                      width: `${getProgressPercentage(cultivator[attr])}%`,
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
                class="attribute-value range-value"
              >
                {{ (cultivator[attr] as any).minRange }} ~
                {{ (cultivator[attr] as any).maxRange }}
              </div>
              <!-- 其他类型：默认显示 -->
              <div v-else class="attribute-value">
                {{ formatAttributeValue(cultivator[attr]) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基础重置 - 所有元素应用box-sizing: border-box */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 面板容器 */
.attribute-panel {
  padding: 0.5rem;
}

/* 网格布局 */
.attribute-grid {
  display: flex;
  flex-wrap: wrap;
}

/* 属性列 */
.attribute-col {
  width: 50%; /* 默认每行2个属性，对应24/attributesPerRow=12，即50% */
  padding: 2px;
}

/* 属性卡片 - 父容器，设置明确的最小高度 */
.attribute-card {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  min-height: 4vw;
  height: 100%;
  background: #fff;
}

/* 属性行 - 子容器，填充父容器 */
.attribute-row {
  display: flex;
  width: 100%;
  height: 100%;
}

/* 属性标签列 - 子容器，占据40%宽度 */
.attribute-label-col {
  width: 40%;
  height: 100%;
  display: flex;
}

/* 属性值列 - 子容器，占据60%宽度 */
.attribute-value-col {
  width: 60%;
  height: 100%;
  display: flex;
  background: #f5f5f5;
}

/* 属性标签 - 最终子元素，完全填充父容器 */
.attribute-label {
  width: 100%;
  height: 100%;
  padding: 0 4px;
  border: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #495057;
  font-weight: 500;
}

/* 属性值 - 最终子元素，完全填充父容器 */
.attribute-value {
  width: 100%;
  height: 100%;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  color: #212529;
}

/* 范围值样式 */
.range-value {
  color: #fa8c16;
}

/* 范围进度条样式 */
.range-progress {
  padding: 0;
  /* 确保占满父元素 */
  width: 100%;
  height: 100%;
}

/* 进度条容器 */
.progress-bar {
  position: relative;
  width: 100%;
  /* 占满父元素高度 */
  height: 100%;
  background-color: #e8e8e8;
  border-radius: 0.625rem;
  overflow: hidden;
}

/* 进度条填充 */
.progress-fill {
  height: 100%;
  background: #1890ff;
  border-radius: 0.625rem;
  transition: width 0.3s ease;
}

/* 进度条文本 */
.progress-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #333;
  font-weight: bold;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 确保文本覆盖整个进度条 */
  width: 100%;
  height: 100%;
}
</style>

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
