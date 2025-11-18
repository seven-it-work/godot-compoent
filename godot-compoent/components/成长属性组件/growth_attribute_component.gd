@tool
extends LabelAndValue
class_name GrowthAttributeComponent

const BaseValue = preload("uid://2ye25vjxabed")

## 成长属性对象
var _growth_property:BaseValue.GrowthValue: get= get_growth_property, set = set_growth_property

func _notification(what: int) -> void:
	if what == NOTIFICATION_EDITOR_POST_SAVE or what == NOTIFICATION_EDITOR_PRE_SAVE:
		渲染()

#region get/set 方法
## 获取成长属性对象
func get_growth_property()->BaseValue.GrowthValue:
	return _growth_property
## 设置成长属性对象
func set_growth_property(new_value:BaseValue.GrowthValue):
	_growth_property=new_value
	if _growth_property:
		_growth_property.property_changed.connect(func (_k,_v):
			渲染()
		)
	if is_node_ready():
		渲染()
#endregion

## 所有可显示的控件数组
var _display_controls:Array[Control]=[]

## 节点就绪时的初始化
func _ready() -> void:
	_display_controls=[$Value, $ProgressBar]
	super._ready()

## 渲染成长属性的显示内容
func 渲染() -> void:
	super.渲染()
	# 隐藏所有控件
	for control in _display_controls:
		control.hide()
	
	var growth=get_growth_property()
	if growth is BaseValue.RandomGrowth:
		if $Value:
			# 如果是随机值类型，显示范围文本
			$Value.show()
			$Value.text="%s~%s"%[growth.get_min_value(), growth.get_max_value()]
	elif growth is BaseValue.RangeGrowth:
		if $ProgressBar:
			# 如果是范围值类型，显示进度条
			$ProgressBar.show()
			$ProgressBar.min_value=growth.get_min_value()
			$ProgressBar.max_value=growth.get_max_value()
			$ProgressBar.value=growth.get_value()
