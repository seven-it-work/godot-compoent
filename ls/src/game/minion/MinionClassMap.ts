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
      if (exportValue && typeof exportValue === 'function' && 
          Object.getPrototypeOf(exportValue.prototype).constructor === Minion) {
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

// 类型断言，确保TypeScript知道这些类存在
type MinionClassKeys = 'Alleycat' | 'BuzzingVermin' | 'Manasaber' | 'Tabbycat' | 
                       'PickyEater' | 'WrathWeaver' | 
                       'DozyWhelp' | 'MisfitDragonling' | 
                       'DuneDweller' | 'MoltenRock' | 
                       'CordPuller' | 'Lullabot' | 
                       'BubbleGunner' | 
                       'DeepSeaAngler' | 
                       'SouthseaBusker' | 
                       'RazorfenGeomancer' | 'SunBaconRelaxer' | 
                       'HarmlessBonehead' | 'RisenRider';

const typedMinionClasses = minionClasses as Record<MinionClassKeys, typeof Minion>;


/**
 * 随从类映射 - 根据BGS_xxx strId获取对应子类
 */
export const minionClassMapByStrId: Record<string, typeof Minion> = {
  // 愤怒编织者
  BGS_004: typedMinionClasses.WrathWeaver,
  // 熔融岩石
  BGS_127: typedMinionClasses.MoltenRock,
  // 剃刀沼泽地卜师
  BG20_100: typedMinionClasses.RazorfenGeomancer,
  // 晾膘的游客
  BG20_301: typedMinionClasses.SunBaconRelaxer,
  // 深海钓客
  BG23_004: typedMinionClasses.DeepSeaAngler,
  // 挑食魔犬
  BG24_009: typedMinionClasses.PickyEater,
  // 复活的骑兵
  BG25_001: typedMinionClasses.RisenRider,
  // 雄斑虎
  BG_CFM_315: typedMinionClasses.Alleycat,
  // 雌斑虎
  BG_CFM_315t: typedMinionClasses.Tabbycat,
  // 瞌睡雏龙
  BG24_300: typedMinionClasses.DozyWhelp,
  // 南海卖艺者
  BG26_135: typedMinionClasses.SouthseaBusker,
  // 催眠机器人
  BG26_146: typedMinionClasses.Lullabot,
  // 魔刃豹
  BG26_800: typedMinionClasses.Manasaber,
  // 无害的骨颅
  BG28_300: typedMinionClasses.HarmlessBonehead,
  // 错巢龙崽
  BG29_814: typedMinionClasses.MisfitDragonling,
  // 拔线机
  BG29_611: typedMinionClasses.CordPuller,
  // 气泡枪手
  BG31_149: typedMinionClasses.BubbleGunner,
  // 嗡鸣害虫
  BG31_803: typedMinionClasses.BuzzingVermin,
  // 沙丘土著
  BG31_815: typedMinionClasses.DuneDweller,
};

/**
 * 随从类映射 - 根据中文名称获取对应子类
 */
export const minionClassMapByChineseName: Record<string, typeof Minion> = {
  // 愤怒编织者
  愤怒编织者: typedMinionClasses.WrathWeaver,
  // 熔融岩石
  熔融岩石: typedMinionClasses.MoltenRock,
  // 剃刀沼泽地卜师
  剃刀沼泽地卜师: typedMinionClasses.RazorfenGeomancer,
  // 晾膘的游客
  晾膘的游客: typedMinionClasses.SunBaconRelaxer,
  // 深海钓客
  深海钓客: typedMinionClasses.DeepSeaAngler,
  // 挑食魔犬
  挑食魔犬: typedMinionClasses.PickyEater,
  // 复活的骑兵
  复活的骑兵: typedMinionClasses.RisenRider,
  // 雄斑虎
  雄斑虎: typedMinionClasses.Alleycat,
  // 雌斑虎
  雌斑虎: typedMinionClasses.Tabbycat,
  // 瞌睡雏龙
  瞌睡雏龙: typedMinionClasses.DozyWhelp,
  // 南海卖艺者
  南海卖艺者: typedMinionClasses.SouthseaBusker,
  // 催眠机器人
  催眠机器人: typedMinionClasses.Lullabot,
  // 魔刃豹
  魔刃豹: typedMinionClasses.Manasaber,
  // 无害的骨颅
  无害的骨颅: typedMinionClasses.HarmlessBonehead,
  // 错巢龙崽
  错巢龙崽: typedMinionClasses.MisfitDragonling,
  // 拔线机
  拔线机: typedMinionClasses.CordPuller,
  // 气泡枪手
  气泡枪手: typedMinionClasses.BubbleGunner,
  // 嗡鸣害虫
  嗡鸣害虫: typedMinionClasses.BuzzingVermin,
  // 沙丘土著
  沙丘土著: typedMinionClasses.DuneDweller,
};

/**
 * 随从酒馆标记映射 - 标记哪些随从可以在酒馆中出现
 * true: 可以在酒馆中出现
 * false: 不能在酒馆中出现（如token随从）
 */
export const isTavernMinion: Record<string, boolean> = {
  // 愤怒编织者
  BGS_004: true,
  // 熔融岩石
  BGS_127: true,
  // 剃刀沼泽地卜师
  BG20_100: true,
  // 晾膘的游客
  BG20_301: true,
  // 深海钓客
  BG23_004: true,
  // 挑食魔犬
  BG24_009: true,
  // 复活的骑兵
  BG25_001: true,
  // 雄斑虎 - 可以在酒馆中出现
  BG_CFM_315: true,
  // 雌斑虎 - 不能在酒馆中出现（token随从）
  BG_CFM_315t: false,
  // 瞌睡雏龙
  BG24_300: true,
  // 南海卖艺者
  BG26_135: true,
  // 催眠机器人
  BG26_146: true,
  // 魔刃豹
  BG26_800: true,
  // 无害的骨颅
  BG28_300: true,
  // 错巢龙崽
  BG29_814: true,
  // 拔线机
  BG29_611: true,
  // 气泡枪手
  BG31_149: true,
  // 嗡鸣害虫
  BG31_803: true,
  // 沙丘土著
  BG31_815: true,
};
