extends PanelContainer

const ItemScopeUI=preload("uid://da1t82uebiqkk")
const BaseItemScope = preload("res://entity/BaseItem.gd")
const BaseValue = preload("res://components/成长属性组件/基础成长.gd")

@export var 是否可以点击:bool=true
var _选中的ui:ItemScopeUI


func _on_护盾_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item)


func _on_头盔_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item)


func _on_戒子_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item)


func _on_衣服_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item)


func _on_腰佩_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item)


func _on_鞋子_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item)


func _on_项链_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item)


func _on_武器_clicked(compartment:ItemScopeUI, item:BaseItemScope.BaseItem) -> void:
	_on_item_click(compartment,item)


func _on_item_click(compartment:ItemScopeUI, item:BaseItemScope.BaseItem):
	if compartment==_选中的ui:
		_选中的ui.change_style("默认")
		_选中的ui=null
		return
	if _选中的ui:
		_选中的ui.change_style("默认")
	_选中的ui=compartment
	_选中的ui.change_style("选中")
	pass
