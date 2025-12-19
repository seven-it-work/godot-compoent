<template>
  <div
    ref="cardRef"
    class="card-slot"
    :class="[
      `position-${props.positionType}`,
      { empty: props.data === null || props.data === undefined },
    ]"
    :data-card-id="cardId"
    :data-x="position.x"
    :data-y="position.y"
    :data-position-type="props.positionType"
    :data-is-empty="props.data === null || props.data === undefined"
    :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
  >
    <div v-if="data" class="card-content">
      <!-- 左上角圆形数字 -->
      <div class="corner-badge top-left" v-if="data.tier">{{ data.tier }}</div>
      <!-- 右上角圆形数字 -->
      <div class="corner-badge top-right" v-if="positionType === '酒馆'">{{ data.cost }}</div>
      <!-- 左下角攻击力 -->
      <div class="corner-badge bottom-left" v-if="data instanceof Minion">
        {{ data.getAttack() }}
      </div>
      <!-- 右下角生命值 -->
      <div class="corner-badge bottom-right" v-if="data instanceof Minion">
        {{ data.health }}
      </div>

      <div class="card-name">{{ data.nameCN }}</div>
      <div class="minion-types" v-if="data instanceof Minion">
        {{ data.minionTypesCN.join('\n') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

import interact from 'interactjs';
import { Card } from '../../../game/Card';
import { Minion } from '../../../game/Minion';

// 定义位置类型枚举
type CardPosition = '酒馆' | '战场' | '手牌';

// 接收外部传入的位置参数（必填）
const props = defineProps<{
  positionType: CardPosition;
  cardId: string;
  data?: Card | null; // 卡片数据，如果为null或undefined则表示空格子
}>();

// 定义事件
const emit = defineEmits<{
  // 拖拽开始事件
  (e: 'drag-start', cardId: string): void;
  // 拖拽结束事件
  (e: 'drag-end', cardId: string, targetArea: string | null): void;
  // 卡片移动事件
  (
    e: 'card-move',
    cardId: string,
    fromArea: CardPosition,
    toArea: CardPosition,
    targetSlotIndex?: number
  ): void;
  // 卡片移除事件
  (e: 'card-remove', cardId: string): void;
  // 卡片交换事件
  (e: 'card-swap', cardId: string, targetSlotIndex: number): void;
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

// 监听卡片数据变化，更新拖拽实例配置
watch(
  () => props.data,
  (newData, oldData) => {
    console.log(
      `[数据变化] 卡片 ${props.cardId} 数据变化: ${oldData ? oldData.id : 'null'} -> ${newData ? newData.id : 'null'}`
    );

    // 如果拖拽实例已存在，更新其cursorChecker配置
    if (dragInteraction) {
      dragInteraction.draggable({
        cursorChecker() {
          return newData ? 'grabbing' : 'default'; // 只有有数据的卡片显示拖拽光标
        },
      });
    }
  }
);

onMounted(() => {
  // 获取当前组件的根元素
  const cardElement = cardRef.value;

  if (!cardElement) return;

  // 初始化拖拽功能，只有有数据的卡片才可以拖拽
  dragInteraction = interact(cardElement as HTMLElement).draggable({
    // 启用惯性效果，拖拽结束后会有自然的减速
    inertia: true,

    // 启用自动滚动 - 当拖拽到容器边缘时自动滚动页面
    autoScroll: false,

    // 自定义光标样式
    cursorChecker() {
      return props.data ? 'grabbing' : 'default'; // 只有有数据的卡片显示拖拽光标
    },

    // 拖拽事件监听器
    listeners: {
      // 拖拽开始时触发
      start(event: any) {
        // 如果是空格子，禁止拖拽
        if (!props.data) {
          event.stopPropagation();
          return false;
        }

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

        // 逻辑1：如果是手牌拖拽，高亮战场的空格子
        if (props.positionType === '手牌') {
          console.log(`[高亮处理] 手牌卡片 ${props.cardId} 开始拖拽，高亮战场空格子`);
          const emptySlots = document.querySelectorAll(
            '.battlefield-section .card-slot[data-is-empty="true"]'
          );
          emptySlots.forEach(slot => {
            slot.classList.add('drop-allowed');
          });
        }
        // 逻辑2：如果是战场卡片拖拽，高亮酒馆区域和所有战场卡片槽
        else if (props.positionType === '战场') {
          console.log(`[高亮处理] 战场卡片 ${props.cardId} 开始拖拽，高亮酒馆区域和所有战场卡片槽`);
          // 高亮酒馆区域
          const tavernAreas = document.querySelectorAll('.tavern-section');
          tavernAreas.forEach(area => {
            area.classList.add('drop-allowed');
          });
          // 高亮所有战场卡片槽（包括空格子），用于位置交换
          const battlefieldSlots = document.querySelectorAll('.battlefield-section .card-slot');
          battlefieldSlots.forEach(slot => {
            slot.classList.add('swap-allowed');
          });
        }
      },

      // 拖拽移动时触发
      move(event: any) {
        // 如果是空格子，禁止拖拽
        if (!props.data) {
          event.stopPropagation();
          return false;
        }

        // 更新卡片位置
        position.value.x += event.dx;
        position.value.y += event.dy;

        console.log(
          `[拖拽移动] 卡片: ${props.cardId}, 移动距离: (${event.dx}, ${event.dy}), 新坐标: (${position.value.x}, ${position.value.y})`
        );
      },

      // 拖拽结束时触发
      end(event: any) {
        // 如果是空格子，禁止拖拽
        if (!props.data) {
          event.stopPropagation();
          return false;
        }

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

        // 检查是否在酒馆区域释放
        const tavernAreas = document.querySelectorAll('.game-section.tavern-section');
        let isTavernArea = false;
        let tavernAreaRects: DOMRect[] = [];

        for (const area of tavernAreas) {
          const rect = area.getBoundingClientRect();
          tavernAreaRects.push(rect);
          console.log(
            `[区域检查] 酒馆区域坐标: 左=${rect.left}, 右=${rect.right}, 上=${rect.top}, 下=${rect.bottom}`
          );

          if (
            releaseX >= rect.left &&
            releaseX <= rect.right &&
            releaseY >= rect.top &&
            releaseY <= rect.bottom
          ) {
            isTavernArea = true;
            console.log(`[区域检查] 卡片 ${props.cardId} 释放到酒馆区域内`);
            break;
          }
        }

        // 检查是否在战场区域释放
        const battlefieldAreas = document.querySelectorAll('.game-section.battlefield-section');
        let isBattlefieldArea = false;
        let battlefieldAreaRects: DOMRect[] = [];

        for (const area of battlefieldAreas) {
          const rect = area.getBoundingClientRect();
          battlefieldAreaRects.push(rect);
          console.log(
            `[区域检查] 战场区域坐标: 左=${rect.left}, 右=${rect.right}, 上=${rect.top}, 下=${rect.bottom}`
          );

          if (
            releaseX >= rect.left &&
            releaseX <= rect.right &&
            releaseY >= rect.top &&
            releaseY <= rect.bottom
          ) {
            isBattlefieldArea = true;
            console.log(`[区域检查] 卡片 ${props.cardId} 释放到战场区域内`);
            break;
          }
        }

        // 检查是否释放到战场卡片槽上（包括空格子和已有卡片的槽）
        let isEmptySlot = false;
        let targetSlotIndex = -1;
        let isTargetSlot = false;
        let targetSlotHasCard = false;

        if (isBattlefieldArea) {
          // 获取所有战场卡片槽，分别处理两行
          const firstRowSlots = document.querySelectorAll(
            '.battlefield-section .card-row:nth-child(1) .card-slot'
          );
          const secondRowSlots = document.querySelectorAll(
            '.battlefield-section .card-row:nth-child(2) .card-slot'
          );
          const allSlots = [...firstRowSlots, ...secondRowSlots];

          console.log(
            `[区域检查] 战场区域内卡片槽数量: ${allSlots.length}, 第一行: ${firstRowSlots.length}, 第二行: ${secondRowSlots.length}`
          );
          console.log(`[区域检查] 释放坐标: (${releaseX}, ${releaseY})`);

          // 记录释放到的具体卡片槽索引
          let slotIndex = 0;
          let foundSlot = false;

          for (const slot of allSlots) {
            // 获取当前卡片槽的cardId
            const slotCardId = slot.getAttribute('data-card-id');

            // 跳过当前拖拽的卡片槽
            if (slotCardId === props.cardId) {
              console.log(`[区域检查] 跳过当前拖拽的卡片槽 ${slotIndex}`);
              slotIndex++;
              continue;
            }

            const rect = slot.getBoundingClientRect();
            console.log(
              `[区域检查] 卡片槽 ${slotIndex} 坐标: 左=${rect.left}, 右=${rect.right}, 上=${rect.top}, 下=${rect.bottom}`
            );

            const isInside =
              releaseX >= rect.left &&
              releaseX <= rect.right &&
              releaseY >= rect.top &&
              releaseY <= rect.bottom;

            console.log(`[区域检查] 卡片槽 ${slotIndex} 是否包含释放点: ${isInside}`);

            if (isInside) {
              isTargetSlot = true;
              targetSlotIndex = slotIndex;
              isEmptySlot = slot.getAttribute('data-is-empty') === 'true';
              targetSlotHasCard = !isEmptySlot;
              console.log(
                `[区域检查] 卡片 ${props.cardId} 释放到战场卡片槽上，索引: ${targetSlotIndex}, 是否为空: ${isEmptySlot}`
              );
              foundSlot = true;
              break;
            }
            slotIndex++;
          }

          // 如果没有找到匹配的卡片槽，检查是否在第二行的空白区域
          if (!foundSlot) {
            console.log(`[区域检查] 卡片 ${props.cardId} 释放到战场区域内，但未找到匹配的卡片槽`);

            // 检查是否在第二行的卡片槽位置附近
            const secondRow = document.querySelector('.battlefield-section .card-row:nth-child(2)');
            if (secondRow) {
              const rowRect = secondRow.getBoundingClientRect();
              console.log(
                `[区域检查] 第二行区域坐标: 左=${rowRect.left}, 右=${rowRect.right}, 上=${rowRect.top}, 下=${rowRect.bottom}`
              );

              if (releaseY >= rowRect.top && releaseY <= rowRect.bottom) {
                // 尝试计算第二行的卡片槽索引
                const slotWidth = rowRect.width / 3; // 第二行有2个卡片槽和1个信息面板
                const slotIndexInRow = Math.floor((releaseX - rowRect.left) / slotWidth);
                if (slotIndexInRow >= 0 && slotIndexInRow < 2) {
                  targetSlotIndex = 5 + slotIndexInRow; // 第一行有5个卡片槽
                  isTargetSlot = true;

                  // 由于无法直接访问父组件的battlefieldCards，假设目标槽为空
                  isEmptySlot = true;
                  targetSlotHasCard = false;
                  console.log(
                    `[区域检查] 卡片 ${props.cardId} 释放到战场第二行卡片槽，计算索引: ${targetSlotIndex}`
                  );
                }
              }
            }
          }
        }

        // 发送拖拽结束事件
        emit(
          'drag-end',
          props.cardId,
          isHandArea ? 'hand' : isTavernArea ? 'tavern' : isBattlefieldArea ? 'battlefield' : null
        );

        // 逻辑1：战场卡片拖拽到酒馆区域，卡片消失
        if (isTavernArea && initialPositionType.value === '战场') {
          console.log(`[位置更新] 战场卡片 ${props.cardId} 拖拽到酒馆区域，卡片消失`);
          emit('card-remove', props.cardId);
          return;
        }

        // 逻辑2：酒馆卡片拖拽到手牌区域，卡片移动
        if (isHandArea && initialPositionType.value === '酒馆') {
          // 在手牌区域释放，发送移动事件
          console.log(
            `[位置更新] 卡片 ${props.cardId} 从 ${initialPositionType.value} 移动到手牌区域`
          );
          emit('card-move', props.cardId, initialPositionType.value, '手牌');
          // 重置位置
          position.value = { x: 0, y: 0 };
          console.log(`[位置更新] 卡片 ${props.cardId} 位置重置为 (0, 0)`);
        }
        // 逻辑3：手牌卡片拖拽到战场空格子，卡片移动
        else if (isEmptySlot && initialPositionType.value === '手牌') {
          // 在战场空格子释放，发送移动事件，传递目标空格子索引
          console.log(
            `[位置更新] 卡片 ${props.cardId} 从 ${initialPositionType.value} 移动到战场区域，目标空格子索引: ${targetSlotIndex}`
          );
          emit('card-move', props.cardId, initialPositionType.value, '战场', targetSlotIndex);
          // 重置位置
          position.value = { x: 0, y: 0 };
          console.log(`[位置更新] 卡片 ${props.cardId} 位置重置为 (0, 0)`);
        }
        // 逻辑4：战场卡片拖拽到另一个战场卡片槽，交换位置
        else if (isTargetSlot && initialPositionType.value === '战场') {
          console.log(
            `[位置更新] 战场卡片 ${props.cardId} 拖拽到另一个战场卡片槽，索引: ${targetSlotIndex}, 目标槽是否有卡片: ${targetSlotHasCard}`
          );
          // 发送位置交换事件，传递源卡片ID和目标槽索引
          emit('card-swap', props.cardId, targetSlotIndex);
          // 重置位置
          position.value = { x: 0, y: 0 };
          console.log(`[位置更新] 卡片 ${props.cardId} 位置重置为 (0, 0)`);
        } else {
          // 其他情况，回到初始位置
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

        // 移除所有高亮样式
        // 1. 移除所有卡片槽的高亮（包括drop-allowed和swap-allowed）
        const allCardSlots = document.querySelectorAll('.card-slot');
        allCardSlots.forEach(slot => {
          slot.classList.remove('drop-allowed', 'swap-allowed');
        });
        // 2. 移除所有酒馆区域的高亮
        const tavernAreasEnd = document.querySelectorAll('.tavern-section');
        tavernAreasEnd.forEach(area => {
          area.classList.remove('drop-allowed');
        });
        // 3. 移除所有手牌区域的高亮
        const handAreasEnd = document.querySelectorAll('.hand-section');
        handAreasEnd.forEach(area => {
          area.classList.remove('drop-allowed');
        });
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
    opacity 0.2s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  touch-action: none;
  user-select: none;
  /* Removed overflow: hidden to show corner badges fully */
}

.card-slot:active {
  cursor: grabbing;
}

/* 空格子样式 */
.card-slot.empty {
  border: 2px dashed #ccc;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: default;
}

/* 可拖入样式 */
.card-slot.drop-allowed {
  border: 4px dashed #4169e1;
  box-shadow: 0 0 15px rgba(65, 105, 225, 0.5);
  transform: scale(1.05);
  transition: all 0.3s ease;
}

/* 卡片内容容器 */
.card-content {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
}

/* 角落圆形徽章 */
.corner-badge {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f00;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  position: absolute;
  top: -5px;
  border: 2px solid #000;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

/* 左上角徽章 */
.corner-badge.top-left {
  left: -5px;
  top: -5px;
}

/* 右上角徽章 */
.corner-badge.top-right {
  right: -5px;
  top: -5px;
}

/* 左下角徽章 */
.corner-badge.bottom-left {
  left: -5px;
  bottom: -5px;
  top: auto; /* Override base class top property */
}

/* 右下角徽章 */
.corner-badge.bottom-right {
  right: -5px;
  bottom: -5px;
  top: auto; /* Override base class top property */
}

/* 状态标签样式 */
.stat-label {
  font-size: 10px;
  margin-right: 2px;
}

/* 卡片名称 */
.card-name {
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  position: absolute;
  top: 15px;
}

/* 随从类型 */
.minion-types {
  font-size: 12px;
  text-align: center;
  color: #666;
  position: absolute;
  top: auto;
  bottom: 5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  white-space: pre-line; /* Allow line breaks with \n */
  line-height: 1.2;
}
</style>
