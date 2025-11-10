# 修仙者类 - 游戏中的修仙者角色表示

const BaseValue = preload("res://成长属性/基础成长.gd")

## 修仙者队伍类
class CultivatorTeam:
	## 队伍成员 3*3 的数组
	var _members:Array[Array]=[]:set=set_members,get=get_members
	signal team_member_changed(row:int,col:int,cultivator:BaseCultivator)
	func _init() -> void:
		for i in 3:
			_members.append([])
			for j in 3:
				_members[i].append(null)
		
	## 设置队伍成员数组
	func set_members(new_members:Array[Array]) -> void:
		_members = new_members
	
	## 获取队伍成员数组
	func get_members() -> Array[Array]:
		return _members
	
	#region 外部方法
	## 获取有效的队伍成员
	func get_valid_members() -> Array[BaseCultivator]:
		var valid_members:Array[BaseCultivator]=[]
		for i in 3:
			for j in 3:
				if _members[i][j]!=null:
					if _members[i][j].is_alive():
						valid_members.append(_members[i][j])
		return valid_members
	## 获取所在位置的修仙者
	func get_member(行:int,列:int) -> BaseCultivator:
		return _members[行][列]
	## 获取修仙者所在位置
	func get_position(修仙者:BaseCultivator) -> Vector2:
		for i in 3:
			for j in 3:
				if _members[i][j]==修仙者:
					return Vector2(i,j)
		return Vector2(-1,-1)
	## 上阵
	func 上阵(修仙者:BaseCultivator,行:int,列:int) -> void:
		_members[行][列]=修仙者
		team_member_changed.emit(行,列,修仙者)
	func 出队(行:int,列:int) -> void:
		_members[行][列]=null
		team_member_changed.emit(行,列,null)
	#endregion

# 基础修仙者对象类 - 修仙者角色属性的核心数据结构
class BaseCultivator:
	# 修仙者姓名
	var _name_str:String="基础修仙者":set=set_name_str,get=get_name_str
	# 修仙者等级（使用GrowthValue类型进行渐进式成长）
	var _level:BaseValue.GrowthValue=BaseValue.GrowthValue.new({"value":1,"min_growth":1,"max_growth":1,"growth_factor":1}):set=set_level,get=get_level
	# 修仙者生命值（使用RangeGrowth跟踪最小值/最大值范围）
	var _health:BaseValue.RangeGrowth=BaseValue.RangeGrowth.new({"value":100,"max":100,"min":0,"min_growth":3,"max_growth":7,"growth_factor":5,"should_only_grow_max_value":true}):set=set_health,get=get_health
	# 修仙者灵气值（使用RangeGrowth跟踪最小值/最大值范围）
	var _mana:BaseValue.RangeGrowth=BaseValue.RangeGrowth.new({"value":0,"max":100,"min":0,"min_growth":5,"max_growth":10,"growth_factor":8,"should_only_grow_max_value":true}):set=set_mana,get=get_mana
	# 修仙者攻击力（使用RandomGrowth进行可变伤害计算）
	var _attack:BaseValue.RandomGrowth=BaseValue.RandomGrowth.new({"min_value":8,"max_value":15,"min_growth":1,"max_growth":3,"growth_factor":2}):set=set_attack,get=get_attack
	# 修仙者防御力（使用RandomGrowth进行可变伤害减免）
	var _defense:BaseValue.RandomGrowth=BaseValue.RandomGrowth.new({"min_value":5,"max_value":10,"min_growth":1,"max_growth":2,"growth_factor":1.5}):set=set_defense,get=get_defense
	# 修仙者敏捷值（使用RandomGrowth进行速度计算）
	var _agility:BaseValue.RandomGrowth=BaseValue.RandomGrowth.new({"min_value":4,"max_value":6,"min_growth":1,"max_growth":2,"growth_factor":1.2}):set=set_agility,get=get_agility
	
	signal 属性变化信号(属性名称:String,old_value:Variant,new_value:Variant)
	#region 外部方法
	## 是否存活
	func is_alive() -> bool:
		return _health.get_value() > _health.get_min_value()
	## 是否能够升级
	func can_level_up() -> bool:
		return _mana.get_value() >= _mana.get_max_value()
	## 突破
	func break_up() -> void:
		_health.grow_growth_range()
		_mana.grow_growth_range()
		_attack.grow_growth_range()
		_defense.grow_growth_range()
		_agility.grow_growth_range()
		# 突破后触发所有属性变化信号	
		属性变化信号.emit("_health", _health, _health)
		属性变化信号.emit("_mana", _mana, _mana)
		属性变化信号.emit("_attack", _attack, _attack)
		属性变化信号.emit("_defense", _defense, _defense)
		属性变化信号.emit("_agility", _agility, _agility)
	## 升级
	func grow(是否强制升级:bool=false) -> void:
		if 是否强制升级:
			_mana.set_value(_mana.get_max_value())
		if can_level_up():
			_level.grow()
			_health.grow()
			_mana.grow()
			_attack.grow()
			_defense.grow()
			_agility.grow()
			# 经验设置为0
			_mana.set_value(0)
	#endregion
	#region get/set方法
	# 设置修仙者姓名
	func set_name_str(new_value:String) -> void:
		var old_value = _name_str
		_name_str = new_value
		属性变化信号.emit("_name_str", old_value, new_value)

	# 获取修仙者姓名
	func get_name_str() -> String:
		return _name_str

	# 设置修仙者等级对象
	func set_level(new_value:BaseValue.GrowthValue) -> void:
		var old_value = _level
		_level = new_value
		属性变化信号.emit("_level", old_value, new_value)

	# 获取修仙者等级对象
	func get_level() -> BaseValue.GrowthValue:
		return _level

	# 设置修仙者生命值对象
	func set_health(new_value:BaseValue.RangeGrowth) -> void:
		var old_value = _health
		_health = new_value
		属性变化信号.emit("_health", old_value, new_value)

	# 获取修仙者生命值对象
	func get_health() -> BaseValue.RangeGrowth:
		return _health

	# 设置修仙者灵气值对象
	func set_mana(new_value:BaseValue.RangeGrowth) -> void:
		var old_value = _mana
		_mana = new_value
		属性变化信号.emit("_mana", old_value, new_value)

	# 获取修仙者灵气值对象
	func get_mana() -> BaseValue.RangeGrowth:
		return _mana

	# 设置修仙者攻击力对象
	func set_attack(new_value:BaseValue.RandomGrowth) -> void:
		var old_value = _attack
		_attack = new_value
		属性变化信号.emit("_attack", old_value, new_value)

	# 获取修仙者攻击力对象
	func get_attack() -> BaseValue.RandomGrowth:
		return _attack

	# 设置修仙者防御力对象
	func set_defense(new_value:BaseValue.RandomGrowth) -> void:
		var old_value = _defense
		_defense = new_value
		属性变化信号.emit("_defense", old_value, new_value)

	# 获取修仙者防御力对象
	func get_defense() -> BaseValue.RandomGrowth:
		return _defense

	# 设置修仙者敏捷值对象
	func set_agility(new_value:BaseValue.RandomGrowth) -> void:
		var old_value = _agility
		_agility = new_value
		属性变化信号.emit("_agility", old_value, new_value)

	# 获取修仙者敏捷值对象
	func get_agility() -> BaseValue.RandomGrowth:
		return _agility
	#endregion
