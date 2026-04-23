# SaveLoad.gd — 주기적 저장 / 불러오기
extends Node

const PATH := "user://save.json"
var _timer: float = 0.0
const AUTOSAVE_INTERVAL := 30.0

func _ready() -> void:
	load_game()

func _process(delta: float) -> void:
	_timer += delta
	if _timer >= AUTOSAVE_INTERVAL:
		_timer = 0.0
		save_game()

func save_game() -> void:
	var f = FileAccess.open(PATH, FileAccess.WRITE)
	if f == null: return
	f.store_string(JSON.stringify(GameState.to_dict()))
	f.close()

func load_game() -> void:
	if not FileAccess.file_exists(PATH): return
	var f = FileAccess.open(PATH, FileAccess.READ)
	if f == null: return
	var text = f.get_as_text()
	f.close()
	var d = JSON.parse_string(text)
	if d is Dictionary:
		GameState.from_dict(d)

func reset() -> void:
	if FileAccess.file_exists(PATH):
		DirAccess.remove_absolute(ProjectSettings.globalize_path(PATH))
