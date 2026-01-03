#!/usr/bin/env node

// 测试运行器，用于处理TypeScript路径映射
const { execSync } = require('child_process');
const path = require('path');

// 获取项目根目录
const projectRoot = path.resolve(__dirname);

// 运行tsx并指定tsconfig.json
const command = `npx tsx --tsconfig ${projectRoot}/tsconfig.json ${projectRoot}/src/server/controller/BattleController.test.ts`;

console.log(`正在运行测试: ${command}`);

try {
  const output = execSync(command, { encoding: 'utf-8', cwd: projectRoot });
  console.log(output);
  console.log('测试运行完成！');
} catch (error) {
  console.error('测试运行失败:');
  console.error(error.stdout?.toString() || error.message);
  process.exit(1);
}
