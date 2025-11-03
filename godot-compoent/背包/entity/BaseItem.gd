class_name BaseItemScope


class BackpackItem:
	signal 重置物品
	signal 添加物品(new_value:BaseItem,index:int)
	signal 删除物品(new_value:BaseItem,index:int)
	var _背包大小:int=8:set=set_背包大小,get=get_背包大小
	## null表示站位
	var _容器物品:Array[BaseItem]=[]:set=set_容器物品,get=get_容器物品
	
	func _init() -> void:
		clear()
		
	#region get/set 方法
	func set_背包大小(new_value:int)->void:
		if new_value<0:
			Log.warn("背包大小必须大于0")
			return
		_背包大小=new_value
		if _容器物品.size()>_背包大小:
			_容器物品.resize(_背包大小)
			重置物品.emit()
		else:
			for i in range(_容器物品.size(),_背包大小):
				_容器物品.append(null)
			重置物品.emit()

	func get_背包大小()->int:
		return _背包大小
	func set_容器物品(new_value:Array[BaseItem])->void:
		_容器物品=new_value
		重置物品.emit()

	func get_容器物品()->Array[BaseItem]:
		return _容器物品
	#endregion
	#region 物品操作方法
	func clear():
		_容器物品.clear()
		for i in _背包大小:
			_容器物品.append(null)
		重置物品.emit()
		
	func addItem(new_value:BaseItem)->void:
		for i in _容器物品.size():
			if _容器物品[i]==null:
				_容器物品[i]=new_value
				添加物品.emit(new_value,i)
				return
		Log.debug("背包已满")

	func delItemByIndex(index:int)->bool:
		if index<0 or index>=_容器物品.size():
			return false
		var item=_容器物品[index]
		_容器物品[index]=null
		删除物品.emit(item,index)
		return true

	func delItemByValue(item:BaseItem)->bool:
		var index=_容器物品.find(item)
		return delItemByIndex(index)
	#endregion
	

@abstract class BaseItem:
	var _name_str:String="":set=set_name_str,get=get_name_str
	
	#region get/set 方法
	func set_name_str(name:String)->void:
		_name_str=name
	func get_name_str()->String:
		return _name_str
	#endregion

class DefaultItem extends  BaseItem:
	pass
