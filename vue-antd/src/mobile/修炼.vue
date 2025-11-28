<template>
    <a-layout class="mobile-cultivation" :style="{ padding: 0, margin: 0 }">
      <!-- 顶部区域：头像和属性 -->
      <a-layout-content :style="{ padding: 0, margin: 0 }">
        <a-row :gutter="[4, 4]">
          <!-- 头像区域 -->
      <a-col :span="6">
      <div class="avatar-card">
        <div class="avatar-container">
          <div class="avatar">
            <div class="avatar-placeholder">修</div>
          </div>
          <div class="player-name">{{ player.name }}</div>
        </div>
      </div>
    </a-col>
          <!-- 属性区域 -->
      <a-col :span="18">
      <div class="attributes-card">
        <div class="card-title">基础属性</div>
        <div class="attributes-content">
          <a-row :gutter="[4, 4]">
            <a-col :span="12" v-for="(attr, index) in attributesList" :key="index">
              <div class="attribute-item">
                <span class="attribute-label">{{ attr.label }}</span>
                <span class="attribute-value">{{ attr.value }}</span>
              </div>
            </a-col>
          </a-row>
          <div class="exp-bar-container">
            <ExpLevelProgress 
              label="等级" 
              :level="player.level" 
              :current="player.exp" 
              :max="player.maxExp" 
              strokeColor="#52c41a" 
              height="24px" 
            />
          </div>
        </div>
      </div>
    </a-col>
      </a-row>

      <!-- 底部区域：地点属性和灵气分布 -->
       <a-row :gutter="[0, 0]" style="margin-top: 0 !important;">
        <!-- 地点区域 -->
        <a-col :span="12">
          <div class="location-card">
            <div class="location-table">
              <!-- 顶部信息行 -->
              <div class="location-info-row">
                <div class="location-cell location-name-cell">
                  <div class="location-name">{{ currentLocation.name }}</div>
                </div>
                <div class="location-cell vein-info-cell">
                  <div class="vein-info" v-if="currentLocation.spiritVein">
                    <div>{{ currentLocation.spiritVein.name }} ({{ currentLocation.spiritVein.level }}级)</div>
                  </div>
                  <div class="vein-info" v-else>无</div>
                </div>
              </div>
              
              <!-- 灵气分布 -->
              <div class="spirit-qi-distribution">
                <div class="qi-distribution-item" v-for="spiritType in spiritQiTypes" :key="spiritType">
                  <div class="qi-progress-container">
                    <SpiritProgress
                        :label="typeMap[spiritType]"
                        :current="currentLocation.spiritQi[spiritType as SpiritRootType]"
                        :max="currentLocation.spiritQi[`max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi]"
                        :stroke-color="colorMap[spiritType]"
                        :is-cooldown="player.isCooldown"
                        :height="'24px'"
                        :hide-label="false"
                        @click="absorbSpiritQiWithType(spiritType)"
                      />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
        <!-- 玩家灵气区域 -->
        <a-col :span="12">
          <div class="player-qi-card">
            <div class="card-title">玩家灵气</div>
            <div class="player-qi-content">
              <div class="player-qi-bars">
                <div class="player-qi-bar-item" v-for="spiritType in spiritQiTypes" :key="spiritType">
                  <SpiritProgress
                    :label="getSpiritRootLabel(spiritType)"
                    :current="player.spiritQi[spiritType as SpiritRootType]"
                    :max="player.spiritQi[`max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi]"
                    :stroke-color="colorMap[spiritType]"
                    :is-cooldown="player.isCooldown"
                    @click="absorbSpiritQiWithType(spiritType as SpiritRootType)"
                  />
                </div>
              </div>

            </div>
          </div>
        </a-col>
      </a-row>

      <!-- 操作按钮 -->
       <a-row :gutter="[0, 0]" style="margin-top: 0 !important;">
        <a-col :span="12">
          <a-button type="default" :disabled="!canLevelUp" @click="levelUp" block style="padding: 0; margin: 0;">
            突破境界
          </a-button>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: center; padding: 0;">
          <a-checkbox v-model:checked="isAutoAbsorbing" @change="handleAutoAbsorbChange" style="margin: 0;">
            自动吸收灵气
          </a-checkbox>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '../store/gameStore';
import type { SpiritRootType, SpiritQi } from '../types/game';
import SpiritProgress from './components/SpiritProgress.vue';
import ExpLevelProgress from './components/ExpLevelProgress.vue';

const gameStore = useGameStore();

// 计算属性
const player = computed(() => gameStore.player);
const currentLocation = computed(() => gameStore.getCurrentLocation);
const canLevelUp = computed(() => gameStore.canLevelUp);

// 自动吸收状态
const isAutoAbsorbing = ref(false);
let autoAbsorbTimer: number | null = null;

// 检查是否可以吸收特定类型的灵气
const canAbsorbSpiritQi = (spiritType: SpiritRootType): boolean => {
  const root = player.value.spiritRoots.find(r => r.type === spiritType);
  if (!root) return false;
  
  const playerMaxQi = player.value.spiritQi[
    `max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi
  ] as number;
  
  const playerAvailableSpace = playerMaxQi - player.value.spiritQi[spiritType];
  const availableQi = currentLocation.value.spiritQi[spiritType];
  
  return playerAvailableSpace > 0 && availableQi > 0;
};

// 尝试自动吸收灵气
const tryAutoAbsorb = () => {
  // 检查是否在冷却中
  if (player.value.isCooldown) return;
  
  // 尝试所有灵气类型
  for (const spiritType of spiritQiTypes.value) {
    if (canAbsorbSpiritQi(spiritType)) {
      absorbSpiritQiWithType(spiritType);
      return true;
    }
  }
  
  // 如果所有灵气都吸收不了，关闭自动吸收
  isAutoAbsorbing.value = false;
  return false;
};

// 处理自动吸收状态变化
const handleAutoAbsorbChange = () => {
  if (isAutoAbsorbing.value) {
    // 立即尝试一次吸收
    tryAutoAbsorb();
    
    // 设置定时器，定期尝试吸收
    autoAbsorbTimer = window.setInterval(() => {
      if (!isAutoAbsorbing.value) {
        clearInterval(autoAbsorbTimer!);
        autoAbsorbTimer = null;
        return;
      }
      
      tryAutoAbsorb();
    }, 100); // 频繁检查，确保冷却结束后立即吸收
  } else {
    // 清除定时器
    if (autoAbsorbTimer) {
      clearInterval(autoAbsorbTimer);
      autoAbsorbTimer = null;
    }
  }
};

// 组件销毁时清除定时器
import { onBeforeUnmount } from 'vue';
onBeforeUnmount(() => {
  if (autoAbsorbTimer) {
    clearInterval(autoAbsorbTimer);
    autoAbsorbTimer = null;
  }
});

// 获取灵根标签（包含等级信息）
const getSpiritRootLabel = (spiritType: string) => {
  const root = player.value.spiritRoots.find(r => r.type === spiritType);
  return `${root?.name} lv${root?.level}`;
};

// 属性列表，用于在网格中展示
const attributesList = computed(() => [
  { label: '攻击', value: player.value.attributes.attack },
  { label: '防御', value: player.value.attributes.defense },
  { label: '生命', value: `${player.value.attributes.health}/${player.value.attributes.maxHealth}` },
  { label: '闪避', value: player.value.attributes.dodge },
  { label: '格挡', value: player.value.attributes.block },
  { label: '暴击', value: player.value.attributes.critical }
]);

// 灵气类型映射
const spiritQiTypes = ref<SpiritRootType[]>(['gold', 'wood', 'water', 'fire', 'earth']);
const typeMap = ref<Record<SpiritRootType, string>>({
  gold: '金',
  wood: '木',
  water: '水',
  fire: '火',
  earth: '土'
});
const colorMap = ref<Record<SpiritRootType, string>>({
  gold: '#ffd700',
  wood: '#90ee90',
  water: '#87ceeb',
  fire: '#ff6347',
  earth: '#deb887'
});



// 按类型吸收灵气
const absorbSpiritQiWithType = (spiritType: SpiritRootType) => {
  if (gameStore.player.isCooldown) return;
  gameStore.absorbSpiritQi(spiritType);
};



// 升级
const levelUp = () => {
  if (gameStore.canLevelUp) {
    gameStore.levelUp();
  }
};
</script>

<style scoped>
.mobile-cultivation {
  width: 100%;
  height: 100vh;
  padding: 0 !important;
  margin: 0 !important;
  box-sizing: border-box;
  background-color: #f0f2f5;
  overflow-y: auto;
}

/* 头像区域 */
.avatar-card {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 !important;
  padding: 0 !important;
}

.avatar-card .ant-card-body {
  padding: 0 !important;
  margin: 0 !important;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  border: 2px solid #d9d9d9;
}

.avatar-placeholder {
  font-size: 24px;
  color: #666;
  font-weight: bold;
}

.player-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* 属性区域 */
.attributes-card {
  height: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

.attributes-card .ant-card-body {
  padding: 0 !important;
  margin: 0 !important;
}

.attributes-card .ant-card-head {
  padding: 0 12px;
  min-height: 32px;
}

.attributes-card .ant-card-head-title {
  font-size: 14px;
  padding: 8px 0;
}

.attributes-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.attribute-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 6px;
  background-color: #fafafa;
  border-radius: 4px;
  font-size: 11px;
}

.attribute-label {
  color: #666;
}

.attribute-value {
  color: #333;
  font-weight: bold;
}

.exp-bar-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.exp-label {
  font-size: 11px;
  font-weight: bold;
  color: #333;
}

.exp-text {
  font-size: 10px;
  color: #666;
  text-align: right;
}

/* 地点区域 */
.location-card {
  height: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

.location-card .ant-card-body {
  padding: 0 !important;
  margin: 0 !important;
}

.location-table {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.location-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 !important;
  margin: 0 !important;
  border-bottom: 1px solid #f0f0f0;
}

.location-name-cell {
  flex: 1;
}

.location-name {
  font-size: 12px;
  font-weight: bold;
  color: #333;
}

.vein-info-cell {
  flex: 1;
  text-align: right;
}

.vein-info {
  font-size: 10px;
  color: #666;
}

.spirit-qi-distribution {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.qi-distribution-item {
  display: flex;
  align-items: center;
  height: 24px;
}

.qi-progress-container {
  flex: 1;
  height: 24px;
}

.section-subtitle {
  font-size: 11px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.spirit-qi-bars {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.spirit-qi-bar-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.absorbable:hover {
  transform: scale(1.02);
  transition: all 0.2s ease;
}

/* 灵气标签已整合到progress内部，不再需要单独样式 */

.spirit-qi-bar-container {
  width: 100%;
  padding: 0 1px;
  margin-bottom: 2px;
  border-radius: 4px;
  overflow: hidden;
}

.spirit-qi-value {
  font-size: 10px;
  color: #999;
  text-align: right;
}

/* 玩家灵气区域 */
.player-qi-card {
  height: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

/* 自定义卡片样式 */
.avatar-card, .attributes-card, .location-card, .player-qi-card {
  margin: 0 !important;
  padding: 0 !important;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}

/* 移除所有卡片内部padding和margin */
.avatar-card > *, .attributes-card > *, .location-card > *, .player-qi-card > * {
  margin: 0 !important;
  padding: 0 !important;
}

.player-qi-card .ant-card-head {
  padding: 0 12px;
  min-height: 32px;
}

.player-qi-card .ant-card-head-title {
  font-size: 14px;
  padding: 8px 0;
}

.player-qi-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.player-qi-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.player-qi-bar-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.player-qi-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #333;
}

.element-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  font-weight: bold;
}

.type-name {
  font-weight: bold;
}

.player-qi-bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.player-qi-bar {
  height: 12px;
  background-color: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.player-qi-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.player-qi-value {
  font-size: 10px;
  color: #999;
  text-align: right;
}

/* 灵根概览 */
.spirit-root-overview {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 4px;
}

.root-level-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.root-level-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  font-weight: bold;
}

.root-level-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.root-level-label {
  font-size: 10px;
  color: #333;
  font-weight: bold;
}

.root-level-value {
  font-size: 10px;
  color: #666;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 8px;
  padding: 8px 0;
}

.action-buttons .ant-btn {
  flex: 1;
  font-size: 14px;
  padding: 8px 0;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .mobile-cultivation {
    padding: 6px;
  }

  .avatar-card,
  .attributes-card,
  .location-card,
  .player-qi-card {
    margin: 0 !important;
    padding: 0 !important;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  .avatar-placeholder {
    font-size: 18px;
  }
}
</style>