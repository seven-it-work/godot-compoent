<template>
  <div class="vertical-hearthstone">
    <div class="game-container">
      <!-- 第一行：5个卡片槽 -->
      <div class="card-row">
        <div class="card-slot" v-for="i in 5" :key="'row1-' + i"></div>
      </div>

      <!-- 第二行：2个卡片槽 -->
      <div class="card-row">
        <div class="card-slot" v-for="i in 2" :key="'row2-' + i"></div>
        <div class="info-panel tavern-info">
          <div class="stats-row">
            <div>酒馆等级：1级</div>
            <button>升级(1)</button>
          </div>

          <div class="buttons-row">
            <div>第x回合</div>
            <button>刷新(1)</button>
            <button>冻结(0)</button>
          </div>

          <div class="stats-row">
            <div>生命值：30 护甲：7</div>
            <button>技能</button>
          </div>

          <div class="buttons-row">
            <div>铸币：10/10</div>
            <button>设置</button>
            <button>调试</button>
          </div>
        </div>
      </div>

      <!-- 第三行：5个卡片槽 -->
      <div class="card-row">
        <div class="card-slot" v-for="i in 5" :key="'row3-' + i"></div>
      </div>

      <!-- 第四行：2个卡片槽  -->
      <div class="card-row">
        <div class="card-slot" v-for="i in 2" :key="'row4-' + i"></div>
        <div class="info-panel player-info">
          <div>选中的卡片信息</div>
        </div>
      </div>

      <!-- 第五行：5个卡片槽 -->
      <div class="card-row">
        <div class="card-slot" v-for="i in 5" :key="'row5-' + i"></div>
      </div>

      <!-- 第六行：5个卡片槽 -->
      <div class="card-row">
        <div class="card-slot" v-for="i in 5" :key="'row6-' + i"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 竖屏炉石游戏组件
</script>

<style scoped>
/* 使用相对单位，确保等比例缩放 */
.vertical-hearthstone {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #f0f0f0;
  overflow: auto;
}

.game-container {
  width: 985vmin;
  height: 100vmin;
  display: flex;
  flex-direction: column;
  gap: 2%;
  padding: 2%;
}

.card-row {
  max-height: 90vmin;
  display: flex;
  gap: 2%;
  flex: 1;
}

.card-slot {
  flex: 1;
  border: 2px solid #000;
  background-color: #fff;
  aspect-ratio: 1/1.5;
}

.info-panel {
  flex: 3;
  border: 2px solid #000;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3vmin;
  font-weight: bold;
  text-align: center;
  padding: 1%;
  box-sizing: border-box;
}

.tavern-info {
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
}

.tavern-info > div,
.tavern-info > button {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 2%;
  border-radius: 4px;
  font-size: 3vmin;
}

.tavern-info > button {
  cursor: pointer;
  background-color: #e0e0e0;
  transition: background-color 0.2s;
}

.tavern-info > button:hover {
  background-color: #d0d0d0;
}

.player-info {
  background-color: #f0f8ff;
}

.tavern-info .stats-row {
  display: flex;
  gap: 2%;
  flex: 1;
}

.tavern-info .buttons-row {
  display: flex;
  gap: 2%;
  flex: 1;
}
</style>
