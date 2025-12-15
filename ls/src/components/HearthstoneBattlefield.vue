<template>
  <div class="row">
    <HearthstoneCard v-for="i in 7" :key="`battlefield-${i}`"></HearthstoneCard>
  </div>
</template>

<script setup lang="ts">
import HearthstoneCard from './HearthstoneCard.vue';
</script>

<style scoped>
.row {
  display: flex;

  flex: 1;
}
</style>
