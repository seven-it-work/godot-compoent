extends Control

# 导入必要的类
var Cultivator = load("res://战斗/entity/修仙者.gd")
var _敌人队伍: Cultivator.CultivatorTeam = null
var _玩家队伍: Cultivator.CultivatorTeam = null
var _战斗状态 = "准备"
var _战斗回合 = 0
var _战斗日志 = []

# 战斗状态枚举
const BATTLE_STATE_READY = "准备"
const BATTLE_STATE_FIGHTING = "战斗中"
const BATTLE_STATE_WIN = "胜利"
const BATTLE_STATE_LOSE = "失败"
const BATTLE_STATE_ESCAPE = "逃跑"

# 初始化计时器
var _战斗计时器 = 0.0
var _回合间隔 = 2.0

func _ready() -> void:
	# 初始化UI
	var hSlider = %"倍速".get_node("HSlider") as HSlider
	hSlider.max_value = 5.0  # 最大5倍速
	hSlider.min_value = 0.5  # 最小0.5倍速
	hSlider.value = 1.0
	%"自动战斗".button_pressed = false
	
	# 初始状态为准备中，等待外部传入队伍数据

func _process(delta: float) -> void:
	# 如果战斗已结束，禁用自动战斗按钮
	if _战斗状态 != BATTLE_STATE_FIGHTING:
		%"自动战斗".disabled = true
		return

	# 应用倍速
	var speed = %"倍速".get_node("HSlider").value
	var adjusted_delta = delta * speed
	
	# 自动战斗模式
	if %"自动战斗".button_pressed:
		_战斗计时器 += adjusted_delta
		if _战斗计时器 >= _回合间隔:
			_战斗计时器 = 0
			执行战斗回合()

# 设置敌人队伍
func set_enemy_team(team: Cultivator.CultivatorTeam) -> void:
	_敌人队伍 = team
	# 更新UI显示
	更新队伍UI显示($"PanelContainer/VBoxContainer/敌人队伍面板/GridContainer", team)

# 设置玩家队伍
func set_player_team(team: Cultivator.CultivatorTeam) -> void:
	_玩家队伍 = team
	# 更新UI显示
	更新队伍UI显示($"PanelContainer/VBoxContainer/玩家队伍面板/GridContainer", team)

# 开始战斗
func start_battle() -> void:
	if _敌人队伍 and _玩家队伍:
		_战斗状态 = BATTLE_STATE_FIGHTING
		添加战斗日志("战斗开始！准备迎战敌人！")

# 更新队伍UI显示
func 更新队伍UI显示(container: GridContainer, team: Cultivator.CultivatorTeam) -> void:
	if not container or not team:
		return
	
	# 获取队伍成员数组
	var members = team.get_members()
	var childIndex = 0
	
	# 遍历3x3网格
	for i in 3:
		for j in 3:
			# 检查是否有足够的子节点
			if childIndex < container.get_child_count():
				var panel = container.get_child(childIndex)
				var member = members[i][j] if i < members.size() and j < members[i].size() else null
				
				if member:
					更新战斗人员UI(panel, member)
					panel.visible = true
				else:
					# 如果位置为空，隐藏面板
					panel.visible = false
				
			childIndex += 1

func 更新战斗人员UI(panel: PanelContainer, cultivator: Cultivator.BaseCultivator) -> void:
	if not panel or not cultivator:
		return

	# 更新名称
	var nameValue = panel.get_node("VBoxContainer/名称/Value")
	if nameValue:
		nameValue.text = cultivator.get_name()

	# 更新境界
	var levelValue = panel.get_node("VBoxContainer/境界/Value")
	if levelValue:
		levelValue.text = "练气期" + str(cultivator.get_level().get_value()) + "层"

	# 更新生命值
	var healthNode = panel.get_node("VBoxContainer/生命值")
	if healthNode and healthNode.has_method("set_value"):
		var health = cultivator.get_health()
		healthNode.set_value(health.get_value(), health.get_max())

	# 更新灵气值
	var manaNode = panel.get_node("VBoxContainer/灵气值")
	if manaNode and manaNode.has_method("set_value"):
		var mana = cultivator.get_mana()
		manaNode.set_value(mana.get_value(), mana.get_max())

func 执行战斗回合() -> void:
	_战斗回合 += 1
	var roundText = "第" + str(_战斗回合) + "回合开始"
	_战斗日志.append(roundText)
	添加战斗日志("[color=#4CAF50]" + roundText + "[/color]")

	# 玩家攻击（遍历3x3网格）
	var playerMembers = _玩家队伍.get_members()
	for i in 3:
		for j in 3:
			var player = playerMembers[i][j] if i < playerMembers.size() and j < playerMembers[i].size() else null
			if 玩家是否存活(player):
				var target = 选择敌人目标()
				if target:
					攻击敌人(player, target)

	# 检查战斗是否结束
	if not 敌人队伍是否存活():
		_战斗状态 = BATTLE_STATE_WIN
		_战斗日志.append("战斗胜利！")
		添加战斗日志("[color=#00FF00]战斗胜利！[/color]")
		return

	# 敌人攻击（遍历3x3网格）
	var enemyMembers = _敌人队伍.get_members()
	for i in 3:
		for j in 3:
			var enemy = enemyMembers[i][j] if i < enemyMembers.size() and j < enemyMembers[i].size() else null
			if 玩家是否存活(enemy):
				var target = 选择玩家目标()
				if target:
					攻击玩家(enemy, target)

	# 检查战斗是否结束
	if not 玩家队伍是否存活():
		_战斗状态 = BATTLE_STATE_LOSE
		_战斗日志.append("战斗失败！")
		添加战斗日志("[color=#FF0000]战斗失败！[/color]")

func 选择敌人目标() -> Cultivator:
	var enemyMembers = _敌人队伍.get_members()
	for i in 3:
		for j in 3:
			var enemy = enemyMembers[i][j] if i < enemyMembers.size() and j < enemyMembers[i].size() else null
			if 玩家是否存活(enemy):
				return enemy
	return null

func 选择玩家目标() -> Cultivator:
	var playerMembers = _玩家队伍.get_members()
	for i in 3:
		for j in 3:
			var player = playerMembers[i][j] if i < playerMembers.size() and j < playerMembers[i].size() else null
			if 玩家是否存活(player):
				return player
	return null

func 攻击敌人(attacker: Cultivator.BaseCultivator, target: Cultivator.BaseCultivator) -> void:
	var attackValue = attacker.get_attack().get_value()
	var defenseValue = target.get_defense().get_value()
	var damage = max(1, attackValue - defenseValue / 2)
	
	var targetHealth = target.get_health()
	targetHealth.set_value(max(0, targetHealth.get_value() - damage))
	
	var logText = attacker.get_name() + " 攻击了 " + target.get_name() + "，造成了 " + str(damage) + " 点伤害"
	_战斗日志.append(logText)
	添加战斗日志("[color=#03A9F4]" + logText + "[/color]")
	
	# 找到目标在网格中的位置并更新UI
	update_target_ui(_敌人队伍, target, $"PanelContainer/VBoxContainer/敌人队伍面板/GridContainer")
	
	# 检查目标是否死亡
	if targetHealth.get_value() <= 0:
		var deathText = target.get_name() + " 被击败了！"
		_战斗日志.append(deathText)
		添加战斗日志("[color=#FF9800]" + deathText + "[/color]")

func 攻击玩家(attacker: Cultivator.BaseCultivator, target: Cultivator.BaseCultivator) -> void:
	var attackValue = attacker.get_attack().get_value()
	var defenseValue = target.get_defense().get_value()
	var damage = max(1, attackValue - defenseValue / 2)
	
	var targetHealth = target.get_health()
	targetHealth.set_value(max(0, targetHealth.get_value() - damage))
	
	var logText = attacker.get_name() + " 攻击了 " + target.get_name() + "，造成了 " + str(damage) + " 点伤害"
	_战斗日志.append(logText)
	添加战斗日志("[color=#E91E63]" + logText + "[/color]")
	
	# 找到目标在网格中的位置并更新UI
	update_target_ui(_玩家队伍, target, $"PanelContainer/VBoxContainer/玩家队伍面板/GridContainer")
	
	# 检查目标是否死亡
	if targetHealth.get_value() <= 0:
		var deathText = target.get_name() + " 被击败了！"
		_战斗日志.append(deathText)
		添加战斗日志("[color=#9C27B0]" + deathText + "[/color]")

# 更新目标UI
func update_target_ui(team: Cultivator.CultivatorTeam, target: Cultivator.BaseCultivator, container: GridContainer) -> void:
	var members = team.get_members()
	var index = 0
	
	for i in 3:
		for j in 3:
			var member = members[i][j] if i < members.size() and j < members[i].size() else null
			if member == target:
				if index < container.get_child_count():
					var panel = container.get_child(index)
					更新战斗人员UI(panel, target)
					return
			index += 1

func 玩家是否存活(cultivator: Cultivator.BaseCultivator) -> bool:
	return cultivator and cultivator.get_health().get_value() > 0

func 敌人队伍是否存活() -> bool:
	var enemyMembers = _敌人队伍.get_members()
	for i in 3:
		for j in 3:
			var enemy = enemyMembers[i][j] if i < enemyMembers.size() and j < enemyMembers[i].size() else null
			if 玩家是否存活(enemy):
				return true
	return false

func 玩家队伍是否存活() -> bool:
	var playerMembers = _玩家队伍.get_members()
	for i in 3:
		for j in 3:
			var player = playerMembers[i][j] if i < playerMembers.size() and j < playerMembers[i].size() else null
			if 玩家是否存活(player):
				return true
	return false

func _on_自动战斗_toggled(toggled_on: bool) -> void:
	pass

func _on_h_slider_value_changed(value: float) -> void:
	# 更新倍速显示文本，保留一位小数
	var displayValue = round(value * 10) / 10
	%"倍速".get_node("Label").text = "%s倍速" % displayValue

func _on_逃跑_pressed() -> void:
	_战斗状态 = BATTLE_STATE_ESCAPE
	_战斗日志.append("战斗逃跑！")
	添加战斗日志("[color=#607D8B]战斗逃跑！[/color]")
	print("已逃跑")

func 添加战斗日志(text: String) -> void:
	# 获取日志文本控件
	var logLabel = $PanelContainer/VBoxContainer/战斗日志/ScrollContainer/日志文本 as RichTextLabel
	if logLabel:
		# 添加新的日志行
		logLabel.append_text(text + "\n")
		# 自动滚动到底部
		logLabel.scroll_to_line(logLabel.get_line_count())
