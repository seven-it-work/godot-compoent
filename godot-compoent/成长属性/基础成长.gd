class_name BaseValue

class GrowthValue:
	## 每次成长的最小范围值
	var _min_growth: float
	## 每次成长的最大范围值
	var _max_growth: float
	## 成长因子
	var _growth_factor: float
	## 当前属性值
	var _value: float

	## 成长方法 - 向_value添加_min_growth到_max_growth之间的随机值
	func grow():
		# 计算成长值
		var growth_amount = randf_range(_min_growth, _max_growth) * _growth_factor
		# 更新当前属性值
		_value += growth_amount
	
	## 增加成长因子的方法
	func grow_growth_factor(add_value: float):
		# 增加成长因子
		_growth_factor += add_value
	
	## 成长成长范围的方法
	func grow_growth_range():
		# 使用process_range_growth处理_min_growth和_max_growth的成长
		var result = GrowthValue.process_range_growth(_growth_factor, _min_growth, _max_growth)
		# 更新_min_growth和_max_growth
		_min_growth = result.min
		_max_growth = result.max
	
	## 静态方法：处理范围成长并确保min <= max
	static func process_range_growth(growth_amount: float, min_val: float, max_val: float, min_ratio_range: Array=[0.3, 0.7]) -> Dictionary:
		# 根据比例随机分配成长量到min和max
		var min_ratio = randf_range(min_ratio_range[0], min_ratio_range[1])
		var min_growth_part = growth_amount * min_ratio
		var max_growth_part = growth_amount * (1.0 - min_ratio)
		
		# 保存原始值用于可能的重新分配
		var original_min = min_val
		var original_max = max_val
		
		# 尝试更新值
		min_val += min_growth_part
		max_val += max_growth_part
		
		# 检查并修正边界情况：确保min_val <= max_val
		if min_val > max_val:
			# 当min_val超过max_val时，使用随机分配
			# 在(0, growth_amount/2)范围内随机分配小部分给min_val，剩余给max_val
			var min_part = randf_range(0, growth_amount / 2)
			var max_part = growth_amount - min_part
			min_val = original_min + min_part
			max_val = original_max + max_part
		
		# 返回处理后的min和max值
		return {"min": min_val, "max": max_val}

	## Initialization method with dictionary support
	func _init(dic: Dictionary={}):
		# Initialize properties from dictionary
		_min_growth = dic.get("min_growth", 0.0)
		_max_growth = dic.get("max_growth", 0.0)
		_growth_factor = dic.get("growth_factor", 1.0)
		_value = dic.get("value", 0.0)


	## GDScript属性系统的_get方法
	func _get(property: StringName):
		match property:
			"min_growth":
				return _min_growth
			"max_growth":
				return _max_growth
			"growth_factor":
				return _growth_factor
			"value":
				return _value
		# 对于未知属性，返回null
		return null

class RangeGrowth extends GrowthValue:
	## 范围/随机最小值
	var _min_value: float
	## 范围/随机最大值
	var _max_value: float
	## 成长时是否同时成长value属性
	var _should_grow_value: bool = false
	## 成长时是否只成长max_value属性
	var _should_only_grow_max_value: bool = false

	## 初始化方法
	func _init(dic: Dictionary={}):
		# 调用父类初始化
		super._init(dic)
		# 初始化RangeGrowth特定属性
		_min_value = dic.get("min_value", 0.0)
		_max_value = dic.get("max_value", 0.0)
		_should_grow_value = dic.get("should_grow_value", false)
		_should_only_grow_max_value = dic.get("should_only_grow_max_value", false)

	## GDScript属性系统的_get方法
	func _get(property: StringName):
		match property:
			"min_value":
				return _min_value
			"max_value":
				return _max_value
			"should_grow_value":
				return _should_grow_value
			"should_only_grow_max_value":
				return _should_only_grow_max_value
		# 其他属性调用父类的_get方法
		return super._get(property)
	
	## 重写grow方法，专注于_min_value和_max_value的成长
	func grow():
		# 可选地成长基础值
		if _should_grow_value:
			super.grow()
		
		# 计算成长量
		var growth_amount = randf_range(_min_growth, _max_growth) * _growth_factor
		
		# 处理不同的成长策略
		if _should_only_grow_max_value:
			# 只成长最大值
			_max_value += growth_amount
		else:
			# 使用基类方法处理范围成长
			var result = GrowthValue.process_range_growth(growth_amount, _min_value, _max_value)
			# 更新_min_value和_max_value
			_min_value = result.min
			_max_value = result.max

class RandomGrowth extends RangeGrowth:
	## GDScript属性系统的_get方法
	func _get(property: StringName):
		if property == "value":
			print("value为随机值")
			return randf_range(_min_value, _max_value)
		return super._get(property)
