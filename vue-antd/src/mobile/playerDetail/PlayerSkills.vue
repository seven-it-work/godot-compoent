<template>
  <div class="skills-container">
    <!-- 技能分类 -->
    <div class="skills-tabs">
      <a-radio-group
        v-model:value="selectedCategory"
        buttonStyle="solid"
        size="small"
      >
        <a-radio-button value="all">全部</a-radio-button>
        <a-radio-button value="attack">攻击</a-radio-button>
        <a-radio-button value="defense">防御</a-radio-button>
        <a-radio-button value="support">辅助</a-radio-button>
      </a-radio-group>
    </div>

    <!-- 技能列表 -->
    <div class="skills-list">
      <!-- 示例技能1 -->
      <div class="skill-card">
        <div class="skill-header">
          <div class="skill-icon">⚡</div>
          <div class="skill-info">
            <div class="skill-name">闪电术</div>
            <div class="skill-level">Lv.3</div>
          </div>
          <div class="skill-type">攻击</div>
        </div>
        <div class="skill-description">
          释放一道闪电攻击单个敌人，造成120%攻击力的伤害，并有20%几率使目标麻痹1回合。
        </div>
        <div class="skill-cost">
          <span>消耗: 15 灵气</span>
        </div>
      </div>

      <!-- 示例技能2 -->
      <div class="skill-card">
        <div class="skill-header">
          <div class="skill-icon">🛡️</div>
          <div class="skill-info">
            <div class="skill-name">铁布衫</div>
            <div class="skill-level">Lv.2</div>
          </div>
          <div class="skill-type">防御</div>
        </div>
        <div class="skill-description">临时提升自身防御力20%，持续3回合。</div>
        <div class="skill-cost">
          <span>消耗: 10 灵气</span>
        </div>
      </div>

      <!-- 示例技能3 -->
      <div class="skill-card">
        <div class="skill-header">
          <div class="skill-icon">💚</div>
          <div class="skill-info">
            <div class="skill-name">治疗术</div>
            <div class="skill-level">Lv.1</div>
          </div>
          <div class="skill-type">辅助</div>
        </div>
        <div class="skill-description">恢复自身或队友20%的最大生命值。</div>
        <div class="skill-cost">
          <span>消耗: 20 灵气</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 响应式数据
const selectedCategory = ref("all");

// 未来可以添加技能筛选和升级逻辑
</script>

<style scoped>
.skills-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
}

.skills-tabs {
  margin-bottom: 8px;
  overflow-x: auto;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.skill-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s;
}

.skill-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.skill-icon {
  font-size: 24px;
}

.skill-info {
  flex: 1;
}

.skill-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.skill-level {
  font-size: 12px;
  color: #1890ff;
}

.skill-type {
  font-size: 12px;
  padding: 2px 8px;
  background: #f0f0f0;
  border-radius: 10px;
  color: #666;
}

.skill-description {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
}

.skill-cost {
  font-size: 12px;
  color: #ff4d4f;
}

/* 响应式优化 */
@media (max-width: 480px) {
  .skills-tabs {
    margin-left: -8px;
    margin-right: -8px;
    padding-left: 8px;
    padding-right: 8px;
  }

  .skill-card {
    padding: 10px;
  }
}
</style>
