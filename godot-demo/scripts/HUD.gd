# HUD.gd — 상단 코인/젬/에너지/레벨 표시
extends PanelContainer

@onready var coin_l: Label = $HBox/Coin/Value
@onready var gem_l: Label = $HBox/Gem/Value
@onready var energy_l: Label = $HBox/Energy/Value
@onready var level_l: Label = $HBox/Level/Value
@onready var exp_bar: ProgressBar = $HBox/Level/ExpBar

func _ready() -> void:
	_style()
	GameState.coin_changed.connect(func(v): coin_l.text = str(v))
	GameState.gem_changed.connect(func(v): gem_l.text = str(v))
	GameState.energy_changed.connect(func(v): energy_l.text = "%d/%d" % [v, GameState.energy_max])
	GameState.exp_changed.connect(func(v, need):
		exp_bar.max_value = need
		exp_bar.value = v
		level_l.text = "Lv %d" % GameState.level)
	coin_l.text = str(GameState.coin)
	gem_l.text = str(GameState.gem)
	energy_l.text = "%d/%d" % [GameState.energy, GameState.energy_max]
	level_l.text = "Lv %d" % GameState.level
	exp_bar.max_value = GameState.exp_need()
	exp_bar.value = GameState.exp

func _style() -> void:
	var sb = StyleBoxFlat.new()
	sb.bg_color = DesignTokens.CREAM
	sb.corner_radius_bottom_left = DesignTokens.R_LG
	sb.corner_radius_bottom_right = DesignTokens.R_LG
	sb.border_color = DesignTokens.BORDER_CARD
	sb.border_width_bottom = 1
	sb.shadow_color = DesignTokens.SH_SM_COLOR
	sb.shadow_size = DesignTokens.SH_SM_SIZE
	sb.shadow_offset = DesignTokens.SH_SM_OFFSET
	add_theme_stylebox_override("panel", sb)

	for chip_path in ["HBox/Coin", "HBox/Gem", "HBox/Energy", "HBox/Level"]:
		var chip = get_node(chip_path)
		var cs = StyleBoxFlat.new()
		cs.bg_color = DesignTokens.CREAM_WARM
		cs.corner_radius_top_left = DesignTokens.R_MD
		cs.corner_radius_top_right = DesignTokens.R_MD
		cs.corner_radius_bottom_left = DesignTokens.R_MD
		cs.corner_radius_bottom_right = DesignTokens.R_MD
		cs.content_margin_left = DesignTokens.S_3
		cs.content_margin_right = DesignTokens.S_3
		cs.content_margin_top = DesignTokens.S_2
		cs.content_margin_bottom = DesignTokens.S_2
		chip.add_theme_stylebox_override("panel", cs)
		var val = chip.get_node("Value")
		val.add_theme_font_size_override("font_size", DesignTokens.FS_H3)
		val.add_theme_color_override("font_color", DesignTokens.INK)
		var icon = chip.get_node("Icon")
		icon.add_theme_font_size_override("font_size", DesignTokens.FS_H2)

	exp_bar.add_theme_stylebox_override("background", _bar_bg())
	exp_bar.add_theme_stylebox_override("fill", _bar_fill())

func _bar_bg() -> StyleBoxFlat:
	var s = StyleBoxFlat.new()
	s.bg_color = DesignTokens.BORDER_HAIR
	s.corner_radius_top_left = DesignTokens.R_PILL
	s.corner_radius_top_right = DesignTokens.R_PILL
	s.corner_radius_bottom_left = DesignTokens.R_PILL
	s.corner_radius_bottom_right = DesignTokens.R_PILL
	return s

func _bar_fill() -> StyleBoxFlat:
	var s = StyleBoxFlat.new()
	s.bg_color = DesignTokens.ACCENT
	s.corner_radius_top_left = DesignTokens.R_PILL
	s.corner_radius_top_right = DesignTokens.R_PILL
	s.corner_radius_bottom_left = DesignTokens.R_PILL
	s.corner_radius_bottom_right = DesignTokens.R_PILL
	return s
