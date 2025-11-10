extends Control

const BaseItemScope = preload("res://背包/entity/BaseItem.gd")


func _ready() -> void:
	$背包.set_backpck(BaseItemScope.BackpackItem.new())
	pass

func _random_str()->String:
	return "物品"+str(randi_range(1,200))

func _on_添加物品_pressed() -> void:
	var item =BaseItemScope.DefaultItem.new()
	item.set_name_str(_random_str())
	$背包._backpck.addItem(item)
	pass # Replace with function body.


func _on_删除物品_pressed() -> void:
	$背包._backpck.delItemByIndex(0)
	pass # Replace with function body.


func _on_重置物品_pressed() -> void:
	($背包._backpck as BaseItemScope.BackpackItem).clear()
	pass # Replace with function body.


func _on_背包大小_add_1_pressed() -> void:
	$背包._backpck.set_背包大小($背包._backpck.get_背包大小()+1)
	pass # Replace with function body.


func _on_背包大小_remove_1_pressed() -> void:
	$背包._backpck.set_背包大小($背包._backpck.get_背包大小()-1)
	pass # Replace with function body.
