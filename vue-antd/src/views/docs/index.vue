<template>
  <div class="docs-layout">
    <!-- 文档头部 -->
    <header class="docs-header">
      <div class="header-content">
        <h1 class="home-title">修仙者组件库</h1>
        <p class="home-subtitle">提供完整的修仙者相关组件，支持修仙文字游戏的快速开发</p>
      </div>
    </header>
    
    <!-- 主体内容 -->
    <div class="docs-body">
      <!-- 左侧导航 -->
      <aside class="docs-sidebar">
        <div class="sidebar-section">
          <h2 class="sidebar-title">组件列表</h2>
          <nav class="sidebar-nav">
            <ul class="nav-list">
              <li v-for="menuItem in cultivatorMenu" :key="menuItem.key" class="nav-item">
                <a 
                  href="#" 
                  class="nav-link"
                  :class="{ 'active': activeKey === menuItem.key }"
                  @click.prevent="activeKey = menuItem.key"
                >
                  {{ menuItem.title }}
                </a>
              </li>
              <li v-for="menuItem in spiritRootMenu" :key="menuItem.key" class="nav-item">
                <a 
                  href="#" 
                  class="nav-link"
                  :class="{ 'active': activeKey === menuItem.key }"
                  @click.prevent="activeKey = menuItem.key"
                >
                  {{ menuItem.title }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
        
        <div class="sidebar-section">
          <h2 class="sidebar-title">使用指南</h2>
          <nav class="sidebar-nav">
            <ul class="nav-list">
              <li class="nav-item">
                <a href="#" class="nav-link" @click.prevent="showQuickStart = !showQuickStart">
                  快速开始
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" @click.prevent="showApi = !showApi">
                  API 参考
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- 右侧文档内容 -->
      <main class="docs-main">
        <!-- 快速开始 -->
        <section v-if="showQuickStart" class="docs-section">
          <h2 class="section-title">快速开始</h2>
          <div class="section-content">
            <h3>安装</h3>
            <a-code class="code-block" language="bash">npm install @/v1/cultivator</a-code>
            
            <h3>引入组件</h3>
            <a-code class="code-block" language="javascript">// 引入单个组件
import { CultivatorInfoCard } from '@/v1/cultivator';
import { SpiritRootInfo } from '@/v1/spiritRoot/components';

// 或引入所有组件
import * as CultivatorComponents from '@/v1/cultivator';
import * as SpiritRootComponents from '@/v1/spiritRoot/components';</a-code>
            
            <h3>基本使用</h3>
            <a-code class="code-block" language="vue">&lt;template&gt;
  &lt;div&gt;
    &lt;CultivatorInfoCard :cultivator="cultivator" /&gt;
    &lt;div class="spirit-root-grid"&gt;
      &lt;SpiritRootInfo 
        v-for="spiritRoot in cultivator.spiritRoots" 
        :key="spiritRoot.name"
        :spirit-root="spiritRoot"
      /&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { CultivatorInfoCard, CultivatorClass } from '@/v1/cultivator';
import { SpiritRootInfo } from '@/v1/spiritRoot/components';
import { ref } from 'vue';

// 创建修仙者实例
const cultivator = ref(CultivatorClass.随机生成修仙者());
&lt;/script&gt;</a-code>
          </div>
        </section>
        
        <!-- API参考 -->
        <section v-if="showApi" class="docs-section">
          <h2 class="section-title">API 参考</h2>
          <div class="section-content">
            <h3>通用属性</h3>
            <table class="api-table">
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
                  <td>cultivator</td>
                  <td>CultivatorClass</td>
                  <td>-</td>
                  <td>修仙者实例，所有组件的核心属性</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        <!-- 组件展示区域 -->
        <section class="docs-section">
          <h2 class="section-title">{{ currentTitle }}</h2>
          <!-- 修仙者信息卡片 -->
          <div v-if="activeKey === 'cultivator-info-card'" class="component-container">
            <div class="component-header">
              <h3 class="component-name">CultivatorInfoCard</h3>
              <span class="component-tag">基础组件</span>
            </div>
            
            <div class="component-description">
              <p>修仙者信息卡片组件，用于展示修仙者的核心信息，包括名称、境界等级、性别、ID和灵根信息。</p>
            </div>

            <div class="component-demo-wrapper">
              <h4 class="demo-title">演示</h4>
              <div class="component-demo">
                <CultivatorInfoCard :cultivator="cultivator" />
              </div>
            </div>

            <div class="component-docs">
              <h4 class="docs-subtitle">使用方法</h4>
              <a-code class="code-block" language="vue">&lt;CultivatorInfoCard :cultivator="cultivator" /&gt;</a-code>
              
              <h4 class="docs-subtitle">属性</h4>
              <table class="api-table">
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
                    <td>cultivator</td>
                    <td>CultivatorClass</td>
                    <td>-</td>
                    <td>修仙者实例</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 修仙者属性面板 -->
          <div v-if="activeKey === 'cultivator-attribute-panel'" class="component-container">
            <div class="component-header">
              <h3 class="component-name">CultivatorAttributePanel</h3>
              <span class="component-tag">数据展示</span>
            </div>
            
            <div class="component-description">
              <p>修仙者属性面板组件，用于展示修仙者的各项属性值及进度条，包括攻击力、防御力、气血、暴击率等核心战斗属性。</p>
            </div>

            <div class="component-demo-wrapper">
              <h4 class="demo-title">演示</h4>
              <div class="component-demo">
                <CultivatorAttributePanel :cultivator="cultivator" />
              </div>
            </div>

            <div class="component-docs">
              <h4 class="docs-subtitle">使用方法</h4>
              <a-code class="code-block" language="vue">&lt;CultivatorAttributePanel :cultivator="cultivator" /&gt;</a-code>
              
              <h4 class="docs-subtitle">属性</h4>
              <table class="api-table">
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
                    <td>cultivator</td>
                    <td>CultivatorClass</td>
                    <td>-</td>
                    <td>修仙者实例</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 灵根详情组件 -->
          <div v-if="activeKey === 'spirit-root-details'" class="component-container">
            <div class="component-header">
              <h3 class="component-name">SpiritRootDetails</h3>
              <span class="component-tag">特殊属性</span>
            </div>
            
            <div class="component-description">
              <p>灵根详情组件，用于展示修仙者的灵根信息，包括灵根类型、等级、灵根值和灵根对属性的加成效果。</p>
            </div>

            <div class="component-demo-wrapper">
              <h4 class="demo-title">演示</h4>
              <div class="component-demo">
                <SpiritRootDetails :cultivator="cultivator" />
              </div>
            </div>

            <div class="component-docs">
              <h4 class="docs-subtitle">使用方法</h4>
              <a-code class="code-block" language="vue">&lt;SpiritRootDetails :cultivator="cultivator" /&gt;</a-code>
              
              <h4 class="docs-subtitle">属性</h4>
              <table class="api-table">
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
                    <td>cultivator</td>
                    <td>CultivatorClass</td>
                    <td>-</td>
                    <td>修仙者实例</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 灵根组件演示 -->
          <div v-if="activeKey === 'spirit-root-components'" class="component-container">
            <div class="component-header">
              <h3 class="component-name">灵根组件集合</h3>
              <span class="component-tag">灵根系统</span>
            </div>
            
            <div class="component-description">
              <p>提供完整的灵根系统UI组件，包括灵根信息展示、灵根选择器和灵根编辑器，支持各种灵根相关的交互需求。</p>
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
                <a-code class="code-block" language="vue">&lt;SpiritRootInfo 
  :spirit-root="spiritRoot"
/&gt;</a-code>
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
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { CultivatorInfoCard, CultivatorAttributePanel, SpiritRootDetails, CultivatorClass } from '@/v1/cultivator';
import { SpiritRootInfo } from '@/v1/spiritRoot/components';

// 状态变量
const cultivator = ref<CultivatorClass>(new CultivatorClass('韩立', '男'));
const activeKey = ref('cultivator-info-card');
const showQuickStart = ref(true);
const showApi = ref(false);

// 菜单数据
const cultivatorMenu = [
  { key: 'cultivator-info-card', title: 'CultivatorInfoCard - 修仙者信息卡片' },
  { key: 'cultivator-attribute-panel', title: 'CultivatorAttributePanel - 属性面板' },
  { key: 'spirit-root-details', title: 'SpiritRootDetails - 灵根详情' },
];

const spiritRootMenu = [
  { key: 'spirit-root-components', title: '灵根组件集合' },
];

// 计算当前展示的标题
const currentTitle = computed(() => {
  const menuItem = [...cultivatorMenu, ...spiritRootMenu].find(item => item.key === activeKey.value);
  return menuItem ? menuItem.title : '组件文档';
});

onMounted(() => {
  // 模拟加载修仙者数据
  cultivator.value = CultivatorClass.随机生成修仙者();
});
</script>

<style scoped>
/* 文档布局样式 */
.docs-layout {
  min-height: 100vh;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
}

/* 文档头部 */
.docs-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 0;
  text-align: center;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.home-title {
  font-size: 32px;
  margin-bottom: 12px;
  font-weight: 600;
}

.home-subtitle {
  font-size: 16px;
  margin-bottom: 0;
  opacity: 0.9;
}

/* 主体内容区域 */
.docs-body {
  display: flex;
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

/* 左侧导航栏 */
.docs-sidebar {
  width: 280px;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  padding: 20px 0;
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-section {
  margin-bottom: 32px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  padding: 0 20px;
  margin-bottom: 12px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: block;
  padding: 8px 20px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 14px;
}

.nav-link:hover {
  background-color: #e6f7ff;
  color: #1890ff;
}

.nav-link.active {
  background-color: #1890ff;
  color: white;
}

/* 右侧主内容 */
.docs-main {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

/* 文档章节 */
.docs-section {
  margin-bottom: 60px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 40px;
}

.docs-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 24px;
  margin-bottom: 32px;
  color: #1f2937;
  font-weight: 600;
}

.section-content {
  line-height: 1.8;
  color: #444;
}

.section-content h3 {
  font-size: 20px;
  margin-top: 32px;
  margin-bottom: 16px;
  color: #333;
}

.section-content h4 {
  font-size: 18px;
  margin-top: 24px;
  margin-bottom: 12px;
  color: #333;
}

/* 组件容器 */
.component-container {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid #e0e0e0;
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.component-name {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.component-tag {
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.component-description {
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

/* 组件演示区域 */
.component-demo-wrapper {
  margin-bottom: 24px;
}

.demo-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #333;
}

.component-demo {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 灵根组件演示 */
.spirit-root-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 16px;
  width: 100%;
}

.spirit-root-demo {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

/* 文档内容 */
.component-docs {
  margin-top: 24px;
}

.docs-subtitle {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

/* 代码块样式 */
.code-block {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.code-block code {
  font-size: 14px;
  line-height: 1.6;
}

/* 表格样式 */
.api-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.api-table thead {
  background-color: #fafafa;
}

.api-table th,
.api-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
}

.api-table th {
  font-weight: 600;
  color: #333;
  white-space: nowrap;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .docs-body {
    flex-direction: column;
  }
  
  .docs-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    max-height: 200px;
  }
  
  .docs-main {
    padding: 20px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .component-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .component-tag {
    margin-top: 8px;
  }
}
</style>