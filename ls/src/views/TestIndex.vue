<template>
  <div class="test-index">
    <div class="card-demo">
      <div class="demo-section">
        <div class="card-container">
          <Card :card="mockMinion1 as any" />
          <Card :card="mockMinion1 as any" />
          <Card :card="mockMinion1 as any" />
          <Card :card="mockMinion1 as any" />
          <Card :card="mockMinion1 as any" />
          <Card :card="mockMinion1 as any" />
          <Card :card="mockMinion1 as any" />
        </div>
      </div>
      
      <div class="demo-section">
        <div class="card-container">
          <Card :card="mockSpell1 as any" />
          <Card :card="mockSpell2 as any" />
          <Card :card="mockSpell3 as any" />
        </div>
      </div>
      <div class="demo-section">
        <div class="card-container">
          <Card :card="mockSpell1 as any" />
          <Card :card="mockSpell2 as any" />
          <Card :card="mockSpell3 as any" />
        </div>
      </div>
    </div>
    
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
import Card from '../components/Card.vue';

// 模拟随从数据
const mockMinion1 = {
  name: 'Alleycat',
  nameCN: '小巷幼猫',
  attack: 1,
  health: 1,
  tier: 1,
  minionTypesCN: ['野兽'],
  keywords: ['taunt', 'divine_shield'],
  cost: 1,
  hasAttacked: false,
};

const mockMinion2 = {
  name: 'BubbleGunner',
  nameCN: '泡泡枪兵',
  attack: 2,
  health: 3,
  tier: 2,
  minionTypesCN: ['机械'],
  keywords: ['windfury'],
  cost: 2,
  hasAttacked: true,
};

const mockMinion3 = {
  name: 'DeepSeaAngler',
  nameCN: '深海垂钓者',
  attack: 3,
  health: 2,
  tier: 1,
  minionTypesCN: ['鱼人'],
  keywords: ['stealth'],
  cost: 1,
  hasAttacked: false,
};

const mockMinion4 = {
  name: 'SunBaconRelaxer',
  nameCN: '太阳培根慰藉者',
  attack: 2,
  health: 4,
  tier: 3,
  minionTypesCN: ['野兽'],
  keywords: ['reborn'],
  cost: 3,
  hasAttacked: false,
};

// 模拟法术数据
const mockSpell1 = {
  nameCN: '火球术',
  text: '对一个随从造成6点伤害',
  type: 'spell',
};

const mockSpell2 = {
  nameCN: '群体治疗术',
  text: '为所有随从恢复8点生命值',
  type: 'spell',
};

const mockSpell3 = {
  nameCN: '变形术',
  text: '将一个随从变形为1/1的绵羊',
  type: 'shaping',
};
</script>

<style scoped>
.test-index {
  padding: 20px;
  color: white;
  text-align: center;
}

.test-index a {
  color: #4caf50;
  text-decoration: none;
}

.test-index a:hover {
  text-decoration: underline;
}

.card-demo {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}


.card-container {
  display: flex;
  justify-content: center;
  gap: 2px;
  flex-wrap: wrap;
}


</style>
