extends Control

const BaseValue = preload("uid://2ye25vjxabed")

var random_growth

func _ready() -> void:
	var base=BaseValue.GrowthValue.new({
		"growth_factor": -1.0,
		"value":100,
		"min_growth":1.0,
		"max_growth":1.0,
	})
	base.property_changed.connect(func(key,value):
		print(key,value)
		if key=="min_growth":
			base.set_min_growth(1)
		pass)
	base.set_min_growth(12)
	#for i in range(10):
		#base.grow()
		#assert(base.value == 100-i-1)
	
	# 对randomValue进行测试
	# 1. 测试RandomGrowth类的基本功能
	random_growth = BaseValue.RandomGrowth.new({
		"growth_factor": 1.0,
		"min_growth": 1.0,
		"max_growth": 1.0,
		"min_value": 5.0,
		"max_value": 10.0
	})
	print(random_growth.get_value())
	
	$"成长属性组件".set_growth_property(random_growth)
	$"自定义成长属性组件".set_growth_property(random_growth)
	$"自定义成长属性组件2".set_growth_property(random_growth)
	
	Log.info("测试info信息")
	Log.debug("测试debug信息")
	Log.warn("测试warn信息")
	#Log.err("测试error信息")
	#print(LogConfig.logTextRich.log_text)


func _on_timer_timeout() -> void:
	print("开始改变数据")
	#_test_temp.clear()
	#$"成长属性组件".queue_free()
	random_growth.set_min_value(2)
	random_growth.set_max_value(4)
	pass # Replace with function body.
