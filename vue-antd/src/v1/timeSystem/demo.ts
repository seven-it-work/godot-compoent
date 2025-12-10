import { autoRegisterTimeFlowHandler } from './impl';
import type { TimeFlowHandler } from './define';
import { getGameTimeInstance } from './impl';

// 1. 定义修仙者类（简化版）
export class Cultivator {
  name: string;
  cultivationLevel: number;
  qi: number;

  constructor(name: string) {
    this.name = name;
    this.cultivationLevel = 1;
    this.qi = 100;
  }

  // 修炼方法
  cultivate(): void {
    this.qi += 50;
    console.log(`${this.name} 修炼了一天，增加了50点灵气，当前灵气：${this.qi}`);
    
    // 每1000点灵气升级
    if (this.qi >= 1000) {
      this.cultivationLevel++;
      this.qi -= 1000;
      console.log(`${this.name} 突破了！当前境界：${this.cultivationLevel}层`);
    }
  }
}

// 2. 创建修仙者实例
const cultivator = new Cultivator('张三');

// 3. 定义并装饰时间流逝处理器
@autoRegisterTimeFlowHandler
export class CultivatorDailyCultivationHandler implements TimeFlowHandler {
  private cultivator: Cultivator;

  constructor(cultivator: Cultivator) {
    this.cultivator = cultivator;
  }

  // 每日执行的动作
  executeAction(): void {
    console.log(`\n=== 新的一天开始了！===`);
    this.cultivator.cultivate();
  }
}

// 4. 初始化游戏时间
const gameTime = getGameTimeInstance();

// 5. 实例化处理器（自动注册）
console.log('实例化修仙者每日修炼处理器...');
new CultivatorDailyCultivationHandler(cultivator);

// 6. 模拟时间流逝，触发天数变化
console.log('\n=== 模拟时间流逝 ===');
console.log('当前游戏时间:', gameTime.getFormattedTime());

// 增加2天的游戏时间，触发两次每日处理
for (let i = 0; i < 2; i++) {
  console.log('\n增加一天游戏时间...');
  gameTime.addTime(24 * 60 * 60 * 1000); // 增加一天
  console.log('当前游戏时间:', gameTime.getFormattedTime());
}

// 7. 查看所有注册的处理器
console.log('\n=== 所有注册的处理器 ===');
const handlerManager = gameTime.getTimeFlowHandlerManager();
const handlers = handlerManager.getAllHandlers();
console.log(`共注册了 ${handlers.length} 个处理器`);
