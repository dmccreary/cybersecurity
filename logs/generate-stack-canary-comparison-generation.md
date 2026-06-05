# Generation Log: stack-canary-comparison

- **sim-id:** stack-canary-comparison
- **diagram name:** Stack Frame With and Without a Canary Under Overflow
- **chapter:** 10 — System Security: OS, Memory, and Access Control
- **library:** Static SVG with hover tooltips (inline `<svg>` built in JS + a `.js` carrying the `// CANVAS_HEIGHT:` comment)
- **Bloom level / verb:** Understand / Compare
- **learning objective:** Explain how a stack buffer overflow overwrites the saved return address, compare a stack frame with and without a canary under the same overflow, and articulate why the canary turns a silent compromise into a safe abort.

## Instructional-design decision + rationale

The spec is an `infographic` (Type: infographic, Library: Static SVG with hover
tooltips) at Bloom **Understand**. Per the pipeline's instructional-design rule,
"interactive" for an infographic means **hover/click reveals and view toggles —
not looping animation**. The build therefore uses two static, side-by-side stack
frames with hover/tap tooltips on the load-bearing regions (canary, saved return
address, buffer) rather than any animation. This keeps the cognitive focus on
*comparison* — the single difference between the two frames (a canary row above
the buffer) and the different outcome it produces — which is exactly the
Understand/Compare objective.

## Implementation approach

- Inline `<svg>` drawn programmatically in `stack-canary-comparison.js`; loaded
  from `main.html` which carries the required schema meta tag and a bare
  `<main></main>` with no id.
- Both frames use the standard stack layout: high addresses at top, low at
  bottom, `char buf[16]` at the bottom. A red `strcpy(buf, attacker_input)`
  overflow arrow grows upward beside each frame.
- Left "Without Canary" frame: buffer → saved frame pointer → saved return
  address; red result box "Return → attacker-controlled address. Exploit
  succeeds silently."
- Right "With Canary" frame: an extra green canary row sits between buffer and
  saved frame pointer; green result box "Canary check fails on return → process
  aborts before returning."
- Color legend below (yellow = attacker-writable buffer, green = canary, gray =
  saved frame pointer, dark slate = saved return address).
- **Key behaviors:** hover/tap tooltips on canary, both saved return addresses,
  and both buffers (mouse + touch handlers); responsive — side-by-side at
  ≥800px, stacked vertically below 800px (`render()` re-builds on resize using
  `window.innerWidth < 800`).
- Palette honors the spec: slate-steel return address, green `#4caf50` canary,
  light-yellow buffer, rust/red overflow arrow; brand cream background.
- `// CANVAS_HEIGHT: 392` in the first 10 lines of the JS; `fix-iframe-heights.py`
  resolves the iframe to 394 (CANVAS_HEIGHT + 2). The copy-paste example iframe
  block in index.md also reads 394 (consistent).

## Validation score

- **Before:** (sim already had real files from the interrupted run) — re-ran
  validator.
- **After:** **100 / A** (`validate-sims.py --sim stack-canary-comparison`).
  No gaps reported: schema tag present, `<main>` bare, lesson plan + references +
  embedded screenshot present, metadata fields corrected (creator "Dan McCreary",
  subject ["cybersecurity"], rights CC BY-NC-SA 4.0, completion_status
  "validated").

## Layout review (Claude Vision)

- **Model:** Claude Opus 4.8 (1M context) — `claude-opus-4-8[1m]`.
- Screenshot captured with `bk-capture-screenshot` at the absolute sim dir,
  800×394, then read with the Read tool.

Checklist walk:

- **PASSES (confirmed):** 1.1 (no clipped text — "high addr"/"low addr" and all
  row labels fully visible), 1.3 (SVG flat fills, no stroke halo), 1.4 (white-on-
  slate and dark-on-yellow/green all high contrast), 1.5 (title large, labels
  ≥11px), 3.1 (title centered, no overlap), 3.3 (result-box text contained),
  4.4 (clear color hierarchy backed by a legend), 6.1 (renders), 6.3 (800×394
  matches the declared iframe height).
- **N/A:** 2.x (no p5 control region — SVG infographic), 3.4/3.5 (no axes/grid),
  5.x (no Mermaid/network/chart/map).
- **FAILS:** none.

**Final state: CLEAN.** The rotated `strcpy(buf, attacker_input)` arrow label is
legible and not clipped; both result boxes, the canary row, and the legend all
render within bounds at 394px.
