---
name: bettermonday-coffee-design
description: Use this skill to generate well-branded interfaces and assets for BetterMonday Coffee Tycoon (베러먼데이커피 타이쿤) — a Korean casual merge-tycoon mobile game. Contains essential design guidelines, the warm coffee + 단청 color system, the 5-element (오행) tokens, 12-zodiac usage patterns, Pretendard (9-weight, no handwriting faces) typography, slime and currency SVG assets, and a full UI kit for prototyping shop / merge-board / character-create screens.
user-invocable: true
---

Read the `README.md` file within this skill for the full brand context, content fundamentals, and visual foundations. Then explore the other available files:

- `colors_and_type.css` — all design tokens as CSS variables (colors, type scale, spacing, radii, shadows, motion).
- `fonts/` — Pretendard OTF files (brand font, 9 weights).
- `assets/` — logo marks, element SVGs (목/화/토/금/수), slime SVGs (5 types), currency SVGs (coin / gem / energy).
- `preview/` — individual preview cards, each demonstrating one slice of the system (colors, type scale, chips, buttons, merge board, dialogue, etc).
- `ui_kits/game/` — a working React prototype with 5 screens (prologue, character create, shop, merge board, dex). Start here when recreating real gameplay screens.

If creating visual artifacts (slides, mocks, throwaway prototypes, shop-flow designs), copy assets out and create static HTML files for the user to view. Always load `colors_and_type.css` and use tokens — never hard-code colors or sizes.

If working on production code (the Godot game itself), copy the brand colors/type tokens into the game's Theme resource, keep the 5-element semantic color pairings (wood=green, fire=red, earth=clay, metal=gold, water=blue), and respect the emoji-as-semantic-token rule.

**Key principles to preserve in every output:**
- Emotion target is "뭔가 모으고 키우는 성취감" (the satisfaction of collecting and growing).
- Korean first, English second; NPCs address the player as "점주님".
- Warm, grounded palette — Roast Brown + Cream + single Dancheong Red accent. No bluish-purple gradients. No glassmorphism.
- Element icons 🌿🔥⛰️🪙💧 and zodiac 🐀🐂🐅🐇🐉🐍🐎🐏🐒🐓🐕🐗 are canonical emoji — do not redraw.
- Slime icons and currency are custom SVG; element/zodiac are emoji.
- Paper-lift shadow system. 2/8/16/999 radii. 8pt grid. No inset shadows except press state.

If the user invokes this skill without any other guidance, ask them what they want to build or design (a new screen? a marketing slide? a product card?), ask some clarifying questions about scope and audience, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
