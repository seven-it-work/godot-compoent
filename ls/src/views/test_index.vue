<template>
  <div class="main-frame">
    <div class="top-section">
      <!-- 酒馆区域 -->
      <HearthstoneTavern></HearthstoneTavern>
      <!-- end 酒馆区域 -->
      <!-- 炉石出战区域 -->
      <HearthstoneBattlefield></HearthstoneBattlefield>
      <!-- end 炉石出战区域 -->
    </div>
    <div class="bottom-section">
      <!-- 额外操作区域 -->
      <div class="large-cell">操作区域</div>
      <!-- end 额外操作区域 -->
      <!-- 手牌区域 -->
      <HearthstoneHand></HearthstoneHand>
      <!-- end 手牌区域 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import HearthstoneBattlefield from '../components/HearthstoneBattlefield.vue';
import HearthstoneHand from '../components/HearthstoneHand.vue';
import HearthstoneTavern from '../components/HearthstoneTavern.vue';
</script>

<style scoped>
.main-frame {
  /* 适应App.vue的缩放环境，不再需要自己实现缩放 */
  width: 100%;
  height: 100%;
  border: 2px solid #000;
  padding: 20px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
}

.top-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.row {
  display: flex;
  flex: 1;
}

.bottom-section {
  flex: 1;
  display: flex;
  gap: 20px;
}

.large-cell {
  width: 30%;
  border: 2px solid #000;
  background-color: #e0e0e0;
}

.right-subsection {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
