import { defineStore } from 'pinia';
import { Minion } from '../game/Minion';
import { Player } from '../game/Player';
import { Tavern } from '../game/Tavern';
import { Spell } from '../game/Spell';

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
    selectedMinionSource: null as 'tavern' | 'battlefield' | 'hand' | null,
    // 选中的法术
    selectedSpell: null as Spell | null,
    // 选中的法术索引
    selectedSpellIndex: null as number | null,
    // 法术使用状态：准备使用、选择目标中
    spellUsageState: 'idle' as 'idle' | 'selecting_target' | 'casting',
    // 高亮的目标列表
    highlightedTargets: [] as any[],
    // 拖拽箭头状态
    dragArrow: {
      visible: false,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    } as {
      visible: boolean;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    },
  }),

  getters: {
    // 获取当前可选择的目标列表
    availableTargets: state => {
      if (!state.selectedSpell || state.spellUsageState !== 'selecting_target') {
        return [];
      }

      const targets: any[] = [];
      const spell = state.selectedSpell;

      // 根据法术使用范围和目标类型收集可用目标
      if (spell.targetSelection.scope === 'battlefield' || spell.targetSelection.scope === 'both') {
        // 战场上的随从
        if (state.player) {
          state.player.minions.forEach((minion, index) => {
            if (this.isValidTarget(minion, spell.targetSelection.targetType)) {
              targets.push({
                type: 'minion',
                source: 'battlefield',
                index,
                target: minion,
              });
            }
          });
        }
      }

      if (spell.targetSelection.scope === 'tavern' || spell.targetSelection.scope === 'both') {
        // 酒馆中的随从
        if (state.tavern) {
          state.tavern.availableMinions.forEach((minion, index) => {
            if (this.isValidTarget(minion, spell.targetSelection.targetType)) {
              targets.push({
                type: 'minion',
                source: 'tavern',
                index,
                target: minion,
              });
            }
          });
        }
      }

      return targets;
    },
  },

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
    initGame(player: Player, tavern: Tavern, aiPlayers: Player[], minionPool: Minion[]) {
      this.player = player;
      this.tavern = tavern;
      this.aiPlayers = aiPlayers;
      this.currentTurn = 1;
      this.minionPool = minionPool;
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
          const playerMinionCards = this.player.cards.filter(card => card.cardType === 'minion');
          if (this.player.gold >= minion.cost && playerMinionCards.length < 7) {
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

    // 将手牌中的随从放到战场上
    placeMinionFromHand(index: number, position: number) {
      console.log('gameStore.placeMinionFromHand被调用');
      console.log('index:', index);
      console.log('position:', position);
      console.log('player:', this.player);
      if (this.player) {
        console.log('调用player.placeMinionFromHand...');
        // 先获取要放置的随从，用于后续触发事件
        const minionToPlace = this.player.cards[index];
        const success = this.player.placeMinionFromHand(index, position);
        console.log('player.placeMinionFromHand返回:', success);

        // 放置成功后，触发所有效果
        if (success && minionToPlace) {
          console.log('放置成功，触发所有效果');

          // 1. 触发放置随从的onMinionPlayed事件（使用本随从事件）
          console.log('触发随从onMinionPlayed事件:', minionToPlace.nameCN);
          minionToPlace.onMinionPlayed(this);

          // 2. 触发放置随从的battlecry事件（战吼效果）
          console.log('触发随从battlecry事件:', minionToPlace.nameCN);
          minionToPlace.battlecry(this);

          // 3. 触发当前玩家所有场上随从的onCardPlayed方法（使用其他卡片事件）
          console.log('触发所有场上随从的onCardPlayed事件');
          this.player.minions.forEach(fieldMinion => {
            if (fieldMinion && fieldMinion !== minionToPlace) {
              console.log('调用场上随从的onCardPlayed:', fieldMinion.nameCN);
              fieldMinion.onCardPlayed(minionToPlace, this);
            }
          });
        }

        return success;
      }
      console.log('player不存在，无法放置随从');
      return false;
    },

    // 出售随从
    sellMinion(type: 'minion' | 'hand', index: number) {
      if (this.player) {
        return this.player.sellMinion(type, index);
      }
      return false;
    },

    // 将战场上的随从放回手牌
    returnMinionToHand(position: number) {
      if (this.player) {
        return this.player.returnMinionToHand(position);
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
    selectMinion(minion: Minion, index: number, source: 'tavern' | 'battlefield' | 'hand') {
      this.selectedMinion = minion;
      this.selectedMinionIndex = index;
      this.selectedMinionSource = source;
    },

    // 取消选择随从
    cancelSelectMinion() {
      this.selectedMinion = null;
      this.selectedMinionIndex = null;
      this.selectedMinionSource = null;
    },

    // 验证目标是否有效
    isValidTarget(target: any, targetType: string): boolean {
      if (!target) return false;

      switch (targetType) {
        case 'minion':
          return target.cardType === 'minion';
        case 'hero':
          return target.cardType === 'hero';
        case 'all_minions':
          return target.cardType === 'minion';
        case 'self':
          return target.owner === this.player;
        case 'friendly':
          return target.owner === this.player;
        case 'enemy':
          return target.owner !== this.player;
        case 'any':
          return true;
        default:
          return false;
      }
    },

    // 选中法术
    selectSpell(spell: Spell, index: number) {
      this.selectedSpell = spell;
      this.selectedSpellIndex = index;
      this.spellUsageState = 'selecting_target';

      // 计算并高亮可用目标
      this.calculateHighlightedTargets();
    },

    // 取消选中法术
    cancelSelectSpell() {
      this.selectedSpell = null;
      this.selectedSpellIndex = null;
      this.spellUsageState = 'idle';
      this.highlightedTargets = [];
      this.dragArrow.visible = false;
    },

    // 计算并更新高亮目标
    calculateHighlightedTargets() {
      if (!this.selectedSpell) {
        this.highlightedTargets = [];
        return;
      }

      const targets: any[] = [];
      const spell = this.selectedSpell;

      // 根据法术使用范围和目标类型收集可用目标
      if (spell.targetSelection.scope === 'battlefield' || spell.targetSelection.scope === 'both') {
        // 战场上的随从
        if (this.player) {
          this.player.minions.forEach((minion, index) => {
            if (this.isValidTarget(minion, spell.targetSelection.targetType)) {
              targets.push({
                type: 'minion',
                source: 'battlefield',
                index,
                target: minion,
              });
            }
          });
        }
      }

      if (spell.targetSelection.scope === 'tavern' || spell.targetSelection.scope === 'both') {
        // 酒馆中的随从
        if (this.tavern) {
          this.tavern.availableMinions.forEach((minion, index) => {
            if (this.isValidTarget(minion, spell.targetSelection.targetType)) {
              targets.push({
                type: 'minion',
                source: 'tavern',
                index,
                target: minion,
              });
            }
          });
        }
      }

      this.highlightedTargets = targets;
    },

    // 开始拖拽法术
    startSpellDrag(event: DragEvent, spell: Spell, index: number) {
      this.selectSpell(spell, index);

      // 记录拖拽起始位置
      this.dragArrow.visible = true;
      this.dragArrow.startX = event.clientX;
      this.dragArrow.startY = event.clientY;
      this.dragArrow.endX = event.clientX;
      this.dragArrow.endY = event.clientY;
    },

    // 更新拖拽箭头位置
    updateSpellDrag(event: MouseEvent) {
      if (this.dragArrow.visible) {
        this.dragArrow.endX = event.clientX;
        this.dragArrow.endY = event.clientY;
      }
    },

    // 结束法术拖拽
    endSpellDrag(_event: DragEvent, target: any) {
      this.dragArrow.visible = false;

      if (target && this.selectedSpell) {
        this.castSpell(target);
      } else {
        this.cancelSelectSpell();
      }
    },

    // 点击选择目标
    selectSpellTarget(target: any) {
      if (this.spellUsageState === 'selecting_target' && this.selectedSpell) {
        this.castSpell(target);
      }
    },

    // 释放法术
    castSpell(target: any) {
      if (!this.selectedSpell || !this.player || !target) {
        this.cancelSelectSpell();
        return;
      }

      this.spellUsageState = 'casting';

      try {
        // 执行法术效果
        this.selectedSpell.execute(target.target);

        // 从手牌中移除法术
        if (this.selectedSpellIndex !== null) {
          this.player.cards.splice(this.selectedSpellIndex, 1);
        }

        console.log(`法术释放成功: ${this.selectedSpell.nameCN} 目标: ${target.target.nameCN}`);
      } catch (error) {
        console.error('法术释放失败:', error);
      } finally {
        // 重置法术使用状态
        this.cancelSelectSpell();
      }
    },

    // 调试功能 - 设置当前金币
    setCurrentGold(gold: number) {
      if (this.player) {
        this.player.gold = gold;
      }
    },

    // 调试功能 - 设置当前最大金币
    setMaxGold(maxGold: number) {
      if (this.player) {
        this.player.maxGold = maxGold;
      }
    },

    // 调试功能 - 添加随从到酒馆
    addMinionToTavern() {
      if (this.tavern && this.minionPool.length > 0) {
        // 随机从随从池中选择一个随从
        const randomIndex = Math.floor(Math.random() * this.minionPool.length);
        const randomMinion = this.minionPool[randomIndex];
        if (randomMinion) {
          // 复制随从对象，避免修改原对象
          const newMinion = randomMinion.clone();
          this.tavern.debugAddMinion(newMinion);
        }
      }
    },
  },
});
