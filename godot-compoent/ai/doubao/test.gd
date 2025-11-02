extends Control


func _ready() -> void:
	var ai_dou_bao=AiDouBao.new()
	add_child(ai_dou_bao)
	var msg=await ai_dou_bao.获取ai消息("你好")
	Log.info("豆包msg:"+msg)
