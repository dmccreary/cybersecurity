# Generation Log: auth-mechanism-comparison

- **sim-id:** auth-mechanism-comparison
- **Library:** p5.js
- **Bloom level/verb:** Evaluate / Judge
- **Learning objective:** Students will judge the appropriate authentication
  mechanism for a given threat model and user population, and justify the choice
  using phishing resistance, usability, and account-recovery cost as criteria.

## Instructional-design decision

The spec explicitly states Bloom: Evaluating. Per the Bloom→interaction mapping,
"Evaluate" wants sort/rank/compare. I built a ranked horizontal-bar comparison
infographic (seven mechanisms, three criteria each) with two evaluative toggles:
a threat-model dropdown that re-scores phishing resistance, and an audience
dropdown that highlights recommended mechanisms. The interaction is hover-reveal
plus dropdown toggles — no looping animation, matching an infographic spec.

## Implementation approach

- Data-driven: a `mechanisms` array holds per-mechanism scores; phishing
  resistance is keyed by threat model so toggling the dropdown re-scores only that
  axis (the others are stable), which is the pedagogical point.
- Three bars per row (phishing / usability / recovery ease) on a traffic-light
  scale via `scoreColor()`; value printed to the right of each bar.
- Row hover detection highlights the row band and draws a wrapped tooltip with the
  mechanism's strengths, weaknesses, and a deployment story; tooltip is clamped to
  the drawing region so it never spills off-canvas.
- Recommended mechanisms get a green left accent + "recommended" sublabel when an
  audience is chosen.
- Built-in `createSelect()` controls only; `updateCanvasSize()` first in setup();
  canvas parented to `document.querySelector('main')`; width-responsive via
  `windowResized()`; controls repositioned each frame in `layoutControls()`.

## Validation score

- Before: 50 (C) — scaffold.
- After: 98 (A). The 2-point deduction is a known false positive: the validator
  flags `createSelect()` as a "DOM function", but project standards require p5
  built-in controls (createSelect is sanctioned). No fix warranted.

## Layout review (Claude Vision, Opus 4.8)

Walked the visual checklist against the screenshot (default state, opportunistic
threat model, no audience filter).

- PASS: 1.1–1.5 (all text complete, no residual strokes, good contrast, ≥11px
  labels); 2.1–2.7 (both dropdowns sit in the white control band with clear
  "Threat:" / "Audience:" labels, no overlap, nothing past edges); 3.1–3.6 (title
  centered with threat subtitle, value labels clear of the right edge, bar tracks
  contained); 4.1–4.4 (aliceblue draw region, white control region, traffic-light
  legend, blue title drives the eye); 5.3 (legend present); 6.1–6.3.
- FAILs: none.
- Final state: **clean**.

## Final iframe height

562 (CANVAS_HEIGHT 560 + 2).
