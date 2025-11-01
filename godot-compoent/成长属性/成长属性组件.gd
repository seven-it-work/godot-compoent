extends HBoxContainer
class_name GrowthAttributeComponent

## 显示的标签文本
@export var label:String: get=get_label, set=set_label
## 成长属性对象
var _growth_property:BaseValue.GrowthValue: get= get_growth_property, set = set_growth_property

#region get/set 方法
## 获取标签文本
func get_label()->String:
	return label
## 设置标签文本
func set_label(new_value:String):
	label=new_value
	if is_node_ready():
		$Label.text=label
## 获取成长属性对象
func get_growth_property()->BaseValue.GrowthValue:
	return _growth_property
## 设置成长属性对象
func set_growth_property(new_value:BaseValue.GrowthValue):
	_growth_property=new_value
	if _growth_property:
		_growth_property.property_changed.connect(func (_k,_v):
			render_growth_property()
		)
	if is_node_ready():
		render_growth_property()
#endregion

## 所有可显示的控件数组
var _display_controls:Array[Control]=[]

## 节点就绪时的初始化
func _ready() -> void:
	_display_controls=[$ValueStr, $ProgressBar]
	$Label.text=label

## 渲染成长属性的显示内容
func render_growth_property():
	# 隐藏所有控件
	for control in _display_controls:
		control.hide()
	
	var growth=get_growth_property()
	if growth is BaseValue.RandomGrowth:
		# 如果是随机值类型，显示范围文本
		$ValueStr.show()
		$ValueStr.text="%s~%s"%[growth.get_min_value(), growth.get_max_value()]
	elif growth is BaseValue.RangeGrowth:
		# 如果是范围值类型，显示进度条
		$ProgressBar.show()
		$ProgressBar.min_value=growth.get_min_value()
		$ProgressBar.max_value=growth.get_max_value()
		$ProgressBar.value=growth.get_value()
	pass
