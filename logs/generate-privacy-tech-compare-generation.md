# Generation Log: privacy-tech-compare

- **sim-id:** privacy-tech-compare
- **Library:** Static SVG with hover tooltips
- **Bloom level/verb:** Analyze / Compare
- **Learning objective:** Students will compare four privacy-enhancing technologies
  (FHE, MPC, DP, ZKP) across the same six fields and select the appropriate technique
  for a given privacy requirement, justifying the choice with the input/output
  visibility and cost dimensions.

## Instructional-design decision

An `infographic-svg` spec built for direct comparison → Bloom Analyze, realized as a
2x2 grid of identically-structured cards (same six fields) so the four techniques can
be read across. Interaction is hover/tap tooltips with the real-world example plus a
footer "when to reach for which" band that ties each technique to the question it
answers.

## Implementation approach

- Inline SVG (fixed viewBox, scales to container). Four cards in a 2x2 grid, each
  with: blue title on a light header band, italic one-line definition, "inputs
  visible to" / "outputs visible to" rows, a 1–5 cost bar rendered as five segments
  with a rust→gold gradient (filled count = the cost), and a maturity label. Each
  card is a hot region with a hover/tap tooltip containing the deployment example.
- An amber footer band lists one "reach for X when …" line per technique.
- The `.js` carries the CANVAS_HEIGHT comment.

## Validation score

- Before: scaffold.
- After: 100 (A).

## Layout review (Claude Vision, Opus 4.8)

- Cycle 1 FAIL: the cost bars did not render — only the "n / 5" text showed. Cause:
  the bar `<rect>`s were appended directly to the `<svg>` *before* each card's group
  (with its white body rect) was appended, so the later card body painted over the
  bars (draw-order bug).
- Fix: append the cost-bar rects to the card's own group `g` (drawn after the body),
  not to the root svg; also removed a dead `lines` variable.
- Cycle 2: cost bars render correctly (FHE 5/5, MPC 3/5, DP 1/5, ZKP 4/5) with the
  rust→gold gradient; all six fields legible on every card; footer band complete;
  good contrast; no overlap or clipping. Tightened CANVAS_HEIGHT 560→525 to remove
  bottom whitespace, re-ran fix-iframe-heights (→527), synced the example iframe.
- Final state: **clean.**

## Final iframe height

527 (CANVAS_HEIGHT 525 + 2). Copy-paste example iframe also set to 527.
