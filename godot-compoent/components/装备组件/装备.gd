extends Control

const 背包UI= preload("uid://bo5yq44dywrje")

@onready var 背包:背包UI=$"背包"


func _on_装备_pressed() -> void:
	if 背包.get_selected_compartment():
		pass
	pass # Replace with function body.
