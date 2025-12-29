import { Card } from '@/server/controller/entity/Card';
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    // 选中的卡牌
    selectedCard: null as Card | null,
    // 选中的卡牌索引
    selectedCardIndex: null as number | null,
  }),

  getters: {
    // 是否有选中的卡牌
    hasSelectedCard: state => state.selectedCard !== null,
  },

  actions: {
    // 设置选中的卡牌
    setSelectedCard(card: Card | null, index: number | null = null) {
      this.selectedCard = card;
      this.selectedCardIndex = index;
    },

    // 清除选中的卡牌
    clearSelectedCard() {
      this.selectedCard = null;
      this.selectedCardIndex = null;
    },
  },
});
