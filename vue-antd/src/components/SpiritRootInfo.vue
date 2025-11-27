<template>
  <a-card title="灵根信息" class="spirit-root-card">
    <div class="spirit-root-list">
      <div
        v-for="root in spiritRoots"
        :key="root.type"
        class="spirit-root-item"
        :style="{ borderColor: getRootColor(root.type) }"
      >
        <div class="root-header">
          <span class="root-name">{{ root.name }}</span>
          <span class="root-level">等级 {{ root.level }}</span>
        </div>
        <div class="root-visual">
          <div
            class="root-strength"
            :style="{
              width: `${root.level * 20}%`,
              backgroundColor: getRootColor(root.type),
            }"
          ></div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import type { SpiritRoot, SpiritRootType } from "../types/game";

interface Props {
  spiritRoots: SpiritRoot[];
}

defineProps<Props>();

// 获取灵根对应的颜色
const getRootColor = (type: SpiritRootType) => {
  const colorMap: Record<SpiritRootType, string> = {
    gold: "#FFD700",
    wood: "#90EE90",
    water: "#87CEEB",
    fire: "#FF6347",
    earth: "#DEB887",
  };
  return colorMap[type];
};
</script>

<style scoped>
.spirit-root-card {
  margin-bottom: 20px;
}

.spirit-root-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.spirit-root-item {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

.spirit-root-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.root-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.root-name {
  font-size: 16px;
  font-weight: bold;
}

.root-level {
  font-size: 14px;
  color: #666;
  background-color: #e6f7ff;
  padding: 2px 8px;
  border-radius: 10px;
}

.root-visual {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.root-strength {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .spirit-root-list {
    grid-template-columns: 1fr;
  }
}
</style>
