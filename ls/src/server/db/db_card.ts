import { Card } from '@/server/controller/entity/Card';

export const db: Map<string, Card> = new Map();

/**
 * 创建卡片
 * @param card 卡片对象
 * @returns 创建的卡片对象
 */
export function createCard(card: Card): Card {
  db.set(card.id, card);
  return card;
}

/**
 * 根据ID获取卡片
 * @param id 卡片ID
 * @returns 卡片对象或undefined
 */
export function getCardById(id: string): Card | undefined {
  return db.get(id);
}

/**
 * 根据strId获取卡片
 * @param strId 卡片标识
 * @returns 卡片对象或undefined
 */
export function getCardByStrId(strId: string): Card | undefined {
  for (const card of db.values()) {
    if (card.strId === strId) {
      return card;
    }
  }
  return undefined;
}

/**
 * 更新卡片信息
 * @param card 卡片对象
 * @returns 更新后的卡片对象或undefined
 */
export function updateCard(card: Card): Card | undefined {
  if (db.has(card.id)) {
    db.set(card.id, card);
    return card;
  }
  return undefined;
}

/**
 * 根据ID删除卡片
 * @param id 卡片ID
 * @returns 是否删除成功
 */
export function deleteCard(id: string): boolean {
  return db.delete(id);
}

/**
 * 获取所有卡片
 * @returns 卡片对象数组
 */
export function getAllCards(): Card[] {
  return Array.from(db.values());
}
