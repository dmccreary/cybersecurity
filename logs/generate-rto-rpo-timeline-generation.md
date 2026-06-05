# Generation Log: rto-rpo-timeline

- **sim-id:** rto-rpo-timeline
- **Library:** Static SVG with hover tooltips (inline SVG built by JS + tooltip/resize handler)
- **Bloom level / verb:** Understand / Distinguish
- **Learning objective:** Students can distinguish RPO from RTO, state which
  direction in time each measures relative to the incident, and read an example
  RPO/RTO pair for a given system tier.

## Instructional-design decision

The spec is an `infographic-svg`, so "interactive" means hover/tap reveals — not
animation. The dominant misconception this sim targets is students conflating
RPO and RTO. The design therefore anchors both objectives to one red INCIDENT
bar and uses opposite directions (RPO looks left/back, RTO looks right/forward)
and opposite colors (amber vs slate) to make the distinction spatial and
memorable. Tooltips carry the "what it costs the business" detail so the canvas
stays uncluttered.

## Implementation approach

- `main.html`: title, subtitle, an empty `#diagram` host, a static legend with
  the two worked tier examples, and a fixed-position tooltip div.
- `rto-rpo-timeline.js`: carries the `// CANVAS_HEIGHT: 470` comment. Builds the
  SVG in JS so it can switch between a wide horizontal layout and a tall vertical
  layout below 600px container width (a resize listener re-renders only on layout
  change). Two blue callout boxes, amber RPO band, slate RTO band, red incident
  bar drawn last (on top), clock glyphs and point markers at each end.
- Tooltips use both native `<title>` and a JS `data-tip` handler (matches the
  established cia-triad pattern).
- Colors exactly per spec: incident #d84315, RPO #ffa000, RTO #455a64, callouts
  #1565c0 with white text.

## Validation score

- Before: 90 (A) — metadata missing `educational` and `pedagogical` blocks.
- After: 100 (A) — added both blocks.

## Layout review (Claude Vision)

Walked the visual checklist against the 800x472 screenshot. All items PASS or
N/A:

- 1.1/1.2 clipped text: PASS (full margins).
- 1.3 residual strokes: PASS (flat fills).
- 1.4 contrast: PASS (white-on-blue callouts; dark text on amber, white on slate).
- 3.1 title overlap: PASS.
- 3.6 highlight: PASS (red incident bar dominates).
- 4.x color hierarchy: PASS (amber / slate / red / blue, four meaningful colors).
- legend + worked examples: PASS.
- 6.1/6.3 renders, aspect ratio matches: PASS.

**Final state: clean** — 0 cycles of fixes needed.

**Claude Vision model:** Claude Opus 4.8 (1M context), model id claude-opus-4-8[1m].
