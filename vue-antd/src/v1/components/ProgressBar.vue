<template>
  <div class="progress-container">
    <div class="progress-bar">
      <div
        class="progress-fill"
        :class="progressClass"
        :style="{
          width: `${percentage}%`,
          background: fillBackground,
        }"
      ></div>
      <div class="progress-text" :style="textStyle">
        <slot name="progress-text" v-bind:displayText="displayText">
          {{ displayText }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
// 定义颜色类型枚举
type ColorType = "single" | "gradient" | "multi";

// 定义组件属性
const props = withDefaults(
  defineProps<{
    // 当前值
    currentValue: number;
    // 最小值
    minValue: number;
    // 最大值
    maxValue: number;
    // 颜色类型：single(单色), gradient(渐变色), multi(多色间断色)
    colorType?: ColorType;
    // 自定义颜色（单色时使用）
    singleColor?: string;
    // 渐变色数组（渐变色时使用）
    gradientColors?: string[];
    // 多色数组（多色间断色时使用）
    multiColors?: { color: string; range: [number, number] }[];
    // 是否显示文本
    showText?: boolean;
    // 自定义文本
    customText?: string;
    // 字体颜色
    textColor?: string;
    // 字体大小
    fontSize?: string;
    // 字体粗细
    fontWeight?: string | number;
    // 文本阴影
    textShadow?: string;
  }>(),
  {
    colorType: "gradient",
    singleColor: "#1890ff",
    gradientColors: () => ["#1890ff", "#52c41a"],
    multiColors: () => [
      { color: "#ff4d4f", range: [0, 30] },
      { color: "#faad14", range: [31, 70] },
      { color: "#52c41a", range: [71, 100] },
    ],
    showText: true,
    textColor: "#fff",
    fontSize: "0.75rem",
    fontWeight: "bold",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
  }
);

// 计算进度百分比
const percentage = computed(() => {
  const { currentValue, minValue, maxValue } = props;
  const range = maxValue - minValue;
  if (range <= 0) return 0;
  const progress = ((currentValue - minValue) / range) * 100;
  return Math.min(100, Math.max(0, progress));
});

// 计算进度条类名
const progressClass = computed(() => {
  const colorType = props.colorType || "gradient";
  return {
    "single-color": colorType === "single",
    "gradient-color": colorType === "gradient",
    "multi-color": colorType === "multi",
  };
});

// 计算填充背景色
const fillBackground = computed(() => {
  const { colorType, singleColor, gradientColors, multiColors } = props;
  const percent = percentage.value;

  switch (colorType) {
    case "single":
      // 单色模式
      return singleColor;
    case "gradient":
      // 渐变色模式
      const gradient = gradientColors!.join(", ");
      return `linear-gradient(90deg, ${gradient})`;
    case "multi":
      // 多色间断色模式
      // 根据百分比找到对应的颜色
      const matchingColor = multiColors!.find((colorItem) => {
        const [min, max] = colorItem.range;
        return percent >= min && percent <= max;
      });
      return matchingColor?.color || "#1890ff";
    default:
      return "#1890ff";
  }
});

// 计算显示文本
const displayText = computed(() => {
  // 如果提供了自定义文本，则使用自定义文本
  if (props.customText) {
    return props.customText;
  }
  // 否则显示默认文本
  return `${props.currentValue} / ${props.maxValue}`;
});

// 计算文本样式
const textStyle = computed(() => {
  return {
    color: props.textColor,
    fontSize: props.fontSize,
    fontWeight: props.fontWeight,
    textShadow: props.textShadow,
  };
});
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.progress-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 0 6px rgba(24, 144, 255, 0.3);
}

.progress-text {
  position: absolute;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 0.75rem;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  clip-path: none !important;
  overflow: visible !important;
}

/* 进度条基础样式 - 颜色由JS动态计算 */

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
