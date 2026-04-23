# BetterMonday Coffee Tycoon — Design System

> **베러먼데이커피 타이쿤** · 먼데이 커피 머지 게임
> 캐주얼 타이쿤 + 머지 합성 + 12지신 수집 · Godot 4 · 모바일 9:16 (390×844)

"당신은 베러먼데이커피 매장의 첫 점주다. 손님을 응대하고, 음료를 만들고, 매장을 키운다. 놀다 보면 어느새 베러먼데이가 되어 있다."

---

## What this is

This design system captures the visual, typographic, and brand language of **BetterMonday Coffee Tycoon** — a Korean casual merge-tycoon mobile game developed solo in Godot 4 by 김기영. The game blends three loops: **drag-merge** (7×7 board), **customer service** (12 zodiac characters with 5-element 오행 affinity), and **furniture building** (27-piece shop completion).

Core emotion target: **"뭔가 모으고 키우는 성취감"** — the satisfaction of collecting and growing.

## Sources used

- **GitHub repo** · `alienkky/mondaycoffee-merge-tycoon@main`
  - `CLAUDE.md` — project charter (Korean)
  - `bettermonday-coffee-gdd.md` — Game Design Document v2.4
  - `bettermonday-o2o-technical-design.md` — O2O technical design
  - `resources/data/balance.json` — menus, customers, slimes, elements balance
  - `icon.svg` — Godot default only; no game art in repo yet
- **Note:** The repo is at MVP stage — no finalized sprite art, UI theme, or fonts exist. This design system is grounded in the **written visual direction** in the GDD (3등신 cell-shaded Korean zodiac characters, modern café uniforms, 베먼 brand colors, 단청 accent tones) and extrapolates a complete visual language from those constraints.

## Products represented

One product: the **mobile game** (iOS/Android + HTML5 web build). All UI is portrait 390×844. There is one UI kit: `ui_kits/game/`.

---

## Index

| File / Folder | Purpose |
|---|---|
| `README.md` | This file — brand context, foundations, manifest |
| `SKILL.md` | Agent Skill manifest (Claude Code compatible) |
| `colors_and_type.css` | CSS variables for the full color + type system |
| `fonts/` | Pretendard webfont OTFs (Thin–Black) |
| `assets/` | Logos, zodiac + element + slime icons, textures |
| `preview/` | Design-system preview cards (shown in Design System tab) |
| `ui_kits/game/` | Interactive UI kit — main shop, merge board, character create, etc. |

---

## Content Fundamentals

The game is written primarily in **Korean**, with English as a secondary language for menu items and technical labels. Voice is **warm, low-pressure, slightly whimsical** — a café owner talking to a first-time customer, not a game barking at a player.

### Tone

- **감정 먼저, 설명 나중** — lead with feeling, never explain. "이 손님은 불(火) 성향이에요. 잘 맞으면 특별한 반응이 생겨요!" instead of "+50% tip bonus on matching element."
- **베먼 철학은 안 보이게 녹아있음** — brand philosophy is dissolved, never announced. Level-up popups quietly surface a line from the 8 principles.
- **점주님** (jeomju-nim, "owner") is how NPCs address the player. Not "플레이어", not "user".
- **하나의 감정 목표** — "뭔가 모으고 키우는 성취감." If a line doesn't support *collecting-and-growing*, cut it.

### Casing & punctuation

- Korean body text uses no period at end of short UI strings ("가구를 배치해볼까요"), period on narrative lines ("베러먼데이는 그렇게 시작되었다.").
- English menu names are **Title Case**: "Cafe Latte", "Lemon Ade".
- Numbers for currency use commas: `4,500원`.
- Exclamation marks are reserved for slime dialogue ("저는 아로마 슬라임이에요!") — the player voice stays calm.

### I vs you

- NPCs use **점주님 / {이름}님** when speaking to the player.
- Slime dialogue uses first person + 에요/예요 endings ("음료 품질을 높여드릴게요 ✨").
- Narration during prologue is **third-person omniscient** — "그때 한 사람이 생각했다."

### Emoji & unicode

- **Element icons** use emoji as first-class glyphs: 🌿 목 / 🔥 화 / ⛰️ 토 / 🪙 금 / 💧 수. These are canonical and appear in both UI chrome and copy.
- **Zodiac** uses the 12 animal emoji: 🐀 🐂 🐅 🐇 🐉 🐍 🐎 🐏 🐒 🐓 🐕 🐗.
- **Currency**: 💰 coin, 💙 gem, ☕ 베먼 크레딧.
- **Sparkle ✨** is allowed in slime / reward moments only — never in chrome.
- No smileys, no shrug, no 🔥-as-enthusiasm. Emoji are semantic tokens, not decoration.

### Example strings

> "점주님, 안녕하세요! 베러먼데이에 오신 걸 환영합니다."
> "이제 가구를 배치해서 상점을 하나씩 완성해볼까요?"
> "상품은 '작업실'에서 재료를 합쳐서 만들 수 있어요."
> "{이름}님이 없는 동안 손님 12명이 다녀갔어요."
> "🔥 공명! 같은 원소의 손님이에요."

---

## Visual Foundations

The GDD specifies a distinct aesthetic: **3등신 셀쉐이딩 2D 한국 캐릭터**, modern café uniforms (shirt + apron, beige/navy), toned-down Korean color palette (먹색 ink-black + 단청 temple-painting accents), K-drama miniature feel. References: 펭귄 베이커리, 빵빵이의 일상, Animal Crossing, Persona 5 cell-shading.

### Color vibe

**Warm, grounded, Korean-modern.** Think roasted espresso + aged oak + temple-red accent + one single cold blue (water element / gem currency) to keep the palette from going too brown. **Not** the typical coffee-app "brown gradient" trope — colors are **flat and paper-like**, never glossy. Imagery leans **warm-neutral with slight grain**, never blue-cool, never pure B&W.

### Colors

Anchor token is **Roast Brown `#6B3F2A`** (espresso) paired with **Cream `#F7EFE2`** (latte foam / oat milk) as the two workhorses. Accents:

- **Dancheong Red `#C8383C`** — 단청 temple red, used for alerts / fire element / rush hour.
- **Celadon `#6ABF45` / `#3E7A4E`** — 청자 celadon, wood element / success.
- **Ink `#1F1A17`** — 먹색, text + strong borders.
- **Sky `#8FB8D6`** — water element / gem currency / cold accents.
- **Gold `#D4A64A`** — coin, resonance highlight.

See `colors_and_type.css` for the full token set including semantic mappings.

### Type

Single family, Korean + Latin:

- **Pretendard** — all UI chrome, body, dialogue, numbers. Weights 400 / 500 / 600 / 700 / 800 / 900 loaded as local OTF files.

Display numbers and titles use Pretendard 800 with tight tracking (−0.02em). Body is 500. Buttons 700 + 1pt letter-spacing. Dialogue is 500–600 at 15–20px with −0.005 to −0.01em tracking for a warm, grounded feel without resorting to handwriting.

### Spacing

8pt grid. Mobile tap targets ≥ 44px. Card padding 16px, section padding 24px, safe-area bottom 32px for the nav bar.

### Backgrounds

- **Main shop** — isometric aerial view, soft paper texture, warm ambient light (not full-bleed photograph).
- **Merge board** — flat cream surface with subtle grid ruled in Roast Brown at 12% opacity. No gradient.
- **Dialog / prologue** — sepia paper texture with ink-pen vignette, a nod to 1950s Korean newsreel title cards.
- **Modal / overlay** — Ink at 72% opacity, no blur (Godot mobile perf), rounded 16px card underneath.

We do **not** use:
- Bluish-purple gradients (forbidden)
- Glassmorphism / heavy blur
- Generic "coffee shop photo" hero backgrounds
- Neon or high-saturation gradients

### Animation

**Calm, bouncy, short.** Nothing over 320ms for UI. Entry/exit uses `cubic-bezier(0.34, 1.56, 0.64, 1)` (mild overshoot). Coin pops use scale + opacity, 180ms. Merge fusion uses a single sparkle burst + scale pulse. Element reactions get a one-shot ring (황금 resonance / 초록 synergy / 붉은 challenge / 흰빛 harmony) — each ~400ms, no loops. No idle-breathing on chrome; only characters idle-bob.

### Hover states (web build only)

- Primary buttons: brightness 1.05, no color change.
- Cards: Roast Brown border fades in at 60% opacity.
- Icons: scale 1.05.

### Press states

- Shrink to 0.96 scale, 80ms spring.
- Buttons add a 2px inset-shadow bottom (pressed physical feel).
- No color change on press — too twitchy for mobile.

### Borders

Two border widths only: **1px** (hairlines between list rows) and **2px** (card / button outlines). Border color is always the card's fg at 18% opacity, or `--ink` at 12% for neutrals. Occasionally 3px Dancheong Red on alert banners.

### Shadows

One shadow system — "paper-lift":
- **sm** · `0 1px 2px rgba(31, 26, 23, 0.08)` — list rows
- **md** · `0 4px 12px rgba(31, 26, 23, 0.10)` — cards, popovers
- **lg** · `0 12px 32px rgba(31, 26, 23, 0.14)` — modals, furniture-unlock celebration

No neon glow. No inset shadows except the press state. No double-shadow tricks.

### Protection / capsule

Text over imagery uses a **solid Cream capsule** (not a gradient scrim). Capsules are 999px radius, 4–6px padding, subtle `md` shadow. This is more honest than a gradient protection and reads instantly at mobile sizes.

### Transparency & blur

- Used sparingly. Modal backdrop only. No backdrop-filter blur (Godot mobile perf).
- Element ring effects use 40% opacity additive layers for the burst, but the element icon itself is always 100%.

### Imagery mood

Warm, handcrafted, slight paper grain. If we had illustrated backgrounds, they'd feel like **Studio Ghibli interiors crossed with 1960s Korean 만화방 (manga cafe) prints**. Not photorealistic. Not kawaii. Not vector-clean. Warm neutrals + one pop of 단청 red.

### Corner radii

- **2px** — tokens, element chips (reads as "technical")
- **8px** — buttons, small cards
- **16px** — main cards, modals
- **999px** — capsules (currency pills, element badges)

### Card anatomy

Cards are **Cream-filled**, 16px radius, 2px Ink-12% border, `md` shadow. Card header uses Pretendard 800 at 18px in Roast. Card body uses Pretendard 500 at 14px in Ink. Interactive cards gain a 3px Dancheong Red left-stripe when selected (this IS an approved use of colored-stripe — it's a state, not a static decoration).

### Layout rules

- Top HUD is fixed 56px — level, energy, coin, gem — single row.
- Bottom nav is fixed 72px with safe-area padding — Shop / Workshop / Collection / Menu.
- Everything else scrolls within the middle zone.
- Modal sheets rise from the bottom on mobile, center on web.

---

## Iconography

The repo ships **no custom icon set**. For this design system we adopt a layered approach matching the GDD's "flat cell-shaded" direction:

- **Primary system** — **Lucide** via CDN for UI chrome (back arrows, settings, X-close, menu, chevrons, coin/gem pills). 2px stroke, 24px base. This is a **substitution** — the repo has no icon font yet. Flag to creator for review.
- **Element icons (오행)** — Unicode emoji (🌿 🔥 ⛰️ 🪙 💧). These are canonical per the GDD and balance.json, not a substitution.
- **Zodiac icons (12지신)** — Unicode emoji (🐀 🐂 🐅 🐇 🐉 🐍 🐎 🐏 🐒 🐓 🐕 🐗) as MVP placeholder. Final version will be 3등신 셀쉐이딩 portraits — commissioned art per the GDD (400–600만원 budget).
- **Slime icons** — Custom flat SVG stored in `assets/slimes/` — generated from the 5 slime color tokens in `balance.json` (aroma/creamy/bubble/caramel/matcha). These are authored here since the repo is at color-box placeholder stage.
- **Currency** — Emoji (💰 coin, 💙 gem, ☕ credit) match the GDD voice. In high-fidelity chrome we also have custom SVG coin/gem tokens in `assets/currency/`.

**Usage rules:**
- Never mix icon styles in one component. Chrome uses Lucide only; copy uses emoji only.
- Emoji are rendered at 1.2em in running text, 24px in chips.
- Icon color in chrome defaults to `--fg-2` (Ink-60%); active state snaps to `--brand`.

---

## Notes & substitutions

**Flagged for user review:**

1. **Fonts** — Pretendard 9-weight (Thin–Black) is the only UI typeface, loaded as local OTF files uploaded by the user. Dialogue uses Pretendard 500–600 rather than a handwriting face per brand direction.
2. **Icon system** — Lucide via CDN, chosen as the closest match to the GDD's "flat, modern, Korean-café" direction. If the final game uses a bespoke icon set or another library, please point me at it.
3. **Zodiac portraits** — Emoji placeholders used per the GDD's own MVP guidance ("MVP는 색깔 박스 + 띠 라벨로 기능 검증"). Final illustrated assets are out of scope here.
4. **Logo** — No brand mark exists in the repo. A wordmark + typographic logo treatment is authored in `assets/logo/` as a starting point, not a final identity.
