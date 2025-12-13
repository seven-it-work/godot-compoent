<template>
  <div class="spell-card">
    <div class="spell-card-inner">
      <div class="spell-name">{{ spell.nameCN }}</div>
      <div class="spell-description">{{ spell.description }}</div>
      <div class="spell-type">{{ spell.type === 'shaping' ? '塑造法术' : '法术' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Spell } from '../game/Spell';

interface Props {
  spell: Spell;
}

const { spell } = defineProps<Props>();
</script>

<style scoped>
.spell-card {
  width: 100%;
  height: 100%;
  background-color: #0066cc;
  border: 2px solid #003366;
  border-radius: 10px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.2s ease;
  position: relative;
  overflow: hidden;
}

.spell-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.spell-card-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.spell-name {
  font-size: 14px;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.spell-description {
  font-size: 10px;
  color: #cccccc;
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.spell-type {
  font-size: 10px;
  color: #ffff00;
  text-align: center;
  margin-top: 5px;
  font-weight: bold;
}
</style>
