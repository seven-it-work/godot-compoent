<template>
  <div class="compact-card" :class="{ 'bordered': bordered }">
    <div v-if="title" class="card-title">{{ title }}</div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  bordered?: boolean;
  title?: string;
}>();
</script>

<style scoped>
.compact-card {
  background-color: #ffffff;
  border-radius: 3px;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.compact-card.bordered {
  border: 1px solid #e8e8e8;
}

.card-title {
  font-size: 12px;
  font-weight: 500;
  color: #333333;
  padding: 1px 3px;
  margin: 0;
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.card-body {
  padding: 1px 3px;
  margin: 0;
  line-height: 1.2;
}

/* 响应式设计，确保在小屏幕上更加紧凑 */
@media (max-width: 480px) {
  .compact-card {
    border-radius: 2px;
  }
  
  .card-title {
    font-size: 11px;
    padding: 0 2px;
    border-bottom: 0.5px solid #e8e8e8;
  }
  
  .card-body {
    padding: 0 2px;
  }
  
  .compact-card.bordered {
    border: 0.5px solid #e8e8e8;
  }
}
</style>