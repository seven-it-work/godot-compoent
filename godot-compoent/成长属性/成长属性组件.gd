extends HBoxContainer

@export var label:String
var growth:BaseValue.GrowthValue=null:
	set(new_v):
		growth=new_v
		if is_node_ready():
			_渲染growth()
		pass

var _all_value:Array[Control]=[]

func _ready() -> void:
	_all_value=[$ValueStr, $ProgressBar]

func _渲染growth():
	for i in _all_value:
		i.hide()
	if growth is BaseValue.RandomGrowth:
		$ValueStr.show()
		$ValueStr.text="%s~%s"%[growth._min_value,growth._max_value]
	elif growth is BaseValue.RangeGrowth:
		$ProgressBar.show()
		$ProgressBar.min_value=growth._min_value
		$ProgressBar.max_value=growth._max_value
		$ProgressBar.value=growth.value
	pass
