import { Player } from "./character";
import type { SpiritRootType } from "./character";
import { SpiritQi } from "./resources";
import { GameLocation } from "./world";
import { balanceConfig } from "../config/gameConfig";

export class SpiritQiManager {
  // 吸收灵气（从当前地点）
  static absorbSpiritQi(
    player: Player,
    spiritType: SpiritRootType,
    currentLocation: GameLocation | undefined,
    canLevelUp: boolean,
    levelUp: () => void
  ): boolean {
    if (player.isCooldown) return false;

    const { spiritRoots, absorbSpeed } = player;
    if (!currentLocation) return false;

    // 找到对应的灵根
    const root = spiritRoots.find((r) => r.type === spiritType);
    if (!root) return false;

    // 根据灵根等级计算吸收量
    const absorbAmount = Math.floor(
      balanceConfig.baseAbsorbAmount * root.level * absorbSpeed
    );
    const playerMaxQi = player.spiritQi[
      `max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi
    ] as number;

    // 计算实际可吸收的灵气量（不超过玩家上限和地点可用量）
    const availableQi = currentLocation.spiritQi[spiritType];
    const playerAvailableSpace = playerMaxQi - player.spiritQi[spiritType];
    const actualAbsorbAmount = Math.min(
      absorbAmount,
      availableQi,
      playerAvailableSpace
    );

    if (actualAbsorbAmount <= 0) return false;

    // 更新玩家灵气
    player.spiritQi[spiritType] += actualAbsorbAmount;

    // 更新地点灵气
    currentLocation.spiritQi[spiritType] -= actualAbsorbAmount;

    // 检查是否可以升级
    if (canLevelUp) {
      levelUp();
    }

    // 进入冷却状态
    this.startCooldown(player);
    return true;
  }

  // 灵脉生产灵气
  static produceSpiritQi(map: any): void {
    // 遍历所有地点
    map.locations.forEach((row: any) => {
      row.forEach((location: GameLocation) => {
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
  }

  // 开始冷却
  static startCooldown(player: Player): void {
    player.isCooldown = true;
    player.cooldownRemaining = player.cooldown;

    // 冷却倒计时
    const timer = setInterval(() => {
      if (player.cooldownRemaining <= 0) {
        player.isCooldown = false;
        player.cooldownRemaining = 0;
        clearInterval(timer);
      } else {
        player.cooldownRemaining -= 100;
      }
    }, 100);
  }

  // 检查是否可以吸收特定类型的灵气
  static canAbsorbSpiritQi(
    player: Player,
    spiritType: SpiritRootType,
    currentLocation: GameLocation | undefined
  ): boolean {
    if (!currentLocation) return false;

    const root = player.spiritRoots.find((r) => r.type === spiritType);
    if (!root) return false;

    const playerMaxQi = player.spiritQi[
      `max${spiritType.charAt(0).toUpperCase() + spiritType.slice(1)}` as keyof SpiritQi
    ] as number;

    const playerAvailableSpace = playerMaxQi - player.spiritQi[spiritType];
    const availableQi = currentLocation.spiritQi[spiritType];

    return !player.isCooldown && playerAvailableSpace > 0 && availableQi > 0;
  }

  // 尝试自动吸收灵气
  static tryAutoAbsorb(
    player: Player,
    currentSystem: string,
    canAbsorbSpiritQi: (spiritType: SpiritRootType) => boolean,
    absorbSpiritQi: (spiritType: SpiritRootType) => boolean
  ): boolean {
    // 检查是否在冷却中或不在修炼模式
    if (player.isCooldown || currentSystem !== "outdoor") return false;

    // 尝试所有灵气类型
    const spiritTypes: SpiritRootType[] = [
      "gold",
      "wood",
      "water",
      "fire",
      "earth",
    ];
    for (const spiritType of spiritTypes) {
      if (canAbsorbSpiritQi(spiritType)) {
        absorbSpiritQi(spiritType);
        return true;
      }
    }

    return false;
  }
}
