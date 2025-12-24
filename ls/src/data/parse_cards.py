import os
import json
import re

# 定义文件路径
MINIONS_JSON_PATH = r"e:\dev_soft\Godot_v4.3-stable_win64.exe\godot-compoent\ls\src\data\minions.json"
MINION_TS_DIR = r"e:\dev_soft\Godot_v4.3-stable_win64.exe\godot-compoent\ls\src\game\cards\minion"

# 读取minions.json文件
def load_minions_data():
    with open(MINIONS_JSON_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    # 手动处理字符串中的换行符，确保它们被正确转义
    # 注意：这需要非常小心，以免破坏JSON结构
    return json.loads(content)

# 提取TypeScript文件中BASE_DATA的strId
def extract_strid_from_ts(ts_content):
    # 修复正则表达式，确保能匹配JSON格式的strId
    match = re.search(r'"strId"\s*:\s*"([^"]+)"', ts_content)
    return match.group(1) if match else None

# 替换TypeScript文件中的BASE_DATA
def replace_base_data(ts_content, minion_data):
    # 首先，我们需要手动处理字符串中的换行符
    def process_value(value):
        if isinstance(value, str):
            # 将字符串中的换行符替换为\n
            return value.replace('\n', '\\n')
        elif isinstance(value, dict):
            return {k: process_value(v) for k, v in value.items()}
        elif isinstance(value, list):
            return [process_value(item) for item in value]
        else:
            return value
    
    # 处理数据中的换行符
    processed_data = process_value(minion_data)
    
    # 将处理后的数据转换为JSON字符串
    base_data_str = json.dumps(processed_data, ensure_ascii=False, indent=2)
    
    # 替换BASE_DATA内容
    updated_content = re.sub(
        r'static BASE_DATA = [^;]+;',
        f'static BASE_DATA = {base_data_str};',
        ts_content,
        flags=re.DOTALL
    )
    return updated_content

# 主函数
def main():
    # 加载minions数据
    minions_data = load_minions_data()
    
    # 创建strId到minion数据的映射
    strid_to_minion = {minion['strId']: minion for minion in minions_data}
    
    # 遍历TypeScript文件目录
    updated_files = 0
    for root, dirs, files in os.walk(MINION_TS_DIR):
        for file in files:
            if file.endswith('.ts'):
                ts_file_path = os.path.join(root, file)
                
                # 读取TypeScript文件内容
                with open(ts_file_path, 'r', encoding='utf-8') as f:
                    ts_content = f.read()
                
                # 提取strId
                current_strid = extract_strid_from_ts(ts_content)
                if not current_strid:
                    print(f"警告: 在文件 {ts_file_path} 中未找到strId")
                    continue
                
                # 查找匹配的minion数据
                if current_strid in strid_to_minion:
                    minion_data = strid_to_minion[current_strid]
                    
                    # 替换BASE_DATA
                    updated_content = replace_base_data(ts_content, minion_data)
                    
                    # 写入文件，即使内容看起来相同，确保换行符问题得到修复
                    with open(ts_file_path, 'w', encoding='utf-8') as f:
                        f.write(updated_content)
                    updated_files += 1
                    print(f"已更新文件: {ts_file_path}")
                else:
                    print(f"警告: 未找到匹配的strId: {current_strid} 在文件 {ts_file_path}")
    
    print(f"更新完成，共更新了 {updated_files} 个文件")

if __name__ == "__main__":
    main()