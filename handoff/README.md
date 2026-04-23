# Godot Handoff — DesignTokens.gd

디자인 시스템의 모든 값을 Godot용으로 뽑은 파일입니다.

## 사용법

1. `handoff/DesignTokens.gd` 파일을 프로젝트의 `scripts/ui/DesignTokens.gd` 위치로 복사 (덮어쓰기).
2. 씬에서 참조: `DesignTokens.ACCENT`, `DesignTokens.ROAST`, `DesignTokens.element_colors("fire")` 등.
3. **색만 빠르게 바꾸고 싶을 때** — 파일 상단 BRAND 섹션의 `ACCENT`, `ROAST`, `CREAM` 값만 교체하면 전체 반영.
4. **폰트 파일** — `fonts/Pretendard-*.otf` 9개 weight를 Godot 프로젝트의 `assets/fonts/`에 복사하고 FontVariation 리소스로 등록.

## 토큰 카테고리

| 카테고리 | 프리픽스 | 예시 |
|---|---|---|
| Brand | `ROAST` / `CREAM` / `INK` / `ACCENT` | `DesignTokens.ACCENT` |
| Elements (오행) | `EL_WOOD` / `EL_FIRE` / … + `_BG` / `_FG` | `DesignTokens.EL_FIRE_BG` |
| Currency | `COIN` / `GEM` / `ENERGY` | `DesignTokens.COIN` |
| Board | `BOARD_CELL` / `BOARD_LOCKED` | `DesignTokens.BOARD_CELL` |
| Type | `FS_*` (size) / `W_*` (weight) / `FONT_*` | `DesignTokens.FS_H1` |
| Spacing | `S_1` (4px) … `S_16` (64px) | `DesignTokens.S_4` |
| Radii | `R_XS` / `R_SM` / `R_MD` / `R_LG` / `R_PILL` | `DesignTokens.R_LG` |
| Shadow | `SH_SM_*` / `SH_MD_*` / `SH_LG_*` | `DesignTokens.SH_MD_COLOR` |
| Motion | `DUR_*` / `EASE_*` | `DesignTokens.DUR_BASE` |

## 헬퍼

```gdscript
# 원소별 색 세트 한 번에 가져오기
var colors = DesignTokens.element_colors("fire")
label.modulate = colors.main
chip.color = colors.bg
# → {"main": #C8383C, "bg": #F8DEDF, "fg": #7A1F22, "glyph": "🔥", "label": "화"}
```

## StyleBoxFlat 예시 (카드)

```gdscript
var card := StyleBoxFlat.new()
card.bg_color = DesignTokens.CREAM
card.border_color = DesignTokens.BORDER_CARD
card.border_width_left = 2
card.border_width_right = 2
card.border_width_top = 2
card.border_width_bottom = 2
card.corner_radius_top_left = DesignTokens.R_LG
card.corner_radius_top_right = DesignTokens.R_LG
card.corner_radius_bottom_left = DesignTokens.R_LG
card.corner_radius_bottom_right = DesignTokens.R_LG
card.shadow_color = DesignTokens.SH_MD_COLOR
card.shadow_size = DesignTokens.SH_MD_SIZE
card.shadow_offset = DesignTokens.SH_MD_OFFSET
```

## 업데이트 플로우

외부 디자인 변경이 들어오면:
1. 웹 디자인 시스템의 `colors_and_type.css`를 먼저 업데이트.
2. 이 `DesignTokens.gd`에서 해당 값을 미러링.
3. 둘이 항상 동기화되도록 유지 (한쪽만 바꾸면 디자이너/개발 사이에 drift 발생).
