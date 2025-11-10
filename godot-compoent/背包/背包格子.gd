@tool
## 背包格子
extends Panel

const BaseItemScope = preload("uid://4cukvnp1qadn")
# 点击信号
signal clicked(compartment, item)

@export var default_label_str:String="":set=set_default_label_str,get=get_default_label_str
var _base_item:BaseItemScope.BaseItem:set=set_base_item,get=get_base_item
var _current_style:String = "默认"

#region get/set 方法
func set_default_label_str(value:String)->void:
	default_label_str=value
	_渲染_base_item()
func get_default_label_str()->String:
	return default_label_str
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
			$Label.text=default_label_str

func _process(delta: float) -> void:
	_process_tips_close()
	pass

func _process_tips_close():
	if %Tips and %Tips.visible:
		_on_mouse_exited()
func _on_mouse_entered() -> void:
	if _base_item:
		%Tips.show()
		%Tips.global_position=get_global_mouse_position()


func _on_mouse_exited() -> void:
	if get_global_rect().has_point(get_global_mouse_position()) or \
		(%Tips.visible and %Tips.get_global_rect().has_point(get_global_mouse_position())):
		pass
	else:
		%Tips.hide()
	pass # Replace with function body.

# 改变样式方法
func change_style(style_type:String) -> void:
	# 验证样式类型
	if style_type != "默认" and style_type != "选中":
		Log.warn("警告: 无效的样式类型，使用默认样式")
		style_type = "默认"
	
	_current_style = style_type
	
	# 根据样式类型改变边框样式
	match style_type:
		"默认":
			var style=self.get_theme_stylebox("panel") as StyleBoxFlat
			style.border_color = Color(0.5, 0.5, 0.5, 1.0) # 灰色边框
			style.border_width_left = 1
			style.border_width_top = 1
			style.border_width_right = 1
			style.border_width_bottom = 1
			self.add_theme_stylebox_override("panel",style)
		"选中":
			var style=self.get_theme_stylebox("panel") as StyleBoxFlat
			style.border_color = Color(0, 0.7, 1.0, 1.0) # 蓝色高亮边框
			style.border_width_left = 2
			style.border_width_top = 2
			style.border_width_right = 2
			style.border_width_bottom = 2
			self.add_theme_stylebox_override("panel",style)

func _input(event: InputEvent) -> void:
	# 处理点击事件
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		if get_global_rect().has_point(event.global_position):
			# 发射点击信号，传递自身引用和基础物品
			self.emit_signal("clicked", self, _base_item)

func _notification(what: int) -> void:
	if what == NOTIFICATION_EDITOR_POST_SAVE or what == NOTIFICATION_EDITOR_PRE_SAVE:
		_渲染_base_item()
