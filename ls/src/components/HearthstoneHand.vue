<template>
  <div class="right-subsection">
    <div class="row">
      <HearthstoneCard v-for="i in 5" :key="`bottom-top-${i}`"></HearthstoneCard>
    </div>
    <div class="row">
      <HearthstoneCard v-for="i in 5" :key="`bottom-bottom-${i}`"></HearthstoneCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import HearthstoneCard from './HearthstoneCard.vue';
</script>

<style scoped>
.right-subsection {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.row {
  display: flex;
  flex: 1;
}
</style>
