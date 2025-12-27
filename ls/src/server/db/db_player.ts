import type { Player } from '@/server/controller/entity/Player';

const db: Map<string, Player> = new Map();

/**
 * 创建玩家
 * @param player 玩家对象
 * @returns 创建的玩家对象
 */
function createPlayer(player: Player): Player {
  db.set(player.id, player);
  return player;
}

/**
 * 根据ID获取玩家
 * @param id 玩家ID
 * @returns 玩家对象或undefined
 */
function getPlayerById(id: string): Player | undefined {
  return db.get(id);
}

/**
 * 更新玩家信息
 * @param player 玩家对象
 * @returns 更新后的玩家对象或undefined
 */
function updatePlayer(player: Player): Player | undefined {
  if (db.has(player.id)) {
    db.set(player.id, player);
    return player;
  }
  return undefined;
}

/**
 * 根据ID删除玩家
 * @param id 玩家ID
 * @returns 是否删除成功
 */
function deletePlayer(id: string): boolean {
  return db.delete(id);
}

/**
 * 获取所有玩家
 * @returns 玩家对象数组
 */
function getAllPlayers(): Player[] {
  return Array.from(db.values());
}

export const dbPlayer = {
  createPlayer,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  getAllPlayers,
};
