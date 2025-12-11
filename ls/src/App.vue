<script setup lang="ts">
import GameBoard from './components/GameBoard.vue';
</script>

<template>
  <div class="app">
    <GameBoard />
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
