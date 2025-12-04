<template>
  <div class="docs-layout">
    <!-- 文档头部 -->
    <header class="docs-header">
      <div class="header-content">
        <h1>修仙者组件库</h1>
        <p>提供完整的修仙者相关组件，支持修仙文字游戏的快速开发</p>
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
            <pre class="code-block"><code>npm install @/v1/cultivator</code></pre>
            
            <h3>引入组件</h3>
            <pre class="code-block"><code>// 引入单个组件
import { CultivatorInfoCard } from '@/v1/cultivator';

// 或引入所有组件
import * as CultivatorComponents from '@/v1/cultivator';</code></pre>
            
            <h3>基本使用</h3>
            <pre class="code-block"><code>&lt;template&gt;
  &lt;div&gt;
    &lt;CultivatorInfoCard :cultivator="cultivator" /&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { CultivatorInfoCard, CultivatorClass } from '@/v1/cultivator';
import { ref } from 'vue';

// 创建修仙者实例
const cultivator = ref(CultivatorClass.随机生成人物());
&lt;/script&gt;</code></pre>
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
              <pre class="code-block"><code>&lt;CultivatorInfoCard :cultivator="cultivator" /&gt;</code></pre>
              
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
              <pre class="code-block"><code>&lt;CultivatorAttributePanel :cultivator="cultivator" /&gt;</code></pre>
              
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
              <pre class="code-block"><code>&lt;SpiritRootDetails :cultivator="cultivator" /&gt;</code></pre>
              
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

          <!-- 修仙功法组件 -->
          <div v-if="activeKey === 'cultivation-methods'" class="component-container">
            <div class="component-header">
              <h3 class="component-name">CultivationMethodsPanel</h3>
              <span class="component-tag">功法系统</span>
            </div>
            
            <div class="component-description">
              <p>修仙功法面板组件，用于展示修仙者学会的功法信息，支持查看功法效果、添加随机功法和显示空状态。</p>
            </div>

            <div class="component-demo-wrapper">
              <h4 class="demo-title">演示</h4>
              <div class="component-demo">
                <CultivationMethodsPanel :cultivator="cultivator" @update="handleUpdate" />
              </div>
            </div>

            <div class="component-docs">
              <h4 class="docs-subtitle">使用方法</h4>
              <pre class="code-block"><code>&lt;CultivationMethodsPanel 
  :cultivator="cultivator" 
  @update="handleUpdate"
/&gt;</code></pre>
              
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
              
              <h4 class="docs-subtitle">事件</h4>
              <table class="api-table">
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
                    <td>cultivator: CultivatorClass</td>
                    <td>功法更新时触发</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 修仙者操作组件 -->
          <div v-if="activeKey === 'cultivator-actions'" class="component-container">
            <div class="component-header">
              <h3 class="component-name">CultivatorActions</h3>
              <span class="component-tag">交互组件</span>
            </div>
            
            <div class="component-description">
              <p>提供修仙者的各项操作功能，包括升级、突破、攻击训练和恢复，支持高度自定义配置和扩展。</p>
            </div>

            <div class="component-demo-wrapper">
              <h4 class="demo-title">演示</h4>
              <div class="component-demo">
                <CultivatorActions :cultivator="cultivator" @update="handleUpdate" @attack="handleAttack"
                  @result="handleActionResult" :recover-qi-blood-value="150" :recover-spirit-power-value="75"
                  button-class-prefix="custom-action">
                  <!-- 通过插槽添加自定义按钮 -->
                  <template #custom-actions>
                    <button @click="handleRandomGenerate" class="action-button generate">
                      随机生成修仙者
                    </button>
                  </template>
                </CultivatorActions>

                <!-- 显示操作结果 -->
                <div v-if="actionResult" class="action-result">
                  <h4>操作结果</h4>
                  <p>{{ actionResult }}</p>
                </div>
              </div>
            </div>

            <div class="component-docs">
              <h4 class="docs-subtitle">基本使用</h4>
              <pre class="code-block"><code>&lt;CultivatorActions
  :cultivator="cultivator"
  @update="handleUpdate"
  @attack="handleAttack"
/&gt;</code></pre>

              <h4 class="docs-subtitle">高级配置</h4>
              <pre class="code-block"><code>&lt;CultivatorActions
  :cultivator="cultivator"
  :title="'自定义操作标题'"
  :show-upgrade="true"
  :show-breakthrough="false" <!-- 隐藏突破按钮 -->
  :upgrade-button-text="'提升等级'"
  :recover-qi-blood-value="200"
  :recover-spirit-power-value="100"
  @update="handleUpdate"
  @attack="handleAttack"
  @result="handleActionResult"
  button-class-prefix="my-action"
&gt;
  <!-- 通过插槽添加自定义按钮 -->
  &lt;template #custom-actions&gt;
    &lt;button @click="handleCustomAction"
      class="action-button custom"
    &gt;
      自定义操作
    &lt;/button&gt;
  &lt;/template&gt;
&lt;/CultivatorActions&gt;</code></pre>
              
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
                  <tr>
                    <td>title</td>
                    <td>string</td>
                    <td>"修仙者操作"</td>
                    <td>组件标题</td>
                  </tr>
                  <tr>
                    <td>showUpgrade</td>
                    <td>boolean</td>
                    <td>true</td>
                    <td>是否显示升级按钮</td>
                  </tr>
                  <tr>
                    <td>showBreakthrough</td>
                    <td>boolean</td>
                    <td>true</td>
                    <td>是否显示突破按钮</td>
                  </tr>
                  <tr>
                    <td>recoverQiBloodValue</td>
                    <td>number</td>
                    <td>100</td>
                    <td>恢复气血值</td>
                  </tr>
                  <tr>
                    <td>recoverSpiritPowerValue</td>
                    <td>number</td>
                    <td>50</td>
                    <td>恢复灵力值</td>
                  </tr>
                </tbody>
              </table>
              
              <h4 class="docs-subtitle">事件</h4>
              <table class="api-table">
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
                    <td>cultivator: CultivatorClass</td>
                    <td>修仙者更新时触发</td>
                  </tr>
                  <tr>
                    <td>attack</td>
                    <td>damage: DamageResult</td>
                    <td>攻击时触发</td>
                  </tr>
                  <tr>
                    <td>result</td>
                    <td>message: string, type: string</td>
                    <td>操作结果回调</td>
                  </tr>
                </tbody>
              </table>
              
              <h4 class="docs-subtitle">插槽</h4>
              <table class="api-table">
                <thead>
                  <tr>
                    <th>插槽名</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>custom-actions</td>
                    <td>自定义操作按钮插槽</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
    
    <!-- 文档底部 -->
    <footer class="docs-footer">
      <div class="footer-content">
        <p>&copy; 2024 修仙文字游戏组件库 | 提供完整的修仙系统组件支持</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { CultivatorInfoCard, CultivatorAttributePanel, CultivatorActions, SpiritRootDetails, CultivationMethodsPanel, CultivatorClass } from '@/v1/cultivator';
import { SpiritRootInfo, SpiritRootSelector, SpiritRootEditor } from '@/v1/spiritRoot/components';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { DamageResult } from '@/v1/damageResult';
import type { SpiritRoot } from '@/v1/spiritRoot';

// 菜单配置
const cultivatorMenu = [
  { key: 'cultivator-info-card', title: '修仙者信息' },
  { key: 'cultivator-attribute-panel', title: '修仙者属性' },
  { key: 'spirit-root-details', title: '灵根详情' },
  { key: 'spirit-root-components', title: '灵根组件演示' },
  { key: 'cultivation-methods', title: '修仙功法' },
  { key: 'cultivator-actions', title: '修仙者操作' }
];

// 获取路由信息
const route = useRoute();

// 当前激活的菜单项
const activeKey = ref('cultivator-info-card');

// 快速开始和API参考的显示状态
const showQuickStart = ref(false);
const showApi = ref(false);

// 从路由查询参数中获取初始状态
onMounted(() => {
  if (route.query.activeKey) {
    activeKey.value = route.query.activeKey as string;
  }
  if (route.query.showQuickStart === 'true') {
    showQuickStart.value = true;
  }
  if (route.query.showApi === 'true') {
    showApi.value = true;
  }
});

// 当前页面标题
const currentTitle = computed(() => {
  const menuItem = cultivatorMenu.find(item => item.key === activeKey.value);
  return menuItem ? menuItem.title : '修仙者组件';
});

// 创建修仙者实例
const cultivator = ref(new CultivatorClass());

// 初始化修仙者
cultivator.value = CultivatorClass.随机生成人物();

// 操作结果
const actionResult = ref<string>('');

// 处理修仙者更新
const handleUpdate = (updatedCultivator: CultivatorClass) => {
  cultivator.value = updatedCultivator;
};

// 灵根组件演示状态
const selectedSpiritRootType = ref<string>('金');
const selectedSpiritRootTypes = ref<string[]>(['金', '木']);
const currentEditingSpiritRoot = ref<SpiritRoot | null>(null);
const isEditing = ref(false);

// 处理灵根选择变化
const handleSpiritRootSelect = (value: string | string[]) => {
  if (Array.isArray(value)) {
    selectedSpiritRootTypes.value = value;
    actionResult.value = `已选择灵根: ${value.join(', ')}`;
  } else {
    selectedSpiritRootType.value = value;
    actionResult.value = `已选择灵根: ${value}`;
  }
  // 3秒后自动清除结果
  setTimeout(() => {
    actionResult.value = '';
  }, 3000);
};

// 处理灵根更新
const handleSpiritRootUpdate = (updatedSpiritRoot: Partial<SpiritRoot>) => {
  if (currentEditingSpiritRoot.value && cultivator.value) {
    // 找到对应的灵根并更新
    const index = cultivator.value.spiritRoots.findIndex(
      root => root.name === currentEditingSpiritRoot.value?.name
    );
    if (index !== -1) {
      cultivator.value.spiritRoots[index] = {
        ...cultivator.value.spiritRoots[index],
        ...updatedSpiritRoot
      };
      // 如果灵根值有变化，更新当前值
      if (updatedSpiritRoot.spiritValue && typeof updatedSpiritRoot.spiritValue === 'object') {
        cultivator.value.spiritRoots[index].spiritValue.currentValue = updatedSpiritRoot.spiritValue.currentValue || 0;
      }
      if (updatedSpiritRoot.attribute && typeof updatedSpiritRoot.attribute === 'object') {
        cultivator.value.spiritRoots[index].attribute.currentValue = updatedSpiritRoot.attribute.currentValue || 0;
      }
      actionResult.value = `灵根 ${updatedSpiritRoot.name} 更新成功！`;
      // 3秒后自动清除结果
      setTimeout(() => {
        actionResult.value = '';
      }, 3000);
    }
    // 退出编辑模式
    isEditing.value = false;
    currentEditingSpiritRoot.value = null;
  }
};

// 处理编辑灵根
const handleEditSpiritRoot = (spiritRoot: SpiritRoot) => {
  currentEditingSpiritRoot.value = spiritRoot;
  isEditing.value = true;
};

// 处理取消编辑
const handleCancelEdit = () => {
  isEditing.value = false;
  currentEditingSpiritRoot.value = null;
};

// 处理攻击事件
const handleAttack = (damage: DamageResult) => {
  console.log('攻击结果:', damage);
};

// 处理操作结果
const handleActionResult = (message: string) => {
  actionResult.value = message;
  // 3秒后自动清除结果
  setTimeout(() => {
    actionResult.value = '';
  }, 3000);
};

// 随机生成修仙者
const handleRandomGenerate = () => {
  const newCultivator = CultivatorClass.随机生成人物();
  cultivator.value = newCultivator;
  actionResult.value = `随机生成成功！新修仙者: ${newCultivator.name}`;
  // 3秒后自动清除结果
  setTimeout(() => {
    actionResult.value = '';
  }, 3000);
};
</script>

<style scoped>
/* 全局样式 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  background-color: #f5f7fa;
  line-height: 1.6;
}

/* 文档布局 */
.docs-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 文档头部 */
.docs-header {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  padding: 40px 0;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 10px;
}

.header-content p {
  margin: 0;
  font-size: 18px;
  opacity: 0.9;
}

/* 文档主体 */
.docs-body {
  display: flex;
  flex: 1;
  margin: 20px auto;
  max-width: 1400px;
  width: 100%;
  padding: 0 20px;
}

/* 侧边栏 */
.docs-sidebar {
  width: 260px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  position: sticky;
  top: 20px;
  height: fit-content;
  margin-right: 30px;
}

.sidebar-section {
  margin-bottom: 30px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 8px;
}

.nav-link {
  display: block;
  padding: 8px 12px;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
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

/* 主内容区 */
.docs-main {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

/* 文档章节 */
.docs-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.section-content {
  color: #666;
}

.section-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-top: 30px;
  margin-bottom: 15px;
}

.section-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-top: 25px;
  margin-bottom: 12px;
}

/* 组件容器 */
.component-container {
  margin-bottom: 40px;
  padding: 25px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.component-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.component-name {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin: 0;
  margin-right: 15px;
}

.component-tag {
  padding: 4px 12px;
  background-color: #e6f7ff;
  color: #1890ff;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* 组件演示 */
.component-demo-wrapper {
  margin-bottom: 25px;
}

.demo-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.component-demo {
  padding: 25px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* 组件文档 */
.component-docs {
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  padding: 20px;
}

.docs-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-top: 20px;
  margin-bottom: 12px;
}

/* 代码块 */
.code-block {
  margin: 0 0 20px 0;
  padding: 0;
  background: #282c34;
  border-radius: 6px;
  overflow: hidden;
}

.code-block pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #abb2bf;
}

/* API表格 */
.api-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 14px;
}

.api-table th,
.api-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
}

.api-table th {
  background-color: #fafafa;
  font-weight: 600;
  color: #333;
  border-top: 2px solid #1890ff;
}

.api-table tr:hover {
  background-color: #fafafa;
}

/* 操作结果 */
.action-result {
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.action-result h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.action-result p {
  margin: 0;
  color: #555;
}

/* 文档底部 */
.docs-footer {
  background-color: #f5f7fa;
  border-top: 1px solid #e8e8e8;
  padding: 20px 0;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.footer-content p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .docs-body {
    flex-direction: column;
  }
  
  .docs-sidebar {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
    position: static;
  }
  
  .component-demo {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .header-content h1 {
    font-size: 28px;
  }
  
  .header-content p {
    font-size: 16px;
  }
  
  .docs-main {
    padding: 20px;
  }
  
  .component-container {
    padding: 15px;
  }
  
  .component-demo {
    padding: 15px;
  }
}
</style>