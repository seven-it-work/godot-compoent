const Cultivator = preload("uid://biryomw8u6qck")
const BaseValue = preload("uid://2ye25vjxabed")

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
	var _desc_str:String="":set=set_desc_str,get=get_desc_str
	
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
	func set_desc_str(new_value:String)->void:
		_desc_str=new_value
	func get_desc_str()->String:
		return _desc_str
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
	## 随机创建武器
	static func random_weapon()->WeaponItem:
		# 加载script_code
		var script_code = FileAccess.open("res://entity/script_code/WeaponItem.text", FileAccess.READ).get_as_text()
		if script_code == null:
			print("无法打开WeaponItem脚本文件")
			return
		# 通过 res://entity/json/武器.json 来获取一批武器json
		# 从文件读取JSON数据
		var file = FileAccess.open("res://entity/json/武器.json", FileAccess.READ)
		if file == null:
			print("无法打开JSON文件")
			return
		# 然后pick_random一个 作为 json_data
		var json_data = JSON.parse_string(file.get_as_text()).pick_random()
		# 检查是否有class_type
		if json_data.get("class_type", "") != "BaseItemScope.WeaponItem":
			print("无效的物品类型")
			return null
		# 创建一个继承自WeaponItem的动态脚本
		var weapon_script = GDScript.new()
		# 构建脚本源代码
		var can_use_func = json_data.get_or_add("是否能使用", "")
		weapon_script.source_code = script_code+"\n"+can_use_func
		
		# 编译脚本
		var reload_error = weapon_script.reload()
		if reload_error != OK:
			print("武器脚本编译失败: ", error_string(reload_error))
			return null
		
		# 创建武器实例
		var weapon = weapon_script.new(json_data)
		return weapon

	# 武器稀有度枚举
	enum RarityLevel {
		COMMON = 0,  # 凡品
		SPIRIT = 1,  # 灵品
		EARTH = 2,   # 地品
		HEAVEN = 3,  # 天品
		IMMORTAL = 4,  # 仙品
		SAINT = 5,   # 圣品
		EMPEROR = 6  # 帝品
	}
	# 稀有度名称映射
	const rarity_names: Dictionary = {
		RarityLevel.COMMON: "凡品",
		RarityLevel.SPIRIT: "灵品",
		RarityLevel.EARTH: "地品",
		RarityLevel.HEAVEN: "天品",
		RarityLevel.IMMORTAL: "仙品",
		RarityLevel.SAINT: "圣品",
		RarityLevel.EMPEROR: "帝品"
	}
	# 稀有度对应的成长因子映射
	const rarity_growth_factors: Dictionary = {
		RarityLevel.COMMON: 1.0,
		RarityLevel.SPIRIT: 1.2,
		RarityLevel.EARTH: 1.5,
		RarityLevel.HEAVEN: 1.8,
		RarityLevel.IMMORTAL: 2.2,
		RarityLevel.SAINT: 2.8,
		RarityLevel.EMPEROR: 3.5
	}
	# 稀有度对应的词条数量范围映射
	const rarity_stat_count: Dictionary = {
		RarityLevel.COMMON: [1, 2],
		RarityLevel.SPIRIT: [2, 3],
		RarityLevel.EARTH: [3, 4],
		RarityLevel.HEAVEN: [4, 5],
		RarityLevel.IMMORTAL: [5, 6],
		RarityLevel.SAINT: [6, 7],
		RarityLevel.EMPEROR: [7, 8]
	}
	# 稀有度对应的成长等级
	const rarity_stat_lv: Dictionary = {
		RarityLevel.COMMON: [1, 10],
		RarityLevel.SPIRIT: [5, 20],
		RarityLevel.EARTH: [10, 50],
		RarityLevel.HEAVEN: [20, 100],
		RarityLevel.IMMORTAL: [50, 500],
		RarityLevel.SAINT: [100, 1000],
		RarityLevel.EMPEROR: [500, 5000]
	}
	
	# 稀有度等级
	var _rarity: int = RarityLevel.COMMON
	# 武器等级
	var current_level: int = 1
	var max_level: int = 10
	
	# 武器词条属性 - 使用GrowthValue直接作为属性
	# 攻击力词条
	var flat_attack: BaseValue.RandomGrowth = null  # 具体数值攻击力词条
	var percent_attack: BaseValue.RandomGrowth = null  # 百分比攻击力词条
	
	# 防御力词条
	var flat_defense: BaseValue.RandomGrowth = null  # 具体数值防御力词条
	var percent_defense: BaseValue.RandomGrowth = null  # 百分比防御力词条
	
	# 敏捷值词条
	var flat_agility: BaseValue.RandomGrowth = null  # 具体数值敏捷值词条
	var percent_agility: BaseValue.RandomGrowth = null  # 百分比敏捷值词条
	
	# 生命值词条
	var flat_health: BaseValue.GrowthValue = null  # 具体数值生命值词条
	var percent_health: BaseValue.GrowthValue = null  # 百分比生命值词条
	
	# 初始化方法
	func _init(data: Dictionary = {}):
		super._init(data)
		# 从字典初始化基础属性
		_rarity = data.get("rarity", RarityLevel.COMMON)
		# 不允许提供预设属性，只能根据稀有度随机生成词条
		generate_random_stats()
		# 进行升级
		var lv= data.get("current_level", 1)
		for i in range(1,lv):
			self.level_up()
		
	# 检查是否已有任何词条
	func has_any_stats() -> bool:
		return flat_attack != null or percent_attack != null or \
			flat_defense != null or percent_defense != null or \
			flat_agility != null or percent_agility != null or \
			flat_health != null or percent_health != null
	## 获取有效的词条，返回结果：[{name_str:"中文名",value:对象,type:"flat_attack"或"percent_attack"等}]
	func get_valid_stats() -> Array:
		var stats=[]
		if flat_attack != null:
			stats.append({"name_str":"攻击力", "value":flat_attack, "type":"flat_attack"})
		if percent_attack != null:
			stats.append({"name_str":"攻击力", "value":percent_attack, "type":"percent_attack"})
		if flat_defense != null:
			stats.append({"name_str":"防御力", "value":flat_defense, "type":"flat_defense"})
		if percent_defense != null:
			stats.append({"name_str":"防御力", "value":percent_defense, "type":"percent_defense"})
		if flat_agility != null:
			stats.append({"name_str":"敏捷值", "value":flat_agility, "type":"flat_agility"})
		if percent_agility != null:
			stats.append({"name_str":"敏捷值", "value":percent_agility, "type":"percent_agility"})
		if flat_health != null:
			stats.append({"name_str":"生命值", "value":flat_health, "type":"flat_health"})
		if percent_health != null:
			stats.append({"name_str":"生命值", "value":percent_health, "type":"percent_health"})
		return stats
	
	# 根据稀有度生成随机词条
	func generate_random_stats():
		# 通过稀有度获取最大成长等级
		max_level=randi_range(rarity_stat_lv[_rarity][0],rarity_stat_lv[_rarity][1])
		# 根据稀有度获取词条数量范围
		var count_range = rarity_stat_count[_rarity]
		var stat_count = randi_range(count_range[0], count_range[1])
		
		# 可生成的词条类型列表
		var available_stats = ["flat_attack", "percent_attack", "flat_defense", "percent_defense", \
							"flat_agility", "percent_agility", "flat_health", "percent_health"]
		
		# 获取对应稀有度的成长因子
		var growth_factor = rarity_growth_factors[_rarity]
		
		# 随机选择指定数量的词条
		for i in range(stat_count):
			if available_stats.is_empty():
				break
				
			var random_index = randi_range(0, available_stats.size() - 1)
			var stat_type = available_stats[random_index]
			available_stats.erase(random_index)
			
			# 根据词条类型初始化不同的基础值范围
			var base_config = get_base_config_for_stat(stat_type)
			var stat_value
			
			# 根据词条类型选择对应的类
			if stat_type.begins_with("flat_health") or stat_type.begins_with("percent_health"):
				# 生命值相关词条使用GrowthValue
				stat_value = BaseValue.GrowthValue.new({
					"min_growth": base_config["min_growth"],
					"max_growth": base_config["max_growth"],
					"growth_factor": growth_factor,
					"value": base_config["initial_value"]
				})
			else:
				# 其他词条使用RandomGrowth，使用min_value和max_value参数
				stat_value = BaseValue.RandomGrowth.new({
					"min_growth": base_config["min_growth"],
					"max_growth": base_config["max_growth"],
					"growth_factor": growth_factor,
					"min_value": base_config["min_value"],
					"max_value": base_config["max_value"]
				})
			
			# 设置词条属性
			match stat_type:
				"flat_attack": flat_attack = stat_value
				"percent_attack": percent_attack = stat_value
				"flat_defense": flat_defense = stat_value
				"percent_defense": percent_defense = stat_value
				"flat_agility": flat_agility = stat_value
				"percent_agility": percent_agility = stat_value
				"flat_health": flat_health = stat_value
				"percent_health": percent_health = stat_value
			
	# 获取词条类型的基础配置
	func get_base_config_for_stat(stat_type: String) -> Dictionary:
		# 不同词条类型的基础配置
		var configs = {
			# 具体数值类型词条
			"flat_attack": {"min_growth": 1.0, "max_growth": 3.0, "base_value": randi_range(10, 30)},
			"flat_defense": {"min_growth": 0.5, "max_growth": 2.0, "base_value": randi_range(5, 20)},
			"flat_agility": {"min_growth": 0.3, "max_growth": 1.5, "base_value": randi_range(3, 15)},
			"flat_health": {"min_growth": 5.0, "max_growth": 20.0, "base_value": randi_range(50, 200)},
			# 百分比类型词条
			"percent_attack": {"min_growth": 0.01, "max_growth": 0.03, "base_value": randf_range(0.01, 0.03)},
			"percent_defense": {"min_growth": 0.005, "max_growth": 0.02, "base_value": randf_range(0.01, 0.02)},
			"percent_agility": {"min_growth": 0.003, "max_growth": 0.015, "base_value": randf_range(0.005, 0.02)},
			"percent_health": {"min_growth": 0.02, "max_growth": 0.05, "base_value": randf_range(0.02, 0.05)}
		}
		
		# 获取基础配置的副本
		var config = configs[stat_type].duplicate()
		
		# 根据词条类型设置不同的属性
		if stat_type.begins_with("flat_health") or stat_type.begins_with("percent_health"):
			# 生命值相关词条使用GrowthValue，设置initial_value
			config["initial_value"] = config["base_value"]
		else:
			# 其他词条使用RandomGrowth，设置min_value和max_value
			# 为RandomGrowth创建一个合理的范围
			var base_val = config["base_value"]
			var variation = base_val * 0.2  # 20%的变化范围
			config["min_value"] = max(0.01, base_val - variation)
			config["max_value"] = base_val + variation
			# 移除不需要的base_value
			config.erase("base_value")
		
		return config
	
	# 提升武器等级
	func level_up() -> bool:
		if current_level >= max_level:
			return false
			
		current_level += 1
		
		# 提升所有存在的词条属性
		var stats_to_grow = [flat_attack, percent_attack, flat_defense, percent_defense,
				flat_agility, percent_agility, flat_health, percent_health]
		
		for stat in stats_to_grow:
			if stat != null:
				stat.grow()
				
		return true
	
	# 重写是否能使用方法，根据稀有度和修仙者境界判断
	func 是否能使用(修仙者:Cultivator.BaseCultivator) -> bool:
		if not super.是否能使用(修仙者):
			return false
			
		# 根据稀有度判断使用条件
		match _rarity:
			RarityLevel.IMMORTAL:
				# 仙品武器需要仙人境界
				return 修仙者.境界 >= 修仙者.境界.仙人
			RarityLevel.SAINT:
				# 圣品武器需要圣人境界
				return 修仙者.境界 >= 修仙者.境界.圣人
			RarityLevel.EMPEROR:
				# 帝品武器需要大帝境界
				return 修仙者.境界 >= 修仙者.境界.大帝
			_:
				# 其他稀有度没有特殊要求
				return true
				
	# 获取稀有度名称
	func get_rarity_name() -> String:
		return rarity_names.get(_rarity, "未知")
		
	# 获取稀有度等级
	func get_rarity() -> int:
		return _rarity
	
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
