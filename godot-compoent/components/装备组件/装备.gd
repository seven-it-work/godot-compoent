extends Control

const 背包UI= preload("uid://bo5yq44dywrje")

@onready var 背包:背包UI=$"背包"


func _on_装备_pressed() -> void:
	if 背包.get_selected_compartment():
		pass
	pass # Replace with function body.


func _on_margin_container_选择装备栏信号(装备类型: String) -> void:
	# todo 每当切换类型时，需要调整 $"HBoxContainer/筛选" 筛选的值
	pass # Replace with function body.


func _on_筛选_item_selected(index: int) -> void:
	# todo 当筛选时，需要调整 $"背包" 中展示的物品信息，比如筛选的武器，就只展示武器
	pass # Replace with function body.
