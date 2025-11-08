class_name GlobalConfig 
extends Node

const 全局倍速_MAX:int=20
const 全局倍速_MIN:int=1

var _是否自动战斗:bool=true
var _全局倍速:int=3

#region get/set 方法
# 是否自动战斗
func set_是否自动战斗(new_value:bool) -> void:
	_是否自动战斗 = new_value

func get_是否自动战斗() -> bool:
	return _是否自动战斗

# 全局倍速
func set_全局倍速(new_value:int) -> void:
	# 确保值在有效范围内
	if new_value < 全局倍速_MIN:
		_全局倍速 = 全局倍速_MIN
	elif new_value > 全局倍速_MAX:
		_全局倍速 = 全局倍速_MAX
	else:
		_全局倍速 = new_value

func get_全局倍速() -> int:
	return _全局倍速
#endregion
