<template>
  <div
    class="battle-card"
    :class="{
      'has-card': props.data !== null,
      empty: props.data === null,
      enemy: props.isEnemy,
      player: !props.isEnemy,
    }"
  >
    <div v-if="props.data" class="card-content">
      <!-- 左上角圆形数字 -->
      <div class="corner-badge top-left" v-if="props.data.tier">{{ props.data.tier }}</div>
      <!-- 左下角攻击力 -->
      <div class="corner-badge bottom-left">
        {{ props.data instanceof Minion ? props.data.getAttack() : 0 }}
      </div>
      <!-- 右下角生命值 -->
      <div class="corner-badge bottom-right">
        {{ props.data instanceof Minion ? props.data.health : 0 }}
      </div>
      <!-- 关键词 -->
      <div class="keywords" v-if="props.data instanceof Minion">
        <span
          v-for="keyword in [...new Set(props.data.getKeywords())]"
          :key="keyword"
          class="keyword-tag"
        >
          {{ MinionKeywordCN[keyword] }}
        </span>
      </div>
      <div class="card-name">{{ props.data.nameCN }}</div>
      <!-- 随从类型 -->
      <div class="minion-types" v-if="props.data instanceof Minion">
        {{ [props.data.minionTypesCN].join('\n') }}
      </div>
    </div>
    <!-- 空位置显示 -->
    <div v-else class="empty-content">
      <div class="empty-slot">
        <div class="empty-icon">×</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card } from '../../../game/Card';
import { Minion, MinionKeywordCN } from '../../../game/Minion';

// 接收外部传入的参数
const props = defineProps<{
  cardId?: string; // 卡片ID
  data?: Card | null; // 卡片数据，如果为null或undefined则表示空格子
  isEnemy?: boolean; // 是否为敌方卡片
}>();
</script>

<style scoped>
.battle-card {
  flex: 1;
  border: 2px solid #000;
  background-color: #fff;
  aspect-ratio: 1.5/1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 敌方卡片样式 */
.battle-card.enemy {
  border-color: #e74c3c;
  background: linear-gradient(135deg, rgba(255, 240, 240, 0.95) 0%, rgba(255, 220, 220, 0.9) 100%);
}

/* 玩家卡片样式 */
.battle-card.player {
  border-color: #3498db;
  background: linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(220, 230, 255, 0.9) 100%);
}

/* 空格子样式 */
.battle-card.empty {
  border: 2px dashed #ccc;
  background-color: rgba(255, 255, 255, 0.5);
}

/* 卡片内容容器 */
.card-content {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
}

/* 空位置内容 */
.empty-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-slot {
  width: 80%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 24px;
  color: #ccc;
  font-weight: bold;
}

/* 角落圆形徽章 */
.corner-badge {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f00;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  position: absolute;
  border: 2px solid #000;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

/* 左上角徽章 */
.corner-badge.top-left {
  left: -5px;
  top: -5px;
  background-color: #8b4513;
}

/* 左下角徽章 */
.corner-badge.bottom-left {
  left: -5px;
  bottom: -5px;
  top: auto;
  background-color: #e74c3c;
}

/* 右下角徽章 */
.corner-badge.bottom-right {
  right: -5px;
  bottom: -5px;
  top: auto;
  background-color: #27ae60;
}

/* 关键词容器 */
.keywords {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1px;
  overflow-y: auto;
  max-height: 25px;
}

/* 单个关键词标签 */
.keyword-tag {
  color: black;
  font-size: 8px;
}

/* 卡片名称 */
.card-name {
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  position: absolute;
  top: 15px;
}

/* 随从类型 */
.minion-types {
  font-size: 12px;
  text-align: center;
  color: #666;
  position: absolute;
  top: auto;
  bottom: 5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  white-space: pre-line;
  line-height: 1.2;
}
</style>
