import sys
import os
import argparse
import onnxruntime as rt
from PIL import Image
import numpy as np
import urllib.request
import time
from concurrent.futures import ThreadPoolExecutor

def download_model(model_path):
    """下载模型"""
    print("正在下载模型...")
    model_url = "https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model.onnx?download=true"
    
    def report_hook(blocknum, blocksize, totalsize):
        readsofar = blocknum * blocksize
        if totalsize > 0:
            percent = min(int(readsofar * 100 / totalsize), 100)
            sys.stdout.write(f"\r下载进度: {percent}%")
            sys.stdout.flush()
        else:
            sys.stdout.write(f"\r下载中... {readsofar // 1024}KB")
            sys.stdout.flush()
    
    try:
        urllib.request.urlretrieve(model_url, model_path, reporthook=report_hook)
        print("\n模型下载完成")
        return True
    except Exception as e:
        print(f"\n模型下载失败: {str(e)}")
        return False

def load_model(model_path):
    """加载模型"""
    print("正在检查模型...")
    
    # 检查模型目录
    model_dir = os.path.dirname(model_path)
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
    
    # 检查模型文件
    if not os.path.exists(model_path):
        if not download_model(model_path):
            return None
    
    try:
        # 加载模型
        print("正在加载模型...")
        session = rt.InferenceSession(model_path)
        print("模型加载成功")
        return session
    except Exception as e:
        print(f"模型加载失败: {str(e)}")
        return None

def preprocess_image(image_path):
    """预处理图片"""
    image = Image.open(image_path).convert("RGB")
    original_size = image.size
    
    # 确保图片尺寸是1024x1024（模型期望的输入尺寸）
    image = image.resize((1024, 1024), Image.LANCZOS)
    
    # 转换为numpy数组
    image = np.array(image).astype(np.float32) / 255.0
    image = image.transpose(2, 0, 1)
    image = np.expand_dims(image, axis=0)
    
    # 标准化
    mean = np.array([0.485, 0.456, 0.406]).reshape((1, 3, 1, 1)).astype(np.float32)
    std = np.array([0.229, 0.224, 0.225]).reshape((1, 3, 1, 1)).astype(np.float32)
    image = (image - mean) / std
    
    # 确保输出为float32类型
    image = image.astype(np.float32)
    
    print(f"预处理完成：输入尺寸 {original_size} -> 模型输入尺寸 1024x1024")
    return image, original_size

def is_green_screen(image_path, threshold=0.3, green_ratio=0.6):
    """检测图片是否包含绿幕背景"""
    try:
        image = Image.open(image_path).convert("RGB")
        width, height = image.size
        pixels = np.array(image)
        
        # 计算绿色像素比例
        # 绿色像素定义：G > R + 20 且 G > B + 20 且 G > 100
        green_pixels = np.sum((pixels[:,:,1] > pixels[:,:,0] + 20) & 
                             (pixels[:,:,1] > pixels[:,:,2] + 20) & 
                             (pixels[:,:,1] > 100))
        
        total_pixels = width * height
        green_ratio_detected = green_pixels / total_pixels
        
        print(f"绿幕检测：绿色像素占比 {green_ratio_detected:.2%}")
        
        # 如果绿色像素比例超过阈值，则认为是绿幕
        return green_ratio_detected > threshold
    except Exception as e:
        print(f"绿幕检测失败: {str(e)}")
        return False

def simple_green_screen_removal(image_path, tolerance=30):
    """简单的绿幕移除方法（基于颜色阈值）"""
    try:
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
            if g > r + tolerance and g > b + tolerance and g > 100:
                # 透明化
                new_data.append((r, g, b, 0))
            else:
                # 保持原样
                new_data.append(item)
        
        # 更新图片数据
        image.putdata(new_data)
        return image
    except Exception as e:
        print(f"简单绿幕移除失败: {str(e)}")
        return None

def process_image_with_ai(image_path, session):
    """使用AI模型处理图片"""
    if not os.path.exists(image_path):
        print(f"错误：图片文件不存在 - {image_path}")
        return None
    
    try:
        print(f"正在使用AI模型处理图片: {image_path}")
        start_time = time.time()
        
        # 预处理图片
        input_image, original_size = preprocess_image(image_path)
        
        # 模型推理
        input_name = session.get_inputs()[0].name
        output_name = session.get_outputs()[0].name
        output = session.run([output_name], {input_name: input_image})[0]
        
        # 后处理
        mask = output[0, 0]
        mask = (mask * 255).astype(np.uint8)
        
        # 读取原图
        original_image = Image.open(image_path).convert("RGBA")
        
        # 调整mask大小以匹配原图
        mask_image = Image.fromarray(mask).resize(original_image.size, Image.LANCZOS)
        
        # 应用mask
        result = Image.new("RGBA", original_image.size)
        for i in range(original_image.size[0]):
            for j in range(original_image.size[1]):
                r, g, b, a = original_image.getpixel((i, j))
                mask_value = mask_image.getpixel((i, j))
                result.putpixel((i, j), (r, g, b, mask_value))
        
        end_time = time.time()
        print(f"AI模型处理完成，耗时: {end_time - start_time:.2f}秒")
        
        return result
        
    except Exception as e:
        print(f"AI处理失败: {str(e)}")
        return None

def process_image_with_hybrid(image_path, session, tolerance=30):
    """混合处理方法：先使用颜色阈值移除绿幕，再用AI模型优化边缘"""
    if not os.path.exists(image_path):
        print(f"错误：图片文件不存在 - {image_path}")
        return None
    
    try:
        print(f"正在使用混合方法处理图片: {image_path}")
        start_time = time.time()
        
        # 1. 先用颜色阈值快速处理绿幕
        color_masked_image = simple_green_screen_removal(image_path, tolerance)
        if color_masked_image is None:
            print("颜色阈值处理失败，回退到纯AI处理")
            return process_image_with_ai(image_path, session)
        
        # 获取原始图片的尺寸
        original_image = Image.open(image_path)
        original_size = original_image.size
        
        # 2. 直接处理混合方法，不使用临时文件避免尺寸问题
        # 先进行颜色阈值处理，然后直接使用AI模型处理原图（不保存临时文件）
        ai_result = process_image_with_ai(image_path, session)
        
        if ai_result is None:
            print("AI处理失败，使用颜色阈值结果")
            return color_masked_image
        
        # 3. 融合两种方法的结果：使用颜色阈值结果作为基础，结合AI模型的边缘细节
        # 创建一个新的RGBA图像用于存储融合结果
        fused_result = Image.new("RGBA", original_size)
        
        # 获取两种方法的alpha通道
        color_alpha = color_masked_image.split()[3]
        ai_alpha = ai_result.split()[3]
        
        # 确保原始图像是RGB模式
        original_image_rgb = original_image.convert('RGB')
        
        # 对每个像素进行融合处理
        for x in range(original_size[0]):
            for y in range(original_size[1]):
                # 获取原始图像的RGB值
                r, g, b = original_image_rgb.getpixel((x, y))
                
                # 获取两种方法的透明度
                color_a = color_alpha.getpixel((x, y))
                ai_a = ai_alpha.getpixel((x, y))
                
                # 融合策略：对于明显的绿幕区域，主要使用颜色阈值结果
                # 对于边缘区域，主要使用AI模型结果
                # 使用简单的加权平均
                if color_a < 50:  # 几乎完全透明的区域，可能是绿幕
                    final_a = min(color_a, ai_a)
                elif color_a > 200:  # 不透明区域，可能是前景
                    final_a = max(color_a, ai_a)
                else:  # 边缘区域，更依赖AI结果
                    final_a = int(0.3 * color_a + 0.7 * ai_a)
                
                # 设置像素值
                fused_result.putpixel((x, y), (r, g, b, final_a))
        
        end_time = time.time()
        print(f"混合方法处理完成，耗时: {end_time - start_time:.2f}秒")
        
        return fused_result
        
    except Exception as e:
        print(f"混合处理失败: {str(e)}")
        return None

def main():
    # 参数配置 - 用户可以直接修改以下参数
    class Config:
        # 输入图片路径 - 必选（使用原始字符串避免转义问题）
        input_path = r"E:\dev_soft\Godot_v4.3-stable_win64.exe\godot-compoent\godot-compoent\python_utils\test_data\帧图_001_0秒.png"
        # 输出图片路径 - 留空则在原目录下添加_output后缀
        output_path = ""
        # 模型文件路径 - 留空则使用默认路径
        model_path = ""
        # 处理方法: ai(仅AI处理), green(仅绿幕处理), hybrid(混合处理), auto(自动选择)
        method = "hybrid"
        # 绿幕检测和处理的颜色阈值
        threshold = 30
    
    # 创建配置实例
    args = Config()
    
    # 设置默认模型路径
    if not args.model_path:
        model_path = os.path.join(os.path.dirname(__file__), "models", "rmbg-1.4.onnx")
    else:
        model_path = args.model_path
    
    # 设置默认输出路径
    if not args.output_path:
        input_dir = os.path.dirname(args.input_path)
        input_filename = os.path.basename(args.input_path)
        name, ext = os.path.splitext(input_filename)
        output_path = os.path.join(input_dir, f"{name}_output.png")
    else:
        output_path = args.output_path
    
    # 确保输出目录存在
    output_dir = os.path.dirname(output_path)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 根据处理方法决定是否需要加载模型
    session = None
    if args.method in ['ai', 'hybrid', 'auto']:
        session = load_model(model_path)
        if not session:
            print("无法加载模型，程序退出")
            return 1
    
    # 处理图片
    result_image = None
    
    if args.method == 'auto':
        # 自动检测并选择合适的处理方法
        is_green = is_green_screen(args.input_path)
        if is_green:
            print("检测到绿幕背景，使用混合处理方法")
            result_image = process_image_with_hybrid(args.input_path, session, args.threshold)
        else:
            print("未检测到绿幕背景，使用纯AI处理方法")
            result_image = process_image_with_ai(args.input_path, session)
    elif args.method == 'ai':
        # 仅使用AI处理
        result_image = process_image_with_ai(args.input_path, session)
    elif args.method == 'green':
        # 仅使用绿幕处理
        result_image = simple_green_screen_removal(args.input_path, args.threshold)
    elif args.method == 'hybrid':
        # 使用混合处理方法
        result_image = process_image_with_hybrid(args.input_path, session, args.threshold)
    
    if result_image:
        # 保存结果
        try:
            result_image.save(output_path, "PNG")
            print(f"结果已保存到: {output_path}")
            return 0
        except Exception as e:
            print(f"保存失败: {str(e)}")
            return 1
    
    return 1

if __name__ == "__main__":
    sys.exit(main())