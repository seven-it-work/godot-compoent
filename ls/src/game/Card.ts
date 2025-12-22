import { IdGenerator } from '@/utils/IdGenerator';
import { cloneDeep } from 'lodash';

/** 卡片类型 - 定义卡片的类型 */
export type CardType = 'minion' | 'spell' | 'hero' | 'hero_power';

/** 卡片区域类型 - 定义卡片可以所在的区域 */
export type CardArea = null | '酒馆' | '手牌' | '战场';

/**
 * 卡片类型常量 - 提供预设的卡片类型选项
 */
export const CardType = {
  MINION: 'minion' as CardType, // 随从类型
  SPELL: 'spell' as CardType, // 法术类型
  HERO: 'hero' as CardType, // 英雄类型
  HERO_POWER: 'hero_power' as CardType, // 英雄技能类型
} as const;

/**
 * 基础卡片数据接口 - 定义所有卡片数据共有的属性
 */
export interface ICardData {
  id: number; // 卡片ID
  strId: string; // 卡片字符串ID
  cardType: string; // 卡片类型
  name: string; // 英文名称
  nameCN: string; // 中文名称
  text: string; // 英文描述
  mechanics: string[]; // 机制列表
  referencedTags: string[]; // 引用标签
  img: string; // 卡片图片URL
  art: string; // 卡片艺术图URL
  tier: number; // 星级（1-6）
  cost: number; // 使用该卡片所需的费用
  tokens: ICardData[]; // 关联的token卡片
}

/**
 * 随从卡片数据接口 - 定义随从卡片特有的属性
 */
export interface ICardMinionData extends ICardData {
  health: number; // 生命值
  attack: number; // 攻击力
  minionTypes: string[]; // 随从类型列表
  minionTypesCN: string[]; // 中文随从类型列表
  upgradeCard?: ICardMinionData; // 升级卡片
  isTavernMinion?: boolean; // 是否出现在酒馆中 - 默认值为true
}

/**
 * 法术卡片数据接口 - 定义法术卡片特有的属性
 */
export interface ICardSpellData extends ICardData {}

/**
 * 升级卡片数据接口 - 与ICardData属性相同，是ICardData的一种
 */
export type UpgradeCardData = ICardData;

/**
 * 卡片接口 - 定义所有卡片共有的属性
 */
export interface ICard {
  /** 卡片ID - 唯一标识符 */
  id: string;
  /** 卡片字符串ID - 用于标识卡片类型 */
  strId: string;
  /** 卡片类型 - 随从、法术、英雄等 */
  cardType: CardType;
  /** 英文名称 - 卡片的英文名称 */
  name: string;
  /** 中文名称 - 卡片的中文名称 */
  nameCN: string;
  /** 英文描述 - 卡片的英文描述 */
  text: string;
  /** 机制列表 - 卡片拥有的机制 */
  mechanics: string[];
  /** 引用标签 - 卡片引用的游戏标签 */
  referencedTags: string[];
  /** 卡片图片URL - 卡片的图片链接 */
  img: string;
  /** 卡片艺术图URL - 卡片的艺术图链接 */
  art: string;
  /** 星级 - 卡片的星级（1-6），仅对随从有效 */
  tier?: number;
  /** 消耗 - 使用该卡片所需的费用 */
  cost: number;
  /** 是否为临时卡片 - 临时卡片在回合结束时会消失 */
  isTemporary: boolean;
  /** 卡片区域 - 卡片当前所在区域 */
  area: CardArea;
  /** 是否出现在酒馆中 - 默认值为true */
  isTavernMinion: boolean;
}

/**
 * 定义带有BASE_DATA静态属性的Card类类型
 */
export type CardClass = typeof Card & {
  /** 基础数据 - 静态属性，包含卡片的基础信息，必须存在 */
  BASE_DATA: ICardData;
};

/**
 * 卡片基类 - 定义所有卡片共有的属性和方法
 */
export class Card implements ICard {
  /** 卡片ID - 唯一标识符 */
  id: string;
  /** 卡片字符串ID - 用于标识卡片类型 */
  strId: string = '';
  /** 卡片类型 - 随从、法术、英雄等 */
  cardType: CardType = CardType.MINION;
  /** 英文名称 - 卡片的英文名称 */
  name: string = '';
  /** 中文名称 - 卡片的中文名称 */
  nameCN: string = '';
  /** 英文描述 - 卡片的英文描述 */
  text: string = '';
  /** 机制列表 - 卡片拥有的机制 */
  mechanics: string[] = [];
  /** 引用标签 - 卡片引用的游戏标签 */
  referencedTags: string[] = [];
  /** 卡片图片URL - 卡片的图片链接 */
  img: string = '';
  /** 卡片艺术图URL - 卡片的艺术图链接 */
  art: string = '';
  /** 星级 - 卡片的星级（1-6），仅对随从有效 */
  tier: number = 0;
  /** 消耗 - 使用该卡片所需的费用 */
  cost: number = 0;
  /** 是否为临时卡片 - 临时卡片在回合结束时会消失 */
  isTemporary: boolean = false;
  /** 卡片区域 - 卡片当前所在区域 */
  area: CardArea = null;
  /** 是否出现在酒馆中 - 默认值为true */
  isTavernMinion: boolean = true;

  /**
   * 卡片构造函数
   * @param params - 卡片属性参数，所有属性可选。会优先使用当前类的BASE_DATA初始化，BASE_DATA优先级高于params
   */
  constructor(params: Partial<ICard> = {}) {
    this.id = IdGenerator.generateRandomId();
    // 获取当前类的BASE_DATA（如果存在），支持子类的BASE_DATA
    const baseData = (this.constructor as any).BASE_DATA;
    // 合并params和BASE_DATA，BASE_DATA优先级更高
    const mergedParams = {
      ...params,
      ...baseData,
    };

    // 使用合并后的数据初始化所有卡片属性
    this.strId = mergedParams.strId || '';
    // 确保cardType是有效的CardType值
    const rawCardType = mergedParams.cardType;
    this.cardType =
      rawCardType && this.isValidCardType(rawCardType) ? rawCardType : CardType.MINION;
    this.name = mergedParams.name || '';
    this.nameCN = mergedParams.nameCN || '';
    this.text = mergedParams.text || '';
    this.mechanics = mergedParams.mechanics || [];
    this.referencedTags = mergedParams.referencedTags || [];
    this.img = mergedParams.img || '';
    this.art = mergedParams.art || '';
    this.tier = mergedParams.tier;
    this.cost = mergedParams.cost || 0;
    this.isTemporary = mergedParams.isTemporary || false;
    this.area = mergedParams.area || null;
    this.isTavernMinion = mergedParams.isTavernMinion ?? true;
  }

  /**
   * 检查字符串是否为有效的CardType值
   * @param type - 要检查的字符串
   * @returns 是否为有效的CardType值
   */
  private isValidCardType(type: string): type is CardType {
    return Object.values(CardType).includes(type as CardType);
  }

  /**
   * 克隆卡片 - 创建一个卡片的副本
   * @returns 克隆的卡片实例
   */
  clone(): Card {
    const clonedCard = cloneDeep(this);
    clonedCard.id = IdGenerator.generateRandomId();
    return clonedCard;
  }
}
