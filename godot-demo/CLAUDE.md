# BetterMonday — Godot 4.x 프로젝트

> Claude Code가 이 프로젝트에서 일할 때 항상 읽어야 할 규칙과 컨텍스트.
> 모든 UI 작업은 이 문서의 규칙을 따른다. 어기면 리뷰에서 전부 반려.

---

## 프로젝트 개요

**BetterMonday** — "한국의 미 × 오행 슬라임 × 카페 경영" 모바일 캐주얼 시뮬레이션.

- **엔진**: Godot 4.x (GDScript)
- **타겟**: iOS / Android (세로 모드)
- **장르**: 카페 경영 + 머지 + 수집
- **테마**: 단청, 고려청자, 한지 질감의 따뜻한 색감 + 오행 오브 시스템

---

## 폴더 구조

```
res://
├── autoload/              # 싱글턴 (GameState, SaveLoad, AudioBus)
├── scripts/
│   ├── ui/
│   │   └── DesignTokens.gd    # ⭐ 모든 디자인 토큰의 단일 출처
│   ├── systems/               # 게임 시스템 (merge, order, affinity)
│   └── tools/                 # 에디터 툴 스크립트
├── scenes/
│   ├── main/                  # Main, Prologue, CharacterCreate
│   ├── shop/                  # ShopScene + 하위 HUD
│   ├── workshop/              # 머지 보드
│   ├── dex/                   # 도감
│   ├── settings/              # 설정
│   └── modals/                # LevelUp, Reward, Confirm 등
├── assets/
│   ├── sprites/               # PNG 스프라이트
│   ├── fonts/                 # ttf / otf
│   └── audio/                 # ogg
├── resources/
│   └── theme/default.tres     # Godot Theme (DesignTokens에서 생성)
└── docs/
    └── design/
        ├── tokens.md          # 사람이 읽는 토큰 레퍼런스
        └── colors_and_type.css # 웹 프리뷰 (Godot은 안 씀)
```

---

## 🔒 디자인 시스템 규칙 (절대 준수)

### 1. 색은 반드시 `DesignTokens` 상수만 사용

❌ **금지**
```gdscript
$Label.add_theme_color_override("font_color", Color("C8383C"))
$Panel.modulate = Color(0.78, 0.22, 0.23)
var bg = Color.from_string("#6B3F2A", Color.WHITE)
```

✅ **올바름**
```gdscript
$Label.add_theme_color_override("font_color", DesignTokens.ACCENT)
$Panel.modulate = DesignTokens.ROAST
```

### 2. 오행 관련 UI는 헬퍼 함수 사용

❌ **금지**
```gdscript
if element == "fire":
    label.modulate = Color("C8383C")
elif element == "water":
    label.modulate = Color("3F7CA8")
```

✅ **올바름**
```gdscript
var c = DesignTokens.element_colors(element)
label.modulate = c.main
bg_panel.modulate = c.bg
fg_label.add_theme_color_override("font_color", c.fg)
glyph_label.text = c.glyph
```

### 3. 폰트 크기는 타이포 스케일 사용

❌ **금지**
```gdscript
label.add_theme_font_size_override("font_size", 14)
label.add_theme_font_size_override("font_size", 28)
```

✅ **올바름**
```gdscript
label.add_theme_font_size_override("font_size", DesignTokens.TS_BODY)
title.add_theme_font_size_override("font_size", DesignTokens.TS_TITLE)
hero.add_theme_font_size_override("font_size", DesignTokens.TS_HERO)
```

### 4. 간격·반경·그림자도 토큰 사용

❌ **금지**
```gdscript
vbox.add_theme_constant_override("separation", 12)
panel_sb.corner_radius_top_left = 16
```

✅ **올바름**
```gdscript
vbox.add_theme_constant_override("separation", DesignTokens.SP_3)
panel_sb.corner_radius_top_left = DesignTokens.R_LG
```

### 5. 새 색이 필요하면 먼저 토큰 추가

한 번도 쓴 적 없는 색이 필요하다면:
1. 사용자에게 먼저 물어본다 ("이 색을 디자인 시스템에 추가해도 될까요?")
2. 승인되면 `DesignTokens.gd`에 상수 추가
3. 그 다음 그 상수를 참조해서 사용

**절대** 시나리오 파일 안에서 raw Color() 만들어 쓰지 말 것.

---

## 🛠 커밋 전 체크리스트

모든 커밋 전에 스스로 실행:

```bash
# 1. 하드코딩된 Color 리터럴 찾기
grep -rn 'Color("' scenes/ scripts/ | grep -v DesignTokens.gd

# 2. 하드코딩된 font_size 찾기
grep -rn 'font_size.*=.*[0-9]' scenes/ scripts/ | grep -v DesignTokens.gd

# 3. 매직 넘버 간격 찾기
grep -rn 'separation.*=.*[0-9]' scenes/ scripts/ | grep -v DesignTokens.gd
```

→ 결과가 나오면 DesignTokens 참조로 교체.

---

## 📋 작업 패턴

### 패턴 A — 씬 하나 리팩터

"@scenes/shop/Shop.tscn 와 @scripts/shop/Shop.gd 의 색·폰트·간격을
DesignTokens 상수로 전부 교체해줘. 바꾸기 전에 raw 값 목록을 먼저 보여줘."

### 패턴 B — 새 UI 컴포넌트

1. 와이어프레임/요구사항 확인
2. `scripts/ui/<컴포넌트>.gd` 생성
3. `_ready()` 안에서 모든 스타일을 DesignTokens 참조로 바인딩
4. `tokens.md` 확인해서 어떤 토큰이 가장 의미에 맞는지 선택
5. 완성 후 커밋 전 체크리스트 실행

### 패턴 C — Theme 리소스 빌더

Godot의 `Theme` 리소스는 에디터에서 수동 편집하면 토큰 참조가 깨짐.
대신 `scripts/tools/build_theme.gd` 에디터 툴 스크립트로
DesignTokens → Theme 을 코드로 생성:

```gdscript
@tool
extends EditorScript

func _run():
    var theme = Theme.new()
    theme.set_color("font_color", "Label", DesignTokens.INK)
    theme.set_color("font_color", "Button", DesignTokens.ROAST)
    theme.set_constant("separation", "VBoxContainer", DesignTokens.SP_3)
    # ... 모든 기본 컨트롤 바인딩
    ResourceSaver.save(theme, "res://resources/theme/default.tres")
```

토큰이 바뀔 때마다 이 스크립트 재실행.

### 패턴 D — 오디오/이펙트

모션 토큰도 사용:
```gdscript
tween.tween_property(node, "scale", Vector2.ONE, DesignTokens.D_FAST)
    .set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
```

---

## 🚫 자주 저지르는 실수

| 실수 | 올바른 방법 |
|---|---|
| `.tscn` 파일 안에서 색 직접 편집 | 코드로 `_ready()`에서 바인딩 |
| DesignTokens 상수를 변수에 복사해놓고 그 변수만 여기저기 씀 | 원본 상수를 계속 참조 (디버깅 용이) |
| 오행 색을 if/else로 하드코딩 | `element_colors()` 헬퍼 사용 |
| 새 색이 필요해서 그냥 추가해버림 | 먼저 사용자에게 확인 |
| "일단 임시로" 매직넘버 쓰고 TODO | 처음부터 토큰 쓰기. 없으면 추가 후 쓰기 |

---

## 🎯 Claude Code에게 작업 지시할 때 좋은 프롬프트 예시

```
@scripts/shop/Shop.gd 파일에서 하드코딩된 색상과 폰트 크기를
찾아서 목록으로 보여줘. 그 다음 DesignTokens 상수 중 어떤 게
가장 의미상 맞는지 매핑 제안해줘. 내가 승인하면 교체 실행.
```

```
OrderSlot이라는 새 UI 컴포넌트를 scripts/ui/OrderSlot.gd 에 만들어줘.
- HBoxContainer 기반
- 자식: CustomerIcon (TextureRect), OrderLabel (Label), TimerBar (ProgressBar)
- 색, 폰트, 간격 전부 DesignTokens 참조
- 주문 원소(fire/water/...)에 따라 element_colors() 헬퍼로 테두리 색 바꿈
- 타이머 종료 임박 시 D_FAST duration으로 shake 애니메이션
```

```
프로젝트 전체를 훑어서 Color() 리터럴이나 font_size 매직 넘버가
남아있는 파일 리스트를 docs/design/audit.md 로 저장해줘.
각 항목에 파일:줄번호:원본값 포함.
```

---

## 토큰 퀵 레퍼런스

상세는 `docs/design/tokens.md` 참조.

**브랜드**: `ROAST`, `ROAST_DEEP`, `CREAM`, `CREAM_WARM`, `INK`, `ACCENT`, `PAPER`
**오행**: `EL_WOOD`, `EL_FIRE`, `EL_EARTH`, `EL_METAL`, `EL_WATER` (+`_BG`, `_FG`)
**화폐**: `COIN`, `GEM`, `ENERGY`
**보드**: `BOARD_CELL`, `BOARD_LOCKED`, `BOARD_HILITE`
**타이포**: `TS_CAPTION`, `TS_BODY`, `TS_TITLE`, `TS_HERO`
**간격**: `SP_1`..`SP_6` (4·8·12·16·24·32)
**반경**: `R_SM`, `R_MD`, `R_LG`, `R_XL`, `R_PILL`
**모션**: `D_FAST`, `D_MED`, `D_SLOW` (초 단위)

**헬퍼**: `DesignTokens.element_colors("fire" | "water" | "wood" | "metal" | "earth")`
→ `{main, bg, fg, glyph, label}` 딕셔너리 반환

---

_이 문서를 수정할 때는 팀 전체에 공지. Claude Code는 매 세션 시작 시 이 파일을 다시 읽는다._
