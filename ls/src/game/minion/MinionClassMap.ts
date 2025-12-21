import { Minion } from '../Minion';
import { WrathWeaver } from './demon/WrathWeaver';
import { MoltenRock } from './elemental/MoltenRock';
import { RazorfenGeomancer } from './quilboar/RazorfenGeomancer';
import { SunBaconRelaxer } from './quilboar/SunBaconRelaxer';
import { DeepSeaAngler } from './naga/DeepSeaAngler';
import { PickyEater } from './demon/PickyEater';
import { RisenRider } from './undead/RisenRider';
import { Alleycat } from './beast/Alleycat';
import { Tabbycat } from './beast/Tabbycat';

import { DozyWhelp } from './dragon/DozyWhelp';
import { SouthseaBusker } from './pirate/SouthseaBusker';
import { Lullabot } from './mech/Lullabot';
import { Manasaber } from './beast/Manasaber';
import { HarmlessBonehead } from './undead/HarmlessBonehead';
import { MisfitDragonling } from './dragon/MisfitDragonling';
import { CordPuller } from './mech/CordPuller';
import { BubbleGunner } from './murloc/BubbleGunner';
import { BuzzingVermin } from './beast/BuzzingVermin';
import { DuneDweller } from './elemental/DuneDweller';

/**
 * 随从类映射 - 根据BGS_xxx strId获取对应子类
 */
export const minionClassMapByStrId: Record<string, typeof Minion> = {
  // 愤怒编织者
  BGS_004: WrathWeaver,
  // 熔融岩石
  BGS_127: MoltenRock,
  // 剃刀沼泽地卜师
  BG20_100: RazorfenGeomancer,
  // 晾膘的游客
  BG20_301: SunBaconRelaxer,
  // 深海钓客
  BG23_004: DeepSeaAngler,
  // 挑食魔犬
  BG24_009: PickyEater,
  // 复活的骑兵
  BG25_001: RisenRider,
  // 雄斑虎
  BG_CFM_315: Alleycat,
  // 雌斑虎
  BG_CFM_315t: Tabbycat,
  // 瞌睡雏龙
  BG24_300: DozyWhelp,
  // 南海卖艺者
  BG26_135: SouthseaBusker,
  // 催眠机器人
  BG26_146: Lullabot,
  // 魔刃豹
  BG26_800: Manasaber,
  // 无害的骨颅
  BG28_300: HarmlessBonehead,
  // 错巢龙崽
  BG29_814: MisfitDragonling,
  // 拔线机
  BG29_611: CordPuller,
  // 气泡枪手
  BG31_149: BubbleGunner,
  // 嗡鸣害虫
  BG31_803: BuzzingVermin,
  // 沙丘土著
  BG31_815: DuneDweller,
};

/**
 * 随从类映射 - 根据中文名称获取对应子类
 */
export const minionClassMapByChineseName: Record<string, typeof Minion> = {
  // 愤怒编织者
  愤怒编织者: WrathWeaver,
  // 熔融岩石
  熔融岩石: MoltenRock,
  // 剃刀沼泽地卜师
  剃刀沼泽地卜师: RazorfenGeomancer,
  // 晾膘的游客
  晾膘的游客: SunBaconRelaxer,
  // 深海钓客
  深海钓客: DeepSeaAngler,
  // 挑食魔犬
  挑食魔犬: PickyEater,
  // 复活的骑兵
  复活的骑兵: RisenRider,
  // 雄斑虎
  雄斑虎: Alleycat,
  // 雌斑虎
  雌斑虎: Tabbycat,
  // 瞌睡雏龙
  瞌睡雏龙: DozyWhelp,
  // 南海卖艺者
  南海卖艺者: SouthseaBusker,
  // 催眠机器人
  催眠机器人: Lullabot,
  // 魔刃豹
  魔刃豹: Manasaber,
  // 无害的骨颅
  无害的骨颅: HarmlessBonehead,
  // 错巢龙崽
  错巢龙崽: MisfitDragonling,
  // 拔线机
  拔线机: CordPuller,
  // 气泡枪手
  气泡枪手: BubbleGunner,
  // 嗡鸣害虫
  嗡鸣害虫: BuzzingVermin,
  // 沙丘土著
  沙丘土著: DuneDweller,
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
