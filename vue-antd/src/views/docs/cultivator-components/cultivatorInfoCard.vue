<template>
  <div class="component-docs">
    <h2>CultivatorInfoCard 组件</h2>
    
    <div class="section">
      <h3>组件说明</h3>
      <p>CultivatorInfoCard 是用于展示修仙者基本信息的卡片组件，包括姓名、境界、性别、ID和灵根信息。</p>
    </div>
    
    <div class="section">
      <h3>使用示例</h3>
      <div class="example">
        <a-card title="基本用法">
          <template #extra>
            <a-button type="primary" @click="refreshCultivator">刷新数据</a-button>
          </template>
          <cultivator-info-card :cultivator="cultivator" />
        </a-card>
      </div>
    </div>
    
    <div class="section">
      <h3>属性说明</h3>
      <a-table :columns="columns" :data-source="propsData" bordered size="middle">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <code>{{ record.type }}</code>
          </template>
        </template>
      </a-table>
    </div>
    
    <div class="section">
      <h3>代码示例</h3>
      <a-card>
        <CodeBlock :code="codeExample" language="vue" />
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CultivatorClass } from '@/v1/cultivator/impl';
import { CultivatorInfoCard } from '@/v1/cultivator/components';
import CodeBlock from '@/components/CodeBlock.vue';

// 创建测试修仙者实例
const cultivator = ref(CultivatorClass.随机生成人物());

// 刷新数据
const refreshCultivator = () => {
  cultivator.value = CultivatorClass.随机生成人物();
};

// 属性说明数据
const columns = [
  { title: '属性名', dataIndex: 'name', key: 'name', width: 150 },
  { title: '类型', dataIndex: 'type', key: 'type', width: 150 },
  { title: '说明', dataIndex: 'description', key: 'description' }
];

const propsData = [
  { name: 'cultivator', type: 'CultivatorClass', description: '修仙者实例' }
];

// 代码示例
const codeExample = `
<template>
  <div>
    <cultivator-info-card :cultivator="cultivator" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CultivatorClass } from '@/v1/cultivator/impl';
import { CultivatorInfoCard } from '@/v1/cultivator/components';

const cultivator = ref(CultivatorClass.随机生成人物());
`;

onMounted(() => {
  refreshCultivator();
});
</script>

<style scoped>
.component-docs {
  max-width: 1200px;
  margin: 0 auto;
}

.section {
  margin-bottom: 32px;
}

.example {
  margin: 16px 0;
}

pre {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>