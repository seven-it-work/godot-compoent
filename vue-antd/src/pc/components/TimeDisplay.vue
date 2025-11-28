<template>
  <div class="time-display">
    <a-card title="游戏时间" class="time-card">
      <div class="time-content">
        <!-- 时间显示 -->
        <div class="current-time">
          <span class="time-label">当前时间：</span>
          <span class="time-value">{{ formattedTime }}</span>
        </div>

        <!-- 时间控制 -->
        <div class="time-controls">
          <span class="control-label">时间流速：</span>
          <a-button-group>
            <a-button
              :type="gameTime.isPaused ? 'primary' : 'default'"
              @click="togglePause"
            >
              {{ gameTime.isPaused ? "继续" : "暂停" }}
            </a-button>
            <a-button
              :type="gameTime.speed === 1 ? 'primary' : 'default'"
              @click="setSpeed(1)"
            >
              1x
            </a-button>
            <a-button
              :type="gameTime.speed === 2 ? 'primary' : 'default'"
              @click="setSpeed(2)"
            >
              2x
            </a-button>
            <a-button
              :type="gameTime.speed === 4 ? 'primary' : 'default'"
              @click="setSpeed(4)"
            >
              4x
            </a-button>
          </a-button-group>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "../../store/gameStore";

const gameStore = useGameStore();

// 获取游戏时间和格式化时间
const gameTime = computed(() => gameStore.gameTime);
const formattedTime = computed(() => gameStore.formattedTime);

// 切换暂停/继续
const togglePause = () => {
  if (gameTime.value.isPaused) {
    gameStore.resumeTimeFlow();
  } else {
    gameStore.pauseTimeFlow();
  }
};

// 设置时间流速
const setSpeed = (speed: number) => {
  gameStore.setTimeSpeed(speed);
};
</script>

<style scoped>
.time-display {
  margin-bottom: 20px;
}

.time-card {
  text-align: center;
}

.time-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.current-time {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 10px;
  text-align: center;
}

.time-label {
  color: #666;
  margin-right: 10px;
}

.time-value {
  color: #1890ff;
}

.time-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.control-label {
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .time-content {
    gap: 10px;
  }

  .current-time {
    font-size: 16px;
  }

  .time-controls {
    flex-direction: column;
    gap: 10px;
  }

  .control-label {
    margin-right: 0;
  }

  :deep(.ant-btn-group) {
    width: 100%;
  }

  :deep(.ant-btn-group .ant-btn) {
    flex: 1;
  }
}
</style>
