# Generation Log: software-assurance-layers

- **sim-id:** software-assurance-layers
- **Library:** p5.js
- **Bloom level/verb:** Understand / Explain
- **Learning objective:** Explain how the three layers of software assurance —
  In-Code Defenses, Analysis Tooling, and Supply Chain — compose to defend a
  system, match each control to its layer, and articulate which layer fails when a
  particular incident occurs.

## Instructional-design decision

Bloom "Understand" + spec type `infographic` → hover-reveal, NOT looping
animation. The concentric-circle geometry is the teaching device: each outer ring
visibly *encloses* the one inside it, communicating "backstop for the layer
within." Hovering a chip reveals its glossary-style definition; hovering a ring
updates the top caption with what that layer protects against. One p5 built-in
control — a **Pin all definitions** checkbox — lets a student freeze every chip
label for study. No sliders/buttons because there is no continuous parameter to
explore at the Understand level.

## Implementation approach

- p5.js sketch: `updateCanvasSize()` first in `setup()`,
  `canvas.parent(document.querySelector('main'))`, built-in `createCheckbox`.
- Three filled circles drawn outer→inner so the inner disc sits on top. Layer
  labels are placed on the top arc of each band; chips are placed on the
  lower/side arcs so they never collide with the labels.
- Inner chips stack vertically inside the blue disc; mid-ring chips spread on a
  200°–340° arc; outer-ring chips spread on a 130°–410° arc.
- Hit-testing: chip rectangles first, then a radial band test for ring hover.
  Tooltip is word-wrapped and clamped to the canvas. Caption box reflects the
  current hover (chip def, ring caption, or pinned state).
- Responsive width via `updateCanvasSize()` (clamped 360–760) with `windowResized`.

## Validation score

- Before: scaffold (boilerplate metadata).
- After: **98 / A** — the documented p5 ceiling (validate-sims.py false-positively
  flags the required `createCheckbox` built-in control as a forbidden DOM
  function; per batch instructions 98 is the A-grade ceiling for compliant p5).

## Layout review (Claude Vision)

- Vision model: Claude Opus 4.8 (1M context) (`claude-opus-4-8[1m]`).
- Cycle 1 (drawHeight 430, tight radii): "Supply Chain" outer label clipped at the
  top edge; inner chips ("Input Validation"/"Output Encoding"/"Parameterized
  Queries") collided with mid-ring chips ("SAST"/"Fuzzing") near the center because
  the rings were too close together.
- Fix: raised drawHeight to 500 (CANVAS_HEIGHT 560), widened the ring gaps
  (rInner .46, rMid .74 of maxR), reserved each ring's top arc for its label and
  pushed chips onto dedicated lower/side arcs, and nudged the center down so the
  outer label clears the canvas top.
- Cycle 2: clean — all three ring labels fully visible, all 10 chips placed in the
  correct ring with no overlap, caption box and checkbox uncllipped.
- **Final state: clean.**
