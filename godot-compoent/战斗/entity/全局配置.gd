class_name GlobalConfig 
extends Node

const BattleSceneControl = preload("uid://63bxcj0e6b1t")

const 全局倍速_MAX:int=20
const 全局倍速_MIN:int=1

var _是否自动战斗:bool=true
var _全局倍速:int=10
var _战斗暂停:bool=false:set=set_战斗暂停,get=get_战斗暂停
var _游戏暂停:bool=false:set=set_游戏暂停,get=get_游戏暂停

# 场景
var 战斗场景:BattleSceneControl=null

#region get/set 方法
# 战斗暂停
func set_战斗暂停(new_value:bool) -> void:
	_战斗暂停 = new_value

func get_战斗暂停() -> bool:
	return _战斗暂停

# 游戏暂停
func set_游戏暂停(new_value:bool) -> void:
	_游戏暂停 = new_value

func get_游戏暂停() -> bool:
	return _游戏暂停

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
