<template>
  <div class="component-docs">
    <h2>CultivationMethodsPanel 组件</h2>
    
    <div class="section">
      <h3>组件说明</h3>
      <p>CultivationMethodsPanel 是用于展示和管理修仙者功法的面板组件，支持功法卡片展示、效果查看和添加新功法功能。</p>
    </div>
    
    <div class="section">
      <h3>使用示例</h3>
      <div class="example">
        <a-card title="基本用法">
          <template #extra>
            <a-button type="primary" @click="refreshCultivator">刷新数据</a-button>
            <a-button type="default" @click="addMethod" style="margin-left: 8px;">添加功法</a-button>
          </template>
          <cultivation-methods-panel 
            :cultivator="cultivator"
            @update="handleUpdate"
            @select-method="handleSelectMethod"
            @remove-method="handleRemoveMethod"
            @add-method="handleAddMethod"
          />
        </a-card>
        
        <a-card title="自定义配置" style="margin-top: 20px;">
          <cultivation-methods-panel 
            :cultivator="cultivator"
            :title="'我的功法面板'"
            :card-width="250"
            :show-actions="true"
            :show-effect-details="true"
            :allow-add="true"
            :allow-remove="true"
            :methods-per-row="3"
            @update="handleUpdate"
          />
        </a-card>
        
        <div v-if="selectedMethod" class="method-detail">
          <a-card title="当前选中的功法" style="margin-top: 20px;">
            <a-descriptions :column="2" bordered>
              <a-descriptions-item label="名称">{{ selectedMethod.name }}</a-descriptions-item>
              <a-descriptions-item label="等级">{{ selectedMethod.level }}</a-descriptions-item>
              <a-descriptions-item label="品质">{{ selectedMethod.quality }}</a-descriptions-item>
              <a-descriptions-item label="属性加成">{{ selectedMethod.attributeBoost }}</a-descriptions-item>
              <a-descriptions-item label="效果描述" :span="2">{{ selectedMethod.effectDescription }}</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h3>属性说明</h3>
      <a-table :columns="columns" :data-source="propsData" bordered size="middle">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <code>{{ record.type }}</code>
          </template>
          <template v-if="column.key === 'defaultValue'">
            <code>{{ record.defaultValue }}</code>
          </template>
        </template>
      </a-table>
    </div>
    
    <div class="section">
      <h3>事件说明</h3>
      <a-table :columns="eventColumns" :data-source="eventData" bordered size="middle">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'params'">
            <code>{{ record.params }}</code>
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
import { CultivationMethodsPanel } from '@/v1/cultivator/components';
import type { CultivationMethod } from '@/v1/cultivator/models';
import CodeBlock from '@/components/CodeBlock.vue';

// 创建测试修仙者实例
const cultivator = ref(new CultivatorClass({
  name: '测试修仙者',
  realmLevel: 3,
  cultivationLevel: 5,
  attack: 120,
  defense: 100,
  qiBlood: 200,
  spiritPower: 150,
  breakthroughChance: 75
}));

// 初始化功法数据
const initializeMethods = () => {
  const methods: CultivationMethod[] = [
    {
      id: 'method-1',
      name: '基础拳法',
      level: 1,
      quality: '普通',
      attributeBoost: { attack: 10 },
      effectDescription: '增加基础攻击力',
      requiredLevel: 1,
      cultivationTime: 60
    },
    {
      id: 'method-2',
      name: '龟息大法',
      level: 2,
      quality: '优秀',
      attributeBoost: { defense: 15, qiBlood: 50 },
      effectDescription: '增加防御力和气血上限',
      requiredLevel: 3,
      cultivationTime: 120
    },
    {
      id: 'method-3',
      name: '雷灵功',
      level: 3,
      quality: '稀有',
      attributeBoost: { attack: 30, spiritPower: 40 },
      effectDescription: '大幅度增加攻击力和灵力',
      requiredLevel: 5,
      cultivationTime: 240
    }
  ];
  cultivator.value.cultivationMethods = methods;
};

// 选中的功法
const selectedMethod = ref<CultivationMethod | null>(null);

// 刷新数据
const refreshCultivator = () => {
  cultivator.value = new CultivatorClass({
    name: '测试修仙者',
    realmLevel: Math.floor(Math.random() * 5) + 1,
    cultivationLevel: Math.floor(Math.random() * 10) + 1,
    attack: Math.floor(Math.random() * 200) + 50,
    defense: Math.floor(Math.random() * 150) + 50,
    qiBlood: Math.floor(Math.random() * 300) + 100,
    spiritPower: Math.floor(Math.random() * 250) + 50,
    breakthroughChance: Math.floor(Math.random() * 50) + 50
  });
  initializeMethods();
  selectedMethod.value = null;
};

// 添加功法
const addMethod = () => {
  const newMethod: CultivationMethod = {
    id: `method-${Date.now()}`,
    name: `新功法-${Math.floor(Math.random() * 1000)}`,
    level: 1,
    quality: ['普通', '优秀', '稀有', '史诗', '传说'][Math.floor(Math.random() * 5)],
    attributeBoost: { attack: Math.floor(Math.random() * 20) + 5 },
    effectDescription: '这是一个新功法',
    requiredLevel: Math.floor(Math.random() * 5) + 1,
    cultivationTime: Math.floor(Math.random() * 300) + 60
  };
  
  cultivator.value.cultivationMethods = [...cultivator.value.cultivationMethods, newMethod];
};

// 处理更新
const handleUpdate = (updatedCultivator: CultivatorClass) => {
  cultivator.value = updatedCultivator;
};

// 处理选中功法
const handleSelectMethod = (method: CultivationMethod) => {
  selectedMethod.value = method;
};

// 处理移除功法
const handleRemoveMethod = (methodId: string) => {
  cultivator.value.cultivationMethods = cultivator.value.cultivationMethods.filter(m => m.id !== methodId);
  if (selectedMethod.value?.id === methodId) {
    selectedMethod.value = null;
  }
};

// 处理添加功法
const handleAddMethod = (method: CultivationMethod) => {
  cultivator.value.cultivationMethods = [...cultivator.value.cultivationMethods, method];
};

// 属性说明数据
const columns = [
  { title: '属性名', dataIndex: 'name', key: 'name', width: 150 },
  { title: '类型', dataIndex: 'type', key: 'type', width: 150 },
  { title: '默认值', dataIndex: 'defaultValue', key: 'defaultValue', width: 100 },
  { title: '说明', dataIndex: 'description', key: 'description' }
];

const propsData = [
  { name: 'cultivator', type: 'CultivatorClass', defaultValue: '-', description: '修仙者实例' },
  { name: 'title', type: 'string', defaultValue: '功法面板', description: '组件标题' },
  { name: 'cardWidth', type: 'number', defaultValue: '200', description: '功法卡片宽度' },
  { name: 'showActions', type: 'boolean', defaultValue: 'true', description: '是否显示操作按钮' },
  { name: 'showEffectDetails', type: 'boolean', defaultValue: 'true', description: '是否显示效果详情' },
  { name: 'allowAdd', type: 'boolean', defaultValue: 'true', description: '是否允许添加功法' },
  { name: 'allowRemove', type: 'boolean', defaultValue: 'true', description: '是否允许移除功法' },
  { name: 'methodsPerRow', type: 'number', defaultValue: '4', description: '每行显示的功法数量' },
  { name: 'showEmptyState', type: 'boolean', defaultValue: 'true', description: '是否显示空状态提示' },
  { name: 'emptyText', type: 'string', defaultValue: '暂无功法', description: '空状态提示文本' }
];

// 事件说明数据
const eventColumns = [
  { title: '事件名', dataIndex: 'name', key: 'name', width: 120 },
  { title: '参数', dataIndex: 'params', key: 'params', width: 150 },
  { title: '说明', dataIndex: 'description', key: 'description' }
];

const eventData = [
  { name: 'update', params: '[cultivator: CultivatorClass]', description: '修仙者数据更新事件' },
  { name: 'select-method', params: '[method: CultivationMethod]', description: '选中功法事件' },
  { name: 'remove-method', params: '[methodId: string]', description: '移除功法事件' },
  { name: 'add-method', params: '[method: CultivationMethod]', description: '添加功法事件' },
  { name: 'upgrade-method', params: '[methodId: string]', description: '升级功法事件' }
];

// 代码示例
const codeExample = `
<template>
  <div>
    <cultivation-methods-panel 
      :cultivator="cultivator"
      :title="'我的功法面板'"
      :card-width="250"
      :methods-per-row="3"
      :show-actions="true"
      :allow-add="true"
      :allow-remove="true"
      @update="handleUpdate"
      @select-method="handleSelectMethod"
      @remove-method="handleRemoveMethod"
      @add-method="handleAddMethod"
    >
      <template #empty-state>
        <div style="text-align: center; padding: 40px;">
          <a-empty description="暂无功法，点击添加按钮开始修炼" />
        </div>
      </template>
    </cultivation-methods-panel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CultivatorClass } from '@/v1/cultivator/impl';
import { CultivationMethodsPanel } from '@/v1/cultivator/components';
import type { CultivationMethod } from '@/v1/cultivator/models';

const cultivator = ref(new CultivatorClass({
  name: '测试修仙者',
  realmLevel: 3,
  cultivationLevel: 5
}));

// 初始化功法数据
const initializeMethods = () => {
  const methods: CultivationMethod[] = [
    {
      id: 'method-1',
      name: '基础拳法',
      level: 1,
      quality: '普通',
      attributeBoost: { attack: 10 },
      effectDescription: '增加基础攻击力',
      requiredLevel: 1,
      cultivationTime: 60
    }
  ];
  cultivator.value.cultivationMethods = methods;
};

initializeMethods();

const handleUpdate = (updatedCultivator: CultivatorClass) => {
  cultivator.value = updatedCultivator;
};

const handleSelectMethod = (method: CultivationMethod) => {
  console.log('选中的功法:', method);
};

const handleRemoveMethod = (methodId: string) => {
  console.log('移除的功法ID:', methodId);
};

const handleAddMethod = (method: CultivationMethod) => {
  console.log('添加的功法:', method);
};
&lt;/script&gt;
`;

onMounted(() => {
  initializeMethods();
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

.method-detail {
  margin-top: 16px;
}

pre {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>