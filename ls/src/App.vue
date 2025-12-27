<template>
  <div class="app">
    <router-view />
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { GameController } from '@/server/controller/GameController';

const gameController = new GameController();

onMounted(async () => {
  await gameController.startGame();
});
</script>
