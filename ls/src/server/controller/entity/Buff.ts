import { IdGenerator } from '@/utils/IdGenerator';

export class Buff {
  id: string = ''; // 加成唯一标识符
  source: string = ''; // 加成来源（如卡牌名称、效果名称）
  attackBonus: number = 0; // 攻击力加成值
  healthBonus: number = 0; // 生命值加成值

  constructor(source: string, attackBonus: number, healthBonus: number) {
    this.id = IdGenerator.generateRandomId();
    this.source = source;
    this.attackBonus = attackBonus;
    this.healthBonus = healthBonus;
  }
}
