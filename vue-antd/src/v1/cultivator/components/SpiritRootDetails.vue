<template>
  <div class="spirit-root-details">
    <h3>灵根详情</h3>
    <div class="spirit-root-grid">
      <div 
        v-for="spiritRoot in cultivator.spiritRoots" 
        :key="spiritRoot.name"
        class="spirit-root-card"
      >
        <div class="spirit-root-header">
          <span class="spirit-root-name">{{ spiritRoot.name }}</span>
          <span class="spirit-root-grade">{{ getSpiritRootGrade(spiritRoot) }}</span>
        </div>
        <div class="spirit-root-body">
          <div class="spirit-value">
            <div class="value-header">
              <span class="value-label">灵根值</span>
              <span class="value-number">{{ spiritRoot.spiritValue.getCurrentValue() }}</span>
            </div>
            <div class="spirit-value-progress">
              <div 
                class="progress-bar"
                :style="{ width: getSpiritValueProgress(spiritRoot) + '%' }"
              ></div>
            </div>
          </div>
          <div class="spirit-root-attributes">
            <div class="attribute-item" v-for="attribute in getSpiritRootAttributes(spiritRoot)" :key="attribute.name">
              <span class="attribute-name">{{ attribute.name }}</span>
              <span class="attribute-bonus">+{{ attribute.bonus }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CultivatorClass } from '../impl';
import type { SpiritRoot } from '@/v1/spiritRoot';// 定义组件属性
const { cultivator } = defineProps<{
  cultivator: CultivatorClass;
}>();

/**
 * 获取灵根等级
 */
const getSpiritRootGrade = (spiritRoot: SpiritRoot): string => {
  const value = spiritRoot.spiritValue.getCurrentValue();
  if (value >= 90) return '天级';
  if (value >= 70) return '地级';
  if (value >= 50) return '玄级';
  if (value >= 30) return '黄级';
  return '凡级';
};

/**
 * 获取灵根值进度百分比
 */
const getSpiritValueProgress = (spiritRoot: SpiritRoot): number => {
  const maxValue = 100; // 假设灵根最大值为100
  const currentValue = spiritRoot.spiritValue.getCurrentValue();
  return Math.min((currentValue / maxValue) * 100, 100);
};

/**
 * 获取灵根对属性的加成
 */
const getSpiritRootAttributes = (spiritRoot: SpiritRoot) => {
  const value = spiritRoot.spiritValue.getCurrentValue();
  const baseBonus = Math.floor(value / 10);
  
  // 根据灵根类型提供不同的属性加成
  switch (spiritRoot.name) {
    case '金':
      return [{ name: '攻击力', bonus: baseBonus * 2 }, { name: '暴击率', bonus: baseBonus }];
    case '木':
      return [{ name: '气血', bonus: baseBonus * 2 }, { name: '防御力', bonus: baseBonus }];
    case '水':
      return [{ name: '灵力', bonus: baseBonus * 2 }, { name: '闪避率', bonus: baseBonus }];
    case '火':
      return [{ name: '攻击力', bonus: baseBonus * 2 }, { name: '暴击伤害', bonus: baseBonus }];
    case '土':
      return [{ name: '防御力', bonus: baseBonus * 2 }, { name: '气血', bonus: baseBonus }];
    default:
      return [{ name: '综合属性', bonus: baseBonus }];
  }
};
</script>

<style scoped>
.spirit-root-details {
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.spirit-root-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.spirit-root-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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