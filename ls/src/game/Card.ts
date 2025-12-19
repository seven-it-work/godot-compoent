import { IdGenerator } from '../utils/IdGenerator';

/**
 * 卡片类型 - 定义卡片的类型
 */
export type CardType = 'minion' | 'spell' | 'hero' | 'hero_power';

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
 * 卡片基类 - 定义所有卡片共有的属性和方法
 */
export class Card {
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

  /**
   * 卡片构造函数
   * @param strId - 卡片字符串ID
   * @param cardType - 卡片类型
   * @param name - 英文名称
   * @param nameCN - 中文名称
   * @param text - 英文描述
   * @param mechanics - 机制列表
   * @param referencedTags - 引用标签
   * @param img - 卡片图片URL
   * @param art - 卡片艺术图URL
   * @param tier - 星级（可选）
   * @param cost - 消耗
   * @param isTemporary - 是否为临时卡片
   */
  constructor(
    strId: string,
    cardType: CardType,
    name: string,
    nameCN: string,
    text: string,
    mechanics: string[],
    referencedTags: string[],
    img: string,
    art: string,
    tier?: number,
    cost: number = 0,
    isTemporary: boolean = false
  ) {
    this.id = IdGenerator.generateRandomId();
    this.strId = strId;
    this.cardType = cardType;
    this.name = name;
    this.nameCN = nameCN;
    this.text = text;
    this.mechanics = mechanics;
    this.referencedTags = referencedTags;
    this.img = img;
    this.art = art;
    this.tier = tier;
    this.cost = cost;
    this.isTemporary = isTemporary;
  }

  /**
   * 克隆卡片 - 创建一个卡片的副本
   * @returns 克隆的卡片实例
   */
  clone(): Card {
    return new Card(
      this.id,
      this.strId,
      this.cardType,
      this.name,
      this.nameCN,
      this.text,
      [...this.mechanics],
      [...this.referencedTags],
      this.img,
      this.art,
      this.tier,
      this.cost,
      this.isTemporary
    );
  }
}
