<template>
  <div class="cultivator-actions">
    <h3>{{ title }}</h3>
    <div class="action-buttons">
      <!-- 升级按钮 -->
      <button
        v-if="showUpgrade"
        @click="handleUpgrade"
        :disabled="!cultivator.canUpgrade()"
        class="action-button upgrade"
        :class="buttonClassPrefix + '-upgrade'"
      >
        {{ upgradeButtonText }}
      </button>

      <!-- 突破按钮 -->
      <button
        v-if="showBreakthrough"
        @click="handleBreakthrough"
        :disabled="!cultivator.canBreakthrough()"
        class="action-button breakthrough"
        :class="buttonClassPrefix + '-breakthrough'"
      >
        {{ breakthroughButtonText }}
      </button>

      <!-- 攻击训练按钮 -->
      <button
        v-if="showAttack"
        @click="handleAttack"
        class="action-button attack"
        :class="buttonClassPrefix + '-attack'"
      >
        {{ attackButtonText }}
      </button>

      <!-- 恢复按钮 -->
      <button
        v-if="showRecover"
        @click="handleRecover"
        class="action-button recover"
        :class="buttonClassPrefix + '-recover'"
      >
        {{ recoverButtonText }}
      </button>

      <!-- 自定义操作按钮插槽 -->
      <slot name="custom-actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CultivatorClass } from "../impl";
import type { DamageResult } from "@/v1/damageResult";

// 定义组件属性
const props = withDefaults(
  defineProps<{
    // 修仙者实例
    cultivator: CultivatorClass;

    // 组件标题
    title?: string;

    // 按钮显示配置
    showUpgrade?: boolean;
    showBreakthrough?: boolean;
    showAttack?: boolean;
    showRecover?: boolean;

    // 按钮文本配置
    upgradeButtonText?: string;
    breakthroughButtonText?: string;
    attackButtonText?: string;
    recoverButtonText?: string;

    // 恢复值配置
    recoverQiBloodValue?: number;
    recoverSpiritPowerValue?: number;

    // 攻击目标配置
    attackTarget?: CultivatorClass | null;

    // 自定义按钮类前缀
    buttonClassPrefix?: string;
  }>(),
  {
    // 默认值
    title: "修仙者操作",
    showUpgrade: true,
    showBreakthrough: true,
    showAttack: true,
    showRecover: true,
    upgradeButtonText: (props) =>
      `升级 (${props.cultivator.realmLevel.getCurrentValue()} → ${props.cultivator.realmLevel.getCurrentValue() + 1})`,
    breakthroughButtonText: (props) =>
      `突破 (${props.cultivator.getCultivationLevelName()})`,
    attackButtonText: "攻击训练",
    recoverButtonText: "恢复",
    recoverQiBloodValue: 100,
    recoverSpiritPowerValue: 50,
    attackTarget: null,
    buttonClassPrefix: "cultivator-action",
  }
);

// 定义事件
const emit = defineEmits<{
  // 更新修仙者
  update: [cultivator: CultivatorClass];

  // 攻击事件
  attack: [damage: DamageResult];

  // 操作结果事件
  result: [message: string, type: "success" | "error" | "info"];

  // 按钮点击事件
  buttonClick: [buttonType: "upgrade" | "breakthrough" | "attack" | "recover"];
}>();

// 处理升级
const handleUpgrade = () => {
  if (props.cultivator.canUpgrade()) {
    props.cultivator.upgrade();
    emit("update", props.cultivator);
    emit(
      "result",
      `升级成功！当前等级: ${props.cultivator.realmLevel.getCurrentValue()}`,
      "success"
    );
    emit("buttonClick", "upgrade");
  } else {
    emit("result", "升级失败！条件不满足。", "error");
  }
};

// 处理突破
const handleBreakthrough = () => {
  if (props.cultivator.canBreakthrough()) {
    const success = props.cultivator.breakthrough();
    emit("update", props.cultivator);
    if (success) {
      emit(
        "result",
        `突破成功！当前境界: ${props.cultivator.getCultivationLevelName()}`,
        "success"
      );
    } else {
      emit("result", "突破失败！请继续努力。", "error");
    }
    emit("buttonClick", "breakthrough");
  } else {
    emit("result", "突破失败！条件不满足。", "error");
  }
};

// 处理攻击
const handleAttack = () => {
  // 使用传入的目标或创建临时目标
  const target = props.attackTarget || new CultivatorClass();
  const damageResult = props.cultivator.attackTarget(target);
  emit("attack", damageResult);
  emit(
    "result",
    `攻击训练完成！造成伤害: ${damageResult.actualDamage}`,
    "info"
  );
  emit("buttonClick", "attack");
};

// 处理恢复
const handleRecover = () => {
  props.cultivator.recoverQiBlood(props.recoverQiBloodValue);
  props.cultivator.recoverSpiritPower(props.recoverSpiritPowerValue);
  emit("update", props.cultivator);
  emit(
    "result",
    `恢复完成！当前气血: ${props.cultivator.qiBlood.getCurrentValue()}, 当前灵力: ${props.cultivator.spiritPower.getCurrentValue()}`,
    "success"
  );
  emit("buttonClick", "recover");
};
</script>

<style scoped></style>
