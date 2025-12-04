<template>
  <div class="cultivator-info-card">
    <div class="card-header">
      <h2>{{ cultivator.name }}</h2>
      <span class="realm-level">{{ cultivator.getCultivationLevelName() }}</span>
    </div>
    <div class="card-body">
      <div class="basic-info">
        <div class="info-item">
          <span class="label">性别:</span>
          <span class="value">{{ cultivator.gender }}</span>
        </div>
        <div class="info-item">
          <span class="label">ID:</span>
          <span class="value">{{ cultivator.id }}</span>
        </div>
      </div>
      <div class="spirit-roots">
        <h3>灵根</h3>
        <div class="spirit-root-list">
          <div v-for="root in cultivator.spiritRoots" :key="root.name" class="spirit-root-item">
            <span class="root-name">{{ root.name }}</span>
            <span class="root-value">{{ root.spiritValue.getCurrentValue() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CultivatorClass } from '../impl';

defineProps<{
  cultivator: CultivatorClass;
}>();
</script>

<style scoped>
.cultivator-info-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
  max-width: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.realm-level {
  background-color: #4a90e2;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.basic-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
}

.label {
  font-weight: bold;
  color: #555;
}

.value {
  color: #333;
}

.spirit-roots h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.spirit-root-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.spirit-root-item {
  background-color: #e8f4f8;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #b3d9e6;
  display: flex;
  justify-content: space-between;
  min-width: 80px;
}

.root-name {
  font-weight: bold;
  color: #2c3e50;
}

.root-value {
  color: #27ae60;
}
</style>