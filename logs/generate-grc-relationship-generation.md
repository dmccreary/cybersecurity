# Generation Log: grc-relationship

- **sim-id:** grc-relationship
- **Library:** Static SVG with hover tooltips (inline SVG + vanilla JS)
- **Bloom level/verb:** Understand / Distinguish
- **Learning objective:** Students will distinguish governance, risk, and
  compliance as three related but distinct functions, explain what each overlap
  represents, and articulate why an organization can be compliant yet still
  insecure.

## Instructional-design decision

The spec is `infographic-svg`. "Interactive" here means hover/click reveals, not
animation. I built a three-circle Venn (Governance / Risk / Compliance) with a
hover tooltip for each single region, each pairwise overlap, and the central
Security Program. The static caption delivers the key insight ("compliant and still
insecure"). Below 600px the circles reflow to a stacked, labeled layout per spec.

## Implementation approach

- Inline SVG built by JS: three translucent circles in the brand colors
  (governance #1565c0, risk #455a64, compliance #ffa000), region titles +
  sublabels, three overlap labels, and the center "Security Program."
- Tooltips: invisible hotspot circles placed in each distinct region fire a
  mouse-following HTML tooltip (richer than `<title>`); click also fires for touch.
  Tooltip clamps to the viewport.
- `renderStacked()` provides the <600px layout (four labeled bars); a resize
  listener re-renders only when crossing the 600px breakpoint.
- `grc-relationship.js` carries the `// CANVAS_HEIGHT` comment so
  `fix-iframe-heights.py` can size the iframe.

## Validation score

- Before: 50 (C) — scaffold.
- After: 100 (A).

## Layout review (Claude Vision, Opus 4.8)

- Cycle 1 FAIL (1.1 / 3.3): the bottom of the Compliance circle and its
  "COMPLIANCE" label were clipped, and the diagram sat too low with a top whitespace
  band. Cause: the 900x400 viewBox was shorter than the geometry (compliance circle
  bottom reached y=440), so the viewBox itself cropped it; and the iframe height did
  not leave room for the caption.
- Fix: enlarged the viewBox to 900x470, nudged circle centers up and shrank radius
  to 140 so all content fits; switched `preserveAspectRatio` to `xMidYMin` to top-
  align (removing the top whitespace); raised CANVAS_HEIGHT 470 -> 520 to leave room
  for the caption.
- Cycle 2: re-screenshot confirms all three circles, all overlap labels, the center
  label, and the bottom COMPLIANCE label are fully visible and centered.
- Final state: **clean**.

## Final iframe height

522 (CANVAS_HEIGHT 520 + 2).
