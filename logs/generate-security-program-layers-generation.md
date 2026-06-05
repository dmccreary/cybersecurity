# Generation Log: security-program-layers

- **sim-id:** security-program-layers
- **Library:** Static SVG with hover tooltips (inline `<svg>` + vanilla JS)
- **Bloom level/verb:** Understand / Explain
- **Learning objective:** Identify the four layers of an organizational security
  program and who owns each, and explain how metrics flow up while strategy and
  policy flow down.

## Instructional-design decision

Bloom "Understand" + spec type `infographic-svg` → interaction is hover/tap
reveals, NOT animation. The diagram itself carries the structure; tooltips add
the one-sentence scope per layer. The bands are drawn as a pyramid (narrowest
Board at top, widest Foundations at bottom) so the "every layer rests on the one
below" idea is spatial, not just stated. Two labeled side arrows make the up/down
information-flow concrete and are themselves hoverable.

## Implementation approach

- Inline SVG built in JS with a fixed `viewBox` scaled to the container. Four
  hoverable bands (Board & CEO, CISO, Security Functions container, Foundations)
  plus four hoverable function sub-boxes (Risk & Compliance, Security Engineering,
  SOC, GRC & Audit) and two hoverable arrows.
- Tooltip is a fixed-position `<div>` that follows the pointer and flips to stay
  on-screen (same pattern as the project's other SVG sims).
- Responsive: a `resize` handler re-renders; below 600px the four function boxes
  stack vertically (`stack` branch).
- Palette: slate `#455a64` (board), cybersecurity blue `#1565c0` (CISO),
  lighter blue functions, cream `#fff8e1`-family foundations, green up-arrow
  `#2e7d32`, rust-orange down-arrow `#d84315`.

## Validation score

- Before: scaffold (boilerplate metadata).
- After: **100 / A** (validate-sims.py).

## Layout review (Claude Vision)

- Vision model: Claude Opus 4.8 (1M context) (`claude-opus-4-8[1m]`).
- Cycle 1 (`xMidYMid`, VH 520): large empty band between the subtitle and the
  stack; the diagram floated low because the viewBox aspect was wider than the
  host, so vertical centering letterboxed the top.
- Cycle 2 (VH 575, taller bands): Foundations band clipped at the bottom and top
  gap persisted — vertical centering was fighting the content.
- Fix: switched `preserveAspectRatio` to **`xMidYMin meet`** (top-align, the same
  trick kernel-user-boundary uses), set VH to 530 to tightly bound the content
  (Board…Foundations + caption), and synced the iframe height to 537.
- Cycle 3: clean — full pyramid visible top-to-bottom, caption fully shown, both
  side arrows run the full height with legible rotated labels, no clipping, clear
  color hierarchy.
- **Final state: clean.**
