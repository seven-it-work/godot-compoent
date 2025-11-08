# 修仙者类 - 游戏中的修仙者角色表示
class_name Cultivator

## 修仙者队伍类
class 修仙者队伍:
	## 队伍成员 3*3 的数组
	var _members:Array[Array]=[
		[],
		[],
		[],
	]:set=set_members,get=get_members
	signal 队伍成员变化(行:int,列:int,修仙者:Cultivator)
	
	## 设置队伍成员数组
	func set_members(new_members:Array[Array]) -> void:
		_members = new_members
	
	## 获取队伍成员数组
	func get_members() -> Array[Array]:
		return _members
	
	#region 外部方法
	## 上阵
	func 上阵(修仙者:Cultivator,行:int,列:int) -> void:
		_members[行][列]=修仙者
		队伍成员变化.emit(行,列,修仙者)
	func 出队(行:int,列:int) -> void:
		_members[行][列]=null
		队伍成员变化.emit(行,列,null)
	#endregion

# 基础修仙者对象类 - 修仙者角色属性的核心数据结构
class BaseCultivator:
	# 修仙者姓名
	var _name:String="基础修仙者":set=set_name,get=get_name
	# 修仙者等级（使用GrowthValue类型进行渐进式成长）
	var _level:BaseValue.GrowthValue=BaseValue.GrowthValue.new({"value":1,"min_growth":1,"max_growth":1,"growth_factor":1}):set=set_level,get=get_level
	# 修仙者生命值（使用RangeGrowth跟踪最小值/最大值范围）
	var _health:BaseValue.RangeGrowth=BaseValue.RangeGrowth.new({"value":100,"max":100,"min":0,"min_growth":3,"max_growth":7,"growth_factor":5,"should_only_grow_max_value":true}):set=set_health,get=get_health
	# 修仙者灵气值（使用RangeGrowth跟踪最小值/最大值范围）
	var _mana:BaseValue.RangeGrowth=BaseValue.RangeGrowth.new({"value":0,"max":100,"min":0,"min_growth":5,"max_growth":10,"growth_factor":8,"should_only_grow_max_value":true}):set=set_mana,get=get_mana
	# 修仙者攻击力（使用RandomGrowth进行可变伤害计算）
	var _attack:BaseValue.RandomGrowth=BaseValue.RandomGrowth.new({"min":8,"max":15,"min_growth":1,"max_growth":3,"growth_factor":2}):set=set_attack,get=get_attack
	# 修仙者防御力（使用RandomGrowth进行可变伤害减免）
	var _defense:BaseValue.RandomGrowth=BaseValue.RandomGrowth.new({"min":5,"max":10,"min_growth":1,"max_growth":2,"growth_factor":1.5}):set=set_defense,get=get_defense
	#region 外部方法
	## 是否能够升级
	func can_level_up() -> bool:
		return _mana.get_value() >= _mana.get_max_value()
	## 突破
	func break_up() -> void:
		_health.grow_growth_range()
		_mana.grow_growth_range()
		_attack.grow_growth_range()
		_defense.grow_growth_range()
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
			# 经验设置为0
			_mana.set_value(0)
	#endregion
	#region get/set方法
	# 设置修仙者姓名
	func set_name(new_value:String) -> void:
		_name = new_value

	# 获取修仙者姓名
	func get_name() -> String:
		return _name

	# 设置修仙者等级对象
	func set_level(new_value:BaseValue.GrowthValue) -> void:
		_level = new_value

	# 获取修仙者等级对象
	func get_level() -> BaseValue.GrowthValue:
		return _level

	# 设置修仙者生命值对象
	func set_health(new_value:BaseValue.RangeGrowth) -> void:
		_health = new_value

	# 获取修仙者生命值对象
	func get_health() -> BaseValue.RangeGrowth:
		return _health

	# 设置修仙者灵气值对象
	func set_mana(new_value:BaseValue.RangeGrowth) -> void:
		_mana = new_value

	# 获取修仙者灵气值对象
	func get_mana() -> BaseValue.RangeGrowth:
		return _mana

	# 设置修仙者攻击力对象
	func set_attack(new_value:BaseValue.RandomGrowth) -> void:
		_attack = new_value

	# 获取修仙者攻击力对象
	func get_attack() -> BaseValue.RandomGrowth:
		return _attack

	# 设置修仙者防御力对象
	func set_defense(new_value:BaseValue.RandomGrowth) -> void:
		_defense = new_value

	# 获取修仙者防御力对象
	func get_defense() -> BaseValue.RandomGrowth:
		return _defense
	#endregion
