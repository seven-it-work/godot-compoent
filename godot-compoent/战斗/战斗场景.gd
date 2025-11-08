extends Control

var _敌人队伍:Array
var _玩家队伍:Array

func _process(_delta: float) -> void:
	pass


func _ready() -> void:
	var hSlider=	%"倍速".get_node("HSlider") as HSlider
	hSlider.max_value=全局配置.全局倍速_MAX
	hSlider.min_value=全局配置.全局倍速_MIN
	hSlider.value=全局配置.get_全局倍速()
	%"自动战斗".button_pressed=全局配置.get_是否自动战斗()
	pass

func _on_自动战斗_toggled(toggled_on: bool) -> void:
	全局配置.set_是否自动战斗(toggled_on)

func _on_h_slider_value_changed(value: float) -> void:
	%"倍速".get_node("Label").text="%s倍速"%value
	全局配置.set_全局倍速(value)
