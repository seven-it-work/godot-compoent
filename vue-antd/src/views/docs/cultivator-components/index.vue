<template>
  <div class="component-index">
    <a-card title="修仙者组件文档">
      <p class="intro">
        这里包含了修仙者系统的所有核心组件文档，涵盖了修仙者信息展示、属性面板、操作按钮、功法管理和灵根详情等功能模块。
      </p>
      
      <div class="component-grid">
        <a-card 
          v-for="component in components" 
          :key="component.key"
          :title="component.title"
          :hoverable="true"
          class="component-card"
          @click="$router.push(component.route)"
        >
          <template #extra>
            <a-tag :color="component.color">{{ component.category }}</a-tag>
          </template>
          <div class="component-content">
            <a-avatar :size="64" :icon="component.icon" style="margin-bottom: 16px;" />
            <p class="description">{{ component.description }}</p>
          </div>
          <div class="component-actions">
            <a-button type="primary" size="small">查看文档</a-button>
          </div>
        </a-card>
      </div>
      
      <div class="section" style="margin-top: 32px;">
        <h3>组件依赖关系</h3>
        <a-card>
          <p>修仙者组件系统是一个有机整体，各组件之间的依赖关系如下：</p>
          <div class="dependency-graph">
            <div class="graph-node">CultivatorInfoCard</div>
            <div class="graph-arrow"></div>
            <div class="graph-node">CultivatorAttributePanel</div>
            <div class="graph-arrow"></div>
            <div class="graph-node">CultivatorActions</div>
            <div class="graph-branch"></div>
            <div class="graph-node">CultivationMethodsPanel</div>
            <div class="graph-branch"></div>
            <div class="graph-node">SpiritRootDetails</div>
          </div>
        </a-card>
      </div>
      
      <div class="section" style="margin-top: 32px;">
        <h3>使用建议</h3>
        <a-list :bordered="true" :data-source="suggestions">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta :title="item.title">
                <template #description>{{ item.description }}</template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 组件列表
const components = [
  {
    key: 'cultivator-info-card',
    title: 'CultivatorInfoCard',
    route: '/docs/cultivator-components/cultivatorInfoCard',
    description: '展示修仙者基本信息和灵根的卡片组件',
    category: '信息展示',
    color: 'blue',
    icon: 'info-circle'
  },
  {
    key: 'cultivator-attribute-panel',
    title: 'CultivatorAttributePanel',
    route: '/docs/cultivator-components/cultivatorAttributePanel',
    description: '展示修仙者各项属性的面板组件',
    category: '信息展示',
    color: 'green',
    icon: 'bar-chart'
  },
  {
    key: 'cultivator-actions',
    title: 'CultivatorActions',
    route: '/docs/cultivator-components/cultivatorActions',
    description: '提供修仙者操作按钮的面板组件',
    category: '操作控制',
    color: 'orange',
    icon: 'control'
  },
  {
    key: 'cultivation-methods-panel',
    title: 'CultivationMethodsPanel',
    route: '/docs/cultivator-components/cultivationMethodsPanel',
    description: '管理修仙者功法的面板组件',
    category: '功法管理',
    color: 'red',
    icon: 'book'
  },
  {
    key: 'spirit-root-details',
    title: 'SpiritRootDetails',
    route: '/docs/cultivator-components/spiritRootDetails',
    description: '展示灵根详情和提升功能的组件',
    category: '灵根管理',
    color: 'purple',
    icon: 'diamond'
  }
];

// 使用建议
const suggestions = [
  {
    title: '组件组合使用',
    description: '建议将多个组件组合使用，例如：CultivatorInfoCard + CultivatorAttributePanel + CultivatorActions 可以构成一个完整的修仙者详情页面。'
  },
  {
    title: '统一数据源',
    description: '所有组件都应使用同一个 CultivatorClass 实例作为数据源，以确保数据一致性。'
  },
  {
    title: '事件处理',
    description: '组件间的通信主要通过事件机制实现，确保正确处理 update、result 等事件以更新数据源。'
  },
  {
    title: '自定义配置',
    description: '利用组件提供的 props 进行自定义配置，如按钮文本、显示内容、颜色主题等，以适应不同的界面需求。'
  }
];
</script>

<style scoped>
.component-index {
  max-width: 1200px;
  margin: 0 auto;
}

.intro {
  font-size: 16px;
  color: #595959;
  line-height: 1.6;
  margin-bottom: 24px;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.component-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.component-card:hover {
  transform: translateY(-4px);
}

.component-content {
  text-align: center;
  padding: 16px 0;
}

.description {
  color: #595959;
  line-height: 1.5;
  min-height: 60px;
}

.component-actions {
  text-align: center;
  margin-top: 16px;
}

.dependency-graph {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 24px 0;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
}

.graph-node {
  background-color: #1890ff;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  margin: 0 8px;
  white-space: nowrap;
}

.graph-arrow {
  width: 30px;
  height: 2px;
  background-color: #d9d9d9;
  position: relative;
}

.graph-arrow::after {
  content: '';
  position: absolute;
  right: 0;
  top: -3px;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 6px solid #d9d9d9;
}

.graph-branch {
  width: 2px;
  height: 40px;
  background-color: #d9d9d9;
  margin: 0 16px;
  position: relative;
}

.graph-branch::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: -15px;
  width: 30px;
  height: 2px;
  background-color: #d9d9d9;
}

@media (max-width: 768px) {
  .component-grid {
    grid-template-columns: 1fr;
  }
  
  .dependency-graph {
    flex-direction: column;
  }
  
  .graph-arrow {
    width: 2px;
    height: 30px;
  }
  
  .graph-arrow::after {
    top: 0;
    right: -3px;
    border-top: 6px solid transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 6px solid #d9d9d9;
  }
}
</style>