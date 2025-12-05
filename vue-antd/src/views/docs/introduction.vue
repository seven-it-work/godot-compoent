<template>
  <div class="introduction-page">
    <h1>修仙游戏开发文档</h1>
    <p class="subtitle">Welcome to the cultivation game development documentation</p>
    
    <div class="intro-content">
      <section class="overview">
        <h2>项目概述</h2>
        <p>这是一个基于 Vue 3 + TypeScript + Ant Design Vue 开发的修仙游戏组件库和开发文档。</p>
        <p>本项目提供了一系列用于构建修仙游戏的 UI 组件和功能模块，帮助开发者快速搭建游戏界面和实现核心功能。</p>
      </section>

      <section class="features">
        <h2>主要功能</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>修仙者系统</h3>
            <p>完整的修仙者信息展示和属性管理组件</p>
          </div>
          <div class="feature-card">
            <h3>功法系统</h3>
            <p>功法展示、修炼和效果管理功能</p>
          </div>
          <div class="feature-card">
            <h3>灵根系统</h3>
            <p>灵根属性展示和详情查看功能</p>
          </div>
          <div class="feature-card">
            <h3>战斗系统</h3>
            <p>战斗界面和操作组件</p>
          </div>
        </div>
      </section>

      <section class="getting-started">
        <h2>快速开始</h2>
        <ol>
          <li>安装依赖：<code>npm install</code></li>
          <li>启动开发服务器：<code>npm run dev</code></li>
          <li>访问文档：<code>http://localhost:5173/temp_html/</code></li>
          <li>查看组件示例和 API 文档</li>
        </ol>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// 可以添加一些初始化逻辑
</script>

<style scoped>
.introduction-page {
  max-width: 1000px;
  margin: 0 auto;
}

.subtitle {
  color: #666;
  margin-bottom: 40px;
}

.intro-content {
  line-height: 1.8;
}

section {
  margin-bottom: 40px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.feature-card {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

code {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}
</style>