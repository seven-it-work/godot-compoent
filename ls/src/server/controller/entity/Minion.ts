import { Card, card_utils } from '@/server/controller/entity/Card';
import type { Buff } from './Buff';
import type { Player } from './Player';
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
  getKeywords(keywords: string[]): MinionKeyword[] {
    const key = Object.keys(MinionKeywordCN) as MinionKeyword[];
    return keywords
      .map(keyword => {
        if (key.includes(keyword as MinionKeyword)) {
          return keyword as MinionKeyword;
        }
        return undefined;
      })
      .filter(keyword => keyword !== undefined) as MinionKeyword[];
  },
  initMinionData(minion: Minion, data: any) {
    card_utils.initCardData(minion, data);
    minion.minionTypes = minion_utils.getMinionTypes(data.minionTypes);
    if (data['mechanics']) {
      const dataMechanics = data['mechanics'];
      minion.keywords = minion_utils.getKeywords(dataMechanics);
      if (dataMechanics.includes('BATTLECRY')) {
        minion.effectKeywords.push('BATTLECRY');
      }
      if (dataMechanics.includes('DEATHRATTLE')) {
        minion.effectKeywords.push('DEATHRATTLE');
      }
      if (dataMechanics.includes('CHOOSE_ONE')) {
        minion.effectKeywords.push('CHOOSE_ONE');
      }
      if (dataMechanics.includes('MAGNETIC')) {
        minion.effectKeywords.push('MAGNETIC');
      }
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

  // 关键词
  keywords: MinionKeyword[] = [];
  // 临时关键词
  tempKeywords: MinionKeyword[] = [];
  // 随从类型
  minionTypes: MinionType[] = [];
  // 随从基础生命值
  health: number = 0;
  // 随从基础攻击值
  attack: number = 0;
  // 战斗生命值(战斗开始时需要初始化)
  fightHealth: number = 0;
  // 效果关键词（战吼、亡语）
  effectKeywords: EffectKeyword[] = [];
  // 属性加成
  buffs: Buff[] = [];
  // 临时属性加成
  tempBuffs: Buff[] = [];
  // 是否已攻击
  hasAttacked: boolean = false;
  // 是否立刻攻击
  isImmediateAttack: boolean = false;
  // 移除前需要处理的数据
  removeRattleData: any = {};

  // 执行战吼
  battlecry(_player: Player) {
    if (!this.effectKeywords.includes('BATTLECRY')) {
      return;
    }
    console.log('执行战吼', this.strId);
  }
  /**
   * 执行亡语效果
   * @param player 死亡随从所属的玩家（可以是当前玩家或敌方玩家）
   */
  deathrattle(_攻击的随从: Minion, _player: Player) {
    if (!this.effectKeywords.includes('DEATHRATTLE')) {
      return;
    }
  }
  /**
   * 友方死亡随从监听
   * @param _player player
   */
  友方死亡随从监听(_player: Player, _死亡的随从: Minion) {}
  // 战斗开始时
  战斗开始时(_player: Player) {
    this.fightHealth = this.getHealth(_player);
  }
  // 回合开始时
  回合开始时(_player: Player) {
    this.hasAttacked = false;
  }
  /**
   * 玩家受到伤害触发
   */
  玩家伤害监听触发(_player: Player, _伤害值: number) {
    // 子类可以重写此方法
  }
  /**
   * 被攻击前触发
   */
  onAttacked(_player: Player) {
    // 子类可以重写此方法
  }

  /**
   * 添加属性加成
   * @param buff 属性加成
   * @param isTemp 是否临时属性加成
   */
  addBuff(buff: Buff, isTemp: boolean = false) {
    // 需要将属性加成应用到战斗生命值
    if (buff.healthBonus) {
      this.fightHealth += buff.healthBonus || 0;
    }
    if (isTemp) {
      this.tempBuffs.push(buff);
    } else {
      this.buffs.push(buff);
    }
  }

  /**
   * 获取随从攻击值
   * @param player 随从所属的玩家
   * @returns 随从攻击值
   */
  getAttack(player: Player): number {
    if (player == undefined) {
      debugger;
    }
    let result = this.isGolden ? this.attack * 2 : this.attack;
    if (this.hasMinionType('beast')) {
      result += player.beastBonus.atk;
    }
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

  getHealth(player: Player, 是否获取生命值上限: boolean = false): number {
    if (player == undefined) {
      debugger;
    }
    if (this.location === 'fighting' && !是否获取生命值上限) {
      return this.fightHealth;
    }
    let result = this.isGolden ? this.health * 2 : this.health;
    if (this.hasMinionType('beast')) {
      result += player.beastBonus.hp;
    }
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

  hasKeyword(keyword: MinionKeyword): boolean {
    return this.keywords.includes(keyword) || this.tempKeywords.includes(keyword);
  }

  /**
   * 检查随从是否具有指定的随从类型
   * @param types - 要检查的随从类型，可以是单个字符串或字符串数组
   * @returns 如果随从具有任何指定类型，则返回true，否则返回false
   */
  hasMinionType(types: string | string[]): boolean {
    // 将输入转换为数组
    const typesArray = Array.isArray(types) ? types : [types];
    // 将输入类型转换为小写，以便与minionTypes中的类型匹配
    const lowerTypes = typesArray.map(type => type.toLowerCase());
    // 检查随从类型是否包含任何指定类型
    return this.minionTypes.some(type => lowerTypes.includes(type));
  }

  /**
   * 检查随从是否具有指定的效果关键词（战吼、亡语等）
   * @param keyword - 要检查的效果关键词
   * @returns 如果随从具有指定的效果关键词，则返回true，否则返回false
   */
  hasEffectKeyword(keyword: EffectKeyword): boolean {
    return this.effectKeywords.includes(keyword);
  }

  removeKeyword(keyword: MinionKeyword) {
    this.keywords = this.keywords.filter(k => k !== keyword);
    this.tempKeywords = this.tempKeywords.filter(k => k !== keyword);
  }

  getKeywords(): MinionKeyword[] {
    console.log('keywords', this.keywords, 'tempKeywords', this.tempKeywords);
    return [...this.keywords, ...this.tempKeywords];
  }

  getBattleLogStr(player: Player): string {
    // 注意：这里暂时传递null作为player参数，因为getBattleLogStr方法主要用于日志记录，不影响核心逻辑
    return `[${this.id.slice(0, 6)}]${this.name}(${this.getAttack(player)}/${this.getHealth(player)})`;
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

  copy(): Minion {
    return super.copy() as Minion;
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
 * 效果关键词（战吼、亡语）
 * 战吼：BATTLECRY
 * 亡语：DEATHRATTLE
 * 抉择：CHOOSE_ONE
 * 磁力：MAGNETIC
 */
export type EffectKeyword = 'BATTLECRY' | 'DEATHRATTLE' | 'CHOOSE_ONE' | 'MAGNETIC';

/**
 * 随从关键词 - 定义随从的特殊能力
 */
export type MinionKeyword =
  | 'TAUNT' // 嘲讽 - 必须先被攻击
  | 'DIVINE_SHIELD' // 圣盾 - 免疫第一次伤害
  | 'WINDFURY' // 风怒 - 每回合可以攻击两次
  | 'super_windfury' // 超级风怒 - 每回合可以攻击多次
  | 'STEALTH' // 潜行 - 不会被攻击，除非主动攻击
  | 'VENOMOUS' // 烈毒 - 攻击时消灭目标，只能使用一次
  | 'POISONOUS' // 剧毒 - 攻击时消灭目标
  | 'REBORN'; // 复生 - 死亡后以1点生命值复活

export const MinionKeywordCN: Record<MinionKeyword, string> = {
  TAUNT: '嘲讽',
  DIVINE_SHIELD: '圣盾',
  WINDFURY: '风怒',
  super_windfury: '超级风怒',
  STEALTH: '潜行',
  VENOMOUS: '烈毒',
  POISONOUS: '剧毒',
  REBORN: '复生',
};

/**
 * 基础关键词
 * 嘲讽、圣盾、风怒、潜行、烈毒、复生
 */
export type 基础关键词 = ['taunt', 'divine_shield', 'windfury', 'stealth', 'venomous', 'reborn'];
