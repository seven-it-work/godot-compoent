<template>
  <div class="outdoor-system">
    <h2>外出系统</h2>

    <!-- 时间显示 -->
    <TimeDisplay />

    <!-- 地图和地点信息 -->
    <div class="main-content">
      <!-- 地图组件 -->
      <div class="map-section">
        <MapComponent />
      </div>

      <!-- 地点信息 -->
      <div class="location-section">
        <LocationInfo />
      </div>
    </div>

    <!-- 返回按钮 -->
    <div class="back-button-container">
      <a-button type="primary" size="large" @click="backToTraining">
        返回修炼系统
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "../store/gameStore";
import MapComponent from "./MapComponent.vue";
import LocationInfo from "./LocationInfo.vue";
import TimeDisplay from "./TimeDisplay.vue";

const gameStore = useGameStore();

// 返回修炼系统
const backToTraining = () => {
  gameStore.switchSystem("training");
};
</script>

<style scoped>
.outdoor-system {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: #1890ff;
  margin-bottom: 20px;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.map-section {
  overflow: auto;
}

.location-section {
  display: flex;
  flex-direction: column;
}

.back-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .outdoor-system {
    padding: 10px;
  }

  .main-content {
    grid-template-columns: 1fr;
  }

  .map-section {
    order: 2;
  }

  .location-section {
    order: 1;
  }
}
</style>
