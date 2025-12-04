<template>
  <div class="docs-page spirit-root-docs">
    <div class="docs-header">
      <h2 class="docs-title">灵根组件文档</h2>
      <p class="docs-subtitle">提供完整的灵根系统UI组件，包括灵根信息展示、灵根选择器和灵根编辑器</p>
    </div>

    <div class="docs-content">
      <!-- 灵根组件集合介绍 -->
      <div class="component-container">
        <div class="component-header">
          <h3 class="component-name">灵根组件集合</h3>
          <span class="component-tag">灵根系统</span>
        </div>
        
        <div class="component-description">
          <p>提供完整的灵根系统UI组件，包括灵根信息展示、灵根选择器和灵根编辑器，支持各种灵根相关的交互需求。</p>
        </div>
      </div>

      <!-- SpiritRootInfo 组件演示 -->
      <div class="demo-section">
        <h4 class="demo-subtitle">1. SpiritRootInfo - 灵根信息展示</h4>
        <div class="component-demo-wrapper">
          <div class="component-demo">
            <div class="spirit-root-grid">
              <SpiritRootInfo 
                v-for="spiritRoot in cultivator.spiritRoots" 
                :key="spiritRoot.name"
                :spirit-root="spiritRoot"
                class="spirit-root-demo"
              />
            </div>
          </div>
        </div>
        <div class="component-docs">
          <h5>使用方法</h5>
          <pre class="code-block"><code>&lt;SpiritRootInfo 
  :spirit-root="spiritRoot"
/&gt;</code></pre>
          <h5>属性</h5>
          <table class="api-table small">
            <thead>
              <tr>
                <th>属性名</th>
                <th>类型</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>spiritRoot</td>
                <td>SpiritRoot</td>
                <td>灵根对象</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- SpiritRootSelector 组件演示 -->
      <div class="demo-section">
        <h4 class="demo-subtitle">2. SpiritRootSelector - 灵根选择器</h4>
        <div class="component-demo-wrapper">
          <div class="component-demo">
            <div class="selector-demo">
              <div class="selector-item">
                <h5>单选模式</h5>
                <SpiritRootSelector 
                  :selected="selectedSpiritRootType"
                  @update:selected="handleSpiritRootSelect"
                />
              </div>
              <div class="selector-item">
                <h5>多选模式</h5>
                <SpiritRootSelector 
                  :selected="selectedSpiritRootTypes"
                  :multiple="true"
                  @update:selected="handleSpiritRootSelect"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="component-docs">
          <h5>使用方法</h5>
          <pre class="code-block"><code>&lt;!-- 单选模式 --&gt;
&lt;SpiritRootSelector 
  :selected="selectedType"
  @update:selected="handleSelect"
/&gt;

&lt;!-- 多选模式 --&gt;
&lt;SpiritRootSelector 
  :selected="selectedTypes"
  :multiple="true"
  @update:selected="handleSelect"
/&gt;</code></pre>
          <h5>属性</h5>
          <table class="api-table small">
            <thead>
              <tr>
                <th>属性名</th>
                <th>类型</th>
                <th>默认值</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>label</td>
                <td>string</td>
                <td>选择灵根类型</td>
                <td>组件标签</td>
              </tr>
              <tr>
                <td>multiple</td>
                <td>boolean</td>
                <td>false</td>
                <td>是否支持多选</td>
              </tr>
              <tr>
                <td>selected</td>
                <td>string | string[]</td>
                <td>[]</td>
                <td>默认选中的灵根类型</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>boolean</td>
                <td>false</td>
                <td>是否禁用选择</td>
              </tr>
            </tbody>
          </table>
          <h5>事件</h5>
          <table class="api-table small">
            <thead>
              <tr>
                <th>事件名</th>
                <th>参数</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>update:selected</td>
                <td>string | string[]</td>
                <td>选择的灵根类型变化时触发</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- SpiritRootEditor 组件演示 -->
      <div class="demo-section">
        <h4 class="demo-subtitle">3. SpiritRootEditor - 灵根编辑器</h4>
        <div class="component-demo-wrapper">
          <div class="component-demo">
            <div v-if="!isEditing" class="editor-demo">
              <a-button 
                type="primary" 
                @click="currentEditingSpiritRoot = cultivator.spiritRoots[0]; isEditing = true"
              >
                编辑第一个灵根
              </a-button>
              <a-button 
                @click="currentEditingSpiritRoot = cultivator.spiritRoots[1]; isEditing = true"
                style="margin-left: 10px"
              >
                编辑第二个灵根
              </a-button>
            </div>
            <div v-else class="editor-container">
              <SpiritRootEditor 
                v-if="currentEditingSpiritRoot"
                :spirit-root="currentEditingSpiritRoot"
                @update="handleSpiritRootUpdate"
                @cancel="handleCancelEdit"
              />
            </div>
          </div>
        </div>
        <div class="component-docs">
          <h5>使用方法</h5>
          <pre class="code-block"><code>&lt;SpiritRootEditor 
  :spirit-root="spiritRoot"
  @update="handleUpdate"
  @cancel="handleCancel"
/&gt;</code></pre>
          <h5>属性</h5>
          <table class="api-table small">
            <thead>
              <tr>
                <th>属性名</th>
                <th>类型</th>
                <th>默认值</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>title</td>
                <td>string</td>
                <td>编辑灵根属性</td>
                <td>组件标题</td>
              </tr>
              <tr>
                <td>spiritRoot</td>
                <td>SpiritRoot</td>
                <td>-</td>
                <td>要编辑的灵根对象</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>boolean</td>
                <td>false</td>
                <td>是否禁用编辑</td>
              </tr>
              <tr>
                <td>showCancel</td>
                <td>boolean</td>
                <td>true</td>
                <td>是否显示取消按钮</td>
              </tr>
              <tr>
                <td>submitText</td>
                <td>string</td>
                <td>保存</td>
                <td>提交按钮文本</td>
              </tr>
            </tbody>
          </table>
          <h5>事件</h5>
          <table class="api-table small">
            <thead>
              <tr>
                <th>事件名</th>
                <th>参数</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>update</td>
                <td>Partial&lt;SpiritRoot&gt;</td>
                <td>灵根属性更新时触发</td>
              </tr>
              <tr>
                <td>cancel</td>
                <td>-</td>
                <td>用户取消编辑时触发</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CultivatorClass } from '@/v1/CultivatorModule';
import { SpiritRootInfo, SpiritRootSelector, SpiritRootEditor } from '@/v1/spiritRoot/components';

// 创建修仙者实例
const cultivator = ref<CultivatorClass | null>(null);

// 灵根选择器相关状态
const selectedSpiritRootType = ref<string>('gold');
const selectedSpiritRootTypes = ref<string[]>(['gold', 'wood']);

// 灵根编辑器相关状态
const isEditing = ref(false);
const currentEditingSpiritRoot = ref<any>(null);

// 页面加载时初始化修仙者实例
onMounted(() => {
  cultivator.value = CultivatorClass.randomCreate();
});

// 处理灵根选择
const handleSpiritRootSelect = (value: string | string[]) => {
  if (Array.isArray(value)) {
    selectedSpiritRootTypes.value = value;
  } else {
    selectedSpiritRootType.value = value;
  }
};

// 处理灵根更新
const handleSpiritRootUpdate = (updatedSpiritRoot: Partial<any>) => {
  if (currentEditingSpiritRoot.value && cultivator.value) {
    // 更新灵根属性
    Object.assign(currentEditingSpiritRoot.value, updatedSpiritRoot);
    isEditing.value = false;
  }
};

// 处理取消编辑
const handleCancelEdit = () => {
  isEditing.value = false;
  currentEditingSpiritRoot.value = null;
};
</script>

<style scoped>
.spirit-root-docs {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.docs-header {
  margin-bottom: 32px;
}

.docs-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #1890ff;
}

.docs-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.component-container {
  margin-bottom: 32px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
}

.component-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.component-name {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  margin-right: 12px;
}

.component-tag {
  background-color: #1890ff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.component-description {
  color: #666;
  line-height: 1.6;
}

.demo-section {
  margin-bottom: 48px;
}

.demo-subtitle {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.component-demo-wrapper {
  margin-bottom: 24px;
}

.component-demo {
  padding: 20px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin-bottom: 16px;
}

.spirit-root-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.spirit-root-demo {
  min-width: 200px;
}

.selector-demo {
  display: flex;
  gap: 40px;
}

.selector-item {
  min-width: 250px;
}

.selector-item h5 {
  margin-bottom: 12px;
  color: #666;
}

.editor-demo {
  padding: 20px 0;
}

.editor-container {
  padding: 20px;
  border: 1px dashed #1890ff;
  border-radius: 8px;
}

.component-docs {
  background-color: white;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.component-docs h5 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}

.code-block {
  background-color: #f6f8fa;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  color: #333;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.api-table th,
.api-table td {
  padding: 12px;
  border: 1px solid #e8e8e8;
  text-align: left;
}

.api-table th {
  background-color: #fafafa;
  font-weight: bold;
  color: #333;
}

.api-table td {
  color: #666;
}

.api-table.small {
  font-size: 14px;
}

.api-table.small th,
.api-table.small td {
  padding: 8px 12px;
}
</style>