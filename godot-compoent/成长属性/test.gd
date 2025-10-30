extends Control

func _ready() -> void:
	var base=BaseValue.GrowthValue.new({
		"growth_factor": -1.0,
		"value":100,
		"min_growth":1.0,
		"max_growth":1.0,
	})
	for i in range(10):
		base.grow()
		assert(base.value == 100-i-1)
	
	# 对randomValue进行测试
	# 1. 测试RandomGrowth类的基本功能
	var random_growth = BaseValue.RandomGrowth.new({
		"growth_factor": 1.0,
		"min_growth": 1.0,
		"max_growth": 1.0,
		"min_value": 5.0,
		"max_value": 10.0
	})
	
	# 记录初始的min和max值
	var initial_min = random_growth.min_value
	var initial_max = random_growth.max_value
	
	# 测试成长功能
	random_growth.grow()
	
	# 验证min_value和max_value是否正确成长
	assert(random_growth.min_value >= initial_min)
	assert(random_growth.max_value >= initial_max)
	assert(random_growth.min_value <= random_growth.max_value)
	
	# 2. 测试随机值生成
	var random_values = []
	for i in range(10):
		var tmepV=random_growth.value
		random_values.append(tmepV)
		# 验证value在min_value和max_value之间
		assert(random_growth.value >= random_growth.min_value)
		assert(random_growth.value <= random_growth.max_value)
	
	# 验证生成的随机值不是全部相同
	var all_same = true
	var first_value = random_values[0]
	for value in random_values:
		if value != first_value:
			all_same = false
			break
	assert(!all_same or random_growth.min_value == random_growth.max_value)
	
	# 3. 测试should_grow_value和should_only_grow_max_value功能
	var random_growth_test = BaseValue.RandomGrowth.new({
		"growth_factor": 1.0,
		"min_growth": 2.0,
		"max_growth": 2.0,
		"min_value": 0.0,
		"max_value": 0.0,
		"value": 10.0
	})
	
	# 测试should_grow_value
	random_growth_test.should_grow_value = true
	random_growth_test.grow()
	assert(random_growth_test.value == 12.0)  # 初始10.0 + 成长2.0 = 12.0
	
	# 测试should_only_grow_max_value
	random_growth_test = BaseValue.RandomGrowth.new({
		"growth_factor": 1.0,
		"min_growth": 2.0,
		"max_growth": 2.0,
		"min_value": 5.0,
		"max_value": 10.0
	})
	random_growth_test.should_only_grow_max_value = true
	var old_max = random_growth_test.max_value
	random_growth_test.grow()
	assert(random_growth_test.max_value == old_max + 2.0)
	assert(random_growth_test.min_value == 5.0)
	
	print("RandomGrowth测试全部通过！")
