<template>
  <div 
    class="exp-level-progress-container"
    :style="{ height: height }"
  >
    <div class="exp-level-progress-content">
      <div 
        class="exp-level-progress-bar"
        :style="{ 
          width: `${percent}%`,
          backgroundColor: strokeColor
        }"
      ></div>
      <div class="exp-level-progress-text">
        {{ label }}Lv{{ level }} {{ current }}/{{ max }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  label: string;
  level: number;
  current: number;
  max: number;
  strokeColor: string;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: '24px'
});

const percent = computed(() => {
  return Math.min((props.current / props.max) * 100, 100);
});
</script>

<style scoped>
.exp-level-progress-container {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5;
  transition: all 0.2s ease;
}

.exp-level-progress-container:hover {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.exp-level-progress-content {
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.exp-level-progress-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  transition: width 0.3s ease;
}

.exp-level-progress-text {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-weight: 500;
  color: #333;
  z-index: 1;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
  font-size: 12px;
}
</style>