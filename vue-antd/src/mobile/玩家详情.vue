<template>
  <a-layout class="mobile-player-detail" :style="{ padding: 0, margin: 0 }">
    <!-- Header区域，放置探索按钮 -->
    <a-layout-header
      style="
        height: auto;
        padding: 0;
        background: #fff;
        border-bottom: 1px solid #f0f0f0;
        line-height: 0px;
      "
    >
      <div class="header-container">
        <a-button type="primary" @click="goExplore" block> 探索 </a-button>
      </div>
    </a-layout-header>
    <a-layout-content :style="{ padding: 0, margin: 0 }">
      <!-- Tab页签区域 -->
      <div class="tabs-container">
        <a-tabs v-model:activeKey="activeTab" size="small">
          <!-- 属性Tab：使用独立组件 -->
          <a-tab-pane tab="属性" key="attributes">
            <PlayerAttributes />
          </a-tab-pane>

          <!-- 修炼Tab：使用现有的修炼.vue文件 -->
          <a-tab-pane tab="修炼" key="cultivation">
            <Cultivation />
          </a-tab-pane>

          <!-- 背包Tab：使用独立组件 -->
          <a-tab-pane tab="背包" key="inventory">
            <PlayerInventory />
          </a-tab-pane>

          <!-- 技能Tab：使用独立组件 -->
          <a-tab-pane tab="技能" key="skills">
            <PlayerSkills />
          </a-tab-pane>

          <!-- 任务Tab：使用独立组件 -->
          <a-tab-pane tab="任务" key="tasks">
            <PlayerQuests />
          </a-tab-pane>
          <a-tab-pane tab="队伍" key="team">
            <Team />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
// 导入独立组件
import PlayerAttributes from "./playerDetail/PlayerAttributes.vue";
import PlayerInventory from "./playerDetail/PlayerInventory.vue";
import PlayerSkills from "./playerDetail/PlayerSkills.vue";
import PlayerQuests from "./playerDetail/PlayerQuests.vue";
import Team from "./playerDetail/Team.vue";
// 导入现有的修炼组件
import Cultivation from "./playerDetail/Cultivation.vue";
import { useRouter } from "vue-router";
import { useGameStore } from "../store/gameStore";

const gameStore = useGameStore();
const router = useRouter();

// 响应式数据
// 从gameStore中获取当前激活的tab
const activeTab = ref(gameStore.getPlayerDetailActiveTab);

// 监听tab页签变化，调用store的方法更新状态
watch(
  () => activeTab.value,
  (newValue) => {
    console.log(
      '[玩家详情] 检测到tab变化: "' + newValue + '"，正在更新到store'
    );
    // 确保gameStore有这个方法
    if (typeof gameStore.setPlayerDetailActiveTab === "function") {
      gameStore.setPlayerDetailActiveTab(newValue);
    } else {
      console.error(
        "[玩家详情] 错误: gameStore.setPlayerDetailActiveTab 不是一个函数"
      );
    }
  }
);

// 在组件挂载时从store同步当前tab状态
onMounted(() => {
  console.log("[玩家详情] 组件挂载完成，从store同步tab状态");
  const savedTab = gameStore.getPlayerDetailActiveTab;
  console.log('[玩家详情] 从store获取到的tab: "' + savedTab + '"');

  // 如果store中的tab与当前activeTab不同，则更新activeTab
  if (savedTab !== activeTab.value) {
    console.log('[玩家详情] 更新activeTab为store中的值: "' + savedTab + '"');
    activeTab.value = savedTab;
  }
});

// 计算属性已移至PlayerAttributes.vue组件中

// 探索功能
const goExplore = () => {
  console.log("goExplore");
  router.push("/mobile/explore");
};

// 初始化日志
console.log(
  '[玩家详情] 组件初始化完成，当前activeTab: "' + activeTab.value + '"'
);
</script>

<style scoped>
.mobile-player-detail {
  width: 100%;
  height: 100vh;
  padding: 0 !important;
  margin: 0 !important;
  box-sizing: border-box;
  background-color: #f0f2f5;
  overflow-y: auto;
}

.header-container {
  width: 100%;
  box-sizing: border-box;
}

.player-basic-info {
  padding: 8px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
}

/* 头像区域 */
.avatar-card {
  height: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.avatar-placeholder {
  font-size: 24px;
  color: #fff;
  font-weight: bold;
}

.player-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.player-level {
  font-size: 12px;
  color: #666;
}

/* 等级和经验区域 */
.level-card {
  height: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

.exp-bar-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0;
}

.exp-label {
  font-size: 12px;
  font-weight: bold;
  color: #333;
}

.exp-bar {
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.exp-bar-fill {
  height: 100%;
  background-color: #52c41a;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.exp-text {
  font-size: 11px;
  color: #666;
  text-align: right;
}

.tabs-container {
  padding: 8px;
}

.tab-content {
  padding: 8px;
  background-color: #fff;
  border-radius: 8px;
  min-height: 300px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  font-size: 14px;
}

/* 属性页面样式 */
.attributes-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.attribute-section {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.attribute-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.attribute-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #fafafa;
  border-radius: 6px;
}

.attribute-label {
  font-size: 12px;
  color: #666;
}

.attribute-value {
  font-size: 14px;
  font-weight: bold;
  color: #1890ff;
}

.rating-container {
  text-align: center;
  padding: 16px;
}

.rating-score {
  font-size: 32px;
  font-weight: bold;
  color: #ff7875;
  margin-bottom: 8px;
}

.rating-description {
  font-size: 14px;
  color: #666;
}

/* 修炼区域样式 */
.cultivation-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cultivation-level-section,
.cultivation-exp-section,
.cultivation-logs {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
}

.cultivation-level-section h3,
.cultivation-exp-section h3,
.cultivation-logs h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.level-display {
  text-align: center;
}

.current-level {
  font-size: 28px;
  font-weight: bold;
  color: #1890ff;
}

.level-name {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.exp-bar {
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background-color: #1890ff;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.exp-info {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.cultivation-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.logs-container {
  max-height: 200px;
  overflow-y: auto;
  font-size: 12px;
}

.log-item {
  margin-bottom: 6px;
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
}

.log-item:last-child {
  border-bottom: none;
}

/* 背包页面样式 */
.inventory-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.inventory-tabs {
  margin-bottom: 8px;
  overflow-x: auto;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.inventory-item {
  background: #fff;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: 1px solid #f0f0f0;
  min-height: 80px;
  cursor: pointer;
  transition: all 0.2s;
}

.inventory-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.2);
}

.inventory-item .item-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.inventory-item .item-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.inventory-item .item-name {
  font-size: 10px;
  color: #333;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.inventory-item .item-count {
  font-size: 10px;
  color: #999;
  background: #f5f5f5;
  padding: 1px 4px;
  border-radius: 10px;
}

.inventory-item.empty-slot {
  border: 1px dashed #d9d9d9;
  background: #fafafa;
  justify-content: center;
}

.inventory-item.empty-slot .empty-icon {
  font-size: 20px;
  color: #bfbfbf;
}

.inventory-stats {
  text-align: center;
  font-size: 12px;
  color: #666;
  padding: 8px;
  background: #fafafa;
  border-radius: 6px;
}

/* 技能页面样式 */
.skills-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-tabs {
  margin-bottom: 8px;
  overflow-x: auto;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.skill-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.skill-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f7ff;
  border-radius: 8px;
}

.skill-info {
  flex: 1;
}

.skill-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.skill-level {
  font-size: 12px;
  color: #999;
}

.skill-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
}

.skill-cooldown {
  font-size: 11px;
  color: #1890ff;
  background: #e6f7ff;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
}

/* 任务页面样式 */
.quests-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quest-tabs {
  margin-bottom: 8px;
  overflow-x: auto;
}

.quests-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quest-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.quest-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.quest-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.quest-rank {
  font-size: 10px;
  font-weight: bold;
}

.quest-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.quest-progress {
  margin-bottom: 8px;
}

.progress-bar {
  background: #f0f0f0;
  border-radius: 4px;
  height: 6px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  background: #1890ff;
  height: 100%;
  border-radius: 4px;
}

.progress-text {
  font-size: 11px;
  color: #999;
  text-align: right;
}

.quest-rewards {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.reward {
  font-size: 10px;
  color: #52c41a;
  background: #f6ffed;
  padding: 2px 6px;
  border-radius: 10px;
}

/* 响应式优化 */
@media (max-width: 480px) {
  .inventory-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .skill-icon {
    font-size: 24px;
    width: 40px;
    height: 40px;
  }

  .inventory-tabs,
  .skill-tabs,
  .quest-tabs {
    margin-left: -8px;
    margin-right: -8px;
    padding-left: 8px;
    padding-right: 8px;
  }
}
</style>
