import { defineStore } from "pinia";
import type { GameState, SpiritRootType, SpiritQi } from "../types/game";

export const useGameStore = defineStore("game", {
  state: (): GameState => ({
    player: {
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
      absorbSpeed: 1.0,
      cooldown: 1000, // 1秒冷却时间
      isCooldown: false,
      cooldownRemaining: 0,
    },
    currentSystem: "training",
  }),

  getters: {
    // 获取玩家拥有的灵根类型列表
    activeSpiritRoots: (state): SpiritRootType[] => {
      return state.player.spiritRoots.map((root) => root.type);
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
  },

  actions: {
    // 吸收灵气
    absorbSpiritQi(spiritType: SpiritRootType) {
      if (this.player.isCooldown) return;

      const { spiritRoots, spiritQi, absorbSpeed } = this.player;

      // 找到对应的灵根
      const root = spiritRoots.find((r) => r.type === spiritType);
      if (!root) return;

      // 根据灵根等级计算吸收量
      const absorbAmount = Math.floor(10 * root.level * absorbSpeed);
      const maxQi = spiritQi[
        `max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi
      ] as number;

      // 更新灵气值，不超过上限
      this.player.spiritQi[spiritType] = Math.min(
        spiritQi[spiritType] + absorbAmount,
        maxQi
      );

      // 检查是否可以升级
      if (this.canLevelUp) {
        this.levelUp();
      }

      // 进入冷却状态
      this.startCooldown();
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

    // 切换游戏系统
    switchSystem(system: "training" | "outdoor") {
      this.currentSystem = system;
    },

    // 更新灵根等级
    updateSpiritRootLevel(type: SpiritRootType, level: number) {
      const root = this.player.spiritRoots.find((r) => r.type === type);
      if (root) {
        root.level = level;
      }
    },
  },
});
