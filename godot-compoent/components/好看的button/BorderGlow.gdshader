shader_type canvas_item;

// 跑马灯基础参数
uniform float border_width = 0.015;
uniform float dash_length = 0.3;
uniform float dash_speed = 2.0;
uniform int dash_count = 12;

// 方向控制
uniform bool clockwise = true;

// 多颜色支持 - 使用多个单独的color uniform代替数组
uniform vec4 color1 : source_color = vec4(1.0, 0.0, 0.0, 1.0);   // 红色
uniform vec4 color2 : source_color = vec4(0.0, 1.0, 0.0, 1.0);   // 绿色
uniform vec4 color3 : source_color = vec4(0.0, 0.0, 1.0, 1.0);   // 蓝色
uniform vec4 color4 : source_color = vec4(1.0, 1.0, 0.0, 1.0);   // 黄色
uniform vec4 color5 : source_color = vec4(1.0, 0.0, 1.0, 1.0);   // 粉色
uniform vec4 color6 : source_color = vec4(0.0, 1.0, 1.0, 1.0);   // 青色

// 颜色数量控制
uniform int color_count : hint_range(1, 6) = 4;

// 颜色动画控制
uniform float color_change_speed = 1.0;

void fragment() {
	float dist_left = UV.x;
	float dist_right = 1.0 - UV.x;
	float dist_top = UV.y;
	float dist_bottom = 1.0 - UV.y;
	
	float dist_to_edge = min(min(dist_left, dist_right), min(dist_top, dist_bottom));
	
	COLOR = vec4(0.0);
	
	if (dist_to_edge < border_width) {
		float perimeter = 4.0;
		float position_on_border = 0.0;
		
		// 方向计算
		if (clockwise) {
			if (dist_bottom <= dist_left && dist_bottom <= dist_right && dist_bottom <= dist_top) {
				position_on_border = UV.x;
			} else if (dist_right <= dist_top && dist_right <= dist_bottom) {
				position_on_border = 1.0 + (1.0 - UV.y);
			} else if (dist_top <= dist_left && dist_top <= dist_right) {
				position_on_border = 2.0 + (1.0 - UV.x);
			} else {
				position_on_border = 3.0 + UV.y;
			}
		} else {
			if (dist_left <= dist_top && dist_left <= dist_bottom) {
				position_on_border = 1.0 - UV.y;
			} else if (dist_top <= dist_left && dist_top <= dist_right) {
				position_on_border = 1.0 + UV.x;
			} else if (dist_right <= dist_top && dist_right <= dist_bottom) {
				position_on_border = 2.0 + UV.y;
			} else {
				position_on_border = 3.0 + (1.0 - UV.x);
			}
		}
		
		float dash_period = perimeter / float(dash_count);
		float dash_position = mod(position_on_border + TIME * dash_speed, dash_period);
		
		if (dash_position < dash_period * dash_length) {
			// 多颜色序列模式
			float color_progress = mod(position_on_border * 0.5 + TIME * color_change_speed, float(color_count));
			int color_index = int(floor(color_progress));
			
			// 根据索引选择颜色
			if (color_index == 0) COLOR = color1;
			else if (color_index == 1) COLOR = color2;
			else if (color_index == 2) COLOR = color3;
			else if (color_index == 3) COLOR = color4;
			else if (color_index == 4) COLOR = color5;
			else COLOR = color6;
		}
	}
}