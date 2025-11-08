extends PanelContainer

var _cultivator:Cultivator.BaseCultivator = null
# 在_process中 每次-1 直到为0 则认为冷却完成了。%"冷却"的宽度就是冷却进度。如果宽度为0 也是冷却完成了。
var _冷却时间:int = 1000:set=set_cool_down_time
var _最大冷却时间:int = 1000
signal 冷却完成

# 设置修仙者对象并绑定信号
func set_cultivator(cultivator:Cultivator.BaseCultivator) -> void:
	# 如果已有修仙者，先断开信号连接
	if _cultivator:
		_cultivator.属性变化信号.disconnect(_on_cultivator_property_changed)
	
	# 设置新的修仙者对象
	_cultivator = cultivator
	
	# 如果有修仙者，连接信号并更新UI
	if _cultivator:
		_cultivator.属性变化信号.connect(_on_cultivator_property_changed)
		update_ui()

# 更新UI显示
func update_ui() -> void:
	if not _cultivator:
		return
	
	# 初始化冷却时间为0
	_冷却时间 = 0
	update_cool_down_ui()
	
	# 更新名称
	var nameValue = $"VBoxContainer/名称/Value"
	if nameValue:
		nameValue.text = _cultivator.get_name()
	
	# 更新境界
	var levelValue = $"VBoxContainer/境界/Value"
	if levelValue:
		levelValue.text = "练气期" + str(_cultivator.get_level().get_value()) + "层"
	
	# 更新生命值
	var healthNode = $"VBoxContainer/生命值"
	if healthNode and healthNode.has_method("set_value"):
		var health = _cultivator.get_health()
		healthNode.set_value(health.get_value(), health.get_max())
	
	# 更新灵气值
	var manaNode = $"VBoxContainer/灵气值"
	if manaNode and manaNode.has_method("set_value"):
		var mana = _cultivator.get_mana()
		manaNode.set_value(mana.get_value(), mana.get_max())

# 设置冷却时间
func set_cool_down_time(seconds: int) -> void:
	_冷却时间 = seconds
	_最大冷却时间 = _冷却时间
	update_cool_down_ui()

# 更新冷却UI
func update_cool_down_ui() -> void:
	var 冷却面板 = $"%冷却"
	if 冷却面板:
		if _冷却时间 <= 0:
			冷却面板.size.x = 0
		else:
			var 进度 = float(_冷却时间) / float(_最大冷却时间)
			冷却面板.size.x = 210.0 * (1.0 - 进度)

# _ready方法，初始化
func _ready() -> void:
	# 初始化冷却UI
	update_cool_down_ui()

# _process方法，处理冷却倒计时
func _process(_delta: float) -> void:
	if _冷却时间 > 0:
		# 获取全局倍速，默认1
		var speed_multiplier = 全局配置.get_全局倍速() if 全局配置 else 1
		# 根据全局倍速减少冷却时间
		_冷却时间 -= speed_multiplier
		# 确保冷却时间不会小于0
		if _冷却时间 < 0:
			_冷却时间 = 0
			冷却完成.emit()
		update_cool_down_ui()

# 属性变化信号处理函数
func _on_cultivator_property_changed(property_name: String, old_value: Variant, new_value: Variant) -> void:
	# 根据属性名称更新对应的UI
	match property_name:
		"_name":
			var nameValue = $"VBoxContainer/名称/Value"
			if nameValue:
				nameValue.text = new_value
		"_health":
			var healthNode = $"VBoxContainer/生命值"
			if healthNode and healthNode.has_method("set_value"):
				healthNode.set_value(new_value.get_value(), new_value.get_max())
		"_mana":
			var manaNode = $"VBoxContainer/灵气值"
			if manaNode and manaNode.has_method("set_value"):
				manaNode.set_value(new_value.get_value(), new_value.get_max())
		"_level":
			var levelValue = $"VBoxContainer/境界/Value"
			if levelValue:
				levelValue.text = "练气期" + str(new_value.get_value()) + "层"
		_:
			# 对于其他属性变化，更新整个UI
			update_ui()
