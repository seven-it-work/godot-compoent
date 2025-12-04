<template>
  <div class="cultivator-actions">
    <h3>修仙者操作</h3>
    <div class="action-buttons">
      <button 
        @click="handleUpgrade" 
        :disabled="!cultivator.canUpgrade()"
        class="action-button upgrade"
      >
        升级 ({{ cultivator.realmLevel.getCurrentValue() }} → {{ cultivator.realmLevel.getCurrentValue() + 1 }})
      </button>
      
      <button 
        @click="handleBreakthrough" 
        :disabled="!cultivator.canBreakthrough()"
        class="action-button breakthrough"
      >
        突破 ({{ cultivator.getCultivationLevelName() }})
      </button>
      
      <button 
        @click="handleAttack"
        class="action-button attack"
      >
        攻击训练
      </button>
      
      <button 
        @click="handleRecover"
        class="action-button recover"
      >
        恢复
      </button>
      
      <button 
        @click="handleRandomGenerate"
        class="action-button generate"
      >
        随机生成修仙者
      </button>
    </div>
    
    <div class="action-result" v-if="result">
      <h4>操作结果</h4>
      <p>{{ result }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CultivatorClass } from '../impl';
import type { DamageResult } from '@/v1/damageResult';
import { ref } from 'vue';

const props = defineProps<{
  cultivator: CultivatorClass;
}>();

const emit = defineEmits<{
  update: [cultivator: CultivatorClass];
  attack: [damage: DamageResult];
}>();

const result = ref<string>('');

const handleUpgrade = () => {
  if (props.cultivator.canUpgrade()) {
    props.cultivator.upgrade();
    result.value = `升级成功！当前等级: ${props.cultivator.realmLevel.getCurrentValue()}`;
    emit('update', props.cultivator);
  }
};

const handleBreakthrough = () => {
  if (props.cultivator.canBreakthrough()) {
    const success = props.cultivator.breakthrough();
    result.value = success ? 
      `突破成功！当前境界: ${props.cultivator.getCultivationLevelName()}` : 
      `突破失败！请继续努力。`;
    emit('update', props.cultivator);
  }
};

const handleAttack = () => {
  // 创建一个临时目标进行攻击训练
  const tempTarget = new CultivatorClass();
  const damageResult = props.cultivator.attackTarget(tempTarget);
  result.value = `攻击训练完成！造成伤害: ${damageResult.actualDamage}`;
  emit('attack', damageResult);
};

const handleRecover = () => {
  props.cultivator.recoverQiBlood(100);
  props.cultivator.recoverSpiritPower(50);
  result.value = `恢复完成！当前气血: ${props.cultivator.qiBlood.getCurrentValue()}, 当前灵力: ${props.cultivator.spiritPower.getCurrentValue()}`;
  emit('update', props.cultivator);
};

const handleRandomGenerate = () => {
  const newCultivator = CultivatorClass.随机生成人物();
  emit('update', newCultivator);
  result.value = `随机生成成功！新修仙者: ${newCultivator.name}`;
};
</script>

<style scoped>
.cultivator-actions {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
}

.cultivator-actions h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.action-button {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.upgrade {
  background-color: #4a90e2;
  color: white;
}

.action-button.breakthrough {
  background-color: #e74c3c;
  color: white;
}

.action-button.attack {
  background-color: #2ecc71;
  color: white;
}

.action-button.recover {
  background-color: #9b59b6;
  color: white;
}

.action-button.generate {
  background-color: #f39c12;
  color: white;
}

.action-result {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  background-color: white;
}

.action-result h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.action-result p {
  margin: 0;
  color: #555;
}
</style>