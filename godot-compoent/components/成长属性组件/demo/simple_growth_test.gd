extends MainLoop

var _quit_requested: bool = false
var _test_complete: bool = false

func _initialize() -> void:
	print("开始测试GrowthAttributeComponent...")
	
	# 加载组件脚本
	var growth_attribute_script = load("res://components/成长属性组件/growth_attribute_component.gd")
	if growth_attribute_script:
		print("✓ 成功加载growth_attribute_component.gd")
	else:
		print("✗ 无法加载growth_attribute_component.gd")
		_quit_requested = true
		return
	
	# 加载并实例化GrowthAttributeComponent场景
	var growth_attribute_scene = load("res://components/成长属性组件/GrowthAttributeComponent.tscn")
	var growth_attribute = growth_attribute_scene.instantiate()
	
	# 加载基础成长脚本
	var base_value_script = load("res://components/成长属性组件/基础成长.gd")
	if base_value_script:
		print("✓ 成功加载基础成长.gd")
	else:
		print("✗ 无法加载基础成长.gd")
		_quit_requested = true
		return
	
	# 创建RandomGrowth实例
	var random_growth = base_value_script.RandomGrowth.new({
		"min_growth": 1.0,
		"max_growth": 5.0,
		"growth_factor": 1.0,
		"min_value": 10.0,
		"max_value": 20.0
	})
	
	if random_growth:
		print("✓ 成功创建RandomGrowth实例")
		
		# 将随机成长属性设置到GrowthAttributeComponent
		growth_attribute.set_growth_property(random_growth)
		
		# 获取并验证成长属性
		var retrieved_property = growth_attribute.get_growth_property()
		if retrieved_property == random_growth:
			print("✓ 成功设置和获取成长属性")
		else:
			print("✗ 设置或获取成长属性失败")
		
		# 测试成长功能
		print("测试成长功能...")
		var original_min_value = retrieved_property.get_min_value()
		var original_max_value = retrieved_property.get_max_value()
		retrieved_property.grow()
		var new_min_value = retrieved_property.get_min_value()
		var new_max_value = retrieved_property.get_max_value()
		
		if new_max_value > original_max_value:
			print("✓ 成长功能正常工作")
			print("  成长前: min=%f, max=%f" % [original_min_value, original_max_value])
			print("  成长后: min=%f, max=%f" % [new_min_value, new_max_value])
		else:
			print("✗ 成长功能可能有问题")
			print("  成长前: min=%f, max=%f" % [original_min_value, original_max_value])
			print("  成长后: min=%f, max=%f" % [new_min_value, new_max_value])
	else:
		print("✗ 无法创建RandomGrowth实例")
	
	_test_complete = true
	_quit_requested = true

func _iteration(delta: float) -> bool:
	return _quit_requested

func _finalize() -> void:
	if _test_complete:
		print("测试完成！")
