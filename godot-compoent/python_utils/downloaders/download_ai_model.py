#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI模型下载工具
用于从Hugging Face下载RMBG-1.4模型，用于本地AI抠图工具
"""

import os
import requests
from tqdm import tqdm

def download_model(model_name="briaai/RMBG-1.4", filename="rmbg-1.4.onnx", save_dir="./models"):
    """
    从Hugging Face下载模型文件
    
    Args:
        model_name: 模型名称，格式为"用户名/模型名"
        filename: 要下载的文件名
        save_dir: 保存目录
    """
    # 创建保存目录
    os.makedirs(save_dir, exist_ok=True)
    
    # 构建下载URL
    url = f"https://huggingface.co/{model_name}/resolve/main/{filename}"
    save_path = os.path.join(save_dir, filename)
    
    print(f"正在从 {url} 下载模型...")
    print(f"将保存到: {save_path}")
    
    try:
        # 发送GET请求，流式下载
        response = requests.get(url, stream=True)
        response.raise_for_status()  # 检查请求是否成功
        
        # 获取文件大小
        total_size = int(response.headers.get('content-length', 0))
        
        # 显示进度条下载
        with open(save_path, 'wb') as file, tqdm(
            desc=filename,
            total=total_size,
            unit='iB',
            unit_scale=True,
            unit_divisor=1024,
        ) as bar:
            for data in response.iter_content(chunk_size=1024):
                size = file.write(data)
                bar.update(size)
        
        print(f"模型下载成功: {save_path}")
        print(f"文件大小: {os.path.getsize(save_path) / (1024 * 1024):.2f} MB")
        
    except requests.exceptions.HTTPError as e:
        print(f"HTTP错误: {e}")
    except requests.exceptions.ConnectionError:
        print("连接错误，请检查网络")
    except requests.exceptions.Timeout:
        print("下载超时")
    except Exception as e:
        print(f"下载失败: {e}")

def main():
    print("=" * 60)
    print("AI抠图模型下载工具")
    print("=" * 60)
    print("此工具用于下载RMBG-1.4模型，用于本地AI抠图工具")
    print()
    
    # 下载模型
    download_model()
    
    print()
    print("使用说明：")
    print("1. 将下载的rmbg-1.4.onnx文件放在models目录下")
    print("2. 确保models目录与本地AI抠图工具.html在同一目录")
    print("3. 启动本地服务器（如Python的http.server）")
    print("4. 在浏览器中打开本地AI抠图工具.html")
    print()
    print("示例服务器命令：")
    print("python -m http.server 8000")
    print()
    print("按任意键退出...")
    input()

if __name__ == "__main__":
    main()