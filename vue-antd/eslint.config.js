import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import vuePlugin from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  {
    ignores: ["node_modules", "dist", ".git", ".vscode"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      vue: vuePlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // ESLint 基础规则
      "no-unused-vars": "warn",
      "no-console": "warn",

      // TypeScript 规则
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",

      // Vue 规则
      "vue/multi-word-component-names": "off",
      "vue/no-unused-vars": "warn",

      // Prettier 规则
      "prettier/prettier": "error",
    },
  },
]);
