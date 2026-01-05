import { BattleController } from '@/server/controller/BattleController';
import { Player } from '@/server/controller/entity/Player';
import { cloneDeep } from 'lodash';
import { beforeEach, describe, expect, it } from 'vitest';
import { DozyWhelp } from './DozyWhelp';

describe('DozyWhelp 测试', () => {
  let dozyWhelp: DozyWhelp;
  let player: Player;
  let enemy: Player;

  beforeEach(() => {
    // 初始化真实对象
    dozyWhelp = new DozyWhelp();
    player = new Player();
    enemy = new Player();
    player.name = '玩家007';
    enemy.name = '敌人';
  });

  it('测试 DozyWhelp 受到攻击时获得+1攻击力', () => {
    // 初始攻击力
    expect(dozyWhelp.getAttack(player)).toBe(0);

    // 触发受到攻击的效果
    dozyWhelp.onAttacked(player);

    // 验证攻击力增加
    expect(dozyWhelp.getAttack(player)).toBe(1);

    // 再次触发受到攻击的效果
    dozyWhelp.onAttacked(player);

    // 验证攻击力再次增加
    expect(dozyWhelp.getAttack(player)).toBe(2);
  });

  it('测试 DozyWhelp VS DozyWhelp 战斗场景', () => {
    const battleController = new BattleController();
    player.添加随从到战场(cloneDeep(dozyWhelp));
    enemy.添加随从到战场(cloneDeep(dozyWhelp));
    const result = battleController.performBattle(player, enemy);
    console.log(player.battleLogs);
    // 平局
    expect(result.isSuccess()).toBe(true);
    expect(result.data?.winner).toBe(undefined);
  });

  it('测试 DozyWhelp 与其他随从战斗', () => {
    const battleController = new BattleController();
    const anotherMinion = new DozyWhelp();
    anotherMinion.attack = 1;
    anotherMinion.health = 1;

    player.添加随从到战场(dozyWhelp);
    enemy.添加随从到战场(anotherMinion);

    const result = battleController.performBattle(player, enemy);

    console.log(player.battleLogs);
    // 验证战斗正常结束
    expect(result.isSuccess()).toBe(true);
    expect(result.data?.winner).toBe(player);
    expect(dozyWhelp.getAttack(player)).toBe(1);
  });
});
