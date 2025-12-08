<template>
  <div class="animation-frame-player">
    <div class="player-container" @click="togglePlay">
      <img
        v-if="currentImage"
        :src="currentImage"
        :alt="`Frame ${currentIndex}`"
        class="frame-image"
      />
      <div v-else class="placeholder">
        <span>{{ isLoading ? "Loading..." : "No image available" }}</span>
      </div>

      <div class="controls-overlay" v-if="showControls">
        <button class="control-btn" @click.stop="playPause">
          {{ isPlaying ? "⏸️" : "▶️" }}
        </button>
        <button class="control-btn" @click.stop="reset">🔄</button>
      </div>
    </div>

    <div class="progress-bar" v-if="images.length > 0">
      <div
        class="progress-fill"
        :style="{ width: progressPercentage + '%' }"
      ></div>
    </div>

    <div class="frame-info" v-if="images.length > 0">
      Frame: {{ currentIndex + 1 }} / {{ images.length }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from "vue";

// 定义组件属性
interface Props {
  // 图片URL数组
  images: string[];
  // 帧率（每秒帧数）
  fps?: number;
  // 是否自动播放
  autoplay?: boolean;
  // 是否显示控制按钮
  showControls?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  fps: 30,
  autoplay: false,
  showControls: true,
});

// 当前索引
const currentIndex = ref(0);

// 是否正在播放
const isPlaying = ref(false);

// 是否加载中
const isLoading = ref(false);

// 定时器引用
let timer: number | null = null;

// 计算当前图片URL
const currentImage = computed(() => {
  if (props.images.length === 0) return null;
  return props.images[currentIndex.value];
});

// 计算进度百分比
const progressPercentage = computed(() => {
  if (props.images.length === 0) return 0;
  return ((currentIndex.value + 1) / props.images.length) * 100;
});

// 播放/暂停
const playPause = () => {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
};

// 播放动画
const play = () => {
  if (props.images.length <= 1) return;

  isPlaying.value = true;
  const interval = 1000 / props.fps;

  if (timer) {
    clearInterval(timer);
  }

  timer = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.images.length;
  }, interval);
};

// 暂停动画
const pause = () => {
  isPlaying.value = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

// 重置动画
const reset = () => {
  pause();
  currentIndex.value = 0;
};

// 切换播放状态
const togglePlay = () => {
  if (props.images.length <= 1) return;
  playPause();
};

// 监听images变化
watch(
  () => props.images,
  (newImages) => {
    if (newImages.length === 0) {
      pause();
      currentIndex.value = 0;
    } else if (currentIndex.value >= newImages.length) {
      currentIndex.value = 0;
    }
  },
  { immediate: true }
);

// 监听fps变化
watch(
  () => props.fps,
  () => {
    if (isPlaying.value) {
      // 重新开始播放以应用新的fps
      play();
    }
  }
);

// 组件挂载时根据autoplay决定是否播放
if (props.autoplay && props.images.length > 0) {
  play();
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.animation-frame-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.player-container {
  position: relative;
  width: 100%;
  height: 300px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.frame-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.placeholder {
  color: #999;
  font-size: 16px;
}

.controls-overlay {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 6px;
  border-radius: 4px;
}

.control-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.control-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  margin-top: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #1890ff;
  transition: width 0.1s linear;
}

.frame-info {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}
</style>
