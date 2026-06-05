# Generation Log: purdue-model-attack-paths

- **sim-id:** purdue-model-attack-paths
- **Library:** Static SVG with hover tooltips (inline SVG built/re-rendered by JS)
- **Chapter:** 16 — Emerging Topics and Capstone
- **Bloom level / verb:** Understand / Trace
- **Learning objective:** Identify the six Purdue levels and the IT/OT boundary,
  trace three real ICS attacks through those levels, and name the specific
  control that failed in each.

## Instructional-design decision

The spec is an `infographic`. "Interactive" means hover/click reveals (and here,
per-path toggles), not animation. I built a vertical stack of six Purdue level
bands (Level 5 enterprise at top → Level 0 physical at bottom), a thick amber
dashed IT/OT boundary between Level 4 and Level 3, Level 3 highlighted with a
thick border, and three colored attack arrows descending through the levels each
touched. Hovering a band shows its role; hovering an arrow shows how the attack
moved and the control that failed at each hop; buttons isolate a single path.

## Implementation approach

- `main.html`: schema meta tag, bare `<main>`, a control row of path-toggle
  buttons, a `#diagram` container (SVG injected by JS so the resize handler and
  toggles can re-render), and a tip box.
- `purdue-model-attack-paths.js`: `// CANVAS_HEIGHT:` comment, the level + attack
  data model, an SVG builder (bands, dashed boundary with label, per-path arrows
  with markers and waypoint dots, a per-path entry tag and bottom legend), and
  hover/click/leave + button wiring with a `resize` listener.
- Colors per spec: Level 5/4 blue (#1565c0 / #1e88e5), Level 3/2/1 slate
  (#37474f / #546e7a / #455a64), Level 0 rust (#d84315), IT/OT boundary amber
  (#ffa000). Attacks in three distinct reds/purples for separability.
- Attack hops match the spec: Stuxnet L3→L1→L0, Colonial L5→L4→L3, Oldsmar
  L2→L1→L0.

## Validation

- validate-sims.py: **100 (A)** on the first run.

## Layout review (Claude Vision)

- **Cycle 1 (height 642):** FAIL 1.1 / text overlap — the three full entry labels
  ("USB drive", "VPN credential", "TeamViewer") were stacked at the same y on
  lanes only 28px apart and overlapped into an unreadable blob; the tip box was
  also slightly clipped at the bottom.
- **Fixes:** widened the lane gap (28→48px) and the viewBox, replaced the long
  entry labels with short non-colliding tags (USB / VPN / RDP) above each lane,
  added a per-path color legend at the bottom mapping color → attack name + full
  entry point, raised `top` for headroom, and capped the SVG max-height (500px)
  so title + controls + diagram + tip all fit in 640.
- **Cycle 2 (height 642):** all six levels, the labeled IT/OT boundary, three
  correctly-routed attack arrows with distinct colors and entry tags, the legend,
  and the tip box all fully visible and legible; colors exactly per spec.
  **Final state: clean.**

Claude Vision model used: Claude Opus 4.8 (1M context).
