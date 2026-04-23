# GameState.gd — 중앙 상태 싱글턴
# 모든 게임 데이터는 여기. UI는 signal로 구독.
extends Node

signal coin_changed(v: int)
signal gem_changed(v: int)
signal energy_changed(v: int)
signal exp_changed(v: int, need: int)
signal level_up(new_lv: int)
signal order_added(order: Dictionary)
signal order_removed(id: int)
signal order_completed(id: int, success: bool)
signal slime_added(cell: Vector2i, slime: Dictionary)
signal slime_moved(from_cell: Vector2i, to_cell: Vector2i)
signal slime_merged(cell: Vector2i, new_grade: int)
signal toast(msg: String)

var coin: int = 150
var gem: int = 10
var energy: int = 20
var energy_max: int = 20
var level: int = 1
var exp: int = 0
var player_name: String = "사장님"
var player_element: String = "fire"

var orders: Array = []        # [{id, element, timer, max_timer}]
var next_order_id: int = 1

# 7×7 merge board; null = empty, dict{element, grade} = slime
var board: Array = []
const BOARD_SIZE := 7

const ELEMENTS := ["wood", "fire", "earth", "metal", "water"]

func _ready() -> void:
	_init_board()

func _init_board() -> void:
	board.clear()
	for y in BOARD_SIZE:
		var row = []
		for x in BOARD_SIZE:
			row.append(null)
		board.append(row)
	# seed a few starter slimes
	set_cell(Vector2i(1,1), {"element":"fire",  "grade":1})
	set_cell(Vector2i(2,1), {"element":"fire",  "grade":1})
	set_cell(Vector2i(3,3), {"element":"water", "grade":1})
	set_cell(Vector2i(4,3), {"element":"water", "grade":1})
	set_cell(Vector2i(2,4), {"element":"wood",  "grade":2})

func get_cell(cell: Vector2i):
	if cell.x < 0 or cell.y < 0 or cell.x >= BOARD_SIZE or cell.y >= BOARD_SIZE:
		return null
	return board[cell.y][cell.x]

func set_cell(cell: Vector2i, slime) -> void:
	board[cell.y][cell.x] = slime

# ─ Currency ──────────────────────────────────────────────────────────
func add_coin(n: int) -> void: coin += n; coin_changed.emit(coin)
func spend_coin(n: int) -> bool:
	if coin < n: toast.emit("코인 부족!"); return false
	coin -= n; coin_changed.emit(coin); return true
func add_gem(n: int) -> void: gem += n; gem_changed.emit(gem)
func add_energy(n: int) -> void:
	energy = min(energy + n, energy_max); energy_changed.emit(energy)
func spend_energy(n: int) -> bool:
	if energy < n: toast.emit("에너지 부족!"); return false
	energy -= n; energy_changed.emit(energy); return true

func exp_need() -> int: return 20 + level * 15
func add_exp(n: int) -> void:
	exp += n
	while exp >= exp_need():
		exp -= exp_need()
		level += 1
		level_up.emit(level)
	exp_changed.emit(exp, exp_need())

# ─ Orders ────────────────────────────────────────────────────────────
func spawn_order() -> void:
	var el = ELEMENTS[randi() % ELEMENTS.size()]
	var ord = {"id": next_order_id, "element": el, "timer": 30.0, "max_timer": 30.0}
	next_order_id += 1
	orders.append(ord)
	order_added.emit(ord)

func tick_orders(delta: float) -> void:
	var to_remove = []
	for o in orders:
		o.timer -= delta
		if o.timer <= 0:
			to_remove.append(o.id)
	for id in to_remove:
		complete_order(id, false)

func complete_order(id: int, success: bool) -> void:
	for i in orders.size():
		if orders[i].id == id:
			var o = orders[i]
			orders.remove_at(i)
			order_removed.emit(id)
			order_completed.emit(id, success)
			if success:
				add_coin(12)
				add_exp(8)
				toast.emit("+12 💰  +8 EXP")
			else:
				toast.emit("주문 실패…")
			return

func try_deliver(element: String) -> bool:
	for o in orders:
		if o.element == element:
			complete_order(o.id, true)
			return true
	return false

# ─ Board / Merge ─────────────────────────────────────────────────────
func try_move(from_c: Vector2i, to_c: Vector2i) -> String:
	var a = get_cell(from_c)
	if a == null: return "none"
	var b = get_cell(to_c)
	if from_c == to_c: return "none"
	if b == null:
		set_cell(to_c, a)
		set_cell(from_c, null)
		slime_moved.emit(from_c, to_c)
		return "moved"
	if b.element == a.element and b.grade == a.grade and a.grade < 5:
		var new_grade = a.grade + 1
		set_cell(to_c, {"element": a.element, "grade": new_grade})
		set_cell(from_c, null)
		slime_merged.emit(to_c, new_grade)
		add_coin(new_grade * 5)
		add_exp(new_grade * 3)
		toast.emit("합성! 등급 %d" % new_grade)
		return "merged"
	return "blocked"

func spawn_random_slime() -> bool:
	if not spend_energy(1): return false
	var empty_cells = []
	for y in BOARD_SIZE:
		for x in BOARD_SIZE:
			if board[y][x] == null:
				empty_cells.append(Vector2i(x, y))
	if empty_cells.is_empty():
		toast.emit("보드가 가득 찼어요")
		add_energy(1)
		return false
	var cell = empty_cells[randi() % empty_cells.size()]
	var el = ELEMENTS[randi() % ELEMENTS.size()]
	set_cell(cell, {"element": el, "grade": 1})
	slime_added.emit(cell, board[cell.y][cell.x])
	return true

# ─ Save / Load ───────────────────────────────────────────────────────
func to_dict() -> Dictionary:
	return {
		"coin": coin, "gem": gem, "energy": energy,
		"level": level, "exp": exp,
		"player_name": player_name, "player_element": player_element,
		"board": board, "orders": orders, "next_order_id": next_order_id,
	}

func from_dict(d: Dictionary) -> void:
	coin = d.get("coin", coin)
	gem = d.get("gem", gem)
	energy = d.get("energy", energy)
	level = d.get("level", level)
	exp = d.get("exp", exp)
	player_name = d.get("player_name", player_name)
	player_element = d.get("player_element", player_element)
	board = d.get("board", board)
	orders = d.get("orders", orders)
	next_order_id = d.get("next_order_id", next_order_id)
	coin_changed.emit(coin); gem_changed.emit(gem); energy_changed.emit(energy)
	exp_changed.emit(exp, exp_need())
