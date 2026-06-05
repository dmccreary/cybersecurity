# Generation Log: digital-signature-flow

- **sim-id:** digital-signature-flow
- **Library:** Mermaid (flowchart LR with two TB subgraphs)
- **Bloom level/verb:** Understand / Explain
- **Learning objective:** Students will explain the signing path and the
  verification path of a digital signature and distinguish the role of the private
  key (signs) from the public key (verifies).

## Instructional-design decision

The spec is a `workflow-diagram` for conceptual understanding. Bloom: Understand →
hover-reveal of concrete data, no animation. I rendered the two parallel flows
(signer | verifier) as side-by-side Mermaid subgraphs separated by an "across
trust boundary" edge, with a comparison diamond and green/red outcomes. Each node
hover reveals a definition; the info panel statically calls out the public/private
key asymmetry — the single most-confused point.

## Implementation approach

- Two subgraphs ("Signer's machine", "Verifier's machine") at top-level `LR` so
  they sit left/right; each has `direction TB` for its vertical flow. The
  `SEND ==> RECV` thick edge crosses the trust boundary.
- Colors per spec: hash/key ops blue (#1565c0), digests slate (#455a64), signature
  rust orange (#d84315); decision amber; valid green; invalid red.
- Info panel holds the color key, a Key-asymmetry callout, and the hover Step
  Details box. Interaction JS in `digital-signature-flow.js` carries the
  `// CANVAS_HEIGHT` comment and the `waitForMermaid()` hover wiring.
- `subGraphTitleMargin` set per project rule. Responsive single-column below 700px.

## Validation score

- Before: 50 (C) — scaffold.
- After: 100 (A).

## Layout review (Claude Vision, Opus 4.8)

- Cycle 1 FAIL (3.3 panel overflow / clipping): with top-level `flowchart TB`,
  Mermaid stacked the two subgraphs vertically, making the diagram very tall — the
  entire verifier column and the outcomes were clipped below the iframe.
  Fix: changed top-level direction to `LR` so the subgraphs sit side by side; the
  whole diagram (both columns, diamond, green/red outcomes) is now visible.
- Cycle 2: widened the diagram panel 64% -> 70% (and shrank the info panel) to give
  the LR diagram more width, and reduced CANVAS_HEIGHT 600 -> 430 to trim top
  whitespace.
- Residual: node text is small (the LR flow is wide, so `useMaxWidth` scales it
  down) and some top whitespace remains from Mermaid bottom-anchoring. The diagram
  is complete and structurally legible; per-step detail is delivered via hover.
- Final state: **partial** (small node text + minor top whitespace; nothing
  clipped or overlapping).

## Final iframe height

432 (CANVAS_HEIGHT 430 + 2).
