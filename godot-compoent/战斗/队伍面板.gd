extends PanelContainer
class_name TeamPanelContainer

# 队伍数据
var _team: Cultivator.CultivatorTeam = null: set = set_team
signal 修仙者行动(行动修仙者:Cultivator.BaseCultivator,所在队伍:Cultivator.CultivatorTeam)

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
	if index >= 0 and index < $GridContainer.get_child_count():
		var panel = $GridContainer.get_child(index)
		if panel and panel.has_method("set_cultivator"):
			panel.set_cultivator(cultivator)
			# 绑定行动信号
			if panel.冷却完成.is_connected(_on_panel_cultivator_action):
				pass
			else:
				panel.冷却完成.connect(_on_panel_cultivator_action.bind(cultivator))

# 处理面板修仙者行动信号
func _on_panel_cultivator_action(行动修仙者:Cultivator.BaseCultivator) -> void:
	修仙者行动.emit(行动修仙者, _team)
	
# 设置队伍
func set_team(team: Cultivator.CultivatorTeam) -> void:
	_team = team
	if _team:
		_update_all_panels()
		if _team.team_member_changed.is_connected(_update_all_panels):
			pass
		else:
			_team.team_member_changed.connect(_update_all_panels)

# 获取队伍
func get_team() -> Cultivator.CultivatorTeam:
	return _team

## 获取有效的BattleCultivatorPanelContainer
func get_valid_battle_panel_container() -> Array[BattleCultivatorPanelContainer]:
	var result:Array[BattleCultivatorPanelContainer] = []
	if not _team:
		return result
	for i in $GridContainer.get_children():
		if i and i.has_method("get_cultivator"):
			var cultivator = i.get_cultivator()
			if cultivator and cultivator.is_alive():
				result.append(i)
	return result

# 获取修仙者所在的容器
func get_panel_container(cultivator: Cultivator.BaseCultivator) -> PanelContainer:
	if not _team:
		return null
	for i in $GridContainer.get_children():
		if i and i.has_method("get_cultivator") and i.get_cultivator() == cultivator:
			return i
	return null
