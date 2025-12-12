import typescriptEslint from '@typescript-eslint/eslint-plugin';



import typescriptParser from '@typescript-eslint/parser';



import prettier from 'eslint-plugin-prettier';



import prettierConfig from 'eslint-config-prettier';



export default [

  // 共享规则



  {

    ignores: ['node_modules/**', 'dist/**', '*.d.ts'],



    plugins: {

      prettier,

    },



    rules: {

      // Prettier规则



      ...prettierConfig.rules,



      'prettier/prettier': 'error',



      // 基础规则



      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',



      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    },

  },



  // TypeScript文件配置



  {

    files: ['src/**/*.js', 'src/**/*.ts'],



    languageOptions: {

      ecmaVersion: 'latest',



      sourceType: 'module',



      parser: typescriptParser,

    },



    plugins: {

      '@typescript-eslint': typescriptEslint,

    },



    rules: {

      // TypeScript规则



      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],



      'no-unused-vars': 'off',

    },

  },



  // Vue文件配置



  {

    files: ['src/**/*.vue'],



    languageOptions: {

      ecmaVersion: 'latest',



      sourceType: 'module',

    },



    rules: {

      // Vue规则



      'vue/multi-word-component-names': 'off',

    },

  },

];

