import { BattleAttributes } from "./character";
import type { SpiritRootType } from "./character";

// 怪物类
export class Monster {
  id: string; // 怪物唯一标识
  name: string; // 怪物名称
  level: number; // 怪物等级
  attributes: BattleAttributes; // 怪物战斗属性
  expReward: number; // 击败怪物获得的经验值
  description: string; // 怪物描述
  image?: string; // 怪物图片（可选）

  constructor(monster: {
    id: string;
    name: string;
    level: number;
    attributes: BattleAttributes;
    expReward: number;
    description: string;
    image?: string;
  }) {
    this.id = monster.id;
    this.name = monster.name;
    this.level = monster.level;
    this.attributes = monster.attributes;
    this.expReward = monster.expReward;
    this.description = monster.description;
    this.image = monster.image;
  }

  // 受到伤害
  takeDamage(amount: number): void {
    this.attributes.takeDamage(amount);
  }

  // 检查是否死亡
  isDead(): boolean {
    return this.attributes.health <= 0;
  }

  // 获取战斗经验奖励
  getExpReward(): number {
    return this.expReward;
  }
}

// 战斗日志类
export class BattleLog {
  id: string;
  text: string;
  timestamp: number;
  type: "player" | "monster" | "system";

  constructor(log: {
    id: string;
    text: string;
    timestamp: number;
    type: "player" | "monster" | "system";
  }) {
    this.id = log.id;
    this.text = log.text;
    this.timestamp = log.timestamp;
    this.type = log.type;
  }
}

// 战斗状态类
export class BattleState {
  isInBattle: boolean;
  currentMonster?: Monster;
  battleLogs: BattleLog[];
  isPlayerTurn: boolean;
  battleResult?: "win" | "lose" | "escape";

  constructor(state: {
    isInBattle: boolean;
    currentMonster?: Monster;
    battleLogs: BattleLog[];
    isPlayerTurn: boolean;
    battleResult?: "win" | "lose" | "escape";
  }) {
    this.isInBattle = state.isInBattle;
    this.currentMonster = state.currentMonster;
    this.battleLogs = state.battleLogs;
    this.isPlayerTurn = state.isPlayerTurn;
    this.battleResult = state.battleResult;
  }

  // 添加战斗日志
  addLog(log: BattleLog): void {
    this.battleLogs.push(log);
  }

  // 开始战斗
  startBattle(monster: Monster): void {
    this.isInBattle = true;
    this.currentMonster = monster;
    this.isPlayerTurn = true;
    this.battleResult = undefined;
    this.battleLogs = [];
  }

  // 结束战斗
  endBattle(result: "win" | "lose" | "escape"): void {
    this.isInBattle = false;
    this.battleResult = result;
  }

  // 切换回合
  toggleTurn(): void {
    this.isPlayerTurn = !this.isPlayerTurn;
  }
}

// 灵脉类
export class SpiritVein {
  type: SpiritRootType; // 灵脉类型
  productionSpeed: number; // 生产速度（单位时间生产的灵气量）
  level: number; // 灵脉等级
  name: string; // 灵脉名称

  constructor(
    type: SpiritRootType,
    productionSpeed: number,
    level: number,
    name: string
  ) {
    this.type = type;
    this.productionSpeed = productionSpeed;
    this.level = level;
    this.name = name;
  }

  // 提升灵脉等级
  levelUp(): void {
    this.level++;
    this.productionSpeed *= 1.5; // 生产速度提升
  }

  // 生产灵气
  produceSpiritQi(): number {
    return this.productionSpeed;
  }
}
