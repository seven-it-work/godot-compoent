<script setup lang="ts">
import {
  CultivationMethodsPanel,
  CultivatorActions,
  CultivatorAttributePanel,
  CultivatorClass,
} from "@/v1/cultivator";

const cultivator = CultivatorClass.随机生成人物();
</script>

<template>
  <div>
    <!-- <CultivationMethodsPanel :cultivator="cultivator" /> -->
    <CultivatorActions :cultivator="cultivator" />
    <CultivatorAttributePanel :cultivator="cultivator" />
  </div>
</template>
