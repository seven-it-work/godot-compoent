import { defineStore } from "pinia";
import type {
  GameState,
  SpiritRootType,
  SpiritQi,
  Location,
  SpiritVein,
  Monster,
  BattleAttributes,
  BattleLog,
  SpiritRoot,
} from "../types/game";

// 扩展GameState类型
interface ExtendedGameState extends GameState {
  // 用户界面相关状态
  uiState: {
    playerDetailActiveTab: string;
  };
}

export const useGameStore = defineStore("game", {
  state: (): ExtendedGameState => ({
    // 从localStorage读取保存的tab状态，如果没有则使用默认值
    uiState: {
      playerDetailActiveTab:
        localStorage.getItem("playerDetailActiveTab") || "attributes",
    },
    player: {
      name: "玩家",
      level: 1,
      exp: 0,
      maxExp: 100,
      spiritRoots: [
        { type: "gold", level: 1, name: "金灵根" },
        { type: "wood", level: 1, name: "木灵根" },
        { type: "water", level: 1, name: "水灵根" },
        { type: "fire", level: 1, name: "火灵根" },
        { type: "earth", level: 1, name: "土灵根" },
      ],
      spiritQi: {
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
      },
      attributes: {
        attack: 10, // 灵力攻击
        defense: 5, // 灵力防御
        health: 100, // 神魂强度
        maxHealth: 100, // 最大神魂强度
        dodge: 5, // 身法
        block: 5, // 灵力护盾
        critical: 5, // 灵眼
      },
      absorbSpeed: 1.0,
      cooldown: 1000, // 1秒冷却时间
      isCooldown: false,
      cooldownRemaining: 0,
      currentLocation: {
        id: "0-0",
        x: 0,
        y: 0,
        name: "初始地点",
        spiritQi: {
          gold: 50,
          wood: 50,
          water: 50,
          fire: 50,
          earth: 50,
          maxGold: 100,
          maxWood: 100,
          maxWater: 100,
          maxFire: 100,
          maxEarth: 100,
        },
        isCurrent: true,
      },
    },
    currentSystem: "outdoor",
    map: {
      width: 10,
      height: 10,
      locations: [],
    },
    gameTime: {
      year: 1,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      speed: 1,
      isPaused: false,
    },
    timeInterval: null,
    battleState: {
      isInBattle: false,
      battleLogs: [],
      isPlayerTurn: true,
    },
    // 自动吸收灵气相关状态
    isAutoAbsorbing: false,
    autoAbsorbInterval: null,
  }),

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
      return state.player.spiritRoots.map((root: SpiritRoot) => root.type);
    },

    // 检查是否可以升级
    canLevelUp: (state): boolean => {
      const { spiritQi } = state.player;
      const activeRoots = state.player.spiritRoots;

      // 检查每个活跃灵根对应的灵气是否达到上限
      return activeRoots.every((root) => {
        const currentQi = spiritQi[root.type];
        const maxQi =
          spiritQi[
            `max${root.type.charAt(0).toUpperCase() + root.type.slice(1)}` as keyof SpiritQi
          ];
        return currentQi >= (maxQi as number);
      });
    },

    // 获取当前地点
    getCurrentLocation: (state): Location => {
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
      this.generateMap();
      this.startTimeFlow();
    },

    // 重置玩家信息到初始状态
    resetPlayer() {
      this.player = {
        name: "玩家",
        level: 1,
        exp: 0,
        maxExp: 100,
        spiritRoots: [
          { type: "gold", level: 1, name: "金灵根" },
          { type: "wood", level: 1, name: "木灵根" },
          { type: "water", level: 1, name: "水灵根" },
          { type: "fire", level: 1, name: "火灵根" },
          { type: "earth", level: 1, name: "土灵根" },
        ],
        spiritQi: {
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
        },
        attributes: {
          attack: 10, // 灵力攻击
          defense: 5, // 灵力防御
          health: 100, // 神魂强度
          maxHealth: 100, // 最大神魂强度
          dodge: 5, // 身法
          block: 5, // 灵力护盾
          critical: 5, // 灵眼
        },
        absorbSpeed: 1.0,
        cooldown: 1000, // 1秒冷却时间
        isCooldown: false,
        cooldownRemaining: 0,
        currentLocation: {
          id: "0-0",
          x: 0,
          y: 0,
          name: "初始地点",
          spiritQi: {
            gold: 50,
            wood: 50,
            water: 50,
            fire: 50,
            earth: 50,
            maxGold: 100,
            maxWood: 100,
            maxWater: 100,
            maxFire: 100,
            maxEarth: 100,
          },
          isCurrent: true,
        },
      };
      console.log("玩家信息已重置到初始状态");
    },

    // 生成地图
    generateMap() {
      const { width, height } = this.map;
      const locations: Location[][] = [];
      const locationNames = [
        "山谷",
        "森林",
        "湖泊",
        "火山",
        "平原",
        "山脉",
        "沙漠",
        "沼泽",
        "草原",
        "洞穴",
      ];
      const spiritVeinTypes: SpiritRootType[] = [
        "gold",
        "wood",
        "water",
        "fire",
        "earth",
      ];

      for (let y = 0; y < height; y++) {
        const row: Location[] = [];
        for (let x = 0; x < width; x++) {
          // 随机生成地点名称
          const randomName =
            locationNames[Math.floor(Math.random() * locationNames.length)];
          const locationName = `${randomName}(${x},${y})`;

          // 随机生成灵气分布
          const spiritQi: SpiritQi = {
            gold: Math.floor(Math.random() * 100),
            wood: Math.floor(Math.random() * 100),
            water: Math.floor(Math.random() * 100),
            fire: Math.floor(Math.random() * 100),
            earth: Math.floor(Math.random() * 100),
            maxGold: 100,
            maxWood: 100,
            maxWater: 100,
            maxFire: 100,
            maxEarth: 100,
          };

          // 随机生成灵脉（30%概率）
          let spiritVein: SpiritVein | undefined;
          if (Math.random() < 0.3) {
            const veinTypeIndex = Math.floor(
              Math.random() * spiritVeinTypes.length
            );
            const veinType = spiritVeinTypes[veinTypeIndex] as SpiritRootType;
            const veinLevel = Math.floor(Math.random() * 3) + 1; // 1-3级
            spiritVein = {
              type: veinType,
              productionSpeed: veinLevel * 5, // 每级灵脉每秒生产5点灵气
              level: veinLevel,
              name: `${veinType === "gold" ? "金" : veinType === "wood" ? "木" : veinType === "water" ? "水" : veinType === "fire" ? "火" : "土"}灵脉`,
            };
          }

          // 随机生成怪物（25%概率）
          let monster: Monster | undefined;
          if (Math.random() < 0.25 && !(x === 0 && y === 0)) {
            // 初始地点没有怪物
            monster = this.generateMonster(x, y);
          }

          // 创建地点
          const location: Location = {
            id: `${x}-${y}`,
            x,
            y,
            name: locationName,
            spiritQi,
            spiritVein,
            monster,
            isCurrent: x === 0 && y === 0, // 初始地点
          };

          row.push(location);
        }
        locations.push(row);
      }

      this.map.locations = locations;
      // 确保locations[0][0]存在
      if (locations[0] && locations[0][0]) {
        this.player.currentLocation = locations[0][0];
      }
    },

    // 生成怪物
    generateMonster(x: number, y: number): Monster {
      const monsterNames = [
        "山妖",
        "水怪",
        "火灵",
        "木精",
        "土怪",
        "风妖",
        "雷怪",
        "冰灵",
        "毒蛊",
        "血魔",
      ];
      const monsterDescriptions = [
        "盘踞在此地的妖怪，吸收天地灵气修炼",
        "诞生于灵气汇聚之处的精怪",
        "作恶多端的邪修所化",
        "上古遗留的妖物",
        "被魔气侵蚀的生灵",
      ];

      const name =
        monsterNames[Math.floor(Math.random() * monsterNames.length)] ||
        "神秘怪物";
      const level = Math.floor(Math.random() * 3) + 1; // 1-3级
      const baseAttack = 5 + level * 3;
      const baseDefense = 2 + level * 2;
      const baseHealth = 50 + level * 20;
      const baseDodge = 3 + level;
      const baseBlock = 3 + level;
      const baseCritical = 3 + level;

      const attributes: BattleAttributes = {
        attack: baseAttack,
        defense: baseDefense,
        health: baseHealth,
        maxHealth: baseHealth,
        dodge: baseDodge,
        block: baseBlock,
        critical: baseCritical,
      };

      return {
        id: `monster-${x}-${y}-${Date.now()}`,
        name,
        level,
        attributes,
        expReward: level * 20,
        description:
          monsterDescriptions[
            Math.floor(Math.random() * monsterDescriptions.length)
          ] || "这是一个强大的怪物",
      };
    },

    // 切换地点
    switchLocation(x: number, y: number) {
      if (x < 0 || x >= this.map.width || y < 0 || y >= this.map.height) {
        return; // 超出地图范围
      }

      // 取消当前地点的标记 - 只更新isCurrent状态，保留其他所有属性
      const currentLoc = this.player.currentLocation;
      if (
        currentLoc &&
        typeof currentLoc.y === "number" &&
        typeof currentLoc.x === "number"
      ) {
        const row = this.map.locations[currentLoc.y];
        if (row && row[currentLoc.x]) {
          // 使用非空断言操作符确保TypeScript识别类型
          row[currentLoc.x]!.isCurrent = false;
        }
      }

      // 设置新地点 - 直接使用地图中存储的原始地点对象，避免属性丢失
      const newRow = this.map.locations[y];
      if (newRow && newRow[x]) {
        // 确保使用地图中存储的原始地点对象
        const mapLocation = newRow[x];

        // 只更新isCurrent状态
        mapLocation.isCurrent = true;

        // 直接引用地图中的原始对象，而不是创建新对象
        this.player.currentLocation = mapLocation;

        // 检查是否有怪物，触发战斗
        if (mapLocation.monster) {
          this.startBattle(mapLocation.monster);
        }
      }
    },

    // 上下左右移动
    move(direction: "up" | "down" | "left" | "right") {
      const currentX = this.player.currentLocation.x;
      const currentY = this.player.currentLocation.y;
      let newX = currentX;
      let newY = currentY;

      switch (direction) {
        case "up":
          newY = currentY - 1;
          break;
        case "down":
          newY = currentY + 1;
          break;
        case "left":
          newX = currentX - 1;
          break;
        case "right":
          newX = currentX + 1;
          break;
      }

      this.switchLocation(newX, newY);
    },

    // 开始战斗
    startBattle(monster: Monster) {
      this.battleState.isInBattle = true;
      this.battleState.currentMonster = { ...monster }; // 深拷贝，避免修改原怪物数据
      this.battleState.battleLogs = [];
      this.battleState.isPlayerTurn = true;
      this.battleState.battleResult = undefined;

      // 添加战斗开始日志
      this.addBattleLog({
        text: `你在${this.player.currentLocation.name}遇到了${monster.name}！`,
        type: "system",
      });

      // 切换到战斗系统
      this.currentSystem = "battle";

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
      const player = this.player;

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

      // 延迟怪物攻击，让玩家有时间看到结果
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

      // 结束战斗
      this.endBattle();
    },

    // 结束战斗
    endBattle() {
      this.battleState.isInBattle = false;
      this.currentSystem = "outdoor";
    },

    // 吸收灵气（从当前地点）
    absorbSpiritQi(spiritType: SpiritRootType) {
      if (this.player.isCooldown) return;

      const { spiritRoots, absorbSpeed } = this.player;
      const currentLocation = this.player.currentLocation;

      // 找到对应的灵根
      const root = spiritRoots.find((r: SpiritRoot) => r.type === spiritType);
      if (!root) return;

      // 根据灵根等级计算吸收量
      const absorbAmount = Math.floor(10 * root.level * absorbSpeed);
      const playerMaxQi = this.player.spiritQi[
        `max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi
      ] as number;

      // 计算实际可吸收的灵气量（不超过玩家上限和地点可用量）
      const availableQi = currentLocation.spiritQi[spiritType];
      const playerAvailableSpace =
        playerMaxQi - this.player.spiritQi[spiritType];
      const actualAbsorbAmount = Math.min(
        absorbAmount,
        availableQi,
        playerAvailableSpace
      );

      if (actualAbsorbAmount <= 0) return;

      // 更新玩家灵气
      this.player.spiritQi[spiritType] += actualAbsorbAmount;

      // 更新地点灵气
      currentLocation.spiritQi[spiritType] -= actualAbsorbAmount;

      // 检查是否可以升级
      if (this.canLevelUp) {
        this.levelUp();
      }

      // 进入冷却状态
      this.startCooldown();
    },

    // 灵脉生产灵气
    produceSpiritQi() {
      // 遍历所有地点
      this.map.locations.forEach((row) => {
        row.forEach((location) => {
          if (location.spiritVein) {
            const { type, productionSpeed } = location.spiritVein;
            const maxQi = location.spiritQi[
              `max${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof SpiritQi
            ] as number;

            // 生产灵气，不超过上限
            location.spiritQi[type] = Math.min(
              location.spiritQi[type] + productionSpeed,
              maxQi
            );
          }
        });
      });
    },

    // 升级
    levelUp() {
      this.player.level++;

      // 计算新的灵气上限（每级增加50%）
      const rootTypes: SpiritRootType[] = [
        "gold",
        "wood",
        "water",
        "fire",
        "earth",
      ];
      rootTypes.forEach((type) => {
        const maxKey =
          `max${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof SpiritQi;
        this.player.spiritQi[maxKey] = Math.floor(
          (this.player.spiritQi[maxKey] as number) * 1.5
        );
        // 重置灵气值
        this.player.spiritQi[type] = 0;
      });

      // 增加经验值需求
      this.player.maxExp = Math.floor(this.player.maxExp * 1.5);

      // 提升战斗属性
      this.player.attributes.attack += 3;
      this.player.attributes.defense += 2;
      this.player.attributes.maxHealth += 20;
      this.player.attributes.health = this.player.attributes.maxHealth;
      this.player.attributes.dodge += 1;
      this.player.attributes.block += 1;
      this.player.attributes.critical += 1;
    },

    // 开始冷却
    startCooldown() {
      this.player.isCooldown = true;
      this.player.cooldownRemaining = this.player.cooldown;

      // 冷却倒计时
      const timer = setInterval(() => {
        if (this.player.cooldownRemaining <= 0) {
          this.player.isCooldown = false;
          this.player.cooldownRemaining = 0;
          clearInterval(timer);
        } else {
          this.player.cooldownRemaining -= 100;
        }
      }, 100);
    },

    // 检查是否可以吸收特定类型的灵气
    canAbsorbSpiritQi(spiritType: SpiritRootType): boolean {
      const root = this.player.spiritRoots.find(
        (r: SpiritRoot) => r.type === spiritType
      );
      if (!root) return false;

      const playerMaxQi = this.player.spiritQi[
        `max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi
      ] as number;

      const playerAvailableSpace =
        playerMaxQi - this.player.spiritQi[spiritType];
      const availableQi = this.player.currentLocation.spiritQi[spiritType];

      return (
        !this.player.isCooldown && playerAvailableSpace > 0 && availableQi > 0
      );
    },

    // 尝试自动吸收灵气
    tryAutoAbsorb() {
      // 检查是否在冷却中或不在修炼模式
      if (this.player.isCooldown || this.currentSystem !== "outdoor") return;

      // 尝试所有灵气类型
      const spiritTypes: SpiritRootType[] = [
        "gold",
        "wood",
        "water",
        "fire",
        "earth",
      ];
      for (const spiritType of spiritTypes) {
        if (this.canAbsorbSpiritQi(spiritType)) {
          this.absorbSpiritQi(spiritType);
          return true;
        }
      }

      return false;
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

    // 开始时间流逝
    startTimeFlow() {
      if (this.timeInterval) return;

      // 每秒更新一次游戏时间
      this.timeInterval = window.setInterval(() => {
        if (this.gameTime.isPaused) return;

        // 更新时间
        this.gameTime.second += 1 * this.gameTime.speed;

        // 处理时间进位
        if (this.gameTime.second >= 60) {
          this.gameTime.second = 0;
          this.gameTime.minute += 1;
        }
        if (this.gameTime.minute >= 60) {
          this.gameTime.minute = 0;
          this.gameTime.hour += 1;
        }
        if (this.gameTime.hour >= 24) {
          this.gameTime.hour = 0;
          this.gameTime.day += 1;
        }
        if (this.gameTime.day > 30) {
          this.gameTime.day = 1;
          this.gameTime.month += 1;
        }
        if (this.gameTime.month > 12) {
          this.gameTime.month = 1;
          this.gameTime.year += 1;
        }

        // 每小时生产一次灵气（游戏时间）
        if (this.gameTime.minute === 0 && this.gameTime.second === 0) {
          this.produceSpiritQi();
        }
      }, 1000);
    },

    // 暂停时间流逝
    pauseTimeFlow() {
      this.gameTime.isPaused = true;
    },

    // 继续时间流逝
    resumeTimeFlow() {
      this.gameTime.isPaused = false;
    },

    // 设置时间流速
    setTimeSpeed(speed: number) {
      this.gameTime.speed = speed;
    },

    // 切换游戏系统
    switchSystem(system: "training" | "outdoor" | "battle") {
      this.currentSystem = system;
      // 初始化地图（如果是第一次进入外出系统）
      if (system === "outdoor" && this.map.locations.length === 0) {
        this.generateMap();
      }
    },

    // 更新灵根等级
    updateSpiritRootLevel(type: SpiritRootType, level: number) {
      const root = this.player.spiritRoots.find(
        (r: SpiritRoot) => r.type === type
      );
      if (root) {
        root.level = level;
      }
    },
  },
});
