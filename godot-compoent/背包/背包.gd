extends Panel
class_name Backpack

var _backpck:BaseItemScope.BackpackItem:set=set_backpck,get=get_backpck

func _ready() -> void:
	pass

#region get/set 方法
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
	# %GridContainer 清空所有子项
	for child in %GridContainer.get_children():
		child.queue_free()
	for i in _backpck.get_容器物品():
		var item = preload("uid://dehikb65o1cb2").instantiate() as BackpackCompartment
		item.set_base_item(i)
		%GridContainer.add_child(item)

#endregion

#region 渲染方法

#endregion
