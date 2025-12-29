import { Card } from '@/server/controller/entity/Card';
export class Hero extends Card {
  type: 'hero' = 'hero';

  // 生命值
  health: number = 30;
  // 护甲
  armor: number = 10;
}
