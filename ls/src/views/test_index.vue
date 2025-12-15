<template>
  <div class="main-frame">
    <div class="top-section">
      <!-- 酒馆区域 -->
      <div class="row">
        <HearthstoneCard v-for="i in 7" :key="`top-${i}`"></HearthstoneCard>
      </div>
      <!-- end 酒馆区域 -->
      <!-- 战场区域 -->
      <div class="row">
        <HearthstoneCard v-for="i in 7" :key="`middle-${i}`"></HearthstoneCard>
      </div>
      <!-- end 战场区域 -->
    </div>
    <div class="bottom-section">
      <!-- 额外操作区域 -->
      <div class="large-cell"></div>
      <!-- end 额外操作区域 -->
      <!-- 手牌区域 -->
      <div class="right-subsection">
        <div class="row">
          <HearthstoneCard v-for="i in 5" :key="`bottom-top-${i}`"></HearthstoneCard>
        </div>
        <div class="row">
          <HearthstoneCard v-for="i in 5" :key="`bottom-bottom-${i}`"></HearthstoneCard>
        </div>
      </div>
      <!-- end 手牌区域 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import HearthstoneCard from '../components/HearthstoneCard.vue';
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
