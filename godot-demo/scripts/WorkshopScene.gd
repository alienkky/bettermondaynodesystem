# WorkshopScene.gd — 7×7 머지 보드. 드래그&드롭으로 이동/합성
extends Control

const CELL_SIZE := 56
const BOARD_SIZE := 7

@onready var title: Label = $VBox/Title
@onready var grid: GridContainer = $VBox/BoardPanel/Grid
@onready var spawn_btn: Button = $VBox/BottomBar/SpawnBtn
@onready var hint: Label = $VBox/Hint

var cell_nodes: Array = []  # [y][x] → PanelContainer
var dragging: bool = false
var drag_from: Vector2i
var drag_ghost: Label

func _ready() -> void:
	title.text = "🧪 작업실 — 머지 보드"
	title.add_theme_font_size_override("font_size", DesignTokens.FS_H1)
	title.add_theme_color_override("font_color", DesignTokens.ROAST_DEEP)
	hint.text = "💡 같은 원소 + 같은 등급 슬라임을 겹치면 합성! 드래그로 이동."
	hint.add_theme_font_size_override("font_size", DesignTokens.FS_CAPTION)
	hint.add_theme_color_override("font_color", DesignTokens.FG_3)

	spawn_btn.text = "+ 슬라임 소환 (⚡1)"
	_style_btn(spawn_btn)
	spawn_btn.pressed.connect(func(): GameState.spawn_random_slime())

	_build_grid()
	_redraw_all()
	GameState.slime_added.connect(func(_c, _s): _redraw_all())
	GameState.slime_moved.connect(func(_a, _b): _redraw_all())
	GameState.slime_merged.connect(func(c, _g): _redraw_all(); _flash_cell(c))

func _style_btn(b: Button) -> void:
	var sb = StyleBoxFlat.new()
	sb.bg_color = DesignTokens.ROAST
	sb.corner_radius_top_left = DesignTokens.R_MD
	sb.corner_radius_top_right = DesignTokens.R_MD
	sb.corner_radius_bottom_left = DesignTokens.R_MD
	sb.corner_radius_bottom_right = DesignTokens.R_MD
	sb.content_margin_left = DesignTokens.S_4
	sb.content_margin_right = DesignTokens.S_4
	sb.content_margin_top = DesignTokens.S_3
	sb.content_margin_bottom = DesignTokens.S_3
	b.add_theme_stylebox_override("normal", sb)
	b.add_theme_color_override("font_color", DesignTokens.CREAM)
	b.add_theme_font_size_override("font_size", DesignTokens.FS_BODY)

func _build_grid() -> void:
	grid.columns = BOARD_SIZE
	grid.add_theme_constant_override("h_separation", 4)
	grid.add_theme_constant_override("v_separation", 4)
	var panel_sb = StyleBoxFlat.new()
	panel_sb.bg_color = DesignTokens.CREAM_WARM
	panel_sb.corner_radius_top_left = DesignTokens.R_LG
	panel_sb.corner_radius_top_right = DesignTokens.R_LG
	panel_sb.corner_radius_bottom_left = DesignTokens.R_LG
	panel_sb.corner_radius_bottom_right = DesignTokens.R_LG
	panel_sb.content_margin_left = DesignTokens.S_3
	panel_sb.content_margin_right = DesignTokens.S_3
	panel_sb.content_margin_top = DesignTokens.S_3
	panel_sb.content_margin_bottom = DesignTokens.S_3
	$VBox/BoardPanel.add_theme_stylebox_override("panel", panel_sb)

	cell_nodes.clear()
	for y in BOARD_SIZE:
		var row = []
		for x in BOARD_SIZE:
			var cell = PanelContainer.new()
			cell.custom_minimum_size = Vector2(CELL_SIZE, CELL_SIZE)
			cell.mouse_filter = Control.MOUSE_FILTER_STOP
			cell.set_meta("cx", x); cell.set_meta("cy", y)
			_style_cell(cell, false)
			var lab = Label.new()
			lab.name = "Glyph"
			lab.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			lab.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
			lab.add_theme_font_size_override("font_size", 26)
			cell.add_child(lab)
			cell.gui_input.connect(func(ev): _on_cell_input(ev, Vector2i(x, y)))
			grid.add_child(cell)
			row.append(cell)
		cell_nodes.append(row)

func _style_cell(cell: PanelContainer, highlight: bool) -> void:
	var sb = StyleBoxFlat.new()
	sb.bg_color = DesignTokens.BOARD_HILITE if highlight else DesignTokens.BOARD_CELL
	sb.corner_radius_top_left = DesignTokens.R_SM
	sb.corner_radius_top_right = DesignTokens.R_SM
	sb.corner_radius_bottom_left = DesignTokens.R_SM
	sb.corner_radius_bottom_right = DesignTokens.R_SM
	sb.border_color = DesignTokens.BORDER_CARD
	sb.border_width_left = 1; sb.border_width_right = 1
	sb.border_width_top = 1; sb.border_width_bottom = 1
	cell.add_theme_stylebox_override("panel", sb)

func _redraw_all() -> void:
	for y in BOARD_SIZE:
		for x in BOARD_SIZE:
			var cell = cell_nodes[y][x]
			var slime = GameState.get_cell(Vector2i(x, y))
			var lab = cell.get_node("Glyph")
			if slime == null:
				lab.text = ""
				_style_cell(cell, false)
			else:
				var c = DesignTokens.element_colors(slime.element)
				lab.text = c.glyph
				var sb = StyleBoxFlat.new()
				sb.bg_color = c.bg
				sb.border_color = c.main
				sb.border_width_left = 2; sb.border_width_right = 2
				sb.border_width_top = 2; sb.border_width_bottom = 2
				sb.corner_radius_top_left = DesignTokens.R_SM
				sb.corner_radius_top_right = DesignTokens.R_SM
				sb.corner_radius_bottom_left = DesignTokens.R_SM
				sb.corner_radius_bottom_right = DesignTokens.R_SM
				cell.add_theme_stylebox_override("panel", sb)
				lab.add_theme_color_override("font_color", c.fg)
				# grade badge: small number
				if slime.grade > 1:
					lab.text = "%s%d" % [c.glyph, slime.grade]

func _on_cell_input(ev: InputEvent, cell: Vector2i) -> void:
	if ev is InputEventMouseButton:
		if ev.button_index == MOUSE_BUTTON_LEFT:
			if ev.pressed:
				var slime = GameState.get_cell(cell)
				if slime != null:
					dragging = true
					drag_from = cell
					_make_ghost(slime)
			else:
				if dragging:
					var to = _cell_under_mouse()
					if to.x >= 0:
						GameState.try_move(drag_from, to)
					_end_drag()
	elif ev is InputEventMouseMotion and dragging:
		if drag_ghost:
			drag_ghost.global_position = get_global_mouse_position() - Vector2(20, 20)

func _make_ghost(slime: Dictionary) -> void:
	if drag_ghost: drag_ghost.queue_free()
	var c = DesignTokens.element_colors(slime.element)
	drag_ghost = Label.new()
	drag_ghost.text = c.glyph if slime.grade == 1 else "%s%d" % [c.glyph, slime.grade]
	drag_ghost.add_theme_font_size_override("font_size", 30)
	drag_ghost.modulate = Color(1,1,1,0.85)
	drag_ghost.z_index = 100
	drag_ghost.mouse_filter = Control.MOUSE_FILTER_IGNORE
	$GhostLayer.add_child(drag_ghost)
	drag_ghost.global_position = get_global_mouse_position() - Vector2(20, 20)

func _end_drag() -> void:
	dragging = false
	if drag_ghost:
		drag_ghost.queue_free()
		drag_ghost = null

func _cell_under_mouse() -> Vector2i:
	var mp = get_global_mouse_position()
	for y in BOARD_SIZE:
		for x in BOARD_SIZE:
			var r = cell_nodes[y][x].get_global_rect()
			if r.has_point(mp):
				return Vector2i(x, y)
	return Vector2i(-1, -1)

func _flash_cell(cell: Vector2i) -> void:
	var c = cell_nodes[cell.y][cell.x]
	var tw = create_tween()
	tw.tween_property(c, "scale", Vector2(1.18, 1.18), DesignTokens.DUR_FAST)
	tw.tween_property(c, "scale", Vector2.ONE, DesignTokens.DUR_BASE)
