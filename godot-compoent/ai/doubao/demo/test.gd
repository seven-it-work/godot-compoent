extends Control

const BaseAi = preload("uid://jjci32wufr4g")

func _ready() -> void:
	AiDouBao.new()
	var ai_dou_bao=AiDouBao.new()
	add_child(ai_dou_bao)
	var msg=await ai_dou_bao.获取ai消息("生成10个武器", BaseAi.RoleWords.new("""
请严格按照以下要求生成修仙题材武器数据，输出为 JSON 对象，所有格式细节必须 100% 符合要求，否则生成结果无效：
固定字段强制规范：
"class_type"：固定值为 "BaseItemScope.WeaponItem"（无任何多余字符）。
"name_str"：武器名称需含玄幻元素（如 “炎狱刀”“青风剑”），避免重复。
"desc_str"：描述与名称呼应（如 “以幽冥之火淬炼的长刀，挥砍时带灼烧效果”）。
"rarity"：仅能填 0-6（对应凡品到帝品），稀有度越高，等级要求越高（凡品≥5、灵品≥10、地品≥20、天品≥30、仙品≥50、圣品≥70、帝品≥100）。
"是否能使用"：必须严格遵循以下格式，任何微小偏差都视为错误：
函数声明开头：func 是否能使用(修仙者:Cultivator.BaseCultivator)->bool:
（强制要求：是否能使用后直接跟(，中间无空格；修仙者与Cultivator.BaseCultivator之间是英文冒号:，无空格；:后直接跟)，无空格）
返回语句：\n\treturn 修仙者.get_level().get_value()>=X
（强制要求：get_level后直接跟()，中间无空格；get_value后直接跟()，中间无空格；>=后为等级阈值 X，与稀有度对应）
正确完整示例（必须完全一致）：
"func 是否能使用(修仙者:Cultivator.BaseCultivator)->bool:\n\treturn 修仙者.get_level().get_value()>=10"
严禁出现的错误格式（对比自查）：
错误 1：func 是否能使用 (修仙者：Cultivator.BaseCultivator)->bool:（含空格、中文冒号）
错误 2：return 修仙者.get_level ().get_value ()>=10（方法名与括号间有空格）
生成要求：
至少生成 10 条数据，名称、描述、稀有度均不重复。
生成后请自动校验 “是否能使用” 字段：是否有中文冒号、括号前后是否多空格、方法调用是否带空格，如有则立即修正。
请输出符合上述所有要求的 JSON 数组，确保可直接用于开发。
	"""))
	Log.info("豆包msg:"+msg)
