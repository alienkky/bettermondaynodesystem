---
name: aliennode
description: Use AlienNode to structure project goals, evidence, references, decisions, agent briefs, and tasks as reusable node canvases, or maintain and integrate the AlienNode runtime. Applies to AlienNode requests and node-based project planning; not generic Node.js development.
---

# AlienNode

Use this workflow when the user requests AlienNode, reusable planning nodes, or a project canvas based on this system. It is a planning and handoff tool; an agent node records a role and does not launch agents or authorize external messages.

## Locate resources

An installed user skill has `references/ARCHITECTURE.md`, `references/REUSE.md`, and a portable runtime in `assets/aliennode/`. Read the architecture for the actual schema and storage behavior, and the reuse guide when integrating a project. In the source repository the equivalent documents live under `docs/`, and the runtime files are at the repository root.

## Apply to a project

- Read the target project's existing instructions and relevant context. Identify the user's outcome, evidence, constraints and chosen decisions; record uncertainty as questions or assumptions.
- Use only the nodes needed. The common flow is goal → constraints/evidence → screen/system → decision → task → output, with risk, metric and feedback where useful.
- Prefer the existing project canvas and brief. For a new canvas, adapt `templates/project-starter.json` in the portable runtime. Keep node IDs unique and edge endpoints valid. Use `sub` for structured descriptions and `body` for note text.
- Give each project a stable unique ID through `AlienNode.html` or `?project=...`. The default project preserves legacy BetterMonday browser data. Export JSON before changing origins or importing over work.
- Save project artifacts to an appropriate project directory, typically `docs/aliennode/`. Generate an Agent Brief from the canvas or produce an equivalent brief grounded in its actual JSON. Include open questions, constraints, decisions, tasks and expected outputs; distinguish assumptions from evidence.
- Implement the user's requested work using the project's conventions, then update results and validation evidence in its canvas/brief. Do not impose the tool's visual theme on the target product.

## Install the runtime when requested

Copy the portable `assets/aliennode/` directory into a suitable target such as `tools/aliennode/`, inspecting an existing destination before merging. Keep adjacent HTML, JS, CSS and fonts together. `npm ci` then `npm start` serves the launcher. Change PORT if needed and export/import browser data across ports. Merge `templates/AGENTS.aliennode.md` into existing project instructions only when persistent project guidance is requested; do not replace existing instructions.

## Maintain AlienNode

Read the source `AGENTS.md`. Edit the four source canvases and shared JS/CSS. Preserve default storage keys, project separation, and existing JSON fields. Keep the previous generated BetterMonday bundle as an archive. Run `npm test` after runtime changes and `npm run package:portable` before refreshing skill assets or Drive snapshots. Drive is a manual snapshot unless the user separately requests synchronization.
