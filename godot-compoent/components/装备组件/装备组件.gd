extends PanelContainer

const ItemScopeUI=preload("uid://da1t82uebiqkk")
const BaseItemScope = preload("res://entity/BaseItem.gd")
const BaseValue = preload("res://components/成长属性组件/基础成长.gd")
const CultivatorEquipment = preload("res://entity/修仙者的装备.gd")

var _cultivator_equipment:CultivatorEquipment.CultivatorEquipment:get=get_cultivator_equipment,set=set_cultivator_equipment

@export var 是否可以点击:bool=true
var _选中的ui:ItemScopeUI:get=get_选中的ui


signal 选择装备栏信号(装备类型:String)


func _ready() -> void:
	_cultivator_equipment=CultivatorEquipment.CultivatorEquipment.new()
	pass
#region get/set
func get_cultivator_equipment()->CultivatorEquipment.CultivatorEquipment:
	return _cultivator_equipment
func set_cultivator_equipment(装备:CultivatorEquipment.CultivatorEquipment):
	_cultivator_equipment=装备
	if is_node_ready():
		_更新装备ui()
		# 信号绑定
		_cultivator_equipment.装备变更.connect(_装备变更)
func get_选中的ui()->ItemScopeUI:
	return _选中的ui
#endregion

func _装备变更(装备类型:String,_old_装备:BaseItemScope.BaseItem,new_装备:BaseItemScope.BaseItem):
	if 装备类型=="武器":
		%武器.set_base_item(new_装备)
	elif 装备类型=="护盾":
		%护盾.set_base_item(new_装备)
	elif 装备类型=="头盔":
		%头盔.set_base_item(new_装备)
	elif 装备类型=="戒指":
		%戒指.set_base_item(new_装备)
	elif 装备类型=="衣服":
		%衣服.set_base_item(new_装备)
	elif 装备类型=="腰佩":
		%腰佩.set_base_item(new_装备)
	elif 装备类型=="鞋子":
		%鞋子.set_base_item(new_装备)
	elif 装备类型=="项链":
		%项链.set_base_item(new_装备)
	pass
	
func _更新装备ui():
	if not is_node_ready():
		return
	if %武器:
		%武器.set_base_item(_cultivator_equipment._武器)
	if %护盾:
		%护盾.set_base_item(_cultivator_equipment._护盾)
	if %头盔:
		%头盔.set_base_item(_cultivator_equipment._头盔)
	if %戒指:
		%戒指.set_base_item(_cultivator_equipment._戒指)
	if %衣服:
		%衣服.set_base_item(_cultivator_equipment._衣服)
	if %腰佩:
		%腰佩.set_base_item(_cultivator_equipment._腰佩)
	if %鞋子:
		%鞋子.set_base_item(_cultivator_equipment._鞋子)
	if %项链:
		%项链.set_base_item(_cultivator_equipment._项链)

func _on_护盾_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item,"护盾")


func _on_头盔_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item,"头盔")


func _on_戒指_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item,"戒指")


func _on_衣服_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item,"衣服")


func _on_腰佩_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item,"腰佩")


func _on_鞋子_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item,"鞋子")


func _on_项链_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item,"项链")


func _on_武器_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item,"武器")


func _on_item_click(compartment:ItemScopeUI, item:BaseItemScope.BaseItem,key:String):
	if not 是否可以点击:
		return
	if compartment==_选中的ui:
		_选中的ui.change_style("默认")
		_选中的ui=null
		选择装备栏信号.emit("全部")
		return
	if _选中的ui:
		_选中的ui.change_style("默认")
	_选中的ui=compartment
	_选中的ui.change_style("选中")
	if item:
		选择装备栏信号.emit(item.get_类型())
	else:
		选择装备栏信号.emit(key)
