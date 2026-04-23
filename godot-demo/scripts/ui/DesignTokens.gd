# BetterMonday Coffee Tycoon — Design Tokens
# Drop-in replacement for scripts/ui/DesignTokens.gd
# Generated from the Claude Design System (v1).
# Source of truth: colors_and_type.css in the design system project.
#
# 수정 규칙: 색/폰트/간격/반경을 바꿀 때는 이 파일만 고치세요.
# 모든 씬이 자동 반영됩니다.

extends Node
class_name DesignTokens

# ═══════════════════════════════════════════════════════════════════════
# BRAND — 따뜻한 원두 갈색 + 크림 + 단청 레드
# ═══════════════════════════════════════════════════════════════════════

const ROAST        := Color("6B3F2A")  # primary brand — 원두 갈색
const ROAST_DEEP   := Color("4A2A1C")  # header / pressed state
const CREAM        := Color("F7EFE2")  # card / surface
const CREAM_WARM   := Color("EFE3CC")  # sunken / input bg
const PAPER        := Color("FAF5EC")  # app background
const INK          := Color("1F1A17")  # primary text
const ACCENT       := Color("C8383C")  # 단청 red — CTA / fire element / live state

# ── Neutrals (text hierarchy) ──────────────────────────────────────────
const FG_1         := Color("1F1A17")  # titles
const FG_2         := Color("5A4E46")  # body secondary
const FG_3         := Color("8B7F76")  # tertiary / timestamps
const BORDER_CARD  := Color("E3D5BE")  # card border
const BORDER_HAIR  := Color("EAE0CE")  # hairline divider
const BG_SUNKEN    := Color("EFE3CC")  # inset areas

# ═══════════════════════════════════════════════════════════════════════
# 오행 (5 ELEMENTS) — 손님/플레이어 원소 색
# ═══════════════════════════════════════════════════════════════════════

const EL_WOOD      := Color("4E9A30")  # 목 — green
const EL_FIRE      := Color("C8383C")  # 화 — dancheong red  (== ACCENT)
const EL_EARTH     := Color("B8823A")  # 토 — clay
const EL_METAL     := Color("D4A64A")  # 금 — gold
const EL_WATER     := Color("3F7CA8")  # 수 — blue

# Element background (soft chip) + foreground (text on soft chip)
const EL_WOOD_BG   := Color("E3F3DA"); const EL_WOOD_FG  := Color("2E5A1E")
const EL_FIRE_BG   := Color("F8DEDF"); const EL_FIRE_FG  := Color("7A1F22")
const EL_EARTH_BG  := Color("F0E4D3"); const EL_EARTH_FG := Color("6B4A22")
const EL_METAL_BG  := Color("F8EED2"); const EL_METAL_FG := Color("7A5E14")
const EL_WATER_BG  := Color("DCEBF5"); const EL_WATER_FG := Color("2C5A82")

# ═══════════════════════════════════════════════════════════════════════
# 통화 (CURRENCY) + 상태 (STATUS)
# ═══════════════════════════════════════════════════════════════════════

const COIN         := Color("D4A64A")  # 코인
const GEM          := Color("7AA4C8")  # 보석
const ENERGY       := Color("E28A2B")  # 에너지
const SUCCESS      := Color("4E9A30")
const WARNING      := Color("E28A2B")
const DANGER       := Color("C8383C")
const INFO         := Color("3F7CA8")

# ═══════════════════════════════════════════════════════════════════════
# 보드 셀 (MERGE BOARD)
# ═══════════════════════════════════════════════════════════════════════

const BOARD_CELL   := Color("F3E8D2")  # unlocked cell
const BOARD_LOCKED := Color("C9B896")  # locked cell (dim)
const BOARD_HILITE := Color("FFF2C2")  # drop target / merge flash

# ═══════════════════════════════════════════════════════════════════════
# 타이포 (TYPE)
# ═══════════════════════════════════════════════════════════════════════

const FONT_SANS        := "Pretendard"            # UI 전반
const FONT_MONO        := "JetBrains Mono"        # 숫자 / 디버그

# Weights
const W_REGULAR   := 400
const W_MEDIUM    := 500
const W_SEMIBOLD  := 600
const W_BOLD      := 700
const W_EXTRABOLD := 800

# Sizes (px @ 1x mobile)
const FS_DISPLAY  := 34  # 타이틀 화면, 챕터 헤더
const FS_H1       := 24  # 씬 제목
const FS_H2       := 20  # 섹션
const FS_H3       := 17  # 카드 제목
const FS_BODY     := 15  # 본문
const FS_LABEL    := 13  # 라벨
const FS_CAPTION  := 11  # 캡션, 시간
const FS_DIALOGUE := 15  # 대화 (Pretendard 500–600)

# ═══════════════════════════════════════════════════════════════════════
# 간격 (SPACING) — 8pt grid, 4pt half-step
# ═══════════════════════════════════════════════════════════════════════

const S_1  :=  4
const S_2  :=  8
const S_3  := 12
const S_4  := 16
const S_6  := 24
const S_8  := 32
const S_12 := 48
const S_16 := 64

# ═══════════════════════════════════════════════════════════════════════
# 코너 반경 (RADII)
# ═══════════════════════════════════════════════════════════════════════

const R_XS   :=   2  # chips, tokens
const R_SM   :=   8  # buttons, small pills
const R_MD   :=  12  # inputs, list rows
const R_LG   :=  16  # cards, modals
const R_PILL := 999  # capsule

# ═══════════════════════════════════════════════════════════════════════
# 그림자 (SHADOWS) — "paper-lift" system
# Godot: StyleBoxFlat.shadow_color + shadow_size + shadow_offset
# ═══════════════════════════════════════════════════════════════════════

const SH_SM_COLOR   := Color(0.12, 0.10, 0.09, 0.08)
const SH_SM_SIZE    := 2
const SH_SM_OFFSET  := Vector2(0, 1)

const SH_MD_COLOR   := Color(0.12, 0.10, 0.09, 0.10)
const SH_MD_SIZE    := 12
const SH_MD_OFFSET  := Vector2(0, 4)

const SH_LG_COLOR   := Color(0.12, 0.10, 0.09, 0.14)
const SH_LG_SIZE    := 32
const SH_LG_OFFSET  := Vector2(0, 12)

# ═══════════════════════════════════════════════════════════════════════
# 모션 (MOTION) — easing tokens (seconds)
# ═══════════════════════════════════════════════════════════════════════

const DUR_FAST    := 0.12  # press, hover
const DUR_BASE    := 0.24  # enter / exit
const DUR_SLOW    := 0.48  # celebrations, merges
const EASE_SPRING := Vector2(0.34, 1.56)  # cubic-bezier approx (out-back)
const EASE_OUT    := Vector2(0.2, 0.8)    # cubic-bezier approx (ease-out)


# ═══════════════════════════════════════════════════════════════════════
# HELPERS — 원소별 색 세트 가져오기
# ═══════════════════════════════════════════════════════════════════════

static func element_colors(element: String) -> Dictionary:
	match element:
		"wood":  return {"main": EL_WOOD,  "bg": EL_WOOD_BG,  "fg": EL_WOOD_FG,  "glyph": "🌿", "label": "목"}
		"fire":  return {"main": EL_FIRE,  "bg": EL_FIRE_BG,  "fg": EL_FIRE_FG,  "glyph": "🔥", "label": "화"}
		"earth": return {"main": EL_EARTH, "bg": EL_EARTH_BG, "fg": EL_EARTH_FG, "glyph": "⛰️", "label": "토"}
		"metal": return {"main": EL_METAL, "bg": EL_METAL_BG, "fg": EL_METAL_FG, "glyph": "🪙", "label": "금"}
		"water": return {"main": EL_WATER, "bg": EL_WATER_BG, "fg": EL_WATER_FG, "glyph": "💧", "label": "수"}
		_:       return {"main": ROAST,    "bg": CREAM_WARM,  "fg": INK,         "glyph": "",  "label": ""}
