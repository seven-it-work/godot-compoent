extends Control
const BaseItem=preload("res://entity/BaseItem.gd")
const 装备UI=preload("uid://bogy42c77a0gw")
const 背包UI= preload("uid://bo5yq44dywrje")


func _on_随机添加_pressed() -> void:
	var wepon=BaseItem.WeaponItem.random_weapon()
	var backpck=($"装备".背包 as 背包UI).get_backpck()
	backpck.addItem(wepon)
	pass # Replace with function body.
