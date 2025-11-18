extends Control

const BaseValue = preload("uid://2ye25vjxabed")

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	$VBoxContainer/GrowthAttributeComponent.set_value("123")
	var data2=BaseValue.RangeGrowth.new({
		"min_value":1,
		"max_value":10,
		"value":5
	})
	$VBoxContainer/GrowthAttributeComponent2.set_growth_property(data2)
	var data3=BaseValue.RandomGrowth.new(
		{
			"min_value":1,
			"max_value":10
		}
	)
	$VBoxContainer/GrowthAttributeComponent3.set_growth_property(data3)
	$VBoxContainer/GrowthAttributeComponent4.set_growth_property(data2)
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass
