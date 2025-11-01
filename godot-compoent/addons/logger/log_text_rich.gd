extends Control
class_name LogTextRich

var log_text:String="":set=set_log_text
var long_press_timer: Timer
var is_pressed: bool = false
const LONG_PRESS_THRESHOLD: float = 0.5  # 长按阈值（秒）

func set_log_text(new_value):
	log_text=new_value
	if is_node_ready():
		call_deferred("_set_text")

func _set_text():
	%RichTextLabel.text=log_text

func _ready() -> void:
	_set_text()
	# 创建定时器
	long_press_timer = Timer.new()
	long_press_timer.one_shot = true  # 只触发一次
	long_press_timer.timeout.connect(_on_long_press_timeout)
	add_child(long_press_timer)


func _process(delta: float) -> void:
	if $Show and $Show.visible:
		# 将%close按钮定位到$Show容器的右上角
		if %Close:
			%Close.position = Vector2($Show.get_rect().size.x - %Close.get_rect().size.x, 0)
	if 开始拖拽:
		if Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT):
			self.position=get_global_mouse_position() + 拖拽偏移位置
		else:
			$"悬浮窗口/Label".hide()
			开始拖拽=false


func _on_close_pressed() -> void:
	$"悬浮窗口".show()
	$Show.hide()


func _on_悬浮窗口_gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			# 鼠标按下：启动定时器，标记按下状态
			is_pressed = true
			long_press_timer.start(LONG_PRESS_THRESHOLD)
			print("Mouse pressed at: ", event.position)
		else:
			# 鼠标释放：检查是否长按已触发
			if is_pressed:
				is_pressed = false
				if long_press_timer.is_stopped():
					# 定时器已停止（长按已触发），不处理单击
					pass
				else:
					# 定时器还在运行：视为单击
					long_press_timer.stop()
					_on_click_事件()

func _on_click_事件():
	$"悬浮窗口".hide()
	$Show.show()
	
var 开始拖拽:bool=false
var 拖拽偏移位置:Vector2

func _on_long_press_timeout():
	if is_pressed:
		$"悬浮窗口/Label".show()
		拖拽偏移位置=self.global_position-get_global_mouse_position() 
		开始拖拽=true
		# 这里可以添加长按逻辑，例如拖拽或菜单弹出
