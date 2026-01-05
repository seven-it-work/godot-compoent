import json
import os

# 定义输入和输出文件路径
input_path = r'd:\my_project\godot-compoent\ls\src\data\minions.json'
output_path = r'd:\my_project\godot-compoent\ls\src\data\minions_tier2.json'

# 读取输入文件
try:
    with open(input_path, 'r', encoding='utf-8') as f:
        minions = json.load(f)
except FileNotFoundError:
    print(f"错误：找不到文件 {input_path}")
    exit(1)

# 筛选出 tier 为 2 的卡牌
tier2_minions = [minion for minion in minions if minion.get('tier') == 2]

# 打印筛选结果
print(f"总共找到 {len(tier2_minions)} 张 tier=2 的卡牌")

# 保存为新的 JSON 文件
try:
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(tier2_minions, f, ensure_ascii=False, indent=2)
    print(f"成功保存到 {output_path}")
except Exception as e:
    print(f"保存文件时出错：{e}")
    exit(1)

# 打印一些示例信息
if tier2_minions:
    print("\n前5张卡牌示例：")
    for i, minion in enumerate(tier2_minions[:5]):
        print(f"{i+1}. {minion.get('nameCN', '未知名称')} ({minion.get('attack', 0)}/{minion.get('health', 0)})")
