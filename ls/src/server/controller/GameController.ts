import { CurrentGame, MINION_POOL_LIMITS } from '@/server/controller/entity/CurrentGame';
import type { Card } from '@/server/controller/entity/Card';
import { createCurrentGame } from '@/server/db/db_current_game';

// 卡片类映射，key 为 strId，value 为卡片类构造函数
const cardClassesMap: Map<string, new () => any> = new Map();

// 使用 Vite 的 glob 导入功能，获取所有卡片文件
// 使用动态导入（异步）方式
const cardFiles = import.meta.glob('@/server/all_cards/**/*.ts');

export class GameController {
  /**
   * 开始游戏
   * 1、创建 CurrentGame 实例
   * 2、初始化游戏数据（包括随从池、英雄等）
   */
  async startGame() {
    // 1、创建 CurrentGame 实例
    const currentGame = new CurrentGame();
    // 2、初始化游戏数据（包括随从池、英雄等）
    // 加载所有卡片
    await this.loadAllCards();
    cardClassesMap.forEach((CardClass, strId) => {
      const cardInstance: Card = new CardClass();
      // 加载实例
      currentGame.minionInstances.set(strId, cardInstance);
      if (cardInstance.type === 'minion') {
        if (cardInstance.tier) {
          // 加载到随从池
          currentGame.minionPool.set(strId, MINION_POOL_LIMITS[cardInstance.tier]);
        }
      }
    });
    // 添加到db
    createCurrentGame(currentGame);
  }

  /**
   * 加载所有卡片类
   */
  private async loadAllCards() {
    // 存储所有加载 Promise
    const loadPromises = [];

    // 遍历所有卡片文件路径
    for (const filePath in cardFiles) {
      loadPromises.push(this.loadCardFile(filePath));
    }

    // 等待所有卡片加载完成
    await Promise.all(loadPromises);

    console.log(`Total cards loaded: ${cardClassesMap.size}`);
  }

  /**
   * 加载单个卡片文件
   * @param filePath 文件路径
   */
  private async loadCardFile(filePath: string) {
    try {
      // 动态导入模块
      // @ts-ignore
      const module = await cardFiles[filePath]();

      // 处理模块的所有导出
      this.processModuleExports(module, filePath);
    } catch (error) {
      console.error(`Failed to load card file ${filePath}:`, error);
    }
  }

  /**
   * 处理模块的所有导出
   * @param module 模块对象
   * @param filePath 文件路径（用于调试）
   */
  private processModuleExports(module: any, filePath: string) {
    // 处理默认导出
    if (module.default && typeof module.default === 'function' && module.default.prototype) {
      this.processCardClass(module.default, 'default', filePath);
    }

    // 处理命名导出
    for (const [exportName, exportValue] of Object.entries(module)) {
      // 跳过 default 导出（已经处理过）和非类导出
      if (exportName === 'default' || typeof exportValue !== 'function' || !exportValue.prototype) {
        continue;
      }

      // 跳过首字母小写的导出（通常不是类）
      if (exportName.charAt(0).toLowerCase() === exportName.charAt(0)) {
        continue;
      }
      // @ts-ignore
      this.processCardClass(exportValue, exportName, filePath);
    }
  }

  /**
   * 处理单个卡片类
   * @param CardClass 卡片类构造函数
   * @param exportName 导出名称
   * @param filePath 文件路径（用于调试）
   */
  private processCardClass(CardClass: new () => any, exportName: string, filePath: string) {
    try {
      // 创建类的实例
      const instance = new CardClass();

      // 如果有 strId 属性，则添加到映射中
      if (instance.strId) {
        cardClassesMap.set(instance.strId, CardClass);
        console.log(`Loaded card: ${exportName} (${instance.strId}) from ${filePath}`);
      }

      // 如果有 init 方法，则调用
      if (typeof instance.init === 'function') {
        instance.init();
      }
    } catch (error) {
      console.error(`Failed to process card class ${exportName} from ${filePath}:`, error);
    }
  }
}
