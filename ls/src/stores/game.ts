import { defineStore } from 'pinia';
import { Player } from '../game/Player';
import { Tavern } from '../game/Tavern';
import { Minion } from '../game/Minion';

// 英雄类型定义
interface HeroPower {
  name: string;
  description: string;
  type: 'passive' | 'active' | 'channel';
  cost: number;
  cooldown: number;
  currentCooldown: number;
}

interface Hero {
  id: string;
  name: string;
  health: number;
  armor: number;
  heroPower: HeroPower;
}



// 游戏状态类型
type GameState = 'hero_selection' | 'in_game' | 'battle_phase' | 'game_over';

export const useGameStore = defineStore('game', {
  state: () => ({
    // 游戏状态
    gameState: 'hero_selection' as GameState,
    // 选中的英雄
    selectedHero: null as Hero | null,
    // 可用英雄数据
    availableHeroes: [] as Hero[],
    // 玩家
    player: null as Player | null,
    // 酒馆
    tavern: null as Tavern | null,
    // AI玩家
    aiPlayers: [] as Player[],
    // 当前回合
    currentTurn: 1,
    // 随从池数据
    minionPool: [] as Minion[],
    // 选中的随从
    selectedMinion: null as Minion | null,
    // 选中的随从索引
    selectedMinionIndex: null as number | null,
    // 选中的随从来源
    selectedMinionSource: null as 'tavern' | 'battlefield' | null
  }),
  
  actions: {
    // 设置选中的英雄
    selectHero(hero: Hero) {
      this.selectedHero = hero;
      this.gameState = 'in_game';
    },
    
    // 设置可用英雄
    setAvailableHeroes(heroes: Hero[]) {
      this.availableHeroes = heroes;
    },
    
    // 返回英雄选择
    returnToHeroSelection() {
      this.selectedHero = null;
      this.gameState = 'hero_selection';
    },
    
    // 初始化游戏
    initGame(player: Player, tavern: Tavern, aiPlayers: Player[]) {
      this.player = player;
      this.tavern = tavern;
      this.aiPlayers = aiPlayers;
      this.currentTurn = 1;
    },
    
    // 刷新酒馆
    refreshTavern() {
      if (this.tavern && this.player) {
        if (this.player.refreshTavern()) {
          this.tavern.refresh();
        }
      }
    },
    
    // 升级酒馆
    upgradeTavern() {
      if (this.player) {
        const success = this.player.upgradeTavern();
        if (success && this.tavern) {
          this.tavern.level = this.player.tavernLevel;
        }
        return success;
      }
      return false;
    },
    
    // 冻结酒馆
    freezeTavern() {
      if (this.tavern) {
        this.tavern.freeze();
      }
    },
    
    // 解冻酒馆
    unfreezeTavern() {
      if (this.tavern) {
        this.tavern.unfreeze();
      }
    },
    
    // 购买随从
    buyMinion(index: number) {
      if (this.tavern && this.player) {
        // 先获取要购买的随从，但不从酒馆中移除
        const minion = this.tavern.availableMinions[index];
        if (minion) {
          // 检查是否可以购买（金币足够，手牌有空间）
          if (this.player.gold >= minion.cost && this.player.bench.length < 7) {
            // 从酒馆中移除该随从
            const removedMinion = this.tavern.buyMinion(index);
            if (removedMinion) {
              // 执行招募操作
              return this.player.recruitMinion(removedMinion);
            }
          }
        }
      }
      return false;
    },
    
    // 结束回合
    endTurn() {
      if (this.player) {
        this.player.endTurn();
        this.currentTurn += 1;
        // 解冻酒馆
        if (this.tavern) {
          this.tavern.unfreeze();
        }
      }
    },
    
    // 将 bench 中的随从放到战场上
    placeMinionFromBench(index: number, position: number) {
      if (this.player) {
        return this.player.placeMinionFromBench(index, position);
      }
      return false;
    },
    
    // 出售随从
    sellMinion(type: 'minion' | 'bench', index: number) {
      if (this.player) {
        return this.player.sellMinion(type, index);
      }
      return false;
    },
    
    // 将战场上的随从放回 bench
    returnMinionToBench(position: number) {
      if (this.player) {
        return this.player.returnMinionToBench(position);
      }
      return false;
    },
    
    // 重新排序战场上的随从
    reorderMinions(fromIndex: number, toIndex: number) {
      if (this.player) {
        return this.player.reorderMinions(fromIndex, toIndex);
      }
      return false;
    },
    
    // 选择随从
    selectMinion(minion: Minion, index: number, source: 'tavern' | 'battlefield') {
      this.selectedMinion = minion;
      this.selectedMinionIndex = index;
      this.selectedMinionSource = source;
    },
    
    // 取消选择随从
    cancelSelectMinion() {
      this.selectedMinion = null;
      this.selectedMinionIndex = null;
      this.selectedMinionSource = null;
    }
  }
});
