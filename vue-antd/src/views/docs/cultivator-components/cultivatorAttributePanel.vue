<template>
  <div class="component-docs">
    <h2>CultivatorAttributePanel 组件</h2>
    
    <div class="section">
      <h3>组件说明</h3>
      <p>CultivatorAttributePanel 是用于展示修仙者各项属性的面板组件，以进度条形式直观展示属性值。</p>
    </div>
    
    <div class="section">
      <h3>使用示例</h3>
      <div class="example">
        <a-card title="基本用法">
          <template #extra>
            <a-button type="primary" @click="refreshCultivator">刷新数据</a-button>
          </template>
          <cultivator-attribute-panel :cultivator="cultivator" />
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
import { CultivatorAttributePanel } from '@/v1/cultivator/components';
import CodeBlock from '@/components/CodeBlock.vue';

// 创建测试修仙者实例
const cultivator = ref(new CultivatorClass({
  attack: 80,
  defense: 70,
  qiBlood: 90,
  spiritPower: 85,
  criticalRate: 25,
  criticalDamage: 150,
  dodgeRate: 15,
  breakthroughChance: 65
}));

// 刷新数据
const refreshCultivator = () => {
  cultivator.value = new CultivatorClass({
    attack: Math.floor(Math.random() * 100),
    defense: Math.floor(Math.random() * 100),
    qiBlood: Math.floor(Math.random() * 100),
    spiritPower: Math.floor(Math.random() * 100),
    criticalRate: Math.floor(Math.random() * 50),
    criticalDamage: 100 + Math.floor(Math.random() * 100),
    dodgeRate: Math.floor(Math.random() * 30),
    breakthroughChance: Math.floor(Math.random() * 100)
  });
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
    <cultivator-attribute-panel :cultivator="cultivator" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CultivatorClass } from '@/v1/cultivator/impl';
import { CultivatorAttributePanel } from '@/v1/cultivator/components';

const cultivator = ref(new CultivatorClass({
  attack: 80,
  defense: 70,
  qiBlood: 90,
  spiritPower: 85,
  criticalRate: 25,
  criticalDamage: 150,
  dodgeRate: 15,
  breakthroughChance: 65
}));
&lt;/script&gt;
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