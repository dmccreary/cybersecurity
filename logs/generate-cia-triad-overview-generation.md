# Generation Log: cia-triad-overview

- **sim-id:** cia-triad-overview
- **Library:** Static SVG with hover tooltips (inline SVG + HTML cards, vanilla JS)
- **Bloom level/verb:** Understand / describe
- **Learning objective:** Students can describe the three CIA properties and
  match an example threat and control to the property each affects.

## Instructional-design decision

`infographic-svg` spec → hover/tap reveals, no animation. The triangle anchors
the three properties around a shared "Information Asset"; the per-property cards
add the Analyze-adjacent threat↔control pairing the spec asks for. Kept it to one
threat and one control per property to avoid cognitive overload, matching the
spec exactly.

## Implementation approach

- Triangle rendered as a single inline `<svg>` with three blue vertex circles
  (C/I/A), property-name labels, and "Information Asset" centered. Each vertex
  group carries a `data-tip` so hovering shows the property definition.
- Below the triangle, a CSS grid of three cards (one per property), each with a
  red **Threat** box and green **Control** box drawn from the spec's exact text.
- Tooltip is a follow-the-cursor div (also fires on touchstart). Responsive: the
  card grid collapses to a single column below 600px (per spec).
- Colors: cybersecurity blue triangle, white background, slate text; red/green
  accents on the threat/control rows.

## Validation score

- Before (scaffold): not run.
- After: **100 / 100 (A).**

## Layout review (Claude Vision)

- **Model used:** Claude Opus 4.8 (1M context) vision pass.
- Cycle 1: clean on first capture. Triangle, vertex labels, centered
  "Information Asset", and all three threat/control cards render with complete
  text and good contrast; no clipping or overlap inside `<main>`. The only pixel
  touching the crop edge is the standard "Back to Documentation" footer link,
  which sits outside `<main>` and is intentionally minimal.
- **Final state:** clean.
