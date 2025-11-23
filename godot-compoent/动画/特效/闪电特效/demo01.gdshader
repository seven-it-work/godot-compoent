shader_type canvas_item;

// 可调阈值：数值越小，仅纯黑会被透明；越大，偏黑的区域也会透明
uniform float black_threshold : hint_range(0.0, 1.0, 0.01) = 0.05;

void fragment() {
    // 获取原图纹理颜色
    vec4 original_color = texture(TEXTURE, UV);

    // 计算像素的亮度（RGB通道的平均值，判断是否为黑色）
    float brightness = (original_color.r + original_color.g + original_color.b) / 3.0;

    // 如果亮度低于阈值，设为完全透明；否则保留原颜色
    if (brightness < black_threshold) {
        COLOR = vec4(original_color.rgb, 0.0);
    } else {
        COLOR = original_color;
    }
}