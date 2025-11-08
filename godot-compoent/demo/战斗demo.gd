extends Control

# 导入修仙者类
var Cultivator = load("res://战斗/entity/修仙者.gd")

func _ready() -> void:
	# 连接按钮信号
	$"初始化队伍按钮".pressed.connect(初始化战斗)

func 初始化战斗() -> void:
	# 初始化敌人队伍（3x3网格）
	var enemyTeam = Cultivator.CultivatorTeam.new()
	
	# 在指定位置放置敌人，其他位置为null
	# 第一行放置3个敌人
	for j in 3:
		# 直接使用BaseCultivator作为修仙者对象
		var enemy = Cultivator.BaseCultivator.new()
		enemy.set_name("敌人" + str(j+1))
		# 直接使用默认属性值，不设置额外的成长属性
		enemyTeam.上阵(enemy, 0, j)
	
	# 第二行和第三行保持null（不上阵角色）
	
	# 初始化玩家队伍（3x3网格）
	var playerTeam = Cultivator.CultivatorTeam.new()
	
	# 在指定位置放置玩家，其他位置为null
	# 第一行放置3个玩家
	for j in 3:
		# 直接使用BaseCultivator作为修仙者对象
		var player = Cultivator.BaseCultivator.new()
		player.set_name("修仙者" + str(j+1))
		# 直接使用默认属性值，不设置额外的成长属性
		playerTeam.上阵(player, 0, j)
	
	# 将队伍传递给战斗场景
	var battleScene = $"战斗场景"
	battleScene.set_enemy_team(enemyTeam)
	battleScene.set_player_team(playerTeam)
	
	# 开始战斗
	battleScene.start_battle()
