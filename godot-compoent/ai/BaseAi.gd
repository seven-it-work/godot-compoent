## 角色词
class RoleWords:
	var _role_words:String=""
	func _init(role_words:String) -> void:
		_role_words=role_words
	
	# 公共getter方法，用于安全地访问角色词内容
	func get_role_words() -> String:
		return _role_words
