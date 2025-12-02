// 游戏配置文件

// 资源配置
export const resourceConfig = {
  // 初始灵气最大值
  initialMaxSpiritQi: 100,

  // 灵气升级系数（每级增加的百分比）
  spiritQiLevelUpFactor: 1.5,

  // 灵根类型
  spiritRootTypes: ["gold", "wood", "water", "fire", "earth"] as const,

  // 灵根名称映射
  spiritRootNames: {
    gold: "金灵根",
    wood: "木灵根",
    water: "水灵根",
    fire: "火灵根",
    earth: "土灵根",
  },

  // 灵气体类型名称映射（用于UI显示）
  spiritQiTypeNames: {
    gold: "金",
    wood: "木",
    water: "水",
    fire: "火",
    earth: "土",
  },

  // 灵气体颜色映射（用于UI显示）
  spiritQiColors: {
    gold: "#ffd700",
    wood: "#90ee90",
    water: "#87ceeb",
    fire: "#ff6347",
    earth: "#deb887",
  },
};

// 游戏平衡配置
export const balanceConfig = {
  // 灵气吸收基础量
  baseAbsorbAmount: 10,

  // 初始冷却时间（毫秒）
  initialCooldown: 1000,

  // 初始吸收速度
  initialAbsorbSpeed: 1.0,

  // 初始经验值上限
  initialMaxExp: 100,

  // 经验值升级系数
  expLevelUpFactor: 1.5,
};

// 导出默认配置
export default {
  resourceConfig,
  balanceConfig,
};
