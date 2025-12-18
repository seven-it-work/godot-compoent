<template>
  <div
    ref="cardRef"
    class="card-slot"
    :class="`position-${props.positionType}`"
    :data-x="position.x"
    :data-y="position.y"
    :data-position-type="props.positionType"
    :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

import interact from 'interactjs';

// 定义位置类型枚举
type CardPosition = '酒馆' | '战场' | '手牌';

// 接收外部传入的位置参数（必填）
const props = defineProps<{
  positionType: CardPosition;
  cardId: string;
}>();

// 定义事件
const emit = defineEmits<{
  // 拖拽开始事件
  (e: 'drag-start', cardId: string): void;
  // 拖拽结束事件
  (e: 'drag-end', cardId: string, targetArea: string | null): void;
  // 卡片移动事件
  (e: 'card-move', cardId: string, fromArea: CardPosition, toArea: CardPosition): void;
}>();

// 卡片位置状态
const position = ref({
  x: 0,
  y: 0,
});

// 记录初始位置
const initialPosition = ref({
  x: 0,
  y: 0,
});

// 记录初始位置类型
const initialPositionType = ref(props.positionType);

// 卡片元素引用
const cardRef = ref<HTMLElement | null>(null);

// 拖拽交互实例引用
let dragInteraction: any = null;

// 监听位置类型变化，重置位置
watch(
  () => props.positionType,
  (newType, oldType) => {
    if (newType !== oldType) {
      // 位置类型变化，重置卡片位置
      position.value = { x: 0, y: 0 };
    }
  }
);

onMounted(() => {
  // 获取当前组件的根元素
  const cardElement = cardRef.value;

  if (!cardElement) return;

  // 初始化拖拽功能，所有卡片都可以拖拽
  dragInteraction = interact(cardElement as HTMLElement).draggable({
    // 启用惯性效果，拖拽结束后会有自然的减速
    inertia: true,

    // 启用自动滚动 - 当拖拽到容器边缘时自动滚动页面
    autoScroll: false,

    // 自定义光标样式
    cursorChecker() {
      return 'grabbing'; // 所有卡片都显示拖拽光标
    },

    // 拖拽事件监听器
    listeners: {
      // 拖拽开始时触发
      start(event: any) {
        const target = event.target as HTMLElement;

        // 记录初始位置
        initialPosition.value = { ...position.value };
        initialPositionType.value = props.positionType;

        console.log(
          `[拖拽开始] 卡片: ${props.cardId}, 初始位置类型: ${initialPositionType.value}, 初始坐标: (${initialPosition.value.x}, ${initialPosition.value.y})`
        );

        // 发送拖拽开始事件
        emit('drag-start', props.cardId);

        // 设置拖拽时的z-index，确保被拖拽元素在最上层
        target.style.zIndex = '2000';

        // 设置拖拽时的不透明度
        target.style.opacity = '0.8';

        // 禁用过渡效果，使拖拽更流畅
        target.style.transition = 'none';
      },

      // 拖拽移动时触发
      move(event: any) {
        // 更新卡片位置
        position.value.x += event.dx;
        position.value.y += event.dy;

        console.log(
          `[拖拽移动] 卡片: ${props.cardId}, 移动距离: (${event.dx}, ${event.dy}), 新坐标: (${position.value.x}, ${position.value.y})`
        );
      },

      // 拖拽结束时触发
      end(event: any) {
        const target = event.target as HTMLElement;

        // 获取释放位置
        const releaseX = event.clientX;
        const releaseY = event.clientY;

        console.log(`[拖拽结束] 卡片: ${props.cardId}, 释放屏幕坐标: (${releaseX}, ${releaseY})`);

        // 检查是否在手牌区域释放
        const handAreas = document.querySelectorAll('.game-section.hand-section');
        let isHandArea = false;
        let handAreaRects: DOMRect[] = [];

        for (const area of handAreas) {
          const rect = area.getBoundingClientRect();
          handAreaRects.push(rect);
          console.log(
            `[区域检查] 手牌区域坐标: 左=${rect.left}, 右=${rect.right}, 上=${rect.top}, 下=${rect.bottom}`
          );

          if (
            releaseX >= rect.left &&
            releaseX <= rect.right &&
            releaseY >= rect.top &&
            releaseY <= rect.bottom
          ) {
            isHandArea = true;
            console.log(`[区域检查] 卡片 ${props.cardId} 释放到手牌区域内`);
            break;
          }
        }

        if (!isHandArea) {
          console.log(`[区域检查] 卡片 ${props.cardId} 释放到非手牌区域`);
          console.log(`[区域检查] 释放点不在任何手牌区域内，手牌区域信息:`, handAreaRects);
        }

        // 发送拖拽结束事件
        emit('drag-end', props.cardId, isHandArea ? 'hand' : null);

        // 只有来自酒馆区域的卡片才能移动到手牌区域
        if (isHandArea && initialPositionType.value === '酒馆') {
          // 在手牌区域释放，发送移动事件
          console.log(
            `[位置更新] 卡片 ${props.cardId} 从 ${initialPositionType.value} 移动到手牌区域`
          );
          emit('card-move', props.cardId, initialPositionType.value, '手牌');
          // 重置位置
          position.value = { x: 0, y: 0 };
          console.log(`[位置更新] 卡片 ${props.cardId} 位置重置为 (0, 0)`);
        } else {
          // 非手牌区域释放或非酒馆卡片释放，回到初始位置
          console.log(
            `[位置更新] 卡片 ${props.cardId} 回到初始位置: (${initialPosition.value.x}, ${initialPosition.value.y})`
          );
          position.value = { ...initialPosition.value };
        }

        // 恢复默认z-index
        target.style.zIndex = '';

        // 恢复完全不透明度
        target.style.opacity = '1';

        // 重新启用过渡效果
        target.style.transition = 'transform 0.1s ease, opacity 0.2s ease';
      },
    },
  });
});

onUnmounted(() => {
  // 清理拖拽交互实例
  if (dragInteraction) {
    dragInteraction.unset();
  }
});
</script>

<style scoped>
.card-slot {
  flex: 1;

  border: 2px solid #000;

  background-color: #fff;

  aspect-ratio: 1/1.5;

  position: relative;

  cursor: grab;

  transition:
    transform 0.1s ease,
    opacity 0.2s ease;

  touch-action: none;

  user-select: none;
}

.card-slot:active {
  cursor: grabbing;
}
</style>
