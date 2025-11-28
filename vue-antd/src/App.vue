<template>
  <div>
    <main>
      <!-- 路由视图组件 -->
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useGameStore } from "./store/gameStore";

const gameStore = useGameStore();

// 初始化游戏
onMounted(() => {
  gameStore.initGame();
});
</script>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
