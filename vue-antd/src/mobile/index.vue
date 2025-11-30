<template>
  <div class="mobile-container">
    <component :is="currentComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '../store/gameStore';
import StartGamePage from './开始游戏.vue';
import TrainingPage from './修炼.vue';
import ExplorationPage from './探索.vue';
import BattlePage from './战斗.vue';

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();

// 映射路径到组件
const pathToComponent: Record<string, any> = {
  '/': StartGamePage,
  '/start': StartGamePage,
  '/training': TrainingPage,
  '/outdoor': ExplorationPage,
  '/explore': ExplorationPage,
  '/battle': BattlePage
};

// 检查游戏是否已初始化
const isGameInitialized = computed(() => {
  // 游戏初始化的标准是地图已生成（有地点数据）
  return gameStore.map.locations.length > 0;
});

// 根据当前路径计算要显示的组件
const currentComponent = computed(() => {
  // 移除 /mobile 前缀，得到相对路径
  const relativePath = route.path.replace('/mobile', '');
  
  // 如果游戏未初始化且不是开始页面，强制显示开始游戏页面
  if (!isGameInitialized.value && relativePath !== '/' && relativePath !== '/start') {
    return StartGamePage;
  }
  
  // 正常返回对应组件或默认显示开始游戏页面
  return pathToComponent[relativePath] || StartGamePage;
});

// 监听路径变化，实现路由守卫逻辑
watch(
  () => route.path,
  (newPath) => {
    const relativePath = newPath.replace('/mobile', '');
    const isStartPage = relativePath === '/' || relativePath === '/start';
    const isAllowedPath = pathToComponent[relativePath] !== undefined;
    
    // 如果访问的是不允许的路径，重定向到开始页面
    if (!isAllowedPath) {
      router.replace('/mobile/');
      return;
    }
    
    // 如果不是开始页面且游戏未初始化，重定向到开始页面
    if (!isStartPage && !isGameInitialized.value) {
      router.replace('/mobile/');
    }
  },
  { immediate: true }
);

// 组件挂载时执行一次路由检查
onMounted(() => {
  const relativePath = route.path.replace('/mobile', '');
  const isStartPage = relativePath === '/' || relativePath === '/start';
  
  // 如果不是开始页面且游戏未初始化，立即重定向
  if (!isStartPage && !isGameInitialized.value) {
    router.replace('/mobile/');
  }
});
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