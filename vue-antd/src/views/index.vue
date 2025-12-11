<script setup lang="ts">
import { useCultivatorStore } from "@/stores/cultivator";
import { useTimeSystemStore } from "@/stores/timeSystem";
import PlayerInfoPanel1 from "@/v1/cultivator/components/PlayerInfoPanel1.vue";
import GameTimeDisplay from "@/v1/timeSystem/components/GameTimeDisplay.vue";
import MapGridComponent from "@/v1/map/components/MapGridComponent.vue";

// 使用Pinia store获取修仙者实例
const cultivatorStore = useCultivatorStore();
const cultivator = cultivatorStore.getCurrentCultivator();

// 使用Pinia store获取时间系统实例并初始化
const timeSystemStore = useTimeSystemStore();
timeSystemStore.initGameTime();

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
    <PlayerInfoPanel1 />
    <MapGridComponent />
  </div>
</template>
