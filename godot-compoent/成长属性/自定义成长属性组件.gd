@tool
extends GrowthAttributeComponent
class_name CustomGrowthAttributeComponent

## 自定义成长组件接口抽象类
@abstract class CustomGrowthComponent extends Control:
	## 渲染成长属性的抽象方法
	@abstract func render(growth:BaseValue.RandomGrowth)
	pass
	
## 自定义值控件
@export var custom_value_control:CustomGrowthComponent:get=get_custom_value_control,set=set_custom_value_control

#region get set方法
## 设置自定义值控件
func set_custom_value_control(new_value):
	custom_value_control=new_value
	render_growth_property()
	if is_node_ready():
		# 确保控件被正确添加到当前节点
		if custom_value_control.get_parent()!=self:
			if custom_value_control.get_parent():
				custom_value_control.reparent(self)
			else:
				add_child(custom_value_control)
				move_child(custom_value_control,-1)
				
## 获取自定义值控件
func get_custom_value_control():
	return custom_value_control
#endregion

## 重写渲染方法
func render_growth_property():
	var growth=get_growth_property()
	# 如果有自定义控件，则调用其渲染方法
	if custom_value_control and growth:
		custom_value_control.render(growth)
	pass
