extends Control

func _ready() -> void:
	pass


var count=0
func _process(_delta: float) -> void:
	if count>100:
		$LabelAndValue.set_label(str([1,2,3,4,5,6,7,8,9,10].pick_random()))
		$LabelAndValue.set_value(str([1,2,3,4,5,6,7,8,9,10].pick_random()))
		count=0
	else:
		count+=1
	pass
