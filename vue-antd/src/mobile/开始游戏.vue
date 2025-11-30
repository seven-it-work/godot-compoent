<template>
  <div class="start-game-container">
    <!-- 游戏标题 -->
    <div class="game-title">
      <h1>修仙文字游戏</h1>
      <p class="subtitle">踏上你的修仙之路</p>
    </div>

    <!-- 开始游戏按钮 -->
    <div class="start-buttons">
      <a-button type="primary" size="large" @click="startNewGame" class="start-btn">
        开始新游戏
      </a-button>
      <a-button size="large" @click="continueGame" class="continue-btn">
        继续游戏
      </a-button>
    </div>

    <!-- 游戏设置 -->
    <div class="game-settings">
      <a-button type="text" size="small" @click="showSettings">
        游戏设置
      </a-button>
      <a-button type="text" size="small" @click="showAbout">
        关于游戏
      </a-button>
    </div>

    <!-- 设置弹窗 -->
    <a-modal v-model:open="showSettingsModal" title="游戏设置" footer="null">
      <div class="settings-content">
        <div class="setting-item">
          <span>音效开关</span>
          <a-switch default-checked></a-switch>
        </div>
        <div class="setting-item">
          <span>音乐开关</span>
          <a-switch default-checked></a-switch>
        </div>
        <div class="setting-item">
          <span>文字速度</span>
          <a-slider :min="1" :max="5" :default-value="3"></a-slider>
        </div>
      </div>
    </a-modal>

    <!-- 关于弹窗 -->
    <a-modal v-model:open="showAboutModal" title="关于游戏" footer="null">
      <div class="about-content">
        <p>修仙文字游戏 v1.0.0</p>
        <p>一款基于Vue 3 + Ant Design Vue开发的修仙题材文字游戏</p>
        <p>踏上修仙之路，探索未知世界，修炼强大功法，成为一代宗师</p>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../store/gameStore';

const router = useRouter();
const gameStore = useGameStore();

// 弹窗状态
const showSettingsModal = ref(false);
const showAboutModal = ref(false);

// 开始新游戏
const startNewGame = () => {
  // 重置玩家信息
  gameStore.resetPlayer();
  // 生成新地图
  gameStore.generateMap();
  // 跳转到修炼页面
  router.push('/mobile/training');
};

// 继续游戏
const continueGame = () => {
  // 检查是否有存档
  // 如果没有存档，跳转到开始新游戏
  // 否则，继续游戏
  router.push('/mobile/training');
};

// 显示设置
const showSettings = () => {
  showSettingsModal.value = true;
};

// 显示关于
const showAbout = () => {
  showAboutModal.value = true;
};
</script>

<style scoped>
.start-game-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  box-sizing: border-box;
}

.game-title {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.game-title h1 {
  font-size: 36px;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

.start-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 300px;
  margin-bottom: 40px;
}

.start-btn,
.continue-btn {
  height: 50px;
  font-size: 18px;
  border-radius: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.game-settings {
  display: flex;
  gap: 20px;
}

.game-settings .ant-btn {
  color: white;
  opacity: 0.8;
}

.game-settings .ant-btn:hover {
  opacity: 1;
  color: white;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.about-content {
  text-align: center;
  line-height: 1.6;
}
</style>