extends Panel
class_name Backpack

const BaseItemScope=preload("res://背包/entity/BaseItem.gd")

var _backpck:BaseItemScope.BackpackItem:set=set_backpck,get=get_backpck
# 跟踪当前选中的背包格子
var _selected_compartment:BackpackCompartment = null:get=get_selected_compartment

func _init() -> void:
	_backpck=BaseItemScope.BackpackItem.new()

func _ready() -> void:
	# 为现有格子绑定点击信号
	_bind_compartment_signals()

# 获取所有格子ui
#return Array[BackpackCompartment]
func get_all_items_ui()->Array[BackpackCompartment]:
	var result:Array[BackpackCompartment]=[]
	for child in %GridContainer.get_children():
		if child is BackpackCompartment:
			result.append(child)
	return result

# 为所有格子绑定点击信号
func _bind_compartment_signals() -> void:
	for compartment in get_all_items_ui():
		# 先断开已存在的连接，避免重复连接错误
		if compartment.clicked.is_connected(_on_compartment_clicked):
			compartment.clicked.disconnect(_on_compartment_clicked)
		# 连接信号
		compartment.clicked.connect(_on_compartment_clicked)

#region get/set 方法
func get_selected_compartment()->BackpackCompartment:
	return _selected_compartment

func set_backpck(new_value:BaseItemScope.BackpackItem)->void:
	_backpck=new_value
	# 信号绑定
	if _backpck:
		_backpck.添加物品.connect(_on_添加物品)
		_backpck.删除物品.connect(_on_删除物品)
		_backpck.重置物品.connect(_on_重置物品)
	if is_node_ready():
		_on_重置物品()

func get_backpck()->BaseItemScope.BackpackItem:
	return _backpck
#endregion

#region 信号处理方法
func _on_添加物品(new_value:BaseItemScope.BaseItem,index:int)->void:
	# %GridContainer 添加新子项
	var item = %GridContainer.get_child(index)
	if item:
		item.set_base_item(new_value)
	else:
		Log.error("添加物品失败，索引超出范围")

func _on_删除物品(_del_value:BaseItemScope.BaseItem,index:int)->void:
	var item = %GridContainer.get_child(index)
	if item:
		item.set_base_item(null)
	else:
		Log.error("删除物品失败，索引超出范围")

func _on_重置物品()->void:
	# 重置选中状态
	_selected_compartment = null
	# %GridContainer 清空所有子项
	for child in %GridContainer.get_children():
		child.queue_free()
	for i in _backpck.get_容器物品():
		var item = preload("uid://dehikb65o1cb2").instantiate() as BackpackCompartment
		item.set_base_item(i)
		%GridContainer.add_child(item)
	# 重新绑定信号
	_bind_compartment_signals()

#endregion

#region 渲染方法

#endregion

#region 信号处理方法 - 背包格子

# 处理背包格子点击信号
func _on_compartment_clicked(compartment:BackpackCompartment, item:BaseItemScope.BaseItem) -> void:
	# 如果点击的是当前选中的格子，不做任何操作
	if compartment == _selected_compartment:
		return
	
	# 还原上一个选中格子的样式
	if _selected_compartment:
		_selected_compartment.change_style("默认")
	
	# 设置新选中的格子样式
	_selected_compartment = compartment
	_selected_compartment.change_style("选中")
	
	# 这里可以添加额外的处理逻辑，比如显示物品详情等

#endregion
