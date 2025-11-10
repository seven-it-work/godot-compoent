extends LogStream

##A default instance of the LogStream. Instanced as the main log singelton.

static var logTextRich:LogTextRich=preload("res://addons/logger/LogTextRich.tscn").instantiate()
func _init():
	super("Main")

func _ready() -> void:
	add_child(logTextRich)
	pass
