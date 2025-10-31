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
	print(random_growth.value)