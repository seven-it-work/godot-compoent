extends Node

const Cultivator = preload("res://战斗/entity/修仙者.gd")

# 导入BaseItemScope类
const BaseItemScope = preload("res://背包/entity/BaseItem.gd")

func _ready():
	# 从文件读取JSON数据
	var file = FileAccess.open("res://demo/weapon_with_dynamic_method.json", FileAccess.READ)
	if file == null:
		print("无法打开JSON文件")
		return
	
	var json_str = file.get_as_text()
	file.close()
	
	# 解析JSON数据
	var json_data = JSON.parse_string(json_str)
	if json_data == null:
		print("JSON解析失败")
		return
	
	# 创建WeaponItem对象
	var weapon = create_weapon_item(json_data)
	if weapon == null:
		print("武器创建失败")
		return
	
	print("武器创建成功: ", weapon.get_name_str())
	print("攻击力: ", weapon.get_attack().get_value())
	print("敏捷值: ", weapon.get_agility().get_value())
	print("动态方法已应用到武器对象")
	var c=Cultivator.BaseCultivator.new()
	print("是否能使用",weapon.是否能使用(c))
	for i in 100:
		c.grow(true)
	print("是否能使用",weapon.是否能使用(c))

func create_weapon_item(json_data: Dictionary) -> BaseItemScope.WeaponItem:
	# 检查是否有class_type
	if json_data.get("class_type", "") != "BaseItemScope.WeaponItem":
		print("无效的物品类型")
		return null
	
	# 创建一个继承自WeaponItem的动态脚本
	var weapon_script = GDScript.new()
	
	# 构建脚本源代码
	var can_use_func = json_data.get_or_add("是否能使用", "")
	var script_code = "extends BaseItemScope.WeaponItem\n" + can_use_func
	
	weapon_script.source_code = script_code
	
	# 编译脚本
	var reload_error = weapon_script.reload()
	if reload_error != OK:
		print("武器脚本编译失败: ", error_string(reload_error))
		return null
	
	# 创建武器实例
	var weapon = weapon_script.new()
	
	# 应用属性
	weapon._init(json_data)
	
	return weapon
