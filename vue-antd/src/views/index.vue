<script setup lang="ts">
import { useCultivatorStore } from "@/stores/cultivator";
import PlayerInfoPanel1 from "@/v1/cultivator/components/PlayerInfoPanel1.vue";
import GameTimeDisplay from "@/v1/timeSystem/components/GameTimeDisplay.vue";
import MapGridComponent from "@/v1/map/components/MapGridComponent.vue";

// 使用Pinia store获取修仙者实例
const cultivatorStore = useCultivatorStore();
const cultivator = cultivatorStore.getCurrentCultivator();

// 随机数据方法
function 随机数据() {
  cultivator.upgrade(true);
}
</script>

<template>
  <div>
    <GameTimeDisplay :cultivator="cultivator" />
    <button @click="随机数据()">随机数据</button>
    <!-- <CultivationMethodsPanel :cultivator="cultivator" /> -->
    <!-- <CultivatorActions :cultivator="cultivator" /> -->
    <!-- <CultivatorAttributePanel :cultivator="cultivator" /> -->
    <PlayerInfoPanel1 :cultivator="cultivator" />
    <MapGridComponent />
  </div>
</template>
