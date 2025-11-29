#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动推送dist目录内容到GitHub仓库的脚本
使用方法: python push_to_github.py
功能：
1. 自动进入项目的dist目录
2. 自动初始化git仓库并绑定远程仓库
3. 推送前会自动检查并修复index.html中的资源路径（/assets/ 改为 ./assets/）
"""

import os
import re
import subprocess
import sys
from datetime import datetime

# 项目根目录（使用绝对路径）
PROJECT_DIR = 'e:\\dev_soft\\Godot_v4.3-stable_win64.exe\\godot-compoent\\vue-antd'
DIST_DIR = os.path.join(PROJECT_DIR, 'dist')
# 远程仓库地址（可以根据需要修改）
REMOTE_REPO_URL = 'git@github.com-seven-it-work:seven-it-work/temp_html.git'  # 默认远程仓库地址

def run_command(cmd):
    """执行命令并返回结果"""
    try:
        # 在Windows上使用UTF-8编码处理输出
        result = subprocess.run(
            cmd,
            shell=True,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            encoding='utf-8',
            errors='replace'  # 替换无法解码的字符
        )
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        # 处理错误输出
        error_output = e.stderr if isinstance(e.stderr, str) else e.stderr.decode('utf-8', errors='replace')
        return False, error_output

def change_directory(directory):
    """切换到指定目录"""
    try:
        os.chdir(directory)
        print(f"成功切换到目录: {directory}")
        return True
    except Exception as e:
        print(f"切换目录失败: {str(e)}")
        return False

def initialize_git_repo():
    """初始化git仓库"""
    # 检查是否已经有git仓库
    if os.path.exists('.git'):
        print("git仓库已存在")
        return True
    
    # 初始化git仓库
    print("初始化git仓库...")
    success, output = run_command('git init')
    if not success:
        print(f"git init失败: {output}")
        return False
    
    # 创建.gitignore文件（如果不存在）
    if not os.path.exists('.gitignore'):
        print("创建.gitignore文件...")
        gitignore_content = """# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
.pnp
.pnp.js

# Build output
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.*.local"""
        try:
            with open('.gitignore', 'w', encoding='utf-8') as f:
                f.write(gitignore_content)
            print(".gitignore文件创建成功")
        except Exception as e:
            print(f"创建.gitignore文件失败: {str(e)}")
    
    return True

def setup_remote_repo():
    """设置远程仓库"""
    # 检查是否已有远程仓库配置
    success, output = run_command('git remote -v')
    if success and 'origin' in output:
        print("远程仓库已配置")
        print(output)
        return True
    
    # 配置远程仓库
    print(f"配置远程仓库: {REMOTE_REPO_URL}")
    success, output = run_command(f'git remote add origin {REMOTE_REPO_URL}')
    if not success:
        print(f"配置远程仓库失败: {output}")
        return False
    
    print("远程仓库配置成功")
    return True

def fix_asset_paths():
    """检查并修复index.html中的资源路径
    将 /assets/ 替换为 ./assets/
    """
    index_path = os.path.join(os.getcwd(), 'index.html')
    
    # 检查index.html文件是否存在
    if not os.path.exists(index_path):
        print(f"错误: 找不到 {index_path} 文件")
        return False
    
    try:
        # 读取文件内容
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否需要修复
        if '"/assets/' not in content:
            print("不需要修复: index.html中没有找到 /assets/ 路径")
            return True
        
        # 替换路径
        new_content = re.sub(r'"/assets/', r'\"./assets/', content)
        
        # 写回文件
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"成功修复index.html中的资源路径: \"/assets/ -> \"\./assets/")
        return True
    
    except Exception as e:
        print(f"修复资源路径时出错: {str(e)}")
        return False

def main():
    print("===== 开始推送dist目录到GitHub =====")
    
    # 切换到dist目录
    print(f"\n准备切换到dist目录: {DIST_DIR}")
    if not change_directory(DIST_DIR):
        print("错误: 无法切换到dist目录，请先运行构建命令")
        sys.exit(1)
    
    # 初始化git仓库
    print("\n检查/初始化git仓库...")
    if not initialize_git_repo():
        print("初始化git仓库失败，停止推送")
        sys.exit(1)
    
    # 设置远程仓库
    print("\n检查/配置远程仓库...")
    if not setup_remote_repo():
        print("配置远程仓库失败，停止推送")
        sys.exit(1)
    
    # 检查并修复index.html中的资源路径
    print("\n检查并修复index.html中的资源路径...")
    if not fix_asset_paths():
        print("资源路径修复失败，停止推送")
        sys.exit(1)
    
    # 执行git add
    print("\n执行 git add . ...")
    success, output = run_command('git add .')
    if not success:
        print(f"git add失败: {output}")
        sys.exit(1)
    print("git add 成功")
    
    # 执行git commit
    commit_message = f"自动更新 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    print(f"\n执行 git commit -m '{commit_message}' ...")
    success, output = run_command(f'git commit -m "{commit_message}"')
    if not success:
        # 检查是否是因为没有更改而导致的失败
        if 'nothing to commit' in output:
            print("没有更改需要提交")
        else:
            print(f"git commit失败: {output}")
            sys.exit(1)
    else:
        print("git commit 成功")
        print(output)
    
    # 执行git push
    print("\n执行 git push -f origin master:main ...")
    success, output = run_command('git push -f origin master:main')
    if not success:
        print(f"git push失败: {output}")
        print("提示: 如果是第一次推送，可能需要先拉取远程仓库")
        # 尝试拉取并合并
        print("\n尝试拉取远程仓库...")
        pull_success, pull_output = run_command('git pull origin main --allow-unrelated-histories')
        if pull_success:
            print("拉取成功，再次尝试推送...")
            success, output = run_command('git push -f origin master:main')
            if not success:
                print(f"再次推送失败: {output}")
                sys.exit(1)
        else:
            print(f"拉取失败: {pull_output}")
            sys.exit(1)
    
    print("\ngit push 成功！")
    print("===== 推送完成 =====")

# 获取命令行参数
if __name__ == "__main__":
    # 如果提供了远程仓库地址作为参数，使用它
    if len(sys.argv) > 1:
        REMOTE_REPO_URL = sys.argv[1]
    
    main()

if __name__ == "__main__":
    main()