<script setup lang="ts">
import { ref } from "vue";
import { CultivatorClass } from "@/v1/cultivator";
import PlayerInfoPanel1 from "@/v1/cultivator/components/PlayerInfoPanel1.vue";

const cultivator = ref<CultivatorClass>(CultivatorClass.随机生成人物());
// 随机数据方法
function 随机数据() {
  cultivator.value.upgrade(true);
}
</script>

<template>
  <div>
    <button @click="随机数据()">随机数据</button>
    <!-- <CultivationMethodsPanel :cultivator="cultivator" /> -->
    <!-- <CultivatorActions :cultivator="cultivator" /> -->
    <!-- <CultivatorAttributePanel :cultivator="cultivator" /> -->
    <PlayerInfoPanel1 :cultivator="cultivator" />
  </div>
</template>
