import { Card, card_utils } from '@/server/controller/entity/Card';
import type { CurrentGame } from '@/server/controller/entity/CurrentGame';
import type { Buff } from './Buff';
export const minion_utils = {
  getMinionTypes(minionTypes: string[]): MinionType[] {
    if (minionTypes.length === 0) {
      return [];
    }
    let result: MinionType[] = [];
    minionTypes.forEach(type => {
      if (!MINION_TYPES.includes(type as MinionType)) {
        throw new Error(`minionTypes must be one of ${MINION_TYPES.join(', ')}`);
      }
      result.push(type as MinionType);
    });
    if (result.length >= MINION_TYPES.length - 2) {
      result = ['all'];
    }
    return result;
  },
  initMinionData(minion: Minion, data: any) {
    card_utils.initCardData(minion, data);
    minion.minionTypes = minion_utils.getMinionTypes(data.minionTypes);
    if (data.mechanics && data.mechanics.includes('mechanics')) {
      minion.hasBattlecry = true;
    }
    minion.health = data.health;
    minion.attack = data.attack;
  },
};

export class Minion extends Card {
  type: 'minion' = 'minion';
  // 购买价格（随从默认3）
  cardPrice: number = 3;
  // 出售价格（随从默认1）
  sellPrice: number = 1;

  // 随从类型
  minionTypes: MinionType[] = [];
  // 随从基础生命值
  health: number = 0;
  // 随从基础攻击值
  attack: number = 0;
  // 战斗生命值(战斗开始时需要初始化)
  fightHealth: number = 0;
  //是否存在战吼
  hasBattlecry: boolean = false;
  // 属性加成
  buffs: Buff[] = [];
  // 临时属性加成
  tempBuffs: Buff[] = [];

  // 执行战吼
  battlecry(_currentGame: CurrentGame) {
    if (!this.hasBattlecry) {
      return;
    }
    console.log('执行战吼', this.strId);
  }
  // 战斗开始时
  战斗开始时(_currentGame: CurrentGame) {
    this.fightHealth = this.getHealth();
  }

  getAttack(): number {
    let result = this.attack;
    this.buffs.forEach(buff => {
      if (buff.attackBonus) {
        result += buff.attackBonus;
      }
    });
    this.tempBuffs.forEach(buff => {
      if (buff.attackBonus) {
        result += buff.attackBonus;
      }
    });
    return result;
  }

  getHealth(): number {
    if (this.location === 'fighting') {
      return this.fightHealth;
    }
    let result = this.health;
    this.buffs.forEach(buff => {
      if (buff.healthBonus) {
        result += buff.healthBonus;
      }
    });
    this.tempBuffs.forEach(buff => {
      if (buff.healthBonus) {
        result += buff.healthBonus;
      }
    });
    return result;
  }
  getKeywords(): MinionKeyword[] {
    return [];
  }

  getMinionCnTypes(): string[] {
    if (this.minionTypes.length === 0) {
      return [];
    }
    return this.minionTypes.map(type => {
      switch (type) {
        case 'beast':
          return '野兽';
        case 'mech':
          return '机械';
        case 'murloc':
          return '鱼人';
        case 'demon':
          return '恶魔';
        case 'dragon':
          return '龙';
        case 'pirate':
          return '海盗';
        case 'undead':
          return '亡灵';
        case 'naga':
          return '纳迦';
        case 'quilboar':
          return '野猪人';
        case 'elemental':
          return '元素';
        case 'all':
          return '全部';
        case 'none':
          return '中立';
      }
    });
  }
}

/**
 * 所有随从类型的运行时数组
 * 用于获取所有 MinionType 的 key
 */
export const MINION_TYPES = [
  'beast', // 野兽
  'mech', // 机械
  'murloc', // 鱼人
  'demon', // 恶魔
  'dragon', // 龙
  'pirate', // 海盗
  'undead', // 亡灵
  'naga', // 纳迦
  'quilboar', // 野猪人
  'elemental', // 元素
  'all', // 全部
  'none', // 中立
] as const;

/**
 * 随从类型
 * 从 MINION_TYPES 数组推导出联合类型，确保类型和运行时值的一致性
 * 野兽、机械、鱼人、恶魔、龙、海盗、亡灵、纳迦、野猪人、元素、全部、中立
 */
export type MinionType = (typeof MINION_TYPES)[number];
/**
 * 随从关键词 - 定义随从的特殊能力
 */
export type MinionKeyword =
  | 'taunt' // 嘲讽 - 必须先被攻击
  | 'divine_shield' // 圣盾 - 免疫第一次伤害
  | 'windfury' // 风怒 - 每回合可以攻击两次
  | 'super_windfury' // 超级风怒 - 每回合可以攻击多次
  | 'stealth' // 潜行 - 不会被攻击，除非主动攻击
  | 'venomous' // 烈毒 - 攻击时消灭目标，只能使用一次
  | 'poisonous' // 剧毒 - 攻击时消灭目标
  | 'reborn'; // 复生 - 死亡后以1点生命值复活

export const MinionKeywordCN: Record<MinionKeyword, string> = {
  taunt: '嘲讽',
  divine_shield: '圣盾',
  windfury: '风怒',
  super_windfury: '超级风怒',
  stealth: '潜行',
  venomous: '烈毒',
  poisonous: '剧毒',
  reborn: '复生',
};

/**
 * 基础关键词
 * 嘲讽、圣盾、风怒、潜行、烈毒、复生
 */
export type 基础关键词 = ['taunt', 'divine_shield', 'windfury', 'stealth', 'venomous', 'reborn'];
