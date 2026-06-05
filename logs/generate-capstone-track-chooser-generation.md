# Generation Log: capstone-track-chooser

- **sim-id:** capstone-track-chooser
- **Library:** Static SVG (inline `<svg>` + small JS tooltip layer)
- **Bloom level / verb:** Understand / Identify
- **Learning objective:** Given the three capstone tracks, students will identify
  which track's deliverables best match the kind of security work they want to do
  and justify the choice from the deliverable timeline.

## Instructional-design decision

The spec is an `infographic` ("Static SVG with hover tooltips"). Per the pipeline,
"interactive" for an infographic means hover/click reveals and view toggles — not
looping animation. The MicroSim is a static decision tree; the only interaction is
hovering (or tapping) a deliverable to reveal its estimated weeks of effort. This
matches the Understand Bloom level: the learner reads and compares rather than
manipulates a model.

## Implementation approach

- Inline SVG (viewBox 0 0 960 640) that scales to container width, so it reflows
  responsively without a JS resize handler.
- Root question box at top branches via three colored connector paths to three
  branch-choice labels, then down to three deliverable cards.
- Card A (Secure System) uses cybersecurity blue, Card B (Security Program) slate
  steel, Card C (Applied Research) alert amber — matching the spec's branch colors.
  All three cards carry rust-orange (#d84315) accent borders.
- Each deliverable is an SVG `<g class="deliv" data-tip="...">`; CSS highlights the
  box on hover and a small JS layer (capstone-track-chooser.js) shows a positioned
  tooltip with the estimated weeks. Click toggles the tooltip for touch devices.
- Amber card header uses dark text (not white) for contrast on the light amber fill.
- A blue banner across the bottom states all three satisfy ABET Student Outcomes 1-6.
- The CANVAS_HEIGHT comment lives in capstone-track-chooser.js so
  fix-iframe-heights.py can set the iframe height (602px).

## Validation score

- Before (scaffold): not run (placeholder).
- After: **100 / 100 (grade A).**

## Layout review (Claude Vision)

- Model: Claude Opus 4.8 (1M context) vision.
- **Cycle 1:** Walked the checklist. All text fully visible and unclipped
  (including the right amber card title); white-on-blue / white-on-slate /
  dark-on-amber header contrast all pass; three brand colors map cleanly to the
  three branches; deliverable boxes stay inside their rust-bordered cards;
  connectors align; banner legible.
- **FAILs:** none.
- **Final state:** clean (no patch required).
