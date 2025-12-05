<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面未找到</h2>
      <p class="error-description">抱歉，您访问的页面不存在或已被移除。</p>
      <div class="error-actions">
        <button @click="goHome" class="home-button">返回首页</button>
        <button @click="goBack" class="back-button">返回上一页</button>
      </div>
      <div class="error-illustration">
        <!-- 简单的插图表示迷路的角色 -->
        <div class="character"></div>
        <div class="thought-bubble">我迷路了吗？</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
  padding: 20px;
}

.not-found-content {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
}

.error-code {
  font-size: 10rem;
  font-weight: bold;
  color: #667eea;
  margin: 0;
  line-height: 1;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.1);
}

.error-title {
  font-size: 2.5rem;
  color: #333;
  margin: 20px 0 10px;
}

.error-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.error-actions {
  margin-bottom: 40px;
}

.home-button, .back-button {
  padding: 12px 24px;
  margin: 0 10px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.home-button {
  background: #667eea;
  color: white;
}

.home-button:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.back-button {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.back-button:hover {
  background: #f0f4ff;
  transform: translateY(-2px);
}

.error-illustration {
  position: relative;
  margin-top: 30px;
}

.character {
  width: 80px;
  height: 80px;
  background: #ffd93d;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.character::before,
.character::after {
  content: '';
  position: absolute;
  background: #333;
  border-radius: 50%;
}

/* 眼睛 */
.character::before {
  width: 15px;
  height: 15px;
  top: 25px;
  left: 20px;
  box-shadow: 25px 0 0 #333;
}

/* 嘴巴 */
.character::after {
  width: 30px;
  height: 15px;
  top: 45px;
  left: 25px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border: 3px solid #333;
  border-top: none;
}

.thought-bubble {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 10px 15px;
  border-radius: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
}

.thought-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 10px 10px 0;
  border-style: solid;
  border-color: white transparent transparent;
}
</style>