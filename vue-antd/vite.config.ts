import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 设置基础路径，适配 GitHub Pages 部署
  base: '/temp_html/',
});
