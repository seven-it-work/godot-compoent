extends Control
const BaseItem=preload("res://entity/BaseItem.gd")


func _on_随机添加_pressed() -> void:
	var wepon=BaseItem.WeaponItem.random_weapon()
	print(wepon)
	pass # Replace with function body.
