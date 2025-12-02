import { Player } from "./character";
import type { SpiritRootType } from "./character";
import { resourceConfig, balanceConfig } from "../config/gameConfig";

export class LevelUpManager {
  // 升级角色
  static levelUp(player: Player): void {
    player.level++;

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
        `max${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof player.spiritQi;
      // 使用类型断言修复类型错误
      (player.spiritQi as any)[maxKey] = Math.floor(
        (player.spiritQi as any)[maxKey] * resourceConfig.spiritQiLevelUpFactor
      );
      // 重置灵气值
      player.spiritQi[type] = 0;
    });

    // 增加经验值需求
    player.maxExp = Math.floor(player.maxExp * balanceConfig.expLevelUpFactor);

    // 提升战斗属性
    player.attributes.attack += 3;
    player.attributes.defense += 2;
    player.attributes.maxHealth += 20;
    player.attributes.health = player.attributes.maxHealth;
    player.attributes.dodge += 1;
    player.attributes.block += 1;
    player.attributes.critical += 1;
  }

  // 检查是否可以升级
  static canLevelUp(player: Player): boolean {
    const { spiritQi } = player;
    const activeRoots = player.spiritRoots;

    // 检查每个活跃灵根对应的灵气是否达到上限
    return activeRoots.every((root) => {
      const currentQi = spiritQi[root.type];
      const maxQi = spiritQi[
        `max${root.type.charAt(0).toUpperCase() + root.type.slice(1)}` as keyof typeof spiritQi
      ] as number;
      return currentQi >= maxQi;
    });
  }
}
