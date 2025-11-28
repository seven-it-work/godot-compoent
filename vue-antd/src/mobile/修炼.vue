<template>
  <a-layout class="mobile-cultivation">
    <!-- 顶部区域：头像和属性 -->
    <a-layout-content>
      <a-row :gutter="[8, 8]">
        <!-- 头像区域 -->
        <a-col :span="6">
          <a-card class="avatar-card" :bordered="true">
            <div class="avatar-container">
              <div class="avatar">
                <div class="avatar-placeholder">修</div>
              </div>
              <div class="player-name">{{ player.name }}</div>
            </div>
          </a-card>
        </a-col>
        <!-- 属性区域 -->
        <a-col :span="18">
          <a-card class="attributes-card" :bordered="true" title="基础属性">
            <div class="attributes-content">
              <a-row :gutter="[8, 8]">
                <a-col :span="12" v-for="(attr, index) in attributesList" :key="index">
                  <div class="attribute-item">
                    <span class="attribute-label">{{ attr.label }}</span>
                    <span class="attribute-value">{{ attr.value }}</span>
                  </div>
                </a-col>
              </a-row>
              <div class="exp-bar-container">
                <div class="exp-label">等级: {{ player.level }}</div>
                <a-progress :percent="(player.exp / player.maxExp) * 100" :show-info="false" size="small" />
                <div class="exp-text">{{ player.exp }}/{{ player.maxExp }} 经验</div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- 底部区域：地点属性和灵气分布 -->
      <a-row :gutter="[8, 8]" style="margin-top: 8px;">
        <!-- 地点区域 -->
        <a-col :span="12">
          <a-card class="location-card" :bordered="true" title="所在地点">
            <div class="location-content">
              <div class="location-name">{{ currentLocation.name }}</div>
              <div class="location-info">
                <template v-if="currentLocation.spiritVein">
                  <div class="vein-info">
                    <span class="info-label">灵脉:</span>
                    <span class="info-value">{{ currentLocation.spiritVein.name }} ({{ currentLocation.spiritVein.level }}级)</span>
                  </div>
                </template>
                <template v-if="currentLocation.monster">
                  <div class="monster-info">
                    <span class="info-label">怪物:</span>
                    <span class="info-value">{{ currentLocation.monster.name }} ({{ currentLocation.monster.level }}级)</span>
                  </div>
                </template>
              </div>
              <div class="spirit-qi-section">
                <div class="section-subtitle">灵气分布</div>
                <div class="spirit-qi-bars">
                  <div class="spirit-qi-bar-item" v-for="spiritType in spiritQiTypes" :key="spiritType">
                    <div class="spirit-qi-label">{{ typeMap[spiritType] }}</div>
                    <div class="spirit-qi-bar-container">
                      <a-progress 
                        :percent="(currentLocation.spiritQi[spiritType as SpiritRootType] / currentLocation.spiritQi[`max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi]) * 100" 
                        :show-info="false" 
                        size="small" 
                        :stroke-color="colorMap[spiritType]"
                      />
                    </div>
                    <div class="spirit-qi-value">
                      {{ currentLocation.spiritQi[spiritType as SpiritRootType] }}/{{ currentLocation.spiritQi[`max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
        <!-- 玩家灵气区域 -->
        <a-col :span="12">
          <a-card class="player-qi-card" :bordered="true" title="玩家灵气">
            <div class="player-qi-content">
              <div class="player-qi-bars">
                <div class="player-qi-bar-item" v-for="spiritType in spiritQiTypes" :key="spiritType">
                  <div class="player-qi-label">
                    <span class="element-icon" :style="{ backgroundColor: colorMap[spiritType] }">{{ typeMap[spiritType] }}</span>
                    <span class="type-name">{{ typeMap[spiritType] }}</span>
                  </div>
                  <div class="player-qi-bar-wrapper">
                    <div class="player-qi-bar">
                      <div 
                        class="player-qi-bar-fill" 
                        :style="{
                          width: `${(player.spiritQi[spiritType as SpiritRootType] / player.spiritQi[`max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi]) * 100}%`,
                          backgroundColor: colorMap[spiritType]
                        }"
                      ></div>
                    </div>
                    <div class="player-qi-value">
                      {{ player.spiritQi[spiritType as SpiritRootType] }}/{{ player.spiritQi[`max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi] }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="spirit-root-overview">
                <div class="section-subtitle">灵根概览</div>
                <a-row type="flex" justify="space-around">
                  <a-col v-for="root in player.spiritRoots" :key="root.type">
                    <div class="root-level-item">
                      <div class="root-level-icon" :style="{ backgroundColor: colorMap[root.type] }">
                        {{ typeMap[root.type] }}
                      </div>
                      <div class="root-level-info">
                        <div class="root-level-label">{{ root.name }}</div>
                        <div class="root-level-value">{{ root.level }}级</div>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- 操作按钮 -->
      <a-row :gutter="[8, 8]" style="margin-top: 8px;">
        <a-col :span="12">
          <a-button type="primary" :loading="player.isCooldown" @click="absorbSpiritQi" block>
            {{ player.isCooldown ? `吸收中(${player.cooldownRemaining/1000}s)` : '吸收灵气' }}
          </a-button>
        </a-col>
        <a-col :span="12">
          <a-button type="default" :disabled="!canLevelUp" @click="levelUp" block>
            突破境界
          </a-button>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '../store/gameStore';
import type { SpiritRootType, SpiritQi } from '../types/game';

const gameStore = useGameStore();

// 计算属性
const player = computed(() => gameStore.player);
const currentLocation = computed(() => gameStore.getCurrentLocation);
const canLevelUp = computed(() => gameStore.canLevelUp);

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

// 选中的灵气类型
const selectedSpiritType = ref<SpiritRootType>('gold');

// 吸收灵气
const absorbSpiritQi = () => {
  if (gameStore.player.isCooldown) return;
  gameStore.absorbSpiritQi(selectedSpiritType.value);
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
  padding: 8px;
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
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
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
  gap: 10px;
  flex: 1;
}

.attribute-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background-color: #fafafa;
  border-radius: 4px;
  font-size: 12px;
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
  gap: 4px;
  margin-top: 8px;
}

.exp-label {
  font-size: 12px;
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
}

.location-card .ant-card-head {
  padding: 0 12px;
  min-height: 32px;
}

.location-card .ant-card-head-title {
  font-size: 14px;
  padding: 8px 0;
}

.location-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;
}

.location-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.location-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
  font-weight: bold;
}

.spirit-qi-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-subtitle {
  font-size: 12px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.spirit-qi-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.spirit-qi-bar-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.spirit-qi-label {
  font-size: 11px;
  color: #666;
}

.spirit-qi-bar-container {
  flex: 1;
  min-height: 12px;
}

.spirit-qi-value {
  font-size: 10px;
  color: #999;
  text-align: right;
}

/* 玩家灵气区域 */
.player-qi-card {
  height: 100%;
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
  gap: 10px;
  flex: 1;
}

.player-qi-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
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
    margin-bottom: 6px;
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