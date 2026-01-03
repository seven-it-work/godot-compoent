# 卡片开发说明文档

## 1. 目录结构

`src/server/all_cards/` 目录用于存放所有游戏卡片的实现代码，按照卡片类型进行分类：

```
all_cards/
├── hero/        # 英雄卡片
├── minions/     # 随从卡片
│   └── beast/   # 野兽类型随从
│       ├── Alleycat.ts
│       ├── Beetle.ts
│       ├── BuzzingVermin.ts
│       └── Tabbycat.ts
└── spell/       # 法术卡片
```

## 2. 卡片类型

### 2.1 随从卡片 (Minion)
- 继承自 `Minion` 类
- 按随从类型（如 beast, mech, dragon 等）组织在子目录中
- 实现战斗、亡语、战吼等效果

### 2.2 英雄卡片 (Hero)
- 继承自 `Hero` 类
- 实现英雄技能、英雄被动效果等

### 2.3 法术卡片 (Spell)
- 继承自 `Spell` 类
- 实现法术效果

## 3. 卡片实现规范

### 3.1 基本结构

每个卡片文件包含以下两部分：
1. **卡片类**：继承自对应基类，实现卡片的特殊效果
2. **BASE_DATA**：定义卡片的基础属性

### 3.2 卡片类结构

```typescript
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';

// 卡片类定义
export class CardName extends Minion {
  // 卡片特有属性
  inTavern: boolean = true;
  
  // 构造函数
  constructor() {
    super();
    // 初始化卡片数据
    minion_utils.initMinionData(this, BASE_DATA);
  }
  
  // 格式化卡片文本（可选）
  getTextFormatArr(currentGameId: string): string[] {
    // 实现文本格式化逻辑
  }
  
  // 亡语效果（可选，根据mechanics中的DEATHRATTLE决定是否需要）
  deathrattle(player: Player) {
    super.deathrattle(player);
    // 实现亡语逻辑
  }
  
  // 战吼效果（可选，根据mechanics中的BATTLECRY决定是否需要）
  battlecry(player: Player) {
    super.battlecry(player);
    // 实现战吼逻辑
  }
}

// 卡片基础数据
const BASE_DATA = {
  // 卡片属性定义
};
```

### 3.3 BASE_DATA 属性

| 属性名 | 类型 | 描述 |
|--------|------|------|
| id | number | 卡片唯一ID |
| strId | string | 卡片字符串ID（如 "BG31_803"） |
| cardType | string | 卡片类型（"minion", "hero", "spell"） |
| name | string | 英文名称 |
| nameCN | string | 中文名称 |
| text | string | 卡片文本（支持格式化占位符如 {0}） |
| mechanics | string[] | 机制列表（如 ["DEATHRATTLE", "TAUNT"]） |
| referencedTags | string[] | 引用标签 |
| img | string | 卡片图片URL |
| art | string | 卡片艺术图URL |
| tier | number | 星级（1-6） |
| cost | number | 费用（使用该卡片所需的费用） |
| health | number | 生命值（仅随从） |
| attack | number | 攻击力（仅随从） |
| minionTypes | string[] | 随从类型（仅随从） |
| minionTypesCN | string[] | 中文随从类型（仅随从） |
| upgradeCard | object | 升级卡片数据（金色版本） |
| tokens | object[] | 关联的token卡片 |

### 3.4 机制列表 (mechanics)

| 机制 | 描述 |
|------|------|
| BATTLECRY | 战吼：使用该卡片时触发效果 |
| DEATHRATTLE | 亡语：该卡片死亡时触发效果 |
| TAUNT | 嘲讽：必须先被攻击 |
| DIVINE_SHIELD | 圣盾：免疫第一次伤害 |
| WINDFURY | 风怒：每回合可以攻击两次 |
| STEALTH | 潜行：不会被攻击，除非主动攻击 |
| VENOMOUS | 烈毒：攻击时消灭目标 |
| REBORN | 复生：死亡后以1点生命值复活 |
| CHOOSE_ONE | 抉择：使用时选择一个效果 |
| MAGNETIC | 磁力：可以吸附到机械随从身上 |

## 4. 开发流程

### 4.1 新增卡片

1. **确定卡片类型**：决定是随从、英雄还是法术卡片
2. **创建文件**：在对应子目录下创建 TypeScript 文件
3. **编写卡片类**：继承对应基类，实现必要的方法
4. **定义 BASE_DATA**：填写卡片的基础属性
5. **实现特殊效果**：根据卡片机制，重写对应方法（如 deathrattle, battlecry）
6. **测试**：确保卡片能正常工作

### 4.2 修改卡片

1. **找到卡片文件**：在对应子目录下找到要修改的卡片文件
2. **修改属性**：更新 BASE_DATA 中的属性
3. **修改效果**：更新对应方法的实现
4. **测试**：确保修改后的卡片能正常工作

## 5. 示例：开发一个新随从卡片

### 5.1 步骤1：创建文件

在 `minions/beast/` 目录下创建 `NewBeast.ts` 文件

### 5.2 步骤2：编写卡片类

```typescript
import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';

export class NewBeast extends Minion {
  inTavern: boolean = true;
  
  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
  
  // 实现战吼效果
  battlecry(player: Player) {
    super.battlecry(player);
    // 战吼逻辑：给所有友方野兽+1/+1
    player.minionsOnBattlefield.forEach(minion => {
      if (minion.minionTypes.includes('beast')) {
        minion.addBuff({ name: this.name, attackBonus: 1, healthBonus: 1 });
      }
    });
  }
}

const BASE_DATA = {
  id: 123456,
  strId: 'NEW_BEAST_001',
  cardType: 'minion',
  name: 'New Beast',
  nameCN: '新野兽',
  text: '<b>战吼：</b>使所有友方野兽获得+1/+1。',
  mechanics: ['BATTLECRY'],
  referencedTags: [],
  img: 'https://example.com/new_beast.png',
  art: 'https://example.com/new_beast_art.png',
  tier: 2,
  health: 2,
  attack: 2,
  minionTypes: ['beast'],
  minionTypesCN: ['野兽'],
  upgradeCard: {
    // 金色版本数据
    id: 123457,
    strId: 'NEW_BEAST_001_G',
    cardType: 'minion',
    name: 'New Beast',
    nameCN: '新野兽',
    text: '<b>战吼：</b>使所有友方野兽获得+2/+2。',
    mechanics: ['BATTLECRY'],
    referencedTags: [],
    img: 'https://example.com/new_beast_gold.png',
    art: 'https://example.com/new_beast_art.png',
    tier: 2,
    health: 4,
    attack: 4,
    minionTypes: ['beast'],
    minionTypesCN: ['野兽'],
  },
};
```

## 6. 注意事项

1. **命名规范**：
   - 卡片类名：首字母大写的驼峰命名（如 `BuzzingVermin`）
   - 文件名：与类名相同（如 `BuzzingVermin.ts`）
   - strId：使用游戏内唯一标识符（如 `BG31_803`）

2. **数据完整性**：
   - 确保 BASE_DATA 包含所有必要属性
   - 确保 upgradeCard 数据完整
   - 确保 tokens 数据完整

3. **类型安全**：
   - 确保方法参数类型正确
   - 确保返回值类型正确
   - 避免使用 any 类型，除非必要

4. **性能考虑**：
   - 避免在战斗中执行复杂计算
   - 合理使用缓存
   - 避免内存泄漏

5. **测试**：
   - 确保卡片能正常初始化
   - 确保特殊效果能正确触发
   - 确保与其他卡片的交互正常

## 7. 常见问题

### 7.1 卡片无法被识别
- 检查文件名和类名是否一致
- 检查是否正确导出类
- 检查是否在 db_card 中注册

### 7.2 特殊效果不触发
- 检查 mechanics 中是否包含对应的机制
- 检查方法名是否正确（如 deathrattle, battlecry）
- 检查方法参数是否正确

### 7.3 类型错误
- 检查导入的类型是否正确
- 检查方法参数类型是否与父类一致
- 检查 BASE_DATA 属性类型是否正确

## 8. 相关文件

- `src/server/controller/entity/Minion.ts`：随从基类
- `src/server/controller/entity/Hero.ts`：英雄基类
- `src/server/controller/entity/Spell.ts`：法术基类
- `src/server/db/db_card.ts`：卡片数据库

## 9. 联系信息

如有问题或需要帮助，请联系开发团队。
