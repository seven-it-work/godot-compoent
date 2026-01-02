import type { Player } from './entity/Player';
import { Result, ResultFactory } from './entity/Result';

export class BattleController {
  /**
   * 进行战斗
   */
  performBattle(player: Player, enemy: Player): Result {
    return ResultFactory.success();
  }
}
