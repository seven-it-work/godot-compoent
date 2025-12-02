<template>
  <div class="team-container">
    <div class="team-title">
      队伍阵型 ({{ deployedTeammates.length }}/{{ gameStore.team.maxTeamSize }})
    </div>

    <!-- 队伍阵型区域：3x6布局 -->
    <div class="team-formation">
      <a-row
        v-for="(row, rowIndex) in gameStore.team.positions"
        :key="rowIndex"
        class="formation-row"
      >
        <a-col
          v-for="(position, colIndex) in row"
          :key="colIndex"
          :span="4"
          class="formation-column"
        >
          <div
            class="formation-cell"
            :class="{
              occupied: position.teammateId,
              player: getTeammate(position.teammateId)?.isPlayer,
              highlighted:
                highlightMode !== null &&
                !getTeammate(position.teammateId)?.isPlayer,
              selected:
                selectedPosition &&
                selectedPosition.row === rowIndex &&
                selectedPosition.column === colIndex,
            }"
            @click="handleFormationCellClick(rowIndex, colIndex)"
          >
            <div v-if="position.teammateId" class="teammate-info">
              <div class="teammate-name">
                {{ getTeammate(position.teammateId)?.name }}
              </div>
              <div class="teammate-level">
                Lv.{{ getTeammate(position.teammateId)?.level }}
              </div>
            </div>
            <div v-else class="empty-cell">
              <span>空</span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <a-divider>可上阵队友</a-divider>

    <!-- 可上阵队友区域：水平滚动 -->
    <div class="available-teammates">
      <div
        v-for="teammate in undeployedTeammates"
        :key="teammate.id"
        class="teammate-card"
        :class="{
          selected: selectedTeammate && selectedTeammate.id === teammate.id,
        }"
        @click="handleTeammateClick(teammate)"
      >
        <div class="teammate-card-header">
          <div class="teammate-card-name">{{ teammate.name }}</div>
          <div class="teammate-card-level">Lv.{{ teammate.level }}</div>
        </div>
        <div class="teammate-card-stats">
          <span class="stat-item">攻:{{ teammate.attributes.attack }}</span>
          <span class="stat-item">防:{{ teammate.attributes.defense }}</span>
          <span class="stat-item">血:{{ teammate.attributes.health }}</span>
        </div>
        <div class="teammate-card-desc">{{ teammate.description }}</div>
        <a-button
          type="primary"
          size="small"
          block
          @click.stop="showTeammateModal(teammate)"
          >上阵</a-button
        >
      </div>
      <div v-if="undeployedTeammates.length === 0" class="no-teammates">
        所有队友已上阵
      </div>
    </div>

    <!-- 操作提示 -->
    <div class="team-hints">
      <a-alert
        message="操作说明"
        description="点击空位置可将选中队友上阵，点击已上阵队友可将其下阵，或拖动队友调整位置"
        type="info"
        showIcon
      />
    </div>

    <!-- 队友详情弹窗 -->
    <a-modal
      v-model:open="teammateModalVisible"
      :title="teammateModalTitle"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <div v-if="selectedTeammate" class="teammate-modal-content">
        <div class="teammate-modal-header">
          <div class="teammate-modal-name">{{ selectedTeammate.name }}</div>
          <div class="teammate-modal-level">
            Lv.{{ selectedTeammate.level }}
          </div>
        </div>
        <div class="teammate-modal-stats">
          <div class="stat-row">
            <span class="stat-label">攻击力:</span>
            <span class="stat-value">{{
              selectedTeammate.attributes.attack
            }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">防御力:</span>
            <span class="stat-value">{{
              selectedTeammate.attributes.defense
            }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">生命值:</span>
            <span class="stat-value">{{
              selectedTeammate.attributes.health
            }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">闪避率:</span>
            <span class="stat-value"
              >{{ selectedTeammate.attributes.dodge }}%</span
            >
          </div>
          <div class="stat-row">
            <span class="stat-label">格挡率:</span>
            <span class="stat-value"
              >{{ selectedTeammate.attributes.block }}%</span
            >
          </div>
          <div class="stat-row">
            <span class="stat-label">暴击率:</span>
            <span class="stat-value"
              >{{ selectedTeammate.attributes.critical }}%</span
            >
          </div>
        </div>
        <div class="teammate-modal-desc">
          {{ selectedTeammate.description }}
        </div>
      </div>
      <template #footer>
        <div class="modal-footer">
          <a-button @click="handleModalCancel">取消</a-button>
          <!-- 对于已上阵的队友，显示切换位置和下阵按钮 -->
          <template v-if="selectedPosition">
            <a-button type="primary" @click="handleSwap">切换位置</a-button>
            <a-button type="primary" danger @click="handleUndeploy"
              >下阵</a-button
            >
          </template>
          <!-- 对于未上阵的队友，显示上阵按钮 -->
          <template v-else>
            <a-button type="primary" @click="handleDeploy">上阵</a-button>
          </template>
        </div>
      </template>
    </a-modal>

    <!-- 操作结果提示 -->
    <!-- 消息组件将通过message函数调用，不再使用组件形式 -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useGameStore } from "../../store/gameStore";
import { message } from "ant-design-vue";
import type { Teammate } from "../../classes/character";

const gameStore = useGameStore();

// 计算属性
const deployedTeammates = computed(() => gameStore.deployedTeammates);
const undeployedTeammates = computed(() => gameStore.undeployedTeammates);

// 交互状态管理
const teammateModalVisible = ref(false);
const selectedTeammate = ref<Teammate | null>(null);
const selectedPosition = ref<{ row: number; column: number } | null>(null);
const highlightMode = ref<"swap" | "undeploy" | "deploy" | null>(null);

// 获取队友信息
const getTeammate = (teammateId: string | undefined): Teammate | undefined => {
  if (!teammateId) return undefined;
  return gameStore.team.allTeammates.find((t) => t.id === teammateId);
};

// 弹窗标题计算
const teammateModalTitle = computed(() => {
  if (highlightMode.value === "swap") return "切换位置";
  if (highlightMode.value === "undeploy") return "下阵队友";
  return "上阵队友";
});

// 显示队友弹窗
const showTeammateModal = (teammate: Teammate) => {
  selectedTeammate.value = teammate;
  teammateModalVisible.value = true;
  highlightMode.value = null;
};

// 显示已上阵队友弹窗
const showDeployedTeammateModal = (
  teammate: Teammate,
  position: { row: number; column: number }
) => {
  selectedTeammate.value = teammate;
  selectedPosition.value = position;
  teammateModalVisible.value = true;
  highlightMode.value = null;
};

// 弹窗确定按钮
const handleModalOk = () => {
  teammateModalVisible.value = false;
};

// 弹窗取消按钮
const handleModalCancel = () => {
  teammateModalVisible.value = false;
  resetInteractionState();
};

// 重置交互状态
const resetInteractionState = () => {
  selectedTeammate.value = null;
  selectedPosition.value = null;
  highlightMode.value = null;
};

// 显示操作消息
const showMessage = (type: "success" | "error" | "info", content: string) => {
  message[type](content);
};

// 上阵操作
const handleDeploy = () => {
  if (!selectedTeammate.value) return;

  if (deployedTeammates.value.length >= gameStore.team.maxTeamSize) {
    showMessage("error", "队伍已满，无法继续上阵队友");
    return;
  }

  highlightMode.value = "deploy";
  teammateModalVisible.value = false;
};

// 切换位置操作
const handleSwap = () => {
  if (!selectedTeammate.value || !selectedPosition.value) return;

  highlightMode.value = "swap";
  teammateModalVisible.value = false;
};

// 下阵操作
const handleUndeploy = () => {
  if (!selectedTeammate.value || !selectedPosition.value) return;

  const result = gameStore.undeployTeammate(selectedTeammate.value.id);
  if (result.success) {
    showMessage("success", `${selectedTeammate.value.name}已成功下阵`);
  } else {
    let errorMessage = `${selectedTeammate.value.name}下阵失败`;
    if (result.reason === "player_cannot_be_undeployed") {
      errorMessage = "玩家不能下阵";
    } else if (result.reason === "teammate_not_found") {
      errorMessage = "队友不存在或已下阵";
    }
    showMessage("error", errorMessage);
  }

  resetInteractionState();
  teammateModalVisible.value = false;
};

// 处理阵型格子点击
const handleFormationCellClick = (row: number, column: number) => {
  const position = gameStore.team.positions[row]?.[column];
  const teammate = position ? getTeammate(position.teammateId) : undefined;

  if (!position) return;

  // 如果处于高亮模式，处理相应操作
  if (highlightMode.value === "deploy" && selectedTeammate.value) {
    // 部署队友到目标位置
    const result = gameStore.deployTeammate(
      selectedTeammate.value.id,
      row,
      column
    );
    if (result.success) {
      showMessage("success", `${selectedTeammate.value.name}已成功上阵`);
    } else {
      let errorMessage = `${selectedTeammate.value.name}上阵失败`;
      if (result.reason === "invalid_position") {
        errorMessage = "无效的位置";
      } else if (result.reason === "team_full") {
        errorMessage = "队伍已满，无法继续上阵队友";
      } else if (result.reason === "teammate_not_found") {
        errorMessage = "队友不存在";
      }
      showMessage("error", errorMessage);
    }
    resetInteractionState();
  } else if (
    highlightMode.value === "swap" &&
    selectedTeammate.value &&
    selectedPosition.value
  ) {
    // 切换位置
    const sourceTeammateId = selectedTeammate.value.id;
    const targetTeammateId = position.teammateId;
    const sourceRow = selectedPosition.value.row;
    const sourceCol = selectedPosition.value.column;

    console.log("开始位置交换:", {
      sourceTeammateId,
      sourcePosition: { row: sourceRow, column: sourceCol },
      targetPosition: { row, column },
      targetTeammateId,
      isPlayer: selectedTeammate.value.isPlayer,
    });

    // 直接操作位置数据，确保玩家也能正确交换位置
    const sourcePosition = gameStore.team.positions[sourceRow][sourceCol];
    const targetPosition = gameStore.team.positions[row][column];

    if (sourcePosition && targetPosition) {
      // 保存原始位置的队友ID
      const originalSourceTeammateId = sourcePosition.teammateId;
      const originalTargetTeammateId = targetPosition.teammateId;

      console.log("交换前位置状态:", {
        sourceTeammateId: originalSourceTeammateId,
        targetTeammateId: originalTargetTeammateId,
      });

      // 清空源位置
      sourcePosition.teammateId = undefined;

      // 如果目标位置有队友，将其移动到源位置
      if (originalTargetTeammateId) {
        sourcePosition.teammateId = originalTargetTeammateId;
        console.log("将目标队友移动到源位置:", originalTargetTeammateId, "→", {
          row: sourceRow,
          column: sourceCol,
        });
      }

      // 将源队友移动到目标位置
      targetPosition.teammateId = originalSourceTeammateId;
      console.log("将源队友移动到目标位置:", originalSourceTeammateId, "→", {
        row,
        column,
      });

      showMessage("success", `${selectedTeammate.value.name}已成功切换位置`);
    } else {
      console.error("位置无效，交换失败:", {
        sourceRow,
        sourceCol,
        targetRow: row,
        targetCol: column,
      });
      showMessage("error", `${selectedTeammate.value.name}位置切换失败`);
    }

    resetInteractionState();
  } else if (teammate) {
    // 点击已有队友，显示弹窗
    showDeployedTeammateModal(teammate, { row, column });
  }
};

// 处理队友点击
const handleTeammateClick = (teammate: Teammate) => {
  showTeammateModal(teammate);
};
</script>

<style scoped>
.team-container {
  padding: 16px;
}

.team-title {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 16px;
}

.team-formation {
  margin-bottom: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 10px;
  background-color: #fafafa;
}

.formation-row {
  margin-bottom: 8px;
}

.formation-column {
  padding: 0 4px;
}

.formation-cell {
  height: 64px;
  border: 2px solid #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fff;
}

.formation-cell:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.formation-cell.occupied {
  background-color: #e6f7ff;
  border-color: #91d5ff;
}

.formation-cell.player {
  background-color: #f6ffed;
  border-color: #b7eb8f;
  box-shadow: 0 0 0 2px rgba(183, 235, 143, 0.5);
}

.formation-cell.highlighted {
  background-color: #fff2e8;
  border-color: #ff7a45;
  box-shadow: 0 0 0 2px rgba(255, 122, 69, 0.3);
  cursor: pointer;
}

.formation-cell.highlighted:hover {
  background-color: #fff7e6;
  box-shadow: 0 0 0 2px rgba(255, 122, 69, 0.5);
  transform: translateY(-2px);
}

.formation-cell.selected {
  border-color: #52c41a;
  box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.5);
}

.teammate-info {
  text-align: center;
  width: 100%;
  padding: 5px;
}

.teammate-name {
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 2px;
  color: #262626;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.teammate-level {
  font-size: 10px;
  color: #8c8c8c;
}

.empty-cell {
  color: #bfbfbf;
  font-size: 14px;
}

.available-teammates {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 10px 0;
  margin-bottom: 20px;
  scrollbar-width: thin;
  scrollbar-color: #d9d9d9 #f5f5f5;
}

.available-teammates::-webkit-scrollbar {
  height: 6px;
}

.available-teammates::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.available-teammates::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.available-teammates::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

.teammate-card {
  min-width: 180px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fff;
  flex-shrink: 0;
}

.teammate-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #1890ff;
}

.teammate-card.selected {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  background-color: #f0f8ff;
}

.teammate-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.teammate-card-name {
  font-weight: bold;
  font-size: 14px;
  color: #262626;
}

.teammate-card-level {
  font-size: 12px;
  color: #8c8c8c;
}

.teammate-card-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #595959;
}

.stat-item {
  padding: 2px 6px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.teammate-card-desc {
  font-size: 11px;
  color: #8c8c8c;
  margin-bottom: 10px;
  line-height: 1.3;
  height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.no-teammates {
  padding: 20px;
  color: #bfbfbf;
  text-align: center;
  min-width: 200px;
  flex-shrink: 0;
}

.team-hints {
  margin-top: 20px;
}

/* 弹窗样式 */
.teammate-modal-content {
  padding: 16px 0;
}

.teammate-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.teammate-modal-name {
  font-size: 18px;
  font-weight: bold;
  color: #262626;
}

.teammate-modal-level {
  font-size: 14px;
  color: #8c8c8c;
  background-color: #f5f5f5;
  padding: 2px 8px;
  border-radius: 10px;
}

.teammate-modal-stats {
  margin-bottom: 16px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-label {
  color: #595959;
}

.stat-value {
  font-weight: bold;
  color: #262626;
}

.teammate-modal-desc {
  font-size: 14px;
  color: #8c8c8c;
  line-height: 1.5;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
}
</style>
