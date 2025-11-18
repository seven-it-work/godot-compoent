@tool
extends ProgressBar
class_name ProggressTextBar

var _label:Label

func _ready() -> void:
	_label=Label.new()
	_label.text="%s/%s"%[value,max_value]
	_label.size=self.size
	_label.vertical_alignment=VERTICAL_ALIGNMENT_CENTER
	_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	add_child(_label)
	pass
	
func _notification(what: int) -> void:
	if what == NOTIFICATION_EDITOR_POST_SAVE or what == NOTIFICATION_EDITOR_PRE_SAVE:
		_on_changed()

func _on_changed() -> void:
	if _label:
		_label.size=self.size
		_label.text="%s/%s"%[value,max_value]


func _on_value_changed(newValue: float) -> void:
	if _label:
		_label.size=self.size
		_label.text="%s/%s"%[newValue,max_value]
