<template>
    <div class="team-container">
        <div class="team-title">队伍阵型 ({{ deployedTeammates.length }}/{{ gameStore.team.maxTeamSize }})</div>
        
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
                            'occupied': position.teammateId,
                            'player': getTeammate(position.teammateId)?.isPlayer
                        }"
                        @click="handleFormationCellClick(rowIndex, colIndex)"
                    >
                        <div v-if="position.teammateId" class="teammate-info">
                            <div class="teammate-name">{{ getTeammate(position.teammateId)?.name }}</div>
                            <div class="teammate-level">Lv.{{ getTeammate(position.teammateId)?.level }}</div>
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
                @click="handleTeammateClick(teammate.id)"
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
                <a-button type="primary" size="small" block>上阵</a-button>
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
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../../store/gameStore';
import type { Teammate } from '../../classes/character';

const gameStore = useGameStore();

// 计算属性
const deployedTeammates = computed(() => gameStore.deployedTeammates);
const undeployedTeammates = computed(() => gameStore.undeployedTeammates);

// 临时选中的队友ID
let selectedTeammateId: string | null = null;

// 获取队友信息
const getTeammate = (teammateId: string | undefined): Teammate | undefined => {
    if (!teammateId) return undefined;
    return gameStore.team.allTeammates.find(t => t.id === teammateId);
};

// 处理阵型格子点击
const handleFormationCellClick = (row: number, column: number) => {
    const position = gameStore.team.positions[row]?.[column];
    
    if (position) {
        if (position.teammateId) {
            // 如果格子已有队友，将其下阵
            gameStore.undeployTeammate(position.teammateId);
        } else if (selectedTeammateId) {
            // 如果有选中的队友，将其部署到该位置
            gameStore.deployTeammate(selectedTeammateId, row, column);
            selectedTeammateId = null; // 清除选择
        }
    }
};

// 处理队友点击
const handleTeammateClick = (teammateId: string) => {
    selectedTeammateId = teammateId;
};
</script>

<style scoped>
.team-container {
}

.team-title {
    font-size: 16px;
    font-weight: bold;
    color: #1890ff;
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
}

.teammate-card {
    min-width: 180px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.3s;
    background-color: #fff;
}

.teammate-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: #1890ff;
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
}

.team-hints {
    margin-top: 20px;
}
</style>