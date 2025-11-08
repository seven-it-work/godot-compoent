extends PanelContainer

# 队伍数据
var _team: Cultivator.CultivatorTeam = null: set = set_team
signal 修仙者行动(行动修仙者:Cultivator.BaseCultivator)

func _ready() -> void:
	# 初始化UI
	_update_all_panels()


# 更新所有面板
func _update_all_panels() -> void:
	if not _team:
		return
	
	for i in range(9):
		var row: int = i / 3
		var col: int = i % 3
		var cultivator = _team.get_member(row, col)
		_set_panel_cultivator(i, cultivator)

# 设置指定位置的面板修仙者
func _set_panel_cultivator(index: int, cultivator: Cultivator.BaseCultivator) -> void:
	if index >= 0 and index < $GridContainer.size():
		var panel = $GridContainer.get_child(index)
		if panel and panel.has_method("set_cultivator"):
			panel.set_cultivator(cultivator)
			# 绑定行动信号
			if panel.修仙者行动.is_connected(_on_panel_cultivator_action):
				pass
			else:
				panel.修仙者行动.connect(_on_panel_cultivator_action)

# 处理面板修仙者行动信号
func _on_panel_cultivator_action(行动修仙者:Cultivator.BaseCultivator) -> void:
	修仙者行动.emit(行动修仙者)

# 设置队伍
func set_team(team: Cultivator.CultivatorTeam) -> void:
	_team = team
	if _team:
		_update_all_panels()
		_team.队伍更新.connect(_update_all_panels)

# 获取队伍
func get_team() -> Cultivator.CultivatorTeam:
	return _team
