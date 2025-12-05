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

/* 进度条容器 */
.progress-bar {
  position: relative;
  width: 100%;
  /* 固定高度，确保进度条显示正常 */
  height: 100%;
  /* 未填充部分背景颜色 */
  background-color: #f0f2f5;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 进度条填充 - 单色模式 */
.progress-fill {
  height: 100%;
  /* 默认蓝色渐变 */
  background: linear-gradient(90deg, #1890ff 0%, #52c41a 100%);
  transition: all 0.3s ease;
  position: relative;
  /* 阴影效果，增强立体感 */
  box-shadow: 0 0 6px rgba(24, 144, 255, 0.3);
}

/* 进度条文本 */
.progress-text {
  position: absolute;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  /* 确保完全覆盖父元素 */
  width: 100% !important;
  height: 100% !important;
  /* 确保没有边距或内边距影响 */
  margin: 0 !important;
  padding: 0 !important;
  /* 确保内容居中 */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  /* 文本样式 */
  font-size: 0.75rem;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 确保显示在最上层 */
  z-index: 999 !important;
  /* 确保不被裁剪 */
  clip-path: none !important;
  overflow: visible !important;
}

/* 阶段色进度条 - 低进度（0-30%） */
.progress-fill[style*="width: 0%"],
.progress-fill[style*="width: 1%"],
.progress-fill[style*="width: 2%"],
.progress-fill[style*="width: 3%"],
.progress-fill[style*="width: 4%"],
.progress-fill[style*="width: 5%"],
.progress-fill[style*="width: 6%"],
.progress-fill[style*="width: 7%"],
.progress-fill[style*="width: 8%"],
.progress-fill[style*="width: 9%"],
.progress-fill[style*="width: 10%"],
.progress-fill[style*="width: 11%"],
.progress-fill[style*="width: 12%"],
.progress-fill[style*="width: 13%"],
.progress-fill[style*="width: 14%"],
.progress-fill[style*="width: 15%"],
.progress-fill[style*="width: 16%"],
.progress-fill[style*="width: 17%"],
.progress-fill[style*="width: 18%"],
.progress-fill[style*="width: 19%"],
.progress-fill[style*="width: 20%"],
.progress-fill[style*="width: 21%"],
.progress-fill[style*="width: 22%"],
.progress-fill[style*="width: 23%"],
.progress-fill[style*="width: 24%"],
.progress-fill[style*="width: 25%"],
.progress-fill[style*="width: 26%"],
.progress-fill[style*="width: 27%"],
.progress-fill[style*="width: 28%"],
.progress-fill[style*="width: 29%"],
.progress-fill[style*="width: 30%"] {
  /* 低进度 - 红色系 */
  background: linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%);
}

/* 阶段色进度条 - 中进度（31-70%） */
.progress-fill[style*="width: 31%"],
.progress-fill[style*="width: 32%"],
.progress-fill[style*="width: 33%"],
.progress-fill[style*="width: 34%"],
.progress-fill[style*="width: 35%"],
.progress-fill[style*="width: 36%"],
.progress-fill[style*="width: 37%"],
.progress-fill[style*="width: 38%"],
.progress-fill[style*="width: 39%"],
.progress-fill[style*="width: 40%"],
.progress-fill[style*="width: 41%"],
.progress-fill[style*="width: 42%"],
.progress-fill[style*="width: 43%"],
.progress-fill[style*="width: 44%"],
.progress-fill[style*="width: 45%"],
.progress-fill[style*="width: 46%"],
.progress-fill[style*="width: 47%"],
.progress-fill[style*="width: 48%"],
.progress-fill[style*="width: 49%"],
.progress-fill[style*="width: 50%"],
.progress-fill[style*="width: 51%"],
.progress-fill[style*="width: 52%"],
.progress-fill[style*="width: 53%"],
.progress-fill[style*="width: 54%"],
.progress-fill[style*="width: 55%"],
.progress-fill[style*="width: 56%"],
.progress-fill[style*="width: 57%"],
.progress-fill[style*="width: 58%"],
.progress-fill[style*="width: 59%"],
.progress-fill[style*="width: 60%"],
.progress-fill[style*="width: 61%"],
.progress-fill[style*="width: 62%"],
.progress-fill[style*="width: 63%"],
.progress-fill[style*="width: 64%"],
.progress-fill[style*="width: 65%"],
.progress-fill[style*="width: 66%"],
.progress-fill[style*="width: 67%"],
.progress-fill[style*="width: 68%"],
.progress-fill[style*="width: 69%"],
.progress-fill[style*="width: 70%"] {
  /* 中进度 - 黄色系 */
  background: linear-gradient(90deg, #faad14 0%, #ffc53d 100%);
}

/* 阶段色进度条 - 高进度（71-100%） */
.progress-fill[style*="width: 71%"],
.progress-fill[style*="width: 72%"],
.progress-fill[style*="width: 73%"],
.progress-fill[style*="width: 74%"],
.progress-fill[style*="width: 75%"],
.progress-fill[style*="width: 76%"],
.progress-fill[style*="width: 77%"],
.progress-fill[style*="width: 78%"],
.progress-fill[style*="width: 79%"],
.progress-fill[style*="width: 80%"],
.progress-fill[style*="width: 81%"],
.progress-fill[style*="width: 82%"],
.progress-fill[style*="width: 83%"],
.progress-fill[style*="width: 84%"],
.progress-fill[style*="width: 85%"],
.progress-fill[style*="width: 86%"],
.progress-fill[style*="width: 87%"],
.progress-fill[style*="width: 88%"],
.progress-fill[style*="width: 89%"],
.progress-fill[style*="width: 90%"],
.progress-fill[style*="width: 91%"],
.progress-fill[style*="width: 92%"],
.progress-fill[style*="width: 93%"],
.progress-fill[style*="width: 94%"],
.progress-fill[style*="width: 95%"],
.progress-fill[style*="width: 96%"],
.progress-fill[style*="width: 97%"],
.progress-fill[style*="width: 98%"],
.progress-fill[style*="width: 99%"],
.progress-fill[style*="width: 100%"] {
  /* 高进度 - 绿色系 */
  background: linear-gradient(90deg, #52c41a 0%, #73d13d 100%);
}

/* 进度条动画效果 */
.progress-fill {
  animation: progress-pulse 2s infinite;
}

@keyframes progress-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
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
