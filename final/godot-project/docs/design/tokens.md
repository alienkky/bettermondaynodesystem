# Tokens Reference — BetterMonday Coffee Tycoon

All design tokens as a flat table. Source of truth for both `colors_and_type.css` (web) and `scripts/ui/DesignTokens.gd` (Godot). Update both files when a value changes.

## Brand

| Token | Value | Usage |
|---|---|---|
| `ROAST` | `#6B3F2A` | Primary brand · headers · primary buttons |
| `ROAST_DEEP` | `#4A2A1C` | Pressed state · deep headers |
| `CREAM` | `#F7EFE2` | Cards · surfaces |
| `CREAM_WARM` | `#EFE3CC` | Sunken areas · input bg |
| `PAPER` | `#FAF5EC` | App background |
| `INK` | `#1F1A17` | Primary text |
| `ACCENT` | `#C8383C` | 단청 red · CTA · fire element · live state |

## Neutrals

| Token | Value | Usage |
|---|---|---|
| `FG_1` | `#1F1A17` | Titles |
| `FG_2` | `#5A4E46` | Body secondary |
| `FG_3` | `#8B7F76` | Tertiary · timestamps |
| `BORDER_CARD` | `#E3D5BE` | Card border |
| `BORDER_HAIR` | `#EAE0CE` | Hairline divider |
| `BG_SUNKEN` | `#EFE3CC` | Inset areas |

## 오행 (5 Elements)

| Element | Main | BG (soft chip) | FG (text on BG) | Glyph |
|---|---|---|---|---|
| 목 Wood | `#4E9A30` | `#E3F3DA` | `#2E5A1E` | 🌿 |
| 화 Fire | `#C8383C` | `#F8DEDF` | `#7A1F22` | 🔥 |
| 토 Earth | `#B8823A` | `#F0E4D3` | `#6B4A22` | ⛰️ |
| 금 Metal | `#D4A64A` | `#F8EED2` | `#7A5E14` | 🪙 |
| 수 Water | `#3F7CA8` | `#DCEBF5` | `#2C5A82` | 💧 |

## Currency & Status

| Token | Value | Usage |
|---|---|---|
| `COIN` | `#D4A64A` | 코인 |
| `GEM` | `#7AA4C8` | 보석 |
| `ENERGY` | `#E28A2B` | 에너지 |
| `SUCCESS` | `#4E9A30` | Positive feedback |
| `WARNING` | `#E28A2B` | Caution |
| `DANGER` | `#C8383C` | Destructive · time critical |
| `INFO` | `#3F7CA8` | Neutral info |

## Board Cells

| Token | Value | Usage |
|---|---|---|
| `BOARD_CELL` | `#F3E8D2` | Unlocked merge cell |
| `BOARD_LOCKED` | `#C9B896` | Locked merge cell (dim) |
| `BOARD_HILITE` | `#FFF2C2` | Drop target · merge flash |

## Type

| Token | Value | Usage |
|---|---|---|
| `FONT_SANS` | Pretendard | All UI |
| `FONT_MONO` | JetBrains Mono | Numerics · debug |

### Weights
400 Regular · 500 Medium · 600 SemiBold · 700 Bold · 800 ExtraBold

### Sizes (px @ 1x mobile)

| Token | Size | Usage |
|---|---|---|
| `FS_DISPLAY` | 34 | Title screen · chapter header |
| `FS_H1` | 24 | Scene title |
| `FS_H2` | 20 | Section header |
| `FS_H3` | 17 | Card title |
| `FS_BODY` | 15 | Body |
| `FS_LABEL` | 13 | Label |
| `FS_CAPTION` | 11 | Caption · timer |
| `FS_DIALOGUE` | 15 | Dialogue body (Pretendard 500–600) |

## Spacing (8pt grid, 4pt half-step)

| Token | Value |
|---|---|
| `S_1` | 4 |
| `S_2` | 8 |
| `S_3` | 12 |
| `S_4` | 16 |
| `S_6` | 24 |
| `S_8` | 32 |
| `S_12` | 48 |
| `S_16` | 64 |

## Radii

| Token | Value | Usage |
|---|---|---|
| `R_XS` | 2 | Chips · tokens |
| `R_SM` | 8 | Buttons · small pills |
| `R_MD` | 12 | Inputs · list rows |
| `R_LG` | 16 | Cards · modals |
| `R_PILL` | 999 | Capsule |

## Shadows (paper-lift)

| Token | Color | Size | Offset |
|---|---|---|---|
| `SH_SM` | rgba(31,26,23,0.08) | 2 | 0 1 |
| `SH_MD` | rgba(31,26,23,0.10) | 12 | 0 4 |
| `SH_LG` | rgba(31,26,23,0.14) | 32 | 0 12 |

## Motion

| Token | Value | Usage |
|---|---|---|
| `DUR_FAST` | 0.12s | Press · hover |
| `DUR_BASE` | 0.24s | Enter · exit |
| `DUR_SLOW` | 0.48s | Celebrations · merges |
| `EASE_SPRING` | (0.34, 1.56) | Playful pop (out-back) |
| `EASE_OUT` | (0.2, 0.8) | Standard ease-out |

---

## Sync rule

**When a token changes, update BOTH files:**
1. `colors_and_type.css` (web design system)
2. `scripts/ui/DesignTokens.gd` (Godot)

Drift between the two causes designer/developer handoff bugs. Prefer updating this `tokens.md` alongside.
