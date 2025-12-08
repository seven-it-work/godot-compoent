<template>
  <div>
    <!-- 地点基本信息 -->
    <div>
      <div class="location-header">
        <div class="location-name">
          {{ location.name }}
        </div>
        <div class="location-type-level">
          <span>{{ location.type.name }}</span>
          <span>等级:{{ location.level.getCurrentValue() }}</span>
        </div>
      </div>
      <span class="location-description">{{ location.description }}</span>
    </div>
    <!-- 灵脉信息 -->
    <a-row :gutter="16">
      <a-col
        :span="12"
        v-for="(vein, index) in location.spiritVeins"
        :key="index"
      >
        <a-card size="small" :bordered="true" class="spirit-vein-card">
          <div class="spirit-vein-header">
            <span>{{ vein.type }}灵脉</span>
            <span>等级 {{ vein.level.getCurrentValue() }}</span>
            <span :class="{ active: vein.isActive, inactive: !vein.isActive }">
              {{ vein.isActive ? "活跃" : "不活跃" }}
            </span>
          </div>
          <div class="spirit-vein-details">
            <div class="spirit-value-container">
              <ProgressBar
                :current-value="vein.spiritValue.getCurrentValue()"
                :min-value="vein.spiritValue.minRange"
                :max-value="vein.spiritValue.maxRange"
                :show-text="false"
                :text-color="vein.isActive ? '#52c41a' : '#ff4d4f'"
              >
                <template #progress-text="{ displayText }">
                  <div class="span-container">
                    <span class="center-span">{{ displayText }}</span>
                    <span class="right-span" v-if="vein.isActive"
                      >+{{ vein.productionRate.getCurrentValue() }}</span
                    >
                  </div>
                </template>
              </ProgressBar>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Location, LocationClass, SpiritVein } from "@/v1/location";

import type { Cultivator } from "@/v1/cultivator";
import ProgressBar from "@/v1/components/ProgressBar.vue";

const props = defineProps<{
  location: Location;
  cultivator: Cultivator;
}>();
</script>

<style scoped>
/* 地点基本信息布局 */
.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.location-name {
  font-size: 16px;
  font-weight: bold;
}

.location-type-level {
  display: flex;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.active {
  color: #52c41a;
}

.inactive {
  color: #ff4d4f;
}

/* 灵脉卡片样式 */
.spirit-vein-card {
  margin-bottom: 8px !important;
  min-height: auto;
}

/* 生产速率文本样式 */
.production-rate {
  margin-left: auto;
  padding-right: 10px;
  color: #52c41a;
}

/* 进度条文本布局 */
.progress-text-content {
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
}

.spirit-vein-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 14px;
}

.spirit-vein-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

/* 灵气值进度条样式 */
.spirit-value-container {
  height: 30px;
}

.spirit-value-label {
  font-size: 12px;
  color: #666;
}

.spirit-value-progress {
  width: 100%;
  margin: 2px 0;
}

.spirit-value-text {
  font-size: 11px;
  color: #999;
  text-align: right;
}

/* 容器样式：核心优化-增加最小宽度和内边距 */
.span-container {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 20px;
  /* 左右内边距，避免span贴容器边缘 */
  box-sizing: border-box;
  /* 内边距计入宽度，防止容器总宽度超出 */
}

/* 居中的span：优化-增加最小右侧间距，避免和右侧span贴紧 */
.center-span {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #f0f8ff;
  /* 背景色方便查看范围，可删除 */
}

/* 靠右的span：优化-固定最小宽度，避免内容挤压 */
.right-span {
  margin-left: auto;
  text-align: right;
  /* 内容靠右对齐，视觉更统一 */
}
</style>
