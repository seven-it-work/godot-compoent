extends Control
const BaseItemScope = preload("res://背包/entity/BaseItem.gd")

const BackpackCompartment = preload("res://背包/背包格子.gd")
const Backpack = preload("res://背包/背包.gd")

func _ready() -> void:
	pass

func _on_装备_pressed() -> void:
	# 获取背包中选中的格子
	var selected_compartment = $"背包".get_selected_compartment()
	
	# 如果没有选中任何格子，则不执行任何操作
	if selected_compartment == null:
		print("请先在背包中选择一个物品")
		return
	
	# 获取装备槽中的背包格子
	var equipment_slot = $"MarginContainer/VBoxContainer/HBoxContainer/背包格子"
	
	# 检查equipment_slot是否是BackpackCompartment类型
	if equipment_slot is BackpackCompartment:
		# 保存两个格子中的物品数据
		var temp_item = equipment_slot.get_base_item()
		var selected_item = selected_compartment.get_base_item()
		
		# 交换物品数据
		equipment_slot.set_base_item(selected_item)
		selected_compartment.set_base_item(temp_item)
		
		print("物品交换成功")
	else:
		print("装备槽不是有效的背包格子类型")


func _on_随机生成装备_pressed() -> void:
	# 获取装备槽中的背包格子
	var b=$"背包" as Backpack
	# 检查equipment_slot是否是BackpackCompartment类型
	var random_item = BaseItemScope.DefaultItem.new()
	
	# 随机生成装备名称
	var equipment_names = ["铁剑", "皮甲", "钢盾", "法杖", "弓箭", "头盔", "护腿", "手套", "项链", "戒指"]
	var random_name = equipment_names[randi() % equipment_names.size()]
	random_item.set_name_str(random_name)
	
	print("随机生成装备: " + random_name)
	# 将随机装备设置到装备槽中
	b.get_backpck().addItem(random_item)
