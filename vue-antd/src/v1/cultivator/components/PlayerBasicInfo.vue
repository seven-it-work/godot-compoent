<!-- 
玩家基本信息组件
展示玩家的基本信息，包括头像、姓名、境界、气血和灵力 
-->

<template>
  <div class="player-basic-info">
    <!-- 左侧头像区域 -->
    <div class="avatar-section">
      <div class="avatar-container">
        <a-image
          src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
        />
      </div>
    </div>

    <!-- 右侧信息区域 -->
    <div class="info-section">
      <!-- 姓名和境界 -->
      <div class="name-realm">
        <div class="name">{{ cultivator.name }}</div>
        <div class="realm">{{ cultivator.getCultivationLevelName() }}</div>
      </div>

      <!-- 气血和灵力 -->
      <div class="vitality-section">
        <div class="vitality-item">
          <div class="vitality-progress">
            <ProgressBar
              :current-value="
                (
                  cultivator.qiBlood as BasicRangeGrowthAttribute
                ).getCurrentValue()
              "
              :min-value="
                (cultivator.qiBlood as BasicRangeGrowthAttribute).minRange
              "
              :max-value="
                (cultivator.qiBlood as BasicRangeGrowthAttribute).maxRange
              "
              color-type="single"
              single-color="#ff4d4f"
              text-color="#000"
            >
              <template #progress-text="{ displayText }">
                气血：{{ displayText }}
              </template>
            </ProgressBar>
          </div>
        </div>
        <div class="vitality-item">
          <div class="vitality-progress">
            <ProgressBar
              :current-value="
                (
                  cultivator.spiritPower as BasicRangeGrowthAttribute
                ).getCurrentValue()
              "
              :min-value="
                (cultivator.spiritPower as BasicRangeGrowthAttribute).minRange
              "
              :max-value="
                (cultivator.spiritPower as BasicRangeGrowthAttribute).maxRange
              "
              color-type="single"
              single-color="#1890ff"
              text-color="#000"
            >
              <template #progress-text="{ displayText }">
                灵力：{{ displayText }}
              </template>
            </ProgressBar>
          </div>
        </div>
      </div>

      <!-- 五行属性 -->
      <SpiritRootPanel :cultivator="cultivator" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CultivatorClass } from "../impl";
import { BasicRangeGrowthAttribute } from "@/v1/growthAttribute/impl";
import ProgressBar from "@/v1/components/ProgressBar.vue";
import SpiritRootPanel from "./SpiritRootPanel.vue";

defineProps<{
  cultivator: CultivatorClass;
}>();
</script>

<style scoped>
.player-basic-info {
  display: flex;
  border: 2px solid #000;
  background-color: #fff;
  overflow: hidden;
  width: auto;
  height: auto;
}

/* 左侧头像区域 */
.avatar-section {
  width: 150px;
  border-right: 2px solid #000;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* 右侧信息区域 */
.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
}

/* 姓名和境界 */
.name-realm {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  border: 2px solid #000;
  background-color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.name {
  color: #000;
}

.realm {
  color: #000;
}

/* 气血和灵力 */
.vitality-section {
  display: flex;
  gap: 10px;
  padding: 5px;
  border: 2px solid #000;
  background-color: #fff;
}

.vitality-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.vitality-label {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #000;
}

.vitality-progress {
  height: 20px;
  border: 1px solid #000;
  overflow: hidden;
}
</style>
