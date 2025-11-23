import os
from PIL import Image  # 仅保留核心导入，兼容所有Pillow版本

# ====================== 可手动调整的参数（修改这里即可） ======================
DIR="E:/dev_soft/Godot_v4.3-stable_win64.exe/godot-compoent/godot-compoent/动画/特效/闪电特效/"
INPUT_DIR = DIR       # 输入文件夹路径（存放要处理的图片）
OUTPUT_DIR = DIR+"resized_images"       # 输出文件夹路径（处理后图片保存位置）
TARGET_WIDTH = 540                    # 目标宽度（像素）
TARGET_HEIGHT = 2364                   # 目标高度（像素）
KEEP_ASPECT_RATIO = False             # 是否保持宽高比例（True=保持，False=强制拉伸）
# =============================================================================

def resize_single_image(input_path, output_path, target_width, target_height, keep_aspect_ratio=False):
    """
    处理单张图片的尺寸修改
    :param input_path: 原图片路径
    :param output_path: 处理后图片保存路径
    :param target_width: 目标宽度
    :param target_height: 目标高度
    :param keep_aspect_ratio: 是否保持宽高比例
    """
    try:
        # 打开图片
        with Image.open(input_path) as img:
            # 如果需要保持比例，计算等比例缩放后的尺寸
            if keep_aspect_ratio:
                original_width, original_height = img.size
                # 计算缩放比例（取宽/高中较小的比例，避免超出目标尺寸）
                ratio = min(target_width / original_width, target_height / original_height)
                new_width = int(original_width * ratio)
                new_height = int(original_height * ratio)
            else:
                # 强制修改为指定尺寸
                new_width = target_width
                new_height = target_height

            # 调整尺寸（兼容Pillow 9.x以下版本）
            try:
                resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            except AttributeError:
                resized_img = img.resize((new_width, new_height), Image.LANCZOS)
            
            # 保存图片（保留原格式，透明PNG等格式兼容）
            resized_img.save(output_path)
            print(f"✅ 处理成功: {os.path.basename(input_path)} -> 尺寸: {new_width}x{new_height}")
            return True

    # 兼容所有Pillow版本的异常捕获
    except Image.UnidentifiedImageError:
        print(f"❌ 跳过: {os.path.basename(input_path)} - 不是有效图片文件")
        return False
    except Exception as e:
        print(f"❌ 处理失败: {os.path.basename(input_path)} - 错误: {str(e)}")
        return False

def batch_resize_images(input_dir, output_dir, target_width, target_height, keep_aspect_ratio=False):
    """
    批量处理文件夹下的所有图片
    :param input_dir: 输入文件夹路径
    :param output_dir: 输出文件夹路径
    :param target_width: 目标宽度
    :param target_height: 目标高度
    :param keep_aspect_ratio: 是否保持宽高比例
    """
    # 检查输入文件夹是否存在
    if not os.path.exists(input_dir):
        print(f"❌ 错误: 输入文件夹 {input_dir} 不存在！")
        return

    # 创建输出文件夹（如果不存在）
    os.makedirs(output_dir, exist_ok=True)

    # 支持的图片格式（后缀不区分大小写）
    supported_formats = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp')

    # 遍历文件夹下所有文件
    file_list = [f for f in os.listdir(input_dir) if f.lower().endswith(supported_formats)]
    total_files = len(file_list)

    if total_files == 0:
        print(f"⚠️ 提示: 输入文件夹 {input_dir} 中未找到支持的图片文件！")
        return

    print(f"📁 开始处理: 共发现 {total_files} 张图片")
    success_count = 0

    # 逐个处理图片
    for filename in file_list:
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)
        # 跳过文件夹（防止遍历到子文件夹）
        if os.path.isdir(input_path):
            continue
        # 处理单张图片
        if resize_single_image(input_path, output_path, target_width, target_height, keep_aspect_ratio):
            success_count += 1

    # 输出处理总结
    print("\n📊 处理完成:")
    print(f"   总文件数: {total_files}")
    print(f"   成功数: {success_count}")
    print(f"   失败/跳过数: {total_files - success_count}")
    print(f"   输出路径: {os.path.abspath(output_dir)}")

if __name__ == "__main__":
    # 直接调用批量处理函数，使用手动定义的参数
    batch_resize_images(
        input_dir=INPUT_DIR,
        output_dir=OUTPUT_DIR,
        target_width=TARGET_WIDTH,
        target_height=TARGET_HEIGHT,
        keep_aspect_ratio=KEEP_ASPECT_RATIO
    )