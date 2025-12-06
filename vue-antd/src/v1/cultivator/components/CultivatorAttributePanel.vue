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
              <div class="attribute-label">
                {{ (cultivator[attr] as BasicGrowthAttribute).name }}：
              </div>
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
                <ProgressBar
                  :current-value="
                    (
                      cultivator[attr] as BasicRangeGrowthAttribute
                    ).getCurrentValue()
                  "
                  :min-value="
                    (cultivator[attr] as BasicRangeGrowthAttribute).minRange
                  "
                  :max-value="
                    (cultivator[attr] as BasicRangeGrowthAttribute).maxRange
                  "
                  color-type="gradient"
                />
              </div>
              <!-- 基础范围随机成长属性：显示范围值 -->
              <div
                v-else-if="
                  getType(cultivator[attr]) ===
                  'BasicRangeRandomGrowthAttribute'
                "
                class="attribute-value range-value"
              >
                {{
                  (cultivator[attr] as BasicRangeRandomGrowthAttribute).minRange
                }}
                ~
                {{
                  (cultivator[attr] as BasicRangeRandomGrowthAttribute).maxRange
                }}
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
  font-size: 0.8rem;
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
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<script setup lang="ts">
import { CultivatorClass } from "@/v1/cultivator";
import { 展示的属性 } from "@/v1/cultivator/define";
import {
  BasicGrowthAttribute,
  BasicRangeGrowthAttribute,
  BasicRangeRandomGrowthAttribute,
} from "@/v1/growthAttribute/impl";
import ProgressBar from "@/v1/components/ProgressBar.vue";

// 配置每行显示的属性数量
const attributesPerRow = 2;

// 只显示需要展示的属性
const displayAttributes = 展示的属性;

defineProps<{
  cultivator: CultivatorClass;
}>();

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
