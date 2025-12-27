import { IdGenerator } from '@/utils/IdGenerator';
import { Hero } from '@/server/controller/entity/Hero';
import type { Card } from '@/server/controller/entity/Card';
import type { Tavern } from '@/server/controller/entity/Tavern';

export class Player {
  id: string = IdGenerator.generateRandomId();
  name: string = '';
  // 英雄
  hero?: Hero;
  // 战场上的随从
  minionsOnBattlefield: Card[] = [];
  // 战斗中的随从
  minionsInBattle: Card[] = [];
  // 手牌
  handCards: Card[] = [];
  // 酒馆
  tavern?: Tavern;
}
