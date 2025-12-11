<template>
  <div>
    <!-- 玩家基本信息组件 -->
    <PlayerBasicInfo :cultivator="cultivator" />

    <!-- 水平菜单 -->
    <div class="horizontal-menu">
      <div
        v-for="menu in menuItems"
        :key="menu.key"
        class="menu-item"
        :class="{ active: currentMenu === menu.key }"
        @click="currentMenu = menu.key"
      >
        {{ menu.label }}
      </div>
    </div>

    <!-- 动态内容区域 -->
    <div class="content-section">
      <!-- 属性菜单内容 -->
      <div v-if="currentMenu === 'attributes'" class="content-item">
        <CultivatorAttributePanel :cultivator="cultivator" />
      </div>

      <!-- 操作菜单内容 -->
      <div v-else-if="currentMenu === 'option'" class="content-item">
        <CultivationOperationPanel :cultivator="cultivator" />
      </div>

      <!-- 默认内容 -->
      <div v-else class="content-item">
        <div class="content-content">
          <p>
            未开发，菜单key={{ currentMenu }},value={{
              menuItems.find((item) => item.key === currentMenu)?.label
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import PlayerBasicInfo from "./PlayerBasicInfo.vue";
import CultivatorAttributePanel from "./CultivatorAttributePanel.vue";
import CultivationOperationPanel from "./CultivationOperationPanel.vue";
import { useCultivatorStore } from "@/stores/cultivator";

// 获取修仙者状态管理Store
const cultivatorStore = useCultivatorStore();

// 从store获取修仙者实例
const cultivator = cultivatorStore.getCurrentCultivator();

// 定义菜单数据
const menuItems = [
  { key: "option", label: "操作" },
  { key: "attributes", label: "属性" },
  { key: "skills", label: "技能" },
  { key: "equipment", label: "装备" },
  { key: "backpack", label: "背包" },
];

// 当前选中的菜单
const currentMenu = ref("option");

// 无需props，直接从store获取修仙者实例

// 组件挂载时
onMounted(() => {
  // 挂载逻辑已迁移到 CultivationOperationPanel 组件
});

// 组件卸载时
onUnmounted(() => {
  // 卸载逻辑已迁移到 CultivationOperationPanel 组件
});
</script>

<style scoped>
.player-info-panel-1 {
  display: flex;
  flex-direction: column;
  width: auto;
  height: auto;
}

/* 水平菜单 */
.horizontal-menu {
  display: flex;
  width: 100%;
  border: 2px solid #000;
  background-color: #fff;
  margin-top: 10px;
  overflow: hidden;
}

.menu-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-right: 2px solid #000;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:last-child {
  border-right: none;
}

.menu-item:hover {
  background-color: #f0f0f0;
}

.menu-item:active {
  background-color: #e0e0e0;
}

.menu-item.active {
  background-color: #f0f0f0;
  border-bottom: 3px solid #1890ff;
}

/* 内容区域 */
.content-section {
  width: 100%;
  border: 2px solid #000;
  background-color: #fff;
  margin-top: 10px;
  min-height: 200px;
  font-size: 16px;
  color: #000;
}

.content-item {
  width: 100%;
  height: 100%;
}
</style>
