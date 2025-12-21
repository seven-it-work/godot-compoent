import { Minion } from '../Minion';

// 自动导入所有随从类
const minionModules = import.meta.glob('./**/*.ts', { eager: true });

// 提取所有导出的随从类
const minionClasses: Record<string, typeof Minion> = {};

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
        minionClasses[key] = exportValue as typeof Minion;
      }
    }
  } else if (module && typeof module === 'function') {
    // 默认导出
    const defaultModule = module as any;
    if (Object.getPrototypeOf(defaultModule.prototype).constructor === Minion) {
      const className = path.split('/').pop()?.replace('.ts', '') || '';
      minionClasses[className] = defaultModule as typeof Minion;
    }
  }
}

// 确保minionClasses中的所有类都已正确加载
console.log('Loaded minion classes:', Object.keys(minionClasses));

// 遍历minionClasses对象
Object.entries(minionClasses).forEach(([className, minionClass]) => {
  console.log(`minionClass ${className}:`, minionClass.BASE_DATA);
});

/**
 * 通过 strId 获取对应card类
 * minionClasses中的类都有BASE_DATA属性 有 strId属性
 */
export const getMinionClassByStrId = (strId: string): typeof Minion | undefined => {
  return Object.values(minionClasses).find(minionClass => {
    if (!minionClass.BASE_DATA) {
      const className =
        Object.keys(minionClasses).find(key => minionClasses[key] === minionClass) || 'Unknown';
      console.error(`ERROR: 随从类 ${className} 缺少 BASE_DATA 属性`);
      return false;
    }
    return minionClass.BASE_DATA.strId === strId;
  });
};

/**
 * 通过 nameCN 获取对应card类
 * minionClasses中的类都有BASE_DATA属性 有 nameCN属性
 */
export const getMinionClassByNameCN = (nameCN: string): typeof Minion | undefined => {
  return Object.values(minionClasses).find(minionClass => {
    if (!minionClass.BASE_DATA) {
      const className =
        Object.keys(minionClasses).find(key => minionClasses[key] === minionClass) || 'Unknown';
      console.error(`ERROR: 随从类 ${className} 缺少 BASE_DATA 属性`);
      return false;
    }
    return minionClass.BASE_DATA.nameCN === nameCN;
  });
};
