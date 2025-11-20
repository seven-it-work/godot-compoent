extends PanelContainer

const ItemScopeUI=preload("uid://da1t82uebiqkk")
const BaseItemScope = preload("res://entity/BaseItem.gd")
const BaseValue = preload("res://components/成长属性组件/基础成长.gd")

@export var 是否可以点击:bool=true
var _选中的ui:ItemScopeUI:get=get_选中的ui
signal 选择装备栏信号(装备类型:String)

func get_选中的ui()->ItemScopeUI:
	return _选中的ui

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
