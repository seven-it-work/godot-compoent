import { GameMap, GameLocation } from "./world";
import { getRandomIcon } from "../config/locationIcons";
import { Monster } from "./battle";
import type { SpiritRootType } from "./character";
import { SpiritVein } from "./battle";
import { SpiritQi } from "./resources";
import { MonsterGenerator } from "./monsterGenerator";
import { resourceConfig } from "../config/gameConfig";

export class MapManager {
  // 生成地图
  static generateMap(
    map: GameMap,
    setPlayerCurrentLocation: (location: GameLocation) => void
  ): void {
    const { width, height } = map;
    const locations: GameLocation[][] = [];
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
      const row: GameLocation[] = [];
      for (let x = 0; x < width; x++) {
        // 随机生成地点名称
        const randomName =
          locationNames[Math.floor(Math.random() * locationNames.length)] ||
          "山谷";
        const locationName = `${randomName}(${x},${y})`;
        // 获取随机图标
        const locationIcon = getRandomIcon(randomName);

        // 随机生成灵气分布
        const spiritQi = new SpiritQi({
          gold: Math.floor(Math.random() * resourceConfig.initialMaxSpiritQi),
          wood: Math.floor(Math.random() * resourceConfig.initialMaxSpiritQi),
          water: Math.floor(Math.random() * resourceConfig.initialMaxSpiritQi),
          fire: Math.floor(Math.random() * resourceConfig.initialMaxSpiritQi),
          earth: Math.floor(Math.random() * resourceConfig.initialMaxSpiritQi),
          maxGold: resourceConfig.initialMaxSpiritQi,
          maxWood: resourceConfig.initialMaxSpiritQi,
          maxWater: resourceConfig.initialMaxSpiritQi,
          maxFire: resourceConfig.initialMaxSpiritQi,
          maxEarth: resourceConfig.initialMaxSpiritQi,
        });

        // 随机生成灵脉（30%概率）
        let spiritVein: SpiritVein | undefined;
        if (Math.random() < 0.3) {
          const veinTypeIndex = Math.floor(
            Math.random() * spiritVeinTypes.length
          );
          const veinType = spiritVeinTypes[veinTypeIndex] as SpiritRootType;
          const veinLevel = Math.floor(Math.random() * 3) + 1; // 1-3级
          const veinName = `${veinType === "gold" ? "金" : veinType === "wood" ? "木" : veinType === "water" ? "水" : veinType === "fire" ? "火" : "土"}灵脉`;
          spiritVein = new SpiritVein(
            veinType,
            veinLevel * 5,
            veinLevel,
            veinName
          );
        }

        // 随机生成怪物（25%概率）
        let monster: Monster | undefined;
        if (Math.random() < 0.25 && !(x === 0 && y === 0)) {
          // 初始地点没有怪物
          monster = MonsterGenerator.generateMonster(x, y);
        }

        // 创建地点
        const location = new GameLocation({
          id: `${x}-${y}`,
          x,
          y,
          name: locationName,
          spiritQi,
          spiritVein,
          monster,
          isCurrent: x === 0 && y === 0, // 初始地点
          icon: locationIcon,
        });

        row.push(location);
      }
      locations.push(row);
    }

    map.locations = locations;
    // 确保locations[0][0]存在
    if (locations[0] && locations[0][0]) {
      setPlayerCurrentLocation(locations[0][0]);
    }
  }

  // 切换地点
  static switchLocation(
    map: GameMap,
    x: number,
    y: number,
    currentLocation: GameLocation | undefined,
    setPlayerCurrentLocation: (location: GameLocation) => void,
    startBattle: (monster: Monster) => void
  ): void {
    if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
      return; // 超出地图范围
    }

    // 取消当前地点的标记 - 只更新isCurrent状态，保留其他所有属性
    if (
      currentLocation &&
      typeof currentLocation.y === "number" &&
      typeof currentLocation.x === "number"
    ) {
      const row = map.locations[currentLocation.y];
      if (row && row[currentLocation.x]) {
        row[currentLocation.x]!.isCurrent = false;
      }
    }

    // 设置新地点 - 直接使用地图中存储的原始地点对象，避免属性丢失
    const newRow = map.locations[y];
    if (newRow && newRow[x]) {
      // 确保使用地图中存储的原始地点对象
      const mapLocation = newRow[x];

      // 只更新isCurrent状态
      mapLocation.isCurrent = true;

      // 直接引用地图中的原始对象，而不是创建新对象
      setPlayerCurrentLocation(mapLocation);

      // 检查是否有怪物，触发战斗
      if (mapLocation.monster) {
        startBattle(mapLocation.monster);
      }
    }
  }

  // 上下左右移动
  static move(
    direction: "up" | "down" | "left" | "right",
    currentLocation: GameLocation | undefined,
    switchLocation: (x: number, y: number) => void
  ): void {
    if (!currentLocation) return;

    const currentX = currentLocation.x;
    const currentY = currentLocation.y;
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

    switchLocation(newX, newY);
  }
}
