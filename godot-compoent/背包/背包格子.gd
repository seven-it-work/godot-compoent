## 背包格子
extends Panel
class_name BackpackCompartment

var _base_item:BaseItemScope.BaseItem:set=set_base_item,get=get_base_item

#region get/set 方法
func set_base_item(base_item:BaseItemScope.BaseItem)->void:
	_base_item=base_item
	_渲染_base_item()
func get_base_item()->BaseItemScope.BaseItem:
	return _base_item
#endregion

func _ready() -> void:
	_渲染_base_item()

func _渲染_base_item()->void:
	if is_node_ready():
		if _base_item:
			$Label.text=_base_item._name_str
		else:
			$Label.text=""

func _process(delta: float) -> void:
	_process_tips_close()
	pass

func _process_tips_close():
	if %Tips and %Tips.visible:
		_on_mouse_exited()
func _on_mouse_entered() -> void:
	%Tips.show()
	%Tips.global_position=get_global_mouse_position()
	pass # Replace with function body.


func _on_mouse_exited() -> void:
	if get_global_rect().has_point(get_global_mouse_position()) or \
		(%Tips.visible and %Tips.get_global_rect().has_point(get_global_mouse_position())):
		pass
	else:
		%Tips.hide()
	pass # Replace with function body.
