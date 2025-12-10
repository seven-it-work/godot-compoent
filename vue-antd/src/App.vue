<template>
  <div>
    <main>
      <!-- 路由视图组件 -->
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useCultivatorStore } from "@/stores/cultivator";
import { useMapStore } from "@/stores/map";
import { CultivatorClass } from "@/v1/cultivator/impl";

// 应用初始化流程
onMounted(() => {
  const cultivatorStore = useCultivatorStore();
  // 初始化人物
  cultivatorStore.setCurrentCultivator(CultivatorClass.随机生成人物());
  const mapStore = useMapStore();
  mapStore.createMap(10, 10);
  const currentMap = mapStore.getCurrentMap();
  // 2. 随机选择地图中的一个节点作为玩家初始位置
  const randomX = Math.floor(Math.random() * currentMap.width);
  const randomY = Math.floor(Math.random() * currentMap.height);
  // 3. 获取随机位置的格子信息
  const randomGrid = currentMap.getGrid(randomX, randomY);
  cultivatorStore.setCultivatorLocation(randomGrid);
});
</script>
