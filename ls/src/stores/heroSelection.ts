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

export const useHeroSelectionStore = defineStore('heroSelection', {
  state: () => ({
    // 选中的英雄

    selectedHero: null as Hero | null,

    // 可用英雄数据

    availableHeroes: [] as Hero[],
  }),

  getters: {
    // 是否已选择英雄

    isHeroSelected: state => state.selectedHero !== null,

    // 可用英雄数量

    availableHeroesCount: state => state.availableHeroes.length,
  },

  actions: {
    // 设置选中的英雄

    selectHero(hero: Hero) {
      this.selectedHero = hero;
    },

    // 设置可用英雄列表

    setAvailableHeroes(heroes: Hero[]) {
      this.availableHeroes = heroes;
    },

    resetHeroSelection() {
      this.selectedHero = null;

      this.availableHeroes = [];
    },
  },
});

export type HeroSelectionStore = ReturnType<typeof useHeroSelectionStore>;
