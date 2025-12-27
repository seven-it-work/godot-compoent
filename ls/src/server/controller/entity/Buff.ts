export class Buff {
  id: string = ''; // 加成唯一标识符
  source: string = ''; // 加成来源（如卡牌名称、效果名称）
  attackBonus: number = 0; // 攻击力加成值
  healthBonus: number = 0; // 生命值加成值
  type: '临时' | '永久' = '临时'; // 加成类型（如临时、永久）
  turnsRemaining: number = 0; // 剩余回合数（临时加成使用）
}
