import { Minion } from '../Minion';
import { WrathWeaver } from './WrathWeaver';
import { MoltenRock } from './MoltenRock';
import { RazorfenGeomancer } from './RazorfenGeomancer';
import { SunBaconRelaxer } from './SunBaconRelaxer';
import { DeepSeaAngler } from './DeepSeaAngler';
import { PickyEater } from './PickyEater';
import { RisenRider } from './RisenRider';
import { Alleycat } from './Alleycat';
import { DozyWhelp } from './DozyWhelp';
import { SouthseaBusker } from './SouthseaBusker';
import { Lullabot } from './Lullabot';
import { Manasaber } from './Manasaber';
import { HarmlessBonehead } from './HarmlessBonehead';
import { MisfitDragonling } from './MisfitDragonling';
import { CordPuller } from './CordPuller';
import { BubbleGunner } from './BubbleGunner';
import { BuzzingVermin } from './BuzzingVermin';
import { DuneDweller } from './DuneDweller';

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
