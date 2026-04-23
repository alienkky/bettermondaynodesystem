# SettingsScene.gd
extends Control

func _ready() -> void:
	var title: Label = $VBox/Title
	title.text = "⚙ 설정"
	title.add_theme_font_size_override("font_size", DesignTokens.FS_H1)
	title.add_theme_color_override("font_color", DesignTokens.ROAST_DEEP)

	var info: Label = $VBox/Info
	info.text = "플레이어: %s\n원소: %s\n레벨: %d" % [
		GameState.player_name,
		DesignTokens.element_colors(GameState.player_element).label,
		GameState.level]
	info.add_theme_font_size_override("font_size", DesignTokens.FS_BODY)
	info.add_theme_color_override("font_color", DesignTokens.INK)

	var save_btn: Button = $VBox/SaveBtn
	save_btn.text = "💾 지금 저장"
	_style_btn(save_btn, DesignTokens.ROAST, DesignTokens.CREAM)
	save_btn.pressed.connect(func():
		SaveLoad.save_game()
		GameState.toast.emit("저장 완료"))

	var reset_btn: Button = $VBox/ResetBtn
	reset_btn.text = "🔄 데이터 초기화"
	_style_btn(reset_btn, DesignTokens.DANGER, DesignTokens.CREAM)
	reset_btn.pressed.connect(func():
		SaveLoad.reset()
		GameState.toast.emit("다시 시작하려면 앱 재실행"))

func _style_btn(b: Button, bg: Color, fg: Color) -> void:
	var sb = StyleBoxFlat.new()
	sb.bg_color = bg
	sb.corner_radius_top_left = DesignTokens.R_MD
	sb.corner_radius_top_right = DesignTokens.R_MD
	sb.corner_radius_bottom_left = DesignTokens.R_MD
	sb.corner_radius_bottom_right = DesignTokens.R_MD
	sb.content_margin_left = DesignTokens.S_4
	sb.content_margin_right = DesignTokens.S_4
	sb.content_margin_top = DesignTokens.S_3
	sb.content_margin_bottom = DesignTokens.S_3
	b.add_theme_stylebox_override("normal", sb)
	b.add_theme_color_override("font_color", fg)
	b.add_theme_font_size_override("font_size", DesignTokens.FS_BODY)
