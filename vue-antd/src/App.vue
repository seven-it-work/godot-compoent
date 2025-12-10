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
import { mapManager } from "@/v1/map/impl";
import { cultivatorManager } from "@/v1/cultivator/CultivatorManager";

// 应用初始化流程
onMounted(() => {
  console.log("应用开始初始化");

  // 1. 获取当前地图（如果不存在会自动创建）
  const currentMap = mapManager.getCurrentMap();
  console.log("地图初始化完成");

  // 2. 随机选择地图中的一个节点作为玩家初始位置
  const randomX = Math.floor(Math.random() * currentMap.width);
  const randomY = Math.floor(Math.random() * currentMap.height);

  // 3. 获取随机位置的格子信息
  const randomGrid = currentMap.getGrid(randomX, randomY);

  // 4. 初始化玩家
  const cultivator = cultivatorManager.getCurrentCultivator();

  // 5. 设置玩家的初始位置为地图中的随机节点
  if (randomGrid) {
    cultivator.currentLocation = randomGrid;
    // 同时更新地图的当前位置
    currentMap.currentX = randomX;
    currentMap.currentY = randomY;
    console.log(
      `玩家初始位置设置完成：${randomGrid.name} (${randomX}, ${randomY})`
    );
  } else {
    console.log("无法获取随机位置的地点信息，使用默认位置");
  }

  console.log("应用初始化完成");
});
</script>
