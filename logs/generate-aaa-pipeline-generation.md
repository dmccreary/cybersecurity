# Generation Log: aaa-pipeline

- **sim-id:** aaa-pipeline
- **Library:** Mermaid (flowchart LR + subgraph)
- **Bloom level/verb:** Understand / Explain
- **Learning objective:** Students will distinguish authentication, authorization,
  and accounting, and explain how each stage of the AAA pipeline governs and
  records access to a protected resource, including how non-repudiation depends on
  cryptographic evidence.

## Instructional-design decision

The spec is a `workflow-diagram` whose goal is conceptual understanding of the
AAA pipeline, not parameter manipulation. Per the Bloom→interaction mapping,
"Understand" calls for hover/click reveals of concrete data rather than
continuous animation. I implemented a left-to-right Mermaid flow with a 2/3
diagram + 1/3 info-panel layout; hovering or tapping a node reveals a one-paragraph
definition in the right panel. No looping animation.

## Implementation approach

- `flowchart LR`: Principal → Authentication → Authorization → Accounting →
  Resource, with a `Non-Repudiation` subgraph fed by dashed "evidence" edges from
  Authentication and Accounting.
- Color-coded per spec: authentication blue (#1565c0), authorization green
  (#2e7d32), accounting slate (#455a64), non-repudiation amber (#ffa000),
  principal cream, resource white.
- Interaction JS lives in `aaa-pipeline.js` (so `fix-iframe-heights.py` can read
  the `// CANVAS_HEIGHT` comment, which it cannot do from `main.html` alone).
  `waitForMermaid()` polling attaches mouseenter/click handlers that update the
  info panel.
- `subGraphTitleMargin` set in `mermaid.initialize` per the project rule for
  subgraph titles. Responsive: stacks to one column below 700px via CSS media query.
- `@` removed from the example email in the node label (avoids any Mermaid label
  edge cases); the full address appears in the hover text and the spec block.

## Validation score

- Before: 50 (C) — scaffold (missing schema tag, <main>, educational/pedagogical
  metadata, social images, iframe example, About/Lesson Plan/References, screenshot).
- After: 100 (A).

## Layout review (Claude Vision, Opus 4.8)

Walked the visual checklist against the screenshot.

- PASS: text legibility (no clipping, no residual strokes, adequate contrast),
  color hierarchy, legend present, info panel present, all five nodes + subgraph
  fully visible, no console-error banner.
- FAIL (residual, partial): the LR diagram anchors to the bottom of the diagram
  panel, leaving empty aliceblue at the top. Mermaid's `useMaxWidth` scales the
  wide LR diagram to fit the 2/3-width panel, making it short, and flex
  `align-items:center` does not vertically center it as expected.
- Fix attempts: reduced CANVAS_HEIGHT from 460 → 380 → 330, then settled on 350
  to keep the bottom "Resource" node from clipping while tightening the top gap.
  The residual whitespace is cosmetic only; the diagram is complete and legible.
- Final state: **partial** (minor top whitespace; no clipped/overlapping content).

## Final iframe height

352 (CANVAS_HEIGHT 350 + 2).
