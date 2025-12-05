<template>
  <a-layout style="min-height: 100vh;">
    <!-- 左侧菜单 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      style="background-color: #fff; border-right: 1px solid #f0f0f0;"
    >
      <div class="logo" style="height: 32px; margin: 16px; background: rgba(255, 255, 255, 0.2);"></div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        theme="light"
        :inline-collapsed="collapsed"
        @select="handleMenuSelect"
      >
        <a-menu-item key="introduction">
          <template #icon>
            <icon-basics />
          </template>
          <span>基础介绍</span>
        </a-menu-item>
        <a-sub-menu key="sub5">
          <template #icon>
            <icon-component />
          </template>
          <template #title>修仙者组件</template>
          <a-menu-item key="cultivator-components">组件概览</a-menu-item>
          <a-menu-item key="cultivator-components/cultivatorInfoCard">信息卡片</a-menu-item>
          <a-menu-item key="cultivator-components/cultivatorAttributePanel">属性面板</a-menu-item>
          <a-menu-item key="cultivator-components/cultivatorActions">操作按钮</a-menu-item>
          <a-menu-item key="cultivator-components/cultivationMethodsPanel">功法面板</a-menu-item>
          <a-menu-item key="cultivator-components/spiritRootDetails">灵根详情</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <!-- 右侧内容区域 -->
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 24px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between;">
        <a-button
          type="text"
          icon="<icon-menu-fold />"
          @click="collapsed = !collapsed"
          style="font-size: 16px; width: 64px; height: 64px; padding: 20px;">
        </a-button>
        <div style="font-size: 18px; font-weight: bold;">组件文档</div>
        <div></div>
      </a-layout-header>

      <a-layout-content style="margin: 24px; padding: 24px; background: #fff; border-radius: 8px; min-height: 280px;">
        <!-- 使用路由视图显示对应的组件内容 -->
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// 获取当前路由
const route = useRoute();
const router = useRouter();

// 菜单状态
const collapsed = ref(false);
const selectedKeys = ref(["introduction"]);
const openKeys = ref(["sub1"]);

// 根据菜单项key确定需要展开的子菜单
function updateOpenKeys(menuKey: string) {
  if (["introduction"].includes(menuKey)) {
    openKeys.value = [];
  } else if (menuKey.startsWith("cultivator-components")) {
    openKeys.value = ["sub5"];
  }
}

// 处理菜单选择事件
const handleMenuSelect = ({ key }: { key: string }) => {
  // 导航到对应的路由
  router.push(`/docs/${key}`);
};

// 监听路由变化，同步菜单选中状态
watch(() => route.path, (newPath) => {
  const pathSegments = newPath.split("/");
  // 获取最后一个路径段作为菜单项的key
  const menuKey = pathSegments[pathSegments.length - 1];
  selectedKeys.value = [menuKey];
  // 根据菜单项key确定需要展开的子菜单
  updateOpenKeys(menuKey);
}, { immediate: true });

// 页面加载时初始化菜单状态
onMounted(() => {
  const pathSegments = route.path.split("/");
  const menuKey = pathSegments[pathSegments.length - 1];
  selectedKeys.value = [menuKey];
  updateOpenKeys(menuKey);
});
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>