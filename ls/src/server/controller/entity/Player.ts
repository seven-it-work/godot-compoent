import type { Card } from '@/server/controller/entity/Card';
import { Hero } from '@/server/controller/entity/Hero';
import type { Tavern } from '@/server/controller/entity/Tavern';
import { IdGenerator } from '@/utils/IdGenerator';

export class Player {
  id: string = IdGenerator.generateRandomId();
  name: string = '';
  // 英雄
  hero?: Hero;
  // 战场上的随从
  minionsOnBattlefield: (Card | undefined)[] = Array(7).fill(undefined);
  // 战斗中的随从
  minionsInBattle: (Card | undefined)[] = Array(7).fill(undefined);
  // 手牌
  handCards: (Card | undefined)[] = Array(10).fill(undefined);
  // 酒馆
  tavern?: Tavern;
}
