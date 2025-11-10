@tool
extends ProggressTextBar

@export var min_font_size:int=8:set=set_min_font_size
@export var max_font_size:int=32:set=set_max_font_size

func set_min_font_size(new_value):
	min_font_size=new_value
	if _label:
		_label.min_font_size=new_value
		
func set_max_font_size(new_value):
	max_font_size=new_value
	if _label:
		_label.max_font_size=new_value

func _ready() -> void:
	_label=preload("uid://cs04jflun4vww").instantiate()
	_label.min_font_size=12
	_label.max_font_size=72
	_label.text="%s/%s"%[value,max_value]
	_label.size=self.size
	_label.vertical_alignment=VERTICAL_ALIGNMENT_CENTER
	_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	add_child(_label)

func _notification(what: int) -> void:
	super._notification(what)
	if what == NOTIFICATION_EDITOR_POST_SAVE or what == NOTIFICATION_EDITOR_PRE_SAVE:
		if _label:
			_label.min_font_size=8
			_label.max_font_size=32
			_label.padding_percentage=0.9
			print("编辑器保存通知")
			_label.adjust_font_size()
