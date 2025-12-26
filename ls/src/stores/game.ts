import { Card } from '@/game/Card';
import { Minion } from '@/game/Minion';
import { Player } from '@/game/Player';
import { Spell } from '@/game/Spell';
import { Tavern } from '@/game/Tavern';
import { defineStore } from 'pinia';

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

export const useGameStore = defineStore('game', {
  state: () => ({
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
    // 选中的卡片
    selectedCard: null as Card | null,
    // 选中的卡片索引
    selectedCardIndex: null as number | null,
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
    // 战斗结果
    battleResult: null as any,
  }),

  getters: {
    // 获取当前可选择的目标列表
    availableTargets: state => {
      // 检查是否有选中的法术
      if (
        !state.selectedCard ||
        state.selectedCard.cardType !== 'spell' ||
        state.spellUsageState !== 'selecting_target'
      ) {
        return [];
      }

      const targets: any[] = [];
      const spell = state.selectedCard as Spell;

      // 收集所有可能的目标
      const allPossibleTargets: any[] = [];

      // 添加战场上的随从
      if (state.player) {
        state.player.minions.forEach((minion: any, index: number) => {
          if (minion) {
            allPossibleTargets.push({
              type: 'minion',
              source: 'battlefield',
              index,
              target: minion,
            });
          }
        });
      }

      // 添加酒馆中的随从
      if (state.tavern) {
        state.tavern.availableMinions.forEach((minion: any, index: number) => {
          if (minion) {
            allPossibleTargets.push({
              type: 'minion',
              source: 'tavern',
              index,
              target: minion,
            });
          }
        });
      }

      // 使用法术的filterTargets方法过滤目标
      const allMinions = allPossibleTargets.map(item => item.target);
      const filteredMinions = spell.filterTargets(allMinions);

      // 只保留过滤后的目标
      filteredMinions.forEach(minion => {
        const matchingTarget = allPossibleTargets.find(item => item.target === minion);
        if (matchingTarget) {
          targets.push(matchingTarget);
        }
      });

      return targets;
    },
  },

  actions: {
    // 设置选中的英雄
    selectHero(hero: Hero) {
      this.selectedHero = hero;
    },

    // 设置可用英雄
    setAvailableHeroes(heroes: Hero[]) {
      this.availableHeroes = heroes;
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
      console.log(`[gameStore] 接收到购买请求，尝试购买酒馆第${index}个位置的随从`);
      if (this.tavern && this.player) {
        // 先获取要购买的随从，但不从酒馆中移除
        const minion = this.tavern.availableMinions[index];
        if (minion) {
          console.log(`[gameStore] 找到要购买的随从: ${minion.name}，花费: ${minion.cost}`);
          // 检查是否可以购买（金币足够，手牌有空间）
          console.log(
            `[gameStore] 玩家当前金币: ${this.player.gold}，手牌总数量: ${this.player.cards.length}`
          );

          if (this.player.gold >= minion.cost && this.player.cards.length < this.player.maxCards) {
            console.log(`[gameStore] 购买条件满足，开始购买流程`);
            // 从酒馆中移除该随从
            const removedMinion = this.tavern.buyMinion(index);
            if (removedMinion) {
              // 执行招募操作
              const success = this.player.recruitMinion(removedMinion);
              console.log(`[gameStore] 招募结果: ${success}`);

              // Pinia会自动处理响应式更新，不需要手动创建新对象
              // 当player.cards在recruitMinion方法中被修改时，Pinia会检测到变化并更新视图
              if (success) {
                console.log('购买成功，响应式更新将自动触发');
              }

              return success;
            } else {
              console.log(`[gameStore] 从酒馆移除随从失败`);
            }
          } else {
            console.log(
              `[gameStore] 购买条件不满足: ${this.player.gold < minion.cost ? '金币不足' : '手牌已满'}`
            );
          }
        } else {
          console.log(`[gameStore] 酒馆第${index}个位置没有随从`);
        }
      } else {
        console.log(`[gameStore] 酒馆或玩家未初始化`);
      }
      return false;
    },

    // 结束回合 - 进入战斗阶段
    endTurn() {
      if (this.player) {
        // 执行玩家回合结束逻辑
        this.player.endTurn();

        // 进入战斗阶段
        console.log('进入战斗阶段...');
        // todo 开发进入战斗的逻辑
      }
    },

    // 移动卡片
    moveCard(cardId: string, fromArea: string, toArea: string) {
      console.log(`[gameStore] 接收到卡片移动请求: 卡片 ${cardId} 从 ${fromArea} 移动到 ${toArea}`);

      // 处理从酒馆到手牌的移动
      if (fromArea === '酒馆' && toArea === '手牌' && this.tavern && this.player) {
        // 查找要移动的卡片
        const cardIndex = this.tavern.availableMinions.findIndex(
          minion => minion && minion.id === cardId
        );
        if (cardIndex !== -1) {
          // 获取要移动的随从
          const minion = this.tavern.availableMinions[cardIndex];

          // 检查是否可以招募（金币足够，手牌有空间）
          if (
            minion &&
            this.player.gold >= minion.cost &&
            this.player.cards.length < this.player.maxCards
          ) {
            console.log(`[gameStore] 移动条件满足，开始移动卡片`);

            // 从酒馆中移除该随从
            const removedMinion = this.tavern.buyMinion(cardIndex);
            if (removedMinion) {
              // 执行招募操作
              const success = this.player.recruitMinion(removedMinion);
              console.log(`[gameStore] 招募结果: ${success}`);

              return success;
            }
          } else {
            console.log(
              `[gameStore] 移动条件不满足: ${minion && this.player.gold < minion.cost ? '金币不足' : '手牌已满'}`
            );
          }
        } else {
          console.log(`[gameStore] 未找到要移动的卡片: ${cardId}`);
        }
      }

      return false;
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
        if (success && minionToPlace && minionToPlace.cardType === 'minion') {
          console.log('放置成功，触发所有效果');
          // 将minionToPlace类型断言为Minion，因为我们已经检查了cardType === 'minion'
          const placedMinion = minionToPlace as any;

          // 1. 触发放置随从的onMinionPlayed事件（使用本随从事件）
          console.log('触发随从onMinionPlayed事件:', placedMinion.nameCN);
          if (typeof placedMinion.onMinionPlayed === 'function') {
            placedMinion.onMinionPlayed(this);
          }

          // 2. 触发放置随从的battlecry事件（战吼效果）
          console.log('触发随从battlecry事件:', placedMinion.nameCN);
          if (typeof placedMinion.battlecry === 'function') {
            placedMinion.battlecry(this);
          }

          // 3. 触发当前玩家所有场上随从的onCardPlayed方法（使用其他卡片事件）
          console.log('触发所有场上随从的onCardPlayed事件');
          this.player.minions.forEach(fieldMinion => {
            if (fieldMinion && fieldMinion !== placedMinion) {
              console.log('调用场上随从的onCardPlayed:', fieldMinion.nameCN);
              fieldMinion.onCardPlayed(placedMinion, this);
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

    // 选择卡片
    selectCard(card: Card, index: number) {
      this.selectedCard = card;
      this.selectedCardIndex = index;
    },

    // 取消选择卡片
    cancelSelectCard() {
      this.selectedCard = null;
      this.selectedCardIndex = null;
    },

    // 选中法术
    selectSpell(spell: Spell, index: number) {
      // 使用通用的selectCard方法
      this.selectCard(spell, index);
      this.spellUsageState = 'selecting_target';

      // 计算并高亮可用目标
      this.calculateHighlightedTargets();
    },

    // 取消选中法术
    cancelSelectSpell() {
      // 使用通用的cancelSelectCard方法
      this.cancelSelectCard();
      this.spellUsageState = 'idle';
      this.highlightedTargets = [];
      this.dragArrow.visible = false;
    },

    // 计算并更新高亮目标
    calculateHighlightedTargets() {
      if (!this.selectedCard || this.selectedCard.cardType !== 'spell') {
        this.highlightedTargets = [];
        return;
      }

      const targets: any[] = [];
      const spell = this.selectedCard as Spell;

      // 收集所有可能的目标
      const allPossibleTargets: any[] = [];

      // 添加战场上的随从
      if (this.player) {
        this.player.minions.forEach((minion: any, index: number) => {
          if (minion) {
            allPossibleTargets.push({
              type: 'minion',
              source: 'battlefield',
              index,
              target: minion,
            });
          }
        });
      }

      // 添加酒馆中的随从
      if (this.tavern) {
        this.tavern.availableMinions.forEach((minion: any, index: number) => {
          if (minion) {
            allPossibleTargets.push({
              type: 'minion',
              source: 'tavern',
              index,
              target: minion,
            });
          }
        });
      }

      // 使用法术的filterTargets方法过滤目标
      const allMinions = allPossibleTargets.map(item => item.target);
      const filteredMinions = spell.filterTargets(allMinions);

      // 只保留过滤后的目标
      filteredMinions.forEach(minion => {
        const matchingTarget = allPossibleTargets.find(item => item.target === minion);
        if (matchingTarget) {
          targets.push(matchingTarget);
        }
      });

      this.highlightedTargets = targets;
    },

    // 开始拖拽法术
    startSpellDrag(event: DragEvent, spell: Spell, index: number) {
      console.log(`[法术拖拽] 开始拖拽法术: ${spell.nameCN} (索引: ${index})`);
      this.selectSpell(spell, index);

      // 记录拖拽起始位置
      this.dragArrow.visible = true;
      this.dragArrow.startX = event.clientX;
      this.dragArrow.startY = event.clientY;
      this.dragArrow.endX = event.clientX;
      this.dragArrow.endY = event.clientY;
      console.log(`[法术拖拽] 记录拖拽起始位置: (${event.clientX}, ${event.clientY})`);
    },

    // 更新拖拽箭头位置
    updateSpellDrag(event: MouseEvent) {
      if (this.dragArrow.visible) {
        const oldEndX = this.dragArrow.endX;
        const oldEndY = this.dragArrow.endY;
        this.dragArrow.endX = event.clientX;
        this.dragArrow.endY = event.clientY;

        // 只在位置变化超过一定阈值时记录日志，避免日志过多
        if (
          Math.abs(this.dragArrow.endX - oldEndX) > 10 ||
          Math.abs(this.dragArrow.endY - oldEndY) > 10
        ) {
          console.log(
            `[法术拖拽] 更新拖拽箭头位置: (${oldEndX}, ${oldEndY}) → (${event.clientX}, ${event.clientY})`
          );
        }
      }
    },

    // 结束法术拖拽
    endSpellDrag(_event: DragEvent, target: any) {
      console.log(`[法术拖拽] 结束法术拖拽，是否选择目标: ${!!target}`);
      this.dragArrow.visible = false;

      if (target && this.selectedCard && this.selectedCard.cardType === 'spell') {
        console.log(`[法术拖拽] 选择目标: ${target.target.nameCN}`);
        this.castSpell(target);
      } else {
        console.log(`[法术拖拽] 未选择目标，取消法术使用`);
        this.cancelSelectSpell();
      }
    },

    // 点击选择目标
    selectSpellTarget(target: any) {
      if (
        this.spellUsageState === 'selecting_target' &&
        this.selectedCard &&
        this.selectedCard.cardType === 'spell'
      ) {
        console.log(`[法术拖拽] 点击选择目标: ${target.target.nameCN}`);
        this.castSpell(target);
      } else {
        console.log(`[法术拖拽] 无效的目标选择: 法术使用状态: ${this.spellUsageState}`);
      }
    },

    // 检测鼠标坐标下的有效目标
    detectTargetAtPosition(clientX: number, clientY: number): any | null {
      if (
        !this.selectedCard ||
        this.selectedCard.cardType !== 'spell' ||
        this.spellUsageState !== 'selecting_target'
      ) {
        console.log(`[法术拖拽] 目标检测失败: 无效的法术使用状态`);
        return null;
      }

      console.log(`[法术拖拽] 开始检测鼠标位置 (${clientX}, ${clientY}) 下的目标`);
      console.log(`[法术拖拽] 当前高亮目标列表数量: ${this.highlightedTargets.length}`);
      console.log(
        `[法术拖拽] 高亮目标列表:`,
        JSON.stringify(
          this.highlightedTargets.map(t => ({
            source: t.source,
            index: t.index,
            targetName: t.target?.nameCN || '无名称',
          }))
        )
      );

      // 获取所有可能的目标元素
      const targetElements = document.querySelectorAll('.minion-card');
      console.log(`[法术拖拽] 找到 ${targetElements.length} 个可能的目标元素`);

      // 遍历所有目标元素，检查鼠标是否在元素范围内
      for (let i = 0; i < targetElements.length; i++) {
        const element = targetElements[i];
        if (!element) continue; // 检查元素是否存在

        const rect = element.getBoundingClientRect();

        // 检查鼠标坐标是否在元素范围内
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          console.log(`[法术拖拽] 鼠标位置 (${clientX}, ${clientY}) 在元素范围内，元素索引: ${i}`);
          console.log(
            `[法术拖拽] 元素位置: 左=${rect.left}, 右=${rect.right}, 上=${rect.top}, 下=${rect.bottom}`
          );
          console.log(`[法术拖拽] 元素内容: ${element.textContent}`);

          // 尝试从元素中提取随从信息
          const elementText = element.textContent || '';
          const elementMinionName = elementText.match(/([\u4e00-\u9fa5]+)/)?.[0] || '未知名称';
          console.log(`[法术拖拽] 从元素内容提取的可能随从名称: ${elementMinionName}`);

          // 遍历高亮目标列表，查找对应的目标
          for (const target of this.highlightedTargets) {
            console.log(
              `[法术拖拽] 检查高亮目标: ${target.source} ${target.index} ${target.target?.nameCN} ${target.target?.id}`
            );

            // 优化匹配逻辑：不再依赖元素文本包含名称，而是使用更可靠的匹配方式
            // 对于战场上的随从
            if (target.source === 'battlefield' && this.player) {
              const minion = this.player.minions[target.index];
              console.log(
                `[法术拖拽] 战场目标详细信息: 索引=${target.index}, 名称=${minion?.nameCN}, ID=${minion?.id}, 攻击=${minion?.attack}, 生命值=${minion?.health}`
              );
              // 检查minion是否存在，并且是有效目标
              if (minion) {
                // 由于DOM元素顺序可能与target.index不完全一致，我们可以采用更灵活的匹配方式
                // 1. 首先检查元素是否是战场随从卡片
                // 2. 然后检查元素是否包含该随从的一些特征
                const matchByText =
                  element.textContent &&
                  (element.textContent.includes(minion.nameCN || '') ||
                    element.textContent.includes(minion.id.toString()));
                console.log(`[法术拖拽] 文本匹配结果: ${matchByText}`);

                if (matchByText) {
                  console.log(`[法术拖拽] 找到匹配的战场目标: ${minion.nameCN}`);
                  return target;
                }
                // 如果名称匹配失败，尝试使用更简单的匹配方式：只要是战场目标且元素在战场区域，就匹配
                else if (element.closest('.player-minions')) {
                  console.log(`[法术拖拽] 简单匹配成功：战场区域内的目标`);
                  return target;
                }
              }
            }
            // 对于酒馆中的随从
            else if (target.source === 'tavern' && this.tavern) {
              const minion = this.tavern.availableMinions[target.index];
              console.log(
                `[法术拖拽] 酒馆目标详细信息: 索引=${target.index}, 名称=${minion?.nameCN}, ID=${minion?.id}, 攻击=${minion?.attack}, 生命值=${minion?.health}`
              );
              if (minion) {
                const matchByText =
                  element.textContent &&
                  (element.textContent.includes(minion.nameCN || '') ||
                    element.textContent.includes(minion.id.toString()));
                console.log(`[法术拖拽] 文本匹配结果: ${matchByText}`);

                if (matchByText) {
                  console.log(`[法术拖拽] 找到匹配的酒馆目标: ${minion.nameCN}`);
                  return target;
                }
                // 如果名称匹配失败，尝试使用更简单的匹配方式：只要是酒馆目标且元素在酒馆区域，就匹配
                else if (element.closest('.minions-area')) {
                  console.log(`[法术拖拽] 简单匹配成功：酒馆区域内的目标`);
                  return target;
                }
              }
            }
          }

          // 如果遍历完所有高亮目标都没有匹配到，但是元素确实是minion-card，且高亮目标列表不为空，
          // 那么我们可以尝试返回第一个高亮目标，或者使用其他启发式方法
          if (this.highlightedTargets.length > 0) {
            console.log(`[法术拖拽] 精确匹配失败，尝试返回第一个高亮目标`);
            return this.highlightedTargets[0];
          }
        }
      }

      console.log(`[法术拖拽] 未找到匹配的目标`);
      return null;
    },

    // 释放法术
    castSpell(target: any) {
      if (!this.selectedCard || this.selectedCard.cardType !== 'spell' || !this.player || !target) {
        console.log(`[法术拖拽] 法术释放失败: 无效参数`);
        this.cancelSelectSpell();
        return;
      }

      const spell = this.selectedCard as Spell;
      console.log(`[法术拖拽] 开始释放法术: ${spell.nameCN}`);
      this.spellUsageState = 'casting';

      try {
        console.log(`[法术拖拽] 执行法术效果，目标: ${target.target.nameCN}`);
        // 执行法术效果
        spell.execute(target.target);

        console.log(`[法术拖拽] 从手牌中移除法术，索引: ${this.selectedCardIndex}`);
        // 从手牌中移除法术
        if (this.selectedCardIndex !== null) {
          this.player.cards.splice(this.selectedCardIndex, 1);
        }

        console.log(`[法术拖拽] 法术释放成功: ${spell.nameCN} 目标: ${target.target.nameCN}`);
      } catch (error) {
        console.error(
          `[法术拖拽] 法术释放失败: ${error instanceof Error ? error.message : '未知错误'}`
        );
      } finally {
        console.log(`[法术拖拽] 法术释放流程结束，重置法术使用状态`);
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
