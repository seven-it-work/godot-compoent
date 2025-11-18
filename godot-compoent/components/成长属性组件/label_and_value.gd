@tool
extends HBoxContainer
class_name LabelAndValue

@export var label:String="":get=get_label,set=set_label
@export var value:String="":get=get_value,set=set_value

func _ready() -> void:
	渲染()

#region get/set 方法
func get_label() -> String:
	return label
func set_label(new_v:String) -> void:
	label=new_v
	渲染()
func get_value() -> String:
	return value
func set_value(new_v:String) -> void:
	value=new_v
	渲染()
#endregion

func 渲染() -> void:
	if not is_node_ready():
		return
	if $Label:
		$Label.text=label
	if $Value:
		$Value.text=value
