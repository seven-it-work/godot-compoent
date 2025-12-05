<template>
  <div class="component-docs">
    <h2>CultivatorActions 组件</h2>
    
    <div class="section">
      <h3>组件说明</h3>
      <p>CultivatorActions 是用于展示修仙者可执行操作的按钮面板，支持升级、突破、攻击训练等功能。</p>
    </div>
    
    <div class="section">
      <h3>使用示例</h3>
      <div class="example">
        <a-card title="基本用法">
          <template #extra>
            <a-button type="primary" @click="refreshCultivator">刷新数据</a-button>
          </template>
          <cultivator-actions 
            :cultivator="cultivator"
            @update="handleUpdate"
            @result="handleResult"
          />
        </a-card>
        
        <a-card title="自定义按钮文本和显示" style="margin-top: 20px;">
          <cultivator-actions 
            :cultivator="cultivator"
            :title="'修仙者操作面板'"
            :upgrade-button-text="'提升等级'"
            :breakthrough-button-text="'突破境界'"
            :attack-button-text="'战斗训练'"
            :recover-button-text="'恢复状态'"
            :show-upgrade="true"
            :show-breakthrough="true"
            :show-attack="true"
            :show-recover="true"
            @update="handleUpdate"
            @result="handleResult"
          >
            <template #custom-actions>
              <a-button type="default">自定义操作</a-button>
            </template>
          </cultivator-actions>
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
import { CultivatorActions } from '@/v1/cultivator/components';
import CodeBlock from '@/components/CodeBlock.vue';
import type { DamageResult } from '@/v1/damageResult';

// 创建测试修仙者实例
const cultivator = ref(new CultivatorClass({
  realmLevel: 1,
  cultivationLevel: 1,
  attack: 80,
  defense: 70,
  qiBlood: 50,
  spiritPower: 30,
  breakthroughChance: 65
}));

// 消息提示
const message = ref('');
const messageType = ref<'success' | 'error' | 'info'>('info');

// 刷新数据
const refreshCultivator = () => {
  cultivator.value = new CultivatorClass({
    realmLevel: Math.floor(Math.random() * 10) + 1,
    cultivationLevel: Math.floor(Math.random() * 5) + 1,
    attack: Math.floor(Math.random() * 100),
    defense: Math.floor(Math.random() * 100),
    qiBlood: Math.floor(Math.random() * 100),
    spiritPower: Math.floor(Math.random() * 100),
    breakthroughChance: Math.floor(Math.random() * 100)
  });
  message.value = '';
};

// 处理更新
const handleUpdate = (updatedCultivator: CultivatorClass) => {
  cultivator.value = updatedCultivator;
};

// 处理结果
const handleResult = (msg: string, type: 'success' | 'error' | 'info') => {
  message.value = msg;
  messageType.value = type;
  
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
  { name: 'title', type: 'string', defaultValue: '修仙者操作', description: '组件标题' },
  { name: 'showUpgrade', type: 'boolean', defaultValue: 'true', description: '是否显示升级按钮' },
  { name: 'showBreakthrough', type: 'boolean', defaultValue: 'true', description: '是否显示突破按钮' },
  { name: 'showAttack', type: 'boolean', defaultValue: 'true', description: '是否显示攻击训练按钮' },
  { name: 'showRecover', type: 'boolean', defaultValue: 'true', description: '是否显示恢复按钮' },
  { name: 'upgradeButtonText', type: 'string', defaultValue: '-', description: '升级按钮文本' },
  { name: 'breakthroughButtonText', type: 'string', defaultValue: '-', description: '突破按钮文本' },
  { name: 'attackButtonText', type: 'string', defaultValue: '攻击训练', description: '攻击训练按钮文本' },
  { name: 'recoverButtonText', type: 'string', defaultValue: '恢复', description: '恢复按钮文本' },
  { name: 'recoverQiBloodValue', type: 'number', defaultValue: '100', description: '恢复气血值' },
  { name: 'recoverSpiritPowerValue', type: 'number', defaultValue: '50', description: '恢复灵力值' },
  { name: 'attackTarget', type: 'CultivatorClass | null', defaultValue: 'null', description: '攻击目标' },
  { name: 'buttonClassPrefix', type: 'string', defaultValue: 'cultivator-action', description: '自定义按钮类前缀' }
];

// 事件说明数据
const eventColumns = [
  { title: '事件名', dataIndex: 'name', key: 'name', width: 120 },
  { title: '参数', dataIndex: 'params', key: 'params', width: 150 },
  { title: '说明', dataIndex: 'description', key: 'description' }
];

const eventData = [
  { name: 'update', params: '[cultivator: CultivatorClass]', description: '修仙者数据更新事件' },
  { name: 'attack', params: '[damage: DamageResult]', description: '攻击事件' },
  { name: 'result', params: '[message: string, type: "success" | "error" | "info"]', description: '操作结果事件' },
  { name: 'buttonClick', params: '[buttonType: "upgrade" | "breakthrough" | "attack" | "recover"]', description: '按钮点击事件' }
];

// 代码示例
const codeExample = `
<template>
  <div>
    <cultivator-actions 
      :cultivator="cultivator"
      :title="'修仙者操作面板'"
      :upgrade-button-text="'提升等级'"
      :breakthrough-button-text="'突破境界'"
      :attack-button-text="'战斗训练'"
      :recover-button-text="'恢复状态'"
      @update="handleUpdate"
      @result="handleResult"
      @attack="handleAttack"
    >
      <template #custom-actions>
        <a-button type="default">自定义操作</a-button>
      </template>
    </cultivator-actions>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CultivatorClass } from '@/v1/cultivator/impl';
import { CultivatorActions } from '@/v1/cultivator/components';
import type { DamageResult } from '@/v1/damageResult';

const cultivator = ref(new CultivatorClass({
  realmLevel: 1,
  cultivationLevel: 1,
  attack: 80,
  defense: 70,
  qiBlood: 50,
  spiritPower: 30,
  breakthroughChance: 65
}));

const handleUpdate = (updatedCultivator: CultivatorClass) => {
  cultivator.value = updatedCultivator;
};

const handleResult = (msg: string, type: 'success' | 'error' | 'info') => {
  console.log('操作结果:', msg, type);
};

const handleAttack = (damage: DamageResult) => {
  console.log('攻击结果:', damage);
};
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