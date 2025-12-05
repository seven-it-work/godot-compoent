<template>
  <div class="spirit-root-selector">
    <div class="selector-label">{{ label }}</div>
    <div v-if="!multiple" class="radio-group">
      <a-radio-group
        v-model:value="selectedValue"
        @change="handleChange"
        :disabled="disabled"
      >
        <a-radio
          v-for="type in SPIRIT_ROOT_TYPES"
          :key="type"
          :value="type"
          class="spirit-root-radio"
        >
          <div class="spirit-root-option">
            <span class="spirit-root-icon">{{ getSpiritRootIcon(type) }}</span>
            <span class="spirit-root-type">{{ type }}</span>
          </div>
        </a-radio>
      </a-radio-group>
    </div>
    <div v-else class="checkbox-group">
      <a-checkbox-group
        v-model:value="selectedValue"
        @change="handleChange"
        :disabled="disabled"
      >
        <a-checkbox
          v-for="type in SPIRIT_ROOT_TYPES"
          :key="type"
          :value="type"
          class="spirit-root-checkbox"
        >
          <div class="spirit-root-option">
            <span class="spirit-root-icon">{{ getSpiritRootIcon(type) }}</span>
            <span class="spirit-root-type">{{ type }}</span>
          </div>
        </a-checkbox>
      </a-checkbox-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from "vue";
import { SPIRIT_ROOT_TYPES, type SpiritRootType } from "../define";

// 定义组件属性
const props = withDefaults(
  defineProps<{
    // 组件标签
    label?: string;
    // 是否支持多选
    multiple?: boolean;
    // 默认选中的灵根类型
    selected?: SpiritRootType | SpiritRootType[];
    // 是否禁用选择
    disabled?: boolean;
  }>(),
  {
    label: "选择灵根类型",
    multiple: false,
    selected: () => [],
    disabled: false,
  }
);

// 定义组件事件
const emit = defineEmits<{
  // 当选中的灵根类型变化时触发
  "update:selected": [value: SpiritRootType | SpiritRootType[]];
}>();

// 选中的值
const selectedValue = ref<SpiritRootType | SpiritRootType[]>(props.selected);

// 监听选中值的变化，同步到父组件
watch(selectedValue, (newValue) => {
  emit("update:selected", newValue);
});

// 处理选择变化
const handleChange = (e: any) => {
  selectedValue.value = e.target?.value || e;
};

// 获取灵根类型对应的图标
const getSpiritRootIcon = (type: SpiritRootType): string => {
  const icons: Record<SpiritRootType, string> = {
    金: "⚜️",
    木: "🌿",
    水: "💧",
    火: "🔥",
    土: "🌍",
  };
  return icons[type] || "✨";
};
</script>

<style scoped>
.spirit-root-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #e8e8e8;
}

.selector-label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.radio-group,
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.spirit-root-radio,
.spirit-root-checkbox {
  margin: 0;
}

.spirit-root-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.spirit-root-option:hover {
  background-color: #f5f5f5;
}

.spirit-root-icon {
  font-size: 18px;
}

.spirit-root-type {
  font-size: 14px;
  color: #333;
}

/* 禁用状态样式 */
:deep(.ant-radio-disabled),
:deep(.ant-checkbox-disabled) {
  opacity: 0.5;
}

:deep(.ant-radio-disabled .spirit-root-type),
:deep(.ant-checkbox-disabled .spirit-root-type) {
  color: #999;
}
</style>
