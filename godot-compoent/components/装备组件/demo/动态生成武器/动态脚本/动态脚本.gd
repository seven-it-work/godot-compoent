extends Node

func _ready():
	# 步骤1: 读取 JSON（这里假设从字符串或文件）
	var json_str = """
    {
		"func_name": "my_function",
		"func_code": "func my_function(arg):\\n    print(\\"Dynamic call with arg:\\", arg)\\n    return arg * 2"
    }
	"""
	# 或者从文件读取：var file = FileAccess.open("res://dynamic_script.json", FileAccess.READ)
	# var json_str = file.get_as_text()
	
	var json_data = JSON.parse_string(json_str)
	if json_data == null:
		print("JSON 解析失败!")
		return
	
	var func_name = json_data["func_name"]
	var func_code = json_data["func_code"]
	
	# 步骤2: 创建 GDScript 实例
	var dynamic_script = GDScript.new()
	
	# 步骤3: 构建完整的脚本源代码（必须是有效类，通常继承 RefCounted 以便不附加节点）
	var full_source = """
extends RefCounted

%s
""" % func_code  # %s 插入函数代码，确保缩进正确
	
	dynamic_script.source_code = full_source
	
	# 步骤4: 重新加载（编译）脚本
	var reload_error = dynamic_script.reload()
	if reload_error != OK:
		print("脚本编译失败: ", error_string(reload_error))
		return
	
	# 步骤5: 实例化脚本对象
	var script_instance = dynamic_script.new()
	
	# 步骤6: 调用函数（使用 callable）
	if script_instance.has_method(func_name):
		var callable_func = Callable(script_instance, func_name)
		var result = callable_func.call(5)  # 传入参数 5
		print("动态函数返回: ", result)  # 输出: Dynamic call with arg:5 \n 10
	else:
		print("函数不存在: ", func_name)
