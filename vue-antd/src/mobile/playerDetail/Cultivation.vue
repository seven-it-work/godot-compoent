<template>
  <a-layout class="mobile-player-detail" :style="{ padding: 0, margin: 0 }">
    <a-layout-content :style="{ padding: 0, margin: 0 }">
      <!-- 修炼内容区域 -->
      <div class="cultivation-content">
        <!-- 底部区域：地点属性和灵气分布 -->
        <a-row :gutter="[0, 0]" style="margin-top: 0 !important">
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
                      <div>
                        {{ currentLocation.spiritVein.name }} ({{
                          currentLocation.spiritVein.level
                        }}级)
                      </div>
                    </div>
                    <div class="vein-info" v-else>无</div>
                  </div>
                </div>

                <!-- 灵气分布 -->
                <div class="spirit-qi-distribution">
                  <div
                    class="qi-distribution-item"
                    v-for="spiritType in spiritQiTypes"
                    :key="spiritType"
                  >
                    <div class="qi-progress-container">
                      <SpiritProgress
                        :label="typeMap[spiritType]"
                        :current="
                          currentLocation.spiritQi[spiritType as SpiritRootType]
                        "
                        :max="
                          currentLocation.spiritQi[
                            `max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi
                          ]
                        "
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
                  <div
                    class="player-qi-bar-item"
                    v-for="spiritType in spiritQiTypes"
                    :key="spiritType"
                  >
                    <SpiritProgress
                      :label="getSpiritRootLabel(spiritType)"
                      :current="player.spiritQi[spiritType as SpiritRootType]"
                      :max="
                        player.spiritQi[
                          `max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi
                        ]
                      "
                      :stroke-color="colorMap[spiritType]"
                      :is-cooldown="player.isCooldown"
                      @click="
                        absorbSpiritQiWithType(spiritType as SpiritRootType)
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>

        <!-- 操作按钮 -->
        <a-row :gutter="[0, 0]" style="margin-top: 0 !important">
          <a-col :span="12">
            <a-button
              type="default"
              :disabled="!canLevelUp"
              @click="levelUp"
              block
              style="padding: 0; margin: 0"
            >
              突破境界
            </a-button>
          </a-col>
          <a-col
            :span="12"
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0;
            "
          >
            <a-checkbox
              :checked="isAutoAbsorbing"
              @change="handleAutoAbsorbChange"
              style="margin: 0"
            >
              自动吸收灵气
            </a-checkbox>
          </a-col>
        </a-row>

        <!-- 探索按钮 -->
        <a-row :gutter="[0, 0]" style="margin-top: 4px !important">
          <a-col :span="24">
            <a-button
              type="primary"
              @click="goExplore"
              block
              style="padding: 0; margin: 0"
            >
              探索
            </a-button>
          </a-col>
        </a-row>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "../../store/gameStore";
import type { SpiritRootType, SpiritQi } from "../../types/game";
import SpiritProgress from "../components/SpiritProgress.vue";

const gameStore = useGameStore();
const router = useRouter();

// 计算属性
const player = computed(() => gameStore.player);
const currentLocation = computed(() => gameStore.getCurrentLocation);
const canLevelUp = computed(() => gameStore.canLevelUp);
const isAutoAbsorbing = computed(() => gameStore.isAutoAbsorbing);

// 处理自动吸收状态变化
const handleAutoAbsorbChange = (e: any) => {
  if (e.target.checked) {
    gameStore.startAutoAbsorb();
  } else {
    gameStore.stopAutoAbsorb();
  }
};

// 获取灵根标签（包含等级信息）
const getSpiritRootLabel = (spiritType: string) => {
  const root = player.value.spiritRoots.find((r) => r.type === spiritType);
  return `${root?.name} lv${root?.level}`;
};

// 灵气类型映射
const spiritQiTypes = ref<SpiritRootType[]>([
  "gold",
  "wood",
  "water",
  "fire",
  "earth",
]);
const typeMap = ref<Record<SpiritRootType, string>>({
  gold: "金",
  wood: "木",
  water: "水",
  fire: "火",
  earth: "土",
});
const colorMap = ref<Record<SpiritRootType, string>>({
  gold: "#ffd700",
  wood: "#90ee90",
  water: "#87ceeb",
  fire: "#ff6347",
  earth: "#deb887",
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

// 探索
const goExplore = () => {
  console.log("goExplore");
  router.push("/mobile/explore");
};
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

.exp-bar-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
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

/* 玩家灵气区域 */
.player-qi-card {
  height: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

/* 自定义卡片样式 */
.avatar-card,
.location-card,
.player-qi-card {
  margin: 0 !important;
  padding: 0 !important;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}

/* 移除所有卡片内部padding和margin */
.avatar-card > *,
.location-card > *,
.player-qi-card > * {
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

.cultivation-content {
  margin-top: 4px;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .mobile-player-detail {
    padding: 6px;
  }

  .avatar-card,
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
