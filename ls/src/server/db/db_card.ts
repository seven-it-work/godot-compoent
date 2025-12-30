import { Card } from '@/server/controller/entity/Card';
import type { Minion } from '@/server/controller/entity/Minion';
import { IdGenerator } from '@/utils/IdGenerator';
import { cloneDeep } from 'lodash';
/**
 * 基础卡片数据库，存入了所有的基础卡片
 * db 获取禁止获取原数据，必须是深拷贝数据
 */

// key=strId,value=Card
const db: Map<string, Card> = new Map();

/**
 * 创建卡片
 * @param card 卡片对象
 * @returns 创建的卡片对象
 */
function createCard(card: Card): Card {
  if (db.has(card.strId)) {
    throw new Error(`Card with strId ${card.strId} already exists`);
  }
  db.set(card.strId, card);
  return card;
}

/**
 * 根据strId获取卡片（深拷贝，这样就不会改变db中的数据）
 * @param strId 卡片标识
 * @returns 卡片对象或undefined
 */
function getCardByStrId(strId: string): Card {
  const card = db.get(strId);

  if (!card) {
    throw new Error(`Card with strId ${strId} not found`);
  }
  card.id = IdGenerator.generateRandomId();
  return cloneDeep(card);
}
/**
 * 获取存在酒馆中的随从实例list
 * @param filterFunc 可选的过滤函数，用于进一步筛选随从
 * @returns 存在酒馆中的随从实例list（深拷贝）
 */
function getMinionsInTavern(filterFunc?: (card: Card) => boolean): Minion[] {
  let cards = Array.from(db.values());
  console.log('getMinionsInTavern', JSON.stringify(cards));
  return cards
    .filter(card => card.type === 'minion')
    .filter(card => card.inTavern)
    .filter(card => {
      // 如果提供了过滤函数，则应用该过滤
      if (filterFunc) {
        return filterFunc(card);
      }
      return true;
    })
    .map(card => {
      card.id = IdGenerator.generateRandomId();
      return cloneDeep(card);
    }) as Minion[];
}

export default {
  dbInit,
  createCard,
  getCardByStrId,
  getMinionsInTavern,
};
// 下面都是初始化的代码

// 使用 Vite 的 glob 导入功能，获取所有卡片文件
// 使用动态导入（异步）方式
const cardFiles = import.meta.glob('@/server/all_cards/**/*.ts');

async function dbInit() {
  await loadAllCards();
}
/**
 * 加载所有卡片类
 */
async function loadAllCards() {
  // 存储所有加载 Promise
  const loadPromises = [];

  // 遍历所有卡片文件路径
  for (const filePath in cardFiles) {
    loadPromises.push(loadCardFile(filePath));
  }
  // 等待所有卡片加载完成
  await Promise.all(loadPromises);

  console.log(`Total cards loaded: ${db.size}`);
}

/**
 * 加载单个卡片文件
 * @param filePath 文件路径
 */
async function loadCardFile(filePath: string) {
  try {
    // 动态导入模块
    // @ts-ignore
    const module = await cardFiles[filePath]();

    // 处理模块的所有导出
    await processModuleExports(module, filePath);
  } catch (error) {
    console.error(`Failed to load card file ${filePath}:`, error);
  }
}

/**
 * 处理模块的所有导出
 * @param module 模块对象
 * @param filePath 文件路径（用于调试）
 */
async function processModuleExports(module: any, filePath: string) {
  // 处理默认导出
  if (module.default && typeof module.default === 'function' && module.default.prototype) {
    await processCardClass(module.default, 'default', filePath);
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
    await processCardClass(exportValue, exportName, filePath);
  }
}

/**
 * 处理单个卡片类
 * @param CardClass 卡片类构造函数
 * @param exportName 导出名称
 * @param filePath 文件路径（用于调试）
 */
async function processCardClass(CardClass: new () => Card, exportName: string, filePath: string) {
  try {
    // 创建类的实例
    const instance = new CardClass();
    // 如果有 strId 属性，则添加到映射中
    if (instance.strId) {
      db.set(instance.strId, instance);
    }
  } catch (error) {
    console.error(`Failed to process card class ${exportName} from ${filePath}:`, error);
  }
}
