import { IdGenerator } from '@/utils/IdGenerator';

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
 * 卡片基类 - 定义所有卡片共有的属性和方法
 */
export class Card implements ICard {
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

  /**
   * 卡片构造函数
   * @param params - 卡片属性参数，所有属性可选
   */
  constructor(params: Partial<ICard>) {
    this.id = IdGenerator.generateRandomId();
    this.strId = params.strId || '';
    this.cardType = params.cardType || 'minion';
    this.name = params.name || '';
    this.nameCN = params.nameCN || '';
    this.text = params.text || '';
    this.mechanics = params.mechanics || [];
    this.referencedTags = params.referencedTags || [];
    this.img = params.img || '';
    this.art = params.art || '';
    this.tier = params.tier;
    this.cost = params.cost || 0;
    this.isTemporary = params.isTemporary || false;
    this.area = params.area || null;
    this.isTavernMinion = params.isTavernMinion ?? true;
  }

  /**
   * 克隆卡片 - 创建一个卡片的副本
   * @returns 克隆的卡片实例
   */
  clone(): Card {
    return new Card({
      strId: this.strId,
      cardType: this.cardType,
      name: this.name,
      nameCN: this.nameCN,
      text: this.text,
      mechanics: [...this.mechanics],
      referencedTags: [...this.referencedTags],
      img: this.img,
      art: this.art,
      tier: this.tier,
      cost: this.cost,
      isTemporary: this.isTemporary,
      isTavernMinion: this.isTavernMinion,
    });
  }
}
