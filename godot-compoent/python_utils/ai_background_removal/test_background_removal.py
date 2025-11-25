import os
import sys
from PIL import Image
import glob

# 文件夹路径配置
input_folder = os.path.join(os.path.dirname(__file__), "..", "test_data")
output_folder = os.path.join(input_folder, "out")

# 支持的图片格式
supported_formats = ["*.png", "*.jpg", "*.jpeg", "*.bmp", "*.gif"]

# 创建输出文件夹
os.makedirs(output_folder, exist_ok=True)

# 检查输入文件夹是否存在
if not os.path.exists(input_folder):
    print(f"错误：输入文件夹 {input_folder} 不存在。")
    sys.exit(1)

print("使用简单方法测试批量抠图功能...")
print(f"输入文件夹: {input_folder}")
print(f"输出文件夹: {output_folder}")
print("开始处理所有支持格式的图片...")

# 简单的绿色背景移除示例
def simple_background_removal(image_path, output_path, tolerance=30):
    # 打开图片
    image = Image.open(image_path).convert("RGBA")
    
    # 获取图片数据
    data = list(image.getdata())
    
    # 简单的背景移除（假设背景是绿色）
    new_data = []
    for item in data:
        # RGBA值
        r, g, b, a = item
        
        # 如果是绿色背景（G值很高，R和B值很低）
        if g > r + tolerance and g > b + tolerance:
            # 透明化
            new_data.append((r, g, b, 0))
        else:
            # 保持原样
            new_data.append(item)
    
    # 更新图片数据
    image.putdata(new_data)
    
    # 保存结果
    image.save(output_path, "PNG")
    return image

# 执行批量简单的背景移除
try:
    # 获取所有支持格式的图片文件路径
    image_files = []
    for fmt in supported_formats:
        image_files.extend(glob.glob(os.path.join(input_folder, fmt)))
    
    if not image_files:
        print(f"错误：在输入文件夹 {input_folder} 中没有找到支持格式的图片。")
        sys.exit(1)
    
    print(f"找到 {len(image_files)} 张图片，开始处理...")
    
    # 处理每张图片
    processed_count = 0
    for image_path in image_files:
        # 获取图片文件名（不含路径）
        image_filename = os.path.basename(image_path)
        
        # 跳过已经处理过的结果图片
        if "_result" in image_filename:
            print(f"跳过已处理的结果图片: {image_filename}")
            continue
        
        # 构建输出文件路径
        # 保留原文件名，添加"_result"后缀
        output_filename = os.path.splitext(image_filename)[0] + "_result.png"
        output_path = os.path.join(output_folder, output_filename)
        
        try:
            print(f"处理图片: {image_filename}...")
            simple_background_removal(image_path, output_path)
            processed_count += 1
            print(f"  ✓ 完成，结果保存至: {output_filename}")
        except Exception as e:
            print(f"  ✗ 处理图片 {image_filename} 时出错: {e}")
    
    print(f"\n批量处理完成！")
    print(f"成功处理: {processed_count} 张图片")
    skipped_count = len([img for img in image_files if "_result" in os.path.basename(img)])
    failed_count = len(image_files) - processed_count - skipped_count
    print(f"跳过处理: {skipped_count} 张图片")
    print(f"失败处理: {failed_count} 张图片")
    print(f"所有结果已保存至: {output_folder}")
    print("\n注意：这是一个简单的绿色背景移除示例，仅用于测试图片处理流程。")
    print("要使用完整的AI抠图功能，请确保成功下载了rmbg-1.4.onnx模型文件。")
except Exception as e:
    print(f"批量处理过程中发生错误: {e}")
    import traceback
    traceback.print_exc()
