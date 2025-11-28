<template>
  <div class="spirit-qi-absorb">
    <a-card title="灵气吸收" class="absorb-card">
      <div class="absorb-content">
        <!-- 灵气类型选择 -->
        <div class="spirit-type-selector">
          <span class="selector-label">选择灵气类型：</span>
          <a-radio-group
            v-model:value="selectedSpiritType"
            button-style="solid"
          >
            <a-radio-button value="gold">金灵气</a-radio-button>
            <a-radio-button value="wood">木灵气</a-radio-button>
            <a-radio-button value="water">水灵气</a-radio-button>
            <a-radio-button value="fire">火灵气</a-radio-button>
            <a-radio-button value="earth">土灵气</a-radio-button>
          </a-radio-group>
        </div>

        <a-button
          type="primary"
          size="large"
          :loading="isCooldown"
          :disabled="isCooldown"
          @click="handleAbsorb"
          class="absorb-button"
          :class="{ absorbing: isAbsorbing }"
        >
          <template #icon>
            <span class="absorb-icon">💨</span>
          </template>
          {{ isCooldown ? "吸收中..." : "吸收灵气" }}
        </a-button>

        <div v-if="isCooldown" class="cooldown-info">
          <span class="cooldown-label">冷却时间：</span>
          <span class="cooldown-time">{{
            formatCooldownTime(cooldownRemaining)
          }}</span>
        </div>

        <!-- 吸收效果动画 -->
        <div v-if="isAbsorbing" class="absorb-effect">
          <div class="effect-circle"></div>
          <div class="effect-circle"></div>
          <div class="effect-circle"></div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { SpiritRootType } from "../../types/game";

interface Props {
  isCooldown: boolean;
  cooldownRemaining: number;
}

defineProps<Props>();
const emit = defineEmits<{
  absorb: [spiritType: SpiritRootType];
}>();

const isAbsorbing = ref(false);
const selectedSpiritType = ref<SpiritRootType>("gold");

// 处理吸收灵气
const handleAbsorb = () => {
  // 触发吸收动画
  isAbsorbing.value = true;

  // 发送吸收事件，传递选择的灵气类型
  emit("absorb", selectedSpiritType.value);

  // 动画持续时间
  setTimeout(() => {
    isAbsorbing.value = false;
  }, 500);
};

// 格式化冷却时间
const formatCooldownTime = (milliseconds: number) => {
  return `${(milliseconds / 1000).toFixed(1)}s`;
};
</script>

<style scoped>
.spirit-qi-absorb {
  margin-bottom: 20px;
}

.absorb-card {
  text-align: center;
}

.absorb-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.absorb-button {
  font-size: 18px;
  padding: 12px 30px;
  border-radius: 50px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.absorb-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
}

.absorb-button:active:not(:disabled) {
  transform: scale(0.95);
}

.absorb-icon {
  font-size: 20px;
  margin-right: 8px;
}

.absorbing {
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.cooldown-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}

.cooldown-label {
  color: #666;
}

.cooldown-time {
  color: #ff4d4f;
  font-weight: bold;
}

/* 吸收效果动画 */
.absorb-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

.effect-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 2px solid rgba(24, 144, 255, 0.6);
  border-radius: 50%;
  opacity: 0;
  animation: absorbEffect 1s ease-out;
}

.effect-circle:nth-child(2) {
  animation-delay: 0.2s;
}

.effect-circle:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes absorbEffect {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .absorb-button {
    width: 100%;
    font-size: 16px;
    padding: 10px 20px;
  }

  .absorb-icon {
    font-size: 18px;
  }
}
</style>
