extends Control
const BaseItem=preload("res://entity/BaseItem.gd")
const 装备UI=preload("uid://bogy42c77a0gw")
const 背包UI= preload("uid://bo5yq44dywrje")


func _on_随机添加_pressed() -> void:
	var item
	# 随机选择添加武器或护盾
	if randi() % 2 == 0:
		# 添加武器
		item = BaseItem.WeaponItem.random_weapon()
		print("添加了武器")
	else:
		# 添加护盾
		item = BaseItem.ShieldItem.random_shield()
	
	# 获取背包并添加物品
	var backpck = ($"装备".背包 as 背包UI).get_backpck()
	backpck.addItem(item)
