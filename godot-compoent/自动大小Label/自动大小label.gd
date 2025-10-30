extends Label

@export var min_size: int = 8
@export var max_size: int = 72

# 保存原始的文本对齐方式
var original_align: int

func _ready() -> void:
	# 初始化默认值
	if min_size == 0:
		min_size = 8
	if max_size == 0:
		max_size = 72
	
	# 保存原始对齐方式
	original_align = horizontal_alignment
	
	# 初始调整字体大小
	adjust_font_size()
	
	# 在Godot 4.0+中使用正确的信号
	resized.connect(adjust_font_size)

func adjust_font_size() -> void:
	# 如果没有文本或尺寸无效，直接返回
	if text.is_empty() or size.x <= 0 or size.y <= 0:
		return
	
	# 确保min_size <= max_size
	if min_size > max_size:
		var temp = min_size
		min_size = max_size
		max_size = temp
	
	# 使用二分法查找合适的字体大小
	var low := min_size
	var high := max_size
	var best_size := min_size
	
	# 获取当前使用的字体
	var font = get_theme_font("font")
	if font == null:
		return
	
	# 临时设置为左对齐以便准确测量
	var current_alignment = horizontal_alignment
	horizontal_alignment = HORIZONTAL_ALIGNMENT_LEFT
	
	# 二分查找过程
	while low <= high:
		# 使用整除法确保mid是整数
		var mid := int((low + high) / 2)
		
		# 计算文本大小
		var text_size := font.get_string_size(text, mid)
		
		# 检查文本是否适合当前大小（留出一些边距）
		var margin := 4  # 边距
		if text_size.x <= size.x - margin * 2 and text_size.y <= size.y - margin * 2:
			# 文本适合，尝试更大的字体
			best_size = mid
			low = mid + 1  # 关键步骤：移动左边界，继续查找更大的合适字体
		else:
			# 文本太大，尝试更小的字体
			high = mid - 1
	
	# 应用找到的最佳字体大小
	add_theme_font_size_override("font_size", best_size)
	
	# 恢复原始对齐方式
	horizontal_alignment = current_alignment

# 重写Label类的_text_changed虚函数，当文本变化时会被引擎调用
func _text_changed() -> void:
	# 调整字体大小
	adjust_font_size()
