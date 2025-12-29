<template>
  <div
    ref="cardRef"
    class="card-slot"
    :class="[
      `position-${props.data?.location}`,
      { empty: props.data === null || props.data === undefined },
      { selected: props.data !== null && isSelected },
    ]"
    @click="handleCardClick"
    :data-card-id="cardId"
    :data-x="position.x"
    :data-y="position.y"
    :data-position-type="props.data?.location"
    :data-is-empty="props.data === null || props.data === undefined"
    :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
  >
    <div v-if="data" class="card-content">
      <!-- 左上角圆形数字 -->
      <div class="corner-badge top-left" v-if="data.tier">{{ data.tier }}</div>
      <!-- 右上角圆形数字 -->
      <div class="corner-badge top-right" v-if="data?.location === 'tavern'">
        {{ data.cardPrice }}
      </div>
      <!-- 左下角攻击力 -->
      <div class="corner-badge bottom-left" v-if="data.type === 'minion'">
        {{ (data as Minion).getAttack() }}
      </div>
      <!-- 右下角生命值 -->
      <div class="corner-badge bottom-right" v-if="data.type === 'minion'">
        {{ (data as Minion).getHealth() }}
      </div>
      <!-- 关键词 -->
      <div class="keywords" v-if="data.type === 'minion'">
        <span
          v-for="keyword in [...new Set((data as Minion).getKeywords())]"
          :key="keyword"
          class="keyword-tag"
        >
          {{ MinionKeywordCN[keyword] }}
        </span>
      </div>
      <div class="card-name">{{ data.name }}</div>
      <div class="minion-types" v-if="data.type === 'minion'">
        {{ (data as Minion).getMinionCnTypes().join('\n') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { Card } from '@/server/controller/entity/Card';
import { Minion, MinionKeywordCN } from '@/server/controller/entity/Minion';
import { Spell } from '@/server/controller/entity/Spell';
import interact from 'interactjs';

// 接收外部传入的参数
type CardPosition = CardArea;

const props = defineProps<{
  cardId: string;
  data?: Card | null; // 卡片数据，如果为null或undefined则表示空格子
  selectedCardId?: string | null; // 当前选中的卡片ID
  positionType?: 'tavern' | 'battlefield' | 'hand'; // 卡片所在区域类型（酒馆/战场/手牌）
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
    fromArea: 'tavern' | 'battlefield' | 'hand',
    toArea: 'tavern' | 'battlefield' | 'hand',
    targetSlotIndex?: number
  ): void;
  // 卡片移除事件
  (e: 'card-remove', cardId: string): void;
  // 卡片交换事件
  (e: 'card-swap', cardId: string, targetSlotIndex: number): void;
  // 卡片选中事件
  (e: 'card-select', cardData: Card | null, positionType?: string): void;
  // 法术释放事件
  (e: 'spell-cast', spellCardId: string, targetCardId?: string): void;
}>();

// 卡片选中状态
const isSelected = ref(false);

// 点击卡片事件处理函数
const handleCardClick = () => {
  // 空卡片点击无效
  if (!props.data) return;
  emit('card-select', props.data, props.positionType);
};

// 监听选中卡片ID变化，更新当前卡片的选中状态
watch(
  () => props.selectedCardId,
  newSelectedId => {
    isSelected.value = newSelectedId === props.data?.id;
  },
  { immediate: true }
);

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

// 记录拖拽前卡片的原始中心点视口坐标（用于法术箭头起始点）
const initialCardCenter = ref({
  x: 0,
  y: 0,
});

// 卡片元素引用
const cardRef = ref<HTMLElement | null>(null);

// 拖拽交互实例引用
let dragInteraction: any = null;

// 法术拖拽状态
const spellDragState = ref({
  isDragStarted: false, // 是否已开始拖拽
  isDraggedOutOfHand: false, // 是否已拖出手牌区域
  originalOpacity: '1', // 原始不透明度，用于恢复卡片显示
});

// 区域检查结果类型
interface AreaCheckResult {
  isHandArea: boolean;
  isTavernArea: boolean;
  isBattlefieldArea: boolean;
}

// 战场槽位检查结果类型
interface BattlefieldSlotCheckResult {
  isEmptySlot: boolean;
  targetSlotIndex: number;
  isTargetSlot: boolean;
  targetSlotHasCard: boolean;
}

/**
 * 检查卡片释放的区域
 * @param releaseX 释放位置X坐标
 * @param releaseY 释放位置Y坐标
 * @returns 区域检查结果
 */
const checkReleaseArea = (releaseX: number, releaseY: number): AreaCheckResult => {
  // 检查是否在手牌区域释放
  const handAreas = document.querySelectorAll('.hand-section');
  let isHandArea = false;

  console.log(`[区域检查] 找到手牌区域数量: ${handAreas.length}`);

  for (const area of handAreas) {
    const rect = area.getBoundingClientRect();
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
  const tavernAreas = document.querySelectorAll('.tavern-section');
  let isTavernArea = false;

  console.log(`[区域检查] 找到酒馆区域数量: ${tavernAreas.length}`);

  for (const area of tavernAreas) {
    const rect = area.getBoundingClientRect();
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
  const battlefieldAreas = document.querySelectorAll('.battlefield-section');
  let isBattlefieldArea = false;

  console.log(`[区域检查] 找到战场区域数量: ${battlefieldAreas.length}`);

  for (const area of battlefieldAreas) {
    const rect = area.getBoundingClientRect();
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

  return {
    isHandArea,
    isTavernArea,
    isBattlefieldArea,
  };
};

/**
 * 检查战场内的具体卡片槽位
 * @param releaseX 释放位置X坐标
 * @param releaseY 释放位置Y坐标
 * @returns 战场槽位检查结果
 */
const checkBattlefieldSlot = (releaseX: number, releaseY: number): BattlefieldSlotCheckResult => {
  let isEmptySlot = false;
  let targetSlotIndex = -1;
  let isTargetSlot = false;
  let targetSlotHasCard = false;

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

  return {
    isEmptySlot,
    targetSlotIndex,
    isTargetSlot,
    targetSlotHasCard,
  };
};

/**
 * 移除所有高亮样式
 */
const removeAllHighlights = () => {
  console.log('[位置更新] 移除所有卡片槽和酒馆区域的高亮');
  // 1. 移除所有卡片槽的高亮（包括drop-allowed、swap-allowed和spell-target-allowed）
  const allCardSlots = document.querySelectorAll('.card-slot');
  allCardSlots.forEach(slot => {
    slot.classList.remove('drop-allowed', 'swap-allowed', 'spell-target-allowed');
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
};

/**
 * 显示法术使用箭头
 * @param target 法术卡片元素
 */
const showSpellArrow = (_target: HTMLElement) => {
  // 移除已存在的箭头和连线
  const existingArrow = document.querySelector('.spell-arrow');
  if (existingArrow) {
    existingArrow.remove();
  }

  const existingArrowLine = document.querySelector('.spell-arrow-line');
  if (existingArrowLine) {
    existingArrowLine.remove();
  }

  // 创建连线元素
  const arrowLine = document.createElement('div');
  arrowLine.className = 'spell-arrow-line';
  arrowLine.style.position = 'fixed';
  arrowLine.style.pointerEvents = 'none';
  arrowLine.style.zIndex = '2999'; // 低于箭头的z-index
  arrowLine.style.height = '4px';
  arrowLine.style.backgroundColor = 'rgba(255, 255, 0, 0.8)';
  arrowLine.style.borderRadius = '2px';
  arrowLine.style.transformOrigin = 'left center';

  // 创建箭头元素
  const arrow = document.createElement('div');
  arrow.className = 'spell-arrow';
  arrow.style.position = 'fixed';
  arrow.style.pointerEvents = 'none';
  arrow.style.zIndex = '3000';
  arrow.style.width = '20px';
  arrow.style.height = '20px';
  arrow.style.backgroundColor = 'rgba(255, 255, 0, 0.8)';
  arrow.style.borderRadius = '50%';
  arrow.style.transform = 'translate(-50%, -50%)';
  arrow.style.boxShadow = '0 0 10px rgba(255, 255, 0, 0.8)';

  // 使用拖拽前卡片的原始中心点作为起始点
  const startX = initialCardCenter.value.x;
  const startY = initialCardCenter.value.y;

  // 初始箭头位置（终点）
  const endX = startX;
  const endY = startY;

  // 设置箭头初始位置
  arrow.style.left = `${endX}px`;
  arrow.style.top = `${endY}px`;

  // 设置连线初始位置和长度
  updateArrowLine(startX, startY, endX, endY, arrowLine);

  // 添加到body
  document.body.appendChild(arrowLine);
  document.body.appendChild(arrow);

  console.log(`[法术箭头] 显示箭头，起始点（拖拽前原始中心）: (${startX}, ${startY})`);
};

/**
 * 更新箭头连线
 * @param startX 起始点X坐标
 * @param startY 起始点Y坐标
 * @param endX 终点X坐标
 * @param endY 终点Y坐标
 * @param arrowLine 连线元素
 */
const updateArrowLine = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  arrowLine: HTMLElement
) => {
  // 计算连线长度和角度
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  // 设置连线样式
  arrowLine.style.left = `${startX}px`;
  arrowLine.style.top = `${startY}px`;
  arrowLine.style.width = `${length}px`;
  arrowLine.style.transform = `rotate(${angle}deg)`;
};

/**
 * 移除法术使用箭头
 */
const removeSpellArrow = () => {
  const existingArrow = document.querySelector('.spell-arrow');
  if (existingArrow) {
    existingArrow.remove();
  }

  const existingArrowLine = document.querySelector('.spell-arrow-line');
  if (existingArrowLine) {
    existingArrowLine.remove();
  }
};

/**
 * 根据法术的targetSelection高亮可选中的目标
 * @param targetSelection 法术目标选择规则
 */
const highlightSpellTargets = () => {
  // 移除所有已有的高亮
  removeAllHighlights();

  // 获取所有可能的目标卡片槽（战场和酒馆）
  const allTargetSlots: NodeListOf<HTMLElement> = document.querySelectorAll(
    '.battlefield-section .card-slot, .tavern-section .card-slot'
  );

  // 遍历所有目标卡片槽，高亮符合条件的目标
  allTargetSlots.forEach(slot => {
    const isEmpty = slot.getAttribute('data-is-empty') === 'true';

    // 跳过空槽（法术通常作用于有卡片的槽位）
    if (isEmpty) {
      return;
    }

    // 高亮所有非空槽位作为可能的目标
    slot.classList.add('spell-target-allowed');
  });
};

/**
 * 恢复卡片的默认样式
 * @param target 卡片元素
 */
const restoreCardStyles = (target: HTMLElement) => {
  // 恢复默认z-index
  target.style.zIndex = '';

  // 恢复完全不透明度
  target.style.opacity = '1';

  // 重新启用过渡效果
  target.style.transition = 'transform 0.1s ease, opacity 0.2s ease';
};

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
      /**
       * 拖拽开始时触发的事件处理函数
       * 负责初始化拖拽状态，设置拖拽样式，以及根据卡片类型显示相应的高亮效果
       * @param event 拖拽开始事件对象
       * @returns 如果是空格子则返回false，否则返回undefined
       */
      start(event: any) {
        // 如果是空格子，禁止拖拽
        if (!props.data) {
          event.stopPropagation();
          return false;
        }

        const target = event.target as HTMLElement;

        // 记录初始位置
        initialPosition.value = { ...position.value };

        // 计算并记录拖拽前卡片的原始中心点视口坐标
        const rect = target.getBoundingClientRect();
        initialCardCenter.value = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };

        console.log(
          `[拖拽开始] 卡片: ${props.cardId}, 初始位置类型: ${props.data?.location}, 初始坐标: (${initialPosition.value.x}, ${initialPosition.value.y})`
        );
        console.log(
          `[拖拽开始] 卡片 ${props.cardId} 原始中心点视口坐标: (${initialCardCenter.value.x}, ${initialCardCenter.value.y})`
        );

        // 拖拽开始时同时选中当前卡片
        emit('card-select', props.data, props.positionType);

        // 发送拖拽开始事件
        emit('drag-start', props.cardId);

        // 设置拖拽时的z-index，确保被拖拽元素在最上层
        target.style.zIndex = '2000';

        // 禁用过渡效果，使拖拽更流畅
        target.style.transition = 'none';

        // 逻辑1：如果是手牌拖拽，高亮战场的空格子
        if (props.data?.location === 'hand') {
          // 判断是否为法术卡片
          const isSpell = props.data instanceof Spell;

          if (isSpell) {
            console.log(`[法术拖拽] 法术卡片 ${props.cardId} 开始拖拽，初始化拖拽状态`);

            // 初始化法术拖拽状态
            spellDragState.value.isDragStarted = true;
            spellDragState.value.isDraggedOutOfHand = false;
            spellDragState.value.originalOpacity = target.style.opacity;

            // 高亮可选择的目标
            highlightSpellTargets();
          } else {
            console.log(`[高亮处理] 手牌卡片 ${props.cardId} 开始拖拽，高亮战场空格子`);

            // 设置拖拽时的不透明度
            target.style.opacity = '0.8';

            const emptySlots = document.querySelectorAll(
              '.battlefield-section .card-slot[data-is-empty="true"]'
            );
            emptySlots.forEach(slot => {
              slot.classList.add('drop-allowed');
            });
          }
        }
        // 逻辑2：如果是战场卡片拖拽，高亮酒馆区域和所有战场卡片槽
        else if (props.data?.location === 'battlefield') {
          console.log(`[高亮处理] 战场卡片 ${props.cardId} 开始拖拽，高亮酒馆区域和所有战场卡片槽`);

          // 设置拖拽时的不透明度
          target.style.opacity = '0.8';

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

      /**
       * 拖拽移动时触发的事件处理函数
       * 负责更新卡片的位置坐标
       * @param event 拖拽移动事件对象
       * @returns 如果是空格子则返回false，否则返回undefined
       */
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

        // 判断是否为法术卡片
        const isSpell = props.data instanceof Spell;

        if (isSpell && spellDragState.value.isDragStarted) {
          const target = event.target as HTMLElement;
          const clientX = event.clientX;
          const clientY = event.clientY;

          // 检查当前位置是否在手牌区域内
          let isInHandArea = false;
          const handAreas = document.querySelectorAll('.hand-section');

          for (const area of handAreas) {
            const rect = area.getBoundingClientRect();
            if (
              clientX >= rect.left &&
              clientX <= rect.right &&
              clientY >= rect.top &&
              clientY <= rect.bottom
            ) {
              isInHandArea = true;
              break;
            }
          }

          // 法术卡片拖出手牌区域的逻辑
          if (!isInHandArea && !spellDragState.value.isDraggedOutOfHand) {
            // 刚拖出手牌区域
            console.log(`[法术拖拽] 法术卡片 ${props.cardId} 拖出手牌区域，显示箭头，隐藏卡片`);

            // 显示法术箭头
            showSpellArrow(target);

            // 隐藏卡片
            target.style.opacity = '0';

            // 更新拖拽状态
            spellDragState.value.isDraggedOutOfHand = true;
          }
          // 法术卡片拖回手牌区域的逻辑
          else if (isInHandArea && spellDragState.value.isDraggedOutOfHand) {
            // 拖回手牌区域
            console.log(`[法术拖拽] 法术卡片 ${props.cardId} 拖回手牌区域，隐藏箭头，显示卡片`);

            // 隐藏法术箭头
            removeSpellArrow();

            // 显示卡片
            target.style.opacity = '0.8';

            // 更新拖拽状态
            spellDragState.value.isDraggedOutOfHand = false;
          }

          // 如果卡片已拖出手牌区域，更新箭头位置和连线
          if (spellDragState.value.isDraggedOutOfHand) {
            const arrow = document.querySelector('.spell-arrow') as HTMLElement;
            const arrowLine = document.querySelector('.spell-arrow-line') as HTMLElement;

            if (arrow && arrowLine) {
              // 更新箭头位置
              arrow.style.left = `${clientX}px`;
              arrow.style.top = `${clientY}px`;

              // 使用拖拽前卡片的原始中心点作为起始点
              const startX = initialCardCenter.value.x;
              const startY = initialCardCenter.value.y;

              // 更新连线
              updateArrowLine(startX, startY, clientX, clientY, arrowLine);

              console.log(
                `[法术拖拽] 箭头跟随鼠标移动，新位置: (${clientX}, ${clientY})，起始点保持拖拽前原始中心: (${startX}, ${startY})`
              );
            }
          }
        }
      },

      /**
       * 拖拽结束时触发的事件处理函数
       * 负责处理卡片释放后的各种逻辑，包括区域检查、位置更新、样式恢复等
       * @param event 拖拽结束事件对象
       * @returns 如果是空格子则返回false，否则返回undefined
       */
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

        // 检查卡片释放的区域
        const areaResult = checkReleaseArea(releaseX, releaseY);
        const { isHandArea, isTavernArea, isBattlefieldArea } = areaResult;

        // 检查是否释放到战场卡片槽上（包括空格子和已有卡片的槽）
        let battlefieldSlotResult = {
          isEmptySlot: false,
          targetSlotIndex: -1,
          isTargetSlot: false,
          targetSlotHasCard: false,
        };
        if (isBattlefieldArea) {
          battlefieldSlotResult = checkBattlefieldSlot(releaseX, releaseY);
        }
        const { isEmptySlot, targetSlotIndex, isTargetSlot, targetSlotHasCard } =
          battlefieldSlotResult;

        // 发送拖拽结束事件
        emit(
          'drag-end',
          props.cardId,
          isHandArea ? 'hand' : isTavernArea ? 'tavern' : isBattlefieldArea ? 'battlefield' : null
        );

        // 逻辑1：判断是否为法术卡片释放
        const isSpell = props.data instanceof Spell;
        let shouldRemoveCard = false;

        if (isSpell) {
          console.log(`[法术释放] 法术卡片 ${props.cardId} 释放，开始处理释放逻辑`);
          const spell = props.data as Spell;

          // 检查是否拖出手牌区域
          if (spellDragState.value.isDraggedOutOfHand) {
            console.log(`[法术释放] 法术 ${props.cardId} 已拖出手牌区域，检查释放位置`);

            // 检查是否释放到手牌区域内
            if (isHandArea) {
              // 释放到手牌区域，取消使用
              console.log(`[法术释放] 法术 ${props.cardId} 释放到手牌区域，取消使用`);
              // 法术取消使用后，回到原来的位置
              position.value = { ...initialPosition.value };
              console.log(
                `[法术释放] 法术 ${props.cardId} 回到初始位置: (${initialPosition.value.x}, ${initialPosition.value.y})`
              );
            } else {
              // 释放到手牌区域外，检查是否指向有效目标
              console.log(`[法术释放] 法术 ${props.cardId} 释放到手牌区域外，检查目标有效性`);

              // 检查是否释放到有效目标上
              let targetSlot = null;

              // 保存当前拖拽元素的显示状态
              const originalDisplay = target.style.display;

              // 暂时隐藏拖拽元素，避免elementFromPoint检测到自身
              target.style.display = 'none';

              // 使用elementFromPoint获取真实的目标元素
              const releaseElement = document.elementFromPoint(releaseX, releaseY);
              targetSlot = releaseElement?.closest('.card-slot');

              // 恢复拖拽元素的显示状态
              target.style.display = originalDisplay;

              console.log(
                `[法术释放] 释放位置下的元素: ${releaseElement?.tagName}, 类名: ${releaseElement?.className}`
              );
              console.log(
                `[法术释放] 目标槽: ${targetSlot?.tagName}, 类名: ${targetSlot?.className}, 包含spell-target-allowed: ${targetSlot?.classList.contains('spell-target-allowed')}`
              );

              // 手动检查目标槽是否为战场槽且有卡片
              const isTargetValid =
                targetSlot?.classList.contains('spell-target-allowed') ||
                (targetSlot?.getAttribute('data-is-empty') === 'false' &&
                  targetSlot?.closest('.battlefield-section'));
              console.log(
                `[法术释放] 目标有效性检查: targetSlot=${!!targetSlot}, isTargetValid=${isTargetValid}, data-is-empty=${targetSlot?.getAttribute('data-is-empty')}, in-battlefield=${!!targetSlot?.closest('.battlefield-section')}`
              );

              if (spell.requiresTarget) {
                // 需要目标的法术
                if (isTargetValid && targetSlot) {
                  // 释放到有效目标上，发送法术使用事件
                  const targetCardId = targetSlot.getAttribute('data-card-id');
                  console.log(
                    `[法术释放] 法术 ${props.cardId} 释放到有效目标 ${targetCardId} 上，执行法术`
                  );
                  emit('spell-cast', props.cardId, targetCardId || '');
                  shouldRemoveCard = true; // 法术使用后从手牌移除
                } else {
                  // 没有释放到有效目标上，取消使用
                  console.log(`[法术释放] 法术 ${props.cardId} 没有释放到有效目标上，取消使用`);
                  // 法术取消使用后，回到原来的位置
                  position.value = { ...initialPosition.value };
                  console.log(
                    `[法术释放] 法术 ${props.cardId} 回到初始位置: (${initialPosition.value.x}, ${initialPosition.value.y})`
                  );
                }
              } else {
                // 不需要目标的法术，直接释放
                console.log(`[法术释放] 法术 ${props.cardId} 不需要目标，直接执行`);
                emit('spell-cast', props.cardId);
                shouldRemoveCard = true; // 法术使用后从手牌移除
              }
            }
          } else {
            // 没有拖出手牌区域，取消使用
            console.log(`[法术释放] 法术 ${props.cardId} 未拖出手牌区域，取消使用`);
            // 法术取消使用后，回到原来的位置
            position.value = { ...initialPosition.value };
            console.log(
              `[法术释放] 法术 ${props.cardId} 回到初始位置: (${initialPosition.value.x}, ${initialPosition.value.y})`
            );
          }
        }
        // 逻辑2：战场卡片拖拽到酒馆区域，卡片消失
        else if (isTavernArea && props.data?.location === 'battlefield') {
          console.log(`[位置更新] 战场卡片 ${props.cardId} 拖拽到酒馆区域，卡片消失`);
          shouldRemoveCard = true;
        }
        // 逻辑3：酒馆卡片拖拽到手牌区域，卡片移动
        else if (isHandArea && props.data?.location === 'tavern') {
          // 在手牌区域释放，发送移动事件
          console.log(`[位置更新] 卡片 ${props.cardId} 从 ${props.data?.location} 移动到手牌区域`);
          emit('card-move', props.cardId, props.data?.location || '', 'hand');
          // 重置位置
          position.value = { x: 0, y: 0 };
          console.log(`[位置更新] 卡片 ${props.cardId} 位置重置为 (0, 0)`);
        }
        // 逻辑4：手牌卡片拖拽到战场空格子，卡片移动
        else if (isEmptySlot && props.data?.location === 'hand') {
          // 在战场空格子释放，发送移动事件，传递目标空格子索引
          console.log(
            `[位置更新] 卡片 ${props.cardId} 从 ${props.data?.location} 移动到战场区域，目标空格子索引: ${targetSlotIndex}`
          );
          emit(
            'card-move',
            props.cardId,
            props.data?.location || '',
            'battlefield',
            targetSlotIndex
          );
          // 重置位置
          position.value = { x: 0, y: 0 };
          console.log(`[位置更新] 卡片 ${props.cardId} 位置重置为 (0, 0)`);
        }
        // 逻辑5：战场卡片拖拽到另一个战场卡片槽，交换位置
        else if (isTargetSlot && props.data?.location === 'battlefield') {
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

        // 恢复卡片默认样式
        restoreCardStyles(target);

        // 恢复法术卡片的显示（如果之前被隐藏）
        if (isSpell) {
          target.style.opacity = '1';
        }

        // 移除所有高亮样式
        removeAllHighlights();

        // 移除法术箭头
        removeSpellArrow();

        // 重置法术拖拽状态
        spellDragState.value.isDragStarted = false;
        spellDragState.value.isDraggedOutOfHand = false;

        // 如果需要移除卡片，最后发送移除事件
        if (shouldRemoveCard) {
          emit('card-remove', props.cardId);
        }
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

/* 法术目标高亮样式 */
.card-slot.spell-target-allowed {
  border: 4px solid #ff0000;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
  transform: scale(1.05);
  transition: all 0.3s ease;
}

/* 选中卡片样式 */
.card-slot.selected {
  border: 3px solid #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
  z-index: 1000;
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
  top: auto;
  /* Override base class top property */
}

/* 右下角徽章 */
.corner-badge.bottom-right {
  right: -5px;
  bottom: -5px;
  top: auto;
  /* Override base class top property */
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
  white-space: pre-line;
  /* Allow line breaks with \n */
  line-height: 1.2;
}

/* 关键词容器 */
.keywords {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1px;
  overflow-y: auto;
  max-height: 25px;
}

/* 单个关键词标签 */
.keyword-tag {
  color: black;
  font-size: 8px;
}
</style>
