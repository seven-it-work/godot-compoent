<template>
  <div class="code-block">
    <div class="code-header">
      <span class="language-tag">{{ language }}</span>
      <a-button type="text" size="small" @click="handleCopy" :loading="copying">
        {{ copyText }}
      </a-button>
    </div>
    <div class="code-content">
      <pre
        ref="codePre"
      ><code :class="`language-${language}`">{{ code }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import "highlight.js/styles/github.css"; // 使用GitHub风格的主题

// 注册语言
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("html", html);
hljs.registerLanguage("css", css);
hljs.registerLanguage("vue", html); // Vue使用html高亮

// 定义组件属性
const props = withDefaults(
  defineProps<{
    // 代码内容
    code: string;
    // 编程语言
    language?: string;
  }>(),
  {
    language: "javascript",
  }
);

// 定义组件事件
const emit = defineEmits<{
  // 复制成功事件
  "copy-success": [];
  // 复制失败事件
  "copy-error": [error: string];
}>();

// 状态管理
const codePre = ref<HTMLElement | null>(null);
const copying = ref(false);
const copyText = ref("复制");

// 初始化代码高亮
const initHighlight = () => {
  if (codePre.value) {
    hljs.highlightElement(codePre.value.querySelector("code")!);
  }
};

// 复制代码
const handleCopy = async () => {
  try {
    copying.value = true;
    copyText.value = "复制中...";

    // 使用浏览器的剪贴板API复制代码
    await navigator.clipboard.writeText(props.code);

    copyText.value = "已复制!";
    emit("copy-success");

    // 3秒后恢复默认文本
    setTimeout(() => {
      copyText.value = "复制";
    }, 3000);
  } catch (error) {
    copyText.value = "复制失败";
    emit("copy-error", (error as Error).message);

    // 3秒后恢复默认文本
    setTimeout(() => {
      copyText.value = "复制";
    }, 3000);
  } finally {
    copying.value = false;
  }
};

// 监听代码变化，重新高亮
watch(
  () => props.code,
  () => {
    // 使用nextTick确保DOM更新后再高亮
    setTimeout(() => {
      initHighlight();
    }, 0);
  }
);

// 监听语言变化，重新高亮
watch(
  () => props.language,
  () => {
    // 使用nextTick确保DOM更新后再高亮
    setTimeout(() => {
      initHighlight();
    }, 0);
  }
);

// 组件挂载后初始化高亮
onMounted(() => {
  initHighlight();
});
</script>

<style scoped>
.code-block {
  position: relative;
  background-color: #f5f5f5;
  border-radius: 6px;
  overflow: hidden;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #e8e8e8;
  border-bottom: 1px solid #d9d9d9;
  font-size: 14px;
}

.language-tag {
  font-weight: 500;
  color: #555;
  font-family: monospace;
}

.code-content {
  overflow-x: auto;
}

pre {
  margin: 0;
  padding: 16px;
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  font-size: 14px;
  line-height: 1.6;
  background-color: transparent;
}

code {
  background-color: transparent !important;
  padding: 0 !important;
}

/* 自定义滚动条 */
.code-content::-webkit-scrollbar {
  height: 8px;
}

.code-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.code-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.code-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
