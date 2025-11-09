## 使用需要在全局中添加这个工具为 OrphanNodeTool
extends Node

## 打印孤立节点
func orphan_nodes():
	# 检查是否为调试构建版本
	if Engine.has_singleton("EngineDebugger"):
		print("获取孤立节点信息（仅调试构建版本有效）...")
		
		# 获取所有孤立节点的ID
		var orphan_node_ids = get_orphan_node_ids()
		
		if orphan_node_ids.is_empty():
			print("未发现孤立节点。")
		else:
			print("发现 ", orphan_node_ids.size(), " 个孤立节点:")
			
			# 遍历所有孤立节点ID
			for node_id in orphan_node_ids:
				# 通过ID获取节点对象
				var node = instance_from_id(node_id)
				if node:
					# 打印节点信息
					print("节点ID: ", node_id)
					print("  类型: ", node.get_class())
					print("  对象描述: ", str(node))
					
					# 尝试获取额外信息（如果可用）
					if node is Node:
						print("  场景路径: ", node.scene_file_path)
						print("  名称: ", node.name)
					
					# 尝试获取创建位置的堆栈信息（在调试版本中可能可用）
					print("  内存地址: ", typeof(node), ":", node_id)
					print("----------------------------------------")
				else:
					print("  无法获取节点对象，ID: ", node_id)
	else:
		print("当前不是调试构建版本，无法获取孤立节点信息。")
	
