const Cultivator = preload("res://战斗/entity/修仙者.gd")

## 背包对象
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
	func 替换物品(index:int,new_value:BaseItem)->void:
		if index<0 or index>=_容器物品.size():
			Log.warn("索引超出范围")
			return
		var old_item=_容器物品[index]
		_容器物品[index]=new_value
		添加物品.emit(new_value,index)
		删除物品.emit(old_item,index)

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
	
## 基础物品对象
@abstract class BaseItem:
	var _name_str:String="":set=set_name_str,get=get_name_str
	
	# 生命值
	var _health:BaseValue.GrowthValue:set=set_health,get=get_health
	# 防御力
	var _defense:BaseValue.RandomGrowth:set=set_defense,get=get_defense
	# 攻击力
	var _attack:BaseValue.RandomGrowth:set=set_attack,get=get_attack
	# 敏捷值
	var _agility:BaseValue.RandomGrowth:set=set_agility,get=get_agility
	#region 属性功能，一般有子类去实现
	## 是否能使用（一般是一写限制判断）
	func 是否能使用(修仙者:Cultivator.BaseCultivator)->bool:
		return 修仙者!=null
	#endregion
	#region get/set 方法
	func set_health(new_value:BaseValue.GrowthValue)->void:
		_health=new_value
	func get_health()->BaseValue.GrowthValue:
		return _health
	func set_defense(new_value:BaseValue.RandomGrowth)->void:
		_defense=new_value
	func get_defense()->BaseValue.RandomGrowth:
		return _defense
	func set_attack(new_value:BaseValue.RandomGrowth)->void:
		_attack=new_value
	func get_attack()->BaseValue.RandomGrowth:
		return _attack
	func set_agility(new_value:BaseValue.RandomGrowth)->void:
		_agility=new_value
	func get_agility()->BaseValue.RandomGrowth:
		return _agility

	func set_name_str(name:String)->void:
		_name_str=name
	func get_name_str()->String:
		return _name_str

	func _init(data:Dictionary={})->void:
		if "name_str" in data:
			_name_str=data["name_str"]
		if "health" in data:
			if data["health"] is BaseValue.GrowthValue:
				_health=data["health"]
			elif data["health"] is Dictionary:
				_health=BaseValue.GrowthValue.new(data["health"])
			else:
				Log.err("health必须是BaseValue.GrowthValue类型或Dictionary类型")
				return
		if "defense" in data:
			if data["defense"] is BaseValue.RandomGrowth:
				_defense=data["defense"]
			elif data["defense"] is Dictionary:
				_defense=BaseValue.RandomGrowth.new(data["defense"])
			else:
				Log.err("defense必须是BaseValue.RandomGrowth类型或Dictionary类型")
				return
		if "attack" in data:
			if data["attack"] is BaseValue.RandomGrowth:
				_attack=data["attack"]
			elif data["attack"] is Dictionary:
				_attack=BaseValue.RandomGrowth.new(data["attack"])
			else:
				Log.err("attack必须是BaseValue.RandomGrowth类型或Dictionary类型")
				return
		if "agility" in data:
			if data["agility"] is BaseValue.RandomGrowth:
				_agility=data["agility"]
			elif data["agility"] is Dictionary:
				_agility=BaseValue.RandomGrowth.new(data["agility"])
			else:
				Log.err("agility必须是BaseValue.RandomGrowth类型或Dictionary类型")
				return
	#endregion

## 默认物品（空物品）
class DefaultItem extends  BaseItem:

	pass
## 武器
class WeaponItem extends BaseItem:          
	pass
## 护盾
class ShieldItem extends BaseItem:          
	pass
## 头盔
class HelmetItem extends BaseItem:          
	pass
## 戒指
class RingItem extends BaseItem:            
	pass
## 衣服
class ArmorItem extends BaseItem:          
	pass
## 腰佩
class BeltItem extends BaseItem:            
	pass
## 鞋子
class BootsItem extends BaseItem:          
	pass
## 项链
class NecklaceItem extends BaseItem:       
	pass
