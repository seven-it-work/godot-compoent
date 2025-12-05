<template>
  <div class="cultivation-methods-panel">
    <h3>修仙者功法(待开发)</h3>

    <div v-if="cultivator.cultivationMethods.length > 0" class="methods-grid">
      <div
        v-for="method in getCultivationMethodsDetails()"
        :key="method.name"
        class="method-card"
      >
        <div class="method-header">
          <div class="method-title">
            <span class="method-name">{{ method.name }}</span>
            <span class="method-grade">{{ method.grade }}</span>
          </div>
          <span class="method-type">{{ method.type }}</span>
        </div>
        <div class="method-body">
          <div class="method-description">
            {{ method.description }}
          </div>
          <div class="method-effects">
            <h4>功法效果</h4>
            <div
              class="effect-item"
              v-for="effect in method.effects"
              :key="effect.attribute"
            >
              <span class="effect-attribute">{{ effect.attribute }}</span>
              <span class="effect-value"
                >{{ effect.value > 0 ? "+" : "" }}{{ effect.value }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-methods">
      <p>当前没有学会任何功法</p>
      <button @click="addRandomMethod" class="add-method-btn">
        添加随机功法
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CultivatorClass } from "../impl";

const { cultivator } = defineProps<{
  cultivator: CultivatorClass;
}>();

const emitEvents = defineEmits<{
  update: [cultivator: CultivatorClass];
}>();

// 预定义一些功法数据
const cultivationMethodsData = [
  {
    name: "基础拳法",
    grade: "凡级",
    type: "攻击",
    description: "入门级拳法，适合初学者修炼",
    effects: [{ attribute: "攻击力", value: 10 }],
  },
  {
    name: "金刚护体",
    grade: "黄级",
    type: "防御",
    description: "强化身体防御的功法",
    effects: [{ attribute: "防御力", value: 15 }],
  },
  {
    name: "五行吐纳法",
    grade: "玄级",
    type: "心法",
    description: "利用五行之气修炼的高级心法",
    effects: [
      { attribute: "气血", value: 20 },
      { attribute: "灵力", value: 15 },
    ],
  },
  {
    name: "雷动九天",
    grade: "地级",
    type: "攻击",
    description: "召唤雷电之力的强大功法",
    effects: [
      { attribute: "攻击力", value: 30 },
      { attribute: "暴击率", value: 5 },
    ],
  },
  {
    name: "天地同寿",
    grade: "天级",
    type: "心法",
    description: "传说中的顶级心法，能与天地同寿",
    effects: [
      { attribute: "气血", value: 50 },
      { attribute: "灵力", value: 40 },
      { attribute: "防御力", value: 25 },
    ],
  },
];

// 获取功法详情
const getCultivationMethodsDetails = () => {
  return cultivator.cultivationMethods.map((methodName: string) => {
    return (
      cultivationMethodsData.find((method) => method.name === methodName) || {
        name: methodName,
        grade: "未知",
        type: "未知",
        description: "暂无描述",
        effects: [],
      }
    );
  });
};

// 添加随机功法
const addRandomMethod = () => {
  // 筛选出还没有学会的功法
  const availableMethods = cultivationMethodsData.filter(
    (method) => !cultivator.cultivationMethods.includes(method.name)
  );

  if (availableMethods.length > 0) {
    // 随机选择一个功法
    const randomIndex = Math.floor(Math.random() * availableMethods.length);
    const selectedMethod = availableMethods[randomIndex];

    // 添加到修仙者的功法列表
    if (selectedMethod) {
      const updatedCultivator = new CultivatorClass({
        ...cultivator,
        cultivationMethods: [
          ...cultivator.cultivationMethods,
          selectedMethod.name,
        ],
      });

      emitEvents("update", updatedCultivator);
    }
  }
};
</script>

<style scoped>
.cultivation-methods-panel {
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.method-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.method-header {
  margin-bottom: 12px;
}

.method-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.method-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.method-grade {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.method-grade:nth-of-type(1) {
  background-color: #52c41a; /* 凡级 - 绿色 */
}

.method-grade:nth-of-type(2) {
  background-color: #faad14; /* 黄级 - 黄色 */
}

.method-grade:nth-of-type(3) {
  background-color: #1890ff; /* 玄级 - 蓝色 */
}

.method-grade:nth-of-type(4) {
  background-color: #722ed1; /* 地级 - 紫色 */
}

.method-grade:nth-of-type(5) {
  background-color: #eb2f96; /* 天级 - 红色 */
}

.method-type {
  font-size: 14px;
  color: #666;
}

.method-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.method-effects h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.effect-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 4px;
}

.effect-attribute {
  color: #666;
}

.effect-value {
  font-weight: bold;
  color: #52c41a;
}

.effect-value.negative {
  color: #f5222d;
}

.no-methods {
  text-align: center;
  padding: 32px;
  background-color: white;
  border-radius: 8px;
  border: 1px dashed #d9d9d9;
}

.add-method-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.add-method-btn:hover {
  background-color: #40a9ff;
}
</style>
