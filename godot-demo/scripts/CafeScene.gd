# CafeScene.gd — 카페 화면: 주문 슬롯 + 손님 받기 + 원소 배달 버튼
extends Control

@onready var title: Label = $VBox/Title
@onready var subtitle: Label = $VBox/Subtitle
@onready var order_row: HBoxContainer = $VBox/OrderRow
@onready var deliver_row: HBoxContainer = $VBox/DeliverRow
@onready var spawn_btn: Button = $VBox/BottomBar/SpawnBtn
@onready var hint: Label = $VBox/Hint

var order_cards: Dictionary = {}  # id -> Control
var spawn_timer: float = 0.0

func _ready() -> void:
	_style_panel()
	title.text = "🏪 원두 카페"
	title.add_theme_font_size_override("font_size", DesignTokens.FS_H1)
	title.add_theme_color_override("font_color", DesignTokens.ROAST_DEEP)
	subtitle.text = "손님의 원소에 맞는 슬라임을 배달하세요"
	subtitle.add_theme_font_size_override("font_size", DesignTokens.FS_LABEL)
	subtitle.add_theme_color_override("font_color", DesignTokens.FG_2)
	hint.text = "💡 작업실에서 같은 원소 슬라임 2개를 합성하면 등급업!"
	hint.add_theme_font_size_override("font_size", DesignTokens.FS_CAPTION)
	hint.add_theme_color_override("font_color", DesignTokens.FG_3)

	spawn_btn.text = "🔔 손님 받기"
	_style_btn(spawn_btn, DesignTokens.ROAST, DesignTokens.CREAM)
	spawn_btn.pressed.connect(func(): GameState.spawn_order())

	_build_deliver_buttons()
	GameState.order_added.connect(_on_order_added)
	GameState.order_removed.connect(_on_order_removed)

	# 초기 주문 2개
	GameState.spawn_order()
	GameState.spawn_order()

func _process(delta: float) -> void:
	if not visible: return
	GameState.tick_orders(delta)
	for id in order_cards.keys():
		var card = order_cards[id]
		if not is_instance_valid(card): continue
		var o = _find_order(id)
		if o == null: continue
		var bar: ProgressBar = card.get_node("TimerBar")
		bar.max_value = o.max_timer
		bar.value = o.timer
	spawn_timer += delta
	if spawn_timer >= 12.0:
		spawn_timer = 0.0
		if GameState.orders.size() < 4:
			GameState.spawn_order()

func _style_panel() -> void:
	var sb = StyleBoxFlat.new()
	sb.bg_color = DesignTokens.PAPER
	add_theme_stylebox_override("panel", sb)

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
	sb.shadow_color = DesignTokens.SH_SM_COLOR
	sb.shadow_size = DesignTokens.SH_SM_SIZE
	sb.shadow_offset = DesignTokens.SH_SM_OFFSET
	b.add_theme_stylebox_override("normal", sb)
	var sb_h = sb.duplicate() as StyleBoxFlat
	sb_h.bg_color = bg.lightened(0.08)
	b.add_theme_stylebox_override("hover", sb_h)
	var sb_p = sb.duplicate() as StyleBoxFlat
	sb_p.bg_color = bg.darkened(0.1)
	b.add_theme_stylebox_override("pressed", sb_p)
	b.add_theme_color_override("font_color", fg)
	b.add_theme_color_override("font_hover_color", fg)
	b.add_theme_color_override("font_pressed_color", fg)
	b.add_theme_font_size_override("font_size", DesignTokens.FS_BODY)

func _build_deliver_buttons() -> void:
	for c in deliver_row.get_children(): c.queue_free()
	for el in GameState.ELEMENTS:
		var c = DesignTokens.element_colors(el)
		var b = Button.new()
		b.text = "%s %s" % [c.glyph, c.label]
		b.custom_minimum_size = Vector2(0, 48)
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		_style_btn(b, c.main, c.fg if c.main.get_luminance() > 0.6 else DesignTokens.CREAM)
		b.pressed.connect(func():
			if not GameState.try_deliver(el):
				GameState.toast.emit("해당 원소 주문 없음"))
		deliver_row.add_child(b)

func _on_order_added(o: Dictionary) -> void:
	var card = _make_order_card(o)
	order_cards[o.id] = card
	order_row.add_child(card)

func _on_order_removed(id: int) -> void:
	if order_cards.has(id):
		var card = order_cards[id]
		order_cards.erase(id)
		if is_instance_valid(card):
			var tw = create_tween()
			tw.tween_property(card, "modulate:a", 0.0, DesignTokens.DUR_FAST)
			tw.tween_callback(func(): card.queue_free())

func _find_order(id: int):
	for o in GameState.orders:
		if o.id == id: return o
	return null

func _make_order_card(o: Dictionary) -> Control:
	var c = DesignTokens.element_colors(o.element)
	var panel = PanelContainer.new()
	panel.custom_minimum_size = Vector2(88, 110)
	var sb = StyleBoxFlat.new()
	sb.bg_color = c.bg
	sb.border_color = c.main
	sb.border_width_left = 2; sb.border_width_right = 2
	sb.border_width_top = 2; sb.border_width_bottom = 2
	sb.corner_radius_top_left = DesignTokens.R_MD
	sb.corner_radius_top_right = DesignTokens.R_MD
	sb.corner_radius_bottom_left = DesignTokens.R_MD
	sb.corner_radius_bottom_right = DesignTokens.R_MD
	sb.content_margin_left = DesignTokens.S_2
	sb.content_margin_right = DesignTokens.S_2
	sb.content_margin_top = DesignTokens.S_2
	sb.content_margin_bottom = DesignTokens.S_2
	panel.add_theme_stylebox_override("panel", sb)

	var vb = VBoxContainer.new()
	vb.add_theme_constant_override("separation", DesignTokens.S_1)
	panel.add_child(vb)

	var glyph = Label.new()
	glyph.text = c.glyph
	glyph.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	glyph.add_theme_font_size_override("font_size", 32)
	vb.add_child(glyph)

	var lab = Label.new()
	lab.text = c.label
	lab.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lab.add_theme_font_size_override("font_size", DesignTokens.FS_LABEL)
	lab.add_theme_color_override("font_color", c.fg)
	vb.add_child(lab)

	var bar = ProgressBar.new()
	bar.name = "TimerBar"
	bar.show_percentage = false
	bar.custom_minimum_size = Vector2(0, 6)
	bar.max_value = o.max_timer
	bar.value = o.timer
	var bg = StyleBoxFlat.new(); bg.bg_color = DesignTokens.BORDER_HAIR
	bg.corner_radius_top_left = DesignTokens.R_PILL
	bg.corner_radius_top_right = DesignTokens.R_PILL
	bg.corner_radius_bottom_left = DesignTokens.R_PILL
	bg.corner_radius_bottom_right = DesignTokens.R_PILL
	var fg = StyleBoxFlat.new(); fg.bg_color = c.main
	fg.corner_radius_top_left = DesignTokens.R_PILL
	fg.corner_radius_top_right = DesignTokens.R_PILL
	fg.corner_radius_bottom_left = DesignTokens.R_PILL
	fg.corner_radius_bottom_right = DesignTokens.R_PILL
	bar.add_theme_stylebox_override("background", bg)
	bar.add_theme_stylebox_override("fill", fg)
	vb.add_child(bar)
	return panel
