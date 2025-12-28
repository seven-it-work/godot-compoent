import type { CurrentGame } from '@/server/controller/entity/CurrentGame';

const db: Map<string, CurrentGame> = new Map();

/**
 * 创建当前游戏
 * @param game 当前游戏对象
 * @returns 创建的当前游戏对象
 */
function createCurrentGame(game: CurrentGame): CurrentGame {
  db.set(game.id, game);
  return game;
}

/**
 * 根据ID获取当前游戏
 * @param id 游戏ID
 * @returns 当前游戏对象或undefined
 */
function getCurrentGameById(id: string): CurrentGame | undefined {
  return db.get(id);
}

/**
 * 更新当前游戏信息
 * @param game 当前游戏对象
 * @returns 更新后的当前游戏对象或undefined
 */
function updateCurrentGame(game: CurrentGame): CurrentGame | undefined {
  if (db.has(game.id)) {
    db.set(game.id, game);
    return game;
  }
  return undefined;
}

/**
 * 根据ID删除当前游戏
 * @param id 游戏ID
 * @returns 是否删除成功
 */
function deleteCurrentGame(id: string): boolean {
  return db.delete(id);
}

/**
 * 获取所有当前游戏
 * @returns 当前游戏对象数组
 */
function getAllCurrentGames(): CurrentGame[] {
  return Array.from(db.values());
}

/**
 * 清空所有当前游戏
 */
function clearAllCurrentGames(): void {
  db.clear();
}

export default {
  createCurrentGame,
  getCurrentGameById,
  updateCurrentGame,
  deleteCurrentGame,
  getAllCurrentGames,
  clearAllCurrentGames,
};
