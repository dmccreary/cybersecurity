# Generation Log: threat-actor-matrix

- **sim-id:** threat-actor-matrix
- **diagram name:** Threat Actor Capability Matrix
- **chapter:** 2 — Threats, Vulnerabilities, and Security Controls
- **library:** Static SVG with hover tooltips (inline `<svg>` built in JS; a `.js`
  carries the `// CANVAS_HEIGHT:` comment and all draw/tooltip logic)
- **Bloom level / verb:** Analyze / Compare
- **learning objective:** Place common threat actor types on a Skill vs. Resources
  matrix, compare them by motivation, time horizon, and example incidents, and
  explain why insiders are an off-axis threat that bypasses the perimeter by design.

## Instructional-design decision + rationale

The spec is `infographic-svg` (a 2D scatter plot) with no stated Bloom level. The
task is fundamentally **comparative** — students reason across two dimensions
(skill, resources) plus a third encoded channel (circle size = campaign duration)
to relate five actor types. That is Bloom **Analyze**. Per the pipeline's
instructional-design rule, "interactive" for an infographic means hover/click
reveals, not animation: each actor circle reveals motivation, time horizon, and
example incidents on hover/tap. No looping animation — the static spatial layout
*is* the comparison, and the reveals add depth without distracting from it.

## Implementation approach

- Built from the placeholder scaffold. New `main.html` (schema meta tag, bare
  `<main></main>`, loads `threat-actor-matrix.js`) and a full inline-SVG sketch.
- **Plot:** Resources (x) vs. Skill (y) with dashed quadrant midlines, axis lines
  with arrowheads, and low/high markers on both axes.
- **Four plotted actors** placed by skill/resource profile: script kiddies
  (lower-left, blue, smallest), hacktivists (mid-left, green), cybercriminals
  (mid-right, orange), nation-state/APTs (upper-right, red, largest). **Circle
  radius encodes typical campaign duration** (minutes → years).
- **Insiders** are deliberately drawn OFF the skill/resources axes as a slate-steel
  bubble in the right margin with a dashed callout arrow and the annotation
  "bypasses perimeter by design" — faithful to the spec's "special placement."
- **Hover/tap tooltips** (mouse + touch) plus native SVG `<title>` elements for
  every actor, giving motivation, time horizon, and real example incidents
  (Stuxnet/SolarWinds for APTs, ransomware for criminals, Snowden for insiders).
- **Size legend** along the bottom maps circle size to duration (minutes/days/
  months/years).
- Responsive: a `narrow` branch (`window.innerWidth < 640`) uses a taller, tighter
  viewBox; rebuilds on resize.
- Honors the spec palette (#1565c0, green, #fb8c00, #455a64, #c62828) on a neutral
  white background.

## Validation score

- **Before:** scaffold (placeholder "Not Yet Implemented", boilerplate metadata —
  creator "Dementia Education Project", subject "dementia", no lesson plan/refs/
  screenshot).
- **After:** **100 / A**. Fixed metadata (creator "Dan McCreary", subject
  ["cybersecurity"], rights CC BY-NC-SA 4.0, Bloom Analyze/Compare,
  completion_status "validated"); added About / Lesson Plan / References /
  embedded screenshot; schema tag + bare `<main>` present.

## Layout review (Claude Vision)

- **Model:** Claude Opus 4.8 (1M context) — `claude-opus-4-8[1m]`.
- Screenshots captured with `bk-capture-screenshot` at the absolute sim dir, read
  with the Read tool. **3 review cycles.**

**Cycle 1 (FAIL — 6.3 / 3.3 bottom clip):** The SVG used a wide viewBox
(920×460) with `xMidYMid meet`, so it letterboxed: large top whitespace, and the
x-axis "Resources" label, the size legend, AND the "Script kiddies" bubble were all
clipped below the visible iframe. Tried matching the viewBox to the host's runtime
`clientHeight` — still clipped (timing of `clientHeight` at capture was unreliable).

**Cycle 2 (FAIL — same):** `preserveAspectRatio:none` + host-measured viewBox
removed the top whitespace but the bottom legend/x-label/script-kiddies were still
below the fold. Root cause: the SVG rendered taller than the visible iframe area.

**Cycle 3 (CLEAN):** Switched to a **fixed, top-anchored viewBox** (776×458,
`xMinYMin meet`) and raised CANVAS_HEIGHT 480 → 540 (iframe 542). At the textbook's
~776px host width the scale is ≈1, so the full 458-unit height fits inside the
available host height. ALL content now lives within the viewBox — no runtime
measurement needed. Re-ran fix-iframe-heights (482 → 542) and synced the copy-paste
example block.

Final checklist walk on cycle-3 screenshot:
- **PASSES:** 1.1 (no clipped text — all axis/actor/legend labels complete), 1.3
  (SVG flat fills), 1.4 (high contrast throughout), 1.5 (title large, labels ≥10.5px),
  3.1 (title centered, no overlap), 3.3 (no panel overflow — legend + insider callout
  fully inside bounds), 4.4 (clear color hierarchy with a size legend), 6.1 (renders),
  6.3 (800×542 screenshot, all content visible top-to-bottom).
- **N/A:** 2.x (no p5 control region), 3.4 (numeric ticks intentionally omitted —
  qualitative low/high axes), 5.x (no Mermaid/network/chart/map).
- **FAILS:** none remaining.

**Final state: CLEAN** after 3 cycles.
