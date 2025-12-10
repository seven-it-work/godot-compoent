import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 自动导入 API
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      dts: "src/auto-imports.d.ts",
    }),
    // 自动导入组件
    Components({
      dts: "src/components.d.ts",
      // antd v4 自动导入配置
      dirs: [],
      globs: [],
      resolvers: [
        (componentName: string) => {
          if (componentName.startsWith('A')) {
            return {
              importName: componentName.slice(1),
              path: 'ant-design-vue',
            };
          }
        },
      ],
    }),
  ],
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
    },
  },
  // 配置路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 设置构建目标，支持 ES2021 特性
  build: {
    target: 'es2021',
  },
  // 设置开发服务器目标，支持 ES2021 特性
  server: {
    fs: {
      strict: true,
    },
  },
  // 设置基础路径，适配 GitHub Pages 部署
  base: '/temp_html/',
});
