extends Control

const BaseValue = preload("res://components/成长属性组件/基础成长.gd")

func _ready() -> void:
	# 初始化随机数生成器
	RandomNumberGenerator.new().randomize()
	
	# 创建一个RandomGrowth实例
	var random_growth = BaseValue.RandomGrowth.new({
		"min_growth": 1.0,
		"max_growth": 5.0,
		"growth_factor": 1.0,
		"min_value": 10.0,
		"max_value": 20.0
	})
	
	# 将随机成长属性设置到GrowthAttributeComponent
	$GrowthAttributeComponent.set_growth_property(random_growth)
	
	# 创建一个RandomGrowth实例
	var renge_growth = BaseValue.RangeGrowth.new({
		"min_growth": 1.0,
		"max_growth": 5.0,
		"growth_factor": 1.0,
		"value":10,
		"max_value": 20.0
	})
	
	# 将随机成长属性设置到GrowthAttributeComponent
	$GrowthAttributeComponent2.set_growth_property(renge_growth)

var count = 0
func _process(_delta: float) -> void:
	if count > 100:
		# 让成长属性增长
		var growth_property = $GrowthAttributeComponent.get_growth_property()
		if growth_property:
			growth_property.grow()
		# 让成长属性增长
		var growth_property2 = $GrowthAttributeComponent2.get_growth_property()
		if growth_property2:
			growth_property2.grow()
		count = 0
	else:
		count += 1
