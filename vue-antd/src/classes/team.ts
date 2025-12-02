import { Cultivator } from "./character";

// 队伍位置类
export class TeamPosition {
  id: string; // 位置唯一标识
  row: number; // 行索引
  column: number; // 列索引
  teammateId?: string; // 占位的队友ID

  constructor(id: string, row: number, column: number, teammateId?: string) {
    this.id = id;
    this.row = row;
    this.column = column;
    this.teammateId = teammateId;
  }

  // 设置队友
  setTeammate(teammateId: string): void {
    this.teammateId = teammateId;
  }

  // 移除队友
  removeTeammate(): void {
    this.teammateId = undefined;
  }

  // 检查是否有队友
  hasTeammate(): boolean {
    return this.teammateId !== undefined;
  }
}

// 队伍类
export class Team {
  positions: TeamPosition[][]; // 队伍位置网格（3行6列）
  allTeammates: Cultivator[]; // 所有可用的队友
  maxTeamSize: number; // 最大队伍成员数

  constructor(maxTeamSize: number = 6) {
    this.maxTeamSize = maxTeamSize;
    this.allTeammates = [];

    // 初始化3行6列的队伍位置网格
    this.positions = [];
    for (let row = 0; row < 3; row++) {
      this.positions[row] = [];
      for (let col = 0; col < 6; col++) {
        const positionId = `position-${row}-${col}`;
        this.positions[row]![col] = new TeamPosition(positionId, row, col);
      }
    }
  }

  // 添加队友
  addTeammate(teammate: Cultivator): boolean {
    if (this.allTeammates.length >= this.maxTeamSize) {
      return false; // 队伍已满
    }

    this.allTeammates.push(teammate);
    return true;
  }

  // 移除队友
  removeTeammate(teammateId: string): boolean {
    const index = this.allTeammates.findIndex((t) => t.id === teammateId);
    if (index === -1) {
      return false; // 队友不存在
    }

    // 从位置上移除
    this.clearTeammateFromPositions(teammateId);

    // 从队友列表中移除
    this.allTeammates.splice(index, 1);
    return true;
  }

  // 将队友安排到指定位置
  placeTeammate(teammateId: string, row: number, column: number): boolean {
    // 检查位置是否有效
    if (
      row < 0 ||
      row >= this.positions.length ||
      column < 0 ||
      column >= this.positions[row]!.length
    ) {
      return false;
    }

    // 检查队友是否存在
    const teammate = this.allTeammates.find((t) => t.id === teammateId);
    if (!teammate) {
      return false;
    }

    // 设置位置
    const position = this.positions[row]![column]!;
    position.setTeammate(teammateId);
    return true;
  }

  // 从位置上移除队友
  clearTeammateFromPositions(teammateId: string): void {
    for (let row = 0; row < this.positions.length; row++) {
      for (let col = 0; col < this.positions[row]!.length; col++) {
        const position = this.positions[row]![col]!;
        if (position.teammateId === teammateId) {
          position.removeTeammate();
        }
      }
    }
  }

  // 获取指定位置的队友
  getTeammateAtPosition(row: number, column: number): Cultivator | undefined {
    if (
      row < 0 ||
      row >= this.positions.length ||
      column < 0 ||
      column >= this.positions[row]!.length
    ) {
      return undefined;
    }

    const position = this.positions[row]![column]!;
    if (!position.hasTeammate()) {
      return undefined;
    }

    return this.allTeammates.find((t) => t.id === position.teammateId);
  }

  // 获取所有在场上的队友（已安排位置的）
  getFieldTeammates(): Cultivator[] {
    const fieldTeammates: Cultivator[] = [];

    for (let row = 0; row < this.positions.length; row++) {
      for (let col = 0; col < this.positions[row]!.length; col++) {
        const position = this.positions[row]![col]!;
        if (position.hasTeammate()) {
          const teammate = this.allTeammates.find(
            (t) => t.id === position.teammateId
          );
          if (teammate) {
            fieldTeammates.push(teammate);
          }
        }
      }
    }

    return fieldTeammates;
  }

  // 获取所有不在场上的队友（未安排位置的）
  getBenchTeammates(): Cultivator[] {
    const fieldTeammateIds = new Set(
      this.getFieldTeammates().map((teammate) => teammate.id)
    );

    return this.allTeammates.filter(
      (teammate) => !fieldTeammateIds.has(teammate.id)
    );
  }

  // 检查队伍是否已满
  isFull(): boolean {
    return this.allTeammates.length >= this.maxTeamSize;
  }

  // 获取队伍总人数
  getSize(): number {
    return this.allTeammates.length;
  }
}
