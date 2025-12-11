import json
import os
import re

# 获取当前脚本所在目录
current_dir = os.path.dirname(os.path.abspath(__file__))
# 构建输入文件路径
input_file = os.path.join(current_dir, 'get_full_cards.json')
# 构建输出文件路径
minions_output = os.path.join(current_dir, 'minions.json')
heroes_output = os.path.join(current_dir, 'heroes.json')

# 预处理函数：移除JSON中的非法尾随逗号
def fix_json_with_trailing_commas(json_str):
    # 移除数组中的尾随逗号
    json_str = re.sub(r',\s*\n\s*]', r'\n]', json_str, flags=re.MULTILINE)
    # 移除对象中的尾随逗号
    json_str = re.sub(r',\s*\n\s*}', r'\n}', json_str, flags=re.MULTILINE)
    return json_str

try:
    # 读取输入文件
    with open(input_file, 'r', encoding='utf-8') as f:
        json_str = f.read()
    
    # 修复JSON中的尾随逗号
    fixed_json_str = fix_json_with_trailing_commas(json_str)
    
    # 解析修复后的JSON
    data = json.loads(fixed_json_str)
    
    # 检查数据结构
    if 'data' in data and isinstance(data['data'], dict):
        # 提取minion数组
        minions = data['data'].get('minion', [])
        # 提取hero数组
        heroes = data['data'].get('hero', [])
        
        # 保存minions.json
        with open(minions_output, 'w', encoding='utf-8') as f:
            json.dump(minions, f, ensure_ascii=False, indent=2)
        
        # 保存heroes.json
        with open(heroes_output, 'w', encoding='utf-8') as f:
            json.dump(heroes, f, ensure_ascii=False, indent=2)
        
        print(f"成功拆分get_full_cards.json文件！")
        print(f"- 生成minions.json文件，包含{len(minions)}个随从")
        print(f"- 生成heroes.json文件，包含{len(heroes)}个英雄")
    else:
        print("输入文件格式不符合预期！")
except Exception as e:
    print(f"处理文件时发生错误：{str(e)}")
    import traceback
    traceback.print_exc()
