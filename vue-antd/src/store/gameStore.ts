import { defineStore } from "pinia";
import { GameState } from "../classes/game";
import { Player, Teammate } from "../classes/character";
import type { SpiritRootType } from "../classes/character";
import { SpiritRoot } from "../classes/character";
import { SpiritQi } from "../classes/resources";
import { GameLocation, GameMap, GameTime } from "../classes/world";
import { Team, TeamPosition } from "../classes/team";
import { resourceConfig, balanceConfig } from "../config/gameConfig";
import { AttributesGenerator } from "../classes/attributesGenerator";
import { MapManager } from "../classes/mapManager";
import { SpiritQiManager } from "../classes/spiritQiManager";
import { LevelUpManager } from "../classes/levelUpManager";
import { Monster, BattleState } from "../classes/battle";
import type { BattleLog } from "../classes/battle";
import { GameLifecycleManager } from "../classes/lifecycle";

// 扩展GameState类型
export class ExtendedGameState extends GameState {
  // 用户界面相关状态
  uiState: {
    playerDetailActiveTab: string;
  };
  // 游戏生命周期管理器实例
  lifecycleManager: GameLifecycleManager | null;

  constructor(initialState: {
    player: Player;
    currentSystem: "training" | "outdoor" | "battle";
    map: GameMap;
    gameTime: GameTime;
    battleState: BattleState;
    team: Team;
    uiState: {
      playerDetailActiveTab: string;
    };
  }) {
    super(initialState);
    this.uiState = initialState.uiState;
    this.lifecycleManager = null;
  }
}

export const useGameStore = defineStore("game", {
  state: (): ExtendedGameState => {
    // 创建初始队伍位置（3行6列）
    const initialPositions: TeamPosition[][] = Array(3)
      .fill(null)
      .map((_, rowIndex) => {
        return Array(6)
          .fill(null)
          .map((_, colIndex) => {
            return new TeamPosition(
              `position-${rowIndex}-${colIndex}`,
              rowIndex,
              colIndex
            );
          });
      });

    // 初始队友数据
    const initialTeammates: Teammate[] = [
      new Player({
        id: "player-1",
        name: "玩家",
        level: 1,
        attributes: AttributesGenerator.generateAttributesByLevel(1),
        description: "游戏主角",
        isPlayer: true,
        exp: 0,
        maxExp: balanceConfig.initialMaxExp,
        spiritRoots: [
          new SpiritRoot("gold", 1, "金灵根"),
          new SpiritRoot("wood", 1, "木灵根"),
          new SpiritRoot("water", 1, resourceConfig.spiritRootNames.water),
          new SpiritRoot("fire", 1, resourceConfig.spiritRootNames.fire),
          new SpiritRoot("earth", 1, resourceConfig.spiritRootNames.earth),
        ],
        spiritQi: new SpiritQi({
          gold: 0,
          wood: 0,
          water: 0,
          fire: 0,
          earth: 0,
          maxGold: resourceConfig.initialMaxSpiritQi,
          maxWood: resourceConfig.initialMaxSpiritQi,
          maxWater: resourceConfig.initialMaxSpiritQi,
          maxFire: resourceConfig.initialMaxSpiritQi,
          maxEarth: resourceConfig.initialMaxSpiritQi,
        }),
        absorbSpeed: balanceConfig.initialAbsorbSpeed,
        cooldown: balanceConfig.initialCooldown,
        isCooldown: false,
        cooldownRemaining: 0,
      }),
    ];

    // 设置玩家在队伍中的初始位置（第一行第一列）
    if (initialPositions[0] && initialPositions[0][0]) {
      initialPositions[0][0].teammateId = "player-1";
    }

    const player = new Player({
      id: "player-1",
      name: "玩家",
      level: 1,
      exp: 0,
      maxExp: 100,
      spiritRoots: [
        new SpiritRoot("gold", 1, "金灵根"),
        new SpiritRoot("wood", 1, "木灵根"),
        new SpiritRoot("water", 1, "水灵根"),
        new SpiritRoot("fire", 1, "火灵根"),
        new SpiritRoot("earth", 1, "土灵根"),
      ],
      spiritQi: new SpiritQi({
        gold: 0,
        wood: 0,
        water: 0,
        fire: 0,
        earth: 0,
        maxGold: 100,
        maxWood: 100,
        maxWater: 100,
        maxFire: 100,
        maxEarth: 100,
      }),
      attributes: AttributesGenerator.generateAttributesByLevel(1),
      absorbSpeed: 1.0,
      cooldown: 1000, // 1秒冷却时间
      isCooldown: false,
      cooldownRemaining: 0,
      description: "游戏主角",
      isPlayer: true,
    });

    const gameTime = new GameTime({
      year: 1,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      speed: 1,
      isPaused: false,
    });

    const map = new GameMap(10, 10);

    const battleState: BattleState = new BattleState({
      isInBattle: false,
      battleLogs: [],
      isPlayerTurn: true,
      currentMonster: undefined,
      battleResult: undefined,
    });

    const team = (() => {
      const team = new Team(18);
      // 添加初始队友
      initialTeammates.forEach((teammate) => team.addTeammate(teammate));
      return team;
    })();

    // 创建ExtendedGameState实例
    return new ExtendedGameState({
      player,
      currentSystem: "outdoor",
      map,
      gameTime,
      battleState,
      team,
      uiState: {
        playerDetailActiveTab:
          localStorage.getItem("playerDetailActiveTab") || "attributes",
      },
    });
  },

  getters: {
    // 获取玩家详情页当前激活的tab
    getPlayerDetailActiveTab: (state): string => {
      console.log(
        "[gameStore] 获取当前激活的tab:",
        state.uiState.playerDetailActiveTab
      );
      return state.uiState.playerDetailActiveTab;
    },

    // 获取玩家拥有的灵根类型列表
    activeSpiritRoots: (state): SpiritRootType[] => {
      return state.player.spiritRoots.map((root) => root.type);
    },

    // 检查是否可以升级
    canLevelUp: (state): boolean => {
      return LevelUpManager.canLevelUp(state.player);
    },

    // 获取当前地点
    getCurrentLocation: (state): GameLocation | undefined => {
      return state.player.currentLocation;
    },

    // 格式化时间显示
    formattedTime: (state): string => {
      const { year, month, day, hour } = state.gameTime;
      return `${year}年${month}月${day}日 ${hour}时`;
    },

    // 获取当前战斗状态
    isInBattle: (state): boolean => {
      return state.battleState.isInBattle;
    },

    // 获取当前怪物
    currentMonster: (state): Monster | undefined => {
      return state.battleState.currentMonster;
    },

    // 获取战斗日志
    battleLogs: (state): BattleLog[] => {
      return state.battleState.battleLogs;
    },
    // 队伍相关getter
    // 获取已上阵的队友
    deployedTeammates: (state) => {
      const deployed: Teammate[] = [];
      for (const row of state.team.positions) {
        if (row) {
          for (const position of row) {
            if (position && position.teammateId) {
              const teammate = state.team.allTeammates.find(
                (t) => t.id === position.teammateId
              );
              if (teammate) {
                deployed.push(teammate);
              }
            }
          }
        }
      }
      return deployed;
    },
    // 获取未上阵的队友
    undeployedTeammates: (state) => {
      const deployedIds = new Set<string>();
      for (const row of state.team.positions) {
        for (const position of row) {
          if (position.teammateId) {
            deployedIds.add(position.teammateId);
          }
        }
      }
      return state.team.allTeammates.filter(
        (teammate) => !deployedIds.has(teammate.id)
      );
    },
    // 获取当前队伍人数
    currentTeamSize: (state) => {
      let count = 0;
      for (const row of state.team.positions) {
        for (const position of row) {
          if (position.teammateId) {
            count++;
          }
        }
      }
      return count;
    },
    // 获取队伍中某个位置的队友
    getTeammateAtPosition: (state) => (row: number, column: number) => {
      if (row >= 0 && row < state.team.positions.length) {
        const position = state.team.positions[row]?.[column];
        if (position && position.teammateId) {
          return state.team.allTeammates.find(
            (t) => t.id === position.teammateId
          );
        }
      }
      return null;
    },
    // 获取玩家当前攻击值
    getPlayerCurrentAttack: (state) => (target?: Teammate) => {
      if (target) {
        return target.attributes.attack;
      }
      return state.player.attributes.attack;
    },
    // 获取玩家当前防御值
    getPlayerCurrentDefense: (state) => (target?: Teammate) => {
      if (target) {
        return target.attributes.defense;
      }
      return state.player.attributes.defense;
    },
  },

  actions: {
    // 设置玩家详情页当前激活的tab
    setPlayerDetailActiveTab(tab: string): void {
      console.log(
        '[gameStore] 设置激活的tab: 从 "' +
        this.uiState.playerDetailActiveTab +
        '" 到 "' +
        tab +
        '"'
      );
      this.uiState.playerDetailActiveTab = tab;

      // 保存到localStorage
      localStorage.setItem("playerDetailActiveTab", tab);
      console.log(
        "[gameStore] 已保存tab到localStorage:",
        localStorage.getItem("playerDetailActiveTab")
      );
    },

    // 初始化游戏界面状态
    initUIState(): void {
      console.log("[gameStore] 初始化UI状态");
      // 尝试从localStorage恢复状态
      const savedTab = localStorage.getItem("playerDetailActiveTab");
      if (savedTab) {
        this.uiState.playerDetailActiveTab = savedTab;
        console.log("[gameStore] 从localStorage恢复tab状态:", savedTab);
      }
    },
    // 初始化游戏
    initGame() {
      console.log("[gameStore] 开始按照生命周期初始化游戏");
      
      // 确保只创建一个生命周期管理器实例
      if (!this.lifecycleManager) {
        console.log("[gameStore] 创建 GameLifecycleManager 实例");
        this.lifecycleManager = new GameLifecycleManager({
          onInitializing: () => {
            console.log("[gameStore] 游戏初始化中...");
          },
          onReady: () => {
            console.log("[gameStore] 游戏准备就绪");
          },
          onGameStart: () => {
            console.log("[gameStore] 游戏开始运行");
          },
          onPhaseChange: (phase) => {
            console.log(`[gameStore] 游戏阶段变化: ${phase}`);
          }
        });
      }

      // 使用生命周期管理器初始化游戏
      this.lifecycleManager.initialize(this);
      
      // 开始游戏
      this.lifecycleManager.startGame();
      
      console.log("[gameStore] 游戏生命周期初始化完成");
    },

    // 重置玩家信息到初始状态
    resetPlayer() {
      console.log("[gameStore] 调用生命周期管理器重置游戏数据");
      
      if (this.lifecycleManager) {
        console.log("[gameStore] 生命周期管理器存在，调用 resetGame() 方法");
        this.lifecycleManager.resetGame();
        console.log("[gameStore] 游戏数据重置完成");
      } else {
        console.warn("[gameStore] 生命周期管理器未初始化，无法重置游戏数据");
        // 如果生命周期管理器不存在，创建一个新的实例并初始化
        this.initGame();
      }
    },

    // 生成地图
    generateMap() {
      MapManager.generateMap(this.map, (location: GameLocation) => {
        this.player.currentLocation = location;
      });
    },

    // 开始战斗
    startBattle(monster: Monster) {
      this.battleState.isInBattle = true;
      this.battleState.currentMonster = monster;
      this.battleState.battleLogs = [];
      this.battleState.isPlayerTurn = true;
      this.battleState.battleResult = undefined;
      this.currentSystem = "battle";

      // 添加战斗开始日志
      this.addBattleLog({
        text: `你在${this.player.currentLocation!.name}遇到了${monster.name}！`,
        type: "system",
      });

      // 触发全局事件，通知UI层需要跳转到战斗页面
      window.dispatchEvent(new CustomEvent("start-battle"));
    },

    // 添加战斗日志
    addBattleLog(log: Omit<BattleLog, "id" | "timestamp">) {
      const newLog: BattleLog = {
        ...log,
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      };
      this.battleState.battleLogs.push(newLog);
    },

    // 玩家攻击
    playerAttack() {
      if (
        !this.battleState.isInBattle ||
        !this.battleState.currentMonster ||
        !this.battleState.isPlayerTurn
      ) {
        return;
      }

      const monster = this.battleState.currentMonster;

      // 检查是否命中
      const hitChance = 0.8 - monster.attributes.dodge / 100;
      const isHit = Math.random() < hitChance;

      if (!isHit) {
        this.addBattleLog({
          text: `${monster.name}灵巧地避开了你的攻击！`,
          type: "monster",
        });
      } else {
        // 检查是否暴击
        const isCritical =
          Math.random() < this.player.attributes.critical / 100;

        // 计算伤害
        let damage = Math.max(
          1,
          this.player.attributes.attack - monster.attributes.defense / 2
        );
        if (isCritical) {
          damage = Math.floor(damage * 1.5);
        }

        // 检查是否被格挡
        const blockChance = monster.attributes.block / 100;
        const isBlocked = Math.random() < blockChance;

        if (isBlocked) {
          damage = Math.floor(damage * 0.5);
          this.addBattleLog({
            text: `${monster.name}用灵力护盾挡住了你的攻击，只受到了${damage}点伤害！`,
            type: "monster",
          });
        } else {
          const logText = isCritical
            ? `你对${monster.name}发动了致命一击！造成了${damage}点伤害！`
            : `你对${monster.name}造成了${damage}点伤害。`;
          this.addBattleLog({
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
          this.addBattleLog({
            text: `你击败了${monster.name}！`,
            type: "system",
          });
          this.handleBattleWin(monster);
          return;
        }
      }

      // 切换到怪物回合
      this.battleState.isPlayerTurn = false;

      // 延迟怪物攻击
      setTimeout(() => {
        this.monsterAttack();
      }, 1000);
    },

    // 怪物攻击
    monsterAttack() {
      if (
        !this.battleState.isInBattle ||
        !this.battleState.currentMonster ||
        this.battleState.isPlayerTurn
      ) {
        return;
      }

      const monster = this.battleState.currentMonster;
      const player = this.player;

      // 检查是否命中
      const hitChance = 0.7 - player.attributes.dodge / 100;
      const isHit = Math.random() < hitChance;

      if (!isHit) {
        this.addBattleLog({
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
          this.addBattleLog({
            text: `你用灵力护盾挡住了${monster.name}的攻击，只受到了${damage}点伤害！`,
            type: "player",
          });
        } else {
          const logText = isCritical
            ? `${monster.name}对你发动了致命一击！造成了${damage}点伤害！`
            : `${monster.name}对你造成了${damage}点伤害。`;
          this.addBattleLog({
            text: logText,
            type: "monster",
          });
        }

        // 更新玩家生命值
        player.attributes.health = Math.max(
          0,
          player.attributes.health - damage
        );

        // 检查玩家是否死亡
        if (player.attributes.health <= 0) {
          this.addBattleLog({
            text: `你被${monster.name}击败了！`,
            type: "system",
          });
          this.handleBattleLose();
          return;
        }
      }

      // 切换回玩家回合
      this.battleState.isPlayerTurn = true;
    },

    // 玩家防御
    playerDefend() {
      if (!this.battleState.isInBattle || !this.battleState.isPlayerTurn) {
        return;
      }

      // 临时增加防御和格挡
      this.player.attributes.defense += 5;
      this.player.attributes.block += 5;

      this.addBattleLog({
        text: "你进入了防御姿态，防御力和格挡率临时提升！",
        type: "player",
      });

      // 切换到怪物回合
      this.battleState.isPlayerTurn = false;

      // 延迟怪物攻击
      setTimeout(() => {
        this.monsterAttack();
        // 回合结束后移除临时防御加成
        this.player.attributes.defense -= 5;
        this.player.attributes.block -= 5;
      }, 1000);
    },

    // 玩家逃跑
    playerEscape() {
      if (!this.battleState.isInBattle || !this.battleState.isPlayerTurn) {
        return;
      }

      // 逃跑成功率基于身法
      const escapeChance = 0.5 + this.player.attributes.dodge / 200;
      const isEscaped = Math.random() < escapeChance;

      if (isEscaped) {
        this.addBattleLog({
          text: "你成功逃脱了战斗！",
          type: "player",
        });
        this.handleBattleEscape();
      } else {
        this.addBattleLog({
          text: "你没能逃脱，战斗继续！",
          type: "monster",
        });

        // 切换到怪物回合
        this.battleState.isPlayerTurn = false;

        // 延迟怪物攻击
        setTimeout(() => {
          this.monsterAttack();
        }, 1000);
      }
    },

    // 处理战斗胜利
    handleBattleWin(monster: Monster) {
      this.battleState.battleResult = "win";

      // 获得经验值
      this.player.exp += monster.expReward;
      this.addBattleLog({
        text: `你获得了${monster.expReward}点经验值！`,
        type: "system",
      });

      // 移除地点中的怪物
      const location = this.player.currentLocation;
      if (location) {
        delete location.monster;
      }

      // 检查是否升级
      if (this.player.exp >= this.player.maxExp) {
        this.levelUp();
      }

      // 恢复一些生命值
      const healthRecovery = Math.floor(this.player.attributes.maxHealth * 0.3);
      this.player.attributes.health = Math.min(
        this.player.attributes.health + healthRecovery,
        this.player.attributes.maxHealth
      );
      this.addBattleLog({
        text: `战斗结束，你恢复了${healthRecovery}点神魂强度。`,
        type: "system",
      });
    },

    // 处理战斗失败
    handleBattleLose() {
      this.battleState.battleResult = "lose";

      // 重置玩家状态
      this.player.attributes.health = this.player.attributes.maxHealth;

      // 扣除一些经验值
      const expPenalty = Math.floor(this.player.exp * 0.1);
      this.player.exp = Math.max(0, this.player.exp - expPenalty);
      this.addBattleLog({
        text: `你损失了${expPenalty}点经验值！`,
        type: "system",
      });

      // 自动回到初始地点
      this.switchLocation(0, 0);
    },

    // 处理战斗逃跑
    handleBattleEscape() {
      this.battleState.battleResult = "escape";
      this.endBattle();
    },

    // 结束战斗
    endBattle() {
      this.battleState.isInBattle = false;
      this.currentSystem = "outdoor";
    },

    // 吸收灵气（从当前地点）
    absorbSpiritQi(spiritType: SpiritRootType): boolean {
      return SpiritQiManager.absorbSpiritQi(
        this.player,
        spiritType,
        this.player.currentLocation,
        this.canLevelUp,
        () => this.levelUp()
      );
    },

    // 灵脉生产灵气
    produceSpiritQi() {
      SpiritQiManager.produceSpiritQi(this.map);
    },

    // 升级
    levelUp() {
      LevelUpManager.levelUp(this.player);
    },

    // 开始冷却
    startCooldown() {
      SpiritQiManager.startCooldown(this.player);
    },

    // 检查是否可以吸收特定类型的灵气
    canAbsorbSpiritQi(spiritType: SpiritRootType): boolean {
      return SpiritQiManager.canAbsorbSpiritQi(
        this.player,
        spiritType,
        this.player.currentLocation
      );
    },

    // 尝试自动吸收灵气
    tryAutoAbsorb() {
      return SpiritQiManager.tryAutoAbsorb(
        this.player,
        this.currentSystem,
        (spiritType: SpiritRootType) => this.canAbsorbSpiritQi(spiritType),
        (spiritType: SpiritRootType) => this.absorbSpiritQi(spiritType)
      );
    },

    // 开始自动吸收灵气
    startAutoAbsorb() {
      console.log("Starting auto absorb...");
      if (this.autoAbsorbInterval) return;

      this.isAutoAbsorbing = true;

      // 立即尝试一次吸收
      this.tryAutoAbsorb();

      // 设置定时器，定期尝试吸收
      this.autoAbsorbInterval = window.setInterval(() => {
        this.tryAutoAbsorb();
      }, 100);
    },

    // 停止自动吸收灵气
    stopAutoAbsorb() {
      console.log("Stopping auto absorb...");
      if (this.autoAbsorbInterval) {
        clearInterval(this.autoAbsorbInterval);
        this.autoAbsorbInterval = null;
      }
      this.isAutoAbsorbing = false;
    },

    // 切换自动吸收灵气状态
    toggleAutoAbsorb() {
      if (this.isAutoAbsorbing) {
        this.stopAutoAbsorb();
      } else {
        this.startAutoAbsorb();
      }
    },

    // 切换地点
    switchLocation(x: number, y: number) {
      MapManager.switchLocation(
        this.map,
        x,
        y,
        this.player.currentLocation,
        (location: GameLocation) => {
          this.player.currentLocation = location;
        },
        (monster: Monster) => {
          this.startBattle(monster);
        }
      );
    },

    // 上下左右移动
    move(direction: "up" | "down" | "left" | "right") {
      MapManager.move(
        direction,
        this.player.currentLocation,
        (x: number, y: number) => {
          this.switchLocation(x, y);
        }
      );
    },

    // 部署队友到指定位置
    deployTeammate(
      teammateId: string,
      row: number,
      column: number
    ): { success: boolean; reason: string } {
      // 检查位置是否有效
      if (
        row < 0 ||
        row >= this.team.positions.length ||
        column < 0 ||
        !this.team.positions[row] ||
        column >= this.team.positions[row].length
      ) {
        return { success: false, reason: "无效的位置" };
      }

      // 检查队友是否存在
      const teammate = this.team.allTeammates.find((t) => t.id === teammateId);
      if (!teammate) {
        return { success: false, reason: "队友不存在" };
      }

      // 检查该位置是否已被占用
      const targetPosition = this.team.positions[row]?.[column];
      if (targetPosition && targetPosition.teammateId) {
        return { success: false, reason: "该位置已被占用" };
      }

      // 检查队友是否已经在其他位置
      for (let r = 0; r < this.team.positions.length; r++) {
        const row = this.team.positions[r];
        if (row) {
          for (let c = 0; c < row.length; c++) {
            const position = row[c];
            if (position && position.teammateId === teammateId) {
              position.teammateId = undefined;
            }
          }
        }
      }

      // 部署队友到新位置
      if (targetPosition) {
        targetPosition.teammateId = teammateId;
        return { success: true, reason: "部署成功" };
      }

      return { success: false, reason: "部署失败" };
    },

    // 取消部署队友
    undeployTeammate(teammateId: string): { success: boolean; reason: string } {
      // 检查队友是否存在
      const teammate = this.team.allTeammates.find((t) => t.id === teammateId);
      if (!teammate) {
        return { success: false, reason: "队友不存在" };
      }

      // 检查队友是否是玩家
      if (teammate.isPlayer) {
        return { success: false, reason: "玩家不能取消部署" };
      }

      // 从位置上移除队友
      let found = false;
      for (let row = 0; row < this.team.positions.length; row++) {
        const currentRow = this.team.positions[row];
        if (currentRow) {
          for (let col = 0; col < currentRow.length; col++) {
            const position = currentRow[col];
            if (position && position.teammateId === teammateId) {
              position.teammateId = undefined;
              found = true;
            }
          }
        }
      }

      if (found) {
        return { success: true, reason: "取消部署成功" };
      } else {
        return { success: false, reason: "队友未部署" };
      }
    },

    // 交换两个位置的队友
    swapTeammates(
      row1: number,
      col1: number,
      row2: number,
      col2: number
    ): { success: boolean; reason: string } {
      // 检查位置是否有效
      if (
        row1 < 0 ||
        row1 >= this.team.positions.length ||
        col1 < 0 ||
        !this.team.positions[row1] ||
        col1 >= this.team.positions[row1].length ||
        row2 < 0 ||
        row2 >= this.team.positions.length ||
        col2 < 0 ||
        !this.team.positions[row2] ||
        col2 >= this.team.positions[row2].length
      ) {
        return { success: false, reason: "无效的位置" };
      }

      const position1 = this.team.positions[row1]?.[col1];
      const position2 = this.team.positions[row2]?.[col2];

      if (!position1 || !position2) {
        return { success: false, reason: "无效的位置" };
      }

      // 交换队友ID
      const temp = position1.teammateId;
      position1.teammateId = position2.teammateId;
      position2.teammateId = temp;

      return { success: true, reason: "交换成功" };
    },

    // 更新游戏时间
    updateGameTime() {
      if (this.gameTime.isPaused) return;
      this.gameTime.tick(1000);
    },

    // 开始时间流动
    startTimeFlow() {
      if (this.timeInterval) return;
      this.timeInterval = window.setInterval(() => {
        this.updateGameTime();
        this.produceSpiritQi();
      }, 1000);
    },

    // 暂停时间流动
    pauseTimeFlow() {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
      }
      this.gameTime.isPaused = true;
    },

    // 恢复时间流动
    resumeTimeFlow() {
      this.gameTime.isPaused = false;
      this.startTimeFlow();
    },

    // 切换时间流动状态
    toggleTimeFlow() {
      if (this.gameTime.isPaused) {
        this.resumeTimeFlow();
      } else {
        this.pauseTimeFlow();
      }
    },
  },
});