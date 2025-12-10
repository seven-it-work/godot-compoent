<template>
  <div class="spirit-root-info">
    <div class="spirit-root-header">
      <span class="spirit-root-name">{{ spiritRoot.type }}</span>
      <span class="spirit-root-grade">{{ getSpiritRootGrade() }}</span>
    </div>
    <div class="spirit-root-body">
      <div class="spirit-value">
        <div class="value-header">
          <span class="value-label">灵根值</span>
          <span class="value-number">{{
            spiritRoot.spiritValue.getCurrentValue()
          }}</span>
        </div>
        <div class="spirit-value-progress">
          <div
            class="progress-bar"
            :style="{ width: getSpiritValueProgress() + '%' }"
          ></div>
        </div>
      </div>
      <div class="spirit-root-attributes">
        <div
          class="attribute-item"
          v-for="attribute in getSpiritRootAttributes()"
          :key="attribute.name"
        >
          <span class="attribute-name">{{ attribute.name }}</span>
          <span class="attribute-bonus">+{{ attribute.bonus }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpiritRoot } from "../define";

// 定义组件属性
const { spiritRoot } = defineProps<{
  spiritRoot: SpiritRoot;
}>();

/**
 * 获取灵根等级
 */
const getSpiritRootGrade = (): string => {
  const value = spiritRoot.spiritValue.getCurrentValue();
  if (value >= 90) return "天级";
  if (value >= 70) return "地级";
  if (value >= 50) return "玄级";
  if (value >= 30) return "黄级";
  return "凡级";
};

/**
 * 获取灵根值进度百分比
 */
const getSpiritValueProgress = (): number => {
  const maxValue = 100; // 假设灵根最大值为100
  const currentValue = spiritRoot.spiritValue.getCurrentValue();
  return Math.min((currentValue / maxValue) * 100, 100);
};

/**
 * 获取灵根对属性的加成
 */
const getSpiritRootAttributes = () => {
  const value = spiritRoot.spiritValue.getCurrentValue();
  const baseBonus = Math.floor(value / 10);

  // 根据灵根类型提供不同的属性加成
  switch (spiritRoot.type) {
    case "金":
      return [
        { name: "攻击力", bonus: baseBonus * 2 },
        { name: "暴击率", bonus: baseBonus },
      ];
    case "木":
      return [
        { name: "气血", bonus: baseBonus * 2 },
        { name: "防御力", bonus: baseBonus },
      ];
    case "水":
      return [
        { name: "灵力", bonus: baseBonus * 2 },
        { name: "闪避率", bonus: baseBonus },
      ];
    case "火":
      return [
        { name: "攻击力", bonus: baseBonus * 2 },
        { name: "暴击伤害", bonus: baseBonus },
      ];
    case "土":
      return [
        { name: "防御力", bonus: baseBonus * 2 },
        { name: "气血", bonus: baseBonus },
      ];
    default:
      return [{ name: "综合属性", bonus: baseBonus }];
  }
};
</script>

<style scoped>
.spirit-root-info {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.spirit-root-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.spirit-root-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.spirit-root-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.spirit-root-grade {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: #4a90e2;
}

.spirit-root-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spirit-value {
  width: 100%;
}

.value-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.value-label {
  font-size: 14px;
  color: #666;
}

.value-number {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.spirit-value-progress {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #52c41a;
  transition: width 0.3s ease;
}

.spirit-root-attributes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attribute-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.attribute-name {
  color: #666;
}

.attribute-bonus {
  font-weight: bold;
  color: #52c41a;
}
</style>
