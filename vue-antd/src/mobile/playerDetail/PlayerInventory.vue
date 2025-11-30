<template>
  <div class="inventory-container">
    <!-- 背包分类 -->
    <div class="inventory-tabs">
      <a-radio-group v-model:value="selectedCategory" buttonStyle="solid" size="small">
        <a-radio-button value="all">全部</a-radio-button>
        <a-radio-button value="equipment">装备</a-radio-button>
        <a-radio-button value="consumable">消耗品</a-radio-button>
        <a-radio-button value="material">材料</a-radio-button>
        <a-radio-button value="other">其他</a-radio-button>
      </a-radio-group>
    </div>
    
    <!-- 背包物品网格 -->
    <div class="inventory-grid">
      <!-- 示例物品 -->
      <div class="inventory-item">
        <div class="item-icon">💊</div>
        <div class="item-info">
          <div class="item-name">治疗药水</div>
          <div class="item-count">×5</div>
        </div>
      </div>
      <div class="inventory-item">
        <div class="item-icon">⚔️</div>
        <div class="item-info">
          <div class="item-name">铁剑</div>
          <div class="item-count">×1</div>
        </div>
      </div>
      <div class="inventory-item">
        <div class="item-icon">🛡️</div>
        <div class="item-info">
          <div class="item-name">布甲</div>
          <div class="item-count">×1</div>
        </div>
      </div>
      <div class="inventory-item">
        <div class="item-icon">🧪</div>
        <div class="item-info">
          <div class="item-name">灵气丹</div>
          <div class="item-count">×10</div>
        </div>
      </div>
      <div class="inventory-item">
        <div class="item-icon">💎</div>
        <div class="item-info">
          <div class="item-name">宝石</div>
          <div class="item-count">×3</div>
        </div>
      </div>
      <div class="inventory-item">
        <div class="item-icon">📜</div>
        <div class="item-info">
          <div class="item-name">心法残页</div>
          <div class="item-count">×2</div>
        </div>
      </div>
      <div class="inventory-item empty-slot">
        <div class="empty-icon">+</div>
      </div>
      <div class="inventory-item empty-slot">
        <div class="empty-icon">+</div>
      </div>
    </div>
    
    <!-- 背包统计信息 -->
    <div class="inventory-stats">
      <span>背包容量: 6/20</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 响应式数据
const selectedCategory = ref('all');

// 未来可以添加物品筛选和交互逻辑
</script>

<style scoped>
.inventory-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
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

/* 响应式优化 */
@media (max-width: 480px) {
  .inventory-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .inventory-tabs {
    margin-left: -8px;
    margin-right: -8px;
    padding-left: 8px;
    padding-right: 8px;
  }
}
</style>