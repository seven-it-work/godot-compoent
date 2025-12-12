import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import vuePlugin from 'eslint-plugin-vue';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // 忽略文件配置
  {
    ignores: ['node_modules/**', 'dist/**', '*.d.ts', '*.js'],
  },

  // 共享配置 - 包含所有插件和规则
  {
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      vue: vuePlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'vue/multi-word-component-names': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },

  // TypeScript 文件特定配置
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
    },
  },

  // Vue 文件特定配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: {
          ts: typescriptParser,
          js: 'espree',
        },
      },
    },
  },
];