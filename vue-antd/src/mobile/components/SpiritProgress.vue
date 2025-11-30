<template>
  <div
    class="spirit-progress-container"
    :style="{ height: height }"
    @click="handleClick"
    :class="{ absorbable: !isCooldown }"
  >
    <div class="spirit-progress-content">
      <div
        class="spirit-progress-bar"
        :style="{
          width: `${percent}%`,
          backgroundColor: strokeColor,
        }"
      ></div>
      <div v-if="!hideLabel" class="spirit-progress-text">
        {{ label ? label + " " : "" }}{{ current }}/{{ max }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label: string;
  current: number;
  max: number;
  strokeColor: string;
  height?: string;
  isCooldown?: boolean;
  hideLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: "40px",
  isCooldown: false,
  hideLabel: false,
});

const emit = defineEmits<{
  click: [];
}>();

const percent = computed(() => {
  return Math.min((props.current / props.max) * 100, 100);
});

const handleClick = () => {
  if (!props.isCooldown) {
    emit("click");
  }
};
</script>

<style scoped>
.spirit-progress-container {
  cursor: pointer;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5;
  transition: all 0.2s ease;
}

.spirit-progress-container:hover {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.spirit-progress-container.absorbable:hover {
  transform: scale(1.02);
}

.spirit-progress-content {
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.spirit-progress-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  transition: width 0.3s ease;
}

.spirit-progress-text {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 10px;
  font-weight: 500;
  color: #333;
  z-index: 1;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
  line-height: 1.2;
  padding: 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
