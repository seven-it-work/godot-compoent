#@tool
## 背包格子
extends Panel

const BaseItemScope = preload("uid://4cukvnp1qadn")
const LabelAndValue = preload("res://components/成长属性组件/label_and_value.gd")
const BaseValue = preload("uid://2ye25vjxabed")
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
			if _base_item is BaseItemScope.WeaponItem:
				if %Tips:
					# 隐藏所有子节点
					for i in %Tips.get_children():
						i.hide()
					# 显示WeaponItem容器
					%WeaponItem.show()
					# 清除WeaponItem中的现有子节点
					for child in %WeaponItem.get_children():
						child.queue_free()
					# 创建武器名称标签
					var weapon_name = Label.new()
					weapon_name.text = _base_item._name_str
					%WeaponItem.add_child(weapon_name)
					# 添加稀有度信息
					var rarity_label = LabelAndValue.new()
					rarity_label.label = "稀有度:"
					rarity_label.value = _base_item.get_rarity_name()
					%WeaponItem.add_child(rarity_label)
					# 添加等级信息
					var level_label = LabelAndValue.new()
					level_label.label = "等级:"
					level_label.value = str(_base_item.current_level) + "/" + str(_base_item.max_level)
					%WeaponItem.add_child(level_label)
					# 添加分隔线
					var separator = HSeparator.new()
					separator.custom_minimum_size.x = 200
					%WeaponItem.add_child(separator)
					# 显示武器属性
					var stats = _base_item.get_valid_stats()
					for stat in stats:
						var stat_label = LabelAndValue.new()
						var stat_name = stat["name_str"]
						var stat_value = stat["value"]
						var stat_type = stat["type"]
						
						# 根据属性类型设置显示文本
						if stat_type.begins_with("percent_"):
							# 百分比属性
							stat_label.label = stat_name + "(%):"
							if stat_value is BaseValue.RandomGrowth:
								stat_label.value = str(int(stat_value.get_value() * 100)) + "%"
							elif stat_value is BaseValue.GrowthValue:
								stat_label.value = str(int(stat_value.get_value() * 100)) + "%"
						else:
							# 具体数值属性
							stat_label.label = stat_name + ":"
							if stat_value is BaseValue.RandomGrowth:
								stat_label.value = str(int(stat_value.get_value()))
							elif stat_value is BaseValue.GrowthValue:
								stat_label.value = str(int(stat_value.get_value()))
						
						%WeaponItem.add_child(stat_label)
			else:
				if %Tips:
					for i in %Tips.get_children():
						i.hide()
					%Tips.get_child(0).show()
					%Tips.get_child(0).text = _base_item._name_str + "\n" + _base_item._desc_str
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
