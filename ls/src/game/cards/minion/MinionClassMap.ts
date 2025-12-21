import { Minion } from '@/game/Minion';
import type { CardClass } from '@/game/Card';
// 自动导入所有随从类
const minionModules = import.meta.glob('./**/*.ts', { eager: true });

// 提取所有导出的随从类
const minionClasses: Record<string, CardClass> = {};

for (const path in minionModules) {
  // 跳过MinionClassMap.ts本身
  if (path === './MinionClassMap.ts') {
    continue;
  }

  const module = minionModules[path];
  // 处理默认导出和命名导出
  if (module && typeof module === 'object') {
    // 命名导出
    const namedModule = module as Record<string, any>;
    for (const key in namedModule) {
      const exportValue = namedModule[key];
      if (
        exportValue &&
        typeof exportValue === 'function' &&
        Object.getPrototypeOf(exportValue.prototype).constructor === Minion
      ) {
        minionClasses[key] = exportValue as CardClass;
      }
    }
  } else if (module && typeof module === 'function') {
    // 默认导出
    const defaultModule = module as any;
    if (Object.getPrototypeOf(defaultModule.prototype).constructor === Minion) {
      const className = path.split('/').pop()?.replace('.ts', '') || '';
      minionClasses[className] = defaultModule as CardClass;
    }
  }
}

/**
 * 通过 strId 获取对应card类
 * minionClasses中的类都有BASE_DATA属性 有 strId属性
 */
export const getMinionClassByStrId = (strId: string): CardClass | undefined => {
  return Object.values(minionClasses).find(minionClass => {
    if (!minionClass.BASE_DATA) {
      const className =
        Object.keys(minionClasses).find(key => minionClasses[key] === minionClass) || 'Unknown';
      console.error(`ERROR: 随从类 ${className} 缺少 BASE_DATA 属性`);
      return false;
    }

    if (!minionClass.BASE_DATA.strId) {
      const className =
        Object.keys(minionClasses).find(key => minionClasses[key] === minionClass) || 'Unknown';
      console.error(`ERROR: 随从类 ${className} 的 BASE_DATA 缺少 strId 属性`);
      return false;
    }

    return minionClass.BASE_DATA.strId === strId;
  });
};

/**
 * 通过 nameCN 获取对应card类
 * minionClasses中的类都有BASE_DATA属性 有 nameCN属性
 */
export const getMinionClassByNameCN = (nameCN: string): CardClass | undefined => {
  return Object.values(minionClasses).find(minionClass => {
    if (!minionClass.BASE_DATA) {
      const className =
        Object.keys(minionClasses).find(key => minionClasses[key] === minionClass) || 'Unknown';
      console.error(`ERROR: 随从类 ${className} 缺少 BASE_DATA 属性`);
      return false;
    }

    if (!minionClass.BASE_DATA.nameCN) {
      const className =
        Object.keys(minionClasses).find(key => minionClasses[key] === minionClass) || 'Unknown';
      console.error(`ERROR: 随从类 ${className} 的 BASE_DATA 缺少 nameCN 属性`);
      return false;
    }

    return minionClass.BASE_DATA.nameCN === nameCN;
  });
};

/**
 * 获取所有已开发的随从类的strId列表
 */
export const getAllMinionStrIds = (): string[] => {
  const result: string[] = [];

  Object.values(minionClasses).forEach(minionClass => {
    if (!minionClass.BASE_DATA) {
      const className =
        Object.keys(minionClasses).find(key => minionClasses[key] === minionClass) || 'Unknown';
      console.error(`ERROR: 随从类 ${className} 缺少 BASE_DATA 属性`);
      return;
    }

    if (!minionClass.BASE_DATA.strId) {
      const className =
        Object.keys(minionClasses).find(key => minionClasses[key] === minionClass) || 'Unknown';
      console.error(`ERROR: 随从类 ${className} 的 BASE_DATA 缺少 strId 属性`);
      return;
    }

    result.push(minionClass.BASE_DATA.strId);
  });

  return result;
};
