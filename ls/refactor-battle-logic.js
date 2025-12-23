import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 BattleManager.ts 文件
const battleManagerPath = join(__dirname, 'src/game/BattleManager.ts');
const battleManagerContent = readFileSync(battleManagerPath, 'utf8');

// 读取 BattleScene.vue 文件
const battleScenePath = join(__dirname, 'src/views/ls/components/BattleScene.vue');
const battleSceneContent = readFileSync(battleScenePath, 'utf8');

// 提取 BattleManager.ts 中的类型定义和类定义
const typeDefinitions = battleManagerContent.match(/(export enum|export interface|export type)[\s\S]+?(?=export class)/s)?.[0] || '';
const classDefinition = battleManagerContent.match(/export class[\s\S]+?(?=export )/s)?.[0] || '';

// 处理类型定义，移除 export 关键字，因为它们将在组件内部使用
const processedTypeDefinitions = typeDefinitions
  .replace(/export (enum|interface|type)/g, '$1')
  .trim();

// 处理类定义，提取静态方法的实现
const methodImplementations = classDefinition
  .match(/static executeBattle[\s\S]+?(?=private static)/s)?.[0] || '';

// 提取所有私有方法
const privateMethods = classDefinition.match(/private static[\s\S]+/s)?.[0] || '';

// 处理方法，移除 static 和 private 关键字，改为普通函数
const processedMethods = (methodImplementations + privateMethods)
  .replace(/static /g, '')
  .replace(/private /g, '')
  .replace(/class BattleManager \{/g, '')
  .replace(/\}/g, '')
  .trim();

// 替换 BattleScene.vue 中的内容
const updatedBattleSceneContent = battleSceneContent
  // 移除对 BattleManager 的导入
  .replace(/import \{ BattleManager, type BattleResult \} from '\.\.\./\.\./\.\./game/BattleManager';\n/, '')
  // 在 script setup 中添加类型定义
  .replace(/<script setup lang="ts">/g, `<script setup lang="ts">\n${processedTypeDefinitions}\n`) 
  // 添加战斗方法
  .replace(/\/\/ 暴露方法给父组件\ndefineExpose\({/g, `${processedMethods}\n\n// 暴露方法给父组件\ndefineExpose\({`)
  // 修改 executeBattle 调用，直接调用内部函数
  .replace(/const battleExecutionResult = BattleManager.executeBattle\(/g, 'const battleExecutionResult = executeBattle(');

// 写入更新后的 BattleScene.vue
writeFileSync(battleScenePath, updatedBattleSceneContent, 'utf8');

// 删除 BattleManager.ts 文件
unlinkSync(battleManagerPath);

console.log('重构完成！BattleManager.ts 中的所有逻辑已合并到 BattleScene.vue 中，原文件已删除。');
