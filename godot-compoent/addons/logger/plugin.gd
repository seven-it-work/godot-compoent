@tool
extends EditorPlugin



func _enable_plugin():
	#make sure log-stream is loaded to prevent godot error.
	preload("uid://uu7kwwfcv6pi")
	add_autoload_singleton("Log", "res://addons/logger/logger.gd")
	tree_exiting.connect(_LogInternalPrinter._cleanup)


func _disable_plugin():
	remove_autoload_singleton("Log")
	_LogInternalPrinter._cleanup()
