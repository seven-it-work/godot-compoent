// 地点图标配置 - 使用阿里巴巴图标库
// 格式: 地点名称 -> 图标代码数组（支持多个图标随机选择）
export const locationIcons: Record<string, string[]> = {
  "山谷": ["\uE8A4"],
  "森林": ["\uE61D"],
  "湖泊": ["\uE702"],
  "火山": ["\uE612"],
  "平原": ["\uE6B4"],
  "山脉": ["\uE600", "\uE619"], // 支持多个图标，随机选择
  "沙漠": ["\uE6B7"],
  "沼泽": ["\uE601"],
  "草原": ["\uE79E"],
  "洞穴": ["\uE606"],
};

// 获取随机图标
export const getRandomIcon = (locationName: string): string => {
  const icons = locationIcons[locationName] || [];
  if (icons.length === 0) return "\uE61D"; // 默认图标为森林
  
  const randomIndex = Math.floor(Math.random() * icons.length);
  return icons[randomIndex] || "\uE61D"; // 确保返回值不是undefined
};
