# DexScene.gd — 도감: 오행 5종 카드 그리드
extends Control

func _ready() -> void:
	var title: Label = $VBox/Title
	title.text = "📚 도감 — 오행"
	title.add_theme_font_size_override("font_size", DesignTokens.FS_H1)
	title.add_theme_color_override("font_color", DesignTokens.ROAST_DEEP)
	var sub: Label = $VBox/Subtitle
	sub.text = "다섯 원소는 서로 상생·상극을 이룬다"
	sub.add_theme_font_size_override("font_size", DesignTokens.FS_LABEL)
	sub.add_theme_color_override("font_color", DesignTokens.FG_2)

	var grid: GridContainer = $VBox/Grid
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", DesignTokens.S_3)
	grid.add_theme_constant_override("v_separation", DesignTokens.S_3)
	for el in GameState.ELEMENTS:
		grid.add_child(_make_card(el))

func _make_card(el: String) -> Control:
	var c = DesignTokens.element_colors(el)
	var panel = PanelContainer.new()
	panel.custom_minimum_size = Vector2(0, 120)
	var sb = StyleBoxFlat.new()
	sb.bg_color = c.bg
	sb.corner_radius_top_left = DesignTokens.R_LG
	sb.corner_radius_top_right = DesignTokens.R_LG
	sb.corner_radius_bottom_left = DesignTokens.R_LG
	sb.corner_radius_bottom_right = DesignTokens.R_LG
	sb.border_color = c.main
	sb.border_width_left = 2; sb.border_width_right = 2
	sb.border_width_top = 2; sb.border_width_bottom = 2
	sb.content_margin_left = DesignTokens.S_3
	sb.content_margin_right = DesignTokens.S_3
	sb.content_margin_top = DesignTokens.S_3
	sb.content_margin_bottom = DesignTokens.S_3
	panel.add_theme_stylebox_override("panel", sb)
	var vb = VBoxContainer.new()
	vb.add_theme_constant_override("separation", DesignTokens.S_1)
	panel.add_child(vb)
	var g = Label.new()
	g.text = c.glyph
	g.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	g.add_theme_font_size_override("font_size", 40)
	vb.add_child(g)
	var l = Label.new()
	l.text = "%s · %s" % [c.label, el.capitalize()]
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.add_theme_font_size_override("font_size", DesignTokens.FS_H3)
	l.add_theme_color_override("font_color", c.fg)
	vb.add_child(l)
	return panel
