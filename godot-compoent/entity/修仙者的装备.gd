const BaseItemClass = preload("res://entity/BaseItem.gd")
class CultivatorEquipment:
	var _武器:BaseItemClass.WeaponItem:get=get_武器,set=set_武器;
	var _护盾:BaseItemClass.ShieldItem:get=get_护盾,set=set_护盾;
	var _头盔:BaseItemClass.HelmetItem:get=get_头盔,set=set_头盔;
	var _戒指:BaseItemClass.RingItem:get=get_戒指,set=set_戒指;
	var _衣服:BaseItemClass.ArmorItem:get=get_衣服,set=set_衣服;
	var _腰佩:BaseItemClass.BeltItem:get=get_腰佩,set=set_腰佩;
	var _鞋子:BaseItemClass.BootsItem:get=get_鞋子,set=set_鞋子;
	var _项链:BaseItemClass.NecklaceItem:get=get_项链,set=set_项链;
	signal 装备变更(装备类型:String,old_装备:BaseItemClass,new_装备:BaseItemClass)

	func 装备装备(装备:BaseItemClass.BaseItem,装备类型:String=''):
		if 装备类型=="" || 装备类型==null:
			# 通过 装备 的类来判断
			if 装备 is BaseItemClass.WeaponItem:
				装备类型="武器"
			elif 装备 is BaseItemClass.ShieldItem:
				装备类型="护盾"
			elif 装备 is BaseItemClass.HelmetItem:
				装备类型="头盔"
			elif 装备 is BaseItemClass.RingItem:
				装备类型="戒指"
			elif 装备 is BaseItemClass.ArmorItem:
				装备类型="衣服"
			elif 装备 is BaseItemClass.BeltItem:
				装备类型="腰佩"
			elif 装备 is BaseItemClass.BootsItem:
				装备类型="鞋子"
			elif 装备 is BaseItemClass.NecklaceItem:
				装备类型="项链"
		if 装备类型=="武器":
			_武器=装备
		elif 装备类型=="护盾":
			_护盾=装备
		elif 装备类型=="头盔":
			_头盔=装备
		elif 装备类型=="戒指":
			_戒指=装备
		elif 装备类型=="衣服":
			_衣服=装备
		elif 装备类型=="腰佩":
			_腰佩=装备
		elif 装备类型=="鞋子":
			_鞋子=装备
		elif 装备类型=="项链":
			_项链=装备
		pass
	#region get/set
	func get_武器()->BaseItemClass.WeaponItem:
		return _武器
	func set_武器(武器:BaseItemClass.WeaponItem):
		装备变更.emit("武器",_武器,武器)
		_武器 = 武器
	func get_护盾()->BaseItemClass.ShieldItem:
		return _护盾
	func set_护盾(护盾:BaseItemClass.ShieldItem):
		装备变更.emit("护盾",_护盾,护盾)
		_护盾 = 护盾
	func get_头盔()->BaseItemClass.HelmetItem:
		return _头盔
	func set_头盔(头盔:BaseItemClass.HelmetItem):
		装备变更.emit("头盔",_头盔,头盔)
		_头盔 = 头盔
	func get_戒指()->BaseItemClass.RingItem:
		return _戒指
	func set_戒指(戒指:BaseItemClass.RingItem):
		装备变更.emit("戒指",_戒指,戒指)
		_戒指 = 戒指
	func get_衣服()->BaseItemClass.ArmorItem:
		return _衣服
	func set_衣服(衣服:BaseItemClass.ArmorItem):
		装备变更.emit("衣服",_衣服,衣服)
		_衣服 = 衣服
	func get_腰佩()->BaseItemClass.BeltItem:
		return _腰佩
	func set_腰佩(腰佩:BaseItemClass.BeltItem):
		装备变更.emit("腰佩",_腰佩,腰佩)
		_腰佩 = 腰佩
	func get_鞋子()->BaseItemClass.BootsItem:
		return _鞋子
	func set_鞋子(鞋子:BaseItemClass.BootsItem):
		装备变更.emit("鞋子",_鞋子,鞋子)
		_鞋子 = 鞋子
	func get_项链()->BaseItemClass.NecklaceItem:
		return _项链
	func set_项链(项链:BaseItemClass.NecklaceItem):
		装备变更.emit("项链",_项链,项链)
		_项链 = 项链
	#endregion
