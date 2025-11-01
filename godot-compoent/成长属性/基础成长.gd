class_name BaseValue

class GrowthValue:
	## 每次成长的最小范围值
	var _min_growth: float: get = get_min_growth, set = set_min_growth
	## 每次成长的最大范围值
	var _max_growth: float: get = get_max_growth, set = set_max_growth
	## 成长因子
	var _growth_factor: float: get = get_growth_factor, set = set_growth_factor
	## 当前属性值
	var _value: float: get = get_value, set = set_value

	#region 通用方法-属性变化通知
	## 属性变化信号
	signal property_changed(key:String, new_value)
	## 防止信号循环的标志
	var _is_notifying:bool=false

	## 发送属性变化通知
	func notify_property_changed(key:String, new_value):
		if _is_notifying:
			return
		else:
			_is_notifying = true
			property_changed.emit(key, new_value)
			_is_notifying = false
	#endregion

	#region get/set方法
	## 获取最小成长值
	func get_min_growth() -> float:
		return _min_growth
	## 设置最小成长值
	func set_min_growth(value: float):
		_min_growth = value
		notify_property_changed("min_growth", value)
	## 获取最大成长值
	func get_max_growth() -> float:
		return _max_growth
	## 设置最大成长值
	func set_max_growth(value: float):
		_max_growth = value
		notify_property_changed("max_growth", value)
	## 获取成长因子
	func get_growth_factor() -> float:
		return _growth_factor
	## 设置成长因子
	func set_growth_factor(value: float):
		_growth_factor = value
		notify_property_changed("growth_factor", value)
	## 获取当前属性值
	func get_value() -> float:
		return _value
	## 设置当前属性值
	func set_value(value: float):
		_value = value
		notify_property_changed("value", value)
	#endregion get/set方法

	## 成长方法 - 向_value添加_min_growth到_max_growth之间的随机值
	func grow():
		# 计算成长值
		var growth_amount = randf_range(_min_growth, _max_growth) * _growth_factor
		# 更新当前属性值
		set_value(get_value() + growth_amount)
	
	## 增加成长因子的方法
	func grow_growth_factor(add_value: float):
		# 增加成长因子
		set_growth_factor(get_growth_factor()+add_value)
	
	## 成长成长范围的方法
	func grow_growth_range():
		# 使用process_range_growth处理_min_growth和_max_growth的成长
		var result = GrowthValue.process_range_growth(_growth_factor, _min_growth, _max_growth)
		# 更新_min_growth和_max_growth
		set_min_growth(get_min_growth()+result.min)
		set_max_growth(get_max_growth()+result.max)
	
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

class RangeGrowth extends GrowthValue:
	## 范围/随机最小值
	var _min_value: float: get = get_min_value, set = set_min_value
	## 范围/随机最大值
	var _max_value: float: get = get_max_value, set = set_max_value
	## 成长时是否同时成长value属性
	var _should_grow_value: bool: get = get_should_grow_value, set = set_should_grow_value
	## 成长时是否只成长max_value属性
	var _should_only_grow_max_value: bool: get = get_should_only_grow_max_value, set = set_should_only_grow_max_value

	#region RangeGrowth属性get/set方法
	## 获取范围/随机最小值
	func get_min_value() -> float:
		return _min_value
	## 设置范围/随机最小值
	func set_min_value(value: float):
		_min_value = value
		notify_property_changed("min_value", value)
	
	## 获取范围/随机最大值
	func get_max_value() -> float:
		return _max_value
	## 设置范围/随机最大值
	func set_max_value(value: float):
		_max_value = value
		notify_property_changed("max_value", value)
	
	## 获取是否同时成长value属性
	func get_should_grow_value() -> bool:
		return _should_grow_value
	## 设置是否同时成长value属性
	func set_should_grow_value(value: bool):
		_should_grow_value = value
		notify_property_changed("should_grow_value", value)
	
	## 获取是否只成长max_value属性
	func get_should_only_grow_max_value() -> bool:
		return _should_only_grow_max_value
	## 设置是否只成长max_value属性
	func set_should_only_grow_max_value(value: bool):
		_should_only_grow_max_value = value
		notify_property_changed("should_only_grow_max_value", value)
	#endregion

	## 初始化方法
	func _init(dic: Dictionary={}):
		# 调用父类初始化
		super._init(dic)
		# 初始化RangeGrowth特定属性
		set_min_value(dic.get("min_value", 0.0))
		set_max_value(dic.get("max_value", 0.0))
		set_should_grow_value(dic.get("should_grow_value", false))
		set_should_only_grow_max_value(dic.get("should_only_grow_max_value", false))
	
	## 重写grow方法，专注于_min_value和_max_value的成长
	func grow():
		# 可选地成长基础值
		if get_should_grow_value():
			super.grow()
		
		# 计算成长量
		var growth_amount = randf_range(get_min_growth(), get_max_growth()) * get_growth_factor()
		
		# 处理不同的成长策略
		if get_should_only_grow_max_value():
			# 只成长最大值
			set_max_value(get_max_value() + growth_amount)
		else:
			# 使用基类方法处理范围成长
			var result = GrowthValue.process_range_growth(growth_amount, get_min_value(), get_max_value())
			# 更新_min_value和_max_value
			set_min_value(result.min)
			set_max_value(result.max)

class RandomGrowth extends RangeGrowth:
	func get_value() -> float:
		return randf_range(get_min_value(), get_max_value())
	pass
