import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取源文件
const sourcePath = path.join(__dirname, 'get_full_cards.json');
const sourceContent = fs.readFileSync(sourcePath, 'utf8');
const sourceData = JSON.parse(sourceContent);

// 解析英雄数据
const heroesData = sourceData.data.hero.map(hero => {
  return {
    id: `hero-${hero.id}`,
    name: hero.nameCN,
    health: hero.health || 30,
    armor: hero.armor || 0,
    heroPower: {
      name: hero.heroPower?.nameCN || '',
      description: hero.heroPower?.textCN || '',
      type: hero.heroPower?.typeCN?.toLowerCase() || 'passive',
      cost: hero.heroPower?.cost || 0,
      cooldown: hero.heroPower?.cooldown || 0,
      currentCooldown: 0,
    },
  };
});

// 解析随从数据
const minionsData = sourceData.data.minion.map(minion => {
  // 将mechanics转换为keywords
  const mechanicsMap = {
    TAUNT: 'taunt',
    DIVINE_SHIELD: 'divine_shield',
    WINDFURY: 'windfury',
    REBORN: 'reborn',
    STEALTH: 'stealth',
    CHARGE: 'charge',
    POISONOUS: 'poisonous',
    IMMUNE: 'immune',
  };

  const keywords =
    minion.mechanics
      ?.map(mechanic => {
        return mechanicsMap[mechanic] || '';
      })
      .filter(Boolean) || [];

  // 确定随从类型
  let type = 'all';
  if (minion.minionTypes && minion.minionTypes.length > 0 && minion.minionTypes[0] !== 'none') {
    type = minion.minionTypes[0];
  }

  return {
    id: `minion-${minion.id}`,
    name: minion.nameCN,
    star: minion.tier || 1,
    type: type,
    attack: minion.attack || 0,
    health: minion.health || 0,
    cost: minion.cost || minion.tier || 1, // 使用cost字段或星级作为花费
    keywords: keywords,
    effects: [],
  };
});

// 写入英雄数据
const heroesPath = path.join(__dirname, 'heroes.json');
fs.writeFileSync(heroesPath, JSON.stringify(heroesData, null, 2), 'utf8');
console.log(`已写入${heroesData.length}个英雄数据到heroes.json`);

// 写入随从数据
const minionsPath = path.join(__dirname, 'minions.json');
fs.writeFileSync(minionsPath, JSON.stringify(minionsData, null, 2), 'utf8');
console.log(`已写入${minionsData.length}个随从数据到minions.json`);
