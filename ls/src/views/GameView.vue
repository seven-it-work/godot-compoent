<template>
  <div class="main-frame" id="game-main">
    <div class="top-section">
      <!-- 酒馆区域 -->
      <HearthstoneTavern></HearthstoneTavern>
      <!-- end 酒馆区域 -->
      <!-- 炉石出战区域 -->
      <HearthstoneBattlefield></HearthstoneBattlefield>
      <!-- end 炉石出战区域 -->
    </div>
    <div class="bottom-section">
      <!-- 额外操作区域 -->
      <ActionArea></ActionArea>
      <!-- end 额外操作区域 -->
      <!-- 手牌区域 -->
      <HearthstoneHand></HearthstoneHand>
      <!-- end 手牌区域 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import HearthstoneBattlefield from '../components/HearthstoneBattlefield.vue';
import HearthstoneHand from '../components/HearthstoneHand.vue';
import HearthstoneTavern from '../components/HearthstoneTavern.vue';
import ActionArea from '../components/ActionArea.vue';
import heroesData from '../data/heroes.json';
import minionsData from '../data/minions.json';
import { AIPlayer } from '../game/AIPlayer';
import { Minion } from '../game/Minion';
import { minionClassMapByStrId } from '../game/minion/MinionClassMap';
import { Player } from '../game/Player';
import { Tavern } from '../game/Tavern';
import { useGameStore } from '../stores/game';

// 使用游戏store
const gameStore = useGameStore();

// 从JSON文件加载英雄数据，并随机选择3个
const loadHeroes = () => {
  // 复制英雄数据
  const allHeroes = [...heroesData] as any[];

  // 随机选择3个英雄
  const shuffledHeroes = allHeroes.sort(() => 0.5 - Math.random());
  const selectedHeroes = shuffledHeroes.slice(0, 3);

  // 存入store
  gameStore.setAvailableHeroes(selectedHeroes);
};

// 从已开发的随从类创建随从池
const createMinionPool = () => {
  // 只使用已开发的随从类，直接使用minionClassMapByStrId的键
  const developedStrIds = Object.keys(minionClassMapByStrId);

  // 辅助函数：递归提取所有随从数据（包括tokens中的）
  const extractAllMinions = (data: any[]): any[] => {
    let allMinions: any[] = [];

    data.forEach(item => {
      // 添加当前item
      allMinions.push(item);

      // 递归处理tokens
      if (item.tokens && Array.isArray(item.tokens)) {
        allMinions = allMinions.concat(extractAllMinions(item.tokens));
      }

      // 递归处理upgradeCard
      if (item.upgradeCard) {
        allMinions.push(item.upgradeCard);
        if (item.upgradeCard.tokens && Array.isArray(item.upgradeCard.tokens)) {
          allMinions = allMinions.concat(extractAllMinions(item.upgradeCard.tokens));
        }
      }
    });

    return allMinions;
  };

  // 提取所有随从数据（包括top-level和tokens中的）
  const allMinionData = extractAllMinions(minionsData);

  // 从所有数据中过滤出已开发的随从
  const globalMinionPool = allMinionData
    .filter(minionData => {
      // 只处理随从类型，并且strId在已开发列表中
      return minionData.cardType === 'minion' && developedStrIds.includes(minionData.strId);
    })
    .map(minionData => {
      // 为每个随从创建Minion实例
      const MinionClass = minionClassMapByStrId[minionData.strId];
      if (MinionClass) {
        try {
          return new MinionClass(
            minionData.id,
            minionData.strId,
            minionData.cardType,
            minionData.name,
            minionData.nameCN,
            minionData.text,
            minionData.mechanics || [],
            minionData.referencedTags || [],
            minionData.img,
            minionData.art,
            minionData.tier,
            minionData.health,
            minionData.attack,
            minionData.minionTypes || [],
            minionData.minionTypesCN || [],
            minionData.upgradeCard
          );
        } catch (error) {
          console.error(`创建随从 ${minionData.strId} 实例时出错:`, error);
          return null;
        }
      }
      return null;
    })
    .filter((minion): minion is Minion => minion !== null);

  // 酒馆专用池 - 使用全局池
  const tavernMinionPool = globalMinionPool;

  // 返回两个池：全局池和酒馆专用池
  return { globalMinionPool, tavernMinionPool };
};

// 初始化游戏
const initGame = (hero: any) => {
  // 创建随从池 - 获取全局池和酒馆专用池
  const { globalMinionPool, tavernMinionPool } = createMinionPool();

  // 转换heroPowerList为heroPower对象
  const heroPowerData = hero.heroPowerList?.[0] || {
    name: '未知技能',
    text: '无描述',
    manaCost: 0,
  };

  // 创建符合Hero类的hero对象
  const heroObj = {
    ...hero,
    heroPower: {
      name: heroPowerData.name,
      description: heroPowerData.text,
      type: 'active' as any,
      cost: heroPowerData.manaCost,
      cooldown: 0,
      currentCooldown: 0,
      use: () => {},
    },
  };

  // 创建玩家
  const player = new Player('player-1', heroObj as any, true);

  // 创建酒馆 - 使用酒馆专用池
  const tavern = new Tavern(1, tavernMinionPool);
  tavern.refresh();

  // 创建AI玩家
  const aiPlayers = [];
  for (let i = 0; i < 7; i++) {
    const aiHeroData = heroesData[i % heroesData.length] as any;
    const aiHeroPowerData = aiHeroData.heroPowerList?.[0] || {
      name: '未知技能',
      text: '无描述',
      manaCost: 0,
    };

    const aiHeroObj = {
      ...aiHeroData,
      heroPower: {
        name: aiHeroPowerData.name,
        description: aiHeroPowerData.text,
        type: 'active' as any,
        cost: aiHeroPowerData.manaCost,
        cooldown: 0,
        currentCooldown: 0,
        use: () => {},
      },
    };

    aiPlayers.push(new AIPlayer(`ai-${i + 1}`, aiHeroObj as any));
  }

  // 初始化store - 使用全局池作为游戏的主随从池
  gameStore.initGame(player, tavern, aiPlayers, globalMinionPool);
};

// 选择英雄方法
const selectHero = (heroId: string) => {
  const hero = gameStore.availableHeroes.find(h => h.id === heroId);
  if (hero) {
    // 存入store
    gameStore.selectHero(hero);
    // 初始化游戏
    initGame(hero);
    console.log('选择了英雄:', hero.name);
  }
};

// 页面加载时自动随机初始化英雄
onMounted(() => {
  // 加载英雄数据
  loadHeroes();
  // 随机选择第一个可用英雄
  if (gameStore.availableHeroes.length > 0) {
    const randomIndex = Math.floor(Math.random() * gameStore.availableHeroes.length);
    const randomHero = gameStore.availableHeroes[randomIndex];
    // 选择并初始化英雄
    if (randomHero) {
      selectHero(randomHero.id);
      console.log('页面加载时随机选择了英雄:', randomHero.name || '未知英雄');
    }
  }
});
</script>

<style scoped>
.main-frame {
  /* 适应App.vue的缩放环境，不再需要自己实现缩放 */
  width: 100%;
  height: 100%;
  border: 2px solid #000;
  padding: 20px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
}

.top-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.row {
  display: flex;
  flex: 1;
}

.bottom-section {
  flex: 1;
  display: flex;
  gap: 20px;
}

.large-cell {
  width: 30%;
  border: 2px solid #000;
  background-color: #e0e0e0;
}

.right-subsection {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
