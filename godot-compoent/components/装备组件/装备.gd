extends Control

const 背包UI = preload("uid://bo5yq44dywrje")
const 装备UI = preload("uid://dilkpj6unyf2h")
const CultivatorEquipmentClass = preload("res://entity/修仙者的装备.gd")

@onready var 背包:背包UI = $背包
@onready var 筛选 = $HBoxContainer/筛选


func _on_装备_pressed() -> void:
	if 背包.get_selected_compartment():
		var cultivator_equipment= %"装备".get_cultivator_equipment() as CultivatorEquipmentClass.CultivatorEquipment
		cultivator_equipment.装备装备(背包.get_selected_compartment().get_base_item())
	pass # Replace with function body.


func _on_margin_container_选择装备栏信号(装备类型: String) -> void:
	# 当切换装备类型的时候 调整筛选的筛选值
	
	# 根据装备类型设置对应的筛选索引
	match 装备类型:
		"武器":
			筛选.select(1) # 武器在OptionButton中的索引
		"护盾":
			筛选.select(2) # 护盾在OptionButton中的索引
		"头盔":
			筛选.select(3) # 头盔在OptionButton中的索引
		"戒指":
			筛选.select(4) # 戒指在OptionButton中的索引
		"衣服":
			筛选.select(5) # 衣服在OptionButton中的索引
		"腰佩":
			筛选.select(6) # 腰佩在OptionButton中的索引
		"鞋子":
			筛选.select(7) # 鞋子在OptionButton中的索引
		"项链":
			筛选.select(8) # 项链在OptionButton中的索引
		_:
			筛选.select(0) # 默认选择全部
	
	# 触发筛选选择事件
	_on_筛选_item_selected(筛选.selected)


func _on_筛选_item_selected(index: int) -> void:
	# 筛选的时候，调整背包展示的物品逻辑
	# 确保背包已经加载完成
	if not 背包:
		return
	
	var filter_type
	match index:
		0: # 全部
			filter_type = "全部"
		1: # 武器
			filter_type = "武器"
		2: # 护盾
			filter_type = "护盾"
		3: # 头盔
			filter_type = "头盔"
		4: # 戒指
			filter_type = "戒指"
		5: # 衣服
			filter_type = "衣服"
		6: # 腰佩
			filter_type = "腰佩"
		7: # 鞋子
			filter_type = "鞋子"
		8: # 项链
			filter_type = "项链"
		_: # 其他类型暂不支持
			filter_type = "其他"
	
	# 设置背包筛选
	背包.set_filter(filter_type)
