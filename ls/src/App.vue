<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import db_card from './server/db/db_card';

console.log('开始初始化');
db_card.dbInit();
console.log('初始化完成');
</script>
