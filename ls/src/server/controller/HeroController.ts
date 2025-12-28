import { db_card } from '@/server/db/db_card';
import type { Card } from '@/server/controller/entity/Card';

export class HeroController {
  /**
   * 生成英雄供玩家选择
   */
  generateHeroes(size: number = 3): Card[] {
    console.log('generateHeroes', size);
    // todo 从db中随机获取size个英雄
    const hero = db_card.getCardByStrId('TestHero');
    if (!hero) {
      throw new Error('TestHero not found');
    }
    return [hero];
  }
}
