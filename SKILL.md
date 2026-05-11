---
name: bettermonday-node-design-system
description: Use this skill to work on BetterMonday Node Design System — a general-purpose, designer-facing planning canvas tool that helps designers structure their thinking (nodes, relationships, references, flows) BEFORE handing it to an AI. The tool is a collection of single-file HTML canvases bundled into one deployable HTML. Includes a custom bundler, shared interaction layer, and a single design-token source. Use this skill when modifying any canvas (Reference Canvas, Flow Editor, Flow Diagrams, Scene Tree + Flow Dashboard), the bundle, the design tokens, or the deployment.
user-invocable: true
---

Read `CLAUDE.md` and `README.md` for full context before making changes. They define:

- **What the tool is for**: a pre-AI planning canvas for designers. The user (a designer) sketches structure/relationships/references on a canvas first, then uses that visualization to write better AI prompts. The tool is *not* the artifact; the user's mental clarity is.
- **What this tool is NOT**: a game, a specific product's interface, or an AI-integrated workspace. It is a general-purpose, dumb, fast, single-file canvas. Treat it as such.

## Files in this project

- `BetterMonday 노드 디자인 시스템.html` — the deployable bundle (~13MB single file). Generated, not edited by hand.
- `Reference Canvas.html` — free-form node canvas (drag, group, connect references). Source file.
- `Game Flow Editor.html` — flow diagram editor. Source file.
- `Game Flow Diagrams.html` — flow viewer (read-focused). Source file.
- `Scene Tree + Flow Dashboard.html` — combined structure-tree + flow view. Source file.
- `canvas-interact.js` — shared drag/zoom/connect interaction logic used by canvases.
- `colors_and_type.css` — the single source of truth for design tokens (colors, type scale, spacing, radii, shadows). Always reference these via CSS variables.
- `server.js` — Express static-file server for Railway deployment.

> The `Game ...` prefix on some files is historical naming; the tool is general-purpose.

## When invoked

Decide what kind of work the user wants:

- **Modify a canvas** → edit the relevant source `.html` only. Do NOT touch the bundle.
- **Add a new canvas** → clone the closest existing `.html`, reuse `canvas-interact.js` and `colors_and_type.css`, assign a unique `localStorage` key prefix.
- **Change design tokens** → edit `colors_and_type.css` only. Verify visual regression across canvases.
- **Regenerate the bundle** → operate on the source `.html` files; rebuild the bundle file. After rebuild, run the JSON-integrity check in `CLAUDE.md`.
- **Fix bundle corruption** → see the recovery procedure in `CLAUDE.md` (a real incident: `Unterminated string in JSON at position 83477` was caused by a missing closing `"` in the template JSON).
- **Deployment / server** → `server.js`, `railway.json`, `package.json`. Deployment is Railway, auto-triggered by `git push origin main`.

## Hard rules (do not violate)

1. **Single-file canvases**: every source `.html` must work by double-clicking — no build step, no CDN dependency. Inline libraries.
2. **Design tokens only**: never hard-code colors, font sizes, spacing, or radii. Use the CSS variables from `colors_and_type.css`.
3. **Never edit the bundle by hand**: it is a generated artifact. Direct text edits will break its embedded JSON.
4. **Storage isolation**: each canvas uses a distinct `localStorage` / `IndexedDB` key. Cross-canvas data exchange happens only via JSON export/import.
5. **Stay general-purpose**: do not write code that assumes the canvas content is "a game" or any specific domain. The user's content could be anything.

## When suggesting changes

- Prefer minimal, reversible edits.
- If a feature requires changing the bundle generation, propose updates to the (planned) bundler script rather than editing the bundle file.
- For any visual change, mention which token in `colors_and_type.css` you used (and add a new token only if the user approves).
- For storage schema changes, include forward-compatible migration code (read old shape → write new shape).

## If asked to create artifacts

If the user wants HTML mockups or design exports (not changes to the tool itself), create standalone HTML files that load `colors_and_type.css` and use the token vocabulary. Do not invent new colors or sizes without confirming with the user.

## When the user invokes this skill with no other context

Ask:
1. Which canvas are they working with (or do they want a new one)?
2. Is the change visual, behavioral, structural, or about the bundle/deployment?
3. Will it touch storage shape? (If yes, plan migration up front.)

Then act as a careful collaborator who values the designer's thinking process over feature additions. The tool's job is to stay out of the way.
