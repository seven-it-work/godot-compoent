import json
import os
import re

# 读取并解析JSON文件
def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# 字符串转驼峰命名
def to_camel_case(name):
    # 移除特殊字符，只保留字母、数字和空格
    name = re.sub(r'[^a-zA-Z0-9 ]', '', name)
    # 分割成单词，首字母大写，其余小写，然后拼接
    words = name.split()
    return words[0].capitalize() + ''.join(word.capitalize() for word in words[1:])

# 生成TypeScript文件内容
def generate_ts_content(card_data, is_token=False):
    class_name = to_camel_case(card_data['name'])
    
    # 确定inTavern的值
    in_tavern = not is_token
    
    # 生成BASE_DATA
    base_data = json.dumps(card_data, ensure_ascii=False, indent=2)
    
    # 生成TS文件内容
    in_tavern_lower = str(in_tavern).lower()
    ts_content = '''import {{ Minion, minion_utils }} from '@/server/controller/entity/Minion';

/**
 * {0}类 - 继承自Minion，实现{0}随从
 */
export class {0} extends Minion {{
  inTavern: boolean = {1};

  constructor() {{
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }}
}}

const BASE_DATA = {2};'''.format(
        class_name,
        in_tavern_lower,
        base_data
    )
    
    return ts_content

# 生成法术TypeScript文件内容
def generate_spell_ts_content(card_data):
    class_name = to_camel_case(card_data['name'])
    
    # 生成BASE_DATA
    base_data = json.dumps(card_data, ensure_ascii=False, indent=2)
    
    # 生成TS文件内容
    ts_content = '''import {{ Spell, spell_utils }} from '@/server/controller/entity/Spell';

/**
 * {0}类 - 继承自Spell，实现{0}法术
 */
export class {0} extends Spell {{
  constructor() {{
    super();
    spell_utils.initSpellData(this, BASE_DATA);
  }}
}}

const BASE_DATA = {1};'''.format(
        class_name,
        base_data
    )
    
    return ts_content

# 确保文件夹存在
def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

# 主函数
def main():
    # 文件路径
    json_file_path = 'd:\\my_project\\godot-compoent\\ls\\src\\data\\minions_tier2.json'
    output_base_dir = 'd:\\my_project\\godot-compoent\\ls\\src\\server\\all_cards\\minions'
    spell_output_dir = 'd:\\my_project\\godot-compoent\\ls\\src\\server\\all_cards\\spell'
    
    # 读取JSON数据
    cards_data = read_json_file(json_file_path)
    
    # 遍历每个卡牌
    for card in cards_data:
        # 确定文件夹名称（使用minionTypes的第一个元素）
        minion_type = card['minionTypes'][0] if card['minionTypes'] else 'none'
        output_dir = os.path.join(output_base_dir, minion_type)
        ensure_dir(output_dir)
        
        # 生成主卡牌的TS文件
        class_name = to_camel_case(card['name'])
        ts_file_path = os.path.join(output_dir, f"{class_name}.ts")
        ts_content = generate_ts_content(card, is_token=False)
        
        with open(ts_file_path, 'w', encoding='utf-8') as f:
            f.write(ts_content)
        
        print(f"生成主卡牌文件: {ts_file_path}")
        
        # 处理tokens
        if 'tokens' in card:
            for token in card['tokens']:
                if token['cardType'] == 'minion':
                    # 生成token随从的TS文件
                    token_minion_type = token['minionTypes'][0] if token['minionTypes'] else 'none'
                    token_output_dir = os.path.join(output_base_dir, token_minion_type)
                    ensure_dir(token_output_dir)
                    
                    token_class_name = to_camel_case(token['name'])
                    token_ts_file_path = os.path.join(token_output_dir, f"{token_class_name}.ts")
                    token_ts_content = generate_ts_content(token, is_token=True)
                    
                    with open(token_ts_file_path, 'w', encoding='utf-8') as f:
                        f.write(token_ts_content)
                    
                    print(f"生成Token随从文件: {token_ts_file_path}")
                elif token['cardType'] == 'spell':
                    # 生成法术token的TS文件
                    ensure_dir(spell_output_dir)
                    
                    spell_class_name = to_camel_case(token['name'])
                    spell_ts_file_path = os.path.join(spell_output_dir, f"{spell_class_name}.ts")
                    spell_ts_content = generate_spell_ts_content(token)
                    
                    with open(spell_ts_file_path, 'w', encoding='utf-8') as f:
                        f.write(spell_ts_content)
                    
                    print(f"生成法术Token文件: {spell_ts_file_path}")

if __name__ == "__main__":
    main()
