import sys
import os
import requests
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QFileDialog, QMessageBox, QProgressBar
)
from PyQt5.QtGui import QPixmap, QImage
from PyQt5.QtCore import Qt
import onnxruntime as rt
from PIL import Image
import numpy as np
import urllib.request
import zipfile

class BackgroundRemoverApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.model_path = os.path.join(os.path.dirname(__file__), "models", "rmbg-1.4.onnx")
        self.session = None
        self.setup_ui()
        self.load_model()

    def setup_ui(self):
        self.setWindowTitle("本地AI抠图工具")
        self.setGeometry(100, 100, 1000, 600)
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        main_layout = QVBoxLayout(central_widget)
        
        # 标题
        title_label = QLabel("AI背景移除工具 (基于RMBG-1.4模型)")
        title_label.setAlignment(Qt.AlignCenter)
        title_label.setStyleSheet("font-size: 20px; font-weight: bold; margin: 10px;")
        main_layout.addWidget(title_label)
        
        # 图片显示区域
        image_layout = QHBoxLayout()
        
        # 原始图片
        self.original_label = QLabel("原始图片")
        self.original_label.setAlignment(Qt.AlignCenter)
        self.original_label.setMinimumSize(400, 400)
        self.original_label.setStyleSheet("border: 1px solid #ccc; background-color: #f0f0f0;")
        image_layout.addWidget(self.original_label)
        
        # 结果图片
        self.result_label = QLabel("抠图结果")
        self.result_label.setAlignment(Qt.AlignCenter)
        self.result_label.setMinimumSize(400, 400)
        self.result_label.setStyleSheet("border: 1px solid #ccc; background-color: #f0f0f0;")
        image_layout.addWidget(self.result_label)
        
        main_layout.addLayout(image_layout)
        
        # 按钮区域
        button_layout = QHBoxLayout()
        
        self.upload_btn = QPushButton("上传图片")
        self.upload_btn.clicked.connect(self.upload_image)
        button_layout.addWidget(self.upload_btn)
        
        self.process_btn = QPushButton("开始抠图")
        self.process_btn.clicked.connect(self.process_image)
        self.process_btn.setEnabled(False)
        button_layout.addWidget(self.process_btn)
        
        self.download_btn = QPushButton("下载结果")
        self.download_btn.clicked.connect(self.download_result)
        self.download_btn.setEnabled(False)
        button_layout.addWidget(self.download_btn)
        
        main_layout.addLayout(button_layout)
        
        # 进度条
        self.progress_bar = QProgressBar()
        self.progress_bar.setVisible(False)
        main_layout.addWidget(self.progress_bar)
        
        # 状态信息
        self.status_label = QLabel("请上传图片开始处理")
        self.status_label.setAlignment(Qt.AlignCenter)
        self.status_label.setStyleSheet("color: #666; font-size: 12px;")
        main_layout.addWidget(self.status_label)
        
        # 保存当前图片路径
        self.current_image_path = None
        self.current_result = None

    def load_model(self):
        """加载或下载模型"""
        self.status_label.setText("正在检查模型...")
        
        # 检查模型目录
        model_dir = os.path.join(os.path.dirname(__file__), "models")
        if not os.path.exists(model_dir):
            os.makedirs(model_dir)
        
        # 检查模型文件
        if not os.path.exists(self.model_path):
            self.status_label.setText("正在下载模型...")
            self.progress_bar.setVisible(True)
            self.progress_bar.setValue(0)
            
            try:
                # 下载模型
                model_url = "https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model.onnx?download=true"
                
                def report_hook(blocknum, blocksize, totalsize):
                    readsofar = blocknum * blocksize
                    if totalsize > 0:
                        percent = min(int(readsofar * 100 / totalsize), 100)
                        self.progress_bar.setValue(percent)
                    else:
                        self.progress_bar.setValue(0)
                
                urllib.request.urlretrieve(model_url, self.model_path, reporthook=report_hook)
                self.status_label.setText("模型下载完成")
            except Exception as e:
                QMessageBox.critical(self, "错误", f"模型下载失败: {str(e)}")
                self.status_label.setText("模型加载失败，请检查网络连接")
                return
        
        try:
            # 加载模型
            self.status_label.setText("正在加载模型...")
            self.session = rt.InferenceSession(self.model_path)
            self.status_label.setText("模型加载成功，等待上传图片")
        except Exception as e:
            QMessageBox.critical(self, "错误", f"模型加载失败: {str(e)}")
            self.status_label.setText("模型加载失败")

    def upload_image(self):
        """上传图片"""
        file_path, _ = QFileDialog.getOpenFileName(
            self, "选择图片", "", "图片文件 (*.png *.jpg *.jpeg *.bmp)"
        )
        
        if file_path:
            self.current_image_path = file_path
            self.display_image(file_path, self.original_label)
            self.result_label.setText("抠图结果")
            self.result_label.setPixmap(QPixmap())
            self.process_btn.setEnabled(True)
            self.download_btn.setEnabled(False)
            self.status_label.setText("图片上传成功，点击'开始抠图'处理")

    def display_image(self, image_path, label):
        """在标签中显示图片"""
        pixmap = QPixmap(image_path)
        
        # 调整图片大小以适应标签
        scaled_pixmap = pixmap.scaled(
            label.size(), Qt.KeepAspectRatio, Qt.SmoothTransformation
        )
        
        label.setPixmap(scaled_pixmap)
        label.setAlignment(Qt.AlignCenter)

    def preprocess_image(self, image_path):
        """预处理图片"""
        image = Image.open(image_path).convert("RGB")
        original_size = image.size
        
        # 调整图片大小
        max_size = 1024
        if max(original_size) > max_size:
            ratio = max_size / max(original_size)
            new_size = tuple(int(x * ratio) for x in original_size)
            image = image.resize(new_size, Image.LANCZOS)
        
        # 转换为numpy数组
        image = np.array(image).astype(np.float32) / 255.0
        image = image.transpose(2, 0, 1)
        image = np.expand_dims(image, axis=0)
        
        # 标准化
        mean = np.array([0.485, 0.456, 0.406]).reshape((1, 3, 1, 1))
        std = np.array([0.229, 0.224, 0.225]).reshape((1, 3, 1, 1))
        image = (image - mean) / std
        
        return image, original_size

    def process_image(self):
        """处理图片，移除背景"""
        if not self.current_image_path or not self.session:
            return
        
        try:
            self.status_label.setText("正在处理图片...")
            self.progress_bar.setVisible(True)
            self.progress_bar.setValue(20)
            
            # 预处理图片
            input_image, original_size = self.preprocess_image(self.current_image_path)
            self.progress_bar.setValue(40)
            
            # 模型推理
            input_name = self.session.get_inputs()[0].name
            output_name = self.session.get_outputs()[0].name
            output = self.session.run([output_name], {input_name: input_image})[0]
            self.progress_bar.setValue(70)
            
            # 后处理
            mask = output[0, 0]
            mask = (mask * 255).astype(np.uint8)
            
            # 读取原图
            original_image = Image.open(self.current_image_path).convert("RGBA")
            
            # 调整mask大小以匹配原图
            mask_image = Image.fromarray(mask).resize(original_image.size, Image.LANCZOS)
            
            # 应用mask
            result = Image.new("RGBA", original_image.size)
            for i in range(original_image.size[0]):
                for j in range(original_image.size[1]):
                    r, g, b, a = original_image.getpixel((i, j))
                    mask_value = mask_image.getpixel((i, j))
                    result.putpixel((i, j), (r, g, b, mask_value))
            
            self.current_result = result
            self.progress_bar.setValue(100)
            
            # 显示结果
            self.display_result(result)
            self.download_btn.setEnabled(True)
            self.status_label.setText("背景移除完成")
            
        except Exception as e:
            QMessageBox.critical(self, "错误", f"处理失败: {str(e)}")
            self.status_label.setText("处理失败")
        finally:
            self.progress_bar.setVisible(False)

    def display_result(self, result_image):
        """显示处理结果"""
        # 转换PIL图像为QPixmap
        img_data = np.array(result_image)
        height, width, channel = img_data.shape
        bytes_per_line = 3 * width
        
        # 如果是RGBA格式，需要调整通道
        if channel == 4:
            q_img = QImage(img_data.data, width, height, 4 * width, QImage.Format_RGBA8888)
        else:
            q_img = QImage(img_data.data, width, height, bytes_per_line, QImage.Format_RGB888)
        
        pixmap = QPixmap.fromImage(q_img)
        scaled_pixmap = pixmap.scaled(
            self.result_label.size(), Qt.KeepAspectRatio, Qt.SmoothTransformation
        )
        
        self.result_label.setPixmap(scaled_pixmap)
        self.result_label.setAlignment(Qt.AlignCenter)

    def download_result(self):
        """下载处理结果"""
        if not self.current_result:
            return
        
        file_path, _ = QFileDialog.getSaveFileName(
            self, "保存结果", "", "PNG图片 (*.png)", options=QFileDialog.Options()
        )
        
        if file_path:
            try:
                self.current_result.save(file_path, "PNG")
                self.status_label.setText(f"结果已保存到: {file_path}")
                QMessageBox.information(self, "成功", "图片保存成功")
            except Exception as e:
                QMessageBox.critical(self, "错误", f"保存失败: {str(e)}")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = BackgroundRemoverApp()
    window.show()
    sys.exit(app.exec_())
