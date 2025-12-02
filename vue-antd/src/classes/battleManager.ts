import { Monster } from "./battle";
import { Player } from "./character";
import { GameLocation } from "./world";
import { BattleLog } from "./battle";
import { AttributesGenerator } from "./attributesGenerator";

export class BattleManager {
  // 开始战斗
  static startBattle(
    player: Player,
    monster: Monster,
    battleLogs: BattleLog[],
    isPlayerTurn: boolean,
    currentSystem: string,
    setCurrentSystem: (system: string) => void,
    dispatchStartBattle: () => void
  ): void {
    battleLogs.length = 0;
    isPlayerTurn = true;
    setCurrentSystem("battle");

    // 添加战斗开始日志
    this.addBattleLog(battleLogs, {
      text: `你在${player.currentLocation!.name}遇到了${monster.name}！`,
      type: "system",
    });

    // 触发全局事件，通知UI层需要跳转到战斗页面
    dispatchStartBattle();
  }

  // 添加战斗日志
  static addBattleLog(
    battleLogs: BattleLog[],
    log: Omit<BattleLog, "id" | "timestamp">
  ): void {
    const newLog: BattleLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    battleLogs.push(newLog);
  }

  // 玩家攻击
  static playerAttack(
    player: Player,
    monster: Monster,
    battleLogs: BattleLog[],
    isPlayerTurn: boolean,
    setIsPlayerTurn: (turn: boolean) => void,
    handleBattleWin: (monster: Monster) => void
  ): void {
    if (!isPlayerTurn) {
      return;
    }

    // 检查是否命中
    const hitChance = 0.8 - monster.attributes.dodge / 100;
    const isHit = Math.random() < hitChance;

    if (!isHit) {
      this.addBattleLog(battleLogs, {
        text: `${monster.name}灵巧地避开了你的攻击！`,
        type: "monster",
      });
    } else {
      // 检查是否暴击
      const isCritical = Math.random() < player.attributes.critical / 100;

      // 计算伤害
      let damage = Math.max(
        1,
        player.attributes.attack - monster.attributes.defense / 2
      );
      if (isCritical) {
        damage = Math.floor(damage * 1.5);
      }

      // 检查是否被格挡
      const blockChance = monster.attributes.block / 100;
      const isBlocked = Math.random() < blockChance;

      if (isBlocked) {
        damage = Math.floor(damage * 0.5);
        this.addBattleLog(battleLogs, {
          text: `${monster.name}用灵力护盾挡住了你的攻击，只受到了${damage}点伤害！`,
          type: "monster",
        });
      } else {
        const logText = isCritical
          ? `你对${monster.name}发动了致命一击！造成了${damage}点伤害！`
          : `你对${monster.name}造成了${damage}点伤害。`;
        this.addBattleLog(battleLogs, {
          text: logText,
          type: "player",
        });
      }

      // 更新怪物生命值
      monster.attributes.health = Math.max(
        0,
        monster.attributes.health - damage
      );

      // 检查怪物是否死亡
      if (monster.attributes.health <= 0) {
        this.addBattleLog(battleLogs, {
          text: `你击败了${monster.name}！`,
          type: "system",
        });
        handleBattleWin(monster);
        return;
      }
    }

    // 切换到怪物回合
    setIsPlayerTurn(false);

    // 延迟怪物攻击
    setTimeout(() => {
      this.monsterAttack(player, monster, battleLogs, setIsPlayerTurn);
    }, 1000);
  }

  // 怪物攻击
  static monsterAttack(
    player: Player,
    monster: Monster,
    battleLogs: BattleLog[],
    setIsPlayerTurn: (turn: boolean) => void
  ): void {
    // 检查是否命中
    const hitChance = 0.7 - player.attributes.dodge / 100;
    const isHit = Math.random() < hitChance;

    if (!isHit) {
      this.addBattleLog(battleLogs, {
        text: `你灵巧地避开了${monster.name}的攻击！`,
        type: "player",
      });
    } else {
      // 检查是否暴击
      const isCritical = Math.random() < monster.attributes.critical / 100;

      // 计算伤害
      let damage = Math.max(
        1,
        monster.attributes.attack - player.attributes.defense / 2
      );
      if (isCritical) {
        damage = Math.floor(damage * 1.5);
      }

      // 检查是否被格挡
      const blockChance = player.attributes.block / 100;
      const isBlocked = Math.random() < blockChance;

      if (isBlocked) {
        damage = Math.floor(damage * 0.5);
        this.addBattleLog(battleLogs, {
          text: `你用灵力护盾挡住了${monster.name}的攻击，只受到了${damage}点伤害！`,
          type: "player",
        });
      } else {
        const logText = isCritical
          ? `${monster.name}对你发动了致命一击！造成了${damage}点伤害！`
          : `${monster.name}对你造成了${damage}点伤害。`;
        this.addBattleLog(battleLogs, {
          text: logText,
          type: "monster",
        });
      }

      // 更新玩家生命值
      player.attributes.health = Math.max(0, player.attributes.health - damage);

      // 检查玩家是否死亡
      if (player.attributes.health <= 0) {
        this.addBattleLog(battleLogs, {
          text: `你被${monster.name}击败了！`,
          type: "system",
        });
        this.handleBattleLose(player);
        return;
      }
    }

    // 切换回玩家回合
    setIsPlayerTurn(true);
  }

  // 玩家防御
  static playerDefend(
    player: Player,
    battleLogs: BattleLog[],
    setIsPlayerTurn: (turn: boolean) => void
  ): void {
    // 临时增加防御和格挡
    player.attributes.defense += 5;
    player.attributes.block += 5;

    this.addBattleLog(battleLogs, {
      text: "你进入了防御姿态，防御力和格挡率临时提升！",
      type: "player",
    });

    // 切换到怪物回合
    setIsPlayerTurn(false);

    // 延迟怪物攻击
    setTimeout(() => {
      // 这里应该调用monsterAttack，但需要传递更多参数
      // 为了简化，暂时不实现完整逻辑
      setIsPlayerTurn(true);
      // 回合结束后移除临时防御加成
      player.attributes.defense -= 5;
      player.attributes.block -= 5;
    }, 1000);
  }

  // 玩家逃跑
  static playerEscape(
    player: Player,
    battleLogs: BattleLog[],
    setIsPlayerTurn: (turn: boolean) => void,
    handleBattleEscape: () => void
  ): void {
    // 逃跑成功率基于身法
    const escapeChance = 0.5 + player.attributes.dodge / 200;
    const isEscaped = Math.random() < escapeChance;

    if (isEscaped) {
      this.addBattleLog(battleLogs, {
        text: "你成功逃脱了战斗！",
        type: "player",
      });
      handleBattleEscape();
    } else {
      this.addBattleLog(battleLogs, {
        text: "你没能逃脱，战斗继续！",
        type: "monster",
      });

      // 切换到怪物回合
      setIsPlayerTurn(false);

      // 延迟怪物攻击
      setTimeout(() => {
        // 这里应该调用monsterAttack，但需要传递更多参数
        setIsPlayerTurn(true);
      }, 1000);
    }
  }

  // 处理战斗胜利
  static handleBattleWin(
    player: Player,
    monster: Monster,
    battleLogs: BattleLog[],
    location: GameLocation | undefined,
    handleLevelUp: () => void
  ): void {
    // 获得经验值
    player.exp += monster.expReward;
    this.addBattleLog(battleLogs, {
      text: `你获得了${monster.expReward}点经验值！`,
      type: "system",
    });

    // 移除地点中的怪物
    if (location) {
      delete location.monster;
    }

    // 检查是否升级
    if (player.exp >= player.maxExp) {
      handleLevelUp();
    }

    // 恢复一些生命值
    const healthRecovery = Math.floor(player.attributes.maxHealth * 0.3);
    player.attributes.health = Math.min(
      player.attributes.health + healthRecovery,
      player.attributes.maxHealth
    );
    this.addBattleLog(battleLogs, {
      text: `战斗结束，你恢复了${healthRecovery}点神魂强度。`,
      type: "system",
    });
  }

  // 处理战斗失败
  static handleBattleLose(player: Player): void {
    // 重置玩家状态
    player.attributes.health = player.attributes.maxHealth;
  }
}
