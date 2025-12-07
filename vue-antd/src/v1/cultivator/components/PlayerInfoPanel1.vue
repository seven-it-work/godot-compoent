<template>
  <div class="player-info-panel-1">
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
      <div class="element-section">
        <div
          v-for="element in SPIRIT_ROOT_TYPES"
          :key="element"
          class="element-item"
        >
          <div class="element-progress">
            <ProgressBar
              :current-value="getElementValue(element)"
              :min-value="0"
              :max-value="100"
              color-type="single"
              :single-color="getElementColor(element)"
              text-color="#000"
            >
              <template #progress-text="{ displayText }">
                {{ element }}：{{ displayText }}
              </template>
            </ProgressBar>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 水平菜单 -->
  <div class="horizontal-menu">
    <div class="menu-item">个人属性</div>
    <div class="menu-item">技能</div>
    <div class="menu-item">装备</div>
    <div class="menu-item">背包</div>
    <div class="menu-item">任务</div>
  </div>
</template>

<script setup lang="ts">
import { CultivatorClass } from "../impl";
import { BasicRangeGrowthAttribute } from "@/v1/growthAttribute/impl";
import ProgressBar from "@/v1/components/ProgressBar.vue";
import {
  SPIRIT_ROOT_TYPES,
  SPIRIT_ROOT_COLORS,
  type SpiritRootType,
} from "@/v1/spiritRoot/define";

// 获取五行元素值
// eslint-disable-next-line no-unused-vars
const getElementValue = (_element: SpiritRootType): number => {
  // 这里需要根据实际数据结构调整，暂时返回模拟值
  return 50;
};

// 获取五行元素颜色
const getElementColor = (element: SpiritRootType): string => {
  return SPIRIT_ROOT_COLORS[element] || "#1890ff";
};

defineProps<{
  cultivator: CultivatorClass;
}>();
</script>

<style scoped>
.player-info-panel-1 {
  display: flex;
  border: 2px solid #000;
  background-color: #fff;
  overflow: hidden;
  width: 100%;
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

/* 五行属性 */
.element-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
  border: 2px solid #000;
  background-color: #fff;
}

.element-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.element-label {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #000;
}

.element-progress {
  height: 30px;
  border: 1px solid #000;
  overflow: hidden;
}

/* 水平菜单 */
.horizontal-menu {
  display: flex;
  width: 100%;
  border: 2px solid #000;
  background-color: #fff;
  margin-top: 10px;
  overflow: hidden;
}

.menu-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-right: 2px solid #000;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:last-child {
  border-right: none;
}

.menu-item:hover {
  background-color: #f0f0f0;
}

.menu-item:active {
  background-color: #e0e0e0;
}
</style>
