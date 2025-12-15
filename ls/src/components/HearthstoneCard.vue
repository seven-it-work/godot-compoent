<template>
  <div class="hearthstone-card">
    <!-- 等级 -->
    <div class="corner-circle top-left">
      <span class="circle-text big">2</span>
    </div>
    <!-- 酒馆购买花费 -->
    <div class="corner-circle top-right">
      <span class="circle-text big">1</span>
    </div>

    <!-- 卡牌名称 -->
    <div class="card-name">名称</div>

    <!-- 中间内容区域 -->
    <div class="card-content">
      <slot></slot>
    </div>

    <!-- 底部区域 -->
    <div class="card-bottom">
      <!-- 攻击力 -->
      <div class="corner-circle bottom-left">
        <span class="circle-text attack">999999</span>
      </div>

      <!-- 种族 -->
      <div class="bottom-texts">
        <span class="text-item">机械</span>
        <span class="text-item">野猪人</span>
      </div>

      <!-- 生命值 -->
      <div class="corner-circle bottom-right">
        <span class="circle-text health">999999</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 炉石卡牌组件
</script>

<style scoped>
.hearthstone-card {
  flex: 1;
  border: 2px solid #000;
  background-color: #e0e0e0;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin: 10px 20px;
}

/* 角落圆形 */
.corner-circle {
  position: absolute;
  width: 5vw;
  height: 9vh;
  border-radius: 3vw;
  border: 2px solid #000;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-left {
  top: -5%;
  left: -5%;
}

.top-right {
  top: -5%;
  right: -5%;
}

.bottom-left {
  bottom: -5%;
  left: -5%;
}

.bottom-right {
  bottom: -5%;
  right: -5%;
}

/* 圆形文本 */
.circle-text {
  font-size: 1vw;
  font-weight: bold;
  color: #000;
}

/* 卡牌名称 */
.card-name {
  text-align: center;
  font-size: 4vw;
  font-weight: bold;
  margin: 15% 0 5% 0;
}

/* 卡牌内容区域 */
.card-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 底部区域 */
.card-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20%;
}

/* 底部文本 */
.bottom-texts {
  display: flex;
  gap: 10%;
  font-size: 2vw;
  font-weight: bold;
  justify-content: center;
}

.text-item {
  white-space: nowrap;
}

.attack {
  font-size: 2vw;
  color: #ff5555;
}
.health {
  font-size: 2vw;
  color: #55ff55;
}
.big {
  font-size: 5vw;
}
</style>
