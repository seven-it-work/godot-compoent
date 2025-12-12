import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// 使用类型断言来解决vite-plugin-eslint的类型问题
// @ts-ignore
import eslint from 'vite-plugin-eslint'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // eslint(), // 暂时禁用eslint插件，避免无法处理.vue文件的问题
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        })
      ],
    })
  ],
})