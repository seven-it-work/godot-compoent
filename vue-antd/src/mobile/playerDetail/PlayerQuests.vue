<template>
  <div class="quests-container">
    <!-- 任务分类 -->
    <div class="quests-tabs">
      <a-radio-group
        v-model:value="selectedCategory"
        buttonStyle="solid"
        size="small"
      >
        <a-radio-button value="all">全部</a-radio-button>
        <a-radio-button value="main">主线</a-radio-button>
        <a-radio-button value="side">支线</a-radio-button>
        <a-radio-button value="daily">日常</a-radio-button>
      </a-radio-group>
    </div>

    <!-- 任务列表 -->
    <div class="quests-list">
      <!-- 示例任务1 -->
      <div class="quest-card">
        <div class="quest-header">
          <div class="quest-title">
            <span class="quest-type-tag main">主线</span>
            <span>初学乍练</span>
          </div>
          <div class="quest-progress">1/3</div>
        </div>
        <div class="quest-description">击败3只森林里的野兽，证明你的实力。</div>
        <div class="quest-rewards">
          <span class="reward-item">💰 500</span>
          <span class="reward-item">📖 200 经验</span>
        </div>
      </div>

      <!-- 示例任务2 -->
      <div class="quest-card">
        <div class="quest-header">
          <div class="quest-title">
            <span class="quest-type-tag side">支线</span>
            <span>采药人</span>
          </div>
          <div class="quest-progress">2/5</div>
        </div>
        <div class="quest-description">帮王药师采集5株灵草。</div>
        <div class="quest-rewards">
          <span class="reward-item">💰 200</span>
          <span class="reward-item">💊 治疗药水×3</span>
        </div>
      </div>

      <!-- 示例任务3 -->
      <div class="quest-card">
        <div class="quest-header">
          <div class="quest-title">
            <span class="quest-type-tag daily">日常</span>
            <span>每日修炼</span>
          </div>
          <div class="quest-progress">0/1</div>
        </div>
        <div class="quest-description">完成1次修炼，提升修为。</div>
        <div class="quest-rewards">
          <span class="reward-item">💎 10 灵气</span>
          <span class="reward-item">📖 100 经验</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 响应式数据
const selectedCategory = ref("all");

// 未来可以添加任务筛选和完成逻辑
</script>

<style scoped>
.quests-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
}

.quests-tabs {
  margin-bottom: 8px;
  overflow-x: auto;
}

.quests-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.quest-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s;
}

.quest-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.quest-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

.quest-type-tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 10px;
  color: #fff;
}

.quest-type-tag.main {
  background: #1890ff;
}

.quest-type-tag.side {
  background: #52c41a;
}

.quest-type-tag.daily {
  background: #faad14;
}

.quest-progress {
  font-size: 12px;
  color: #1890ff;
  background: #e6f7ff;
  padding: 2px 8px;
  border-radius: 10px;
}

.quest-description {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
}

.quest-rewards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.reward-item {
  font-size: 12px;
  color: #666;
  background: #f6ffed;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #b7eb8f;
}

/* 响应式优化 */
@media (max-width: 480px) {
  .quests-tabs {
    margin-left: -8px;
    margin-right: -8px;
    padding-left: 8px;
    padding-right: 8px;
  }

  .quest-card {
    padding: 10px;
  }

  .reward-item {
    font-size: 11px;
  }
}
</style>
