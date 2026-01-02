import json

# 预定义英文到中文的mechanics映射
MECHANICS_MAP = {
    "BATTLECRY": "战吼",
    "DEATHRATTLE": "亡语",
    "TAUNT": "嘲讽",
    "DIVINE_SHIELD": "圣盾",
    "MAGNETIC": "磁力",
    "TRIGGER_VISUAL": "触发视觉效果",
    "REBORN": "复生",
    "DIVINE_SHIELD": "圣盾",
    "LIFESTEAL": "吸血",
    "WINDFURY": "风怒",
    "POISONOUS": "剧毒",
    "RUSH": "突袭",
    "STEALTH": "潜行",
    "COMBO": "连击",
    "OVERLOAD": "过载",
    "SPLIT": "分裂",
    "ADAPT": "进化",
    "DISCOVER": "发现",
    "FRENZY": "暴怒",
    "QUILBOAR": "野猪人",
    "BEAST": "野兽",
    "MECH": "机械",
    "MURLOC": "鱼人",
    "DEMON": "恶魔",
    "DRAGON": "龙",
    "PIRATE": "海盗",
    "UNDEAD": "亡灵",
    "NAGA": "纳迦",
    "ELEMENTAL": "元素",
    "ALL": "全部",
    "NONE": "无",
    "AURA": "光环",
    "AVENGE": "复仇",
    "CHOOSE_ONE": "抉择",
    "InvisibleDeathrattle": "隐形亡语",
    "VENOMOUS": "剧毒"
}

def extract_mechanics():
    # 读取JSON文件
    file_path = "e:/dev_soft/Godot_v4.3-stable_win64.exe/godot-compoent/ls/src/data/get_full_cards.json"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 提取所有mechanics
    mechanics_set = set()
    
    # 遍历minion数组
    for minion in data.get("data", {}).get("minion", []):
        # 提取主卡的mechanics
        if "mechanics" in minion:
            mechanics_set.update(minion["mechanics"])
        
        # 提取upgradeCard的mechanics
        if "upgradeCard" in minion:
            upgrade_card = minion["upgradeCard"]
            if "mechanics" in upgrade_card:
                mechanics_set.update(upgrade_card["mechanics"])
        
        # 提取tokens的mechanics
        if "tokens" in minion:
            for token in minion["tokens"]:
                if "mechanics" in token:
                    mechanics_set.update(token["mechanics"])
                
                # 提取token的upgradeCard的mechanics
                if "upgradeCard" in token:
                    token_upgrade = token["upgradeCard"]
                    if "mechanics" in token_upgrade:
                        mechanics_set.update(token_upgrade["mechanics"])
    
    # 转换为列表并排序
    english_mechanics = sorted(list(mechanics_set))
    
    # 生成中文mechanics
    chinese_mechanics = [MECHANICS_MAP.get(m, m) for m in english_mechanics]
    
    # 打印结果
    print("英文mechanics数组:")
    print(english_mechanics)
    print(f"\n英文mechanics数量: {len(english_mechanics)}")
    
    print("\n中文mechanics数组:")
    print(chinese_mechanics)
    print(f"\n中文mechanics数量: {len(chinese_mechanics)}")

if __name__ == "__main__":
    extract_mechanics()
