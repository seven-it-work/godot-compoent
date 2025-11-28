<template>
  <div class="mobile-container">
    <component :is="currentComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TrainingPage from './修炼.vue';
import ExplorationPage from './探索.vue';
import BattlePage from './战斗.vue';

const route = useRoute();
const router = useRouter();

// 映射路径到组件
const pathToComponent: Record<string, any> = {
  '/training': TrainingPage,
  '/outdoor': ExplorationPage,
  '/explore': ExplorationPage,
  '/battle': BattlePage
};

// 根据当前路径计算要显示的组件
const currentComponent = computed(() => {
  // 移除 /mobile 前缀，得到相对路径
  const relativePath = route.path.replace('/mobile', '');
  // 如果有对应的组件，则使用该组件，否则默认显示修炼页面
  return pathToComponent[relativePath] || TrainingPage;
});

// 监听路径变化，如果没有匹配的组件，重定向到默认页面
watch(
  () => route.path,
  (newPath) => {
    const relativePath = newPath.replace('/mobile', '');
    if (!pathToComponent[relativePath]) {
      router.replace('/mobile/training');
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.mobile-container {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>