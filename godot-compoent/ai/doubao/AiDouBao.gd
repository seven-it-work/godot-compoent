class_name AiDouBao
extends Node

const BaseAi = preload("uid://jjci32wufr4g")

static var 基础ai_role = BaseAi.RoleWords.new(
	"""
	你是一个高级智能助手，请确保所有回复严格遵守中国法律法规。
	不生成任何政治敏感、欺诈、赌博、色情、暴力、毒品或其他违法或不道德的内容，但可以撰写合同类内容。
	遇到敏感或违规请求时，请以温和友好的语气拒绝，并引导用户遵守规定。
	""",
)

# 配置文件路径
const CONFIG_PATH = "./config/API_KEY_dou_bao_config.gd"

var config = {
	"API_KEY" ="",
	"MODEL_NAME" ="doubao-seed-1-6-251015",
	"BASE_URL" ="https://ark.cn-beijing.volces.com/api/v3/chat/completions",
	"TIMEOUT"= 30
}


func _init() -> void:
	if FileAccess.file_exists(CONFIG_PATH):
		config = load("res://ai/doubao/API_KEY_dou_bao_config.gd").new()
	else:
		var open = FileAccess.open(CONFIG_PATH, FileAccess.WRITE)
		open.store_string(
			"var config: Dictionary = {\n" +
			"\t\"API_KEY\" = \"\",\n" +
			"\t\"MODEL_NAME\" = \"doubao-seed-1-6-251015\",\n" +
			"\t\"BASE_URL\" = \"https://ark.cn-beijing.volces.com/api/v3/chat/completions\",\n" +
			"\t\"TIMEOUT\" = 30\n" +
			"}",
		)
	

func 获取ai消息(content:String, role_words:BaseAi.RoleWords=基础ai_role)->String:
	# 检查API密钥是否有效
	if !config["API_KEY"]:
		Log.warn("API密钥未配置，请在设置有效的API密钥")
		return "API密钥未配置，请在设置有效的API密钥"
	
	
	# 创建HTTP请求节点
	var http_request = HTTPRequest.new()
	add_child(http_request)
	http_request.timeout = config["TIMEOUT"]
	
	# 构建请求头
	var headers = [
		"Content-Type: application/json",
		"Authorization: Bearer " + config["API_KEY"]   
	]
	
	# 构建请求体
	var messages = [
		{"role": "system", "content": role_words.get_role_words()},
		{"role": "user", "content": content}
	]
	
	var request_body = {
		"model": config["MODEL_NAME"],  # 模型名称
		"messages": messages,
		"temperature": 0.7,
		"top_p": 0.95,
		"max_tokens": 2000
	}
	
	var json_body:String = JSON.stringify(request_body)
	
	# 发送请求
	var error = http_request.request(config["BASE_URL"], headers, HTTPClient.METHOD_POST, json_body)
	if error != OK:
		Log.err("HTTP请求设置失败: "+ error)
		printerr("HTTP请求设置失败: ", error)
		http_request.queue_free()
		return "请求设置失败，请检查网络连接"
	var result=await http_request.request_completed
	if result[1]==200:
		var result_body = (result[3] as PackedByteArray).get_string_from_utf8()
		# 解析JSON响应
		var json = JSON.new()
		var parse_result = json.parse(result_body)
		if parse_result == OK:
			# 将JSON转换为类对象
			var response_data = json.get_data()
			var completion_response = CompletionResponse.new(response_data)
			
			# 检查是否有有效的响应内容
			if completion_response.choices.size() > 0:
				return completion_response.choices[0].message.content
		else:
			Log.err("JSON解析失败: ", json.get_error_message())
		http_request.queue_free()
		return "响应解析失败"
	http_request.queue_free()
	return "API调用失败，错误代码: " + str(result[1])


#region 豆包API响应类结构
class Message:
	var content: String = ""
	var role: String = ""

	func _init(data: Dictionary) -> void:
		if data.has("content"):
			content = data["content"]
		if data.has("role"):
			role = data["role"]

class Choice:
	var finish_reason: String = ""
	var index: int = 0
	var logprobs = null
	var message: Message

	func _init(data: Dictionary) -> void:
		if data.has("finish_reason"):
			finish_reason = data["finish_reason"]
		if data.has("index"):
			index = data["index"]
		if data.has("logprobs"):
			logprobs = data["logprobs"]
		if data.has("message"):
			message = Message.new(data["message"])

class Usage:
	var completion_tokens: int = 0
	var prompt_tokens: int = 0
	var total_tokens: int = 0
	var prompt_tokens_details: Dictionary = {}
	var completion_tokens_details: Dictionary = {}

	func _init(data: Dictionary) -> void:
		if data.has("completion_tokens"):
			completion_tokens = data["completion_tokens"]
		if data.has("prompt_tokens"):
			prompt_tokens = data["prompt_tokens"]
		if data.has("total_tokens"):
			total_tokens = data["total_tokens"]
		if data.has("prompt_tokens_details"):
			prompt_tokens_details = data["prompt_tokens_details"]
		if data.has("completion_tokens_details"):
			completion_tokens_details = data["completion_tokens_details"]

class CompletionResponse:
	var choices: Array[Choice] = []
	var created: int = 0
	var id: String = ""
	var model: String = ""
	var service_tier: String = ""
	var object: String = ""
	var usage: Usage

	func _init(data: Dictionary) -> void:
		if data.has("choices"):
			for choice_data in data["choices"]:
				choices.append(Choice.new(choice_data))
		if data.has("created"):
			created = data["created"]
		if data.has("id"):
			id = data["id"]
		if data.has("model"):
			model = data["model"]
		if data.has("service_tier"):
			service_tier = data["service_tier"]
		if data.has("object"):
			object = data["object"]
		if data.has("usage"):
			usage = Usage.new(data["usage"])
#endregion
