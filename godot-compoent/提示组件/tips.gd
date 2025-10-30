extends Control
class_name TipsControl

## 私有槽位变量
var _slot:Control = null
var _tips:Control = null

## 进入tips中是否保留
@export var is_save:bool=true
## 显示组件
@export var slot:Control:
	set(new_slot):
		_slot=new_slot
		call_deferred("_添加Slot", new_slot)
	get():
		return _slot
## Tips
@export var tips:Control:
	set(new_value):
		_tips=new_value
		call_deferred("_添加tips", new_value)
	get():
		return _tips

func _添加tips(new_value:Control):
	if _tips:
		_隐藏tip()
	_tips=new_value
	var node=Node.new()
	add_child(node)
	if _tips.get_parent():
		_tips.reparent(node)
	else:
		node.add_child(_tips)
	_隐藏tip()

func _添加Slot(new_slot:Control):
	assert(new_slot != null, "new_slot 不能为null")
	if _slot:
		_slot.hide()
	_slot=new_slot
	_slot.show()
	if _slot.get_parent():
		_slot.reparent(self)
	else:
		add_child(_slot)

func _隐藏tip():
	if _tips:
		_tips.hide()

# 上次交互位置，用于存储鼠标或触摸位置
var _last_interaction_position: Vector2 = Vector2.ZERO
func _展示tip():
	if _tips:
		_tips.show()
		# 如果没有触摸位置且上次位置为零，则使用鼠标位置
		if _last_interaction_position.is_zero_approx():
			_last_interaction_position = get_global_mouse_position()
		
		# 获取屏幕尺寸
		var screen_size = DisplayServer.window_get_size()
		# 获取tips的尺寸
		var tips_size = _tips.size
		
		# 检测宽度是否超出屏幕
		if _last_interaction_position.x + tips_size.x > screen_size.x:
			_tips.global_position.x = _last_interaction_position.x - tips_size.x
		
		# 检测高度是否超出屏幕
		if _last_interaction_position.y + tips_size.y > screen_size.y:
			_tips.global_position.y = _last_interaction_position.y - tips_size.y

func _判断是否进入容器(point:Vector2):
	if _slot.get_global_rect().has_point(point):
		_last_interaction_position = point
		return true
	if is_save:
		if _tips.visible and  _tips.get_global_rect().has_point(point):
			return true
	return false

func _process(delta: float) -> void:
	if _slot and _tips:
		var is_interacting = _判断是否进入容器(get_global_mouse_position())
		# 根据交互状态处理提示显示
		if is_interacting:
			# 如果提示未显示，则显示它
			if not _tips.visible:
				_展示tip()
		else:
			# 如果没有交互，则隐藏提示
			if _tips.visible:
				_隐藏tip()
