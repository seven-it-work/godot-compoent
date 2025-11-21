@tool
## 背包格子
extends Panel
const ItemScopeUI=preload("uid://da1t82uebiqkk")
const BaseItemScope = preload("res://entity/BaseItem.gd")
const BaseValue = preload("res://components/成长属性组件/基础成长.gd")
# 点击信号
signal clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem)

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
		# todo 对护盾进行渲染
		if _base_item:
			$Label.text=_base_item._name_str
			if _base_item is BaseItemScope.WeaponItem:
				if %Tips:
					# 隐藏所有子节点
					for i in %Tips.get_children():
						i.hide()
					# 显示WeaponItem容器
					%WeaponItem.show()
					# 设置武器名称
					%WeaponItem.get_node("名称").set_value(_base_item.get_name_str())
					# 设置武器稀有度
					%WeaponItem.get_node("稀有度").set_value(BaseItemScope.rarity_names.get(_base_item._rarity))
					# 设置武器等级
					%WeaponItem.get_node("等级").set_value(str(_base_item.current_level))
					# 设置武器攻击属性
					if _base_item.flat_attack:
						%WeaponItem.get_node("flat_attack").show()
						%WeaponItem.get_node("flat_attack").set_value("%.1f~%.1f" % [_base_item.flat_attack.get_min_value(), _base_item.flat_attack.get_max_value()])
					else:
						%WeaponItem.get_node("flat_attack").hide()
					if _base_item.percent_attack:
						%WeaponItem.get_node("percent_attack").show()
						%WeaponItem.get_node("percent_attack").set_value("%.1f%%~%.1f%%" % [_base_item.percent_attack.get_min_value()*100, _base_item.percent_attack.get_max_value()*100])
					else:
						%WeaponItem.get_node("percent_attack").hide()
					# 设置武器防御属性
					if _base_item.flat_defense:
						%WeaponItem.get_node("flat_defense").show()
						%WeaponItem.get_node("flat_defense").set_value("%.1f~%.1f" % [_base_item.flat_defense.get_min_value(), _base_item.flat_defense.get_max_value()])
					else:
						%WeaponItem.get_node("flat_defense").hide()
					if _base_item.percent_defense:
						%WeaponItem.get_node("percent_defense").show()
						%WeaponItem.get_node("percent_defense").set_value("%.1f%%~%.1f%%" % [_base_item.percent_defense.get_min_value()*100, _base_item.percent_defense.get_max_value()*100])
					else:
						%WeaponItem.get_node("percent_defense").hide()
					# 设置武器敏捷属性
					if _base_item.flat_agility:
						%WeaponItem.get_node("flat_agility").show()
						%WeaponItem.get_node("flat_agility").set_value("%.1f~%.1f" % [_base_item.flat_agility.get_min_value(), _base_item.flat_agility.get_max_value()])
					else:
						%WeaponItem.get_node("flat_agility").hide()
					if _base_item.percent_agility:
						%WeaponItem.get_node("percent_agility").show()
						%WeaponItem.get_node("percent_agility").set_value("%.1f%%~%.1f%%" % [_base_item.percent_agility.get_min_value()*100, _base_item.percent_agility.get_max_value()*100])
					else:
						%WeaponItem.get_node("percent_agility").hide()
					# 设置武器生命值属性
					if _base_item.flat_health:
						%WeaponItem.get_node("flat_health").show()
						%WeaponItem.get_node("flat_health").set_value("%.1f"%_base_item.flat_health.get_value())
					else:
						%WeaponItem.get_node("flat_health").hide()
					if _base_item.percent_health:
						%WeaponItem.get_node("percent_health").show()
						%WeaponItem.get_node("percent_health").set_value("%.1f%%" % [_base_item.percent_health.get_value()*100])
					else:
						%WeaponItem.get_node("percent_health").hide()
			else:
				if %Tips:
					for i in %Tips.get_children():
						i.hide()
					%Tips.get_child(0).show()
					%Tips.get_child(0).text = _base_item._name_str + "\n" + _base_item._desc_str
		else:
			$Label.text=default_label_str
		# 延迟更新Tips大小以确保容器已调整
		_update_tips_size()
		

func _process(_delta: float) -> void:
	_process_tips_close()
	pass

func _update_tips_size():
	for i in %Tips.get_children():
		if i.visible:
			%Tips.size = i.get_minimum_size()

func _process_tips_close():
	if %Tips and %Tips.visible:
		_on_mouse_exited()
func _on_mouse_entered() -> void:
	if _base_item:
		%Tips.show()
		# 更新Tips尺寸确保准确计算
		_update_tips_size()
		var mouse_pos = get_global_mouse_position()
		var tips_size = %Tips.size
		var viewport_end = get_viewport().get_visible_rect().size
		
		var target_pos: Vector2
		
		# 智能定位逻辑：优先右侧展示，右侧空间不足则左侧展示
		var has_space_right = mouse_pos.x + tips_size.x <= viewport_end.x
		if has_space_right:
			# 右侧展示，优先下方，下方不足则上方
			if mouse_pos.y + tips_size.y <= viewport_end.y:
				# 右侧下方
				target_pos = Vector2(mouse_pos.x , mouse_pos.y )
			else:
				# 右侧上方
				target_pos = Vector2(mouse_pos.x, mouse_pos.y - tips_size.y )
		else:
			# 左侧展示，优先下方，下方不足则上方
			if mouse_pos.y  + tips_size.y <= viewport_end.y:
				# 左侧下方
				target_pos = Vector2(mouse_pos.x - tips_size.x , mouse_pos.y )
			else:
				# 左侧上方
				target_pos = Vector2(mouse_pos.x - tips_size.x , mouse_pos.y - tips_size.y )
		
		# 确保Tooltip始终在视口内
		target_pos.x = clamp(target_pos.x, 0, viewport_end.x - tips_size.x)
		target_pos.y = clamp(target_pos.y, 0, viewport_end.y - tips_size.y)
		
		%Tips.global_position = target_pos


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
			clicked.emit(self, _base_item)

func _notification(what: int) -> void:
	if what == NOTIFICATION_EDITOR_POST_SAVE or what == NOTIFICATION_EDITOR_PRE_SAVE:
		_渲染_base_item()
