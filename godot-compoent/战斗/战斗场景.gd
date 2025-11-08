extends Control

# 导入必要的类
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
	hSlider.max_value = 全局配置.全局倍速_MAX
	hSlider.min_value = 全局配置.全局倍速_MIN
	hSlider.value = 全局配置.get_全局倍速()
	%"自动战斗".button_pressed = false


func _process(delta: float) -> void:
	# 如果战斗已结束，禁用自动战斗按钮
	if _战斗状态 != BATTLE_STATE_FIGHTING:
		%"自动战斗".disabled = true
		return
	%"自动战斗".disabled = false
	# 应用倍速
	var speed = %"倍速".get_node("HSlider").value
	var adjusted_delta = delta * speed
	
	# 自动战斗模式
	if %"自动战斗".button_pressed:
		_战斗计时器 += adjusted_delta
		if _战斗计时器 >= _回合间隔:
			_战斗计时器 = 0

func 开始战斗(敌人队伍: Cultivator.CultivatorTeam, 玩家队伍: Cultivator.CultivatorTeam) -> void:
	_敌人队伍 = 敌人队伍
	# 更新UI显示
	更新队伍UI显示($"PanelContainer/VBoxContainer/敌人队伍面板", 敌人队伍)
	
	_玩家队伍 = 玩家队伍
	# 更新UI显示
	更新队伍UI显示($"PanelContainer/VBoxContainer/玩家队伍面板", 玩家队伍)
	
	if _敌人队伍 and _玩家队伍:
		_战斗状态 = BATTLE_STATE_FIGHTING
		添加战斗日志("战斗开始！准备迎战敌人！")
	else:
		# 进行结算
		pass

# 更新队伍UI显示
func 更新队伍UI显示(container: Control, team: Cultivator.CultivatorTeam) -> void:
	if not container or not team:
		return
	if container.has_method("set_team"):
		container.set_team(team)
		container.修仙者行动.connect(_修仙者行动)
	else:
		Log.error("容器没有set_team方法")

func _修仙者行动(baseCultivator: Cultivator.BaseCultivator) -> void:
	if not baseCultivator:
		return
	全局配置.set_战斗暂停(true)
	print("修仙者行动:", baseCultivator.get_name_str())
	// todo 完成行动的逻辑
	pass

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
	
	# 检查目标是否死亡
	if targetHealth.get_value() <= 0:
		var deathText = target.get_name() + " 被击败了！"
		_战斗日志.append(deathText)
		添加战斗日志("[color=#9C27B0]" + deathText + "[/color]")


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
	全局配置.set_是否自动战斗(toggled_on)

func _on_h_slider_value_changed(value: float) -> void:
	%"倍速".get_node("Label").text = "%s倍速" % value
	全局配置.set_全局倍速(value)

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
