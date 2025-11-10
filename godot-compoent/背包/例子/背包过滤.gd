extends Control

const BackpackCompartment = preload("res://背包/背包格子.gd")

func _on_text_edit_text_changed(new_text:String) -> void:
	if new_text=="":
		for i:BackpackCompartment in $"背包".get_all_items_ui():
			i.show()
	else:
		for i:BackpackCompartment in $"背包".get_all_items_ui():
			if i.get_base_item() and i.get_base_item().get_name_str().find(new_text):
				pass
			else:
				i.hide()
	pass # Replace with function body.
