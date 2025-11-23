import os
from PIL import Image  # 仅保留核心导入，兼容所有Pillow版本

# ====================== 可手动调整的参数（修改这里即可） ======================
DIR="E:\dev_soft\Godot_v4.3-stable_win64.exe\godot-compoent\godot-compoent\动画\特效\火焰"
INPUT_DIR = DIR       # 输入文件夹路径（存放要处理的GIF文件）
OUTPUT_DIR = DIR+"/gif_frames"       # 输出文件夹路径（保存序列帧的位置）
OUTPUT_FORMAT = "png"                # 输出图片格式（支持png、jpg、bmp等）
FRAME_PREFIX = "frame_"              # 帧文件名前缀
KEEP_ORIGINAL_DIR_STRUCTURE = True   # 是否保持原始目录结构
# =============================================================================

def gif_to_frames(input_path, output_folder):
    """
    将单个GIF文件转换为序列帧
    :param input_path: GIF文件路径
    :param output_folder: 输出帧的文件夹路径
    :return: (成功帧数, 总帧数) 元组
    """
    try:
        # 确保输出文件夹存在
        os.makedirs(output_folder, exist_ok=True)
        
        # 打开GIF图片
        with Image.open(input_path) as img:
            # 获取GIF文件基本信息
            gif_filename = os.path.basename(input_path)
            gif_name_no_ext = os.path.splitext(gif_filename)[0]
            total_frames = img.n_frames
            
            print(f"📊 处理GIF: {gif_filename} (共 {total_frames} 帧)")
            success_count = 0
            
            # 遍历每一帧
            for frame_num in range(total_frames):
                # 定位到第frame_num帧
                img.seek(frame_num)
                
                # 复制当前帧（避免与原图像共享内存）
                frame = img.copy()
                
                # 确保帧是RGBA模式（保留透明度）
                if frame.mode != 'RGBA':
                    frame = frame.convert('RGBA')
                
                # 生成帧文件名
                # 使用6位数字确保文件名按顺序排序
                frame_filename = f"{gif_name_no_ext}_{FRAME_PREFIX}{frame_num:06d}.{OUTPUT_FORMAT}"
                frame_path = os.path.join(output_folder, frame_filename)
                
                # 保存帧
                try:
                    frame.save(frame_path, format=OUTPUT_FORMAT.upper())
                    success_count += 1
                    # 每10帧输出一次进度，避免输出过多
                    if (frame_num + 1) % 10 == 0 or (frame_num + 1) == total_frames:
                        print(f"  进度: {frame_num + 1}/{total_frames}")
                except Exception as e:
                    print(f"❌ 保存帧 {frame_num} 失败: {str(e)}")
            
            print(f"✅ {gif_filename} 处理完成 - 成功保存 {success_count}/{total_frames} 帧")
            return success_count, total_frames
            
    except Image.UnidentifiedImageError:
        print(f"❌ 跳过: {os.path.basename(input_path)} - 不是有效图片文件")
        return 0, 0
    except Exception as e:
        print(f"❌ 处理失败: {os.path.basename(input_path)} - 错误: {str(e)}")
        return 0, 0

def batch_convert_gifs(input_dir, output_dir):
    """
    批量处理文件夹下的所有GIF文件
    :param input_dir: 输入文件夹路径
    :param output_dir: 输出文件夹路径
    """
    # 检查输入文件夹是否存在
    if not os.path.exists(input_dir):
        print(f"❌ 错误: 输入文件夹 {input_dir} 不存在！")
        return

    # 创建输出文件夹（如果不存在）
    os.makedirs(output_dir, exist_ok=True)

    # 只处理GIF文件
    gif_extensions = ('.gif', '.GIF')
    
    # 存储所有GIF文件路径
    all_gifs = []
    
    # 遍历文件夹（支持子文件夹）
    for root, _, files in os.walk(input_dir):
        for file in files:
            if file.lower().endswith(gif_extensions):
                gif_path = os.path.join(root, file)
                all_gifs.append(gif_path)
    
    total_gifs = len(all_gifs)
    
    if total_gifs == 0:
        print(f"⚠️ 提示: 输入文件夹 {input_dir} 中未找到GIF文件！")
        return
    
    print(f"📁 开始处理: 共发现 {total_gifs} 个GIF文件")
    print("=" * 60)
    
    total_success_frames = 0
    total_all_frames = 0
    success_gifs = 0
    
    # 逐个处理GIF文件
    for i, gif_path in enumerate(all_gifs):
        print(f"\n[{i+1}/{total_gifs}] 处理中...")
        
        # 确定输出子文件夹
        if KEEP_ORIGINAL_DIR_STRUCTURE:
            # 计算相对路径，保持目录结构
            relative_path = os.path.relpath(os.path.dirname(gif_path), input_dir)
            gif_output_dir = os.path.join(output_dir, relative_path)
        else:
            # 不保持目录结构，直接放在输出根目录
            gif_name_no_ext = os.path.splitext(os.path.basename(gif_path))[0]
            gif_output_dir = os.path.join(output_dir, gif_name_no_ext)
        
        # 转换GIF到序列帧
        success_frames, all_frames = gif_to_frames(gif_path, gif_output_dir)
        
        # 更新统计信息
        if success_frames > 0:
            success_gifs += 1
        total_success_frames += success_frames
        total_all_frames += all_frames
    
    # 输出处理总结
    print("\n" + "=" * 60)
    print("📊 处理完成:")
    print(f"   总GIF文件数: {total_gifs}")
    print(f"   成功处理: {success_gifs}")
    print(f"   总帧数: {total_all_frames}")
    print(f"   成功保存: {total_success_frames}")
    print(f"   输出文件夹: {output_dir}")

# 主程序入口
if __name__ == "__main__":
    print("🎯 GIF转序列帧工具")
    print("🔧 正在初始化...")
    print(f"📂 输入目录: {INPUT_DIR}")
    print(f"📂 输出目录: {OUTPUT_DIR}")
    print(f"📝 输出格式: {OUTPUT_FORMAT.upper()}")
    print(f"🏗️ 保持目录结构: {'是' if KEEP_ORIGINAL_DIR_STRUCTURE else '否'}")
    print("=" * 60)
    
    batch_convert_gifs(
        input_dir=INPUT_DIR,
        output_dir=OUTPUT_DIR
    )