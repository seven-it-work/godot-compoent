extends Control

const BaseItemScope = preload("uid://4cukvnp1qadn")

func _ready() -> void:
	# 初始化时生成一把随机武器
	generate_random_weapon()
	pass

func generate_random_weapon() -> void:
	# 生成随机武器并设置到背包格子中
	var weapon = BaseItemScope.WeaponItem.random_weapon()
	if weapon:
		%背包格子.set_base_item(weapon)
	else:
		print("无法生成随机武器")

func _on_button_pressed() -> void:
	# 点击按钮时生成新武器
	generate_random_weapon()
	pass
