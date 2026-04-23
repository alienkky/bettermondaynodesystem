# Main.gd — 앱 루트. 하단 탭으로 카페/작업실/도감/설정 전환
extends Control

@onready var hud: Node = $HUD
@onready var stack: Control = $Stack
@onready var cafe: Control = $Stack/Cafe
@onready var workshop: Control = $Stack/Workshop
@onready var dex: Control = $Stack/Dex
@onready var settings_scene: Control = $Stack/Settings
@onready var tab_cafe: Button = $TabBar/HBox/TabCafe
@onready var tab_work: Button = $TabBar/HBox/TabWork
@onready var tab_dex: Button  = $TabBar/HBox/TabDex
@onready var tab_set: Button  = $TabBar/HBox/TabSet
@onready var toast_label: Label = $ToastLayer/Toast
@onready var levelup: Control = $ModalLayer/LevelUp
@onready var levelup_label: Label = $ModalLayer/LevelUp/Panel/VBox/Title

func _ready() -> void:
	_style_root()
	_style_tabs()
	_switch_to(cafe, tab_cafe)
	tab_cafe.pressed.connect(func(): _switch_to(cafe, tab_cafe))
	tab_work.pressed.connect(func(): _switch_to(workshop, tab_work))
	tab_dex.pressed.connect(func(): _switch_to(dex, tab_dex))
	tab_set.pressed.connect(func(): _switch_to(settings_scene, tab_set))
	GameState.toast.connect(_on_toast)
	GameState.level_up.connect(_on_level_up)
	$ModalLayer/LevelUp/Panel/VBox/CloseBtn.pressed.connect(func():
		levelup.visible = false
		GameState.add_coin(50); GameState.add_gem(1))
	levelup.visible = false
	toast_label.visible = false

func _style_root() -> void:
	var bg = StyleBoxFlat.new()
	bg.bg_color = DesignTokens.PAPER
	$Background.add_theme_stylebox_override("panel", bg)

func _style_tabs() -> void:
	for b in [tab_cafe, tab_work, tab_dex, tab_set]:
		b.add_theme_font_size_override("font_size", DesignTokens.FS_LABEL)

func _switch_to(scene: Control, btn: Button) -> void:
	for c in stack.get_children():
		c.visible = (c == scene)
	for b in [tab_cafe, tab_work, tab_dex, tab_set]:
		var sb = StyleBoxFlat.new()
		sb.bg_color = DesignTokens.CREAM if b != btn else DesignTokens.ROAST
		sb.corner_radius_top_left = DesignTokens.R_SM
		sb.corner_radius_top_right = DesignTokens.R_SM
		sb.corner_radius_bottom_left = DesignTokens.R_SM
		sb.corner_radius_bottom_right = DesignTokens.R_SM
		b.add_theme_stylebox_override("normal", sb)
		b.add_theme_stylebox_override("hover", sb)
		b.add_theme_stylebox_override("pressed", sb)
		b.add_theme_color_override("font_color",
			DesignTokens.INK if b != btn else DesignTokens.CREAM)

func _on_toast(msg: String) -> void:
	toast_label.text = msg
	toast_label.visible = true
	toast_label.modulate = Color(1,1,1,1)
	var tw = create_tween()
	tw.tween_interval(1.4)
	tw.tween_property(toast_label, "modulate:a", 0.0, 0.4)
	tw.tween_callback(func(): toast_label.visible = false)

func _on_level_up(lv: int) -> void:
	levelup_label.text = "레벨 %d 달성!" % lv
	levelup.visible = true
	levelup.modulate = Color(1,1,1,0)
	create_tween().tween_property(levelup, "modulate:a", 1.0, DesignTokens.DUR_BASE)
