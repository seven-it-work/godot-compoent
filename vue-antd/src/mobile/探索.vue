<template>
  <a-layout class="mobile-exploration">
    <a-layout-content>
      <!-- 顶部信息栏 -->
      <div class="top-info-container">
        <div class="location-info">
          <div class="location-name">{{ currentLocation.name }}</div>
          <div class="location-coords">
            坐标: {{ currentLocation.x }}, {{ currentLocation.y }}
          </div>
        </div>
        <div class="map-controls">
          <a-button type="text" size="small" @click="showMapLegend"
            >图例</a-button
          >
        </div>
      </div>

      <!-- 地图区域 -->
      <div class="map-section-container">
        <div class="map-container">
          <div class="game-map" ref="mapRef">
            <!-- 地图网格 -->
            <div class="map-grid">
              <div
                v-for="(row, y) in gameStore.map.locations"
                :key="`row-${y}`"
                class="map-row"
              >
                <div
                  v-for="(location, x) in row"
                  :key="`cell-${x}-${y}`"
                  class="map-cell"
                  :class="getCellClass(location)"
                  @click="moveTo(x, y)"
                  :style="getCellStyle(location)"
                >
                  <!-- 地点图标 -->
                  <span class="location-icon">{{ location.icon }}</span>
                  <!-- 玩家标记显示在当前玩家位置 -->
                  <span v-if="location.isCurrent" class="player-marker"
                    >👤</span
                  >
                  <!-- 怪物标记 -->
                  <span v-if="location.monster" class="cell-icon">👹</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部信息区域 -->
      <!-- 地点详情 -->
      <div class="location-details-container">
        <div class="section-title">当前地点</div>
        <div class="details-content">
          <div class="detail-row" v-if="currentLocation.spiritVein">
            <div class="detail-label">灵脉:</div>
            <div class="detail-value">
              {{ currentLocation.spiritVein.name }} ({{
                currentLocation.spiritVein.level
              }}级)
            </div>
          </div>
          <div class="detail-row" v-if="currentLocation.monster">
            <div class="detail-label">怪物:</div>
            <div class="detail-value">
              {{ currentLocation.monster.name }} ({{
                currentLocation.monster.level
              }}级)
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">灵气:</div>
            <div class="spirit-qi-summary">
              <div
                v-for="spiritType in spiritQiTypes"
                :key="spiritType"
                class="spirit-qi-dot"
                :style="{ backgroundColor: colorMap[spiritType] }"
                :title="`${typeMap[spiritType]}: ${currentLocation.spiritQi[spiritType as SpiritRootType]}/${currentLocation.spiritQi[`max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof typeof currentLocation.spiritQi]}`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-panel-container">
        <div class="section-title">操作</div>
        <div class="action-buttons-grid">
          <a-button
            v-for="(action, index) in actions"
            :key="index"
            :type="action.type"
            size="small"
            @click="action.handler"
            class="action-btn"
          >
            {{ action.label }}
          </a-button>
        </div>
      </div>
    </a-layout-content>

    <!-- 图例弹窗 -->
    <a-modal
      v-model:open="showLegend"
      title="地图图例"
      size="small"
      footer="null"
    >
      <div class="legend-content">
        <a-row
          :gutter="[8, 8]"
          v-for="(legend, index) in mapLegend"
          :key="index"
        >
          <a-col :span="6">
            <div
              class="legend-color"
              :style="{ backgroundColor: legend.color }"
            ></div>
          </a-col>
          <a-col :span="12">
            <span class="legend-text">{{ legend.text }}</span>
          </a-col>
          <a-col :span="6">
            <span class="legend-icon">{{ legend.icon }}</span>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "../store/gameStore";
import { locationIcons } from "../config/locationIcons";
import type { SpiritRootType, Location } from "../types/game";

const gameStore = useGameStore();
const router = useRouter();

// 响应式数据
const showLegend = ref(false);
const mapRef = ref<HTMLElement | null>(null);
// 移动状态控制
const isMoving = ref(false); // 标记玩家是否正在移动中
const moveStepDelay = 150; // 每步移动的延迟时间（毫秒）

// 计算属性
const currentLocation = computed(() => gameStore.getCurrentLocation);

// 配置 - 从配置文件或集中管理的地方获取，提高可维护性
const spiritQiTypes = ref<string[]>(["gold", "wood", "water", "fire", "earth"]);

// 灵气类型映射和颜色配置 - 可以考虑移到单独的配置文件中
const typeMap = ref<Record<string, string>>({
  gold: "金",
  wood: "木",
  water: "水",
  fire: "火",
  earth: "土",
});

const colorMap = ref<Record<string, string>>({
  gold: "#ffd700",
  wood: "#90ee90",
  water: "#87ceeb",
  fire: "#ff6347",
  earth: "#deb887",
});

// 单元格样式配置 - 集中管理单元格样式，便于扩展
const cellStyleConfig = ref({
  current: { backgroundColor: "#1890ff" }, // 当前位置蓝色
  spiritVein: { backgroundColor: "#73d13d" }, // 灵脉绿色
  monster: { backgroundColor: "#ff7875" }, // 怪物红色
  default: { backgroundColor: "#e6f7ff" }, // 普通地形浅蓝色
});

// 单元格大小配置 - 集中管理单元格大小，便于统一修改
const cellSize = ref(48); // 单元格大小，单位：像素

// 自动生成地图图例数据 - 动态生成图例，无需手动添加新地点类型
const mapLegend = computed(() => {
  const legendItems = [
    { color: cellStyleConfig.value.current.backgroundColor, text: "当前位置", icon: "👤" },
    { color: cellStyleConfig.value.spiritVein.backgroundColor, text: "灵脉", icon: "💎" },
    { color: cellStyleConfig.value.monster.backgroundColor, text: "怪物", icon: "👹" },
  ];
  
  // 自动从locationIcons中生成所有地点类别的图例项
  for (const locationType in locationIcons) {
    if (locationIcons.hasOwnProperty(locationType)) {
      const icons = locationIcons[locationType];
      legendItems.push({
        color: cellStyleConfig.value.default.backgroundColor,
        text: locationType,
        icon: icons?.join(' ') || "",
      });
    }
  }
  
  return legendItems;
});

// 导入正确的Monster类型
import type { Monster } from "../types/game";

// 战斗开始函数
const startBattle = (monster: Monster) => {
  console.log("开始战斗，设置当前怪物:", monster.name);
  // 直接调用gameStore的startBattle方法
  gameStore.startBattle(monster);
  // 直接跳转到战斗页面
  router.push("/mobile/battle");
};

// 地图相关方法
const getCellClass = (location: Location) => {
  const classes: string[] = [];
  if (location.isCurrent) {
    classes.push("cell-current");
  }
  if (location.spiritVein) {
    classes.push("cell-spirit-vein");
  }
  if (location.monster) {
    classes.push("cell-monster");
  }
  return classes;
};

const getCellStyle = (location: Location) => {
  if (location.isCurrent) {
    return cellStyleConfig.value.current;
  } else if (location.spiritVein) {
    return cellStyleConfig.value.spiritVein;
  } else if (location.monster) {
    return cellStyleConfig.value.monster;
  } else {
    return cellStyleConfig.value.default;
  }
};

// 计算两点之间的路径（使用曼哈顿距离，简单的直线移动）
const calculatePath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
): { x: number; y: number }[] => {
  const path: { x: number; y: number }[] = [];
  let currentX = startX;
  let currentY = startY;

  // 先处理水平移动，再处理垂直移动（简单的曼哈顿路径）
  while (currentX !== endX) {
    currentX += currentX < endX ? 1 : -1;
    path.push({ x: currentX, y: currentY });
  }

  while (currentY !== endY) {
    currentY += currentY < endY ? 1 : -1;
    path.push({ x: currentX, y: currentY });
  }

  return path;
};

// 平滑移动函数
const moveTo = async (targetX: number, targetY: number) => {
  // 防止重复执行移动操作
  if (
    isMoving.value ||
    (currentLocation.value.x === targetX && currentLocation.value.y === targetY)
  ) {
    return;
  }

  // 设置移动状态
  isMoving.value = true;

  try {
    // 计算从当前位置到目标位置的路径
    const path = calculatePath(
      currentLocation.value.x,
      currentLocation.value.y,
      targetX,
      targetY
    );

    // 检查目标位置是否有怪物（已移除未使用的变量）
    // 添加安全检查以避免undefined错误

    // 逐格移动实现平滑动画效果
    for (const step of path) {
      // 检查当前位置是否有怪物，如果有则停止移动并触发战斗
      const currentStepLocation = gameStore.map.locations?.[step.y]?.[step.x];
      if (currentStepLocation && currentStepLocation.monster) {
        console.log(`遭遇怪物: ${currentStepLocation.monster.name}`);

        // 停止移动并触发战斗
        startBattle(currentStepLocation.monster);
        // 立即终止函数执行，防止继续移动
        return;
      }

      // 使用gameStore的switchLocation方法切换地点
      gameStore.switchLocation(step.x, step.y);

      // 调试信息
      console.log(`移动到坐标 (${step.x}, ${step.y})`);

      // 滚动地图使玩家保持在视图中心
      scrollToPlayer();

      // 延迟以创建平滑动画效果
      await new Promise((resolve) => setTimeout(resolve, moveStepDelay));
    }

    // 跳转逻辑已在循环中处理，移除此处的重复检查
  } catch (error) {
    // 错误处理
    console.error("移动过程中发生错误:", error);
  } finally {
    // 确保移动状态重置
    isMoving.value = false;
  }
};

// 滚动到玩家位置
const scrollToPlayer = () => {
  if (mapRef.value) {
    const playerX = currentLocation.value.x * cellSize.value;
    const playerY = currentLocation.value.y * cellSize.value;
    mapRef.value.scrollTo({
      left: playerX - mapRef.value.clientWidth / 2,
      top: playerY - mapRef.value.clientHeight / 2,
      behavior: "smooth",
    });
  }
};

// 在组件挂载时初始化地图
onMounted(() => {
  console.log("探索页面初始化");

  // 延迟滚动以确保DOM已完全渲染
  setTimeout(() => {
    scrollToPlayer();
  }, 100);

  // 监听战斗开始事件，跳转到战斗页面
  const handleStartBattle = () => {
    console.log("收到战斗开始事件，跳转到战斗页面");
    router.push("/mobile/战斗");
  };

  window.addEventListener("start-battle", handleStartBattle);

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener("start-battle", handleStartBattle);
  });
});

// 移除未使用的moveDirection函数

const cultivation = () => {
  // 跳转到玩家详情页面
  console.log("跳转到玩家详情页面");
  router.push("/mobile/player-detail");
};

const showMapLegend = () => {
  showLegend.value = true;
};

// 操作按钮数据
const actions = ref([{ label: "修炼", type: "primary", handler: cultivation }]);
</script>

<style scoped>
.mobile-exploration {
  width: 100%;
  height: 100vh;
  padding: 4px;
  box-sizing: border-box;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
}

/* 主要内容区域 */
.ant-layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* 顶部信息栏 */
.top-info-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  flex-shrink: 0;
}

.location-info {
  flex: 1;
}

.location-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.location-coords {
  font-size: 12px;
  color: #666;
}

.map-controls {
  display: flex;
  gap: 2px;
}

.map-controls .ant-btn {
  padding: 0 6px;
}

/* 地图区域 */
.map-section-container {
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.map-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.game-map {
  flex: 1;
  overflow: auto;
  padding: 6px;
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  /* 增加滚动条样式优化 */
  scrollbar-width: thin;
  scrollbar-color: #d9d9d9 #f0f0f0;
}

/* Webkit浏览器滚动条样式 */
.game-map::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.game-map::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

.game-map::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.game-map::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

/* 地图网格 - 确保不会被压缩 */
.map-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex-shrink: 0;
}

/* 地图行样式 - 确保不会被压缩 */
.map-row {
  display: flex;
  gap: 1px;
  flex-shrink: 0;
}

/* 固定大小的地图单元格 */
.map-cell {
  width: v-bind('cellSize + "px"');
  height: v-bind('cellSize + "px"');
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  flex-shrink: 0;
  box-sizing: border-box;
}

.map-cell:active {
  transform: scale(0.95);
}

/* 单元格类型 */
.cell-empty {
  background-color: #e6f7ff;
}
.cell-current {
  background-color: #1890ff;
}
.cell-spirit-vein {
  background-color: #73d13d;
}
.cell-monster {
  background-color: #ff7875;
}

.player-marker {
  font-size: 16px;
  line-height: 1;
}

.cell-icon {
  font-size: 12px;
  line-height: 1;
}

/* 地点详情 */
.location-details-container {
  padding: 4px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  flex-shrink: 0;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-label {
  color: #666;
  font-size: 12px;
  min-width: 40px;
}

.detail-value {
  color: #333;
  font-size: 12px;
  flex: 1;
}

/* 灵气分布摘要 */
.spirit-qi-summary {
  display: flex;
  gap: 2px;
  flex: 1;
}

.spirit-qi-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #d9d9d9;
}

/* 操作按钮 */
.action-panel-container {
  padding: 4px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  flex-shrink: 0;
}

.action-buttons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
}

.action-btn {
  font-size: 12px;
  padding: 4px 0;
  margin: 0;
}

/* 图例样式 */
.legend-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border: 1px solid #d9d9d9;
}

.legend-text {
  flex: 1;
  font-size: 12px;
}

.legend-icon {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 优化移动端触摸体验 */
.ant-btn {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* 移除所有不必要的边距和内边距 */
:deep(.ant-card) {
  margin: 0;
  padding: 0;
}

:deep(.ant-card-body) {
  margin: 0;
  padding: 0;
}

:deep(.ant-row) {
  margin: 0;
}

:deep(.ant-col) {
  padding: 0;
}
</style>

<!-- 阿里巴巴图标库 -->
<style>
/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
@font-face {
  font-family: 'iconfont';  /* Project id 5078320 */
  src: url('//at.alicdn.com/t/c/font_5078320_icsfgw3bjsk.woff2?t=1764641638226') format('woff2'),
       url('//at.alicdn.com/t/c/font_5078320_icsfgw3bjsk.woff?t=1764641638226') format('woff'),
       url('//at.alicdn.com/t/c/font_5078320_icsfgw3bjsk.ttf?t=1764641638226') format('truetype');
}

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 18px; /* 调整图标大小以适应格子 */
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.location-icon {
  font-family: 'iconfont' !important;
  font-size: 22px; /* 地点图标稍大一些 */
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
