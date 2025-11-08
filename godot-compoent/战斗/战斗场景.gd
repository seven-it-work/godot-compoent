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
	hSlider.value = 全局配置.get_全局倍速()
	%"倍速".get_node("Label").text="%s倍速"%全局配置.get_全局倍速()
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

func _修仙者行动(baseCultivator: Cultivator.BaseCultivator, team: Cultivator.CultivatorTeam) -> void:
	if not baseCultivator:
		return
	全局配置.set_战斗暂停(true)
	print("修仙者行动:", baseCultivator.get_name_str())
	# 获取当前队伍容器
	var 队伍容器 = _获取队伍容器(team)
	if not 队伍容器:
		Log.error("未找到队伍容器")
		return
	# 获取对手队伍容器
	var 对手队伍容器 = _获取对手队伍容器(team)
	if not 对手队伍容器:
		Log.error("未找到对手队伍容器")
		return
	# 对手队伍中随机选择一个敌人
	var 对手 = 对手队伍容器.get_team().get_valid_members().pick_random() as Cultivator.BaseCultivator
	if not 对手:
		Log.error("对手队伍中没有有效对手")
		return
	# 获取攻击者容器
	var 攻击者容器 = 队伍容器.get_panel_container(baseCultivator)
	if not 攻击者容器:
		Log.error("未找到攻击者容器")
		return
	# 获取目标容器
	var 对手容器 = 对手队伍容器.get_panel_container(对手)
	if not 对手容器:
		Log.error("未找到对手容器")
		return
	# 攻击敌人
	_攻击敌人(攻击者容器, 对手容器)

func _获取队伍容器(team: Cultivator.CultivatorTeam) -> PanelContainer:
	if team == $"PanelContainer/VBoxContainer/玩家队伍面板".get_team():
		return $"PanelContainer/VBoxContainer/玩家队伍面板"
	elif team == $"PanelContainer/VBoxContainer/敌人队伍面板".get_team():
		return $"PanelContainer/VBoxContainer/敌人队伍面板"
	else:
		return null

func _获取对手队伍容器(team: Cultivator.CultivatorTeam) -> PanelContainer:
	if team == $"PanelContainer/VBoxContainer/敌人队伍面板".get_team():
		return $"PanelContainer/VBoxContainer/玩家队伍面板"
	elif team == $"PanelContainer/VBoxContainer/玩家队伍面板".get_team():
		return $"PanelContainer/VBoxContainer/敌人队伍面板"
	else:
		return null

func _攻击敌人(attacker: Control, target: Control) -> void:
	var 攻击者对象=attacker.get_cultivator() as Cultivator.BaseCultivator
	if not 攻击者对象:
		Log.error("未找到攻击者对象")
		return
	var 目标对象=target.get_cultivator() as Cultivator.BaseCultivator
	if not 目标对象:
		Log.error("未找到目标对象")
		return
		
	
	# 计算伤害：攻击力减去防御力，至少造成1点伤害
	var damage = max(1, roundf((攻击者对象.get_attack().get_value() - 目标对象.get_defense().get_value()) * 100) / 100)

	
	# 创建法术动画Label
	var spellLabel = Label.new()
	spellLabel.text = "⚔️攻击"
	spellLabel.add_theme_font_override("font", load("res://font/ark-pixel-16px-proportional-zh_cn.ttf"))
	spellLabel.add_theme_font_size_override("font_size", 24)
	spellLabel.modulate.a = 0.8
	
	# 获取攻击者和目标的全局位置
	var attackerGlobalPos = attacker.get_global_position()
	var targetGlobalPos = target.get_global_position()
	
	# 计算居中位置
	var attackerCenter = Vector2(attackerGlobalPos.x + attacker.size.x / 2, attackerGlobalPos.y + attacker.size.y / 2)
	var targetCenter = Vector2(targetGlobalPos.x + target.size.x / 2, targetGlobalPos.y + target.size.y / 2)
	
	# 添加到当前场景
	add_child(spellLabel)
	# 设置初始位置
	spellLabel.global_position = attackerCenter
	
	# 创建Tween动画
	var tween = create_tween()
	
	# 设置动画：从攻击者位置移动到目标位置
	# 计算动画时长：根据全局倍速在2秒到0.5秒之间线性变化
	# 当倍速为MIN时是2秒，倍速为MAX时是0.5秒
	# 线性映射公式：时长 = maxDuration - (currentSpeed - minSpeed) / (maxSpeed - minSpeed) * (maxDuration - minDuration)
	var animationDuration = 2 - ((全局配置.get_全局倍速() - 全局配置.全局倍速_MIN) / (全局配置.全局倍速_MAX - 全局配置.全局倍速_MIN)) * (2.0 - 0.5)
	
	# 使用Godot 4.x的新Tween API格式
	tween.tween_property(spellLabel, "global_position", targetCenter, animationDuration).from(attackerCenter).set_trans(Tween.TRANS_LINEAR).set_ease(Tween.EASE_IN_OUT)
	
	# 动画结束后清理
	tween.finished.connect(func():
		# 创建被攻击者的抖动动画
		var shakeTween = create_tween()
		# 保存原始位置
		var originalPos = target.global_position
		# 计算抖动动画的单步时长，基于全局倍速进行缩放
		var shakeStepDuration = 0.05 * (全局配置.全局倍速_MAX - 全局配置.get_全局倍速() + 全局配置.全局倍速_MIN) / 全局配置.全局倍速_MAX
		# 创建左右抖动效果，使用多个小位移实现震动感
		shakeTween.tween_property(target, "global_position:x", originalPos.x + 10, shakeStepDuration).from(originalPos.x).set_ease(Tween.EASE_IN_OUT)
		shakeTween.tween_property(target, "global_position:x", originalPos.x - 10, shakeStepDuration).set_ease(Tween.EASE_IN_OUT)
		shakeTween.tween_property(target, "global_position:x", originalPos.x + 8, shakeStepDuration).set_ease(Tween.EASE_IN_OUT)
		shakeTween.tween_property(target, "global_position:x", originalPos.x - 8, shakeStepDuration).set_ease(Tween.EASE_IN_OUT)
		shakeTween.tween_property(target, "global_position:x", originalPos.x + 5, shakeStepDuration).set_ease(Tween.EASE_IN_OUT)
		shakeTween.tween_property(target, "global_position:x", originalPos.x, shakeStepDuration).set_ease(Tween.EASE_IN_OUT)
		
		# 完成后执行伤害计算
		shakeTween.finished.connect(func():
			spellLabel.queue_free()
			# 创建一个伤害的label动画，浮现然后渐渐消失
			var damageTween = create_tween()
			var damageLabel = Label.new()
			damageLabel.text = str(damage)
			damageLabel.add_theme_font_override("font", load("res://font/ark-pixel-16px-proportional-zh_cn.ttf"))
			damageLabel.add_theme_font_size_override("font_size", 24)
			damageLabel.modulate.a = 0.8
			damageLabel.global_position = targetCenter
			add_child(damageLabel)
			# 伤害label动画：从目标位置移动到屏幕中心，同时透明度变化
			damageTween.tween_property(damageLabel, "global_position", targetCenter, animationDuration/2).from(targetCenter).set_trans(Tween.TRANS_LINEAR).set_ease(Tween.EASE_IN_OUT)
			damageTween.tween_property(damageLabel, "modulate:a", 0, animationDuration/2).set_trans(Tween.TRANS_LINEAR).set_ease(Tween.EASE_IN_OUT)
			# 添加战斗日志
			var logText = 攻击者对象.get_name_str() + " 对 " + 目标对象.get_name_str() + " 造成了 " + str(damage) + " 点伤害"
			添加战斗日志("[color=#03A9F4]" + logText + "[/color]")
			damageTween.finished.connect(func():
				damageLabel.queue_free()
			)
			# todo 目标伤害扣除，死亡判断，结束判断
			# 继续战斗流程
			全局配置.set_战斗暂停(false)
		)
	)

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
