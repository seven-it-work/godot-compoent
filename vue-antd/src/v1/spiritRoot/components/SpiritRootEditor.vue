<template>
  <div class="spirit-root-editor">
    <div class="editor-header">
      <h3 class="editor-title">{{ title }}</h3>
      <a-button 
        type="text" 
        size="small" 
        @click="handleCancel"
        v-if="showCancel"
        :disabled="disabled"
      >
        取消
      </a-button>
    </div>
    <a-form 
      :model="formData" 
      :rules="rules" 
      ref="formRef"
      layout="vertical"
    >
      <a-form-item name="name" label="灵根名称">
        <a-select 
          v-model:value="formData.name" 
          :disabled="disabled"
          class="w-full"
        >
          <a-select-option 
            v-for="type in SPIRIT_ROOT_TYPES" 
            :key="type" 
            :value="type"
          >
            {{ type }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="spiritValue" label="灵根值">
        <a-slider 
          v-model:value="formData.spiritValue" 
          :min="0" 
          :max="100" 
          :disabled="disabled"
          show-input
        />
      </a-form-item>
      <a-form-item name="attributeValue" label="属性值">
        <a-slider 
          v-model:value="formData.attributeValue" 
          :min="0" 
          :max="100" 
          :disabled="disabled"
          show-input
        />
      </a-form-item>
      <a-form-item>
        <div class="editor-actions">
          <a-button 
            type="primary" 
            @click="handleSubmit"
            :loading="submitting"
            :disabled="disabled"
          >
            {{ submitText }}
          </a-button>
          <a-button 
            @click="handleReset"
            :disabled="disabled || submitting"
          >
            重置
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, defineEmits, nextTick } from 'vue';
import type { SpiritRoot } from '../define';
import { SPIRIT_ROOT_TYPES } from '../define';
import type { FormInstance } from 'ant-design-vue';

// 定义组件属性
const props = withDefaults(defineProps<{
  // 组件标题
  title?: string;
  // 要编辑的灵根对象
  spiritRoot?: SpiritRoot;
  // 是否禁用编辑
  disabled?: boolean;
  // 是否显示取消按钮
  showCancel?: boolean;
  // 提交按钮文本
  submitText?: string;
}>(), {
  title: '编辑灵根属性',
  showCancel: true,
  submitText: '保存'
});

// 定义组件事件
const emit = defineEmits<{
  // 当灵根属性更新时触发
  'update': [spiritRoot: Partial<SpiritRoot>];
  // 当用户取消编辑时触发
  'cancel': [];
}>();

// 表单引用
const formRef = ref<FormInstance>();

// 提交状态
const submitting = ref(false);

// 表单数据
const formData = reactive({
  name: '',
  spiritValue: 0,
  attributeValue: 0
});

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请选择灵根名称', trigger: 'change' }
  ],
  spiritValue: [
    { required: true, message: '请输入灵根值', trigger: 'change' },
    { type: 'number', min: 0, max: 100, message: '灵根值必须在0-100之间', trigger: 'change' }
  ],
  attributeValue: [
    { required: true, message: '请输入属性值', trigger: 'change' },
    { type: 'number', min: 0, max: 100, message: '属性值必须在0-100之间', trigger: 'change' }
  ]
};

// 监听灵根对象的变化，更新表单数据
watch(() => props.spiritRoot, (newValue) => {
  if (newValue) {
    nextTick(() => {
      formData.name = newValue.name;
      formData.spiritValue = newValue.spiritValue.getCurrentValue();
      formData.attributeValue = newValue.attribute.getCurrentValue();
      // 重置表单验证
      if (formRef.value) {
        formRef.value.resetFields();
      }
    });
  }
}, { immediate: true, deep: true });

// 处理表单提交
const handleSubmit = () => {
  if (props.disabled || submitting.value) return;
  
  formRef.value?.validate().then(() => {
    submitting.value = true;
    // 模拟异步提交
    setTimeout(() => {
      submitting.value = false;
      // 创建更新后的灵根对象
      const updatedSpiritRoot = {
        name: formData.name,
        spiritValue: {
          ...props.spiritRoot?.spiritValue,
          currentValue: formData.spiritValue
        },
        attribute: {
          ...props.spiritRoot?.attribute,
          currentValue: formData.attributeValue
        }
      };
      // 触发更新事件
      // @ts-ignore
      emit('update', updatedSpiritRoot);
    }, 500);
  }).catch(errorInfo => {
    console.log('表单验证失败:', errorInfo);
  });
};

// 处理表单重置
const handleReset = () => {
  if (props.spiritRoot) {
    formData.name = props.spiritRoot.name;
    formData.spiritValue = props.spiritRoot.spiritValue.getCurrentValue();
    formData.attributeValue = props.spiritRoot.attribute.getCurrentValue();
    // 重置表单验证
    if (formRef.value) {
      formRef.value.resetFields();
    }
  }
};

// 处理取消编辑
const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.spirit-root-editor {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.editor-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.editor-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .spirit-root-editor {
    padding: 12px;
  }
  
  .editor-actions {
    flex-direction: column;
  }
  
  .editor-actions button {
    width: 100%;
  }
}
</style>