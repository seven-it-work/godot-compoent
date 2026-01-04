import { BattleController } from '@/server/controller/BattleController';
import { Player } from '@/server/controller/entity/Player';
import { cloneDeep } from 'lodash';
import { beforeEach, describe, expect, it } from 'vitest';
import { Cubling } from './Cubling';

describe('Cubling 测试', () => {
  let cubling: Cubling;
  let player: Player;
  let enemy: Player;

  beforeEach(() => {
    // 初始化真实对象
    cubling = new Cubling();
    player = new Player();
    enemy = new Player();
    player.name = '玩家007';
    enemy.name = '敌人';
  });

  it('测试 Cubling VS Cubling 平局场景', () => {
    const battleController = new BattleController();
    player.添加随从到战场(cloneDeep(cubling));
    enemy.添加随从到战场(cloneDeep(cubling));
    const result = battleController.performBattle(player, enemy);
    console.log(player.battleLogs);
    expect(result.isSuccess()).toBe(true);
    expect(result.data?.winner).toBe(undefined);
  });
});
