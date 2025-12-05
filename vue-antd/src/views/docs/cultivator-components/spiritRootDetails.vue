<template>
  <div class="component-docs">
    <h2>SpiritRootDetails 组件</h2>
    
    <div class="section">
      <h3>组件说明</h3>
      <p>SpiritRootDetails 是用于展示修仙者灵根详情的组件，包括灵根等级、灵根值、属性加成等信息，并支持灵根提升功能。</p>
    </div>
    
    <div class="section">
      <h3>使用示例</h3>
      <div class="example">
        <a-card title="基本用法">
          <template #extra>
            <a-button type="primary" @click="refreshCultivator">刷新数据</a-button>
            <a-button type="default" @click="upgradeSpiritRoot" style="margin-left: 8px;">提升灵根</a-button>
          </template>
          <spirit-root-details 
            :cultivator="cultivator"
            @update="handleUpdate"
            @upgrade="handleUpgrade"
          />
        </a-card>
        
        <a-card title="自定义配置" style="margin-top: 20px;">
          <spirit-root-details 
            :cultivator="cultivator"
            :title="'灵根详情面板'"
            :show-level="true"
            :show-value="true"
            :show-attribute-boost="true"
            :show-upgrade-button="true"
            :upgrade-button-text="'提升灵根等级'"
            :show-progress="true"
            :progress-height="8"
            :progress-color="'#52c41a'"
            @update="handleUpdate"
          />
        </a-card>
        
        <div v-if="message" class="result-message">
          <a-alert :message="message" :type="messageType" style="margin-top: 16px;" show-icon />
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
import { SpiritRootDetails } from '@/v1/cultivator/components';
import CodeBlock from '@/components/CodeBlock.vue';

// 创建测试修仙者实例
const cultivator = ref(CultivatorClass.随机生成人物());

// 消息提示
const message = ref('');
const messageType = ref<'success' | 'error' | 'info'>('info');

// 刷新数据
const refreshCultivator = () => {
  cultivator.value = CultivatorClass.随机生成人物();
  message.value = '';
};

// 提升灵根
const upgradeSpiritRoot = () => {
  if (cultivator.value) {
    // 模拟灵根提升
    cultivator.value.spiritRootLevel += 1;
    cultivator.value.spiritRootValue = 0; // 重置灵根值
    cultivator.value.spiritRootAttributeBoost = {
      attack: cultivator.value.spiritRootAttributeBoost.attack + 5,
      defense: cultivator.value.spiritRootAttributeBoost.defense + 4,
      spiritPower: cultivator.value.spiritRootAttributeBoost.spiritPower + 6
    };
    
    message.value = `灵根提升成功！当前等级：${cultivator.value.spiritRootLevel}`;
    messageType.value = 'success';
    
    // 3秒后清除消息
    setTimeout(() => {
      message.value = '';
    }, 3000);
  }
};

// 处理更新
const handleUpdate = (updatedCultivator: CultivatorClass) => {
  cultivator.value = updatedCultivator;
};

// 处理灵根提升
const handleUpgrade = (result: { success: boolean; message: string }) => {
  message.value = result.message;
  messageType.value = result.success ? 'success' : 'error';
  
  // 3秒后清除消息
  setTimeout(() => {
    message.value = '';
  }, 3000);
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
  { name: 'title', type: 'string', defaultValue: '灵根详情', description: '组件标题' },
  { name: 'showLevel', type: 'boolean', defaultValue: 'true', description: '是否显示灵根等级' },
  { name: 'showValue', type: 'boolean', defaultValue: 'true', description: '是否显示灵根值' },
  { name: 'showAttributeBoost', type: 'boolean', defaultValue: 'true', description: '是否显示属性加成' },
  { name: 'showUpgradeButton', type: 'boolean', defaultValue: 'true', description: '是否显示提升按钮' },
  { name: 'upgradeButtonText', type: 'string', defaultValue: '提升灵根', description: '提升按钮文本' },
  { name: 'showProgress', type: 'boolean', defaultValue: 'true', description: '是否显示进度条' },
  { name: 'progressHeight', type: 'number', defaultValue: '6', description: '进度条高度' },
  { name: 'progressColor', type: 'string', defaultValue: '#52c41a', description: '进度条颜色' },
  { name: 'nextLevelThreshold', type: 'number', defaultValue: '1000', description: '下一级所需灵根值' },
  { name: 'showAttributeLabels', type: 'boolean', defaultValue: 'true', description: '是否显示属性标签' },
  { name: 'attributeLabelMap', type: 'Record<string, string>', defaultValue: '{}', description: '属性标签映射' }
];

// 事件说明数据
const eventColumns = [
  { title: '事件名', dataIndex: 'name', key: 'name', width: 120 },
  { title: '参数', dataIndex: 'params', key: 'params', width: 150 },
  { title: '说明', dataIndex: 'description', key: 'description' }
];

const eventData = [
  { name: 'update', params: '[cultivator: CultivatorClass]', description: '修仙者数据更新事件' },
  { name: 'upgrade', params: '[result: { success: boolean; message: string }]', description: '灵根提升事件' },
  { name: 'root-change', params: '[spiritRootLevel: number, spiritRootValue: number]', description: '灵根值或等级变化事件' }
];

// 代码示例
const codeExample = `
<template>
  <div>
    <spirit-root-details 
      :cultivator="cultivator"
      :title="'我的灵根详情'"
      :show-level="true"
      :show-value="true"
      :show-attribute-boost="true"
      :show-upgrade-button="true"
      :upgrade-button-text="'提升灵根等级'"
      :show-progress="true"
      :progress-height="10"
      :progress-color="'#1890ff'"
      :attribute-label-map="{
        attack: '攻击力',
        defense: '防御力',
        spiritPower: '灵力'
      }"
      @update="handleUpdate"
      @upgrade="handleUpgrade"
    >
      <template #header-extra>
        <a-button type="link">灵根图鉴</a-button>
      </template>
      <template #footer>
        <div style="text-align: center; color: #8c8c8c;">
          灵根等级越高，修炼速度越快
        </div>
      </template>
    </spirit-root-details>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CultivatorClass } from '@/v1/cultivator/impl';
import { SpiritRootDetails } from '@/v1/cultivator/components';

const cultivator = ref(CultivatorClass.随机生成人物());

const handleUpdate = (updatedCultivator: CultivatorClass) => {
  cultivator.value = updatedCultivator;
};

const handleUpgrade = (result: { success: boolean; message: string }) => {
  console.log('灵根提升结果:', result);
};
<\/script>
`;

onMounted(() => {
  // 初始化数据
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

.result-message {
  margin-top: 16px;
}

pre {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>