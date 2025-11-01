@tool
extends ProgressBar
class_name ProggressTextBar

var _label:Label
func _ready() -> void:
	_label=Label.new()
	_label.text="%s/%s"%[min_value,max_value]
	_label.global_position=self.global_position
	_label.size=self.size
	add_child(_label)
	pass
