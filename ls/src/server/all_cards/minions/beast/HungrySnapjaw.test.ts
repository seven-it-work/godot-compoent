import { beforeEach, describe, it } from 'vitest';

import { HungrySnapjaw } from './HungrySnapjaw';

import { Player } from '@/server/controller/entity/Player';

describe('HungrySnapjaw 测试', () => {
  let hungrySnapjaw: HungrySnapjaw;

  let player: Player;

  beforeEach(() => {
    hungrySnapjaw = new HungrySnapjaw();
    player = new Player();
  });

  it('应该正确区分普通和金色版本的效果差异', () => {});
});
