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

// 简单的初始化
onMounted(() => {
  console.log("应用已初始化");
});
</script>
