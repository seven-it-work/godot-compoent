import { Monster } from "./battle";
import { AttributesGenerator } from "./attributesGenerator";

export class MonsterGenerator {
  // 生成怪物
  static generateMonster(x: number, y: number): Monster {
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

    // 使用属性生成函数生成怪物属性
    const attributes = AttributesGenerator.generateAttributesByLevel(level);

    return new Monster({
      id: `monster-${x}-${y}-${Date.now()}`,
      name,
      level,
      attributes,
      expReward: level * 20,
      description:
        monsterDescriptions[
          Math.floor(Math.random() * monsterDescriptions.length)
        ] || "这是一个强大的怪物",
    });
  }
}
