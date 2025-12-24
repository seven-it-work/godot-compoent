import json
import os
import re

# 配置文件路径
MINIONS_JSON_PATH = r'e:\dev_soft\Godot_v4.3-stable_win64.exe\godot-compoent\ls\src\data\minions.json'
TS_FILES_DIR = r'e:\dev_soft\Godot_v4.3-stable_win64.exe\godot-compoent\ls\src\game\cards\minion'

def main():
    # 1. 读取minions.json文件
    with open(MINIONS_JSON_PATH, 'r', encoding='utf-8') as f:
        minions_data = json.load(f)
    
    # 2. 创建strId到minion数据的映射字典
    strid_to_minion = {minion['strId']: minion for minion in minions_data}
    print(f"成功加载了 {len(minions_data)} 个随从数据")
    
    # 3. 遍历TypeScript文件目录
    updated_files = 0
    for root, dirs, files in os.walk(TS_FILES_DIR):
        for file in files:
            if file.endswith('.ts'):
                ts_file_path = os.path.join(root, file)
                
                # 4. 读取TypeScript文件内容
                with open(ts_file_path, 'r', encoding='utf-8') as f:
                    ts_content = f.read()
                
                # 5. 提取当前BASE_DATA中的strId
                strid_match = re.search(r"strId:\s*['\"]([^'\"]+)['\"]", ts_content)
                if not strid_match:
                    continue
                
                current_strid = strid_match.group(1)
                
                # 6. 在映射字典中查找对应的minion数据
                if current_strid in strid_to_minion:
                    minion_data = strid_to_minion[current_strid]
                    
                    # 7. 替换BASE_DATA内容
                    # 使用正则表达式匹配整个BASE_DATA对象
                    updated_content = re.sub(
                        r"static BASE_DATA = [^;]+;",
                        f"static BASE_DATA = {json.dumps(minion_data, ensure_ascii=False, indent=2)};",
                        ts_content,
                        flags=re.DOTALL
                    )
                    
                    # 8. 保存更新后的TypeScript文件
                    if updated_content != ts_content:
                        with open(ts_file_path, 'w', encoding='utf-8') as f:
                            f.write(updated_content)
                        
                        updated_files += 1
                        print(f"已更新: {ts_file_path} (strId: {current_strid})")
                else:
                    print(f"未找到匹配的strId: {current_strid} (文件: {ts_file_path})")
    
    print(f"\n更新完成，共更新了 {updated_files} 个文件")

if __name__ == "__main__":
    main()