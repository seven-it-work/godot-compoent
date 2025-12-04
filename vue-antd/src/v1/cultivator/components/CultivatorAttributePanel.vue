<template>
  <div class="cultivator-attribute-panel">
    <h3>修仙者属性</h3>
    <div class="attribute-grid">
      <div class="attribute-item">
        <div class="attribute-header">
          <span class="attribute-name">攻击力</span>
          <span class="attribute-value">{{ cultivator.attack.getCurrentValue() }}</span>
        </div>
        <div class="attribute-progress">
          <div 
            class="progress-bar attack" 
            :style="{ width: getProgressWidth(cultivator.attack) + '%' }"
          ></div>
        </div>
      </div>

      <div class="attribute-item">
        <div class="attribute-header">
          <span class="attribute-name">防御力</span>
          <span class="attribute-value">{{ cultivator.defense.getCurrentValue() }}</span>
        </div>
        <div class="attribute-progress">
          <div 
            class="progress-bar defense" 
            :style="{ width: getProgressWidth(cultivator.defense) + '%' }"
          ></div>
        </div>
      </div>

      <div class="attribute-item">
        <div class="attribute-header">
          <span class="attribute-name">气血</span>
          <span class="attribute-value">{{ cultivator.qiBlood.getCurrentValue() }}</span>
        </div>
        <div class="attribute-progress">
          <div 
            class="progress-bar qi-blood" 
            :style="{ width: getProgressWidth(cultivator.qiBlood) + '%' }"
          ></div>
        </div>
      </div>

      <div class="attribute-item">
        <div class="attribute-header">
          <span class="attribute-name">灵力</span>
          <span class="attribute-value">{{ cultivator.spiritPower.getCurrentValue() }}</span>
        </div>
        <div class="attribute-progress">
          <div 
            class="progress-bar spirit-power" 
            :style="{ width: getProgressWidth(cultivator.spiritPower) + '%' }"
          ></div>
        </div>
      </div>

      <div class="attribute-item">
        <div class="attribute-header">
          <span class="attribute-name">暴击率</span>
          <span class="attribute-value">{{ cultivator.criticalRate.getCurrentValue() }}%</span>
        </div>
        <div class="attribute-progress">
          <div 
            class="progress-bar critical-rate" 
            :style="{ width: getProgressWidth(cultivator.criticalRate) + '%' }"
          ></div>
        </div>
      </div>

      <div class="attribute-item">
        <div class="attribute-header">
          <span class="attribute-name">暴击伤害</span>
          <span class="attribute-value">{{ cultivator.criticalDamage.getCurrentValue() }}%</span>
        </div>
        <div class="attribute-progress">
          <div 
            class="progress-bar critical-damage" 
            :style="{ width: getProgressWidth(cultivator.criticalDamage) + '%' }"
          ></div>
        </div>
      </div>

      <div class="attribute-item">
        <div class="attribute-header">
          <span class="attribute-name">闪避率</span>
          <span class="attribute-value">{{ cultivator.dodgeRate.getCurrentValue() }}%</span>
        </div>
        <div class="attribute-progress">
          <div 
            class="progress-bar dodge-rate" 
            :style="{ width: getProgressWidth(cultivator.dodgeRate) + '%' }"
          ></div>
        </div>
      </div>

      <div class="attribute-item">
        <div class="attribute-header">
          <span class="attribute-name">突破概率</span>
          <span class="attribute-value">{{ cultivator.breakthroughChance.getCurrentValue() }}%</span>
        </div>
        <div class="attribute-progress">
          <div 
            class="progress-bar breakthrough-chance" 
            :style="{ width: getProgressWidth(cultivator.breakthroughChance) + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CultivatorClass } from '../impl';

defineProps<{
  cultivator: CultivatorClass;
}>();

const getProgressWidth = (attribute: any): number => {
  // 计算属性值在0-100范围内的百分比
  const value = attribute.getCurrentValue();
  return Math.min(Math.max(value, 0), 100);
};
</script>

<style scoped>
.cultivator-attribute-panel {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
}

.cultivator-attribute-panel h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

.attribute-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.attribute-item {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
}

.attribute-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.attribute-name {
  font-weight: bold;
  color: #555;
}

.attribute-value {
  font-weight: bold;
  color: #4a90e2;
}

.attribute-progress {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-bar.attack {
  background-color: #e74c3c;
}

.progress-bar.defense {
  background-color: #2ecc71;
}

.progress-bar.qi-blood {
  background-color: #e67e22;
}

.progress-bar.spirit-power {
  background-color: #9b59b6;
}

.progress-bar.critical-rate {
  background-color: #3498db;
}

.progress-bar.critical-damage {
  background-color: #e91e63;
}

.progress-bar.dodge-rate {
  background-color: #1abc9c;
}

.progress-bar.breakthrough-chance {
  background-color: #f39c12;
}
</style>