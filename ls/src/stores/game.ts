import { Card } from '@/game/Card';
import { Minion } from '@/game/Minion';
import { Player } from '@/game/Player';
import { Spell } from '@/game/Spell';
import { Tavern } from '@/game/Tavern';
import { defineStore } from 'pinia';
import { Tavern } from '@/game/Tavern';
import { Minion } from '@/game/Minion';

export const useGameStore = defineStore('game', {
  // 主Store不再包含自己的state，而是通过getters访问子Store的state
  state: () => ({}),

  getters: {
    // 英雄选择阶段状态
    selectedHero: () => useHeroSelectionStore().selectedHero,
    availableHeroes: () => useHeroSelectionStore().availableHeroes,
    isHeroSelected: () => useHeroSelectionStore().isHeroSelected,
    availableHeroesCount: () => useHeroSelectionStore().availableHeroesCount,

    // 玩家操作阶段状态
    player: () => usePlayerActionsStore().player,
    tavern: () => usePlayerActionsStore().tavern,
    aiPlayers: () => usePlayerActionsStore().aiPlayers,
    currentTurn: () => usePlayerActionsStore().currentTurn,
    minionPool: () => usePlayerActionsStore().minionPool,
    selectedCard: () => usePlayerActionsStore().selectedCard,
    selectedCardIndex: () => usePlayerActionsStore().selectedCardIndex,
    spellUsageState: () => usePlayerActionsStore().spellUsageState,
    highlightedTargets: () => usePlayerActionsStore().highlightedTargets,
    dragArrow: () => usePlayerActionsStore().dragArrow,
    availableTargets: () => usePlayerActionsStore().availableTargets,

    // 战斗阶段状态
    battleResult: () => useBattleStore().battleResult,
    battleLog: () => useBattleStore().getBattleLog,
    isBattleActive: () => useBattleStore().isBattleInProgress,

    // 调试模式状态
    isDebugEnabled: () => useDebugStore().debugModeEnabled,
  },

  actions: {
    // 初始化游戏
    initGame(player: Player, tavern: Tavern, aiPlayers: Player[], minionPool: Minion[]) {
      usePlayerActionsStore().initGame(player, tavern, aiPlayers, minionPool);
    },

    // ========================================
    // 选择英雄阶段相关方法
    // ========================================
    selectHero(hero: any) {
      useHeroSelectionStore().selectHero(hero);
    },

    setAvailableHeroes(heroes: any[]) {
      useHeroSelectionStore().setAvailableHeroes(heroes);
    },

    resetHeroSelection() {
      useHeroSelectionStore().resetHeroSelection();
    },

    // ========================================
    // 玩家操作阶段相关方法
    // ========================================
    refreshTavern() {
      usePlayerActionsStore().refreshTavern();
    },

    upgradeTavern() {
      return usePlayerActionsStore().upgradeTavern();
    },

    freezeTavern() {
      usePlayerActionsStore().freezeTavern();
    },

    unfreezeTavern() {
      usePlayerActionsStore().unfreezeTavern();
    },

    buyMinion(index: number) {
      return usePlayerActionsStore().buyMinion(index);
    },

    endTurn() {
      usePlayerActionsStore().endTurn();
    },

    moveCard(cardId: string, fromArea: string, toArea: string) {
      return usePlayerActionsStore().moveCard(cardId, fromArea, toArea);
    },

    placeMinionFromHand(index: number, position: number) {
      return usePlayerActionsStore().placeMinionFromHand(index, position);
    },

    sellMinion(type: 'minion' | 'hand', index: number) {
      return usePlayerActionsStore().sellMinion(type, index);
    },

    returnMinionToHand(position: number) {
      return usePlayerActionsStore().returnMinionToHand(position);
    },

    reorderMinions(fromIndex: number, toIndex: number) {
      return usePlayerActionsStore().reorderMinions(fromIndex, toIndex);
    },

    selectCard(card: any, index: number) {
      usePlayerActionsStore().selectCard(card, index);
    },

    cancelSelectCard() {
      usePlayerActionsStore().cancelSelectCard();
    },

    selectSpell(spell: any, index: number) {
      usePlayerActionsStore().selectSpell(spell, index);
    },

    cancelSelectSpell() {
      usePlayerActionsStore().cancelSelectSpell();
    },

    calculateHighlightedTargets() {
      usePlayerActionsStore().calculateHighlightedTargets();
    },

    startSpellDrag(event: DragEvent, spell: any, index: number) {
      usePlayerActionsStore().startSpellDrag(event, spell, index);
    },

    updateSpellDrag(event: MouseEvent) {
      usePlayerActionsStore().updateSpellDrag(event);
    },

    endSpellDrag(event: DragEvent, target: any) {
      usePlayerActionsStore().endSpellDrag(event, target);
    },

    selectSpellTarget(target: any) {
      usePlayerActionsStore().selectSpellTarget(target);
    },

    detectTargetAtPosition(clientX: number, clientY: number) {
      return usePlayerActionsStore().detectTargetAtPosition(clientX, clientY);
    },

    castSpell(target: any) {
      usePlayerActionsStore().castSpell(target);
    },

    // ========================================
    // 战斗阶段相关方法
    // ========================================
    startBattle() {
      useBattleStore().startBattle();
    },

    endBattle(result: any) {
      useBattleStore().endBattle(result);
    },

    addBattleLog(message: string) {
      useBattleStore().addBattleLog(message);
    },

    clearBattleLog() {
      useBattleStore().clearBattleLog();
    },

    resetBattleState() {
      useBattleStore().resetBattleState();
    },

    // ========================================
    // 调试功能相关方法
    // ========================================
    toggleDebugMode() {
      useDebugStore().toggleDebugMode();
    },

    enableDebugMode() {
      useDebugStore().enableDebugMode();
    },

    disableDebugMode() {
      useDebugStore().disableDebugMode();
    },

    setCurrentGold(gold: number) {
      const player = usePlayerActionsStore().player;
      useDebugStore().setCurrentGold(player, gold);
    },

    setMaxGold(maxGold: number) {
      const player = usePlayerActionsStore().player;
      useDebugStore().setMaxGold(player, maxGold);
    },

    // ========================================
    // 全局重置方法
    // ========================================
    resetGame() {
      // 重置所有子Store
      useHeroSelectionStore().resetHeroSelection();
      useBattleStore().resetBattleState();
      // 玩家操作和调试Store的重置可以根据需要添加
    },
  },
});
